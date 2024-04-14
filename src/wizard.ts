import { Container, Point, Sprite, Ticker } from "pixi.js";
import { Game } from "./game";
import { Player } from "./player";

export class WizardSpawner {

    private wizardList: Wizard[] = [];
    private spriteScale = 1;
    private player: Player = null;
    private spawnPosition: Point;
    private spawnInterval: number = 5000;
    private spawnCounter: number = 0;

    public wizardSpeed: number = 0.05;

    public fountinPos: Point;

    constructor() {
        if (!WizardSpawner.spritesheetAssets) throw "Need to define spritesheetAssets before creating new player";
        if (!WizardSpawner.mainContainer) throw "Need to define mainContainer before creating new player";

        this.spawnPosition = new Point(WizardSpawner.game.INITIAL_WIDTH / 2, WizardSpawner.game.INITIAL_HEIGHT);
        this.fountinPos = new Point(0, WizardSpawner.game.INITIAL_HEIGHT / 2);
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
            wizard.sprite.position.y -= deltaTime * this.wizardSpeed;

            if (wizard.sprite.position.y < -25 || wizard.sprite.position.y > WizardSpawner.game.INITIAL_HEIGHT + 25 || wizard.sprite.x < -25 || wizard.sprite.x > WizardSpawner.game.INITIAL_WIDTH + 25) {
                wizard.sprite.destroy();
                this.wizardList.splice(i, 1);
            }
        }

    }


    public createWizard(): Wizard {
        
        let wizard = new Wizard(this.fountinPos);

        wizard.sprite = Sprite.from(WizardSpawner.spritesheetAssets['wizard.png']);
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
    public targetPos: Point;

    constructor(_targetPos: Point) {
        this.targetPos = _targetPos;
    }

    update(deltaTime: number) {

    }
}