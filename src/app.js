import { internalControl } from "./barrel.js";
import { displayControl } from "./barrel.js";

function start() {
  internalControl.loadData();
  displayControl.renderDisplay();
}


export { start };