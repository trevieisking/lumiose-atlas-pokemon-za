import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const html=readFileSync(new URL('../feedback.html',import.meta.url),'utf8');
const js=readFileSync(new URL('../feedback.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../feedback.css',import.meta.url),'utf8');
for(const id of ['feedbackForm','page','category','details','honey','send','status','returnLink','headerBack']){
  assert.ok(html.includes('id="'+id+'"'), 'Missing form control: '+id);
}
assert.match(html,/<script src="feedback\.js" defer><\/script>/);
assert.match(html,/<link rel="stylesheet" href="feedback\.css">/);
assert.match(html,/name="category" required/);
assert.match(html,/name="details" minlength="10" maxlength="1500"/);
assert.match(html,/connect-src https:\/\/xzxqfrvqdgkzwujbkdbk\.supabase\.co/);
assert.match(css,/max-width:480px/);
assert.doesNotMatch(html+js+css,/SUPABASE_SERVICE_ROLE_KEY|sb_secret_|SECRET\s*=/);

const elements={};
for(const id of ['feedbackForm','page','category','details','honey','send','status','returnLink','headerBack']) elements[id]={value:'',className:'',textContent:'',href:'',disabled:false};
elements.details.value='A guide step that appears to be wrong.';
elements.category.value='incorrect';
let submit;
elements.feedbackForm.addEventListener=(event,cb)=>{assert.equal(event,'submit'); submit=cb;};
let captured;
const context={
 URLSearchParams,
 document:{getElementById(id){assert.ok(elements[id]);return elements[id];}},
 window:{location:{search:'?page=%2Flumiose-atlas-pokemon-za%2Findex.html%23walkthrough'}},
 fetch:async(url,params)=>{
  captured={url,params};
  return {ok:true,json:async()=>({saved:true})};
 },
 Error
};
runInNewContext(js,context);
assert.equal(elements.page.value,'/lumiose-atlas-pokemon-za/index.html#walkthrough');
assert.equal(elements.returnLink.href,elements.page.value);
assert.equal(typeof submit,'function');
await submit({preventDefault(){}});
assert.equal(captured.url,'https://xzxqfrvqdgkzwujbkdbk.supabase.co/functions/v1/lumiose-atlas-feedback-github');
const payload=JSON.parse(captured.params.body);
assert.equal(payload.kind,'report');
assert.equal(payload.page,elements.page.value);
assert.equal(payload.category,'incorrect');
assert.equal(payload.details,'A guide step that appears to be wrong.');
assert.equal(payload.honey,'');
assert.equal(elements.status.className,'status success');
assert.equal(elements.details.value,'');
assert.equal(elements.send.disabled,false);
console.log('Standalone feedback form source, controls, mobile layout and mocked submission passed.');
