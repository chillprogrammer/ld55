import { OutlineFilter } from "@pixi/filter-outline";
import { AnimatedSprite, Container, MIPMAP_MODES, Rectangle, SCALE_MODES, Sprite, Text, Texture } from "pixi.js";
import { Subscription } from "rxjs";
import { GraphicsManagerService } from "../../services/graphics-manager/graphics-manager.service";
import { KeyManagerService } from "../../services/key-manager/key-manager.service";
import { ServiceInjector } from "../../services/service-injector.module";

/**
 * This object represents the Title Screen.
 */
export class TitleScreen {

    // Pixi.js
    private container: Container = null;
    public isDestroyed: boolean = false;

    // Title Text
    private titleColor: number = 0xb99223;
    private titleText: Sprite = null;
    private titleAngle: number = 0;
    private titleAngleDirection: boolean = false;
    private titleAngleMax: number = 2;
    private titleAngleSpeed: number = 0.05;

    // Click here to start Text
    private startText: Text = null;
    private startColor: number = 0xffffff;
    private startBlinkSpeed: number = 0.0125;
    private startBlinkAlpha: number = 0;
    private backgroundImage: Sprite = null;

    // Services
    private keyManagerService: KeyManagerService = ServiceInjector.getServiceByClass(KeyManagerService);

    // Toggles
    private isLeavingTitleScreen: boolean = false;

    // Sounds
    private SOUNDS = {
        Select: 'assets/sounds/Hell Train.mp3',
    }

    // Subscriptions
    private keyDownSubscription: Subscription = null;



    constructor() {
        this.init();
    }

    /**
     * Initializes the TitleScreen
     */
    init(): void {
        this.container = new Container();
        this.createBackgroundImage();
        //this.createTitleText();
        this.createStartText();
        this.createSubscriptions();
    }

    /**
     * Subscribes to any Observables.
     */
    createSubscriptions(): void {
        this.keyDownSubscription = this.keyManagerService.getKeyDownSubject().subscribe((key: string) => this.keyPressed(key))
    }

    private createBackgroundImage(): void {
        this.backgroundImage = new Sprite(Texture.from("assets/art/title-screen.png"));
        this.backgroundImage.scale.set(1, 1);
        this.container.addChild(this.backgroundImage);
    }

    /**
     * Unsubscribes to any Observables.
     */
    destroySubscriptions(): void {
        this.keyDownSubscription.unsubscribe();
    }

    /**
     * Cleanup method.
     * Destroys the container.
     */
    destroy(): void {
        this.isDestroyed = true;
        this.removeSounds();
        if (!this.startText?.destroyed) {
            this.startText?.destroy(true);
        }
        if (!this.titleText?.destroyed) {
            this.titleText?.destroy(true);
        }
        if (!this.container?.destroyed) {
            this.container?.destroy(true);
        }
        this.destroySubscriptions();
    }

    /**
     * Callback function for when a key was pressed down.
     * @param key Key that was pressed
     */
    private keyPressed(key: string) {

    }

    /**
     * Creates text for Title.
     */
    private createTitleText(): void {
        this.titleText = new Sprite(Texture.from('assets/art/Title.png'));
        const outlineFilter = new OutlineFilter();
        outlineFilter.color = 0xB96234;
        outlineFilter.thickness = 3.5;
        this.titleText.filters = [outlineFilter];
        this.titleText.anchor.set(0.5);
        this.titleText.position.set((GraphicsManagerService.INITIAL_WIDTH / 2), 100);
        this.container.addChild(this.titleText);
    }

    /**
     * Creates "- Press KEY to Start -" text.
     */
    private createStartText(): void {
        this.startText = new Text(`- Click Here to Start -`, { fontSize: 32, fill: this.startColor, align: 'center', strokeThickness: 2 });
        this.startText.interactive = true;
        this.startText.on('click', this.goToMainMenu.bind(this));
        this.startText.resolution = 2; // Crisp text.
        this.startText.anchor.set(0.5);
        this.startText.position.set((GraphicsManagerService.INITIAL_WIDTH / 2), GraphicsManagerService.INITIAL_HEIGHT - 100);
        this.container.addChild(this.startText);
    }


    /**
     * Unload any sounds from memory.
     */
    private removeSounds(): void {
        //this.soundManagerService.removeSound(this.SOUNDS.Select);
    }

    /**
     * Trigger the start of the game.
     */
    private goToMainMenu(): void {
        if (!this.isLeavingTitleScreen) {
            this.isLeavingTitleScreen = true;
            //(<SoundManagerService>ServiceInjector.getServiceByClass(SoundManagerService)).playSound(this.SOUNDS.Select)
            this.destroy();
        }
    }

    /**
     * Runs from the Main Game Loop
     * @param delta delta time
     */
    public update(delta: number): void {
        if (!this.titleText?.destroyed) {
            this.updateTitleText(delta);
        }
        if (!this.startText?.destroyed) {
            this.updateStartText(delta);
        }
    }

    /**
     *  Updates the title text.
     * @param delta delta time
     */
    private updateTitleText(delta: number): void {
        if (!this.titleAngleDirection) {
            this.titleAngle += this.titleAngleSpeed * delta;
            this.titleText?.scale.set(this.titleText.scale.x + 0.002 * delta, this.titleText.scale.y + 0.002 * delta);
        } else {
            this.titleAngle -= this.titleAngleSpeed * delta
            this.titleText?.scale.set(this.titleText.scale.x - 0.002 * delta, this.titleText.scale.y - 0.002 * delta);
        }

        if (this.titleAngle > this.titleAngleMax) {
            this.titleAngleDirection = !this.titleAngleDirection;
            this.titleAngle = this.titleAngleMax;
        } else if (this.titleAngle < -this.titleAngleMax) {
            this.titleAngleDirection = !this.titleAngleDirection;
            this.titleAngle = -this.titleAngleMax;
        }
        //this.titleText.angle = this.titleAngle;
    }

    /**
     * Updates the fade of the Start Text.
     * @param delta 
     */
    private updateStartText(delta: number) {
        this.startBlinkAlpha += this.startBlinkSpeed * delta;
        if (this.startBlinkAlpha > 1) {
            this.startBlinkAlpha = 1;
            this.startBlinkSpeed *= -1;
        } else if (this.startBlinkAlpha < 0) {
            this.startBlinkAlpha = 0;
            this.startBlinkSpeed *= -1;
        }

        this.startText.alpha = this.startBlinkAlpha;
    }

    /**
     * 
     * @returns The container the TitleScreen is inside.
     */
    getContainer() { return this.container; }
}