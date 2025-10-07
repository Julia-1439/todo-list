import { internalControl } from "./barrel.js";

import { sidebarRenderer } from "./barrel.js";
import { mainContentRenderer } from "./barrel.js";
import { projectSelectElementRenderer } from "./barrel.js";

import { dateFns } from "./barrel.js";

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
(function initListenersProjectContextMenu() {
  const projectContextMenu = doc.querySelector("#project-context-menu");

  const updateProjectBtn = projectContextMenu.querySelector("#project-update-btn");
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

  const deleteProjectBtn = projectContextMenu.querySelector("#project-delete-btn");
  deleteProjectBtn.addEventListener("click", () => {
    const dialog = doc.querySelector("#deletion-dialog");
    const form = doc.querySelector("#deletion-form");
  
    const uuid = deleteProjectBtn.dataset.uuid;
    form.dataset.projectUuid = uuid; // form distinguishes between projectUuid & todoUuid since it supports deleting both (don't do this next time.) 
    form.dataset.objectType = "project";
    form.querySelectorAll("span[data-object-type]").forEach((blankToFill) => {
      blankToFill.textContent = "project";
    });
    
    dialog.showModal();
  });
})();

(function initListenersTodoContextMenu() {
  const todoContextMenu = doc.querySelector("#todo-context-menu");

  const updateTodoBtn = todoContextMenu.querySelector("#todo-update-btn");
  updateTodoBtn.addEventListener("click", () => {
    const dialog = doc.querySelector("#cu-todo-dialog");
    const form = doc.querySelector("#cu-todo-form");
  
    const projectUuid = updateTodoBtn.dataset.projectUuid;
    const todoUuid = updateTodoBtn.dataset.todoUuid;
    form.dataset.projectUuid = projectUuid;
    form.dataset.todoUuid = todoUuid;
    form.dataset.operation = "update";
    form.querySelectorAll("span[data-operation]").forEach((blankToFill) => {
      blankToFill.textContent = "edit";
    });

    // populate with current todo data
    const currTodoData = internalControl.viewTodoFull(projectUuid, todoUuid);
    form.querySelectorAll("[name]").forEach((formCtrl) => {
      const name = formCtrl.name;
      formCtrl.value = (() => {
        let currVal = currTodoData[name] ?? "";
        switch (name) {
          case "priority":
            return currVal.level;
          case "dueDateTime":
            if (currVal)
              return dateFns.format(new Date(currVal), "yyyy-MM-dd'T'HH:mm");
          default:
            return currVal;
        }
      })();
    });

    // Disable the project selector to prevent switching it to different project
    // NOTE: the value will need to be injected into the form data afterward 
    // since disabled inputs don't transmit their values. "readonly" also 
    // doesn't work with <select> elements.
    const projectSelector = form.querySelector("#cu-todo-form-project-selector");
    projectSelector.disabled = "true"; 
    
    dialog.showModal();
  });

  const deleteTodoBtn = todoContextMenu.querySelector("#todo-delete-btn");
  deleteTodoBtn.addEventListener("click", () => {
    const dialog = doc.querySelector("#deletion-dialog");
    const form = doc.querySelector("#deletion-form");
  
    const projectUuid = deleteTodoBtn.dataset.projectUuid;
    const todoUuid = deleteTodoBtn.dataset.todoUuid;
    form.dataset.projectUuid = projectUuid; 
    form.dataset.todoUuid = todoUuid;
    form.dataset.objectType = "todo";
    form.querySelectorAll("span[data-object-type]").forEach((blankToFill) => {
      blankToFill.textContent = "task";
    });
    
    dialog.showModal();
  });

})();


