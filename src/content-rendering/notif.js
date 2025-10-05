const doc = document;
const notif = doc.querySelector("#notif");
const THREE_SECONDS = 3 * 1000;

/**
 * Create toast notifications that disappear after a few seconds.
 * @todo caveat: I believe setting two notifications in quick succession might
 * not reset the timeout timer. 
 * @param {CustomEvent} evt has a message specified in .detail.message
 */
doc.addEventListener("customEvt:notification", (evt) => {
  notif.textContent = evt.detail.message;
  notif.classList.remove("hidden");

  setTimeout(() => {
    notif.textContent = null;
    notif.classList.add("hidden");
  }, THREE_SECONDS);
});