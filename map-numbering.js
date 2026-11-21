/* Lumiose Atlas numbered item map: additive UI over recovered, approximate pins. */
(function atlasNumbering(){
  'use strict';
  const catalog = window.LUMIOSE_MAP_PINS;
  if (!catalog || catalog.version !== 1 || !catalog.zones) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const pad = (value) => String(value).padStart(2, '0');
  const ref = (entry) => `${entry.zone}-${entry.id}`;
  const entries = Object.values(catalog.zones).flat();
  const byId = new Map(entries.map((entry) => [String(entry.id), entry]));
  const byRef = new Map(entries.map((entry) => [ref(entry), entry]));
  const byPickup = new Map(entries.filter((entry) => entry.pickup).map((entry) => [entry.pickup, entry]));
  const storageKey = 'lumiose-atlas-mapped-pins-v1';
  let unlinkedProgress = {};
  let currentZone = null;

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) unlinkedProgress = saved;
  } catch (_) { /* Checkboxes remain functional for this tab without persistent storage. */ }

  function isCollected(entry) {
    if (entry.pickup) {
      const existing = $(`input[data-pickup="${entry.pickup}"]`);
      return !!existing?.checked;
    }
    return !!unlinkedProgress[ref(entry)];
  }

  function makeNumber(entry) {
    const number = document.createElement('span');
    number.className = 'atlas-map-number';
    number.textContent = pad(entry.number);
    number.setAttribute('aria-hidden', 'true');
    return number;
  }

  function decorateOriginalMapPins() {
    $$('button.item-map-pin[data-map-item]').forEach((button) => {
      const entry = byId.get(button.dataset.mapItem);
      if (!entry || button.dataset.atlasNumbered === 'true') return;
      button.dataset.atlasNumbered = 'true';
      button.dataset.pinRef = ref(entry);
      button.appendChild(makeNumber(entry));
      const label = `Wild Zone ${pad(entry.zone)}, map #${pad(entry.number)}: ${entry.name} (approximate position)`;
      button.title = label;
      button.setAttribute('aria-label', label);
    });
  }

  function decorateExistingChecklist() {
    $$('.pickup input[data-pickup]').forEach((input) => {
      const row = input.closest('label.pickup');
      const copy = row?.querySelector('.pickup-copy');
      if (!copy || copy.querySelector('.atlas-check-refs')) return;
      const [zone, position] = input.dataset.pickup.split('-').map(Number);
      if (!Number.isInteger(zone) || !Number.isInteger(position)) return;
      const entry = byPickup.get(input.dataset.pickup);
      const refs = document.createElement('span');
      refs.className = 'atlas-check-refs';
      const itemNo = document.createElement('span');
      itemNo.className = 'atlas-item-number';
      itemNo.textContent = `Item ${pad(position + 1)}`;
      refs.appendChild(itemNo);
      const status = document.createElement('span');
      status.className = entry ? 'atlas-linked-number' : 'atlas-link-pending';
      status.textContent = entry ? `Map #${pad(entry.number)}` : 'Map match unverified';
      if (entry) status.title = `Wild Zone ${pad(zone)} map marker #${pad(entry.number)} (approximate)`;
      refs.appendChild(status);
      copy.appendChild(refs);
    });
  }

  function displayDetails(entry, pin) {
    const card = pin.closest('.zone-close-card, .mission-map-card, .atlas-map-wrap');
    const notice = card?.querySelector('.mapped-item-info');
    if (notice) {
      const title = notice.querySelector('b');
      const detail = notice.querySelector('small');
      if (title) title.textContent = `Zone ${pad(entry.zone)} / map #${pad(entry.number)} — ${entry.name}`;
      if (detail) detail.textContent = entry.pickup
        ? 'Approximate map pin; matched to the numbered item checklist.'
        : 'Approximate map pin. The matching original checklist entry needs verification.';
    }
    $$('[data-pin-row]').forEach((row) => row.classList.toggle('atlas-pin-highlight', row.dataset.pinRow === ref(entry)));
  }

  function buildCityPins(zone) {
    const canvas = $('#atlasPins');
    if (!canvas) return;
    $$('[data-atlas-generated-pin]', canvas).forEach((node) => node.remove());
    const frag = document.createDocumentFragment();
    for (const entry of catalog.zones[String(zone)] || []) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'item-map-pin atlas-city-item-pin';
      button.dataset.mapItem = entry.id;
      button.dataset.pinRef = ref(entry);
      button.dataset.atlasGeneratedPin = 'true';
      button.dataset.atlasNumbered = 'true';
      button.style.left = `${entry.x}%`;
      button.style.top = `${entry.y}%`;
      button.title = `Wild Zone ${pad(zone)}, map #${pad(entry.number)}: ${entry.name} (approximate position)`;
      button.setAttribute('aria-label', button.title);
      const ball = document.createElement('span');
      ball.className = 'pin-ball';
      ball.setAttribute('aria-hidden', 'true');
      button.appendChild(ball);
      button.appendChild(makeNumber(entry));
      frag.appendChild(button);
    }
    canvas.appendChild(frag);
  }

  function buildMappedChecklist(zone) {
    const host = $('#mapZoneDetail .rebuild-zone-detail') || $('#mapZoneDetail');
    if (!host) return;
    $('.atlas-mapped-checklist', host)?.remove();
    const section = document.createElement('section');
    section.className = 'atlas-mapped-checklist';
    section.setAttribute('aria-label', `Wild Zone ${pad(zone)} numbered map pickups`);
    const title = document.createElement('h4');
    title.textContent = 'Numbered map pins & tick list';
    section.appendChild(title);
    const explanation = document.createElement('p');
    explanation.textContent = 'Map #01 in this zone means #01 on the map. Pins show approximate areas, not guaranteed floor positions. A linked item also ticks your original item checklist; unmatched pins have their own tracking.';
    section.appendChild(explanation);
    const list = document.createElement('div');
    list.className = 'atlas-pin-list';
    for (const entry of catalog.zones[String(zone)] || []) {
      const row = document.createElement('div');
      row.className = 'atlas-pin-row';
      row.dataset.pinRow = ref(entry);
      const label = document.createElement('label');
      label.className = 'atlas-pin-label';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.dataset.pinCheck = ref(entry);
      input.checked = isCollected(entry);
      input.setAttribute('aria-label', `Mark Wild Zone ${zone} mapped pin ${pad(entry.number)} ${entry.name} collected`);
      label.appendChild(input);
      const content = document.createElement('span');
      content.className = 'atlas-pin-copy';
      const name = document.createElement('strong');
      name.textContent = `#${pad(entry.number)} — ${entry.name}`;
      const note = document.createElement('small');
      note.textContent = entry.pickup
        ? `Linked to item ${pad(Number(entry.pickup.split('-')[1]) + 1)} in the main tick chart`
        : 'Map pin listed; original checklist match not yet confirmed';
      content.appendChild(name);
      content.appendChild(note);
      label.appendChild(content);
      row.appendChild(label);
      const jump = document.createElement('button');
      jump.type = 'button';
      jump.className = 'atlas-pin-locate';
      jump.dataset.focusMapPin = ref(entry);
      jump.textContent = `Find #${pad(entry.number)}`;
      row.appendChild(jump);
      list.appendChild(row);
    }
    const originalZoom = Array.from(document.querySelectorAll('.zoom-map-frame')).find((frame) => {
      const text = frame.getAttribute('aria-label') || '';
      return text === `Enlarged map near Wild Zone ${zone}`;
    });
    const closeCard = originalZoom?.closest('.zone-close-card');
    if (closeCard) {
      const zoom = document.createElement('details');
      zoom.className = 'atlas-selected-zoom';
      const summary = document.createElement('summary');
      summary.textContent = 'Open enlarged numbered map for this zone';
      zoom.appendChild(summary);
      const cloned = closeCard.cloneNode(true);
      cloned.querySelectorAll('[id]').forEach((child) => child.removeAttribute('id'));
      zoom.appendChild(cloned);
      section.appendChild(zoom);
    }
    section.appendChild(list);
    const previewHeading = Array.from(host.querySelectorAll('h4')).find((h) => h.textContent === 'Item checklist preview');
    if (previewHeading) host.insertBefore(section, previewHeading);
    else host.appendChild(section);
  }

  function selectMappedZone(zone) {
    const n = Number(zone);
    if (!Number.isInteger(n) || n < 1 || n > 20) return;
    currentZone = n;
    buildCityPins(n);
    buildMappedChecklist(n);
    const info = $('#atlasMap')?.closest('.atlas-map-wrap')?.querySelector('.mapped-item-info');
    if (info) {
      const name = info.querySelector('b');
      const detail = info.querySelector('small');
      const total = (catalog.zones[String(n)] || []).length;
      if (name) name.textContent = `Wild Zone ${pad(n)}: ${total} numbered item pins`;
      if (detail) detail.textContent = 'Tap a pin for the item name, or open the enlarged map in the numbered tick list. Positions are approximate.';
    }
    syncCompletion();
  }

  function syncCompletion() {
    $$('[data-pin-check]').forEach((input) => {
      const entry = byRef.get(input.dataset.pinCheck);
      if (entry) input.checked = isCollected(entry);
    });
    $$('[data-pin-ref]').forEach((element) => {
      const entry = byRef.get(element.dataset.pinRef);
      if (!entry) return;
      element.classList.toggle('atlas-pin-collected', isCollected(entry));
    });
    const seen = new Set($$('input[data-pickup]:checked').map((input) => input.dataset.pickup));
    const progress = $('#itemProgress');
    if (progress) progress.textContent = `${seen.size} of 264 listed pickups checked`;
  }

  document.addEventListener('click', (event) => {
    if (event.target.closest('#mapAll')) {
      currentZone = null;
      $$('[data-atlas-generated-pin]').forEach((node) => node.remove());
      $('.atlas-mapped-checklist')?.remove();
      return;
    }
    const zoneButton = event.target.closest('[data-select-zone], [data-open-zone], [data-map-zone]');
    if (zoneButton) {
      const zone = zoneButton.dataset.selectZone || zoneButton.dataset.openZone || zoneButton.dataset.mapZone;
      selectMappedZone(zone);
      return;
    }
    const locate = event.target.closest('[data-focus-map-pin]');
    if (locate) {
      const entry = byRef.get(locate.dataset.focusMapPin);
      if (!entry) return;
      const zoom = $('.atlas-mapped-checklist .atlas-selected-zoom');
      if (zoom) zoom.open = true;
      const pin = $(`.atlas-mapped-checklist .zoom-map-frame [data-pin-ref="${ref(entry)}"]`)
        || $(`#atlasPins [data-pin-ref="${ref(entry)}"]`);
      if (pin) {
        pin.focus({preventScroll: true});
        pin.scrollIntoView({block: 'nearest', behavior: 'smooth'});
        displayDetails(entry, pin);
      }
      return;
    }
    const pin = event.target.closest('button[data-map-item]');
    if (pin) {
      const entry = byId.get(pin.dataset.mapItem);
      if (entry) displayDetails(entry, pin);
    }
  });

  document.addEventListener('change', (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || input.type !== 'checkbox') return;
    if (input.dataset.pinCheck) {
      const entry = byRef.get(input.dataset.pinCheck);
      if (!entry) return;
      if (entry.pickup) {
        const originals = $$('input[data-pickup]').filter((other) => other.dataset.pickup === entry.pickup);
        originals.forEach((other) => { other.checked = input.checked; });
        if (originals[0]) originals[0].dispatchEvent(new Event('change', {bubbles: true}));
      } else {
        unlinkedProgress[ref(entry)] = input.checked;
        try { localStorage.setItem(storageKey, JSON.stringify(unlinkedProgress)); } catch (_) {}
      }
      syncCompletion();
      return;
    }
    if (input.dataset.pickup) {
      $$('input[data-pickup]').filter((other) => other.dataset.pickup === input.dataset.pickup)
        .forEach((other) => { other.checked = input.checked; });
      syncCompletion();
    }
  });

  function ensureZoneOnMapRoute() {
    const raw = location.hash.replace(/^#/, '');
    if (raw.split(':')[0] !== 'maps') return;
    if (currentZone !== null) { selectMappedZone(currentZone); return; }
    const button = $('#atlasPins [data-select-zone="1"]');
    if (button) button.click();
  }

  decorateOriginalMapPins();
  decorateExistingChecklist();
  syncCompletion();
  // Reflect a safe backup import made in another tab without resetting progress.
  window.addEventListener('storage', event => {
    if (event.key === storageKey) {
      try {
        const latest = JSON.parse(event.newValue || '{}');
        if (latest && typeof latest === 'object' && !Array.isArray(latest)) unlinkedProgress = latest;
      } catch (_) { return; }
      syncCompletion();
    }
    if (event.key === 'lumiose-atlas-reconstruction-v1') syncCompletion();
  });
  window.addEventListener('hashchange', ensureZoneOnMapRoute);
  ensureZoneOnMapRoute();
})();
