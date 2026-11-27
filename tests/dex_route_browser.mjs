import assert from "node:assert/strict";
import {chromium} from "playwright";

const base=process.env.ATLAS_TEST_URL??"http://127.0.0.1:8891";
const browser=await chromium.launch({executablePath:process.env.ATLAS_CHROMIUM||undefined});
for (const viewport of [{width:390,height:844},{width:1366,height:900}]) {
 const page=await browser.newPage({viewport});
 const errors=[];
 page.on("pageerror",e=>errors.push(e.message));
 // Check the guide also works if any disclosed third-party sprite fails.
 await page.route("https://raw.githubusercontent.com/**",r=>r.abort());
 await page.goto(base+"/index.html#pokedex");
 await page.locator("#dexCount").waitFor({state:"visible"});
 assert.equal(await page.locator("#dexGrid .dex-card:visible").count(),232);
 await page.locator("#dexSort").selectOption("speed");
 await page.getByRole("button",{name:"Hyperspace · 132"}).click();
 assert.equal(await page.locator("#dexCount").innerText(),"132 of 132 Hyperspace entries");
 assert.equal(await page.locator("#dexGrid .dex-card:visible").count(),132);
 assert.equal(await page.locator("#dexGrid .dex-card:visible").first().getAttribute("id"),"dex-hyperspace-1");
 assert.equal(await page.locator("#dexSort").inputValue(),"number");
 assert.equal(await page.locator('#dexSort option[value="speed"]').evaluate(el=>el.disabled),true);
 const fieldbookLinks=page.locator('#dexGrid [data-dex-region="Hyperspace"] a[href^="legendaries.html#legend-"]');
 assert.equal(await fieldbookLinks.count(),20);
 for(const [dexIndex,slug] of [[113,"heatran"],[115,"cobalion"],[120,"genesect"],[125,"darkrai"],[126,"latias"],[127,"latios"],[131,"magearna"]]){
  assert.equal(await page.locator('#dex-hyperspace-'+dexIndex+' a[href^="legendaries.html#legend-"]').getAttribute("href"),'legendaries.html#legend-'+slug);
 }
 for(const [dexIndex,method] of [[3,"Rage Fist"],[8,"three critical hits"],[36,"999 Gimmighoul Coins"],[49,"Prism Scale"],[61,"49 HP missing"],[98,"Auspicious Armor"],[99,"Malicious Armor"]]){
  const card=page.locator('#dex-hyperspace-'+dexIndex);
  await card.locator('button.dex-toggle').click();
  assert.ok((await card.innerText()).includes(method),method);
  await card.locator('button.dex-toggle').click();
 }
 assert.equal(await page.locator('#dexGrid [data-atlas-portal-route]').count(),202);
 for(const [dexIndex,route] of [[1,"1★ Fighting — catch Lv. 16–18; Alpha Lv. 25–27"],[2,"3★ Fighting — catch Lv. 28–30; Alpha Lv. 37–39"],[16,"2★ Steel — catch Lv. 18–20; Alpha Lv. 27–29"],[18,"4★ Fairy — catch Lv. 41–43; Alpha Lv. 50–52"],[35,"5★ Ghost — catch Lv. 62–64; Alpha Lv. 71–73"],[57,"3★ Fighting — catch Lv. 26–28; Alpha Lv. 35–37"],[58,"3★ Fighting — catch Lv. 26–28; Alpha Lv. 35–37"],[88,"4★ Ice — catch Lv. 38–40; Alpha Lv. 47–49"]]){
  const card=page.locator('#dex-hyperspace-'+dexIndex);
  await card.locator('button.dex-toggle').click();
  assert.ok((await card.innerText()).includes(route),route);
  assert.match(await card.innerText(),/not guaranteed spawns/);
  assert.ok(await card.getByRole("link",{name:"Portal ranks and donut preparation"}).isVisible());
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=1);
  await card.locator('button.dex-toggle').click();
 }
 for(const [dexIndex,expected,scan] of [[14,"2★ Grass — catch Lv. 17–19; Alpha Lv. 26–28",false],[39,"5★ Grass — catch Lv. 50–52; Alpha Lv. 59–61",true],[41,"5★ Grass — catch Lv. 54–56; Alpha Lv. 63–65",true],[44,"4★ Fighting — catch Lv. 41–43; Alpha Lv. 50–52",true],[45,"2★ Water — catch Lv. 16–18; Alpha Lv. 25–27",true],[47,"4★ Ground — catch Lv. 41–43; Alpha Lv. 50–52",true],[48,"2★ Water — catch Lv. 20–22; Alpha Lv. 29–31",false],[97,"2★ Fire — catch Lv. 19–21; Alpha Lv. 28–30",false],[112,"4★ Grass — catch Lv. 42–44; Alpha Lv. 51–53",false]]){
  const card=page.locator('#dex-hyperspace-'+dexIndex);
  await card.locator('button.dex-toggle').click();
  assert.ok((await card.innerText()).includes(expected),expected);
  assert.equal(await card.getByRole("link",{name:"Unlock Special Scans"}).count(),scan?1:0);
  if(scan)assert.match(await card.innerText(),/25,000 Hyperspace Survey Points/);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=1);
  await card.locator('button.dex-toggle').click();
 }
 for(const [dexIndex,expected] of [[28,"4★ Flying — catch Lv. 37–39; Alpha Lv. 46–48"],[50,"1★ Psychic — catch Lv. 14–16; Alpha Lv. 23–25"],[51,"3★ Psychic — catch Lv. 24–26; Alpha Lv. 33–35"],[53,"1★ Dark — catch Lv. 14–16; Alpha Lv. 23–25"],[54,"3★ Dark — catch Lv. 24–26; Alpha Lv. 33–35"],[55,"1★ Psychic — catch Lv. 15–17; Alpha Lv. 24–26"],[56,"4★ Psychic — catch Lv. 38–40; Alpha Lv. 47–49"],[64,"1★ Dark — catch Lv. 14–16; Alpha Lv. 23–25"],[65,"3★ Dark — catch Lv. 24–26; Alpha Lv. 33–35"],[73,"1★ Flying — catch Lv. 14–16; Alpha Lv. 23–25"],[74,"3★ Flying — catch Lv. 24–26; Alpha Lv. 33–35"],[75,"4★ Flying — catch Lv. 41–43; Alpha Lv. 50–52"],[76,"2★ Fairy — catch Lv. 17–19; Alpha Lv. 26–28"],[77,"3★ Fairy — catch Lv. 24–26; Alpha Lv. 33–35"],[78,"4★ Fairy — catch Lv. 39–41; Alpha Lv. 48–50"],[79,"2★ Fairy — catch Lv. 18–20; Alpha Lv. 27–29"],[80,"3★ Fairy — catch Lv. 27–29; Alpha Lv. 36–38"],[84,"1★ Psychic — catch Lv. 17–19; Alpha Lv. 26–28"],[85,"4★ Psychic — catch Lv. 40–42; Alpha Lv. 49–51"],[100,"1★ Dark — catch Lv. 17–19; Alpha Lv. 26–28"],[101,"4★ Dark — catch Lv. 39–41; Alpha Lv. 48–50"]]){
  const card=page.locator('#dex-hyperspace-'+dexIndex);
  await card.locator('button.dex-toggle').click();
  assert.ok((await card.innerText()).includes(expected),expected);
  assert.match(await card.innerText(),/not guaranteed spawns/);
  assert.equal(await card.getByRole("link",{name:"Unlock Special Scans"}).count(),0);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=1);
  await card.locator('button.dex-toggle').click();
 }
 for(const [dexIndex,expected] of [[71,"3★ Ground — catch Lv. 25–27; Alpha Lv. 34–36"],[71,"4★ Ground — catch Lv. 37–39; Alpha Lv. 46–48"],[72,"4★ Ground — catch Lv. 43–45; Alpha Lv. 52–54"],[81,"1★ Flying — catch Lv. 13–15; Alpha Lv. 22–24"],[81,"1★ Normal — catch Lv. 13–15; Alpha Lv. 22–24"],[81,"2★ Normal — catch Lv. 15–17; Alpha Lv. 24–26"],[81,"3★ Flying — catch Lv. 20–22; Alpha Lv. 29–31"],[82,"2★ Normal — catch Lv. 18–20; Alpha Lv. 27–29"],[82,"3★ Flying — catch Lv. 22–24; Alpha Lv. 31–33"],[82,"4★ Normal — catch Lv. 35–37; Alpha Lv. 44–46"],[83,"4★ Normal — catch Lv. 40–42; Alpha Lv. 49–51"],[89,"3★ Rock — catch Lv. 22–24; Alpha Lv. 31–33"],[90,"3★ Rock — catch Lv. 26–28; Alpha Lv. 35–37"],[90,"4★ Rock — catch Lv. 38–40; Alpha Lv. 47–49"],[91,"4★ Rock — catch Lv. 41–43; Alpha Lv. 50–52"],[92,"1★ Poison — catch Lv. 16–18; Alpha Lv. 25–27"],[92,"4★ Poison — catch Lv. 35–37; Alpha Lv. 44–46"],[93,"4★ Poison — catch Lv. 38–40; Alpha Lv. 47–49"],[94,"1★ Poison — catch Lv. 15–17; Alpha Lv. 24–26"],[94,"3★ Flying — catch Lv. 21–23; Alpha Lv. 30–32"],[95,"3★ Flying — catch Lv. 25–27; Alpha Lv. 34–36"],[95,"4★ Poison — catch Lv. 37–39; Alpha Lv. 46–48"],[96,"4★ Poison — catch Lv. 39–41; Alpha Lv. 48–50"],[106,"2★ Normal — catch Lv. 23–25; Alpha Lv. 32–34"],[107,"3★ Poison — catch Lv. 26–28; Alpha Lv. 35–37"]]){
  const card=page.locator('#dex-hyperspace-'+dexIndex);
  await card.locator('button.dex-toggle').click();
  assert.ok((await card.innerText()).includes(expected),expected);
  assert.match(await card.innerText(),/not guaranteed spawns/);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=1);
  await card.locator('button.dex-toggle').click();
 }
 for(const [dexIndex,expected,scan] of [[11,["3★ Normal — catch Lv. 21–23; Alpha Lv. 30–32","5★ Normal — catch Lv. 50–52; Alpha Lv. 59–61"],true],[12,["5★ Normal — catch Lv. 52–54; Alpha Lv. 61–63"],true],[13,["5★ Normal — catch Lv. 54–56; Alpha Lv. 63–65"],true],[19,["4★ Dragon — catch Lv. 38–40; Alpha Lv. 47–49","4★ Normal — catch Lv. 38–40; Alpha Lv. 47–49"],false],[20,["3★ Poison — catch Lv. 24–26; Alpha Lv. 33–35","3★ Rock — catch Lv. 24–26; Alpha Lv. 33–35","4★ Poison — catch Lv. 36–38; Alpha Lv. 45–47","4★ Rock — catch Lv. 36–38; Alpha Lv. 45–47"],false],[21,["4★ Poison — catch Lv. 41–43; Alpha Lv. 50–52","4★ Rock — catch Lv. 41–43; Alpha Lv. 50–52"],false],[23,["1★ Ghost — catch Lv. 17–19; Alpha Lv. 26–28","4★ Ghost — catch Lv. 36–38; Alpha Lv. 45–47"],false],[24,["4★ Ghost — catch Lv. 39–41; Alpha Lv. 48–50"],false],[27,["4★ Normal — catch Lv. 38–40; Alpha Lv. 47–49"],false],[29,["3★ Ice — catch Lv. 26–28; Alpha Lv. 35–37"],false],[32,["5★ Dragon — catch Lv. 52–54; Alpha Lv. 61–63","5★ Ice — catch Lv. 52–54; Alpha Lv. 61–63"],true],[33,["5★ Dragon — catch Lv. 54–56; Alpha Lv. 63–65","5★ Ice — catch Lv. 54–56; Alpha Lv. 63–65"],true],[34,["5★ Dragon — catch Lv. 57–59; Alpha Lv. 66–68","5★ Ice — catch Lv. 57–59; Alpha Lv. 66–68"],true],[60,["4★ Ghost — catch Lv. 40–42; Alpha Lv. 49–51"],false],[68,["3★ Ghost — catch Lv. 24–26; Alpha Lv. 33–35"],false]]){
  const card=page.locator('#dex-hyperspace-'+dexIndex);
  await card.locator('button.dex-toggle').click();
  for(const route of expected)assert.ok((await card.innerText()).includes(route),route);
  assert.match(await card.innerText(),/not guaranteed spawns/);
  assert.equal(await card.getByRole("link",{name:"Unlock Special Scans"}).count(),scan?1:0);
  if(scan)assert.match(await card.innerText(),/25,000 Hyperspace Survey Points/);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=1);
  await card.locator('button.dex-toggle').click();
 }
 for(const [dexIndex,expected,scan] of [[6,["4★ Steel — catch Lv. 39–41; Alpha Lv. 48–50"],false],[38,["5★ Poison — catch Lv. 53–55; Alpha Lv. 62–64"],true],[62,["1★ Bug — catch Lv. 17–19; Alpha Lv. 26–28","3★ Water — catch Lv. 23–25; Alpha Lv. 32–34"],false],[63,["3★ Water — catch Lv. 30–32; Alpha Lv. 39–41"],false],[69,["4★ Bug — catch Lv. 40–42; Alpha Lv. 49–51"],false],[70,["3★ Electric — catch Lv. 24–26; Alpha Lv. 33–35"],false]]){
  const card=page.locator('#dex-hyperspace-'+dexIndex);
  await card.locator('button.dex-toggle').click();
  for(const route of expected)assert.ok((await card.innerText()).includes(route),route);
  assert.match(await card.innerText(),/not guaranteed spawns/);
  assert.equal(await card.getByRole("link",{name:"Unlock Special Scans"}).count(),scan?1:0);
  if(scan)assert.match(await card.innerText(),/25,000 Hyperspace Survey Points/);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=1);
  await card.locator('button.dex-toggle').click();
 }
 assert.match(await page.locator('#dex-hyperspace-35 .dex-location').textContent(),/Chest Form/);
 for(const [dexIndex,expected,scan] of [[4,[["Alolan Meowth — 1★ Dark — catch Lv. 17–19; Alpha Lv. 26–28","1"],["Kantonian Meowth — 1★ Normal — catch Lv. 16–18; Alpha Lv. 25–27","0"],["Galarian Meowth — 2★ Steel — catch Lv. 19–21; Alpha Lv. 28–30","2"],["Kantonian Meowth — 3★ Normal — catch Lv. 22–24; Alpha Lv. 31–33","0"],["Alolan Meowth — 4★ Dark — catch Lv. 36–38; Alpha Lv. 45–47","1"],["Galarian Meowth — 4★ Steel — catch Lv. 36–38; Alpha Lv. 45–47","2"]],false],[5,[["Kantonian Persian — 3★ Normal — catch Lv. 28–30; Alpha Lv. 37–39","0"],["Alolan Persian — 4★ Dark — catch Lv. 39–41; Alpha Lv. 48–50","1"]],false],[7,[["Kantonian Farfetch’d — 2★ Normal — catch Lv. 18–20; Alpha Lv. 27–29","0"],["Galarian Farfetch’d — 3★ Fighting — catch Lv. 22–24; Alpha Lv. 31–33","1"]],false],[9,[["1★ Ground — catch Lv. 16–18; Alpha Lv. 25–27","0"],["4★ Fire — catch Lv. 36–38; Alpha Lv. 45–47","0"],["4★ Ground — catch Lv. 36–38; Alpha Lv. 45–47","0"]],false],[10,[["Alolan Marowak — 4★ Fire — catch Lv. 39–41; Alpha Lv. 48–50","1"],["Kantonian Marowak — 4★ Ground — catch Lv. 39–41; Alpha Lv. 48–50","0"]],false],[22,[["Rotom (ordinary form) — 5★ Electric — catch Lv. 52–54; Alpha Lv. 61–63","0"],["Heat Rotom — 5★ Electric — catch Lv. 54–56; Alpha Lv. 63–65","1"],["Wash Rotom — 5★ Electric — catch Lv. 54–56; Alpha Lv. 63–65","2"],["Frost Rotom — 5★ Electric — catch Lv. 54–56; Alpha Lv. 63–65","3"],["Fan Rotom — 5★ Electric — catch Lv. 54–56; Alpha Lv. 63–65","4"],["Mow Rotom — 5★ Electric — catch Lv. 54–56; Alpha Lv. 63–65","5"]],true],[31,[["Curly Form — 4★ Water — catch Lv. 38–40; Alpha Lv. 47–49","0"],["Droopy Form — 4★ Water — catch Lv. 38–40; Alpha Lv. 47–49","1"],["Stretchy Form — 4★ Water — catch Lv. 38–40; Alpha Lv. 47–49","2"]],false],[37,[["Johtonian Qwilfish — 2★ Water — catch Lv. 19–21; Alpha Lv. 28–30","0"],["Hisuian Qwilfish — 3★ Poison — catch Lv. 23–25; Alpha Lv. 32–34","1"],["Hisuian Qwilfish — 5★ Poison — catch Lv. 51–53; Alpha Lv. 60–62","1"]],true],[52,[["Male Indeedee — 3★ Normal — catch Lv. 24–26; Alpha Lv. 33–35","0"],["Female Indeedee — 3★ Normal — catch Lv. 24–26; Alpha Lv. 33–35","1"]],false],[59,[["Unovan Yamask — 1★ Ghost — catch Lv. 18–20; Alpha Lv. 27–29","0"],["Galarian Yamask — 3★ Ghost — catch Lv. 24–26; Alpha Lv. 33–35","1"],["Galarian Yamask — 3★ Ground — catch Lv. 24–26; Alpha Lv. 33–35","1"],["Unovan Yamask — 4★ Ghost — catch Lv. 36–38; Alpha Lv. 45–47","0"]],false],[86,[["Green Plumage — 1★ Normal — catch Lv. 17–19; Alpha Lv. 26–28","0"],["Blue Plumage — 1★ Normal — catch Lv. 17–19; Alpha Lv. 26–28","1"],["Yellow Plumage — 1★ Normal — catch Lv. 17–19; Alpha Lv. 26–28","2"],["White Plumage — 1★ Normal — catch Lv. 17–19; Alpha Lv. 26–28","3"]],false],[102,[["2★ Electric — catch Lv. 19–21; Alpha Lv. 28–30","0"],["4★ Electric — catch Lv. 36–38; Alpha Lv. 45–47","0"]],false],[103,[["Amped Form — 4★ Electric — catch Lv. 39–41; Alpha Lv. 48–50","0"],["Low Key Form — 4★ Electric — catch Lv. 39–41; Alpha Lv. 48–50","1"]],false],[104,[["1★ Poison — catch Lv. 16–18; Alpha Lv. 25–27","0"],["3★ Normal — catch Lv. 22–24; Alpha Lv. 31–33","0"],["4★ Poison — catch Lv. 36–38; Alpha Lv. 45–47","0"]],false],[105,[["3★ Normal — catch Lv. 28–30; Alpha Lv. 37–39","0"],["4★ Poison — catch Lv. 39–41; Alpha Lv. 48–50","0"]],false],[108,[["1★ Psychic — catch Lv. 17–19; Alpha Lv. 26–28","0"],["2★ Fairy — catch Lv. 20–22; Alpha Lv. 29–31","0"],["3★ Psychic — catch Lv. 23–25; Alpha Lv. 32–34","0"]],false],[109,[["Galarian Mr. Mime — 3★ Ice — catch Lv. 33–35; Alpha Lv. 42–44","1"],["Kantonian Mr. Mime — 3★ Psychic — catch Lv. 33–35; Alpha Lv. 42–44","0"],["Galarian Mr. Mime — 4★ Ice — catch Lv. 40–42; Alpha Lv. 49–51","1"]],false],[110,[["4★ Ice — catch Lv. 42–44; Alpha Lv. 51–53","0"]],false]]){
  const card=page.locator('#dex-hyperspace-'+dexIndex);
  await card.locator('button.dex-toggle').click();
  const rows=card.locator('[data-atlas-portal-route]');
  assert.equal(await rows.count(),expected.length);
  assert.deepEqual(await rows.allTextContents(),expected.map(r=>r[0]));
  assert.deepEqual(await rows.evaluateAll(elements=>elements.map(el=>el.dataset.atlasPortalForm)),expected.map(r=>r[1]));
  assert.match(await card.innerText(),/not guaranteed spawns/);
  assert.equal(await card.getByRole("link",{name:"Unlock Special Scans"}).count(),scan?1:0);
  if(scan)assert.match(await card.innerText(),/25,000 Hyperspace Survey Points/);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=1);
  await card.locator('button.dex-toggle').click();
 }
 assert.equal(await page.locator('#dexGrid [data-dex-region="Hyperspace"] .dex-location').filter({hasText:'Capture routes and stats for this entry are still being checked.'}).count(),0);
 assert.equal(await page.locator('#dexGrid [data-dex-region="Hyperspace"] a[href^="home-connection.html#home-species-"]').count(),132);
 await page.getByRole("button",{name:"Electric",exact:true}).click();
 assert.ok(await page.locator("#dexGrid .dex-card:visible").count()<132);
 await page.getByRole("button",{name:"All",exact:true}).click();
 await page.getByRole("searchbox",{name:"Search Pokédex"}).fill("zeraora");
 assert.equal(await page.locator("#dexGrid .dex-card:visible").count(),1);
 const zeraora=page.getByRole("button",{name:"Zeraora, show catalogue links"});
 await zeraora.click();
 assert.equal(await zeraora.getAttribute("aria-expanded"),"true");
 const route=page.getByRole("link",{name:"Open verified catch guide"});
 assert.match(await route.getAttribute("href"),/#legend-zeraora$/);
 await route.click();
 await page.locator("#legend-zeraora summary").click();
 assert.match(await page.locator("#legend-zeraora").innerText(),/400 Sour/);
 const z=page.locator('[data-atlas-legend="Zeraora"]');
 await z.check();
 await page.reload();
 assert.ok(await z.isChecked());
 await page.goto(base+"/legendaries.html#legend-hoopa");
 await page.locator("#legend-hoopa summary").click();
 assert.match(await page.locator("#legend-hoopa").innerText(),/15th Infinite Z-A Royale Reward Match/);
 await page.locator("#legend-hoopa").getByRole("link",{name:"Side Mission 196"}).click();
 if(!await page.locator("#quest-196 details").evaluate(el=>el.open))await page.locator("#quest-196 summary").click();
 assert.match(await page.locator("#quest-196").innerText(),/5-star portal southwest of Wild Zone 16/);
 await page.goto(base+"/home-connection.html#volcanion");
 assert.match(await page.locator("#volcanion").innerText(),/131 required entries \(Zeraora is not required\)/);
 assert.equal(await page.locator("[data-home-register]").count(),364);
 await page.goto(base+"/index.html#pokedex");
 await page.locator("#dexCount").waitFor({state:"visible"});
 assert.equal(await page.locator("#dexGrid .dex-card:visible").count(),232);
 assert.equal(await page.locator('#dexSort option[value="speed"]').evaluate(el=>el.disabled),false);
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
 assert.ok(overflow<=1,`horizontal overflow at ${viewport.width}px: ${overflow}`);
 assert.deepEqual(errors,[]);
 console.log(`Verified Pokédex, Hoopa, Zeraora, HOME and preserved checkoffs at ${viewport.width}px.`);
 await page.close();
}
await browser.close();
