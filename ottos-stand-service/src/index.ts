import express, {type Request, type Response} from "express";
import {
  dispatchNotification,
  flushNotificationsFromDeadletter,
} from "./notifications.js";
import {validationMiddleware} from "./validationMiddleware.js";
import {createNotificationSchema} from "./validationSchemas.js";

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

app.post(
  "/notifications",
  await validationMiddleware(createNotificationSchema),
  async (req: Request, res: Response) => {
    try {
      await dispatchNotification(req.body);
      res
        .status(200)
        .json({
          message: "Notification dispatched successfully",
          payload: req.body,
        });
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

app.listen(PORT, () => {
  console.log(`Ottos stand service is running on port ${PORT}.`);
});
