import { Project } from "./barrel.js";
import { TodoItem } from "./barrel.js";

import { dateFns } from "./barrel.js";

import { storageController } from "./barrel.js";
import { internalController } from "./barrel.js";

function runTests() {
  // create a todo
  const todo = new TodoItem({
    title: "Buy groceries",
    description: "Go to the Shop. Remember to bring a bag to avoid paying the fee",
    dueDate: new Date(2025, 9-1, 2),
    priorityLvl: "p1",
  });
  console.log(todo);
  console.log(todo.status);
  console.log(todo.priority);

  // edit a todo
  todo.editMetadata({
    title: "Buy hardware",
    priorityLvl: "p2",
  });
  console.log(todo);
  console.log(todo.status);
  console.log(todo.priority);

  // create a project
  const project = new Project({
    title: "Cook a goulash",
    description: "This is my first attempt at cooking an American goulash! I'm so excited."
  });
  console.log(project);
  console.log(project.status);

  // create a project's metadata
  project.editMetadata({
    title: "Cook a delicious goulash",
  });
  console.log(project);
  console.log(project.status);

  // add todos to a project
  project.addTodo(todo);
  project.addTodo(new TodoItem({title: "test todo2"}));
  project.addTodo(new TodoItem({title: "test todo3"}));
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

  // mark a todo as done
  console.log(todo.status);
  todo.toggleStatus();
  console.log(todo.status);

  // mark a project as done
  console.log(project.status);
  project.toggleStatus();
  console.log(project.status);
}

export { runTests };