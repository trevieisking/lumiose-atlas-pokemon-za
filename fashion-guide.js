/* Keep new fashion guide feedback context accurate after in-page navigation.
   Existing feedback controller, form and backend are unchanged. */
(() => {
  "use strict";
  const link = document.getElementById("atlasArticleFeedback");
  if (!link) return;
  function syncFeedback() {
    const url = new URL("feedback.html", location.href);
    url.searchParams.set("page", location.pathname + location.hash);
    link.href = url.href;
  }
  window.addEventListener("hashchange", syncFeedback);
  window.addEventListener("pageshow", syncFeedback);
  link.addEventListener("click", syncFeedback);
  syncFeedback();
})();
