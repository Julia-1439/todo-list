import { statusGenerator } from "./barrel.js";
import { priorityGenerator } from "./barrel.js";
import { uuidGenerator } from "./barrel.js";
import { storageController } from "./barrel.js";

console.log(uuidGenerator);

class ChecklistItem {
  #uuid = uuidGenerator.generate();
  status = statusGenerator.createIncompleteStatus();

  constructor({ description, }) {
    this.description = description;
  }

  editDetails({ description = this.description, }) {
    this.description = description;
  }

  get uuid() { return this.#uuid; }
}

class TodoItem {
  #uuid = uuidGenerator.generate();
  status = statusGenerator.createIncompleteStatus();

  constructor({ title, description, dueDate, priority, note, checklist = [], }) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.note = note;
    this.checklist = checklist;
  }
  
  edit({
    title = this.title,
    description = this.description,
    dueDate = this.dueDate,
    priority = this.priority,
    note = this.note,
  }) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.note = note;
  }

  addChecklistItem(checklistItem) {
    this.checklist.push(checklistItem);
  }
  deleteChecklistItemAt(removalIdx) {
    this.checklist.splice(removalIdx, 1);
  }

  get summary() {
    return {
      title: this.title, 
      dueDate: this.dueDate, 
      status: this.status, 
      priority: this.priority,
    };
  }

  get details() {
    return {
      title: this.title, 
      dueDate: this.dueDate, 
      description: this.description,
      notes: this.notes,
      checklist: this.checklist,
      status: this.status, 
      priority: this.priority,
    };
  }

  get uuid() { return this.#uuid; }

}

class Project {
  #uuid = uuidGenerator.generate();

}



const internalController = (function () {

})();


export { ChecklistItem, TodoItem };

/* ========================================================================== */
/* TEST INPUTS */
/* ========================================================================== */

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

const project = new Project();
console.log(project);

