/**
 * Responsibility: Uses the localStorage browser functionality to persist data 
 * across sessions on this device. 
 * How: Receives instances of Project, TodoItem, ChecklistItem to serialize them
 * into localStorage. Deserializes them and recreates the class instances. 
 * 
 * Browser Compatibility: QuotaExceededError is still experimental feature at
 * time of writing. 
 */

// @TODO need to test this module assuming localStorage is not available too.


import { TodoItem, Project } from "./barrel.js";

const classes = [TodoItem, Project];
const classAccessor = Object.fromEntries(
  classes.map(cls => [cls.name, cls])
);

/**
 * 
 * @returns {Boolean} whether browser's localStorage is available. *Note* that
 * availability does not imply available quota to store items, but this function
 * will still return true. Meeting quota should be checked elsewhere.  
 */
function isStorageAvailable() {
  let storage;
  try {
    storage = window["localStorage"];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;

  } catch (e) {
    return (
      e instanceof DOMException && 
      e.name === "QuotaExceededError" && 

      // acknowledge QuotaExceededError only if there' something already stored
      storage &&
      storage.length !== 0
    );
  }
}

/**
 * 
 * @param {Project | TodoItem} item 
 * @returns {String}
 */
function serialize(item) {
  item.itemCreator = item.constructor.name;
  return JSON.stringify(item);
}

/**
 * 
 * @param {String} value 
 * @returns {Project | TodoItem}
 */
function deserialize(value, uuidToInject) {
  const parsedValue = JSON.parse(value);
  const itemCreator = classAccessor[parsedValue.itemCreator];
  return itemCreator.instanceReviver(parsedValue, uuidToInject);
}

/**
 * Create a new entry or Update an existing entry
 * @param {Project | TodoItem } item 
 */
function post(item) {
  const key = item.uuid;
  const value = serialize(item);
  localStorage.setItem(key, value); // can throw QuotaExceededError
}

/**
 * 
 * @param {String} key the uuid of a Project or TodoItem  
 * @returns {Project | TodoItem} false if no such entry exists    
 */
function get(key) {
  const value = localStorage.getItem(key);
  if (value === null) {
    return false;
  }

  const uuid = key;
  return deserialize(value, uuid);
}

function remove(key) {
  localStorage.removeItem(key);
}

/**
 * @TODO how do you even distinguish Projects from TodoItems? 
 */
function getAllProjects() {
  const data = [];
  for (let i = 0; i < localStorage.length; i++) {
    data.push(get(localStorage.key(i)));
  }
  return data; 
}

// @TODO get should probably be removed. just in here for testing
export { isStorageAvailable, post, get, remove, getAllProjects };

// recreate the objects via iterating on the prototype, maybe