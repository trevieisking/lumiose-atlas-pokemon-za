import {validateCrossGrid, latticePoint, cellLabel, parseCell, nativeReference, cellPolygon, cellCentre,
  referenceText, referenceFromSearch, referenceURL} from './atlas-cross-grid.mjs';

const svgNS = 'http://www.w3.org/2000/svg';
const svgNode = (tag, attributes = {}) => {
  const node = document.createElementNS(svgNS, tag);
  for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
  return node;
};
const pathFor = points => points.length ? points.map((p, i) => (i ? 'L' : 'M') + p.join(',')).join(' ') + 'Z' : '';
function clipSegment(a, b, grid) {
  let lo = 0, hi = 1;
  for (let axis = 0; axis < 2; axis++) {
    const delta = b[axis] - a[axis];
    if (Math.abs(delta) < 1e-10) {if (a[axis] < 0 || a[axis] > grid.native_size[axis]) return null;}
    else {
      const ends = [-a[axis] / delta, (grid.native_size[axis] - a[axis]) / delta].sort((x, y) => x - y);
      lo = Math.max(lo, ends[0]); hi = Math.min(hi, ends[1]);
    }
  }
  return lo <= hi ? [lo, hi].map(t => [0, 1].map(axis => a[axis] + (b[axis] - a[axis]) * t)) : null;
}

