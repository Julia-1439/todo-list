import { Project } from "./barrel.js";
import { TodoItem } from "./barrel.js";

import { storageController } from "./barrel.js";
import { internalController } from "./barrel.js";

// bare-metal work on Project & TodoItem 
function runTestSet1() {
  // create a todo
  const todo = new TodoItem(
    "Buy groceries",
    "Go to the Shop. Remember to bring a bag to avoid paying the fee",
    new Date("2017-06-01T08:30"),
    "p1",
  );
  console.log(todo);
  console.log(todo.status);
  console.log(todo.priority);

  // edit a todo & mark as complete
  todo.title = "Buy hardware";
  todo.priority = "p2";
  todo.status = "completed";
  console.log(todo);
  console.log(todo.status);
  console.log(todo.priority);

  // create a project
  const project = new Project(
    "Cook a goulash",
    "This is my first attempt at cooking an American goulash! I'm so excited."
  );
  console.log(project);
  console.log(project.status);

  // create a project's metadata & mark as complete
  project.title = "Cook a delicious goulash";
  project.status = "completed";
  console.log(project);
  console.log(project.status);

  // add todos to a project
  project.addTodo(todo);
  project.addTodo(new TodoItem("test todo2"));
  project.addTodo(new TodoItem("test todo3"));
  console.log(project.todoList);

  // remove todo from a project
  project.removeTodo(todo.uuid);
  console.log(project.todoList);

  // view summary of each todo in a project
  project.addTodo(todo); // readd the old one with lots of info
  project.todoList.forEach((todo) => {
    console.log(TodoItem.summary(todo));
  });
 
  // view details of a todo in a project
  console.log(
    TodoItem.details(project.todoList[2])
  );

  // view details of a project
  console.log(
    Project.details(project)
  );

  const stringifiedTodo = JSON.stringify(TodoItem.dehydrate(todo));
  console.log(stringifiedTodo);

  const parsedTodo = JSON.parse(stringifiedTodo);
  console.log(parsedTodo);
  
  const rehydratedTodo = TodoItem.rehydrate(parsedTodo, todo.uuid);
  console.log(rehydratedTodo);
}

// storageController
function runTestSet2() {
  // check localStorage availability
  console.log(
    "localStorage available:",
    storageController.isStorageAvailable()
  );

  // test with Project 
  const project = new Project(
    "Cook a goulash",
    "This is my first attempt at cooking an American goulash! I'm so excited."
  );
  const todo1 = new TodoItem(
    "Buy groceries",
    "Go to the Shop. Remember to bring a bag to avoid paying the fee",
    new Date("2017-06-01T08:30"),
    "p1",
  );
  const todo2 = new TodoItem(
    "Clean the floor",
    "Remember to use the broom",
    new Date("2018-06-01T08:30"),
    "p2",
  );
  project.addTodo(todo1);
  project.addTodo(todo2);
  console.log(
    "Project created:",
    project,
    project.status
  );

  // post
  storageController.post(project);

  // get
  const projectKey = project.uuid;
  console.log(
    "Retrieved:",
    // storageController.get(projectKey)
  );

  // update
  project.status = "completed";
  storageController.post(project);
  console.log(
    "Retrieved updated project:",
    // storageController.get(projectKey)
  );  

  // remove
  // storageController.remove(projectKey); // use a breakpoint to test this

  // get with a non-existent key
  console.log(
    "Get with a non-existent key:",
    // storageController.get("foo")
  );

  // get all projects
  const project2 = new Project("project 2");
  const project3 = new Project("project 3");
  storageController.post(project2);
  storageController.post(project3);
  console.log(
    "All projects:",
    storageController.getAll()
  );

  console.log(
    "A todo's details:",
    TodoItem.details(project.todoList[0])
  );
  
}

