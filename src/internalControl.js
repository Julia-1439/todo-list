import { Project, TodoItem, storageControl } from "./barrel.js";

const _projects = [];

/* ========================================================================== */
/* Initialization: restoring from storage & default project */
/* ========================================================================== */

/**
 * Preconditions: array _projects is empty on page load
 * Postconditions: array _projects is populated with the projects from storage
 * in the order they were created. If storage is not available, _projects 
 * will be empty. 
 */
function restoreFromStorage() {
  const projectsFromStorage = storageControl.getAll() || [];
  projectsFromStorage.sort((p1, p2) => p1.creationTime - p2.creationTime);
  projectsFromStorage.forEach((project) => _projects.push(project));
}

/**
 * Preconditions: there are no projects in array _projects
 */
function createDefaultProject() {
  createProject({
    title: "Home 🏡",
    description: "Here's a place to help you get started! Add todos and projects to your liking.",
  });
  const projectUuid = _projects.at(-1).uuid;
  createTodo(projectUuid, {
    title: "Buy groceries after work", 
    description: "Bring the coupons for a discount.", 
    dueDateTime: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      d.setHours(17, 0, 0, 0);
      return d;
    })(), 
    priority: "p2",
  });
  createTodo(projectUuid, {
    title: "Read for 10 minutes at night", 
    description: "To help establish a better pre-sleep routine.", 
    dueDateTime: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 2);
      d.setHours(8, 0, 0, 0);
      return d;
    })(), 
    priority: "p3",
  });

  return viewProject(_projects.at(-1).uuid);
}

function viewAllProjects() {
  return _projects.map((project) => viewProject(project.uuid));
}

/**
 * Preconditions: should only called once on page load. 
 * Postconditions: the _projects array is populated with projects from storage.
 * if there are none, a default project is created.  
 * @returns {Object} containing a list of project titles and a view of the
 * most recently created project
 */
function loadData() {
  restoreFromStorage();

  if (_projects.length === 0) 
    createDefaultProject();
}

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
 * @returns {Object}
 */
function createProject(metadata) {
  const {title, description,} = metadata;
  const project = new Project(title, description,);
  _projects.push(project);

  storageControl.post(project);

  return viewProject(project.uuid);
}

/**
 * View details of a project and its todos
 * @param {String} uuid Id of the project user requested to view  
 * @returns {Object} 
 */
function viewProject(uuid) {
  const project = getProject(uuid);

  return {
    title: project.title,
    description: project.description,
    status: project.status,
    todoList: project.todoList.map((todo) => viewTodo(uuid, todo.uuid)),
    uuid: project.uuid,
  };
}

/**
 * Edit the parts of a project *not* concerning its 'todoList' property. 
 * 'todoList' of a project is modified with TodoItem-specific crud functions.  
 * @param {String} uuid Id of the project user requested to edit 
 * @param {Object} metadata Object containing the adjusted values, with the 
 * property names as those set in the Project constructor. 
 * @returns {Object}
 */
function editProject(uuid, metadata) {
  const project = getProject(uuid);

  const propertiesToUpdate = [
    "title", 
    "description", 
    "status",
  ];
  propertiesToUpdate.forEach((prop) => {
    const updatedVal = metadata[prop];
    if (updatedVal !== undefined)
      project[prop] = updatedVal;
  });

  storageControl.post(project);

  return viewProject(project.uuid);
}

/**
 * 
 * @param {String} uuid 
 * @returns {Object}
 */
function removeProject(uuid) {
  const removalIdx = _projects.findIndex((project) => project.uuid === uuid);
  const projectData = viewProject(_projects[removalIdx].uuid); // for the return
  _projects.splice(removalIdx, 1);

  storageControl.remove(uuid);

  return projectData;
}

/* ========================================================================== */
/* CRUD operations for TodoItem */
/* ========================================================================== */

/**
 * Creates a new TodoItem. Stores it in a parent proejct and browser storage.
 * @param {String} projectUuid the parent project of the TodoItem to be created
 * @param {Object} data Object containing the arguments to instantiate a 
 * TodoItem, with the property names as those set in the TodoItem constructor. 
 * @returns {Object}
 */
function createTodo(projectUuid, data) {
  const project = getProject(projectUuid);

  const {title, description, dueDateTime, priority,} = data;
  const todo = new TodoItem(title, description, dueDateTime, priority,);
  project.addTodo(todo);

  storageControl.post(project);

  return viewTodo(projectUuid, todo.uuid);
}

/**
 * Get data of a todo
 * @param {String} projectUuid 
 * @param {String} todoUuid 
 * @returns {Object}
 */
function viewTodo(projectUuid, todoUuid) {
  const project = getProject(projectUuid);
  const todo = project.getTodo(todoUuid); 
  
  return {
    title: todo.title,
    description: todo.description,
    dueDateTime: todo.dueDateTime,
    priority: todo.priority,
    status: todo.status,
    uuid: todo.uuid,
    projectUuid: projectUuid,
  };
}

/**
 * Edit a todo
 * @param {String} projectUuid id of the parent project
 * @param {String} todoUuid id of the TodoItem to be edited
 * @param {Object} data Object containing the adjusted values, with the 
 * property names as those set in the TodoItem constructor. 
 * @returns {Object}
 */
function editTodo(projectUuid, todoUuid, data) {
  const project = getProject(projectUuid)
  const todo = project.getTodo(todoUuid);

  const propertiesToUpdate = [
    "title", 
    "description", 
    "dueDateTime", 
    "priority", 
    "status",
  ];
  propertiesToUpdate.forEach((prop) => {
    const updatedVal = data[prop];
    if (updatedVal !== undefined)
      todo[prop] = updatedVal;
  });

  storageControl.post(project);

  return viewTodo(projectUuid, todoUuid);
}

/**
 * 
 * @param {String} projectUuid 
 * @param {String} todoUuid 
 * @returns {Object}
 */
function removeTodo(projectUuid, todoUuid) {
  const project = getProject(projectUuid);
  const todoData = viewTodo(projectUuid, todoUuid); // for the return
  project.removeTodo(todoUuid);

  storageControl.post(project);

  return todoData;
}

export { 
  // For page load
  loadData,

  // CRUD for projects
  createProject, 
  viewProject, viewAllProjects,
  editProject,
  removeProject,

  // CRUD for todos
  createTodo,
  viewTodo,
  editTodo,
  removeTodo,
};