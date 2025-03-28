import { Application, ApplicationOptions, Assets, Container, TextureStyle } from "pixi.js";
import { MapManager } from "./managers/map-manager";
import { Ticker } from 'pixi.js';
import { KeyManager } from './managers/key-manager';
import titlescreen from './titlescreen';
import createMap, { collidables, mapSpriteList } from './map';
import { Player } from './player';
import { WizardSpawner } from "./wizard";
import { DestoryableObjects } from "./destroyable_objects";
import { ZIndexManager } from './managers/zIndex-manager';
import { Trash, WizardDust } from './trash';
import { GameUI } from './ui';

TextureStyle.defaultOptions.scaleMode = 'nearest';

export class Game {
    public gameOver: boolean = false;
    public INITIAL_WIDTH = 480;
    public INITIAL_HEIGHT = 270;
    private backgroundColor: number = 0x000000;
    public app: Application;
    public mainContainer: Container = null;
    private gameUI: GameUI;
    /*public get mainContainer() {
        this.app.stage
    }*/
    public trashContainer: Container = null;

    public shiftClockTimeRemaining_DEFAULT: number = 120000; // 2 mins
    public shiftClockTimeRemaining: number = this.shiftClockTimeRemaining_DEFAULT;


    // Assets
    public spritesheetAssets: any;
    public tilesetAssets: any;
    public tilemapAssets: any;
    public fontAssets: any;


    // Managers
    public keyManager: KeyManager = null;
    private player: Player = null;
    public wizardSpawner: WizardSpawner = null;
    public destoryableObjects: DestoryableObjects = null;

    private music = new Howl({
        volume: 0.25,
        src: ['assets/sounds/Wizards12.wav'],
        loop: true
    });

    constructor() {
        this.init();
    }

    /**
     * Initial Initialization function
     */
    private async init() {
        await this.initializePixiJs();

        this.music.play();

        this.mainContainer = new Container();
        this.mainContainer.zIndex = 0;
        this.mainContainer.sortableChildren = true;

        // Changing the position of the main container to center all positions around centerpoint of canvas
        // this.mainContainer.position.set(this.INITIAL_WIDTH / 2, this.INITIAL_HEIGHT / 2);
        this.app.stage.addChild(this.mainContainer);
        await this.loadAssets();
        this.keyManager = new KeyManager();

        this.linkGlobalsToClasses();

        await titlescreen(this);

        this.startGame();
    }

    private async endGame() {
        this.gameOver = true;

        //Ticker.shared.remove(this.update, this);

        //this.destoryableObjects.destroy();
        //this.destoryableObjects = null;

        this.player.setVisible(false);
        //this.player = null;

        this.wizardSpawner.end();
        //this.wizardSpawner = null;

        //Trash.removeAll();
        //WizardDust.removeAll();

        this.gameUI.showStartNextShiftButton();
    }


    public restartGame() {
        Trash.removeAll();
        Trash.totalGenerated = 0;
        WizardDust.removeAll();

        this.shiftClockTimeRemaining = this.shiftClockTimeRemaining_DEFAULT;
        this.player.setVisible(true);
        this.wizardSpawner.start();

        this.gameOver = false;
        //Ticker.shared.start();

        //this.wizardSpawner = new WizardSpawner();
        this.wizardSpawner.fountain = this.destoryableObjects.getFountain();
        this.wizardSpawner.trashCans = this.destoryableObjects.getTrashcans();
        this.wizardSpawner.setPlayer(this.player);
        WizardSpawner.totalWizardsSpawned = 0;
        //this.wizardSpawner.createWizard();
    }


    private startGame() {

        createMap(this);
        this.gameUI = new GameUI(this);

        // Set this to prevent starting this ticker when listeners are added.
        // By default this is true only for the Ticker.shared instance.
        Ticker.shared.autoStart = false;

        Ticker.shared.add(this.update, this);
        Ticker.shared.start();

        this.destoryableObjects = new DestoryableObjects();

        this.player = new Player();
        this.player.setCollidables(collidables);
        this.player.container.zIndex = 1;

        this.wizardSpawner = new WizardSpawner();
        this.wizardSpawner.fountain = this.destoryableObjects.getFountain();
        this.wizardSpawner.trashCans = this.destoryableObjects.getTrashcans();
        this.wizardSpawner.setPlayer(this.player);
        this.wizardSpawner.createWizard();
    }

    private update(ticker: Ticker) {

        const deltaTime = ticker.deltaMS;
        Trash.updateAll(ticker);
        WizardDust.updateAll(ticker);
        ZIndexManager.arrangeZIndicies();

        //		this.mainContainer.sortChildren()
        //		this.mainContainer.sortDirty = true;

        if (!this.gameOver) {
            this.shiftClockTimeRemaining -= deltaTime;
        }

        if (this.shiftClockTimeRemaining < 0) {
            this.shiftClockTimeRemaining = 0;
            this.endGame();
        }
    }


