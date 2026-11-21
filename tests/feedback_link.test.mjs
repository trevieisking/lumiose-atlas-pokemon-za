// Static URL/browser form checks. Does not issue network requests or create reports.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const source = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const formPage = readFileSync(new URL('../feedback.html', import.meta.url), 'utf8');
const formJS = readFileSync(new URL('../feedback.js', import.meta.url), 'utf8');
const endpoint = source.match(/^  const FEEDBACK_PAGE = '([^']+)';$/m);
assert.ok(endpoint, 'Expected local feedback page');
const start = source.indexOf('  function buildAtlasFeedbackUrl(');
const end = source.indexOf('\n  }\n', start);
assert.ok(start >= 0 && end > start, 'Expected page-context builder');
const context = {URL, document: {baseURI:'https://trevieisking.github.io/lumiose-atlas-pokemon-za/index.html'}};
runInNewContext(
  'const FEEDBACK_PAGE = ' + JSON.stringify(endpoint[1]) + ';\n' +
  source.slice(start, end + '\n  }'.length) +
  '\nthis.makeFeedbackUrl = buildAtlasFeedbackUrl;',
  context
);
for (const [pathname,hash,expectedPage] of [
  ['/index.html','#walkthrough','/index.html#walkthrough'],
  ['/','#home','/#home'],
  ['/guide/index.html','#sidequests','/guide/index.html#sidequests'],
  ['/lumiose-atlas-pokemon-za/','#walkthrough','/lumiose-atlas-pokemon-za/index.html#walkthrough'],
  ['/lumiose-atlas-pokemon-za/','#items','/lumiose-atlas-pokemon-za/index.html#items'],
  ['/index.html','','/index.html'],
  ['/index.html','#<script>','/'],
  ['/'+'a'.repeat(164),'#home','/']
]) {
  const url = new URL(context.makeFeedbackUrl(pathname,hash));
  assert.equal(url.origin,'https://trevieisking.github.io');
  assert.equal(url.pathname,'/lumiose-atlas-pokemon-za/feedback.html');
  assert.equal(url.searchParams.get('page'),expectedPage);
  assert.equal(url.searchParams.has('apikey'),false);
}
assert.match(source,/window\.location\.assign\(buildAtlasFeedbackUrl\(location\.pathname, location\.hash\)\)/);
assert.match(source,/reviewButton\.textContent='Send feedback'/);
for (const id of ['feedbackForm','page','category','details','honey','send','status','returnLink']) {
  assert.match(formPage,new RegExp('id="'+id+'"'));
}
assert.match(formPage,/<script src="feedback\.js" defer><\/script>/);
assert.match(formPage,/<link rel="stylesheet" href="feedback\.css">/);
assert.match(formJS,/lumiose-atlas-feedback-github/);
assert.match(formJS,/fetch\(ENDPOINT/);
assert.doesNotMatch(formPage+formJS+source,/SUPABASE_SERVICE_ROLE_KEY|sb_secret_|SECRET\s*=/);
assert.doesNotMatch(source,/new URL\(FEEDBACK_FORM\)/);
console.log('Atlas feedback uses a local HTML page, safe context and separate JSON endpoint.');
