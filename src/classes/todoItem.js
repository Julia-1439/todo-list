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
  constructor(title, description, dueDateTime, priorityLvl) {
    this.title = title;
    this.description = description;
    this.dueDateTime = dueDateTime;
    this.priority = priorityLvl;
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
    if (priorityLvl !== undefined)
      this._priority = priorityUtil.priority(priorityLvl);
    else
      this._priority = undefined;
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

  static summary(todo) {
    return {
      title: todo.title,
      dueDateTime: todo.dueDateTime,
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

  /**
   * 
   * @param {Object} objTodo a plain object representing a TodoItem instance;
   * a result of JSON.parse on a stringified TodoItem created by JSON.stringify. 
   * @param {String} uuid the uuid of the TodoItem before serialization, to 
   * be injected into the revived TodoItem before returning
   * @returns {TodoItem} 
   */
  static instanceReviver(objTodo, uuid) {
    const todo = new TodoItem(
      objTodo.title,
      objTodo.description,
      objTodo._dueDateTime,
      objTodo._priority.level,
    );
    
    todo.status = objTodo._status.name;
    todo.#uuid = uuid;
    return todo;
  }
}