// internalController: crud operations on project & todos
function runTestSet3() {
  localStorage.clear(); // ensure clean slate for testing
  const ic = internalController;
  const sc = storageController;

  // C project  
  ic.createProject({
    title: "Get a nice lawn", 
    description: "Green as can be!",
  });
  console.log(
    "Project created in _projects array: (verify it's in localStorage as well)",
    ic._projects,
  );
  console.log(
    "The project created:",
    ic._projects[0]
  );

  let workingProject = ic._projects[0];
  let workingUuid = workingProject.uuid;

  // R project
  console.log(
    "Viewing project:",
    ic.viewProject(workingUuid)
  );

  // U project
  workingProject.addTodo(new TodoItem("Test foo"));
  ic.editProjectMetadata(workingUuid, {
    foobar: "This property should not be posted",
    todoList: "The todos should not be modified!",
    status: "completed",
    title: null,
  });
  console.log(
    "Edited project metadata:",
    workingProject
  );

  // D project
  ic.createProject({
    title: "This project will be deleted!",
  });
  console.log(
    "New project created in _projects:",
    ic._projects
  );
  const destinedForDoomProject = ic._projects[1];

  const removalUuid = destinedForDoomProject.uuid;
  ic.removeProject(removalUuid); // set breakpoint here to test
  console.log(
    "Project deleted from _projects:",
    ic._projects
  );
  
  // C todoitem
  ic.createProject({
    title: "Dummy project",
  });
  const workingProjUuid = workingUuid;
  ic.createTodo(workingProjUuid, {
    title: "Take a relaxing bath",
    description: "Use bubbles!",
    dueDateTime: new Date("1995-12-17T03:24:00"),
    priority: "p2",
  });
  console.log(
    "Todo created: (make sure it's posted to storage too)",
    workingProject
  );

  // U todoitem
  const workingTodo = workingProject.todoList[1];
  const workingTodoUuid = workingTodo.uuid;
  ic.editTodo(workingProjUuid, workingTodoUuid, {
    description: "Use LOTS of bubbles!",
    priority: "p1",
    status: "completed",
  });
  console.log(
    "Todo edited: (make sure it's posted to storage too)",
    workingTodo
  );

  // R todoitem
  console.log(
    "Expanding a todo:",
    ic.expandTodo(workingProjUuid, workingTodoUuid)
  );

  // D todoitem
  ic.removeTodo(workingProjUuid, workingTodoUuid); // set a breakpoint here
  console.log(
    "Removed a todo:",
    workingProject 
  );

}

// internalController: restore from storage 
// preconditions: must have projects in localStorage, else nothing happens.
// create some with createProjectsHelper()
function runTestSet4() {
  const ic = internalController;
  const sc = storageController;

  ic._projects.length = 0; // simulate a page reloading

  ic.restoreFromStorage();
  console.log(
    "Restored projects:",
    ic._projects
  );
}

function createProjectsHelper() {
  localStorage.clear(); // ensure clean slate for testing
  const ic = internalController;
  const sc = storageController;

  // project 1
  ic.createProject({
    title: "Get a nice LAWN", 
    description: "Green as can be!",
  });
  const p1 = ic._projects[0];
  ic.createTodo(p1.uuid, {
    title: "Get a hose",
    description: "The hardware store sells them!",
    dueDateTime: new Date("1995-12-17T03:24:00"),
    priority: "p2",
  });
  ic.editTodo(p1.uuid, p1.todoList[0].uuid, {
    status: "completed",
    priority: "p2",
  }); // mark as done to make sure completion gets injected correctly
  ic.createTodo(p1.uuid, {
    title: "Water the lawn",
    description: null,
    dueDateTime: new Date("1995-12-17T03:24:00"),
    priority: "p1",
  });
  ic.editProjectMetadata(p1.uuid, {
    status: "completed",
  }); // mark as done to make sure completion gets injected correctly
  

  // project 2
  ic.createProject({
    title: "Get a nice PRAWN", 
    description: "Cooked as can be!",
  });
  const p2 = ic._projects[1];
  ic.createTodo(p2.uuid, {
    title: "Buy a prawn at the supermarket",
    description: null, // test with null
    dueDateTime: new Date("1995-12-17T03:24:00"),
    priority: "p1",
  });
  ic.createTodo(p2.uuid, {
    title: "Cook the prawn",
    dueDateTime: new Date("1995-12-17T03:24:00"),
    priority: "p3",
  });

  // project 3
  ic.createProject({
    title: "Get a nice YAWN", 
    description: "Sleepy as can be!",
  });
  const p3 = ic._projects[2];
  ic.createTodo(p3.uuid, {
    title: "Go to the bed",
    description: "This step is extremely important.",
    // test without a priority
  });
  ic.createTodo(p3.uuid, {
    title: "Sleep",
    description: null,
    priority: "p3",
  });
}

// internalController: initialize
function runTestSet5() {
  const ic = internalController;

  // run createProjectsHelper to get some projects in to test
  console.log(
    "Page initialized:",
    ic.initialize(),
  );

  // test creating a default project: first removing all projects
  localStorage.clear();
  ic._projects.length = 0;
  console.log(
    "Page initialized with default project:",
    ic.initialize(),
  );
}

export { 
  runTestSet1, 
  runTestSet2, 
  runTestSet3, 
  runTestSet4,
  createProjectsHelper,
  runTestSet5,
};