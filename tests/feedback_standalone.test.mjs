import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const html=readFileSync(new URL('../feedback.html',import.meta.url),'utf8');
const js=readFileSync(new URL('../feedback.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../feedback.css',import.meta.url),'utf8');
for(const id of ['feedbackForm','page','pageContext','missionPicker','missionKind','missionKindHelp','missionNumber','missionNumberLabel','missionNumberHelp','detailsHelp','category','details','honey','send','status','returnLink','headerBack']){
  assert.ok(html.includes('id="'+id+'"'), 'Missing form control: '+id);
}
assert.match(html,/<script src="feedback\.js" defer><\/script>/);
assert.match(html,/<label for="page">Page link to investigate<\/label>/, 'The form should clearly name the affected page link');
assert.match(html,/<div id="missionPicker" hidden>/, 'Mission selection must be optional and hidden outside mission pages');
assert.match(html,/<input id="missionNumber"[^>]+type="number" min="1" step="1"/);
assert.match(html,/<label for="missionKind">Which mission guide\?<\/label>/);
assert.match(html,/<option value="mission">Main Missions \(1–42\)<\/option>/);
assert.match(html,/<option value="quest">Side Missions \(1–203\)<\/option>/);
assert.match(html,/<link rel="stylesheet" href="feedback\.css">/);
assert.doesNotMatch(html,/Guide owner\?|feedback-owner\.html|Sign in to view reports/i,'Public guide feedback must not require or promote an account');
assert.match(html,/name="category" required/);
assert.match(html,/name="details" minlength="10" maxlength="1500"/);
assert.match(html,/connect-src https:\/\/xzxqfrvqdgkzwujbkdbk\.supabase\.co/);
assert.match(css,/max-width:480px/);
assert.match(css,/\.page-context\{[^}]*overflow-wrap:anywhere/);
assert.match(css,/#missionPicker:not\(\[hidden\]\)\{margin-top:1\.2rem\}/);
assert.match(html,/placeholder="Explain what happened, what is missing, or which directions need correcting\.\.\."/);
assert.match(html,/id="pageContext" class="page-context" aria-label="Full guide page address"/);
assert.doesNotMatch(html+js+css,/SUPABASE_SERVICE_ROLE_KEY|sb_secret_|SECRET\s*=/);

const elements={};
for(const id of ['feedbackForm','page','pageContext','missionPicker','missionKind','missionKindHelp','missionNumber','missionNumberLabel','missionNumberHelp','detailsHelp','category','details','honey','send','status','returnLink','headerBack']) elements[id]={value:'',className:'',textContent:'',href:'',disabled:false};
elements.details.value='A guide step that appears to be wrong.';
elements.category.value='incorrect';
elements.missionNumber.addEventListener=(event,_cb)=>{assert.equal(event,'input');};
elements.missionKind.addEventListener=(event,_cb)=>{assert.equal(event,'change');};
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
  for(const id of ['feedbackForm','page','pageContext','missionPicker','missionKind','missionKindHelp','missionNumber','missionNumberLabel','missionNumberHelp','detailsHelp','category','details','honey','send','status','returnLink','headerBack']) {
    controls[id]={value:'',className:'',textContent:'',href:'',disabled:false};
  }
  controls.details.value='The required ally battle is missing from the walkthrough.';
  controls.category.value='missing';
  let listener,body,calls=0,inputListener,kindListener;
  controls.feedbackForm.addEventListener=(_event,fn)=>{listener=fn;};
  controls.missionNumber.addEventListener=(event,fn)=>{
    assert.equal(event,'input'); inputListener=fn;
  };
  controls.missionKind.addEventListener=(event,fn)=>{
    assert.equal(event,'change'); kindListener=fn;
  };
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
  return {
    controls,
    submit:()=>listener({preventDefault(){}}),
    posted:()=>body,
    calls:()=>calls,
    changeMission(number){
      controls.missionNumber.value=number;
      if(inputListener) inputListener();
    },
    changeKind(kind){
      controls.missionKind.value=kind;
      if(kindListener) kindListener();
    }
  };
}
const section='/lumiose-atlas-pokemon-za/index.html#walkthrough';
const mission=contextualForm('?page='+encodeURIComponent(section)+'&anchor=mission-36');
assert.equal(mission.controls.page.value,section,'Backend page must stay accepted by original writer');
assert.equal(mission.controls.missionPicker.hidden,false);
assert.equal(mission.controls.missionNumber.value,'36');
assert.equal(mission.controls.missionKind.value,'mission');
assert.equal(mission.controls.missionKind.disabled,false);
assert.equal(mission.controls.missionNumber.max,'42');
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
assert.equal(side.controls.missionNumber.value,'160');
assert.equal(side.controls.missionKind.value,'quest');
assert.equal(side.controls.missionNumber.max,'203');
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
// Exact report location can be selected manually from a generic walkthrough.
const manual=contextualForm('?page='+encodeURIComponent(section));
assert.equal(manual.controls.missionNumber.value,'');
assert.equal(manual.controls.returnLink.href,section);
manual.changeMission('42');
assert.equal(manual.controls.pageContext.textContent,section+':mission-42');
assert.equal(manual.controls.headerBack.href,section+':mission-42');
assert.match(manual.controls.detailsHelp.textContent,/Mission 42 automatically/);
await manual.submit();
assert.equal(manual.posted().page,section,'Manual location must not alter backend page validation');
assert.match(manual.posted().details,/^Guide location: Mission 42\n\n/);
manual.changeMission('');
assert.equal(manual.controls.pageContext.textContent,section);
assert.equal(manual.controls.details.maxLength,1500,'Clearing mission restores the full message limit');

