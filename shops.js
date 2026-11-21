/* PDF-recovered Lumiose Shops: search, Mega Shard and Canari planner.
   No network calls, storage, gameplay writes, or access to the original site. */
(() => {
 "use strict";
 const catalog=window.ATLAS_SHOPS;
 const cards=Array.from(document.querySelectorAll("[data-shop-card]"));
 const search=document.getElementById("shopSearch");
 const filters=Array.from(document.querySelectorAll("[data-shop-filter]"));
 const status=document.getElementById("shopResultStatus");
 const empty=document.getElementById("shopNoResults");
 if(!Array.isArray(catalog)||catalog.length!==17||cards.length!==17||!search||!status)return;
 let currency="all";
 function updateStores(){
   const q=search.value.trim().toLocaleLowerCase();
   let visible=0;
   for(const card of cards){
     const match=(currency==="all"||card.dataset.currency===currency)&&(!q||card.dataset.shopSearch.includes(q));
     card.hidden=!match;
     if(match)visible++;
     if(match&&q)card.querySelector("details.shop-inventory")?.setAttribute("open","");
   }
   for(const button of filters)button.setAttribute("aria-pressed",String(button.dataset.shopFilter===currency));
   status.textContent=visible+" of 17 shop groups shown · 190 listed items";
   if(empty)empty.hidden=visible!==0;
 }
 search.addEventListener("input",updateStores);
 for(const b of filters)b.addEventListener("click",()=>{currency=b.dataset.shopFilter;updateStores()});
 updateStores();
 const goal=document.getElementById("shardGoal");
 const held=document.getElementById("shardsHeld");
 const gap=document.getElementById("shardGap");
 const explanation=document.getElementById("shardExplanation");
 const fmt=n=>Number(n).toLocaleString("en-GB");
 function validInteger(input,max=999999){
   const n=Number(input.value);
   return input.value.trim()!==""&&Number.isSafeInteger(n)&&n>=0&&n<=max?n:null;
 }
 function updateShards(){
   if(!goal||!held||!gap||!explanation)return;
   const count=validInteger(held);
   const cost=Number(goal.value);
   if(count===null||![180,240,360,2160,999,3159].includes(cost)){
     gap.textContent="Enter a valid amount";
     explanation.textContent="Use a whole number of Mega Shards, 0–999,999.";
     return;
   }
   const missing=Math.max(0,cost-count);
   gap.textContent=missing?fmt(missing)+" Mega Shards still needed":"You have enough Mega Shards";
   explanation.textContent="Goal: "+fmt(cost)+" Shards · held: "+fmt(count)+" · shortfall: "+fmt(missing)+". "+
     (cost===3159?"This combines two separate DLC side-quest goals.":"");
 }
 goal?.addEventListener("change",updateShards);
 held?.addEventListener("input",updateShards);
 updateShards();
 const levelInputs=Array.from(document.querySelectorAll("[data-canari-level]"));
 const screws=document.getElementById("screwsHeld");
 const screwGap=document.getElementById("screwGap");
 const screwText=document.getElementById("screwExplanation");
 const spent=[0,3,8,16];
 function updateScrews(){
   if(levelInputs.length!==5||!screws||!screwGap||!screwText)return;
   const count=validInteger(screws,100);
   const levels=levelInputs.map(x=>Number(x.value));
   if(count===null||levels.some(x=>!Number.isInteger(x)||x<0||x>3)){
     screwGap.textContent="Enter valid screw counts and levels";
     screwText.textContent="Screws in your bag: 0–100. Current plush levels: 0–3.";
     return;
   }
   const remaining=levels.reduce((sum,lvl)=>sum+16-spent[lvl],0);
   const shortfall=Math.max(0,remaining-count);
   screwGap.textContent=shortfall?fmt(shortfall)+(shortfall===1?" Colorful Screw still needed":" Colorful Screws still needed"):"Enough screws to finish your plush upgrades";
   screwText.textContent="Cost to max all five from these levels: "+fmt(remaining)+
     " Screws · in bag: "+fmt(count)+" · still to find for these upgrades: "+fmt(shortfall)+
     ". You must separately locate all 100 unique screws for the giant Hotel Z plush.";
 }
 for(const s of levelInputs)s.addEventListener("change",updateScrews);
 screws?.addEventListener("input",updateScrews);
 updateScrews();
})();