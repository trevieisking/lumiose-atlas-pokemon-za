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


test("AT-276: all 68 original homepage shortcuts now point to verified live section IDs",()=>{
  const walkthrough=read("src/sections/walkthrough.html");
  const dimension=read("src/sections/dimension.html");
  const secrets=read("src/sections/secrets.html");
  const starters=read("src/sections/starters.html");
  const sectors=pageIds.get("sector-maps.html");
  const journey=pageIds.get("journey.html");
  const royale=pageIds.get("royale-guide.html");
  const bosses=pageIds.get("boss-guide.html");
  const shops=pageIds.get("shops.html");
  const homeIds=pageIds.get("home-connection.html");
  for(let n=1;n<=20;n++){
    const href='href="sector-maps.html#wildzone-'+n+'"';
    assert.ok(walkthrough.includes(href)&&home.includes(href),"Missing Wild Zone route "+n);
    assert.ok(sectors.has("wildzone-"+n),"No actual zone directory target "+n);
  }
  const zoneLinks=[...walkthrough.matchAll(/href="sector-maps\.html#wildzone-(\d+)"/g)];
  assert.equal(zoneLinks.length,20,"All 20 Wild Zone links must survive");
  const dlcLinks=[...dimension.matchAll(/href="journey\.html#journey-dlc-(\d+)"/g)];
  assert.equal(dlcLinks.length,20,"Preserve 20 DLC chapter links covering 14 unique missions");
  assert.equal(new Set(dlcLinks.map(m=>m[1])).size,14);
  for(let n=1;n<=14;n++){
    assert.ok(journey.has("journey-dlc-"+n),"DLC Journey destination missing "+n);
    assert.ok(home.includes('href="journey.html#journey-dlc-'+n+'"'));
  }
  const rankMap={y:1,x:2,w:3,v:4,e:6,d:7,c:8,b:9,a:10};
  const rankLinks=[...walkthrough.matchAll(/href="royale-guide\.html#royale-match-(\d+)"/g)];
  assert.equal(rankLinks.length,9,"Preserve all nine referenced promotion shortcuts");
  for(const n of Object.values(rankMap))assert.ok(royale.has("royale-match-"+n));
  const bossLinks=[...walkthrough.matchAll(/href="boss-guide\.html#boss-(\d{2})"/g)];
  assert.equal(bossLinks.length,16,"Preserve all sixteen referenced Rogue Mega boss cards");
  for(let n=1;n<=16;n++)assert.ok(bosses.has("boss-"+String(n).padStart(2,"0")));
  for(const target of ["shop-directory","colorful-screws"]){
    assert.ok(shops.has(target)&&secrets.includes('href="shops.html#'+target+'"'));
    assert.ok(home.includes('href="shops.html#'+target+'"'));
  }
  assert.ok(homeIds.has("alpha-starters"));
  assert.ok(starters.includes('href="home-connection.html#alpha-starters"'));
  assert.ok(home.includes('href="home-connection.html#alpha-starters"'));
  const stale=/href="(?:journey\.html#(?:zone|hyper)-\d+|royale-guide\.html#rank-[a-z]+|boss-guide\.html#boss-[a-z]+|shops\.html#(?:vendors|racine)|home-connection\.html#claim)"/;
  for(const [name,markup] of [["generated home",home],["walkthrough source",walkthrough],
    ["DLC source",dimension],["secrets source",secrets],["starters source",starters]])
    assert.doesNotMatch(markup,stale,name+" still contains a dead legacy shortcut");
});
