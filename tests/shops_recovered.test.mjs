import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {runInNewContext} from "node:vm";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const html=read("shops.html"),dataJs=read("shops-data.js"),script=read("shops.js"),css=read("shops.css"),source=read("src/template.html");
const context={window:{}};runInNewContext(dataJs,context);
const shops=JSON.parse(JSON.stringify(context.window.ATLAS_SHOPS));
assert.equal(shops.length,18);
assert.equal(new Set(shops.map(s=>s.id)).size,17);
assert.equal(shops.flatMap(s=>s.items).length,200);
assert.equal(shops.find(s=>s.id==="quasartico").items.length,40);
const cafe=shops.find(s=>s.id==="cafe-drinks");
assert.ok(cafe,"The player-confirmed café must be a distinct listing");
assert.equal(cafe.currency,"money");
assert.match(cafe.location,/unverified/i,"Do not infer a café location from screenshots");
assert.equal(cafe.items.length,10);
const expectedDrinks=[
 ["Coffee","Ember Roast",250],["Coffee","Flamethrower Roast",250],
 ["Coffee","Fire Blast Roast",250],["Coffee","Burn Up Roast",300],
 ["Tea","Panchamomile Tea",250],["Tea","Wooloolong Tea",300],["Tea","Roserade Tea",350],
 ["Something else","Moomoo Milk",200],["Something else","Fresh Water",100],["Something else","Sparkling Water",100]
];
assert.deepEqual(cafe.items.map(item=>[item.menu,item.name,item.price]),expectedDrinks,
 "Keep all ten prices and exact photographed menu order");
