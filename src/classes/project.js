import { uuidGenerator } from "../barrel.js";
import { statusUtil } from "../barrel.js";
import { TodoItem } from "../barrel.js";


export default class Project {
  #uuid = uuidGenerator.generate();
  
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

  removeTodo(uuid) {
    const removalIdx = this.todoList.findIndex((todo) => todo.uuid === uuid);
    this.todoList.splice(removalIdx, 1);
  }

  static view(project) {
    return {
      title: project.title,
      description: project.description,
      status: project.status,
      todoList: project.todoList.map(todo => TodoItem.viewSummary(todo)),
    };
  }

  /**
   * A utility function to serialize a project & its todos into storage
   * @param {Project} project 
   * @returns {String} stringified project, with additional property 
   * "uuidToInject" on the project itself and its TodoItems, to be reapplied
   * on deserialization. 
   */
  static serialize(project) {
    project.uuidToInject = project.uuid;
    return JSON.stringify(project, (_, val) => {
      if (val instanceof TodoItem)
        val.uuidToInject = val.uuid;
      return val;
    });
  }

  /**
   * A utility function to revive a project & its todos from storage
   * @param {String} serializedProject 
   * @returns {Project} having the uuid of itself and its todos retained 
   */
  static deserialize(serializedProject) {
    const projectObj = JSON.parse(serializedProject);
    
    const project = new Project(
      projectObj.title,
      projectObj.description,
    );
    project.status = projectObj._status.name;
    projectObj.todoList.forEach((todoObj) => {
      const todo = TodoItem.revive(todoObj);
      project.addTodo(todo);
    });

    project.#uuid = projectObj.uuidToInject;
    return project;
  }
  
  get uuid() { return this.#uuid; }
}