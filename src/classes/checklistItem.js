import { uuidGenerator } from "../barrel.js";
import { statusGenerator } from "../barrel.js";

export default class ChecklistItem {
  #uuid = uuidGenerator.generate();
  status = statusGenerator.createIncompleteStatus();

  constructor({ description, }) {
    this.description = description;
  }

  editDetails({ description = this.description, }) {
    this.description = description;
  }

  get uuid() { return this.#uuid; }
}
