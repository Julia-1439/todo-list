function incompleteStatus() {
  return {
    name: "incomplete",
    color: "#9b9b9b",
  };
}

function completedStatus() {
  return {
    name: "completed",
    color: "#80ff80",
  };
}

export function status(statusName) {
  switch (statusName) {
    case "incomplete": return incompleteStatus();
    case "completed": return completedStatus();
  }  
}

export function toggleStatus(currStatus) {
  Object.assign(
    currStatus,
    currStatus.name === "incomplete" 
      ? completedStatus()
      : incompleteStatus()
  );
}