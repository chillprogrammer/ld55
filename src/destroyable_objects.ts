import { Container, Point, Sprite, Ticker } from "pixi.js";
import { Game } from "./game";
import { ZIndexManager } from './managers/zIndex-manager'


export class DestoryableObjects {


    private fountainDrink: FountainDrink;


    constructor() {
        if (!DestoryableObjects.spritesheetAssets) throw "Need to define spritesheetAssets before creating new player";
        if (!DestoryableObjects.mainContainer) throw "Need to define mainContainer before creating new player";

        this.fountainDrink = new FountainDrink();
        DestoryableObjects.mainContainer.addChild(this.fountainDrink.sprite);


        Ticker.shared.add(this.update.bind(this));
    }

    public static game: Game | undefined;
    public static setGame(game: Game) {
        DestoryableObjects.game = game;
    }

    public static get keyManager() {
        return DestoryableObjects.game.keyManager;
    }


    public static get spritesheetAssets() {
        return DestoryableObjects.game.spritesheetAssets;
    }


    public static get mainContainer() {
        return DestoryableObjects.game.mainContainer;
    }

    private update(ticker: Ticker) {
        const deltaTime = ticker.deltaMS;
    }

    public getFountain(): FountainDrink {
        return this.fountainDrink;
    }

}

export class FountainDrink {
    public sprite: Sprite = null;
    public health: number = 100;
    public spriteScale: number = 1;

	public getZIndexY() {
		return this.sprite.getBounds().bottom
	}

	public setZIndex(value: number) {
		this.sprite.zIndex = value;
	}

	public zIndexManager = new ZIndexManager(this.getZIndexY.bind(this), this.setZIndex.bind(this));

    constructor() {
        this.sprite = Sprite.from(DestoryableObjects.spritesheetAssets['drink_machine.png']);
        this.sprite.scale.set(this.spriteScale, this.spriteScale);
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.position = new Point(this.sprite.width / 2 + 5, DestoryableObjects.game.INITIAL_HEIGHT / 2 - 40)
    }

    public update(deltaTime: number) {

    }
}
