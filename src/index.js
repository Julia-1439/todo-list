import { 
  runTestSet1, 
  runTestSet2, 
  runTestSet3, 
  runTestSet4,
  createProjectsHelper 
} from "./tester.js";

// createProjectsHelper(); // comment out to test persistence of old uuids
setTimeout(() => {
  runTestSet4();
}, 20);