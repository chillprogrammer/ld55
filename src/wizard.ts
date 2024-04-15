import { Bounds, Container, Point, Sprite, Ticker } from "pixi.js";
import { Game } from "./game";
import { Player } from "./player";
import { FountainDrink, TrashCan } from "./destroyable_objects";
import { ZIndexManager } from './managers/zIndex-manager';
import { Trash, WizardDust } from './trash';
import { Howl } from 'howler';

export class WizardSpawner {

    public static wizardList: Wizard[] = [];
    private spriteScale = 1;
    private player: Player = null;
    private spawnPosition: Point;
    private spawnInterval: number = 1300;
    private spawnCounter: number = 0;
    public static totalWizardsSpawned: number = 0;



    public fountain: FountainDrink;
    public trashCans: TrashCan[];

    private gameOver: boolean = false;

    constructor() {
        if (!WizardSpawner.spritesheetAssets) throw "Need to define spritesheetAssets before creating new player";
        if (!WizardSpawner.mainContainer) throw "Need to define mainContainer before creating new player";

        Ticker.shared.add(this.update, this);
    }


    public cleanUp() {
        for (let i = 0; i < WizardSpawner.wizardList.length; i++) {
            const wizard = WizardSpawner.wizardList[i];
            if (wizard) {
                wizard.die();
            }
        }
    }

    end() {
        this.gameOver = true;
        this.cleanUp();
    }

    start() {
        this.gameOver = false;
    }

    public destroy() {
        Ticker.shared.remove(this.update, this);
        for (let i = 0; i < WizardSpawner.wizardList.length; i++) {
            const wizard = WizardSpawner.wizardList[i];
            if (wizard && wizard.sprite) {
                wizard.isAlive = false;
                wizard.sprite.destroy();
                WizardSpawner.mainContainer.removeChild(wizard.sprite);
            }
        }
        WizardSpawner.wizardList = [];
    }

