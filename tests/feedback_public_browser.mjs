/* Read-only published-browser smoke for the independent GitHub Pokémon Atlas.
 * Does not sign in, submit reports, or use any privileged credentials.
 * The authenticated owner-inbox flow still requires manual owner validation.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

const BRANCH_PREVIEW = Boolean(process.env.ATLAS_FEEDBACK_BROWSER_BASE);
const SITE = process.env.ATLAS_FEEDBACK_BROWSER_BASE || 'https://trevieisking.github.io/lumiose-atlas-pokemon-za';
const REPORTS_API = 'https://xzxqfrvqdgkzwujbkdbk.supabase.co/functions/v1/lumiose-atlas-owner-reports?offset=0';
const PAGE = '/lumiose-atlas-pokemon-za/index.html#walkthrough';
const OUT = BRANCH_PREVIEW ? 'test-artifacts/atlas-feedback-pr-preview' : 'test-artifacts/atlas-feedback-public';
fs.mkdirSync(OUT, {recursive:true});
const browser = await chromium.launch({channel:'chrome', headless:true, args:['--no-sandbox']});
try {
  for (const device of [
    {name:'desktop', viewport:{width:1366, height:900}, isMobile:false, hasTouch:false},
    {name:'phone', viewport:{width:390, height:844}, isMobile:true, hasTouch:true}
  ]) {
    const context = await browser.newContext({
      viewport:device.viewport, deviceScaleFactor:1,
      isMobile:device.isMobile, hasTouch:device.hasTouch
    });
    const page = await context.newPage();
    const runtimeErrors = [];
    const writeRequests = [];
    page.on('pageerror', error => runtimeErrors.push(String(error)));
    page.on('request', request => {
      if (['POST','PUT','PATCH','DELETE'].includes(request.method())) {
        writeRequests.push(request.method() + ' ' + request.url());
      }
    });
    const formUrl = SITE + '/feedback.html?page=' + encodeURIComponent(PAGE);
    const form = await page.goto(formUrl, {waitUntil:'networkidle', timeout:30000});
    assert.equal(form?.status(), 200, device.name + ': published feedback form is not HTTP 200');
    assert.equal(await page.title(), 'Send feedback — Lumiose Atlas');
    assert.equal(await page.locator('#page').inputValue(), PAGE, 'Must retain walkthrough context');
    if (BRANCH_PREVIEW) {
      assert.equal(await page.locator('#pageContext').textContent(), PAGE, 'Full page path must be displayed as safe text');
      const wraps = await page.locator('#pageContext').evaluate(el => {
        const style = getComputedStyle(el);
        return style.overflowWrap === 'anywhere' && el.clientWidth > 0 &&
          el.scrollWidth <= el.clientWidth + 2 && el.scrollHeight <= el.clientHeight + 2;
      });
      assert.equal(wraps, true, device.name + ': visible guide path must wrap without clipping');
    }
    assert.equal(await page.locator('#returnLink').getAttribute('href'), PAGE, 'Back link must return to the walkthrough');
    assert.equal(await page.locator('#headerBack').getAttribute('href'), PAGE);
    assert.equal(await page.locator('#feedbackForm').count(), 1);
    assert.equal(await page.locator('#details').getAttribute('maxlength'), '1500');
    assert.equal(await page.locator('link[href="feedback.css"]').evaluate(link => Boolean(link.sheet)), true, 'Feedback CSS must load');
    assert.equal(await page.locator('#feedbackForm').evaluate(form => form.checkValidity()), false, 'Empty form must be invalid');
    const formFits = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
    assert.equal(formFits, true, device.name + ': feedback form has horizontal overflow');
    await page.screenshot({path:OUT + '/feedback-' + device.name + '.png', fullPage:true});
    if (BRANCH_PREVIEW && device.isMobile) {
      const longPage = '/lumiose-atlas-pokemon-za/index.html#' + 'route-'.repeat(18);
      assert.ok(longPage.length <= 160);
      await page.goto(SITE + '/feedback.html?page=' + encodeURIComponent(longPage), {waitUntil:'networkidle'});
      assert.equal(await page.locator('#page').inputValue(), longPage);
      assert.equal(await page.locator('#pageContext').textContent(), longPage);
      const fits = await page.locator('#pageContext').evaluate(el =>
        el.scrollWidth <= el.clientWidth + 2 && el.scrollHeight <= el.clientHeight + 2);
      assert.equal(fits, true, 'Long source address must wrap on phones');
      assert.equal(await page.locator('#returnLink').getAttribute('href'), longPage);
      await page.screenshot({path:OUT + '/feedback-phone-long-path.png', fullPage:true});
    }

    const owner = await page.goto(SITE + '/feedback-owner.html', {waitUntil:'networkidle', timeout:30000});
    assert.equal(owner?.status(), 200, device.name + ': published owner page is not HTTP 200');
    assert.equal(await page.title(), 'Private feedback inbox — Lumiose Atlas');
    assert.equal(await page.locator('#ownerLogin').count(), 1, 'Owner login must be present');
    assert.equal(await page.locator('#ownerPassword').getAttribute('type'), 'password');
    assert.equal(await page.locator('#reportsPanel').isVisible(), false, 'Private reports must start hidden');
    assert.equal(await page.locator('#reportList .report-entry').count(), 0, 'No reports exposed to visitors');
    assert.equal(await page.locator('link[href="feedback-owner.css"]').evaluate(link => Boolean(link.sheet)), true, 'Owner CSS must load');
    const ownerFits = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
    assert.equal(ownerFits, true, device.name + ': owner form has horizontal overflow');
    await page.screenshot({path:OUT + '/owner-login-' + device.name + '.png', fullPage:true});

    if (device.name === 'desktop' && !BRANCH_PREVIEW) {
      // A read-only unauthenticated GET; no sign-in credentials or report writes.
      const unauth = await page.evaluate(async url => {
        const response = await fetch(url, {method:'GET', mode:'cors', cache:'no-store'});
        const body = await response.json();
        return {status:response.status, hasReports:Array.isArray(body.reports)};
      }, REPORTS_API);
      assert.equal(unauth.status, 401, 'Unauthenticated owner API must reject reads');
      assert.equal(unauth.hasReports, false, 'Unauthenticated owner API must never disclose reports');
    }
    assert.deepEqual(runtimeErrors, [], device.name + ': JavaScript runtime errors');
    assert.deepEqual(writeRequests, [], device.name + ': smoke must not make write requests');
    await context.close();
  }
  console.log(BRANCH_PREVIEW ?
    'ATLAS_FEEDBACK_PR_PREVIEW_PASS: mobile+desktop validated full guide paths, mobile long-path wrap, no writes' :
    'ATLAS_FEEDBACK_PUBLISHED_READ_ONLY_PASS: mobile+desktop UI, walkthrough back-link, CSS, security, no writes');
  console.log('Owner sign-in and private report rendering NOT tested; authenticated owner must verify separately.');
} finally {
  await browser.close();
}
