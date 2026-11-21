/* Interactive Z-A type matchups; entirely client-side and read-only.
   Source: owner PDF visible chart and Gen VI-onward rules.
   Special Rogue Mega encounter rules are deliberately not modelled. */
(() => {
  "use strict";
  const rules=window.ATLAS_TYPE_RULES;
  const attack=document.getElementById("typeAttack");
  const primary=document.getElementById("typePrimary");
  const secondary=document.getElementById("typeSecondary");
  const output=document.getElementById("typeMatchupResult");
  const formula=document.getElementById("typeMatchupFormula");
  const best=document.getElementById("typeBestAttacks");
  if(!Array.isArray(rules)||rules.length!==18||!attack||!primary||!secondary||!output||!formula||!best)return;
  const lookup=new Map(rules.map(row=>[row.type,row]));
  const multiplier=(move,defender)=>{
    const data=lookup.get(move);
    if(!data||!lookup.has(defender))return null;
    if(data.zero.includes(defender))return 0;
    if(data.super.includes(defender))return 2;
    if(data.half.includes(defender))return 0.5;
    return 1;
  };
  const display=v=>({0:"0×",0.25:"¼×",0.5:"½×",1:"1×",2:"2×",4:"4×"})[String(v)]||v+"×";
  const diagnosis=v=>v===0?"immune":v===4?"fourfold weakness":v===2?"super effective":v===1?"normal effectiveness":v===0.5?"resisted":v===0.25?"double resistance":"type multiplier";
  const rows=Array.from(document.querySelectorAll("[data-attack-row]"));
  const cells=Array.from(document.querySelectorAll("[data-attack][data-defender]"));
  const heads=Array.from(document.querySelectorAll("[data-defense-heading]"));
  function update(){
    const move=attack.value,one=primary.value;
    const two=secondary.value!==one?secondary.value:""; // A Pokémon cannot have two copies of the same type.
    const partA=multiplier(move,one),partB=two?multiplier(move,two):1;
    if(partA===null||partB===null)return;
    const effect=partA*partB;
    output.textContent=display(effect)+" — "+diagnosis(effect);
    formula.textContent=move+" attacking "+one+" ("+display(partA)+")"+
      (two?" × "+two+" ("+display(partB)+")":"")+" = "+display(effect)+". "+
      (secondary.value===one?"The same type counts only once.":"");
    const ranked=rules.map(row=>({type:row.type,effect:multiplier(row.type,one)*(two?multiplier(row.type,two):1)}));
    const maximum=Math.max(...ranked.map(x=>x.effect));
    const choices=ranked.filter(x=>x.effect===maximum).map(x=>x.type);
    best.textContent=(maximum>1?"Best standard coverage ("+display(maximum)+"): ":"Best available neutral coverage ("+display(maximum)+"): ")+
      choices.join(", ")+". This compares type advantage only, not move power or battle hazards.";
    for(const row of rows)row.classList.toggle("active-type-row",row.dataset.attackRow===move);
    for(const head of heads)head.classList.toggle("active-type-column",head.dataset.defenseHeading===one||(two&&head.dataset.defenseHeading===two));
    for(const cell of cells){
      const att=cell.dataset.attack===move;
      const def=cell.dataset.defender===one||(two&&cell.dataset.defender===two);
      cell.classList.toggle("active-type-column",!!def);
      cell.classList.toggle("active-crossing",!!att&&!!def);
    }
  }
  attack.addEventListener("change",update);
  primary.addEventListener("change",update);
  secondary.addEventListener("change",update);
  update();
})();