export async function installCrossGrid({stage, viewport, currentView, centrePoint, projectPoint, onFocus}) {
  const response = await fetch('atlas-cross-grid.json', {cache: 'no-store'});
  if (!response.ok) throw Error('Cross grid HTTP ' + response.status);
  const grid = validateCrossGrid(await response.json());
  const by = id => document.getElementById(id);
  const toggle = by('aeGridToggle'), panel = by('aeGridPanel'), output = by('aeGridReference');
  const input = by('aeGridCell'), form = by('aeGridForm'), status = by('aeGridStatus');
  const copy = by('aeGridCopy'), crosshair = by('aeGridCentre'), confidence = by('aeGridConfidence');
  if (![toggle, panel, output, input, form, status, copy, crosshair, confidence].every(Boolean)) throw Error('Missing cross-grid controls');

  const svg = svgNode('svg', {id: 'aeCrossGrid', class: 'ae-cross-grid', 'aria-hidden': 'true'});
  const lines = svgNode('g', {class: 'ae-grid-lines'}), selected = svgNode('path', {class: 'ae-grid-selected'});
  const subdivisions = svgNode('path', {class: 'ae-grid-subdivisions'}), labels = svgNode('g', {class: 'ae-grid-labels'});
  const lineRows = [];
  const addLine = (a, b, extension) => {
    const points = clipSegment(a, b, grid);
    if (!points) return;
    const node = svgNode('path', extension ? {class: 'ae-grid-extension'} : {});
    lines.append(node); lineRows.push({node, points});
  };
  for (let c = 0; c <= grid.columns; c++) {
    const a = latticePoint(c, 0, grid), b = latticePoint(c, grid.observed_max_row_node, grid), d = latticePoint(c, grid.rows, grid);
    addLine(a, b, c > grid.observed_max_column_node); addLine(b, d, true);
  }
  for (let r = 0; r <= grid.rows; r++) {
    const a = latticePoint(0, r, grid), b = latticePoint(grid.observed_max_column_node, r, grid), d = latticePoint(grid.columns, r, grid);
    addLine(a, b, r > grid.observed_max_row_node); addLine(b, d, true);
  }
  const labelRows = [];
  for (let r = 0; r < grid.rows; r++) for (let c = 0; c < grid.columns; c++) {
    const cell = {column: c, row: r}, point = cellCentre(cell, grid);
    if (!point) continue;
    const text = svgNode('text', {'text-anchor': 'middle', 'dominant-baseline': 'middle'});
    text.textContent = cellLabel(c, r); labels.append(text); labelRows.push({text, point});
  }
  svg.append(lines, selected, subdivisions, labels);
  // Screen-space vectors stay sharp at high zoom; every point still uses the shared map projection.
  viewport.insertBefore(svg, viewport.querySelector('#aeSectorContext'));
  let reference = null, edgeTarget = null, edgeView = '';
  const viewKey = () => JSON.stringify(currentView());
  function focus(point) {
    onFocus(point);
    const centre = centrePoint();
    edgeTarget = Math.hypot(centre[0] - point[0], centre[1] - point[1]) > 1 ? point : null;
    edgeView = viewKey();
  }

  function draw() {
    svg.style.display = toggle.checked ? '' : 'none';
    panel.hidden = crosshair.hidden = !toggle.checked;
    if (!toggle.checked) return;
    if (edgeTarget && edgeView !== viewKey()) {
      edgeTarget = null;
      status.textContent = 'Centre readout resumed.';
    }
    const view = currentView(), bounds = viewport.getBoundingClientRect();
    const scale = Math.min(bounds.width, bounds.height) * .94 / 1920 * view.zoom;
    svg.setAttribute('viewBox', '0 0 ' + bounds.width + ' ' + bounds.height);
    const project = p => {const q = projectPoint(p); return [q.x, q.y];};
    const segmentPath = points => 'M' + project(points[0]).join(',') + 'L' + project(points[1]).join(',');
    for (const {node, points} of lineRows) node.setAttribute('d', segmentPath(points));
    reference = nativeReference(edgeTarget || centrePoint(), grid);
    output.textContent = referenceText(reference);
    const extended = reference && (reference.column >= grid.observed_max_column_node || reference.row >= grid.observed_max_row_node);
    confidence.textContent = extended ? 'Edge extension: these squares continue the measured spacing beyond the sampled crossings.' : 'Image reference: checked against visible map crosses and the central photographs.';
    output.dataset.cell = reference?.label || '';
    output.dataset.probe = edgeTarget ? 'selected-edge-point' : 'map-centre';
    const probe = edgeTarget ? projectPoint(edgeTarget) : null;
    crosshair.style.left = probe ? probe.x + 'px' : '50%';
    crosshair.style.top = probe ? probe.y + 'px' : '50%';
    copy.disabled = !reference;
    selected.setAttribute('d', reference ? pathFor(cellPolygon(reference, grid).map(project)) : '');
    let minor = '';
    if (reference && grid.column_vector_native_xy[0] * scale >= 100) {
      for (let i = 1; i < 10; i++) {
        const u = reference.column, v = reference.row;
        const a = latticePoint(u + i / 10, v, grid), b = latticePoint(u + i / 10, v + 1, grid);
        const c = latticePoint(u, v + i / 10, grid), d = latticePoint(u + 1, v + i / 10, grid);
        for (const points of [clipSegment(a, b, grid), clipSegment(c, d, grid)]) if (points) minor += segmentPath(points);
      }
    }
    subdivisions.setAttribute('d', minor);
    labels.style.display = grid.column_vector_native_xy[0] * scale >= 72 ? '' : 'none';
    for (const {text, point} of labelRows) {
      const [x, y] = project(point);
      text.setAttribute('x', x); text.setAttribute('y', y);
      text.style.display = x < -20 || x > bounds.width + 20 || y < -20 || y > bounds.height + 20 ? 'none' : '';
    }
  }

  toggle.disabled = false;
  toggle.addEventListener('change', () => {status.textContent = ''; draw();});
  form.addEventListener('submit', event => {
    event.preventDefault();
    const cell = parseCell(input.value, grid), point = cell && cellCentre(cell, grid);
    if (!point) {status.textContent = 'Enter a square from A1 to R18, such as I9.'; return;}
    input.value = cell.label; toggle.checked = true;
    focus(point); draw();
    status.textContent = 'Showing square ' + cell.label + '.' + (edgeTarget ? ' At the image edge, the reference cross marks the selected position. Drag to resume the centre readout.' : '');
    viewport.scrollIntoView({behavior: 'smooth', block: 'center'});
  });
  copy.addEventListener('click', async () => {
    if (!reference) return;
    const text = 'Lumiose Atlas grid ' + referenceText(reference) + '\n' + referenceURL(location.href, reference);
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = 'Grid reference and map link copied.';
    } catch (_) {
      status.textContent = 'Reference: ' + referenceText(reference) + '. Copy this text to keep the location.';
    }
  });
  const linked = referenceFromSearch(location.search, grid);
  if (linked) {
    toggle.checked = true; input.value = linked.cell.label; focus(linked.point);
    if (edgeTarget) status.textContent = 'The reference cross marks the shared position at the image edge. Drag to resume the centre readout.';
  }
  draw();
  return {draw};
}
