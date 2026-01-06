import {Application, Container, HTMLText} from "pixi.js";

export class Character extends Container {
  private textElement: HTMLText;
  private characterName: string;
  private iconEmoji: string;

  constructor(
    app: Application,
    characterName: string,
    iconEmoji: string,
    posX: number,
    posY: number
  ) {
    super();
    this.characterName = characterName;
    this.iconEmoji = iconEmoji;

    this.textElement = new HTMLText({
      text: Character.formatCharacterText(iconEmoji, characterName, 0),
      style: {
        fontFamily: "Arial",
        fontSize: 24,
        fill: "white",
        align: "left",
      },
    });
    this.textElement.position.set(posX, posY);
    app.stage.addChild(this.textElement);
  }

  updateDeliveryCount(count: number) {
    this.textElement.text = Character.formatCharacterText(
      this.iconEmoji,
      this.characterName,
      count
    );
  }

  private static formatCharacterText(
    iconEmoji: string,
    name: string,
    count: number
  ) {
    return count === 0
      ? `<b>${iconEmoji} ${name}</b><br/><small>idle</small>`
      : `<b>${iconEmoji} ${name}</b><br/><small>delivering: ${count} x ✉️</small>`;
  }
}
