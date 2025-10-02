import { internalControl } from "./barrel.js";
import { displayControl } from "./barrel.js";

function start() {
  internalControl.load();
  displayControl.render();
}


export { start };