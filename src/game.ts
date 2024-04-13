import { Application, ApplicationOptions, Assets, Container, TextureStyle } from "pixi.js";
import { MapManager } from "./managers/map-manager";
import { Ticker } from 'pixi.js';
import { Player } from './player';

TextureStyle.defaultOptions.scaleMode = 'nearest';

export class Game {

    public INITIAL_WIDTH = 480;
    public INITIAL_HEIGHT = 270;
    private backgroundColor: number = 0x000000;
    private app: Application;
    private mainContainer: Container = null;

    // Managers
    private mapManager: MapManager = null;

    constructor() {
        this.init();
    }

    /**
     * Initial Initialization function
     */
    private async init() {
        this.initializePixiJs();

        this.mainContainer = new Container();
        this.app.stage.addChild(this.mainContainer);

        await this.loadAssets();
        this.mapManager = new MapManager(this.mainContainer);
        await this.mapManager.init();
        this.mapManager.loadMap(1);

        const ticker = Ticker.shared;
        // Set this to prevent starting this ticker when listeners are added.
        // By default this is true only for the Ticker.shared instance.
        ticker.autoStart = false;

        ticker.add(this.update.bind(this));
        ticker.start();
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
                }
            ]
        };

        await Assets.init({ manifest });

        // Load the Spritesheet assets
        const spritesheetAssets = await Assets.loadBundle('spritesheets');
        // Load the TileSet assets
        const tileSetAssets = await Assets.loadBundle('tilesets');

        // Load the Tilemap assets
        const tileMapAssets = await Assets.loadBundle('tilemaps');

		Player.setSpritesheetAssets(spritesheetAssets);
		Player.setMainContainer(this.mainContainer);

		new Player();
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
            const ratio = Math.min(width / this.INITIAL_WIDTH, height / this.INITIAL_HEIGHT);
            this.app.stage.scale.set(ratio);
        }
    }
}
