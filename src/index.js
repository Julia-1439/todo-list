/* ========================================================================== */
/* TEST INPUTS */
/* ========================================================================== */

import { Project } from "./barrel.js";
import { TodoItem } from "./barrel.js";
import { ChecklistItem } from "./barrel.js";

import { storageController } from "./barrel.js";
import { internalController } from "./barrel.js";

const todo = new TodoItem({
  title: "Pick up kid from school",
  dueDate: "today",
  status: "incomplete",
  priority: "high",
});
todo.addChecklistItem(new ChecklistItem({ description: "get in the car"})); 
todo.addChecklistItem(new ChecklistItem({ description: "drive to school"})); 
todo.deleteChecklistItemAt(1);
console.log(todo);

const project = new Project({title: "Meow at 10 decibels"});
console.log(project);

