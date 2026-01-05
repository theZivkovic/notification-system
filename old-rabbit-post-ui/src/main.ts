import {Application, HTMLText} from "pixi.js";
import {Button} from "@pixi/ui";
import {createBlueBookEntry, getAllBlueBookEntries} from "./apiClient";
import {BlueBookEntryStatus} from "./blueBookEntry";

function formatCharacterText(iconEmoji: string, name: string, count: number) {
  return count === 0
    ? `<b>${iconEmoji} ${name}</b><br/><small>idle</small>`
    : `<b>${iconEmoji} ${name}</b><br/><small>delivering: ${count} x ✉️</small>`;
}

(async () => {
  const app = new Application();
  await app.init({background: "#1099bb", resizeTo: window});

  document.getElementById("pixi-container")!.appendChild(app.canvas);

  //

  // add otto's stand
  const ottosStand = new HTMLText({
    text: formatCharacterText("👦", "Otto", 0),
    style: {
      fontFamily: "Arial",
      fontSize: 24,
      fill: "white",
      align: "left",
    },
  });
  ottosStand.position.set(app.screen.width / 4, app.screen.height / 2);
  app.stage.addChild(ottosStand);

  // add carlo's stand
  const carlosPost = new HTMLText({
    text: formatCharacterText("🧙", "Carlo", 0),
    style: {
      fontFamily: "Arial",
      fontSize: 24,
      fill: "white",
      align: "left",
    },
  });
  carlosPost.position.set(app.screen.width / 2, app.screen.height / 2);
  app.stage.addChild(carlosPost);

  // add postmans
  const postmans: Array<HTMLText> = [];
  const postmanPadding = 100;
  const postmanNames = ["Pete", "Paula", "Penny", "Patty", "Prat"];
  for (let i = 0; i < postmanNames.length; i++) {
    const postman = new HTMLText({
      text: formatCharacterText("👮🏻", postmanNames[i], 0),
      style: {
        fontFamily: "Arial",
        fontSize: 24,
        fill: "white",
        align: "left",
      },
    });
    postman.position.set(
      (3 * app.screen.width) / 4.0,
      postmanPadding +
        (app.screen.height - 2 * postmanPadding) * ((i + 1) / 6.0)
    );
    postmans.push(postman);
    app.stage.addChild(postman);
  }

  const buttonHtml = new HTMLText({
    text: "Send ✉️",
    style: {
      fontFamily: "Arial",
      fontSize: 24,
      fill: "white",
      align: "left",
    },
  });
  buttonHtml.position.set(100, app.screen.height / 2.0);

  const button = new Button(buttonHtml);
  button.onPress.connect(async () => {
    await createBlueBookEntry();
    await refreshBlueBookEntries();
  });

  app.stage.addChild(button.view!);

  let appTimer = 0;

  app.ticker.add(async (time) => {
    appTimer += time.deltaMS;
    if (appTimer > 1000) {
      appTimer -= 1000;
      await refreshBlueBookEntries();
    }
  });

  async function refreshBlueBookEntries() {
    const blueBookEntries = await getAllBlueBookEntries();
    ottosStand.text = formatCharacterText(
      "👦",
      "Otto",
      blueBookEntries.filter((x) => x.status === BlueBookEntryStatus.NEW).length
    );
    carlosPost.text = formatCharacterText(
      "🧙",
      "Carlo",
      blueBookEntries.filter(
        (x) => x.status === BlueBookEntryStatus.TAKEN_BY_CARLO
      ).length
    );
    postmans.forEach((postman, index) => {
      postman.text = formatCharacterText(
        "👮🏻",
        postmanNames[index],
        blueBookEntries.filter(
          (x) =>
            x.status === BlueBookEntryStatus.TAKEN_BY_POSTMAN &&
            x.delivering_by === postmanNames[index]
        ).length
      );
    });
  }
})();
