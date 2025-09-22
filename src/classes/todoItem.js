import { uuidGenerator } from "../barrel.js";
import { statusGenerator } from "../barrel.js";
import { priorityGenerator } from "../barrel.js";

export default class TodoItem {
  #uuid = uuidGenerator.generate();
  status = statusGenerator.createIncompleteStatus();

  constructor({ title, description, dueDate, priority, }) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
  }
  
  edit({
    // Provide current value as default for unedited fields
    title = this.title,
    description = this.description,
    dueDate = this.dueDate,
    priority = this.priority,
  }) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
  }

  get uuid() { return this.#uuid; }

}
