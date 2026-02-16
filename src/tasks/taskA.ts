const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default async function taskA() {
  console.log("start A");
  await sleep(500);
  console.log("done A");
  return "A result";
}
