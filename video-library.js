/* AT-317: click-only standard YouTube embeds, no API or persistence. */
(() => {
  "use strict";
  let active=null;
  function close(card){
    if(!card)return;
    const host=card.querySelector(".vl-player"),button=card.querySelector("[data-load-video]");
    host.replaceChildren();host.hidden=true;button.textContent="Load video";button.setAttribute("aria-expanded","false");
  }
  for(const card of document.querySelectorAll(".vl-card[data-video-id]")){
    const id=card.dataset.videoId,button=card.querySelector("[data-load-video]"),host=card.querySelector(".vl-player");
    if(!/^[A-Za-z0-9_-]{11}$/.test(id)||!button||!host)continue;
    host.id=card.id+"-player";
    button.setAttribute("aria-controls",host.id);button.setAttribute("aria-expanded","false");
    button.hidden=false;
    button.addEventListener("click",()=>{
      if(active===card){close(card);active=null;return;}
      close(active);
      const frame=document.createElement("iframe");
      frame.title="BuddyVidz — "+card.querySelector("h2").textContent;
      frame.allow="encrypted-media; picture-in-picture; fullscreen";
      frame.allowFullscreen=true;
      frame.referrerPolicy="strict-origin-when-cross-origin";
      frame.src="https://www.youtube-nocookie.com/embed/"+id;
      host.replaceChildren(frame);host.hidden=false;
      button.textContent="Close video";button.setAttribute("aria-expanded","true");active=card;
    });
  }
})();
