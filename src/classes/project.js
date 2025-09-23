import { uuidGenerator } from "../barrel.js";
import { statusGenerator } from "../barrel.js";


export default class Project {
  #uuid = uuidGenerator.generate();
  status = statusGenerator.createIncompleteStatus();

  constructor({ title, description, todos = [], }) {
    this.title = title;
    this.description = description;
    this.todos = todos;
  }

  edit({
    // Provide current value as default for unedited fields
    title = this.title,
    description = this.description,
    status = this.status,
  }) {
    this.title = title;
    this.description = description;
    this.status = status;
  }
  
}