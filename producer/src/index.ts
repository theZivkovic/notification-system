import express, {type Request, type Response} from "express";
import {
  dispatchNotification,
  flushNotificationsFromDeadletter,
} from "./notifications.js";

const app = express();
let isServerUp = false;

app.get("/ready", (_req: Request, res: Response) => {
  if (isServerUp) {
    res.status(200).send("Producer service is ready.");
  } else {
    res.status(503).send("Producer service is not ready.");
  }
});

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).send("Producer service is healthy.");
});

app.post(
  "/notifications",
  express.json(),
  async (req: Request, res: Response) => {
    try {
      const notificationMessage = req.body.message;
      if (!notificationMessage) {
        return res.status(400).send("Message is required");
      }

      await dispatchNotification(notificationMessage);
      res.status(200).json({message: "Notification dispatched successfully"});
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

app.post(
  "/notifications/flush-from-deadletter",
  async (req: Request, res: Response) => {
    try {
      await flushNotificationsFromDeadletter();
      res
        .status(200)
        .json({message: "Notifications flushed from dead letter queue"});
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

app.listen(process.env.PORT || 3000, () => {
  isServerUp = true;
  console.log("Producer service is running.");
});
