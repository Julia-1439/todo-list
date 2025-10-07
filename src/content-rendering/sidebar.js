import { svgCreator } from "../barrel.js";
import { contextMenus } from "../barrel.js";

const doc = document; 
const sidebar = doc.querySelector("#sidebar");

/**
 * 
 * @param {Array{Object}} projectsData 
 */
function renderProjects(projectsData) {
  const projectList = sidebar.querySelector("#sidebar-projects-section ul");
  projectList.replaceChildren();

  const projectEntries = projectsData.map(createProjectEntry);
  projectList.append(...projectEntries);

  sidebar.dispatchEvent(new CustomEvent("custom:contentRender"));
}

/**
 * 
 * @param {Object} projectData 
 * @returns {HTMLLIElement}
 */
function createProjectEntry(projectData) {
  const li = doc.createElement("li");
  
  const projectCell = doc.createElement("div");
  projectCell.classList.add("project-cell");
  if (projectData.status.name === "completed")
    projectCell.classList.add("project-completed");
  
  const titleBtn = doc.createElement("button");
  titleBtn.classList.add("view-project-btn", "borderless-btn");
  titleBtn.type = "button";
  titleBtn.dataset.uuid = projectData.uuid;
  const projectSym = svgCreator.create("pound");
  projectSym.classList.add("project-sym");
  const titleSpan = doc.createElement("span");
  titleSpan.classList.add("project-title");
  titleSpan.textContent = projectData.title;
  
  const menuBtn = doc.createElement("button");
  menuBtn.classList.add("project-context-btn", "borderless-btn", "square-btn");
  menuBtn.setAttribute("popovertarget", "project-context-menu");
  menuBtn.setAttribute("popovertargetaction", "toggle");
  menuBtn.dataset.uuid = projectData.uuid;
  const menuSym = svgCreator.create("dots-horizontal");
  menuSym.classList.add("context-menu-sym");

  li.append(projectCell);
  projectCell.append(titleBtn, menuBtn);
  titleBtn.append(projectSym, titleSpan);
  menuBtn.append(menuSym);

  return li;
}

export { renderProjects };