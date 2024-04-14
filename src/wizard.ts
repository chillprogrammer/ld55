import { Bounds, Container, Point, Sprite, Ticker } from "pixi.js";
import { Game } from "./game";
import { Player } from "./player";
import { FountainDrink } from "./destroyable_objects";

export class WizardSpawner {

    private wizardList: Wizard[] = [];
    private spriteScale = 1;
    private player: Player = null;
    private spawnPosition: Point;
    private spawnInterval: number = 2000;
    private spawnCounter: number = 0;

    public fountain: FountainDrink;

    constructor() {
        if (!WizardSpawner.spritesheetAssets) throw "Need to define spritesheetAssets before creating new player";
        if (!WizardSpawner.mainContainer) throw "Need to define mainContainer before creating new player";

        this.spawnPosition = new Point(WizardSpawner.game.INITIAL_WIDTH / 2, WizardSpawner.game.INITIAL_HEIGHT);
        Ticker.shared.add(this.update.bind(this));
    }


    private update(ticker: Ticker) {
        const deltaTime = ticker.deltaMS;
        this.spawnCounter += deltaTime;


        if (this.spawnCounter > this.spawnInterval) {
            this.spawnCounter = 0;

            this.createWizard();
        }

        const playerYPos = this.player.y;

        for (let i = 0; i < this.wizardList.length; i++) {
            const wizard = this.wizardList[i];

            const wizardYPos = wizard.sprite.position.y;
            wizard.sprite.zIndex = (playerYPos < wizardYPos)
                ? this.player.container.zIndex + 1
                : this.player.container.zIndex - 1;

            wizard.update(deltaTime);

            if (wizard.sprite.position.y < -25 || wizard.sprite.position.y > WizardSpawner.game.INITIAL_HEIGHT + 25 || wizard.sprite.x < -25 || wizard.sprite.x > WizardSpawner.game.INITIAL_WIDTH + 25) {
                wizard.sprite.destroy();
                this.wizardList.splice(i, 1);
            }
        }

    }


    public createWizard(): Wizard {

        const randomNum = Math.floor(Math.random() * 3);
        let targetSprite: object;

        // Target
        switch (randomNum) {
            default:
                targetSprite = this.fountain;
                break;
        }


        let wizard = new Wizard(targetSprite);

        // Color
        const randomNum2 = Math.floor(Math.random() * 3);
        switch (randomNum2) {
            case 0:
                wizard.sprite = Sprite.from(WizardSpawner.spritesheetAssets['wizard.png']);
                break;
            case 1:
                wizard.sprite = Sprite.from(WizardSpawner.spritesheetAssets['wizard_r.png']);
                break;
            case 2:
                wizard.sprite = Sprite.from(WizardSpawner.spritesheetAssets['wizard_g.png']);
                break;
            default:
                wizard.sprite = Sprite.from(WizardSpawner.spritesheetAssets['wizard.png']);
                break;
        }



        wizard.sprite.scale.set(this.spriteScale, this.spriteScale);
        wizard.sprite.anchor.set(0.5, 0.5);
        WizardSpawner.mainContainer.addChild(wizard.sprite);
        wizard.sprite.position.set(this.spawnPosition.x, this.spawnPosition.y);
        this.wizardList.push(wizard);
        return wizard;
    }


    public setPlayer(p: Player) {
        this.player = p;
    }

    public static get spritesheetAssets() {
        return WizardSpawner.game.spritesheetAssets;
    }


    public static get mainContainer() {
        return WizardSpawner.game.mainContainer;
    }

    private static game: Game | undefined;
    public static setGame(game: Game) {
        WizardSpawner.game = game;
    }

}

export class Wizard {
    public sprite: Sprite;
    public targetObject: FountainDrink | any;
    private rotation: number = 0;
    public wizardSpeed: number = 0.05;

    private MIN_DISTANCE_TO_ATTACK: number = 15;

    constructor(_targetObject: object) {
        this.targetObject = (<FountainDrink>_targetObject);
    }

    collidingWithTarget(): boolean {
        const spriteBounds = this.sprite.getBounds();
        const targetBounds = this.targetObject.sprite.getBounds();

        return spriteBounds.x < targetBounds.x + targetBounds.width
            && spriteBounds.x + spriteBounds.width > targetBounds.x
            && spriteBounds.y < targetBounds.y + targetBounds.height
            && spriteBounds.y + spriteBounds.height > targetBounds.y;
    }

    update(deltaTime: number) {

        // If sprite doesn't exist, then dont update anything
        if (!this.sprite || !this.targetObject || !(<any>this.targetObject).sprite) {
            return;
        }

        if (!this.collidingWithTarget()) {
            this.move(deltaTime);
        }

        this.sprite.rotation = this.rotation;
    }

    move(deltaTime: number): void {
        this.sprite.position.y -= deltaTime * this.wizardSpeed;
    }

}