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
// the form for creating OR updating a project
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

    form.reset();
  });
})();

// the form for creating OR updating a todo
(function initListenersCuTodoForm() {
  const form = doc.querySelector("#cu-todo-form");
  form.addEventListener("submit", (evt) => {
    const operation = form.dataset.operation;

    switch (operation) {
      case "create":
        createTodo(evt);
        break;
      case "update":
        // @todo
        break;
    }

    form.reset();
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
  internalControl.load();  
  updateDisplay();  
}

/* ========================================================================== */
/* HELPERS */
/* ========================================================================== */

/**
 * update the sidebar with project titles; update the project selection menu 
 * when creating a new task; update the main display
*/
function updateDisplay() {
  const projectsData = internalControl.viewAllProjects();
  projectsData.reverse(); // sorts in descending order by project creation time

  updateSidebar();
  updateProjectSelectElement();
  // @todo update the main display

  function updateSidebar() {
    // @todo call wipe
    const projectTitles = projectsData.map(projectData => projectData.title);
    projectTitles.forEach((title) => {
      console.log(title); // @todo 
    });
  }

  function updateProjectSelectElement() {
    const selector = doc.querySelector("#cu-todo-form-project-selector");
    wipe(selector);
    
    const blankOption = createOption("", "");
    const projectOptions = projectsData.map((projectData) => 
      createOption(projectData.uuid, projectData.title)
    );
    selector.append(blankOption, ...projectOptions);

    function createOption(uuid, title) {
      const option = doc.createElement("option");
      option.setAttribute("value", uuid);
      option.textContent = title;
      return option;
    }
  }

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

/**
 * Replaces empty string values "" in an object with undefined, for usage in
 * preparing data to be passed into the internal control module. 
 */
function emptyStrReplacer(data) {
  Object.entries(data).forEach(([key, val]) => {
    if (val === "") 
      data[key] = undefined;
  });
}

/* ========================================================================== */
/* CRUD for projects */
/* ========================================================================== */

function createProject(submitEvt) {
  const creationForm = submitEvt.submitter.form;
  const enteredData = Object.fromEntries(new FormData(creationForm));
  emptyStrReplacer(enteredData);

  const projectData = internalControl.createProject(enteredData);

  displayNotif(`Project "${projectData.title}" has been created.`);
  updateDisplay();
}

/* ========================================================================== */
/* CRUD for todos */
/* ========================================================================== */

function createTodo(submitEvt) {
  const creationForm = submitEvt.submitter.form;
  const enteredData = Object.fromEntries(new FormData(creationForm));
  emptyStrReplacer(enteredData);

  const projectData = internalControl.createTodo(enteredData.projectUuid, enteredData);

  displayNotif(`Task has been created.`);
  updateDisplay();
}


/* ========================================================================== */
/* EXPORTS */
/* ========================================================================== */


export { load };

// @todo these exports will be removed once testing is done
export { wipe, displayNotif };