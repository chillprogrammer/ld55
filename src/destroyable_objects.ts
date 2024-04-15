import { Container, Point, Sprite, Ticker } from "pixi.js";
import { Game } from "./game";
import { ZIndexManager } from './managers/zIndex-manager'


export class DestoryableObjects {


    private fountainDrink: FountainDrink;
    private trashCans: TrashCan[] = [];


    constructor() {
        if (!DestoryableObjects.spritesheetAssets) throw "Need to define spritesheetAssets before creating new player";
        if (!DestoryableObjects.mainContainer) throw "Need to define mainContainer before creating new player";

        this.fountainDrink = new FountainDrink();
        DestoryableObjects.mainContainer.addChild(this.fountainDrink.sprite);

        for (let i = 0; i < 3; i++) {
            let trashCan = new TrashCan();
            this.trashCans.push(trashCan);
            DestoryableObjects.mainContainer.addChild(trashCan.sprite);

            switch (i) {
                case 0:
                    trashCan.sprite.position = new Point(DestoryableObjects.game.INITIAL_WIDTH - 15, DestoryableObjects.game.INITIAL_HEIGHT / 2 - 38);
                    break;

                case 1:
                    trashCan.sprite.position = new Point(15, DestoryableObjects.game.INITIAL_HEIGHT / 2 + 80);
                    break;

                case 2:
                    trashCan.sprite.position = new Point(DestoryableObjects.game.INITIAL_WIDTH - 15, DestoryableObjects.game.INITIAL_HEIGHT / 2 + 80);
                    break;

                default:
                    trashCan.sprite.position = new Point(DestoryableObjects.game.INITIAL_WIDTH / 2, DestoryableObjects.game.INITIAL_HEIGHT / 2);
                    break;

            }
        }

        Ticker.shared.add(this.update, this);
    }


    public destroy() {
        Ticker.shared.remove(this.update, this);
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

    public getTrashcans(): TrashCan[] {
        return this.trashCans;
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

export class TrashCan {
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
        this.sprite = Sprite.from(DestoryableObjects.spritesheetAssets['trashcan.png']);
        this.sprite.scale.set(this.spriteScale, this.spriteScale);
        this.sprite.anchor.set(0.5, 0.5);
    }

    public update(deltaTime: number) {

    }
}
