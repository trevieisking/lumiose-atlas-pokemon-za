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
  const contextKind = page.endsWith('#walkthrough') ? 'mission'
    : page.endsWith('#sidequests') ? 'quest' : '';
  const contextLimit = contextKind === 'mission' ? 42 : 203;
  const form = document.getElementById('feedbackForm');
  const pageField = document.getElementById('page');
  const pageContext = document.getElementById('pageContext');
  const detailsField = document.getElementById('details');
  const detailsHelp = document.getElementById('detailsHelp');
  const missionPicker = document.getElementById('missionPicker');
  const missionNumber = document.getElementById('missionNumber');
  const missionNumberLabel = document.getElementById('missionNumberLabel');
  const missionNumberHelp = document.getElementById('missionNumberHelp');
  const back = document.getElementById('returnLink');
  const headerBack = document.getElementById('headerBack');
  const status = document.getElementById('status');
  const button = document.getElementById('send');
  pageField.value = page; // Supabase accepts the section-only URL; never alter this field.
  missionPicker.hidden = !contextKind;
  if (contextKind) {
    missionNumber.max = String(contextLimit);
    missionNumber.value = anchor ? anchor.split('-')[1] : '';
    missionNumberLabel.textContent = contextKind === 'mission'
      ? 'Main Mission number (optional)' : 'Side Mission number (optional)';
    missionNumberHelp.textContent = 'Use 1–' + contextLimit +
      '. Leave blank for general feedback. Changing the number updates the return link.';
  } else {
    missionNumber.disabled = true;
  }

  function currentContext() {
    if (!contextKind || !missionNumber.value.trim()) return {valid:true, anchor:'', label:''};
    const raw = missionNumber.value.trim();
    // Only canonical positive integers within the known 42/203 mission ranges.
    if (!/^[1-9][0-9]{0,2}$/.test(raw) || Number(raw) > contextLimit) {
      return {valid:false, anchor:'', label:''};
    }
    const number = Number(raw);
    return {valid:true, anchor:contextKind + '-' + number,
      label:(contextKind === 'mission' ? 'Mission ' : 'Side Mission ') + number};
  }

  function updateLocation() {
    const selected = currentContext();
    const linkedPage = selected.valid && selected.anchor ? page + ':' + selected.anchor : page;
    pageContext.textContent = linkedPage;
    back.href = linkedPage;
    headerBack.href = linkedPage;
    const prefix = selected.valid && selected.label ? 'Guide location: ' + selected.label + '\n\n' : '';
    detailsField.maxLength = 1500 - prefix.length;
    detailsHelp.textContent = selected.label
      ? 'Your report will include ' + selected.label + ' automatically. ' +
        'Enter 10–' + detailsField.maxLength + ' characters. Please do not include passwords or account information.'
      : '10–1,500 characters. Please do not include passwords or account information.';
    return {valid:selected.valid, prefix};
  }

  if (contextKind) missionNumber.addEventListener('input', updateLocation);
  updateLocation();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (button.disabled) return; // Ignore a second submit while the first is pending.
    const location = updateLocation();
    if (!location.valid) {
      status.className = 'status error';
      status.textContent = 'Please enter a mission number from 1 to ' + contextLimit + ' or leave it blank.';
      return;
    }
    const details = detailsField.value.trim();
    const category = document.getElementById('category').value;
    const honey = document.getElementById('honey').value;
    if (details.length < 10 || location.prefix.length + details.length > 1500 ||
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
        body: JSON.stringify({kind:'report',page,category,details:location.prefix + details,honey})
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
