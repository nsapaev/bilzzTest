import { queue } from "./queue";
import taskA from "./tasks/taskA";
import taskB from "./tasks/taskB";
import taskC from "./tasks/taskC";

async function main() {
  const tasks = [taskA, taskB, taskC];
  const results = await queue(tasks, 2, 3);

  console.log("\nResults:");

  results.forEach((r, i) => console.log(i, r));
}

main();
