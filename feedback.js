(() => {
  'use strict';
  const ENDPOINT = 'https://xzxqfrvqdgkzwujbkdbk.supabase.co/functions/v1/lumiose-atlas-feedback-github';
  const PREFIX = '/lumiose-atlas-pokemon-za/';
  const PAGE_RE = /^\/(?:[a-z0-9-]+(?:\.html)?(?:\/[a-z0-9-]+(?:\.html)?)*)?(?:#[a-z0-9-]+)?$/i;
  const params = new URLSearchParams(window.location.search);
  const candidate = params.get('page') || PREFIX + 'index.html#walkthrough';
  const valid = candidate.length <= 160 && PAGE_RE.test(candidate) && candidate.startsWith(PREFIX);
  const page = valid ? candidate : PREFIX + 'index.html#walkthrough';
  const requestedAnchor = params.get('anchor') || '';
  const isMission = page.endsWith('#walkthrough') &&
    /^mission-(?:[1-9]|[1-3][0-9]|4[0-2])$/.test(requestedAnchor);
  const isSideQuest = page.endsWith('#sidequests') &&
    /^quest-(?:[1-9]|[1-9][0-9]|1[0-9]{2}|20[0-3])$/.test(requestedAnchor);
  const anchor = isMission || isSideQuest ? requestedAnchor : '';
  const linkedPage = anchor ? page + ':' + anchor : page;
  const contextLabel = isMission ? 'Mission ' + anchor.slice('mission-'.length)
    : isSideQuest ? 'Side Mission ' + anchor.slice('quest-'.length) : '';
  const contextPrefix = contextLabel ? 'Guide location: ' + contextLabel + '\n\n' : '';
  const form = document.getElementById('feedbackForm');
  const pageField = document.getElementById('page');
  const pageContext = document.getElementById('pageContext');
  const detailsField = document.getElementById('details');
  const detailsHelp = document.getElementById('detailsHelp');
  const back = document.getElementById('returnLink');
  const headerBack = document.getElementById('headerBack');
  const status = document.getElementById('status');
  const button = document.getElementById('send');
  pageField.value = page; // Existing Supabase service accepts section-only URLs.
  pageContext.textContent = linkedPage;
  back.href = linkedPage;
  headerBack.href = linkedPage;
  if (contextLabel) {
    detailsField.maxLength = 1500 - contextPrefix.length;
    detailsHelp.textContent = 'Your report will include ' + contextLabel + ' automatically. ' +
      'Enter 10–' + detailsField.maxLength + ' characters. Please do not include passwords or account information.';
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (button.disabled) return; // Ignore a second submit while the first is pending.
    const details = detailsField.value.trim();
    const category = document.getElementById('category').value;
    const honey = document.getElementById('honey').value;
    if (details.length < 10 || contextPrefix.length + details.length > 1500 ||
        !['stuck','missing','incorrect','other'].includes(category)) {
      status.className = 'status error';
      status.textContent = 'Please choose a category and enter 10–' + detailsField.maxLength + ' characters.';
      return;
    }
    button.disabled = true;
    status.className = 'status';
    status.textContent = 'Saving your feedback…';
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        mode: 'cors',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({kind:'report',page,category,details:contextPrefix + details,honey})
      });
      const data = await response.json().catch(() => null);
      if (response.status !== 201 || data?.saved !== true) {
        throw new Error(data?.error || 'Report could not be saved.');
      }
      status.className = 'status success';
      status.textContent = 'Thank you! Your feedback was saved privately.';
      detailsField.value = '';
    } catch (error) {
      status.className = 'status error';
      status.textContent = 'Feedback could not be saved. Please try again. ' + (error instanceof Error ? error.message : '');
    } finally {
      button.disabled = false;
    }
  });
})();
