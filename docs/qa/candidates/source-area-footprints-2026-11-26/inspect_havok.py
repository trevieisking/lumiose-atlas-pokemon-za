"""Read-only probe for the public named-area TRCOL candidate.

Havok tagfile/type decoding follows pkNX.Structures/Havok/HavokCollision.cs
at kwsch/pkNX 3bc649eea311ab1f249af43a562f8d70fe90ed9b. This is research,
not approved map geometry, and does not read or extract a game installation.
"""
from pathlib import Path
import json
import struct
import sys


def sections(buf):
    off = 0
    while off < len(buf):
        n = int.from_bytes(buf[off:off+4], 'big') & 0x3fffffff
        assert n >= 8 and off + n <= len(buf), (off, n, len(buf))
        yield buf[off+4:off+8].decode('ascii'), buf[off+8:off+n]
        off += n


class VarReader:
    def __init__(self, data):
        self.data = data
        self.pos = 0

    def get(self):
        first = self.data[self.pos]
        mode = first >> 3
        n, mask = (1, 0xff) if mode <= 15 else (2, 0x3fff) if mode <= 23 else (3, 0x1fffff) if mode <= 27 else (4, 0x7ffffff) if mode == 28 else (5, 0x7ffffffff) if mode == 29 else (8, 0x7ffffffffffffff) if mode == 30 else (0, 0)
        assert n and self.pos + n <= len(self.data), (self.pos, mode)
        value = int.from_bytes(self.data[self.pos:self.pos+n], 'big') & mask
        self.pos += n
        return value


def read_tagfile(data):
    assert data[4:8] == b'TAG0'
    root = dict(sections(data[8:]))
    meta = dict(sections(root['TYPE']))
    names = meta['TST1'].split(b'\0')
    field_names = meta['FST1'].split(b'\0')
    r = VarReader(meta['TNA1'])
    count = r.get()
    types = [dict(name='Invalid', fields=[])]
    # TNA1 count includes the null type at index zero; remaining bytes are padding.
    for _ in range(count - 1):
        ni, nt = r.get(), r.get()
        params = []
        for _ in range(nt):
            params.append(dict(name=names[r.get()].decode('ascii'), value=r.get()))
        types.append(dict(name=names[ni].decode('ascii'), params=params, fields=[]))
    assert not any(r.data[r.pos:]), r.data[r.pos:]
    r = VarReader(meta['TBDY'])
    while r.pos < len(r.data):
        ti = r.get()
        if not ti:
            continue
        t = types[ti]
        t['parent'], opt = r.get(), r.get()
        t['option'] = opt
        for bit, key in [(1, 'format'), (2, 'subtype'), (4, 'version')]:
            if opt & bit:
                t[key] = r.get()
        if opt & 8:
            t['size'], t['align'] = r.get(), r.get()
        if opt & 16:
            t['flags'] = r.get()
        if opt & 32:
            for _ in range(r.get() & 0xffff):
                t['fields'].append(dict(name=field_names[r.get()].decode('ascii'), flags=r.get(), offset=r.get(), type=r.get()))
        if opt & 64:
            t['interfaces'] = [dict(type=r.get(), name=field_names[r.get()].decode('ascii')) for _ in range(r.get())]
        if opt & 128:
            t['attribute'] = r.get()
    idx = dict(sections(root['INDX']))['ITEM']
    assert len(idx) % 12 == 0
    items = []
    for flags, off, count in struct.iter_unpack('<III', idx):
        ti = flags & 0xffffff
        items.append(dict(type=ti, name=types[ti]['name'], flags=flags >> 24, offset=off, count=count))
    return root['DATA'], types, items


def main(path):
    data, types, items = read_tagfile(path.read_bytes())
    result = dict(data_size=len(data), types=types, items=items)
    for item in items:
        t = types[item['type']]
        size = t.get('size', 0)
        n = min(item['count'] * size, 128)
        item['head_hex'] = data[item['offset']:item['offset'] + n].hex()
    dest = path.with_suffix(path.suffix + '.analysis.json')
    dest.write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps(dict(path=str(path), data_size=len(data), items=[{k:v for k,v in x.items() if k!='head_hex'} for x in items]), indent=2))
    return result


if __name__ == '__main__':
    main(Path(sys.argv[1]))
