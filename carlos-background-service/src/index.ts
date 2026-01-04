import cron from "node-cron";

const task = cron.schedule(
  "* * * * *",
  () => {
    const now = new Date().toISOString();
    console.log(`[${now}] Task executed successfully!`);
  },
  {
    timezone: "UTC",
  }
);

// Start the task (scheduled is true by default, so this is optional)
task.start();

console.log("Cron job service started.");
