// Offline regression checks for the URL builder embedded in app.js.
// No network, Supabase writes, real report submissions or test-rating rows.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const endpoint = source.match(/^  const FEEDBACK_FORM = '([^']+)';$/m);
assert.ok(endpoint, 'Expected standalone feedback endpoint');
const start = source.indexOf('  function buildAtlasFeedbackUrl(');
const end = source.indexOf('\n  }\n', start);
assert.ok(start >= 0 && end > start, 'Expected standalone feedback URL builder');

const context = { URL };
runInNewContext(
  'const FEEDBACK_FORM = ' + JSON.stringify(endpoint[1]) + ';\n' +
  source.slice(start, end + '\n  }'.length) +
  '\nthis.makeFeedbackUrl = buildAtlasFeedbackUrl;',
  context
);

for (const [pathname, hash, expectedPage] of [
  ['/index.html', '#walkthrough', '/index.html#walkthrough'],
  ['/', '#home', '/#home'],
  ['/guide/index.html', '#sidequests', '/guide/index.html#sidequests'],
  ['/index.html', '', '/index.html'],
  ['/index.html', '#<script>', '/'],
  ['/' + 'a'.repeat(164), '#home', '/']
]) {
  const url = new URL(context.makeFeedbackUrl(pathname, hash));
  assert.equal(url.origin, 'https://xzxqfrvqdgkzwujbkdbk.supabase.co');
  assert.equal(url.pathname, '/functions/v1/lumiose-atlas-feedback');
  assert.equal(url.searchParams.get('view'), 'feedback');
  assert.equal(url.searchParams.get('page'), expectedPage);
  assert.equal(url.searchParams.has('apikey'), false);
  assert.equal(url.searchParams.has('authorization'), false);
}

assert.match(source, /window\.location\.assign\(buildAtlasFeedbackUrl\(location\.pathname, location\.hash\)\)/);
assert.match(source, /reviewButton\.textContent='Send feedback'/);
assert.doesNotMatch(source, /SUPABASE_SERVICE_ROLE_KEY|SECRET\s*=/);
console.log('Feedback link checks passed: same-origin hosted form, safe page values, no client secrets.');
