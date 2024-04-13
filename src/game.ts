import { Application, ApplicationOptions, Assets, Container, TextureStyle } from "pixi.js";
import { MapManager } from "./managers/map-manager";
import { Ticker } from 'pixi.js';
import { KeyManager } from './managers/key-manager';
import titlescreen from './titlescreen';
import createMap from './map';
import { Player } from './player';

TextureStyle.defaultOptions.scaleMode = 'nearest';

export class Game {

    public INITIAL_WIDTH = 480;
    public INITIAL_HEIGHT = 270;
    private backgroundColor: number = 0x000000;
    public app: Application;
    public mainContainer: Container = null;

	// Assets
	public spritesheetAssets: any;
	public tilesetAssets: any;
	public tilemapAssets: any;
	public fontAssets: any;
	

    // Managers
    public mapManager: MapManager = null;
	public keyManager: KeyManager = null;

    constructor() {
        this.init();
    }

    /**
     * Initial Initialization function
     */
    private async init() {
        await this.initializePixiJs();

        this.mainContainer = new Container();

		// Changing the position of the main container to center all positions around centerpoint of canvas
		this.mainContainer.position.set(this.INITIAL_WIDTH / 2, this.INITIAL_HEIGHT / 2);
        this.app.stage.addChild(this.mainContainer);
        await this.loadAssets();
        this.mapManager = new MapManager(this.mainContainer);
		this.keyManager = new KeyManager();
        await this.mapManager.init();
        this.mapManager.loadMap(1);

		this.linkGlobalsToClasses();

		await titlescreen(this);

		createMap(this);


        const ticker = Ticker.shared;
        // Set this to prevent starting this ticker when listeners are added.
        // By default this is true only for the Ticker.shared instance.
        ticker.autoStart = false;

        ticker.add(this.update.bind(this));
        ticker.start();

		new Player();
    }

    private update(ticker: Ticker) {
        const deltaTime = ticker.deltaTime;
        //console.log(deltaTime)
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
							alias: 'floor.png',
							src: 'assets/sprites/floor.png'
						},
						{
							alias: 'counter.png',
							src: 'assets/sprites/counter.png'
						},

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
            powerPreference: "high-performance",
            premultipliedAlpha: false,
            preserveDrawingBuffer: false,
            hello: false
        } as any;

        this.app = new Application();
        await this.app.init(startParams);

        //Add the pixi.js canvas to the HTML document
        document.body.appendChild(<any>this.app.canvas);

		this.app.canvas.style.imageRendering = 'pixelated'

        window.onresize = this.onResizeCallback.bind(this);

        // Force the onResizeEvent to occur.
        window.dispatchEvent(new Event('resize'));
    }

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
            this.app.renderer.resize(calculatedWidth, calculatedHeight);
			console.log(this.app.renderer);
            const ratio = Math.min(width / this.INITIAL_WIDTH, height / this.INITIAL_HEIGHT);
            this.app.stage.scale.set(ratio);
        }
    }
}
