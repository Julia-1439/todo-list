import { internalControl } from "./barrel.js";

/* ========================================================================== */
/* SET VARIABLES */
/* ========================================================================== */

// @note cannot export this from barrel due to what I believe is circular dependency between displayControl and barrel
const doc = document; 

/* Sidebar */
const sbar = doc.querySelector("#sidebar");
const sbarAddTask = doc.querySelector("#sidebar-add-task")
const sbarAddProject = doc.querySelector("#sidebar-add-project")

/* Main content section */
const main = doc.querySelector("#main");

/* Notification box */
const notif = doc.querySelector("#notif");

/* ========================================================================== */
/* INITIALIZATION: add event listeners and load the page from storage */
/* ========================================================================== */

(function addEventListeners() {
  // @todo
})();

function load() {
  const loadData = internalControl.initialize();
  updateSidebar();  

  // @todo call render project
}




/* ========================================================================== */
/* HELPERS */
/* ========================================================================== */

function updateSidebar() {
  const projectTitles = internalControl.viewProjectTitles();
  projectTitles.reverse(); // sort descending by project creation date
  projectTitles.forEach((title) => {
    console.log(title);
  });
}

/**
 * 
 * @param {HTMLElement} container 
 */
function wipe(container) {
  while (container.firstChild) {
    container.removeChild(container.lastChild);
  }
}

/**
 * 
 * @param {String} content 
 */
function displayNotif(content) {
  console.log(content);
  // notif.textContent = content;
}

/* ========================================================================== */
/* CRUD for projects */
/* ========================================================================== */


/* ========================================================================== */
/* CRUD for todos */
/* ========================================================================== */



/* ========================================================================== */
/* EXPORTS */
/* ========================================================================== */


export { load };

// @todo these exports will be removed once testing is done
export { wipe, displayNotif };