const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default async function taskC() {
  console.log("start C");
  await sleep(400);
  console.log("fail C");
  throw new Error("C failed");
  return " ";
}
