import { 
  runTestSet1, 
  runTestSet2, 
  runTestSet3, 
  runTestSet4,
  createProjectsHelper,
  runTestSet5, 
} from "./tester.js";

import { internalController as ic } from "./barrel.js";

ic.initialize();
const homeProjUuid = "2ba9d9ee-25a4-46ae-9916-6bff54f32665";
ic.editProjectMetadata(homeProjUuid, {
  status: "completed",
});

ic.editTodo(homeProjUuid,
  "018f1092-7dd5-44e2-a481-a272a67d67e4",
  {
    status: "completed",
    priority: "p1",
  }
);

ic.editTodo(homeProjUuid,
  "38fa18e7-1ad2-46c0-bd64-d5a466d715bd",
  {
    priority: null,
  }
);