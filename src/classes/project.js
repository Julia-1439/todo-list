import { uuidGenerator } from "../barrel.js";
import { statusGenerator } from "../barrel.js";
import { TodoItem } from "../barrel.js";


export default class Project {
  #uuid = uuidGenerator.generate();
  status = statusGenerator.incompleteStatus();
  todoList = [];

  constructor({ title, description, }) {
    this.title = title;
    this.description = description;
  }

  editMetadata({
    // Provide current value as default for unedited fields
    title = this.title,
    description = this.description,
  }) {
    this.title = title;
    this.description = description;
  }

  toggleStatus() {
    Object.assign(
      this.status,
      this.status.text === "incomplete" 
        ? statusGenerator.completedStatus() 
        : statusGenerator.incompleteStatus(),
    );
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
      todoList: project.todoList.map(todo => TodoItem.details(todo)),
    };
  }
  
  get uuid() { return this.#uuid; }
}