import { Bounds, Container, Point, Sprite, Ticker } from "pixi.js";
import { Game } from "./game";
import { Player } from "./player";
import { FountainDrink, TrashCan } from "./destroyable_objects";
import { ZIndexManager } from './managers/zIndex-manager';
import { Trash, WizardDust } from './trash';

export class WizardSpawner {

    public static wizardList: Wizard[] = [];
    private spriteScale = 1;
    private player: Player = null;
    private spawnPosition: Point;
    private spawnInterval: number = 2000;
    private spawnCounter: number = 0;

    public fountain: FountainDrink;
    public trashCans: TrashCan[];

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


        for (let i = 0; i < WizardSpawner.wizardList.length; i++) {
            const wizard = WizardSpawner.wizardList[i];

            if(!wizard.sprite) {
                WizardSpawner.wizardList.splice(i, 1);
                i--;
                return;
            }
            
            if (wizard.sprite.position.y < -25 || wizard.sprite.position.y > WizardSpawner.game.INITIAL_HEIGHT + 25 || wizard.sprite.x < -25 || wizard.sprite.x > WizardSpawner.game.INITIAL_WIDTH + 25) {
                wizard.sprite.destroy();
                WizardSpawner.wizardList.splice(i, 1);
                i--;
            }

            wizard.update(deltaTime);
        }

    }


    public createWizard()/*: Wizard*/ {

        const randomNum = Math.floor(Math.random() * 4);
        let targetSprite: object;

        // Target
        switch (randomNum) {
            case 0:
                targetSprite = this.fountain;
                break;

            case 1:
                targetSprite = this.trashCans[0];
                break;

            case 2:
                targetSprite = this.trashCans[1];
                break;

            case 3:
                targetSprite = this.trashCans[2];
                break;

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
        WizardSpawner.wizardList.push(wizard);
        console.log(WizardSpawner.wizardList);
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
    public isAlive: boolean = true;
    public sprite: Sprite;
    public targetObject: FountainDrink | TrashCan | any;
    private rotation: number = 0;
    public wizardSpeed: number = 0.05;
    private rotationDirection: number = 1;
    private MAX_ROTATION_AMOUNT: number = 0.08;
    private deltaTime: number;
    private MIN_DISTANCE_TO_ATTACK: number = 15;

    private attackCooldown: number = 2000;
    private attackCooldownFactor: number = this.attackCooldown;
    private canAttack: boolean = true;

    constructor(_targetObject: object) {
        this.targetObject = (<any>_targetObject);
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

        if(!this.isAlive) {
            return;
        }

        this.deltaTime = deltaTime;

        // If sprite doesn't exist, then dont update anything
        if (!this.sprite || !this.targetObject || !(<any>this.targetObject).sprite) {
            return;
        }

        // Not Colliding
        if (!this.collidingWithTarget()) {
            this.move();
        }

        // Colliding
        else {
            this.attack();
        }

        if (!this.canAttack) {
            this.attackCooldownFactor -= deltaTime;

            if (this.attackCooldownFactor <= 0) {
                this.attackCooldownFactor = this.attackCooldown;
                this.canAttack = true;
            }
        } else {
            this.attackCooldownFactor = this.attackCooldown;
        }

        if(!this.isAlive) {
            return;
        }
        this.sprite.rotation = this.rotation;
    }

    public getZIndexY() {
        let y: number;
        try {
            const bounds = this.sprite.getBounds();
            y = bounds.bottom;
        } catch (err) {
            return undefined;
        }
        return y;
    }

    public setZIndex(value: number) {
        this.sprite.zIndex = value;
    }

    private zIndexManager = new ZIndexManager(this.getZIndexY.bind(this), this.setZIndex.bind(this));


    private makeWizardSpin() {
        if(!this.isAlive) {
            return;
        }

        if (this.rotation > this.MAX_ROTATION_AMOUNT) {
            this.rotation = this.MAX_ROTATION_AMOUNT;
            this.rotationDirection = -0.5;
        }
        else if (this.rotation < -this.MAX_ROTATION_AMOUNT) {
            this.rotation = -this.MAX_ROTATION_AMOUNT;
            this.rotationDirection = 0.5;
        }

        this.rotation += 0.001 * this.deltaTime * this.rotationDirection;
    }

    private moveTowardTarget(): void {
        if(!this.isAlive) {
            return;
        }

        const spriteBounds = this.sprite.getBounds();
        const targetBounds = this.targetObject.sprite.getBounds();

        if (spriteBounds.x > targetBounds.x + this.MIN_DISTANCE_TO_ATTACK) {
            this.sprite.position.x -= this.deltaTime * this.wizardSpeed;
            this.sprite.scale.x = -1;
        }
        else if (spriteBounds.x < targetBounds.x - this.MIN_DISTANCE_TO_ATTACK) {
            this.sprite.position.x += this.deltaTime * this.wizardSpeed;
            this.sprite.scale.x = 1;
        }

        if (spriteBounds.y > targetBounds.y + this.MIN_DISTANCE_TO_ATTACK) {
            this.sprite.position.y -= this.deltaTime * this.wizardSpeed;
        }
        else if (spriteBounds.y < targetBounds.y - this.MIN_DISTANCE_TO_ATTACK) {
            this.sprite.position.y += this.deltaTime * this.wizardSpeed;
        }
    }

    move(): void {
        if(!this.isAlive) {
            return;
        }
        this.makeWizardSpin();
        this.moveTowardTarget();
    }

    attack(): void {
        if (!this.canAttack) {
            return;
        }

		Trash.throwFrom(this.sprite.x, this.sprite.y, 100);
		
		this.die();
    }

	die(fromPlayer: boolean = false): void {
		if (fromPlayer) {
			WizardDust.throwFrom(this.sprite.x, this.sprite.y, 50);
		}

		this.canAttack = false;
        this.sprite.destroy();
        this.sprite = null;
        this.isAlive = false;
	}

}
