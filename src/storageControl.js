/**
 * Responsibility: Uses the localStorage browser functionality to persist data 
 * across sessions on this device. 
 * 
 * Browser Compatibility: QuotaExceededError is still experimental feature at
 * time of writing. 
 */

import { Project } from "./barrel.js";

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
 * Create a new entry or Update an existing entry
 * @param {Project} project 
 */
function post(project) {
  if (!isStorageAvailable()) {
    console.error("localStorage is not available");
    return false;
  }

  const key = project.uuid;
  const value = Project.serialize(project);
  localStorage.setItem(key, value); // can throw QuotaExceededError
}

/**
 * 
 * @param {String} key the uuid of a Project or TodoItem  
 * @returns {Project} null if no such entry exists    
 */
function get(projectUuid) {
  if (!isStorageAvailable()) {
    console.error("localStorage is not available");
    return false;
  }

  const value = localStorage.getItem(projectUuid);
  if (value === null) {
    return null;
  }

  return Project.revive(value);
}

function remove(projectUuid) {
  if (!isStorageAvailable()) {
    console.error("localStorage is not available");
    return false;
  }

  localStorage.removeItem(projectUuid);
}

/**
 * 
 * @returns {Array{Project}} all projects created but in no particular order 
 * (the localStorage.key function cannot be relied on to retain the order in 
 * which projects were added; see MDN docs.)
 */
function getAll() {
  if (!isStorageAvailable()) {
    console.error("localStorage is not available");
    return false;
  }

  const projects = [];
  for (let i = 0; i < localStorage.length; i++) {
    const projectUuid = localStorage.key(i);
    const project = get(projectUuid);
    if (project !== null)
      projects.push(project);
  }
  return projects; 
}

export { isStorageAvailable, post, remove, getAll };