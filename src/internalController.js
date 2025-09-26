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

/**
 * 
 * @param {Project} project parent project containing the todo requested 
 * @param {String} todoUuid 
 * @returns {TodoItem}
 */
function getTodo(project, todoUuid) {
  const todoList = project.todoList;
  return todoList.find((todo) => todo.uuid === todoUuid);
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
  const project = getProject(uuid);
  return Project.view(project);
}

/**
 * Edit the parts of a project *not* concerning its 'todoList' property. 
 * 'todoList' of a project is modified with TodoItem-specific crud functions.  
 * @param {String} uuid Id of the project user requested to edit 
 * @param {Object} metadata Object containing the adjusted values, with the 
 * property names as those in the Project constructor parameter list. 
 */
function editProjectMetadata(uuid, metadata) {
  const project = getProject(uuid);
  const {title, description, status,} = metadata;

  if (title)
    project.title = title;
  if (description)
    project.description = description;
  if (status)
    project.status = status;

  storageController.post(project);
}

function removeProject(uuid) {
  const removalIdx = _projects.findIndex((project) => project.uuid === uuid);
  _projects.splice(removalIdx);

  storageController.remove(uuid);
}

/* ========================================================================== */
/* CRUD operations for TodoItem */
/* ========================================================================== */

/**
 * Creates a new TodoItem. Stores it in a parent proejct and browser storage.
 * @param {String} projectUuid the parent project of the TodoItem to be created
 * @param {Object} data Object containing the arguments to instantiate a 
 * TodoItem, with the property names as those in the TodoItem constructor
 * parameter list. 
 */
function createTodo(projectUuid, data) {
  const project = getProject(projectUuid);

  const {title, description, dueDateTime, priority,} = data;
  const todo = new TodoItem(title, description, dueDateTime, priority,);
  project.addTodo(todo);

  storageController.post(project);
}

/**
 * Edit a todo
 * @param {String} projectUuid id of the parent project
 * @param {String} todoUuid id of the TodoItem to be edited
 * @param {Object} data Object containing the adjusted values, with the 
 * property names as those in the TodoItem constructor parameter list. 
 */
function editTodo(projectUuid, todoUuid, data) {
  const project = getProject(projectUuid)
  const todo = getTodo(project, todoUuid);
  const {title, description, dueDateTime, priority, status,} = data;

  if (title)
    todo.title = title;
  if (description)
    todo.description = description;
  if (dueDateTime)
    todo.dueDateTime = dueDateTime;
  if (priority)
    todo.priority = priority;
  if (status)
    todo.status = status;

  storageController.post(project);
}

// @todo exports are not final until done with testing
export { 
  _projects, 
  restoreFromStorage, 
  createProject, 
  viewProject,
  editProjectMetadata,
  removeProject,
  createTodo,
  editTodo,
};