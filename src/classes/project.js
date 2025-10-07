import { uuidGenerator } from "../barrel.js";
import { statusUtil } from "../barrel.js";
import { TodoItem } from "../barrel.js";


export default class Project {
  #uuid = uuidGenerator.generate();
  #creationTime = (new Date()).valueOf();
  
  constructor(title, description) {
    this.title = title;
    this.description = description;
    
    this.status = "incomplete";
    this.todoList = [];
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

  getTodo(uuid) {
    return this.todoList.find((todo) => todo.uuid === uuid);
  }

  removeTodo(uuid) {
    const removalIdx = this.todoList.findIndex((todo) => todo.uuid === uuid);
    this.todoList.splice(removalIdx, 1);
  }

  /**
   * A utility function to serialize a project & its todos into storage. 
   * The original project & its todos are left unchanged. 
   * @param {Project} project 
   * @returns {String} stringified project, with its private elements exposed 
   * in entries prefixed by "exposed", notably the uuid of the project itself
   * and its todo items.   
   */
  static serialize(project) {
    // create a deep copy of 'project' and expose its private properties for 
    // later deserialization
    const projectClone = Object.assign({}, project);
    Object.assign(projectClone, {
      exposedUuid: project.uuid, 
      exposedCreationTime: project.creationTime,
    });

    return JSON.stringify(projectClone, (_, val) => {
      if (val instanceof TodoItem) { // similarly, expose the uuids of each todo
        const todoClone = Object.assign({}, val);
        Object.assign(todoClone, {exposedUuid: val.uuid});
        return todoClone;
      }
      return val;
    });
  }

  /**
   * A utility function to revive a project & its todos from storage
   * @param {String} serializedProject 
   * @returns {Project} additionally having its private elements from prior to 
   * serialization retained, notably the uuid of the project itself and its todo 
   * items, and the creation timestamp of the project.
   */
  static revive(serializedProject) {
    const projectObj = JSON.parse(serializedProject);
    
    const project = new Project(
      projectObj.title,
      projectObj.description,
    );

    // inject the rest of the properties that can't be passed into constructor
    project.status = projectObj._status.name;
    projectObj.todoList.forEach((todoObj) => {
      const todo = TodoItem.revive(todoObj);
      project.addTodo(todo);
    });
    project.#uuid = projectObj.exposedUuid;
    project.#creationTime = +projectObj.exposedCreationTime;

    return project;
  }
  
  get uuid() { return this.#uuid; }
  get creationTime() { return this.#creationTime; }
}