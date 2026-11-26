"""Read only the pinned spawner table; run with the original's local path."""
from collections import Counter
from hashlib import sha1
import json
from pathlib import Path
from struct import unpack_from
import sys
b=Path(sys.argv[1]).read_bytes()
assert sha1(('blob %d\0'%len(b)).encode()+b).hexdigest()=='89773299d7b440731a65ea2491fce6f363db1193'
def u(i): return unpack_from('<I',b,i)[0]
def s(i): return unpack_from('<i',b,i)[0]
def h(i): return unpack_from('<H',b,i)[0]
def field(t,k):
    v=t-s(t)
    offset=h(v+4+2*k) if 4+2*k<h(v) else 0
    return t+offset if offset else 0
def vec(t,k):
    f=field(t,k)
    if not f:return []
    v=f+u(f)
    return [j+u(j) for j in range(v+4,v+4+4*u(v),4)]
def string(v): return b[v+4:v+4+u(v)].decode()
def st(t,k):
    f=field(t,k)
    return string(f+u(f)) if f else ''
groups=vec(u(0),0)
spawners=[p for g in groups for p in vec(g,0)]
assert (len(groups),len(spawners))==(11,1215)
rows={}
for p in spawners:
    for table in vec(p,2):
        name=st(table,0)
        cond=[]
        for g in vec(table,1):
            for e in vec(g,0):
                for c in vec(e,0):
                    cond.append([st(c,0),s(field(c,1)) if field(c,1) else 0,[string(v) for v in vec(c,2)]])
        if name.endswith('_2619') or st(p,0) in ('id_itb_a0103_01','id_itb_a0103_02','id_itb_a0103_14'):
            rows[st(p,0)]=dict(item=name,conditions=cond)
screws={k:r for k,r in rows.items() if r['item'].endswith('_2619')}
assert len(screws)==100
summary=Counter((r['conditions'][0][0],r['conditions'][0][1]) for r in screws.values())
assert summary=={('force_condition',0):95,('phase_condition',5):5}
assert rows['id_itb_t1_i011_01']['conditions']==[['phase_condition',5,['50100']]]
print(json.dumps({'screw_phase_rows':{k:r for k,r in screws.items() if r['conditions'][0][0]=='phase_condition'},'wz02':{k:r for k,r in rows.items() if k.startswith('id_itb_a0103_')}},indent=2))
