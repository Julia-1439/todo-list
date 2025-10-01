import { internalControl } from "./barrel.js";

/* ========================================================================== */
/* SET VARIABLES */
/* ========================================================================== */

const THREE_SECONDS = 3 * 1000;
const doc = document; 


/* ========================================================================== */
/* INITIALIZATION: add evt listeners to *permanent* fixtures, and load data from storage */
/* ========================================================================== */

/* Sidebar */
(function initListenersSidebar() {
  const createProjectBtn = doc.querySelector("#sidebar-create-project-btn");
  createProjectBtn.addEventListener("click", () => {
    const dialog = doc.querySelector("#cu-project-dialog");
    const form = doc.querySelector("#cu-project-form");

    form.dataset.operation = "create";
    form.querySelectorAll("span[data-operation]").forEach((blankToFill) => {
      blankToFill.textContent = "create";
    });
    
    dialog.showModal();
  });

  const createTodoBtn = doc.querySelector("#sidebar-create-todo-btn");
  createTodoBtn.addEventListener("click", () => {
    const dialog = doc.querySelector("#cu-todo-dialog");
    const form = doc.querySelector("#cu-todo-form");

    form.dataset.operation = "create";
    form.querySelectorAll("span[data-operation]").forEach((blankToFill) => {
      blankToFill.textContent = "add";
    });
    
    dialog.showModal();
  });
})();

/* Forms */
(function initListenersCuProjectForm() {
  const form = doc.querySelector("#cu-project-form");
  form.addEventListener("submit", (evt) => {
    const operation = form.dataset.operation;

    switch (operation) {
      case "create":
        createProject(evt);
        break;
      case "update":
        // @todo
        break;
    }
  });
})();

(function initListenersCancelBtns() {
  const cancelBtns = doc.querySelectorAll(".form-cancel-btn");
  cancelBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const form = btn.form;
      const dialog = doc.querySelector(`#${form.dataset.dialog}`);

      form.reset();
      dialog.close();
    });
  });
})();

/* Load data from storage */
function load() {
  const loadData = internalControl.load();  
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
 * Create toast notifications that disappear after a few seconds
 * @param {String} message
 */
function displayNotif(message) {
  const notif = doc.querySelector("#notif");
  notif.textContent = message;
  notif.classList.remove("hidden");

  setTimeout(() => {
    notif.textContent = null;
    notif.classList.add("hidden");
  }, THREE_SECONDS);
}

/* ========================================================================== */
/* CRUD for projects */
/* ========================================================================== */

function createProject(submitEvt) {
  const creationForm = submitEvt.submitter.form;
  const enteredData = Object.fromEntries(new FormData(creationForm));

  const projectData = internalControl.createProject(enteredData);

  displayNotif(`Project "${projectData.title}" has been created.`);
  updateSidebar();
  // @todo render project
}

/* ========================================================================== */
/* CRUD for todos */
/* ========================================================================== */



/* ========================================================================== */
/* EXPORTS */
/* ========================================================================== */


export { load };

// @todo these exports will be removed once testing is done
export { wipe, displayNotif };