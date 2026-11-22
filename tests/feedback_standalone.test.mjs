import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const html=readFileSync(new URL('../feedback.html',import.meta.url),'utf8');
const js=readFileSync(new URL('../feedback.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../feedback.css',import.meta.url),'utf8');
for(const id of ['feedbackForm','page','pageContext','detailsHelp','category','details','honey','send','status','returnLink','headerBack']){
  assert.ok(html.includes('id="'+id+'"'), 'Missing form control: '+id);
}
assert.match(html,/<script src="feedback\.js" defer><\/script>/);
assert.match(html,/<link rel="stylesheet" href="feedback\.css">/);
assert.doesNotMatch(html,/Guide owner\?|feedback-owner\.html|Sign in to view reports/i,'Public guide feedback must not require or promote an account');
assert.match(html,/name="category" required/);
assert.match(html,/name="details" minlength="10" maxlength="1500"/);
assert.match(html,/connect-src https:\/\/xzxqfrvqdgkzwujbkdbk\.supabase\.co/);
assert.match(css,/max-width:480px/);
assert.match(css,/\.page-context\{[^}]*overflow-wrap:anywhere/);
assert.match(html,/id="pageContext" class="page-context" aria-label="Full guide page address"/);
assert.doesNotMatch(html+js+css,/SUPABASE_SERVICE_ROLE_KEY|sb_secret_|SECRET\s*=/);

const elements={};
for(const id of ['feedbackForm','page','pageContext','detailsHelp','category','details','honey','send','status','returnLink','headerBack']) elements[id]={value:'',className:'',textContent:'',href:'',disabled:false};
elements.details.value='A guide step that appears to be wrong.';
elements.category.value='incorrect';
let submit;
elements.feedbackForm.addEventListener=(event,cb)=>{assert.equal(event,'submit'); submit=cb;};
let captured;
let calls = 0;
let respond = async () => ({status:201,json:async()=>({saved:true})});
const context={
 URLSearchParams,
 document:{getElementById(id){assert.ok(elements[id]);return elements[id];}},
 window:{location:{search:'?page=%2Flumiose-atlas-pokemon-za%2Findex.html%23walkthrough'}},
 fetch:async(url,params)=>{
  captured={url,params};
  calls += 1;
  return respond();
 },
 Error
};
runInNewContext(js,context);
assert.equal(elements.page.value,'/lumiose-atlas-pokemon-za/index.html#walkthrough');
assert.equal(elements.pageContext.textContent,elements.page.value,'The complete validated guide path must be visible as text');
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

// A 200 response with saved:true is not the expected confirmed-save receipt.
const report='The wild zone entry directions are missing a ladder.';
elements.details.value=report;
respond=async()=>({status:200,json:async()=>({saved:true})});
await submit({preventDefault(){}});
assert.equal(elements.status.className,'status error');
assert.equal(elements.details.value,report,'Failed reports remain available for retry');
assert.equal(elements.send.disabled,false);

// A malformed JSON response must not be called a successful save.
respond=async()=>({status:201,json:async()=>{throw new Error('Malformed receipt')}});
await submit({preventDefault(){}});
assert.equal(elements.status.className,'status error');
assert.equal(elements.details.value,report);

// Repeated submit events while the first is pending cannot duplicate a report.
let finish;
respond=()=>new Promise(resolve=>{finish=resolve;});
const before=calls;
const pending=submit({preventDefault(){}});
await submit({preventDefault(){}});
assert.equal(calls,before+1,'Only one request should be sent');
assert.equal(elements.send.disabled,true);
finish({status:201,json:async()=>({saved:true})});
await pending;
assert.equal(elements.status.className,'status success');
assert.equal(elements.details.value,'');
assert.equal(elements.send.disabled,false);
// A mission or sidequest link must preserve the exact return destination
// and submit an explicit, readable context within the unchanged backend fields.
function contextualForm(query) {
  const controls={};
  for(const id of ['feedbackForm','page','pageContext','detailsHelp','category','details','honey','send','status','returnLink','headerBack']) {
    controls[id]={value:'',className:'',textContent:'',href:'',disabled:false};
  }
  controls.details.value='The required ally battle is missing from the walkthrough.';
  controls.category.value='missing';
  let listener,body,calls=0;
  controls.feedbackForm.addEventListener=(_event,fn)=>{listener=fn;};
  runInNewContext(js,{
    URLSearchParams,
    document:{getElementById(id){assert.ok(controls[id],id);return controls[id];}},
    window:{location:{search:query}},
    fetch:async(_url,opts)=>{
      calls++;
      body=JSON.parse(opts.body);
      return {status:201,json:async()=>({saved:true})};
    },
    Error
  });
  return {controls,submit:()=>listener({preventDefault(){}}),posted:()=>body,calls:()=>calls};
}
const section='/lumiose-atlas-pokemon-za/index.html#walkthrough';
const mission=contextualForm('?page='+encodeURIComponent(section)+'&anchor=mission-36');
assert.equal(mission.controls.page.value,section,'Backend page must stay accepted by original writer');
assert.equal(mission.controls.pageContext.textContent,section+':mission-36');
assert.equal(mission.controls.returnLink.href,section+':mission-36');
assert.equal(mission.controls.headerBack.href,section+':mission-36');
assert.equal(mission.controls.details.maxLength,1500-'Guide location: Mission 36\n\n'.length);
assert.match(mission.controls.detailsHelp.textContent,/Mission 36 automatically/);
await mission.submit();
assert.equal(mission.posted().page,section);
assert.equal(mission.posted().details,
  'Guide location: Mission 36\n\nThe required ally battle is missing from the walkthrough.');
assert.equal(mission.controls.status.className,'status success');

const questSection='/lumiose-atlas-pokemon-za/index.html#sidequests';
const side=contextualForm('?page='+encodeURIComponent(questSection)+'&anchor=quest-160');
assert.equal(side.controls.pageContext.textContent,questSection+':quest-160');
await side.submit();
assert.match(side.posted().details,/^Guide location: Side Mission 160\n\n/);
assert.equal(side.posted().page,questSection);

for(const query of [
  '?page='+encodeURIComponent(section)+'&anchor=mission-999',
  '?page='+encodeURIComponent('/lumiose-atlas-pokemon-za/index.html#home')+'&anchor=mission-36',
  '?page='+encodeURIComponent(section)+'&anchor=mission-36%3Cscript%3E'
]) {
  const ignored=contextualForm(query);
  assert.equal(ignored.controls.pageContext.textContent,ignored.controls.page.value);
  assert.equal(ignored.controls.returnLink.href,ignored.controls.page.value);
  await ignored.submit();
  assert.doesNotMatch(ignored.posted().details,/Guide location:/);
}
const capped=contextualForm('?page='+encodeURIComponent(section)+'&anchor=mission-36');
const oversized='x'.repeat(capped.controls.details.maxLength+1);
capped.controls.details.value=oversized;
await capped.submit();
assert.equal(capped.calls(),0,'Over-limit contextual report must not reach server');
assert.equal(capped.controls.status.className,'status error');
assert.equal(capped.controls.details.value,oversized,'Failed report draft must survive');

console.log('Standalone feedback checks passed: confirmed save, retry, duplicate guard, exact mission/quest context, safe rejected anchors.');
