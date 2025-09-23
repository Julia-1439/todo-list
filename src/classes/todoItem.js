import { uuidGenerator } from "../barrel.js";
import { statusUtil } from "../barrel.js";
import { priorityUtil } from "../barrel.js";

export default class TodoItem {
  #uuid = uuidGenerator.generate();
  status = statusUtil.status("incomplete");

  constructor({ title, description, dueDate, priorityLvl, }) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priorityUtil.priority(priorityLvl);
  }
  
  editMetadata({
    // Provide current value as default for unedited fields
    title = this.title,
    description = this.description,
    dueDate = this.dueDate,
    priorityLvl = this.priority.level,
  }) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priorityUtil.priority(priorityLvl);
  }

  toggleStatus() {
    statusUtil.toggleStatus(this.status);
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
