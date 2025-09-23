import { uuidGenerator } from "../barrel.js";
import { statusUtil } from "../barrel.js";
import { TodoItem } from "../barrel.js";


export default class Project {
  #uuid = uuidGenerator.generate();
  status = statusUtil.status("incomplete");
  todoList = [];

  constructor(title, description) {
    this.title = title;
    this.description = description;
  }

  get status() {
    return this._status;
  }

  set status(name) {
    this._status = statusUtil.status(name);
  }

  /**
   * 
   * @param {TodoItem} todo 
   */
  addTodo(todo) {
    this.todoList.push(todo);
  }

  removeTodo(uuid) {
    const removalIdx = this.todoList.findIndex((todo) => todo.uuid === uuid);
    this.todoList.splice(removalIdx, 1);
  }

  static details(project) {
    return {
      title: project.title,
      description: project.description,
      status: project.status,
      todoList: project.todoList.map(todo => TodoItem.details(todo)),
    };
  }
  
  get uuid() { return this.#uuid; }
}