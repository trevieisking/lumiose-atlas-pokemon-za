(() => {
  'use strict';
  const ENDPOINT = 'https://xzxqfrvqdgkzwujbkdbk.supabase.co/functions/v1/lumiose-atlas-feedback-github';
  const PREFIX = '/lumiose-atlas-pokemon-za/';
  const PAGE_RE = /^\/(?:[a-z0-9-]+(?:\.html)?(?:\/[a-z0-9-]+(?:\.html)?)*)?(?:#[a-z0-9-]+)?$/i;
  const params = new URLSearchParams(window.location.search);
  const candidate = params.get('page') || PREFIX + 'index.html#walkthrough';
  const valid = candidate.length <= 160 && PAGE_RE.test(candidate) && candidate.startsWith(PREFIX);
  const page = valid ? candidate : PREFIX + 'index.html#walkthrough';
  const form = document.getElementById('feedbackForm');
  const pageField = document.getElementById('page');
  const back = document.getElementById('returnLink');
  const headerBack = document.getElementById('headerBack');
  const status = document.getElementById('status');
  const button = document.getElementById('send');
  pageField.value = page;
  back.href = page;
  headerBack.href = page;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const details = document.getElementById('details').value.trim();
    const category = document.getElementById('category').value;
    const honey = document.getElementById('honey').value;
    if (details.length < 10 || details.length > 1500 || !['stuck','missing','incorrect','other'].includes(category)) {
      status.className = 'status error';
      status.textContent = 'Please choose a category and enter 10–1,500 characters.';
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
        body: JSON.stringify({kind:'report',page,category,details,honey})
      });
      const data = await response.json();
      if (!response.ok || data.saved !== true) throw new Error(data.error || 'Report could not be saved.');
      status.className = 'status success';
      status.textContent = 'Thank you! Your feedback was saved privately.';
      document.getElementById('details').value = '';
    } catch (error) {
      status.className = 'status error';
      status.textContent = 'Feedback could not be saved. Please try again. ' + (error instanceof Error ? error.message : '');
    } finally {
      button.disabled = false;
    }
  });
})();
