import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');const data=JSON.parse(read('game-content-data.json'));const html=read('game-content.html');
test('AT-347: bounded reference catalogue, stable IDs and preserved unknown coordinates',()=>{assert.equal(data.cafes.length,17);assert.equal(data.restaurants.length,4);assert.equal(data.centres.length,9);assert.equal(data.titles.length,55);assert.equal(data.tracks.length,34);assert.equal(data.rushRoster.length,27);const rows=[...data.cafes,...data.restaurants,...data.services,...data.centres,...data.titles,...data.tracks,...data.gifts,...data.trades];assert.equal(new Set(rows.map(x=>x.id)).size,rows.length);for(const row of rows){assert.ok(html.includes('id="'+row.id+'"'),row.id);assert.ok(data.sources[row.source]?.length,row.id);}for(const c of data.cafes){assert.equal(c.coordinate,null);assert.ok(c.menu.length>0);for(const m of c.menu){assert.ok(Number.isInteger(m.price)&&m.price>0);}}assert.equal(data.cafes.filter(x=>x.name.startsWith('Nouveau Café')).length,3);assert.equal(data.titles.find(x=>x.name==='Fashion Leader').tiers[2],1000000);assert.ok(data.tracks.every(x=>x.unlock===null));assert.ok(data.services.every(x=>x.coordinate===null));assert.ok(data.sections.every(([id])=>html.includes('id="'+id+'"')));assert.deepEqual(data.rushRoster.slice(20),["Heatran","Mega Zeraora","Darkrai","Primal Groudon","Primal Kyogre","Mega Rayquaza","Zygarde"]); assert.deepEqual([...html.match(/id="rogue-rush"[\s\S]*?<ol>([\s\S]*?)<\/ol>/)[1].matchAll(/<li>([^<]+)<\/li>/g)].map(m=>m[1]),data.rushRoster); assert.match(html,/quest-EX3/); assert.match(html,/₽3,400, TM130 Charge Beam/);assert.equal(data.restaurants.find(x=>x.id==='restaurant-le-wow').repeat_reward,'10 Pearl Strings; 10 Exp. Candy L');assert.match(html,/10 Pearl Strings; 10 Exp\. Candy L/);});
test('AT-347: existing article routes discover the hub; no new state/network operations',()=>{for(const p of ['shops.html','battles.html','coverage.html','hair-beauty-guide.html','boss-guide.html','mega-dimension.html'])assert.ok(read(p).includes('href="game-content.html#'),p);assert.doesNotMatch(read('game-content.js'),/localStorage|sessionStorage|fetch\s*\(|XMLHttpRequest|supabase|indexedDB|document\.cookie/i);assert.match(html,/not a claim that every objective is mandatory/);assert.doesNotMatch(html,/https?:\/\//);});

test('AT-347: verified gift, restaurant repeat and ranked season requirements stay synchronized',()=>{const coin=data.gifts.find(x=>x.id==='gift-coin-collection');assert.match(coin.requirement,/gives you Gimmighoul and 413 coins/);assert.match(html,/gives you Gimmighoul and 413 coins/);assert.doesNotMatch(html,/collect 413 Gimmighoul Coins for the associated gift/);for(const r of data.restaurants){assert.equal(r.unlock,'Complete Side Mission '+r.mission+' to unlock paid repeat visits.');assert.ok(html.includes('Free opening course: Side Mission '+r.mission));}assert.match(html,/do not count toward Mable's Trainer-battle wins/);assert.ok(data.titles.filter(x=>x.id.startsWith('title-z-a-battle-club-')).every(x=>x.description.includes('during a Ranked Battles season')));});

test('AT-347: restaurant rewards, training checkpoints and camera/friendship guidance',()=>{const s=Object.fromEntries(data.services.map(x=>[x.id,x]));assert.match(s['service-ev-removal'].description,/Main Mission 20/);assert.match(s['service-hyper-training'].description,/Main Mission 19/);assert.match(s['service-plus-move-mastery'].description,/Main Mission 19/);assert.match(s['service-special-scan'].description,/Philippe/);assert.equal(data.mechanics_review.friendship.cafe_active_gain,30);assert.equal(data.mechanics_review.friendship.bench_party_gain,10);assert.equal(data.mechanics_review.photo.perspective_toggle,'Y');assert.match(html,/Switch between first and third person/);assert.match(html,/adds 30 friendship to the active Pokémon/);assert.ok(data.restaurants.every(r=>r.repeat_reward&&r.coordinate===null));});

test('AT-347: field camera controls and scripted rooftop photo are distinct',()=>{
 const photo=html.match(/id="photo">([\s\S]*?)<\/section>/)[1];
 assert.match(photo,/<caption>Rotom Phone controls on Switch and Switch 2/);
 assert.equal((photo.match(/scope="row"/g)||[]).length,9);
 assert.match(photo,/<kbd>−<\/kbd>/); assert.match(photo,/console’s <strong>Album/);
 assert.match(photo,/side-missions\.html#quest-144/);
});

test('AT-347: training services give distinct unlocks and spending choices',()=>{
 const row=id=>data.services.find(s=>s.id==='service-'+id).description;
 assert.match(row('hyper-training'),/Main Mission 19.*?attendant on the right.*?Lv\. 50/);
 assert.match(row('iv-judge'),/credits.*?open Boxes.*?press the right stick.*?still missing, visit a Pokémon Center/);
 assert.match(row('ev-removal'),/five Mega Shards.*?Main Mission 20.*?Main Mission 25/);
 assert.match(row('plus-move-mastery'),/master naturally.*?only by TM.*?While Mega Evolved/);
 assert.match(html,/160 plus any species-specific condition.*?255.*?1\/24 to 1\/12/);
 assert.match(html,/252 EVs in one stat and 510 overall/);
});

test('AT-347: first-clear restaurant rewards are distinct from paid repeats',()=>{
 const restaurants=data.restaurants;
 assert.deepEqual(restaurants.map(x=>x.fee),[3000,15000,30000,100000]);
 assert.equal(2*20000-restaurants[2].fee,10000);
 assert.equal(10*10000+10*2640-restaurants[3].fee,26400);
 assert.equal(10*2640*1.5,39600);
 for(const row of restaurants){
  const card=html.split('id="'+row.id+'">')[1].split('</article>')[0];
  assert.ok(card.includes(row.first_clear_reward));
  assert.ok(card.includes(row.repeat_tip));
 }
});

test('AT-347: all Nouveau Café trucks share one verified low-cost friendship menu',()=>{
 const trucks=data.cafes.filter(c=>c.name.startsWith('Nouveau Café'));
 assert.equal(trucks.length,3);
 for(const truck of trucks){
  assert.deepEqual(truck.menu,trucks[0].menu);
  assert.equal(truck.menu.length,10);
  assert.deepEqual(truck.menu.filter(x=>x.price===100).map(x=>x.name),['Fresh Water','Sparkling Water']);
 }
 assert.equal(Math.ceil((255-160)/30)*100,400);
 assert.match(html,/four orders reach 255 for ₽400/);
 assert.match(html,/regular ₽100,000|ordinary ₽100,000/);
});

test('AT-347: the collector recovers misses, not failed catches, before a paid restock',()=>{
 const id='service-lost-poke-ball-collectors';
 const card=html.split('id="'+id+'">')[1].split('</article>')[0];
 for(const value of [card,data.services.find(s=>s.id===id).description]){
  assert.match(value,/orange speech bubble.*?clean misses free.*?same ball type/);
  assert.match(value,/failed to catch the Pokémon are not returned/);
  assert.match(value,/10 standard Poké Balls together for ₽1,000/);
 }
 assert.match(card,/shops\.html#shop-centers/);
});