const manualSide=contextualForm('?page='+encodeURIComponent(questSection));
manualSide.changeMission('203');
assert.equal(manualSide.controls.returnLink.href,questSection+':quest-203');
await manualSide.submit();
assert.match(manualSide.posted().details,/^Guide location: Side Mission 203\n\n/);

for(const bad of ['0','43','999','2.5','36<script>','003']) {
  const invalidMission=contextualForm('?page='+encodeURIComponent(section));
  invalidMission.changeMission(bad);
  await invalidMission.submit();
  assert.equal(invalidMission.calls(),0,'Invalid mission input must never reach server: '+bad);
  assert.equal(invalidMission.controls.status.className,'status error');
  assert.equal(invalidMission.controls.returnLink.href,section,'Invalid mission must not alter return link');
  assert.match(invalidMission.controls.details.value,/required ally battle/);
}
const badSide=contextualForm('?page='+encodeURIComponent(questSection));
badSide.changeMission('204');
await badSide.submit();
assert.equal(badSide.calls(),0);

// Main Mission #99 is not in the guide, but Side Mission #99 is.
const wrongMain=contextualForm('?page='+encodeURIComponent(section));
wrongMain.changeMission('99');
await wrongMain.submit();
assert.equal(wrongMain.calls(),0,'Main Mission 99 must be rejected');
const leadingZeroMain=contextualForm('?page='+encodeURIComponent(section));
leadingZeroMain.changeMission('00');
await leadingZeroMain.submit();
assert.equal(leadingZeroMain.calls(),0,'00 must remain invalid');

const switchedSide=contextualForm('?page='+encodeURIComponent(section)+'&anchor=mission-36');
assert.equal(switchedSide.controls.missionKind.value,'mission');
switchedSide.changeKind('quest');
assert.equal(switchedSide.controls.missionNumber.value,'','Changing guide must clear an old deep-linked number');
assert.equal(switchedSide.controls.missionNumber.max,'203');
assert.equal(switchedSide.controls.missionNumberLabel.textContent,'Side Mission number (optional)');
assert.equal(switchedSide.controls.page.value,questSection,'Page link should point to the chosen guide');
assert.equal(switchedSide.controls.returnLink.href,questSection);
switchedSide.changeMission('99');
assert.equal(switchedSide.controls.pageContext.textContent,questSection+':quest-99');
assert.equal(switchedSide.controls.headerBack.href,questSection+':quest-99');
await switchedSide.submit();
assert.equal(switchedSide.posted().page,questSection);
assert.match(switchedSide.posted().details,/^Guide location: Side Mission 99\n\n/);

const switchedMain=contextualForm('?page='+encodeURIComponent(questSection)+'&anchor=quest-160');
switchedMain.changeKind('mission');
assert.equal(switchedMain.controls.missionNumber.value,'');
assert.equal(switchedMain.controls.missionNumber.max,'42');
assert.equal(switchedMain.controls.missionNumberLabel.textContent,'Main Mission number (optional)');
assert.equal(switchedMain.controls.page.value,section);
switchedMain.changeMission('42');
assert.equal(switchedMain.controls.returnLink.href,section+':mission-42');
await switchedMain.submit();
assert.equal(switchedMain.posted().page,section);
assert.match(switchedMain.posted().details,/^Guide location: Mission 42\n\n/);

const invalidKind=contextualForm('?page='+encodeURIComponent(section));
invalidKind.changeKind('unknown');
await invalidKind.submit();
assert.equal(invalidKind.calls(),0,'Forged mission kind must not reach server');
assert.equal(invalidKind.controls.status.className,'status error');

const otherPage='/lumiose-atlas-pokemon-za/index.html#items';
const other=contextualForm('?page='+encodeURIComponent(otherPage));
assert.equal(other.controls.missionPicker.hidden,true);
assert.equal(other.controls.missionNumber.disabled,true);
assert.equal(other.controls.missionKind.disabled,true);
assert.equal(other.controls.returnLink.href,otherPage);
await other.submit();
assert.doesNotMatch(other.posted().details,/Guide location:/);

const capped=contextualForm('?page='+encodeURIComponent(section)+'&anchor=mission-36');
const oversized='x'.repeat(capped.controls.details.maxLength+1);
capped.controls.details.value=oversized;
await capped.submit();
assert.equal(capped.calls(),0,'Over-limit contextual report must not reach server');
assert.equal(capped.controls.status.className,'status error');
assert.equal(capped.controls.details.value,oversized,'Failed report draft must survive');

console.log('Standalone feedback checks passed: confirmed save, retry, duplicate guard, exact mission/quest context, safe rejected anchors.');
