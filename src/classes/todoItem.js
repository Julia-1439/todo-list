import { uuidGenerator } from "../barrel.js";
import { statusUtil } from "../barrel.js";
import { priorityUtil } from "../barrel.js";

export default class TodoItem {
  static DATE_TIME_FORMAT = "MMM-d-yyyy',' p";
  #uuid = uuidGenerator.generate();

  /**
   * 
   * @param {String} title 
   * @param {String} description 
   * @param {Date | String} dueDateTime for strings, they should be a truthy
   * value that can be converted to a Date via the Date constructor. otherwise,
   * the internal _dueDateTime will be of value undefined.
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
    if (dueDateTime)
      this._dueDateTime = new Date(dueDateTime); 
    else
      this._dueDateTime = undefined;
  }

  get dueDateTime() {
    return this._dueDateTime;
  }

  set priority(priorityLvl) {
    this._priority = priorityUtil.priority(priorityLvl);
  }

  get priority() {
    return this._priority;
  }

  set status(name) {
    this._status = statusUtil.status(name);
  }

  get status() {
    return this._status;
  }

  get uuid() { 
    return this.#uuid; 
  }

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
