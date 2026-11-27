/* AT-345: non-destructive enhancement of the existing 48-sector clue cards.
 * The original crop stays in a disclosure; the new contextual photograph uses
 * exactly the same immutable Git blob as the archived owner screenshot. */
import {sectorContextFor,sectorContextImageStyle} from './atlas-sector-context.mjs';
const safeSource=path=>typeof path==='string'&&/^assets\/atlas\/sector-context\/20261126_\d{6}\.jpg$/.test(path);
for(const card of document.querySelectorAll('[data-sector-card]')){
  const sectorId=card.id.replace(/^sector-/,'');
  const context=sectorContextFor(sectorId);
  const original=card.querySelector('figure.sector-source-map');
  if(!context||!original||!safeSource(context.path))continue;

  const image=document.createElement('img');
  image.className='sector-context-image';
  image.src=context.path;image.alt=card.querySelector('h3')?.textContent+' and the surrounding original north-up game map';
  image.width=context.width;image.height=context.height;
  image.decoding='async';image.loading='lazy';
  image.style.cssText=sectorContextImageStyle(context);

  const frame=document.createElement('span');frame.className='sector-context-window';frame.append(image);
  const link=document.createElement('a');link.href=context.path;
  link.target='_blank';link.rel='noopener noreferrer';
  link.setAttribute('aria-label','Open complete original map photograph for '+(card.querySelector('h3')?.textContent||sectorId));
  link.append(frame);
  const figure=document.createElement('figure');figure.className='sector-context-photo';
  const caption=document.createElement('figcaption');
  caption.textContent='Wider original map view · Nearby roads, buildings and landmarks. Tap to open the complete photograph. Orientation only; not an exact pickup or sector-border pin.';
  figure.append(link,caption);

  const closeup=document.createElement('details');closeup.className='sector-context-detail';
  const summary=document.createElement('summary');summary.textContent='Show preserved small-detail screenshot';
  closeup.append(summary);
  original.before(figure,closeup);
  closeup.append(original);
  image.addEventListener('error',()=>{
    figure.remove();closeup.open=true;
  },{once:true});
}
