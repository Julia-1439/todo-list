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
    status = this.status,
  }) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.status = status;
  }

  static summary(todoItem) {
    return {
      title: todoItem.title,
      dueDate: todoItem.dueDate,
      priority: todoItem.priority,
      status: todoItem.status,
    };
  }

  static details(todoItem) {
    return Object.assign(
      {},
      this.summary(todoItem),
      {description: todoItem.description, }
    );
  }

  get uuid() { return this.#uuid; }

}
