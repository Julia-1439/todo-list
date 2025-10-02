function incompleteStatus() {
  return {
    name: "incomplete",
    color: "#00000000",
  };
}

function completedStatus() {
  return {
    name: "completed",
    color: "#11cc11",
  };
}

export function status(statusName) {
  switch (statusName) {
    case "incomplete": return incompleteStatus();
    case "completed": return completedStatus();
  }  
}
