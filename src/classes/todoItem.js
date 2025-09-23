import { uuidGenerator } from "../barrel.js";
import { statusUtil } from "../barrel.js";
import { priorityUtil } from "../barrel.js";
import { dateFns } from "../barrel.js";

export default class TodoItem {
  static DATE_TIME_FORMAT = "MMM-d-yyyy p";

  #uuid = uuidGenerator.generate();
  status = statusUtil.status("incomplete");

  /**
   * 
   * @param {String} title 
   * @param {String} description 
   * @param {Date} dueDateTime 
   * @param {String} priorityLvl 
   */
  constructor(title, description, dueDateTime, priorityLvl) {
    this.title = title;
    this.description = description;
    this.dueDateTime = dueDateTime;
    this.priority = priorityLvl;
  }

  set dueDateTime(dueDateTime) {
    if (dueDateTime !== undefined )
      this._dueDateTime = dateFns.format(dueDateTime, TodoItem.DATE_TIME_FORMAT);
    else 
      this._dueDateTime = undefined;
  }

  get dueDateTime() {
    return this._dueDateTime;
  }

  set priority(priorityLvl) {
    if (priorityLvl !== undefined)
      this._priority = priorityUtil.priority(priorityLvl);
    else
      this._priority = undefined;
  }

  get priority() {
    return this._priority;
  }

  toggleStatus() {
    statusUtil.toggleStatus(this.status);
  }

  static summary(todo) {
    return {
      title: todo.title,
      dueDate: todo.dueDate,
      priority: todo._priority,
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