/* Forms */
// the form for creating OR updating a project
(function initListenersCuProjectForm() {
  const form = doc.querySelector("#cu-project-form");
  form.addEventListener("submit", () => {
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
  form.addEventListener("submit", () => {
    const operation = form.dataset.operation;
    const formData = new FormData(form);

    switch (operation) {
      case "create":
        createTodo(formData);
        break;
      case "update":
        formData.append("projectUuid", form.dataset.projectUuid); // disabled project selector does not transmit it automatically 
        const todoUuid = form.dataset.todoUuid;
        updateTodo(todoUuid, formData);
        break;
    }

    form.reset();
  });
})();

// the form for deleting a project OR todo
(function initListenersDeletionForm() {
  const form = doc.querySelector("#deletion-form");
  
  form.addEventListener("submit", () => {
    const objectType = form.dataset.objectType;
    const projectUuid = form.dataset.projectUuid;

    switch (objectType) {
      case "project":
        deleteProject(projectUuid);
        break;
      case "todo":
        const todoUuid = form.dataset.todoUuid;
        deleteTodo(projectUuid, todoUuid);
        break;
    }
  })

  form.reset();
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

(function initListenersDialogs() {
  const cuTodoDialog = doc.querySelector("#cu-todo-dialog");
  cuTodoDialog.addEventListener("close", () => {
    const projectSelector = cuTodoDialog.querySelector("#cu-todo-form-project-selector");
    projectSelector.removeAttribute("disabled"); 
  });
})();

/* ========================================================================== */
/* Add event listeners to *dynamic* content as they are created */
/* ========================================================================== */

sidebarElt.addEventListener("custom:contentUpdate", () => {
  const projectsSection = sidebarElt.querySelector("#sidebar-projects-section");

  const viewProjectBtns = projectsSection.querySelectorAll(".view-project-btn");
  viewProjectBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const projectData = internalControl.viewProject(btn.dataset.uuid);
      mainContentRenderer.renderProject(projectData);
    });
  });

  const openContextMenuBtns = projectsSection.querySelectorAll(".project-context-btn");
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

  // expand todos
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
      const newStatus = (todoData.status.name === "incomplete") ? "completed" : "incomplete";
      const formData = (() => {
        const f = new FormData();
        f.append("status", newStatus);
        f.append("projectUuid", projectUuid);
        return f;
      })();
      updateTodo(todoUuid, formData, true);

      renderDisplay({
        detail: {focusedProjectUuid: todoData.projectUuid},
      });
    });
  });

  // context menu
  const openContextMenuBtns = mainContent.querySelectorAll(".todo-context-btn");
  const contextMenu = doc.querySelector("#todo-context-menu");
  openContextMenuBtns.forEach((openMenuBtn) => {
    openMenuBtn.addEventListener("click", () => {
      contextMenu.querySelectorAll("button").forEach((actionBtn) => {
        actionBtn.dataset.projectUuid = openMenuBtn.dataset.projectUuid;
        actionBtn.dataset.todoUuid = openMenuBtn.dataset.todoUuid;        
      });
    });
  });

  // the create task button for this project
  const createTodoBtn = doc.querySelector("#this-project-create-todo-btn");
  createTodoBtn.addEventListener("click", () => {
    const dialog = doc.querySelector("#cu-todo-dialog");
    const form = doc.querySelector("#cu-todo-form");

    form.dataset.operation = "create";
    form.querySelectorAll("span[data-operation]").forEach((blankToFill) => {
      blankToFill.textContent = "add";
    });

    // populate with this project
    const projectUuid = createTodoBtn.dataset.projectUuid;
    const projectSelector = form.querySelector("#cu-todo-form-project-selector");
    const desiredOption = projectSelector.querySelector(`option[value="${projectUuid}"]`)
    desiredOption.setAttribute("selected", "");
    
    dialog.showModal();
  });

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
function updateProject(uuid, formData, suppressNotif=false) {
  const enteredData = Object.fromEntries(formData);
  const updatedProjectData = internalControl.editProject(uuid, enteredData);

  renderDisplay({
    detail: { focusedProjectUuid: uuid, },
  });

  if (!suppressNotif)
    doc.dispatchEvent(new CustomEvent("customEvt:notification", {
      detail: {
        message: `Project "${updatedProjectData.title}" has been updated.`,
      },
    }));
}

function deleteProject(uuid) {
  const removedProject = internalControl.removeProject(uuid);

  renderDisplay();

  doc.dispatchEvent(new CustomEvent("customEvt:notification", {
    detail: {
      message: `Project "${removedProject.title}" has been deleted.`,
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

/**
 * 
 * @param {String} todoUuid 
 * @param {FormData} formData has projectUuid in there so dw
 * @param {Boolean} suppressNotif 
 */
function updateTodo(todoUuid, formData, suppressNotif=false) {
  const enteredData = Object.fromEntries(formData);
  const todoData = internalControl.editTodo(
    enteredData.projectUuid, 
    todoUuid, 
    enteredData
  );

  renderDisplay({
    detail: {focusedProjectUuid: enteredData.projectUuid},
  });

  if (!suppressNotif)
    doc.dispatchEvent(new CustomEvent("customEvt:notification", {
      detail: {
        message: `Task has been updated.`,
      },
    }));
}

function deleteTodo(projectUuid, todoUuid) {
  const removedTodo = internalControl.removeTodo(projectUuid, todoUuid);

  renderDisplay({
    detail: {focusedProjectUuid: projectUuid},
  }); 

  doc.dispatchEvent(new CustomEvent("customEvt:notification", {
    detail: {
      message: `This task has been deleted.`,
    },
  }));
}




export { renderDisplay };