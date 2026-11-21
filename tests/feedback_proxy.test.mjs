// Test the Edge relay in a sandbox: mock Deno.serve and upstream fetch.
// No real network or Supabase database activity takes place.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const source = readFileSync(new URL('../supabase/functions/lumiose-atlas-feedback-github/index.ts',import.meta.url),'utf8');
const endpoint = 'https://xzxqfrvqdgkzwujbkdbk.supabase.co/functions/v1/lumiose-atlas-feedback-github';
const origin = 'https://trevieisking.github.io';
let handler;
const forwarded = [];
let simulateUpstreamFailure = false;
runInNewContext(source,{
  Deno: {serve(fn){handler=fn;}},
  Headers,Response,Request,AbortSignal,Set,
  fetch: async (url,options)=>{
    forwarded.push({url,options});
    assert.equal(url,'https://xzxqfrvqdgkzwujbkdbk.supabase.co/functions/v1/lumiose-atlas-feedback');
    assert.equal(options.method,'POST');
    assert.equal(options.headers['content-type'],'application/json');
    assert.equal(options.headers.authorization,undefined);
    if(simulateUpstreamFailure)return new Response('{"error":"Unavailable"}',{status:503});
    return new Response('{"saved":true,"message":"Saved"}',{status:201,headers:{'content-type':'application/json'}});
  }
});
assert.equal(typeof handler,'function');
const make = (method,headers={},body)=>{
  const opts={method,headers:{origin,...headers}};
  if(body!==undefined)opts.body=body;
  return new Request(endpoint,opts);
};
const preflight=await handler(make('OPTIONS',{'Access-Control-Request-Method':'POST'}));
assert.equal(preflight.status,204);
assert.equal(preflight.headers.get('access-control-allow-origin'),origin);
assert.match(preflight.headers.get('access-control-allow-methods'),/POST/);
assert.equal((await handler(make('GET'))).status,405);
const denied=await handler(new Request(endpoint,{method:'POST',headers:{origin:'https://attacker.invalid','content-type':'application/json'},body:'{}'}));
assert.equal(denied.status,403);
assert.equal(denied.headers.get('access-control-allow-origin'),null);
const badPage={kind:'report',page:'https://not-local.test/',category:'missing',details:'Some valid explanation',honey:''};
const invalid=await handler(make('POST',{'content-type':'application/json'},JSON.stringify(badPage)));
assert.equal(invalid.status,400);
const bot=await handler(make('POST',{'content-type':'application/json'},JSON.stringify({...badPage,page:'/lumiose-atlas-pokemon-za/index.html#walkthrough',honey:'spam'})));
assert.equal(bot.status,400);
const wrongType=await handler(make('POST',{'content-type':'text/plain'},'hello'));
assert.equal(wrongType.status,415);
assert.equal(forwarded.length,0,'Invalid requests must not hit existing production writer');
const valid={kind:'report',page:'/lumiose-atlas-pokemon-za/index.html#walkthrough',category:'incorrect',details:'An example of a valid user comment',honey:''};
const ok=await handler(make('POST',{'content-type':'application/json'},JSON.stringify(valid)));
assert.equal(ok.status,201);
assert.equal(ok.headers.get('access-control-allow-origin'),origin);
assert.equal((await ok.json()).saved,true);
assert.equal(forwarded.length,1);
assert.deepEqual(JSON.parse(forwarded[0].options.body),valid);
simulateUpstreamFailure=true;
const unavailable=await handler(make('POST',{'content-type':'application/json'},JSON.stringify(valid)));
assert.equal(unavailable.status,502);
assert.doesNotMatch(source,/Deno\.env\.get\(|SUPABASE_SERVICE_ROLE_KEY/);
console.log('Relay checks pass: restricted origin, preflight, validation, upstream receipt and no keys.');
