import { uuidGenerator } from "../barrel.js";
import { statusGenerator } from "../barrel.js";


export default class Project {
  #uuid = uuidGenerator.generate();

  constructor({ title, description, todos = [], }) {
    this.title = title;
    this.description = description;
    this.todos = todos;
  }
  
}