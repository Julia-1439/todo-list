import { Project } from "./barrel.js";
import { TodoItem } from "./barrel.js";

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
  })();
}

export { runTests };