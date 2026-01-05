import cron from "node-cron";
import {blueBookEntryRepository} from "./blueBookEntryRepository.js";
import {BlueBookEntryStatus} from "./blueBookEntry.js";
import {dispatchMessages} from "./messageService.js";

const task = cron.schedule(
  "*/5 * * * * *", // every 5 seconds for demo purposes
  async () => {
    await cronTick();
    const now = new Date().toISOString();
    console.log(`[${now}] Task executed successfully!`);
  },
  {
    timezone: "UTC",
  }
);

async function cronTick() {
  const blueBookEntriesToProcess = await blueBookEntryRepository.getAllByStatus(
    BlueBookEntryStatus.NEW
  );
  await blueBookEntryRepository.updateStatuses(
    blueBookEntriesToProcess.map((entry) => entry.id),
    BlueBookEntryStatus.TAKEN_BY_CARLO
  );

  await waitFor(4000); // simulate processing time

  await dispatchMessages(blueBookEntriesToProcess);
}

function waitFor(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

task.start();

console.log("Cron job service started.");
