const doc = document;
const selector = doc.querySelector("#cu-todo-form-project-selector");

/**
 * 
 * @param {Array{Object}} projectsData 
 */
function renderProjects(projectsData) {
  selector.replaceChildren();

  const blankOption = createOption("", "");
  const projectOptions = projectsData.map(createOption);
  selector.append(blankOption, ...projectOptions);

  function createOption(projectData) {
    const option = doc.createElement("option");
    option.setAttribute("value", projectData.uuid);
    option.textContent = projectData.title;
    return option;
  }
}

export { renderProjects };