const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

let fails = 2;

export default async function taskB() {
  console.log("start B");
  await sleep(700);

  if (fails > 0) {
    fails--;
    console.log("fail B");
    throw new Error("B failed");
  }

  console.log("DONE B");
  return "B result";
}
