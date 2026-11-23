import assert from "node:assert/strict";
import {readFileSync,readdirSync,existsSync} from "node:fs";
import {fileURLToPath} from "node:url";
import path from "node:path";
import {test} from "node:test";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=name=>readFileSync(path.join(root,name),"utf8");
const pages=readdirSync(root).filter(name=>/\.html$/i.test(name)).sort();
const source=read("src/template.html");
const home=read("index.html");
const pageIds=new Map();
const pageLinks=new Map();

function attrValues(source,attribute){
  const regex=new RegExp("\\b"+attribute+"=(?:\"([^\"]*)\"|'([^']*)')","gi");
  return [...source.matchAll(regex)].map(m=>m[1]??m[2]);
}
function unescapeUrl(value){return value.replace(/&amp;/g,"&");}
function safeDecode(raw){try{return decodeURIComponent(raw)}catch{return raw}}

for(const name of pages){
  const html=read(name);
  const ids=attrValues(html,"id");
  const unique=new Set(ids);
  assert.equal(unique.size,ids.length,name+" contains duplicate DOM IDs and ambiguous deep links");
  pageIds.set(name,unique);
  pageLinks.set(name,attrValues(html,"href").map(unescapeUrl));
}

test("AT-275: the deployed guide is not mislabelled a preview",()=>{
  const before="Reconstruction preview · saved guide content";
  const after="Independent recovered guide · saved guide content";
  assert.ok(!source.includes(before)&&!home.includes(before),
    "The live Edition B cannot still claim to be a preview");
  assert.equal(source.split(after).length,2,"Template requires one truthful edition label");
  assert.equal(home.split(after).length,2,"Compiled homepage requires the same label");
  assert.match(source,/href="coverage\.html">Coverage and known gaps<\/a>/);
  assert.match(home,/href="coverage\.html">Coverage and known gaps<\/a>/);
  assert.ok(existsSync(path.join(root,"RECOVERY_STATUS.md")),
    "The original technical recovery archive must not be removed");
});

test("AT-275: generated homepage is byte-exact across all 17 preserved source sections",()=>{
  let generated=source;
  const slots=[...source.matchAll(/<!--\s*SECTION:([a-z0-9_-]+)\s*-->/g)];
  assert.equal(slots.length,17,"All original source sections must remain in the template");
  for(const match of slots)generated=generated.replace(match[0],read("src/sections/"+match[1]+".html"));
  assert.equal(home,generated,"No data, progress IDs, map controls or recovered content may disappear");
  assert.equal((home.match(/class="mission"/g)||[]).length,42);
  assert.equal((home.match(/data-side-check=/g)||[]).length,203);
});

test("AT-275: every published HTML page's local href and fragment resolves",()=>{
  assert.ok(pages.length>=24,"A previously published player-facing HTML route was removed");
  let checked=0,crossPage=0,homeDeepLinks=0;
  for(const [from,hrefs] of pageLinks){
    for(const href of hrefs){
      if(/^(?:https?:|mailto:|tel:|data:|blob:|\/\/)/i.test(href))continue;
      assert.ok(!/\.md(?:[?#]|$)/i.test(href),
        from+" links players to raw Markdown instead of an HTML guide: "+href);
      assert.ok(href&&!/^javascript:/i.test(href),
        from+" includes an empty or nonworking player link: "+href);
      const [withoutHash,fragment=""]=href.split("#");
      const file=safeDecode(withoutHash.split("?")[0])||from;
      const target=path.posix.normalize(file);
      assert.ok(target!==".."&&!target.startsWith("../")&&!target.startsWith("/"),
        from+" links outside its static player-guide root: "+href);
      const destination=path.join(root,target);
      assert.ok(existsSync(destination),from+" links to a missing local route: "+href);
      checked++;
      if(!fragment)continue;
      const id=safeDecode(fragment);
      if(!/\.html$/i.test(target))continue;
      const anchorIds=pageIds.get(target);
      assert.ok(anchorIds,from+" targets an unscanned HTML document: "+href);
      if(target==="index.html"&&id.includes(":")){
        const colon=id.indexOf(":");
        const section=id.slice(0,colon),subtarget=id.slice(colon+1);
        assert.ok(anchorIds.has(section)&&anchorIds.has(subtarget),
          from+" uses a nonexistent main-guide view or target: "+href);
        homeDeepLinks++;
      }else{
        assert.ok(anchorIds.has(id),from+" points to a missing destination ID: "+href);
      }
      if(target!==from)crossPage++;
    }
  }
  assert.ok(checked>2100,"Unexpectedly few published player links were scanned: "+checked);
  assert.ok(crossPage>600,"Cross-page deep-link audit unexpectedly lost coverage: "+crossPage);
  assert.ok(homeDeepLinks>150,"The mission/deep-link routes were unexpectedly lost");
  console.log("Sitewide link graph verified",JSON.stringify({pages:pages.length,checked,crossPage,homeDeepLinks}));
});
