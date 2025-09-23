import { Project } from "./barrel.js";
import { TodoItem } from "./barrel.js";

import { statusGenerator } from "./barrel.js";
import { priorityGenerator } from "./barrel.js";
import { dateFns } from "./barrel.js";

import { storageController } from "./barrel.js";
import { internalController } from "./barrel.js";

function runTests() {
  (() => {
    const todo = new TodoItem({
      title: "Buy groceries",
      description: "Go to the Shop. Remember to bring a bag to avoid paying the fee",
      dueDate: new Date(2025, 9-1, 2),
      priority: new priorityGenerator.createPrio1(),
    })
    console.log(todo);
    console.log(todo.status);
    console.log(todo.priority);

    todo.edit({
      title: "Buy hardware",
      status: new statusGenerator.createCompletedStatus(),
      priority: new priorityGenerator.createPrio2(),
    });
    console.log(todo);
    console.log(todo.status);
    console.log(todo.priority);


    const project = new Project({
      title: "Cook a goulash",
      description: "This is my first attempt at cooking an American goulash! I'm so excited."
    });
    console.log(project);
    console.log(project.status);

    project.editMetadata({
      title: "Cook a delicious goulash",
      status: new statusGenerator.createCompletedStatus(),
    });
    console.log(project);
    console.log(project.status);

    project.addTodo(todo);
    project.addTodo(todo);
    project.addTodo(todo);
    console.log(project.todoList);

    project.removeTodo(todo.uuid); // should remove the first one
    console.log(project.todoList);
  })();
}

export { runTests };