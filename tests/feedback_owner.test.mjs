import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const html=read("feedback-owner.html");
const css=read("feedback-owner.css");
const js=read("feedback-owner.js");
const relay=read("supabase/functions/lumiose-atlas-owner-reports/index.ts");
const unchangedFeedback=read("feedback.js");
const originalRelay=read("supabase/functions/lumiose-atlas-feedback-github/index.ts");

for(const id of ["ownerLogin","ownerEmail","ownerPassword","signIn","loginPanel","reportsPanel",
                  "reportList","reportTotal","loadMore","signOut","ownerStatus"]) {
  assert.ok(html.includes('id="'+id+'"'),"Missing owner viewer control: "+id);
}
assert.match(html,/name="robots" content="noindex, nofollow, noarchive"/);
assert.match(html,/connect-src https:\/\/xzxqfrvqdgkzwujbkdbk\.supabase\.co/);
assert.match(html,/script-src 'self'/);
assert.match(html,/<script src="feedback-owner\.js" defer><\/script>/);
assert.match(html,/href="index\.html#walkthrough"/);
assert.match(css,/@media\(max-width:480px\)/);
assert.match(css,/min-height:44px/);
assert.doesNotMatch(js+relay+html,/service_role|sb_secret_|SUPABASE_SERVICE_ROLE_KEY|CREATE POLICY|DROP TABLE/i);
assert.doesNotMatch(js,/localStorage|sessionStorage|indexedDB|document\.cookie|innerHTML|outerHTML|eval\(/);
assert.doesNotMatch(relay,/\b(?:INSERT|UPDATE|DELETE|UPSERT)\b|\/rest\/v1\/atlas_reports|sb_profiles|sb_secret_/i);
assert.match(js,/sb_publishable_/);
assert.match(js,/\/auth\/v1\/token\?grant_type=password/);
assert.match(js,/\/functions\/v1\/lumiose-atlas-owner-reports/);
assert.match(relay,/\/functions\/v1\/lumiose-atlas-feedback/);
assert.match(relay,/admin_reports/);
assert.match(unchangedFeedback,/lumiose-atlas-feedback-github/);
assert.match(originalRelay,/method: "POST"/);

// Exercise the read-only server gateway in a mocked Edge Function environment.
let handler;
let upstreamStatus=200,upstreamData,called;
const example=[{
  id:13,created_at:"2026-11-20T22:59:04Z",category:"missing",
  page:"/walkthrough",details:"The missing route should explain the hidden wall.",
  internal_only:"NEVER_RETURN"
},{
  id:14,created_at:"2026-11-20T23:08:46Z",category:"missing",
  page:"/#walkthrough",details:"Player report about a mission step."
}];
upstreamData={reports:example,total:2,offset:0};
let calls=0;
const upstreamFetch=async (url, options)=>{
  calls++;called={url,options};
  return {status:upstreamStatus,ok:upstreamStatus===200,
    async json(){return upstreamData;}};
};
runInNewContext(relay,{
  Deno:{serve(fn){handler=fn;}},
  Headers,Response,Request,URL,AbortSignal,
  fetch:upstreamFetch
});
assert.equal(typeof handler,"function","Deno.serve must register one handler");
const allowed="https://trevieisking.github.io";
const jwt="a".repeat(160);
const req=(method="GET",origin=allowed,authorization="Bearer "+jwt,path="?offset=0")=>
  new Request("https://xzxqfrvqdgkzwujbkdbk.supabase.co/functions/v1/lumiose-atlas-owner-reports"+path,{
    method,headers:{"origin":origin,"authorization":authorization}
  });
const bad=await handler(req("GET","https://untrusted.example"));
assert.equal(bad.status,403);
assert.equal(bad.headers.get("access-control-allow-origin"),null);
assert.equal(calls,0,"Blocked origins cannot reach upstream");
const pre=await handler(req("OPTIONS"));
assert.equal(pre.status,204);
assert.equal(pre.headers.get("access-control-allow-origin"),allowed);
assert.match(pre.headers.get("access-control-allow-headers"),/authorization/);
assert.match(pre.headers.get("access-control-allow-methods"),/GET/);
const noAuth=await handler(req("GET",allowed,""));
assert.equal(noAuth.status,401);
assert.equal(calls,0,"No JWT cannot reach upstream");
const wrongMethod=await handler(req("POST"));
assert.equal(wrongMethod.status,405);
const wrongOffset=await handler(req("GET",allowed,"Bearer "+jwt,"?offset=-1"));
assert.equal(wrongOffset.status,400);
assert.equal(calls,0);
const wrongRoute=await handler(req("GET",allowed,"Bearer "+jwt,"?view=feedback"));
assert.equal(wrongRoute.status,400);
const valid=await handler(req());
assert.equal(valid.status,200);
assert.equal(valid.headers.get("content-type"),"application/json; charset=utf-8");
assert.equal(valid.headers.get("cache-control"),"no-store");
assert.equal(valid.headers.get("access-control-allow-origin"),allowed);
const data=await valid.json();
assert.equal(data.total,2);
assert.equal(data.reports.length,2);
assert.equal(data.reports[0].id,13);
assert.equal(data.reports[0].internal_only,undefined,"Only the five listed report fields may be returned");
assert.equal(calls,1);
const forwarded=new URL(called.url);
assert.equal(forwarded.searchParams.get("view"),"admin_reports");
assert.equal(forwarded.searchParams.get("offset"),"0");
assert.equal(called.options.method,"GET");
assert.equal(called.options.headers.authorization,"Bearer "+jwt);
assert.equal(called.options.headers.origin,undefined);
upstreamStatus=403;
const rejected=await handler(req());
assert.equal(rejected.status,403);
assert.equal((await rejected.json()).reports,undefined);
upstreamStatus=401;
const expired=await handler(req());
assert.equal(expired.status,401);
upstreamStatus=500;
const failed=await handler(req());
assert.equal(failed.status,502);
upstreamStatus=200;
upstreamData={bad:1};
const invalid=await handler(req());
assert.equal(invalid.status,502);
upstreamData={reports:example,total:2,offset:0};

// A mock DOM exercises login -> owner-only reports -> sign-out.
function element(){
 const classes=new Set();
 return {
  value:"",textContent:"",className:"",hidden:false,disabled:false,children:[],events:{},
  addEventListener(name,fn){this.events[name]=fn;},
  append(...nodes){this.children.push(...nodes);},
  replaceChildren(...nodes){this.children=[...nodes];},
  classList:{add(k){classes.add(k)},remove(k){classes.delete(k)},contains(k){return classes.has(k)}}
 };
}
const ids={};
for(const id of ["ownerLogin","ownerEmail","ownerPassword","signIn","loginPanel","reportsPanel",
                  "reportList","reportTotal","loadMore","signOut","ownerStatus"])ids[id]=element();
ids.reportsPanel.hidden=true;
ids.loadMore.hidden=true;
ids.ownerEmail.value="owner@example.test";
ids.ownerPassword.value="not-a-real-password";
let authMode="ok",reportMode="ok",authCalls=0,reportCalls=0;
const captured=[];
const browserFetch=async (url,options)=>{
  captured.push({url,options});
  if(url.includes("/auth/v1/token")){
    authCalls++;
    return {status:authMode==="ok"?200:400,async json(){return authMode==="ok"?{access_token:jwt,refresh_token:"not-kept"}:{error:"invalid_grant"};}};
  }
  if(url.includes("lumiose-atlas-owner-reports")){
    reportCalls++;
    return {status:reportMode==="ok"?200:403,async json(){return reportMode==="ok"?{
      reports:[{...example[0],details:'<script>alert("XSS")</script>'},example[1]],total:2,offset:0
    }:{error:"owner only"};}};
  }
  throw Error("Unexpected network request");
};
const document={
 getElementById(id){assert.ok(ids[id],"Unknown DOM id "+id);return ids[id];},
 createElement(tag){const e=element();e.tagName=tag;return e;}
};
runInNewContext(js,{document,fetch:browserFetch,Date,Number,String,Error});
const loginEvent={preventDefault(){}};
await ids.ownerLogin.events.submit(loginEvent);
assert.equal(authCalls,1);
assert.equal(reportCalls,1);
assert.equal(ids.reportsPanel.hidden,false,"Successful owner should see panel");
assert.equal(ids.loginPanel.hidden,true);
assert.equal(ids.ownerPassword.value,"","Never keep password after sign-in");
assert.equal(ids.reportList.children.length,2);
assert.equal(ids.reportTotal.textContent,"2 saved reports");
assert.equal(ids.reportList.children[0].children[2].textContent,'<script>alert("XSS")</script>');
assert.equal(ids.loadMore.hidden,true);
assert.match(ids.ownerStatus.textContent,/Reports loaded securely/);
const authRequest=captured[0];
assert.match(authRequest.url,/\/auth\/v1\/token\?grant_type=password/);
assert.equal(authRequest.options.method,"POST");
assert.ok(authRequest.options.headers.apikey.startsWith("sb_publishable_"));
assert.equal(JSON.parse(authRequest.options.body).email,"owner@example.test");
const reportRequest=captured[1];
assert.match(reportRequest.url,/lumiose-atlas-owner-reports\?offset=0/);
assert.equal(reportRequest.options.headers.Authorization,"Bearer "+jwt);
assert.equal(reportRequest.options.method,"GET");
ids.signOut.events.click();
assert.equal(ids.reportsPanel.hidden,true);
assert.equal(ids.loginPanel.hidden,false);
assert.equal(ids.reportList.children.length,0);
assert.equal(ids.ownerEmail.value,"");
assert.match(ids.ownerStatus.textContent,/Signed out/);

// A signed-in but non-owner account is denied by the existing upstream check.
ids.ownerEmail.value="different@example.test";
ids.ownerPassword.value="non-owner-password";
reportMode="deny";
await ids.ownerLogin.events.submit(loginEvent);
assert.equal(ids.reportsPanel.hidden,true);
assert.match(ids.ownerStatus.textContent,/not authorised/);
assert.equal(ids.ownerPassword.value,"");
authMode="deny";reportMode="ok";
ids.ownerPassword.value="wrong";
await ids.ownerLogin.events.submit(loginEvent);
assert.match(ids.ownerStatus.textContent,/Could not sign in/);
assert.equal(ids.signIn.disabled,false);
console.log("PASS: Supabase raw-HTML workaround uses separate owner-only read relay; browser sign-in, CORS, JWT, denial, XSS safety and no stored credentials verified.");
