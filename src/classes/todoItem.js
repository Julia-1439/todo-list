import { uuidGenerator } from "../barrel.js";
import { statusGenerator } from "../barrel.js";
import { priorityGenerator } from "../barrel.js";

export default class TodoItem {
  #uuid = uuidGenerator.generate();
  status = statusGenerator.incompleteStatus();

  constructor({ title, description, dueDate, priority, }) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
  }
  
  editMetadata({
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

  toggleStatus() {
    Object.assign(
      this.status,
      this.status.text === "incomplete" 
        ? statusGenerator.completedStatus() 
        : statusGenerator.incompleteStatus(),
    );
  }

  static summary(todo) {
    return {
      title: todo.title,
      dueDate: todo.dueDate,
      priority: todo.priority,
      status: todo.status,
    };
  }

  static details(todo) {
    return Object.assign(
      {},
      this.summary(todo),
      {description: todo.description, }
    );
  }

  get uuid() { return this.#uuid; }

}
