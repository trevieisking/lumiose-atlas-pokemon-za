/* Atlas-owned image references. This never changes saved places, pins or progress. */
const finitePair = value => Array.isArray(value) && value.length === 2 && value.every(Number.isFinite);
const snap = value => Math.abs(value - Math.round(value)) < 1e-8 ? Math.round(value) : value;

export function validateCrossGrid(data) {
  if (data?.schema_version !== 1 || data?.id !== 'atlas-native-cross-grid-v1' ||
      data?.alignment_verified !== true || data?.map_path !== 'maps/lumiose-game-map.jpg' ||
      !Array.isArray(data.native_size) || data.native_size[0] !== 1920 || data.native_size[1] !== 1920 ||
      data.native_sha256 !== '4602cfa3746f1e3cb4954b80fa9e75ffd2fe0c7d51f445ca83b73a7d3bc4aade' ||
      ![data.origin_native_xy, data.column_vector_native_xy, data.row_vector_native_xy].every(finitePair) ||
      !Number.isInteger(data.columns) || data.columns < 1 || data.columns > 26 ||
      !Number.isInteger(data.rows) || data.rows < 1 || data.rows > 99 ||
      !Number.isInteger(data.observed_max_column_node) || data.observed_max_column_node < 1 || data.observed_max_column_node > data.columns ||
      !Number.isInteger(data.observed_max_row_node) || data.observed_max_row_node < 1 || data.observed_max_row_node > data.rows) throw Error('Unverified cross-grid definition');
  const [ex, ey] = data.column_vector_native_xy, [sx, sy] = data.row_vector_native_xy;
  if (ex < 20 || sy < 20 || Math.abs(ey) > ex / 4 || Math.abs(sx) > sy / 4 || ex * sy - ey * sx < 400)
    throw Error('Invalid north-up cross-grid basis');
  return data;
}

export function latticePoint(column, row, grid) {
  const [x, y] = grid.origin_native_xy, [ex, ey] = grid.column_vector_native_xy, [sx, sy] = grid.row_vector_native_xy;
  return [x + ex * column + sx * row, y + ey * column + sy * row];
}

export function cellLabel(column, row) {
  return String.fromCharCode(65 + column) + (row + 1);
}

export function parseCell(value, grid) {
  const match = typeof value === 'string' && value.trim().toUpperCase().match(/^([A-Z])\s*-?\s*([1-9]\d?)$/);
  if (!match) return null;
  const column = match[1].charCodeAt(0) - 65, row = Number(match[2]) - 1;
  return column < grid.columns && row < grid.rows ? {column, row, label: cellLabel(column, row)} : null;
}

export function nativeReference(point, grid) {
  if (!finitePair(point) || point.some((v, i) => v < 0 || v > grid.native_size[i])) return null;
  const [dx, dy] = point.map((v, i) => v - grid.origin_native_xy[i]);
  const [ex, ey] = grid.column_vector_native_xy, [sx, sy] = grid.row_vector_native_xy;
  const det = ex * sy - ey * sx;
  const u = snap((dx * sy - dy * sx) / det), v = snap((dy * ex - dx * ey) / det);
  if (u < 0 || v < 0 || u >= grid.columns || v >= grid.rows) return null;
  const column = Math.floor(u), row = Math.floor(v);
  return {frame: grid.id, column, row, label: cellLabel(column, row), east: u - column, south: v - row};
}

export function referencePoint(cell, east, south, grid) {
  if (!cell || ![east, south].every(v => Number.isFinite(v) && v >= 0 && v <= 1)) return null;
  const valid = parseCell(cell.label, grid);
  if (!valid) return null;
  const xy = latticePoint(valid.column + east, valid.row + south, grid);
  return xy.every((v, i) => v >= 0 && v <= grid.native_size[i]) ? xy : null;
}

/* Clip edge cells to the original image; their labels never imply extra source pixels. */
export function cellPolygon(cell, grid) {
  let points = [[0, 0], [1, 0], [1, 1], [0, 1]].map(([x, y]) => latticePoint(cell.column + x, cell.row + y, grid));
  for (const [axis, bound, direction] of [[0, 0, 1], [0, grid.native_size[0], -1], [1, 0, 1], [1, grid.native_size[1], -1]]) {
    const next = [];
    for (let i = 0; i < points.length; i++) {
      const a = points[i], b = points[(i + 1) % points.length];
      const insideA = (a[axis] - bound) * direction >= 0, insideB = (b[axis] - bound) * direction >= 0;
      if (insideA) next.push(a);
      if (insideA !== insideB) {
        const t = (bound - a[axis]) / (b[axis] - a[axis]);
        next.push([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]);
      }
    }
    points = next;
  }
  return points;
}

export function cellCentre(cell, grid) {
  const points = cellPolygon(cell, grid);
  return points.length >= 3 ? [0, 1].map(axis => points.reduce((sum, p) => sum + p[axis], 0) / points.length) : null;
}

export function referenceText(ref) {
  if (!ref) return 'Move the centre cross onto the grid to read its reference.';
  return ref.label + ' · ' + Math.round(ref.east * 100) + '% east · ' + Math.round(ref.south * 100) + '% south';
}

export function referenceFromSearch(search, grid) {
  const params = new URLSearchParams(search), cell = parseCell(params.get('grid'), grid);
  if (!cell || (params.has('grid_frame') && params.get('grid_frame') !== grid.id)) return null;
  if (!params.has('grid_east') && !params.has('grid_south')) {
    const point = cellCentre(cell, grid);
    return point ? {cell, point} : null;
  }
  const fraction = key => {
    const value = params.get(key);
    return value === null ? .5 : /^(?:100|\d{1,2})(?:\.\d{1,3})?$/.test(value) && Number(value) <= 100 ? Number(value) / 100 : NaN;
  };
  const point = referencePoint(cell, fraction('grid_east'), fraction('grid_south'), grid);
  return point ? {cell, point} : null;
}

export function referenceURL(base, ref) {
  const url = new URL(base);
  url.searchParams.set('grid_frame', ref.frame);
  url.searchParams.set('grid', ref.label);
  url.searchParams.set('grid_east', (ref.east * 100).toFixed(3));
  url.searchParams.set('grid_south', (ref.south * 100).toFixed(3));
  return url.href;
}