    private update(ticker: Ticker) {
        const deltaTime = ticker.deltaMS;
        this.spawnCounter += deltaTime;


        if (this.spawnCounter > this.spawnInterval) {
            this.spawnCounter = 0;

            if (!this.gameOver) {
                this.createWizard();
            }
        }


        for (let i = 0; i < WizardSpawner.wizardList.length; i++) {
            const wizard = WizardSpawner.wizardList[i];

            if (!wizard.sprite || !wizard.sprite.position) {
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

        this.spawnPosition = new Point(Math.floor(Math.random() * WizardSpawner.game.INITIAL_WIDTH), WizardSpawner.game.INITIAL_HEIGHT);


        wizard.sprite.scale.set(this.spriteScale, this.spriteScale);
        wizard.sprite.anchor.set(0.5, 0.5);
        WizardSpawner.mainContainer.addChild(wizard.sprite);

        wizard.sprite.position.set(this.spawnPosition.x, this.spawnPosition.y);

        WizardSpawner.wizardList.push(wizard);
        WizardSpawner.totalWizardsSpawned++;
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
    private MIN_DISTANCE_TO_ATTACK: number = 60;

    private PADDING_DISTANCE: number = 40;

    private attackCooldown: number = 2000;
    private attackCooldownFactor: number = this.attackCooldown;
    private canAttack: boolean = true;

    private static wizardGreetNoises: Howl[] = [
        new Howl({
            volume: 0.5,
            src: ['assets/sounds/Greeting1.wav']
        }),
        new Howl({
            volume: 0.5,
            src: ['assets/sounds/Greeting2.wav']
        }),
        new Howl({
            volume: 0.5,
            src: ['assets/sounds/Greeting3.wav']
        }),
    ];


    private static playRandomGreet() {
        Wizard.wizardGreetNoises[Math.floor(Wizard.wizardGreetNoises.length * Math.random())].play();
    }

    private static wizardDeathNoises: Howl[] = [
        new Howl({
            volume: 0.25,
            src: ['assets/sounds/Death1.wav']
        }),
        new Howl({
            volume: 0.25,
            src: ['assets/sounds/Death2.wav']
        }),
        new Howl({
            volume: 0.25,
            src: ['assets/sounds/Death3.wav']
        }),
    ];

    private static playRandomDeath() {
        Wizard.wizardDeathNoises[Math.floor(Wizard.wizardDeathNoises.length * Math.random())].play();
    }

    constructor(_targetObject: object) {
        this.targetObject = (<any>_targetObject);

        // Color
        const randomNum2 = Math.floor(Math.random() * 3);
        switch (randomNum2) {
            case 0:
                this.sprite = Sprite.from(WizardSpawner.spritesheetAssets['wizard.png']);
                break;
            case 1:
                this.sprite = Sprite.from(WizardSpawner.spritesheetAssets['wizard_r.png']);
                break;
            case 2:
                this.sprite = Sprite.from(WizardSpawner.spritesheetAssets['wizard_g.png']);
                break;
            default:
                this.sprite = Sprite.from(WizardSpawner.spritesheetAssets['wizard.png']);
                break;
        }


        const diceRoll = Math.floor(Math.random() * 4);
        if (diceRoll == 1) {
            Wizard.playRandomGreet();
        }
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

        if (!this.isAlive) {
            return;
        }

        this.deltaTime = deltaTime;

        // If sprite doesn't exist, then dont update anything
        if (!this.sprite || !this.targetObject || !(<any>this.targetObject).sprite) {
            return;
        }
        this.move(deltaTime);

        if (!this.canAttack) {
            this.attackCooldownFactor -= deltaTime;

            if (this.attackCooldownFactor <= 0) {
                this.attackCooldownFactor = this.attackCooldown;
                this.canAttack = true;
            }
        } else {
            this.attackCooldownFactor = this.attackCooldown;
        }

        if (!this.isAlive) {
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
        if (!this.isAlive) {
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

    private summonTimer = 2000;

    private summonParticleDelay = 100;
    private summonParticleTimer = this.summonParticleDelay;

    private makeWizardSummon(deltaTime: number) {
        this.rotation = Math.sin(this.summonTimer / 100) * 0.3;
        this.summonTimer -= deltaTime;
        this.summonParticleTimer -= deltaTime;

        if (this.summonParticleTimer <= 0) {
            WizardDust.throwFrom(this.sprite.x, this.sprite.y, 2, 80);
            this.summonParticleTimer = this.summonParticleDelay;
        }

        if (this.summonTimer <= 0) this.attack(deltaTime);
    }

    private state: 'TowardsTarget' | 'Summoning' | 'DramaticDeath' = 'TowardsTarget';

    move(deltaTime: number): void {
        if (!this.isAlive) {
            return;
        }
        switch (this.state) {
            case 'TowardsTarget':
                this.moveTowardTarget();
                this.makeWizardSpin();
                break;
            case 'Summoning':
                this.makeWizardSummon(deltaTime);
                break;
            case 'DramaticDeath':
                this.dramaticDeath(deltaTime);
                break;
        }
    }

    private moveTowardTarget(): void {
        /*if(!this.isAlive) {
            return;
        }*/

        const spriteBounds = this.sprite.getBounds();
        const targetBounds = this.targetObject.sprite.getBounds();

        if (spriteBounds.x > targetBounds.x + this.PADDING_DISTANCE) {
            this.sprite.position.x -= this.deltaTime * this.wizardSpeed;
            this.sprite.scale.x = -1;
        }
        else if (spriteBounds.x < targetBounds.x - this.PADDING_DISTANCE) {
            this.sprite.position.x += this.deltaTime * this.wizardSpeed;
            this.sprite.scale.x = 1;
        }

        if (spriteBounds.y > targetBounds.y + this.PADDING_DISTANCE) {
            this.sprite.position.y -= this.deltaTime * this.wizardSpeed;
        }
        else if (spriteBounds.y < targetBounds.y - + this.PADDING_DISTANCE) {
            this.sprite.position.y += this.deltaTime * this.wizardSpeed;
        }

        const dx = spriteBounds.x - targetBounds.x;
        const dy = spriteBounds.y - targetBounds.y;
        const dist = Math.sqrt(dx ** 2 + dy ** 2);
        if (dist < this.MIN_DISTANCE_TO_ATTACK) {
            this.state = 'Summoning';
            const sound = new Howl({
                volume: 0.3,
                src: 'assets/sounds/PaperSummon.wav'
            });
            sound.play();
        }
    }



    attack(deltaTime: number): void {
        if (!this.canAttack) {
            return;
        }

        this.canAttack = false;
        Trash.throwFrom(this.sprite.x, this.sprite.y, 50, 100);
        const sound = new Howl({
            volume: 0.4,
            src: 'assets/sounds/PaperSpawn.wav',
        });
        sound.rate(1 - (Math.random() - 0.5) * 0.3);
        sound.play();

        setTimeout(() => { this.die(false) }, 1000)
    }

    private alreadyDied = false;

    die(fromPlayer: boolean = false): void {
        if (this.alreadyDied) return;

        if (fromPlayer) {

            const diceRoll = Math.floor(Math.random() * 3);
            if (diceRoll == 1) {
                Wizard.playRandomDeath();
                this.state = 'DramaticDeath';

                WizardDust.throwFrom(this.sprite.x, this.sprite.y, 20, 300);
                new Howl({
                    src: "assets/sounds/Summoning.wav",
                    volume: 0.1
                }).play();
                return;
            }

        }
        new Howl({
            src: "assets/sounds/Summoning.wav",
            volume: 0.1
        }).play();

        WizardDust.throwFrom(this.sprite.x, this.sprite.y, 50);
        this.alreadyDied = true;

        this.canAttack = false;
        this.sprite.destroy();
        this.sprite = null;
        this.isAlive = false;
    }

    private spinInitial = 2000;
    private spin = this.spinInitial;
    dramaticDeath(deltaTime: number) {
        this.spin -= deltaTime;
        this.sprite.scale.set(1, (this.spin / this.spinInitial));
        this.sprite.rotation = 0;
        this.sprite.scale = (this.spin / this.spinInitial);
        this.sprite.blendMode = 'overlay';

        if (this.spin <= 0) this.die();
    }

}