    /**
     * Loads the assets for PixiJS to use.
     */
    private async loadAssets() {
        const manifest = {
            bundles: [
                {
                    name: 'load-screen',
                    assets: [
                        {
                            alias: 'background',
                            src: 'sunset.png',
                        },
                        {
                            alias: 'bar',
                            src: 'load-bar.{png,webp}',
                        },
                    ]
                },
                {
                    name: 'spritesheets',
                    assets: [
                        {
                            alias: 'tileset1.png',
                            src: 'assets/tilemaps/tileset1.png',
                        },
                        {
                            alias: 'player.png',
                            src: 'assets/sprites/player.png'
                        },
                        {
                            alias: 'wizard.png',
                            src: 'assets/sprites/wizard.png'
                        },
                        {
                            alias: 'wizard_r.png',
                            src: 'assets/sprites/wizard_r.png'
                        },
                        {
                            alias: 'wizard_g.png',
                            src: 'assets/sprites/wizard_g.png'
                        },
                        {
                            alias: 'floor.png',
                            src: 'assets/sprites/floor.png'
                        },
                        {
                            alias: 'counter.png',
                            src: 'assets/sprites/counter.png'
                        },
                        {
                            alias: 'drink_machine.png',
                            src: 'assets/sprites/drink_machine.png'
                        },
                        {
                            alias: 'trashcan.png',
                            src: 'assets/sprites/trashcan.png'
                        },
                        {
                            alias: 'trashcan_destroyed.png',
                            src: 'assets/sprites/trashcan_destroyed.png'
                        },
                        {
                            alias: 'wall.png',
                            src: 'assets/sprites/wall.png',
                        },
                        {
                            alias: 'wallBaseboard.png',
                            src: 'assets/sprites/wallBaseboard.png',
                        },
                        {
                            alias: 'billboard.png',
                            src: 'assets/sprites/billboard.png',
                        },
                        {
                            alias: 'broom.png',
                            src: 'assets/sprites/broom.png',
                        },
                        {
                            alias: 'trash1.png',
                            src: 'assets/sprites/trash1.png',
                        },
                        {
                            alias: 'trash2.png',
                            src: 'assets/sprites/trash2.png',
                        },
                        {
                            alias: 'wizardDust.png',
                            src: 'assets/sprites/wizardDust.png',
                        },
                        {
                            alias: 'table.png',
                            src: 'assets/sprites/table.png',
                        },
						{
							alias: 'background-screen.png',
							src: 'assets/sprites/background-screen.png'
						}
                    ]
                },
                {
                    name: 'tilesets',
                    assets: [
                        {
                            alias: 'TestTileset.json',
                            src: 'assets/tilemaps/TestTileset.json',
                        }
                    ]
                },
                {
                    name: 'tilemaps',
                    assets: [
                        {
                            alias: 'map1',
                            src: 'assets/tilemaps/map1.json',
                        }
                    ]
                },
                {
                    name: 'fonts',
                    assets: [
                        {
                            alias: 'wendysScript.ttf',
                            src: 'assets/fonts/wendysScript.ttf'
                        }
                    ]
                }
            ]
        };

        await Assets.init({ manifest });

        // Load the Spritesheet assets
        this.spritesheetAssets = await Assets.loadBundle('spritesheets');
        // Load the Tileset assets
        this.tilesetAssets = await Assets.loadBundle('tilesets');
        // Load the Tilemap assets
        this.tilemapAssets = await Assets.loadBundle('tilemaps');
        this.fontAssets = await Assets.loadBundle('fonts');
    }

    /**
    * Function which links the individual game object to the different classes. 
    * That way, game does not have to be passed each time a new instance is created for
    * the classes. Make sure to implement this when creating a new game class
    */
    private linkGlobalsToClasses() {
        // Linking Globals to Player
        Player.setGame(this);
        WizardSpawner.setGame(this);
        DestoryableObjects.setGame(this);
        Trash.setGame(this);
        WizardDust.setGame(this);
    }


    /**
    * Creates the Pixi.js canvas, and adds it to the HTML document.
    */
    private async initializePixiJs() {
        //Create a Pixi Application
        let startParams: ApplicationOptions = {
            backgroundColor: this.backgroundColor,
            antialias: true,
            backgroundAlpha: 1,
            clearBeforeRender: false,
            context: undefined,
            premultipliedAlpha: false,
            preserveDrawingBuffer: false,
            hello: false
        } as any;

        this.app = new Application();
        await this.app.init(startParams);

        //Add the pixi.js canvas to the HTML document
        document.body.appendChild(<any>this.app.canvas);

        this.app.canvas.style.imageRendering = 'pixelated'
        this.app.canvas.oncontextmenu = (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        window.onresize = this.onResizeCallback.bind(this);

        // Force the onResizeEvent to occur.
        window.dispatchEvent(new Event('resize'));
    }


    private hasResized = false;

    /**
    * Callback function that runs when the window is resized.
    * Resizes the pixi.js canvas to maintain aspect ratio.
    * @param ev the window.resize event
    */
    private onResizeCallback(ev: UIEvent) {
        if (this.app) {
            const w = ev.target as Window;
            const width = w.innerWidth;
            const height = w.innerHeight;


            //Calculates what the Width & Height should be to fit the same aspect ratio on the screen.
            const resolutionRatio = this.INITIAL_WIDTH / this.INITIAL_HEIGHT;
            let calculatedWidth = width;
            let calculatedHeight = width / resolutionRatio;
            if (calculatedHeight > height) {
                calculatedHeight = height;
                calculatedWidth = calculatedHeight * resolutionRatio;
            }
            calculatedWidth = Math.ceil(calculatedWidth);
            calculatedHeight = Math.ceil(calculatedHeight);

            //This sets the game's dimensions to what we calculated.
            if (!this.hasResized) {
                this.app.renderer.resize(calculatedWidth, calculatedHeight);
                const ratio = Math.min(width / this.INITIAL_WIDTH, height / this.INITIAL_HEIGHT);
                this.app.stage.scale.set(ratio);
            }

            this.app.canvas.style.width = `${calculatedWidth}px`;
            this.app.canvas.style.height = `${calculatedHeight}px`;
            this.hasResized = true;
        }
    }
}
