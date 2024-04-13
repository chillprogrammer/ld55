import { Container, Sprite, Ticker } from "pixi.js";
import { Game } from "./game";
import { Player } from "./player";

export class WizardSpawner {

    private wizardList: Wizard[] = [];
    private spriteScale = 1;
    private player: Player = null;



    constructor() {
        if (!WizardSpawner.spritesheetAssets) throw "Need to define spritesheetAssets before creating new player";
        if (!WizardSpawner.mainContainer) throw "Need to define mainContainer before creating new player";

        //this.container.position.set(WizardSpawner.game.INITIAL_WIDTH / 2, WizardSpawner.game.INITIAL_HEIGHT / 2);
        Ticker.shared.add(this.update.bind(this));
    }


    private update(ticker: Ticker) {
        const playerYPos = this.player.y;
        //console.log(this.player.sprite.zIndex)
        for (const wizard of this.wizardList) {
            const wizardYPos = wizard.sprite.position.y;
            console.log(`WizardY: ${wizardYPos}\t, PlayerY: ${playerYPos}`)

            wizard.sprite.zIndex = (playerYPos < wizardYPos)
                ? this.player.container.zIndex + 1
                : this.player.container.zIndex - 1;
        }

    }


    public createWizard(): Wizard {
        let wizard = new Wizard();
        wizard.sprite = Sprite.from(WizardSpawner.spritesheetAssets['wizard.png']);
        wizard.sprite.scale.set(this.spriteScale, this.spriteScale);
        wizard.sprite.anchor.set(0.5, 0.5);
        WizardSpawner.mainContainer.addChild(wizard.sprite);
        wizard.sprite.position.set(WizardSpawner.game.INITIAL_WIDTH / 2, WizardSpawner.game.INITIAL_HEIGHT / 2);
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

    public attackFountainSoda() { }
}