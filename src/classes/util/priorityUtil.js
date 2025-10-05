function prioNull() {
  return {
    level: null,
    color: null,
  }
}

function prio4() {
  return {
    level: "p4",
    color: "#b0aaff",
  };
}

function prio3() {
  return {
    level: "p3",
    color: "#ffbe6a",
  };
}

function prio2() {
  return {
    level: "p2",
    color: "#ff8827",
  };
}

function prio1() { 
  return {
    level: "p1",
    color: "#FF5757",
  };
}

/**
 * 
 * @param {String} priorityLvl 
 * @returns {Object} prio4() to prio1() corresponding to priorityLevel 
 */
export function priority(priorityLvl) {
  switch (priorityLvl) {
    case "p4": return prio4();
    case "p3": return prio3();
    case "p2": return prio2();
    case "p1": return prio1();
    default: return prioNull();
  }
}