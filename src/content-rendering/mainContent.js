import { domHelper } from "../barrel.js";
import { contextMenus } from "../barrel.js";

const doc = document; 
const mainContainer = doc.querySelector("#main-container");

function renderProject(projectData) {
  mainContainer.replaceChildren();

  mainContainer.dataset.uuid = projectData.uuid;

  const topBar = doc.createElement("div");
  topBar.id = "main-topbar";
  topBar.classList.add("sticky");
  const projectMenuBtn = doc.createElement("button");
  projectMenuBtn.classList.add("project-context-btn", "borderless-btn", "square-btn");
  projectMenuBtn.setAttribute("popovertarget", "project-context-menu");
  projectMenuBtn.setAttribute("popovertargetaction", "toggle");
  projectMenuBtn.dataset.uuid = projectData.uuid;
  const menuSym = domHelper.createSvg("dots-horizontal");
  menuSym.classList.add("context-menu-sym");

  const mainContent = doc.createElement("div");
  mainContent.id = "main-content";

  const projectHeader = doc.createElement("div");
  projectHeader.classList.add("project-header-container");
  const projectTitle = doc.createElement("h1");
  projectTitle.classList.add("project-title");
  if (projectData.status.name === "completed")
    projectTitle.classList.add("project-completed");
  projectTitle.textContent = projectData.title;
  const projectDescr = doc.createElement("div");
  projectDescr.classList.add("project-description")
  if (projectData.status.name === "completed")
    projectDescr.classList.add("project-completed");
  projectDescr.textContent = projectData.description;

  const todoList = doc.createElement("ul");
  const todoEntries = projectData.todoList.map(createTodoEntry);

  const todoCreateBtn = doc.createElement("button");
  todoCreateBtn.id = "this-project-create-todo-btn";
  todoCreateBtn.dataset.projectUuid = projectData.uuid;
  const todoCreateSym = domHelper.createSvg("plus", "#dc583e"); // the var(--palette-accent-color)
  todoCreateSym.classList.add("create-todo-icon");
  const todoCreateText = doc.createTextNode("Add task");

  mainContainer.append(topBar, mainContent);
  topBar.append(projectMenuBtn);
  projectMenuBtn.append(menuSym);
  mainContent.append(projectHeader, todoList, todoCreateBtn);
  projectHeader.append(projectTitle, projectDescr);
  todoList.append(...todoEntries);
  todoCreateBtn.append(todoCreateSym, todoCreateText);

  mainContainer.dispatchEvent(new CustomEvent("custom:contentUpdate"));
}

/**
 * 
 * @param {Object} todoData 
 * @returns {HTMLLIElement}
 */
function createTodoEntry(todoData) {
  const li = doc.createElement("li");

  const card = doc.createElement("div");
  card.classList.add("todo-card");
  card.dataset.todoUuid = todoData.uuid;
  card.dataset.projectUuid = todoData.projectUuid;
  const checkBubbleDiv = doc.createElement("div");
  checkBubbleDiv.classList.add("todo-checkbubble-container");
  const checkBubbleBtn = doc.createElement("button");
  checkBubbleBtn.classList.add("todo-checkbubble-btn");
  if (todoData.status.name === "incomplete") {
    checkBubbleBtn.style.borderColor = todoData.priority.color;
    checkBubbleBtn.style.backgroundColor = `${todoData.priority.color}a6`;  
  }
  else {
    checkBubbleBtn.style.borderColor = todoData.status.color;
    checkBubbleBtn.style.backgroundColor = `${todoData.status.color}a6`;  
    checkBubbleBtn.classList.add("todo-completed");
  }
  checkBubbleBtn.dataset.todoUuid = todoData.uuid;
  checkBubbleBtn.dataset.projectUuid = todoData.projectUuid;
  const checkSym = domHelper.createSvg("check", "white");
  
  const topRowDiv = doc.createElement("div");
  topRowDiv.classList.add("todo-top-row");
  const titleSpan = doc.createElement("span");
  titleSpan.classList.add("todo-title");
  const titleStrong = doc.createElement("strong");
  titleStrong.textContent = todoData.title;
  const btnsContainer = doc.createElement("div");
  btnsContainer.classList.add("todo-btns-container");
  const expandBtn = doc.createElement("button");
  expandBtn.classList.add("expand-btn", "todo-btn", "borderless-btn", "square-btn");
  expandBtn.dataset.todoUuid = todoData.uuid;
  expandBtn.dataset.projectUuid = todoData.projectUuid;
  const expandSym = domHelper.createSvg("chevron");
  expandSym.classList.add("chevron");
  const menuBtn = doc.createElement("button");
  menuBtn.classList.add("todo-context-btn", "todo-btn", "borderless-btn", "square-btn");
  menuBtn.setAttribute("popovertarget", "todo-context-menu");
  menuBtn.setAttribute("popovertargetaction", "toggle");
  menuBtn.dataset.todoUuid = todoData.uuid;
  menuBtn.dataset.projectUuid = todoData.projectUuid;
  const menuSym = domHelper.createSvg("dots-horizontal");
  menuSym.classList.add("context-menu-sym");

  const dueByDiv = doc.createElement("div");
  dueByDiv.classList.add("todo-due-by");
  dueByDiv.textContent = todoData.dueDateTime;
  
  li.append(card);
  card.append(checkBubbleDiv, topRowDiv, dueByDiv);
  checkBubbleDiv.append(checkBubbleBtn);
  checkBubbleBtn.append(checkSym);
  topRowDiv.append(titleSpan, btnsContainer);
  titleSpan.append(titleStrong);
  btnsContainer.append(expandBtn, menuBtn);
  expandBtn.append(expandSym);
  menuBtn.append(menuSym);

  return li;
}

/**
 * Toggles a full view of a todo item
 * @param {Object} todoDetailedData 
 */
function toggleDetailedTodo(todoDetailedData) {
  const mainContent = doc.querySelector("#main-content"); 
  const todoCard = mainContent.querySelector(`[data-todo-uuid="${todoDetailedData.uuid}"]`);
  const expandSym = todoCard.querySelector(".chevron");

  const descriptionDiv = todoCard.querySelector(".todo-description");
  if (descriptionDiv === null) {
    const descriptionDiv = doc.createElement("div");
    descriptionDiv.classList.add("todo-description");
    descriptionDiv.textContent = todoDetailedData.description || "No description provided.";
    todoCard.append(descriptionDiv);
    expandSym.classList.add("chevron-expanded");
  }
  else {
    todoCard.removeChild(descriptionDiv);
    expandSym.classList.remove("chevron-expanded");
  }
}

export { renderProject, toggleDetailedTodo, };