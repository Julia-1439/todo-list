/**
 * Responsibility: Uses the localStorage browser functionality to persist data 
 * across sessions on this device. 
 * How: Receives instances of Project, TodoItem, ChecklistItem to serialize them
 * into localStorage. Deserializes them and recreates the class instances. 
 * 
 * Browser Compatibility: QuotaExceededError is still experimental feature at
 * time of writing. 
 */

// i think reviving functionality is buitl into json retrieval, so would be good to do it here. 
// need to test this module assuming local storage is not available too.

import { ChecklistItem, TodoItem } from "./index.js";

/**
 * 
 * @returns {Boolean} whether browser's localStorage is available. *Note* that
 * availability does not imply available quota to store items, but this function
 * will still return true. Meeting quota should be checked elsewhere.  
 */
const isStorageAvailable = (() => {
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
})();

/**
 * Create a new entry or Update an existing entry
 * @param {Project | TodoItem | ChecklistItem } item 
 */
function post(item) {
  const key = item.uuid;
  const value = JSON.stringify(item);
  localStorage.setItem(key, value); // can throw QuotaExceededError
}

/**
 * 
 * @param {String} uuid 
 * @returns Object belonging to uuid, or false if no such entry exists.    
 */
function get(uuid) {
  let value; 
  value = localStorage.getItem(uuid);
  if (value === null) {
    return false;
  }
  value = JSON.parse(value, () => {
    // reviving 
  });
  return value;
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

export { isStorageAvailable, post, getAllProjects };

// recreate the objects via iterating on the prototype, maybe