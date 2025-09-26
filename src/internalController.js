import { Project, TodoItem, storageController } from "./barrel.js";

const _projects = [];

/* ========================================================================== */
/* Initialization: restoring from storage & default project */
/* ========================================================================== */

function restoreFromStorage() {
  const projectsFromStorage = storageController.getAll();
  projectsFromStorage.forEach((project) => _projects.push(project));
}

// ...

/* ========================================================================== */
/* Helpers */
/* ========================================================================== */

function getProject(uuid) {
  return _projects.find((project) => project.uuid === uuid);
}


/* ========================================================================== */
/* CRUD operations for Project */
/* ========================================================================== */

/**
 * Creates a new project. Stores it in memory and browser storage.
 * @param {Object} metadata Object containing the arguments to instantiate a 
 * Project, with the property names as those in the Project constructor
 * parameter list. 
 */
function createProject(metadata) {
  const {title, description,} = metadata;
  const project = new Project(title, description,);
  _projects.push(project);

  storageController.post(project);
}

/**
 * View details of a project and its todos
 * @param {String} uuid Id of the project user requested to view  
 * @returns {Object} 
 */
function viewProject(uuid) {
  const requestedProject = getProject(uuid);
  return Project.view(requestedProject);
}

/**
 * Edit the parts of a project *not* concerning its todoList or status 
 * properties. 'todoList' of a project is modified with TodoItem-specific
 * crud functions. And 'status' 
 * @param {String} uuid Id of the project user requested to edit 
 * @param {Object} metadata Object containing the adjusted values, with the 
 * property names as those in the Project constructor parameter list. 
 */
function editProjectMetadata(uuid, metadata) {
  const subjectProject = getProject(uuid);
  const {title, description, status,} = metadata;

  if (title)
    subjectProject.title = title;
  if (description)
    subjectProject.description = description;
  if (status)
    subjectProject.status = status;

  storageController.post(subjectProject);
}

function deleteProject(uuid) {
  const removalIdx = _projects.findIndex((project) => project.uuid === uuid);
  _projects.splice(removalIdx);

  storageController.remove(uuid);
}

/* ========================================================================== */
/* CRUD operations for TodoItem */
/* ========================================================================== */


// @todo exports are not final until done with testing
export { 
  _projects, 
  restoreFromStorage, 
  createProject, 
  viewProject,
  editProjectMetadata,
  deleteProject,
};