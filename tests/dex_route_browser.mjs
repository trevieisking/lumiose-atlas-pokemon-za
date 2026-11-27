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
 assert.equal(await page.locator('#dexGrid [data-atlas-portal-route]').count(),18);
 for(const [dexIndex,route] of [[1,"1★ Fighting — catch Lv. 16–18; Alpha Lv. 25–27"],[2,"3★ Fighting — catch Lv. 28–30; Alpha Lv. 37–39"],[16,"2★ Steel — catch Lv. 18–20; Alpha Lv. 27–29"],[18,"4★ Fairy — catch Lv. 41–43; Alpha Lv. 50–52"],[35,"5★ Ghost — catch Lv. 62–64; Alpha Lv. 71–73"],[57,"3★ Fighting — catch Lv. 26–28; Alpha Lv. 35–37"],[58,"3★ Fighting — catch Lv. 26–28; Alpha Lv. 35–37"],[88,"4★ Ice — catch Lv. 38–40; Alpha Lv. 47–49"]]){
  const card=page.locator('#dex-hyperspace-'+dexIndex);
  await card.locator('button.dex-toggle').click();
  assert.ok((await card.innerText()).includes(route),route);
  assert.match(await card.innerText(),/not guaranteed spawns/);
  assert.ok(await card.getByRole("link",{name:"Portal ranks and donut preparation"}).isVisible());
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=1);
  await card.locator('button.dex-toggle').click();
 }
 assert.match(await page.locator('#dex-hyperspace-35 .dex-location').textContent(),/Chest Form/);
 assert.match(await page.locator('#dex-hyperspace-4 .dex-location').textContent(),/still being checked/);
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
