import { internalControl } from "./barrel.js";

import { sidebarRenderer } from "./barrel.js";
import { mainContentRenderer } from "./barrel.js";
import { projectSelectElementRenderer } from "./barrel.js";
import { viewProject } from "./internalControl.js";

const doc = document; 
const sidebarElt = doc.querySelector("#sidebar");
const mainContainer = doc.querySelector("#main-container"); 

/* ========================================================================== */
/* INITIALIZATION: add evt listeners to *permanent* fixtures */
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

/* Main content */
(function initListenersMainContent() {
  // none I think
})();

/* Context menus */
(function initListenersContextMenus() {
  const projectContextMenu = doc.querySelector("#project-context-menu");

  const updateProjectBtn = projectContextMenu.querySelector("#context-menu-update-btn");
  updateProjectBtn.addEventListener("click", () => {
    const dialog = doc.querySelector("#cu-project-dialog");
    const form = doc.querySelector("#cu-project-form");
  
    const uuid = updateProjectBtn.dataset.uuid;
    form.dataset.uuid = uuid;
    form.dataset.operation = "update";
    form.querySelectorAll("span[data-operation]").forEach((blankToFill) => {
      blankToFill.textContent = "edit";
    });

    // populate with current project data
    const currProjectData = internalControl.viewProject(uuid);
    form.querySelectorAll("[name]").forEach((formCtrl) => {
      formCtrl.value = currProjectData[formCtrl.name] ?? "";
    });
    
    dialog.showModal();
  });

  const deleteProjectBtn = projectContextMenu.querySelector("#context-menu-delete-btn");
  deleteProjectBtn.addEventListener("click", () => {
    const dialog = doc.querySelector("#deletion-dialog");
    const form = doc.querySelector("#deletion-form");
  
    const uuid = deleteProjectBtn.dataset.uuid;
    form.dataset.uuid = uuid;
    form.dataset.objectType = "project";
    form.querySelectorAll("span[data-object-type]").forEach((blankToFill) => {
      blankToFill.textContent = "project";
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
    const formData = new FormData(form);

    switch (operation) {
      case "create":
          createProject(formData);
          break;
        case "update":
          const uuid = form.dataset.uuid; 
          updateProject(uuid, formData);
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
    const formData = new FormData(form);

    switch (operation) {
      case "create":
        createTodo(formData);
        break;
      case "update":
        // @todo
        break;
    }

    form.reset();
  });
})();

// the form for deleting a project OR todo
(function initListenersDeletionForm() {
  // @TODO
})();

// make each cancel button close their parent form
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

/* ========================================================================== */
/* Add event listeners to *dynamic* content as they are created */
/* ========================================================================== */

sidebarElt.addEventListener("custom:contentUpdate", () => {
  const projectsSection = sidebarElt.querySelector("#sidebar-projects-section");
  const viewProjectBtns = projectsSection.querySelectorAll(".view-project-btn");
  const openContextMenuBtns = projectsSection.querySelectorAll(".project-context-btn");

  viewProjectBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const projectData = internalControl.viewProject(btn.dataset.uuid);
      mainContentRenderer.renderProject(projectData);
    });
  });

  const contextMenu = doc.querySelector("#project-context-menu");
  openContextMenuBtns.forEach((openMenuBtn) => {
    openMenuBtn.addEventListener("click", () => {
      contextMenu.querySelectorAll("button").forEach((actionBtn) => {
        actionBtn.dataset.uuid = openMenuBtn.dataset.uuid;
      });
    });
  });

});

mainContainer.addEventListener("custom:contentUpdate", () => {
  const mainTopbar = mainContainer.querySelector("#main-topbar");
  const openProjectMenuBtn = mainTopbar.querySelector(".project-context-btn")
  openProjectMenuBtn.addEventListener("click", () => {
    const projectContextMenu = doc.querySelector("#project-context-menu");
    projectContextMenu.querySelectorAll("button").forEach((actionBtn) => {
      actionBtn.dataset.uuid = openProjectMenuBtn.dataset.uuid;
    });
  });

  const mainContent = mainContainer.querySelector("#main-content");
  const expandBtns = mainContent.querySelectorAll(".expand-btn");
  expandBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const todoDataFull = internalControl.viewTodoFull(
        btn.dataset.projectUuid, btn.dataset.todoUuid
      );
      mainContentRenderer.toggleDetailedTodo(todoDataFull);
    });
  });

  // toggle status
  const checkBubbleBtns = mainContent.querySelectorAll(".todo-checkbubble-btn");
  checkBubbleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const projectUuid = btn.dataset.projectUuid;
      const todoUuid = btn.dataset.todoUuid;

      const todoData = internalControl.viewTodoSummary(projectUuid, todoUuid);
      const newTodoData = internalControl.editTodo(projectUuid, todoUuid, {
        "status": (todoData.status.name === "incomplete") 
          ? "completed" 
          : "incomplete",
      });

      mainContentRenderer.renderNewTodoStatus(newTodoData); // (note)
      // note: the alternative approach is to call mainContentRenderer.renderProject
      // again, but that erases any expanded todos. thus, we create a special function
      // .renderNewTodoStatus to modify the checkbubble and only the checkbubble
    });
  });

  // context menu

});


/* ========================================================================== */
/* HELPERS */
/* ========================================================================== */

/**
 * update the sidebar with project titles; update the project selection menu 
 * when creating a new task; update the main display
 * @param {Object} detail optional object to ... @todo
*/
function renderDisplay({ detail  } = { detail: {} }) {
  const projectsData = internalControl.viewAllProjects();
  projectsData.reverse(); // sorts in descending order by project creation time

  // sets the focused project to the specified one or defaults to the most recent
  const focusedProjectData = (() => {
    const uuid = detail.focusedProjectUuid;
    if (uuid !== undefined)
      return projectsData.find((projectData) => projectData.uuid === uuid);
    else
      return projectsData[0];
  })();

  // render all parts of the page using projects' data
  sidebarRenderer.renderProjects(projectsData);
  mainContentRenderer.renderProject(focusedProjectData);
  projectSelectElementRenderer.renderProjects(projectsData);
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

/**
 * 
 * @param {FormData} formData 
 */
function createProject(formData) {
  const enteredData = Object.fromEntries(formData);
  const projectData = internalControl.createProject(enteredData);

  renderDisplay({
    detail: {focusedProjectUuid: projectData.uuid},
  });

  doc.dispatchEvent(new CustomEvent("customEvt:notification", {
    detail: {
      message: `Project "${projectData.title}" has been created.`,
    },
  }));
}

/**
 * 
 * @param {FormData} formData 
 */
function updateProject(uuid, formData) {
  const enteredData = Object.fromEntries(formData);
  const updatedProjectData = internalControl.editProject(uuid, enteredData);

  renderDisplay({
    detail: { focusedProjectUuid: uuid, },
  });

  doc.dispatchEvent(new CustomEvent("customEvt:notification", {
    detail: {
      message: `Project "${updatedProjectData.title}" has been updated.`,
    },
  }));
}

/* ========================================================================== */
/* CRUD for todos */
/* ========================================================================== */

/**
 * 
 * @param {FormData} formData 
 */
function createTodo(formData) {
  const enteredData = Object.fromEntries(formData);
  const todoData = internalControl.createTodo(enteredData.projectUuid, enteredData);

  renderDisplay({
    detail: {focusedProjectUuid: enteredData.projectUuid},
  });

  doc.dispatchEvent(new CustomEvent("customEvt:notification", {
    detail: {
      message: `Task has been created.`,
    },
  }));
}





export { renderDisplay };