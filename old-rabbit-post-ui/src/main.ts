import {Application, FederatedPointerEvent, HTMLText} from "pixi.js";
import {Button} from "@pixi/ui";
import {createBlueBookEntry, getAllBlueBookEntries} from "./apiClient";
import {BlueBookEntryStatus} from "./blueBookEntry";
import {debounce} from "./debounce";
import {Character} from "./Character";

function createPostmans(
  app: Application,
  postmanNames: Array<string>
): Array<Character> {
  const postmans: Array<Character> = [];
  const postmanPadding = 100;
  for (let i = 0; i < postmanNames.length; i++) {
    const postman = new Character(
      app,
      postmanNames[i],
      "👮🏻",
      (3 * app.screen.width) / 4.0,
      postmanPadding +
        (app.screen.height - 2 * postmanPadding) * ((i + 1) / 6.0)
    );
    postmans.push(postman);
  }
  return postmans;
}

function createSendButton(
  app: Application,
  onPress: (btn?: Button | undefined, e?: FederatedPointerEvent) => void
): Button {
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
  button.onPress.connect(onPress);
  return button;
}

(async () => {
  const app = new Application();
  await app.init({background: "#1099bb", resizeTo: window});

  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // create characters
  const postmanNames = ["Pete", "Paula", "Penny", "Patty", "Prat"];

  const ottosStand = new Character(
    app,
    "Otto",
    "👦",
    app.screen.width / 4,
    app.screen.height / 2
  );
  const carlosPost = new Character(
    app,
    "Carlo",
    "🧙 ",
    app.screen.width / 2,
    app.screen.height / 2
  );
  const postmans = createPostmans(app, postmanNames);

  // creare send button with debounced press handler
  const debouncedPress = debounce(async () => {
    await createBlueBookEntry();
    await refreshCharactersBasedOnUpdatedBlueBook();
  }, 200);
  const sendButton = createSendButton(app, debouncedPress);
  app.stage.addChild(sendButton.view!);

  // setup periodic refresh
  let appTimer = 0;

  const ONE_SECOND_MS = 1000;
  app.ticker.add(async (time) => {
    appTimer += time.deltaMS;
    if (appTimer > ONE_SECOND_MS) {
      appTimer -= ONE_SECOND_MS;
      await refreshCharactersBasedOnUpdatedBlueBook();
    }
  });

  async function refreshCharactersBasedOnUpdatedBlueBook() {
    const blueBookEntries = await getAllBlueBookEntries();
    ottosStand.updateDeliveryCount(
      blueBookEntries.filter((x) => x.status === BlueBookEntryStatus.NEW).length
    );
    carlosPost.updateDeliveryCount(
      blueBookEntries.filter(
        (x) => x.status === BlueBookEntryStatus.TAKEN_BY_CARLO
      ).length
    );
    postmans.forEach((postman, index) => {
      postman.updateDeliveryCount(
        blueBookEntries.filter(
          (x) =>
            x.status === BlueBookEntryStatus.TAKEN_BY_POSTMAN &&
            x.delivering_by === postmanNames[index]
        ).length
      );
    });
  }
})();
