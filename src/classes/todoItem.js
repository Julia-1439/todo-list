import { uuidGenerator } from "../barrel.js";
import { statusUtil } from "../barrel.js";
import { priorityUtil } from "../barrel.js";
import { dateFns } from "../barrel.js";

export default class TodoItem {
  static DATE_TIME_FORMAT = "MMM-d-yyyy p";
  #uuid = uuidGenerator.generate();

  /**
   * 
   * @param {String} title 
   * @param {String} description 
   * @param {Date | String} dueDateTime 
   * @param {String} priorityLvl 
   */
  constructor(title, description, dueDateTime, priority) {
    this.title = title;
    this.description = description;
    this.dueDateTime = dueDateTime;
    this.priority = priority;

    this.status = "incomplete";
  }

  set dueDateTime(dueDateTime) {
    if (dueDateTime !== undefined)
      this._dueDateTime = new Date(dueDateTime); 
    else
      this._dueDateTime = dueDateTime;
  }

  get dueDateTime() {
    if (this._dueDateTime !== undefined)
      return dateFns.format(this._dueDateTime, TodoItem.DATE_TIME_FORMAT);
    else
      return this._dueDateTime;
  }

  set priority(priorityLvl) {
    this._priority = priorityUtil.priority(priorityLvl);
  }

  get priority() {
    return this._priority;
  }

  get status() {
    return this._status;
  }

  set status(name) {
    this._status = statusUtil.status(name);
  }

  static viewSummary(todo) {
    return {
      title: todo.title,
      dueDateTime: todo.dueDateTime,
      priority: todo.priority,
      status: todo.status,
    };
  }

  static viewDetails(todo) {
    return {
      ...this.viewSummary(todo),
      description: todo.description,
    };
  }

  get uuid() { return this.#uuid; }

  /**
   * A utility function used to revive a TodoItem instance, for use in 
   * deserializing a Project instance from storage,
   * @param {Object} objTodo a plain object representing a TodoItem instance,
   * containing an additional property "exposedUuid", which is applied to the
   * new TodoItem to persist the uuid originally stored.  
   * @returns {TodoItem} having its uuid retained
   */
  static revive(objTodo) {
    const todo = new TodoItem(
      objTodo.title,
      objTodo.description,
      objTodo._dueDateTime,
      objTodo._priority.level,
    );
    todo.status = objTodo._status.name;

    todo.#uuid = objTodo.exposedUuid;
    return todo;
  }
}
