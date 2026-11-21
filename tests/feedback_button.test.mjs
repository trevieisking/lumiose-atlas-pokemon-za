import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

// Source-only checks, with a simulated document base URI. No network/DB writes.
const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const form=readFileSync(new URL('../feedback.html',import.meta.url),'utf8');
const formJS=readFileSync(new URL('../feedback.js',import.meta.url),'utf8');
const constant=app.match(/^  const FEEDBACK_PAGE = '([^']+)';$/m);
assert.ok(constant, 'Expected local feedback page reference');
assert.equal(constant[1],'feedback.html');
const start=app.indexOf('  function buildAtlasFeedbackUrl(pathname, hash) {');
const end=app.indexOf('\n  }\n',start);
assert.ok(start>=0&&end>start,'Expected feedback URL builder');
const context={
  URL,
  document:{baseURI:'https://trevieisking.github.io/lumiose-atlas-pokemon-za/index.html'}
};
runInNewContext(
  'const FEEDBACK_PAGE = '+JSON.stringify(constant[1])+';\n'+
  app.slice(start,end+'\n  }'.length)+
  '\nthis.buildFeedback=buildAtlasFeedbackUrl;',context
);

const fallback='/lumiose-atlas-pokemon-za/index.html#walkthrough';
const cases=[
 ['/lumiose-atlas-pokemon-za/index.html','#walkthrough','/lumiose-atlas-pokemon-za/index.html#walkthrough'],
 ['/lumiose-atlas-pokemon-za/','#home','/lumiose-atlas-pokemon-za/index.html#home'],
 ['/lumiose-atlas-pokemon-za/','#items','/lumiose-atlas-pokemon-za/index.html#items'],
 ['/lumiose-atlas-pokemon-za/index.html','#walkthrough:mission-27','/lumiose-atlas-pokemon-za/index.html#walkthrough'],
 ['/lumiose-atlas-pokemon-za/index.html','#sidequests:quest-160','/lumiose-atlas-pokemon-za/index.html#sidequests'],
 ['/lumiose-atlas-pokemon-za/index.html','','/lumiose-atlas-pokemon-za/index.html'],
 ['/lumiose-atlas-pokemon-za/index.html','#<script>',fallback],
 ['/'+ 'a'.repeat(170), '#home',fallback],
 ['/lumiose-atlas-pokemon-za/index.html','#:bad',fallback]
];
for(const [path,hash,expected] of cases){
 const url=new URL(context.buildFeedback(path,hash));
 assert.equal(url.origin,'https://trevieisking.github.io');
 assert.equal(url.pathname,'/lumiose-atlas-pokemon-za/feedback.html');
 assert.equal(url.searchParams.get('page'),expected);
 assert.equal(url.searchParams.has('view'),false);
 assert.equal(url.searchParams.has('apikey'),false);
 assert.equal(url.searchParams.has('authorization'),false);
}

assert.match(app,/window\.location\.assign\(buildAtlasFeedbackUrl\(location\.pathname, location\.hash\)\)/);
assert.match(app,/reviewButton\.textContent='Send feedback'/);
assert.match(app,/reviewButton\.removeAttribute\('aria-expanded'\)/);
assert.doesNotMatch(app,/Ratings and reports are not connected in this independent reconstruction/);
assert.match(app,/const KEY = 'lumiose-atlas-reconstruction-v1'/);
assert.match(app,/restoreProgress\(\)/);
assert.match(form,/id="feedbackForm"/);
assert.match(form,/<script src="feedback\.js" defer><\/script>/);
assert.match(formJS,/lumiose-atlas-feedback-github/);
assert.doesNotMatch(app+form+formJS,/SUPABASE_SERVICE_ROLE_KEY|sb_secret_|SECRET\s*=/);
console.log('Feedback button URL and existing static form checks passed; no network writes.');