const cafeHtml=html.match(/<article class="shop-card shop-card-player" id="shop-cafe-drinks"[\s\S]*?<\/article>/)?.[0];
assert.ok(cafeHtml,"The player café must appear as a static, searchable shop card");
assert.match(cafeHtml,/1\. Coffee menu[\s\S]*2\. Tea menu[\s\S]*3\. Something else/);
assert.match(cafeHtml,/location and truck number not yet confirmed/i);
for(const [,name,price] of expectedDrinks){
 const escaped=name.replace(/[.*+?^${}()|[\]\\]/g,"\\assert.equal(shops.find(s=>s.id==="quasartico").items.length,40);
");
 assert.match(cafeHtml,new RegExp(escaped+'<\\/span><strong class="shop-item-price">₽'+price+'<\\/strong>'),
 "Static café price mismatch for "+name);
}
const premier=shops.find(s=>s.id==="boutique").items.find(x=>x.name==="Premier Ball");
assert.equal(premier.price,200);
assert.match(premier.priceVerification,/Confirmed in game by player/);
assert.match(html,/Premier Ball <span class="store-confirmed"/);
assert.equal([...new Set(shops.map(s=>s.currency))].sort().join(","),"money,screws,shards");
for(const [id,name,price] of [
["centers","Poké Ball",100],["centers","Great Ball",300],["centers","Ultra Ball",600],
["boutique","Premier Ball",200],["boutique","Luxury Ball",3000],
["stones","Old Amber",30000],["stones","Medichamite",30000],
["quasartico","Exp. Candy S",8],["quasartico","Lucarionite",240],
["quasartico","Sharpedonite",240],["quasartico","Metagrossite",360],
["dlc-shards","Douse Drive",540],["dlc-shards","Shock Drive",540],
["dlc-shards","Burn Drive",540],["dlc-shards","Chill Drive",540],
["held-left","Metal Coat",4980],["held-right","Life Orb",4980],["bread","Canari Bread",1300]
]){
 const shop=shops.find(s=>s.id===id);
 assert.equal(shop?.items?.find(x=>x.name===name)?.price,price,"Incorrect PDF price for "+name+" at "+id);
}
for(const name of ["Racine Construction","Quasartico Inc.","Mega Dimension","Poké Ball Boutique","Stone Emporium","Nouveau Café Truck No. 3","Sitrus Berry","Lum Berry","Colorful Screws","Magearna","Genesect","77 screws","100 Colorful Screws","2,160","999 Shards"])assert.ok(html.includes(name),"Missing PDF concept "+name);
assert.equal((html.match(/data-shop-card(?:\s|>)/g)||[]).length,18);
assert.equal((html.match(/data-shop-item(?:\s|>)/g)||[]).length,200);
assert.equal((html.match(/class="store-verify"/g)||[]).length,2);
const nav=html.match(/<nav class="atlas-article-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
const base=source.match(/<nav id="sideNav">([\s\S]*?)<\/nav>/)?.[1];
assert.ok(nav&&base);
assert.equal(nav.replace(' aria-current="page"',"").trim(),base.trim(),"Full guide menu should match its 25-link source");
assert.equal((nav.match(/<a /g)||[]).length,25);
assert.ok(nav.includes('href="shops.html" aria-current="page"'));
assert.ok(html.includes('href="index.html#walkthrough"'));
assert.ok(html.includes('id="atlasArticleFeedback"'));
for(const f of ["index.html","recovered-articles.js","recovered-articles.css","shops.js","shops.css","shops-data.js","feedback.html","type-chart.html","boss-guide.html","favicon.png","atlas-logo.png"])assert.ok(existsSync(new URL("../"+f,import.meta.url)),"Missing local resource "+f);
assert.match(css,/@media\(max-width:560px\)/);
assert.match(css,/grid-template-columns:1fr/);
assert.doesNotMatch(html+css+dataJs+script,/sb_secret_|service_role_key|sk-proj-|github_pat_/i);
assert.doesNotMatch(script+dataJs,/\bfetch\s*\(|localStorage|sessionStorage|XMLHttpRequest/);
function node(props={}){
 return {...props,hidden:false,textContent:"",attrs:{},events:{},
  addEventListener(t,fn){this.events[t]=fn},
  setAttribute(k,v){this.attrs[k]=v}};
}
const ui={};
for(const id of ["shopSearch","shopResultStatus","shopNoResults","shardGoal","shardsHeld","shardGap","shardExplanation","screwsHeld","screwGap","screwExplanation"])ui[id]=node();
ui.shopSearch.value="";
ui.shardGoal.value="240";
ui.shardsHeld.value="0";
ui.screwsHeld.value="0";
const cards=shops.map(s=>{
 const haystack=[s.name,s.location,s.unlock,s.detail,...s.items.map(x=>x.name)].join(" ").toLowerCase();
 const n=node({dataset:{currency:s.currency,shopSearch:haystack}});
 n.detail=node();
 n.querySelector=q=>q==="details.shop-inventory"?n.detail:null;
 return n;
});
const filters=["all","money","shards","screws"].map(v=>node({dataset:{shopFilter:v}}));
const levels=["pink","blue","red","gold","green"].map(color=>node({dataset:{canariColor:color},value:color==="red"?"1":"0"}));
runInNewContext(script,{document:{
 getElementById:k=>ui[k]||null,
 querySelectorAll:q=>q==="[data-shop-card]"?cards:q==="[data-shop-filter]"?filters:q==="[data-canari-level]"?levels:[]
},window:context.window});
assert.match(ui.shopResultStatus.textContent,/18 of 18/);
assert.equal(ui.shardGap.textContent,"240 Mega Shards still needed");
assert.equal(ui.screwGap.textContent,"77 Colorful Screws still needed");
filters[2].events.click();
assert.match(ui.shopResultStatus.textContent,/2 of 18/);
filters[0].events.click();
ui.shopSearch.value="Life Orb";
ui.shopSearch.events.input();
assert.match(ui.shopResultStatus.textContent,/1 of 18/);
const held=cards.find(x=>x.dataset.shopSearch.includes("life orb"));
assert.equal(held.hidden,false);
assert.equal(held.detail.attrs.open,"");
ui.shopSearch.value="unfindable_shop_name";
ui.shopSearch.events.input();
assert.equal(ui.shopNoResults.hidden,false);
ui.shardGoal.value="2160";
ui.shardGoal.events.change();
ui.shardsHeld.value="500";
ui.shardsHeld.events.input();
assert.equal(ui.shardGap.textContent,"1,660 Mega Shards still needed");
ui.shardGoal.value="3159";
ui.shardGoal.events.change();
assert.equal(ui.shardGap.textContent,"2,659 Mega Shards still needed");
ui.shardsHeld.value="4000";
ui.shardsHeld.events.input();
assert.equal(ui.shardGap.textContent,"You have enough Mega Shards");
ui.shardsHeld.value="-5";
ui.shardsHeld.events.input();
assert.equal(ui.shardGap.textContent,"Enter a valid amount");
const red=levels.find(x=>x.dataset.canariColor==="red");
const pink=levels.find(x=>x.dataset.canariColor==="pink");
red.value="0";
red.events.change();
assert.equal(ui.screwGap.textContent,"80 Colorful Screws still needed");
red.value="1";
red.events.change();
assert.equal(ui.screwGap.textContent,"77 Colorful Screws still needed");
pink.value="3";
pink.events.change();
assert.equal(ui.screwGap.textContent,"61 Colorful Screws still needed");
ui.screwsHeld.value="60";
ui.screwsHeld.events.input();
assert.equal(ui.screwGap.textContent,"1 Colorful Screw still needed");
for(const level of levels){level.value="3";level.events.change();}
assert.equal(ui.screwGap.textContent,"Enough screws to finish your plush upgrades");
ui.screwsHeld.value="101";
ui.screwsHeld.events.input();
assert.equal(ui.screwGap.textContent,"Enter valid screw counts and levels");
console.log("PASS: PDF 17 shop groups, 190 items, price flags, 25-link nav, currency budgets, no network or shared progress writes.");
