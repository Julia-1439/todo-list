import { 
  runTestSet1, 
  runTestSet2, 
  runTestSet3, 
  runTestSet4,
  createProjectsHelper,
  runTestSet5, 
} from "./tester.js";

import { internalController as ic } from "./barrel.js";

const loadData = ic.initialize();

let homeProjectData = loadData.latestProject; 
const homeProjUuid = homeProjectData.uuid;
homeProjectData = ic.editProjectMetadata(homeProjUuid, {
  status: "completed",
});

let todo1Data = loadData.latestProject.todoList[0];
const todo1Uuid = todo1Data.uuid;
todo1Data = ic.editTodo(homeProjUuid, todo1Uuid,
  {
    status: "completed",
    priority: "p1",
  }
);

let todo2Data = loadData.latestProject.todoList[1];
const todo2Uuid = todo2Data.uuid;
todo2Data = ic.editTodo(homeProjUuid, todo2Uuid,
  {
    priority: null,
  }
);

console.log(
  "Home project data:",
  homeProjectData,
  "Todo1 data:",
  todo1Data,
  "Todo2 data:",
  todo2Data,
)