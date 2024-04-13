import { Application, Container, IApplicationOptions, Renderer, Sprite, Texture } from "pixi.js";
import * as PIXI from "pixi.js"
import { Observable, Subject } from "rxjs";

export class GraphicsManagerService {
    public static INITIAL_WIDTH = 480;
    public static INITIAL_HEIGHT = 270;
    private app: Application;
    public timeEllasped: Function = (): number => { return PIXI.Ticker.shared.elapsedMS }
    public container: Container = null;
    private background: Sprite = null;
    private backgroundColor: number = 0x000000;
    private clickedStageEvent: Subject<any> = new Subject<any>();

    constructor() {
        this.init();
    }

    /**
     * Initializes Pixi.JS based Graphics Manager.
     */
    private init() {
        //Sets the onResizeCallback
        window.onresize = this.onResizeCallback.bind(this);

        //Initialize Pixi.js
        this.initializePixiJs();

        this.container = new Container();
        this.container.sortableChildren = true;
        this.app.stage.addChild(this.container);

        this.createBackgroundSprite();

        // Click Event
        this.app.stage.interactive = true;
        this.app.stage.on('click', (ev: any) => {
            this.clickedStageEvent.next(ev);
        });
    }

    public getClickObservable(): Observable<any> {
        return this.clickedStageEvent.asObservable();
    }

    public getRendererView(): PIXI.ICanvas {
        return this.app.renderer.view;
    }

    public getRenderer(): Renderer | PIXI.IRenderer {
        return this.app.renderer;
    }

    private createBackgroundSprite(): void {
        this.background = new Sprite(Texture.WHITE);
        this.background.position.set(0, 0);
        this.background.width = GraphicsManagerService.INITIAL_WIDTH;
        this.background.height = GraphicsManagerService.INITIAL_HEIGHT;
        this.background.alpha = 0;
        this.background.interactive = true;
        this.container.addChild(this.background);
    }

    /**
    * Creates the Pixi.js canvas, and adds it to the HTML document.
    */
    private initializePixiJs() {
        PIXI.utils.skipHello();

        //Create a Pixi Application
        let startParams: IApplicationOptions = {
            backgroundColor: this.backgroundColor,
            antialias: true,
            backgroundAlpha: 1,
            clearBeforeRender: false,
            context: undefined,
            powerPreference: "default",
            premultipliedAlpha: false,
            preserveDrawingBuffer: false,
            hello: false
        }
        this.app = new Application(startParams);

        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        PIXI.settings.WRAP_MODE = PIXI.WRAP_MODES.CLAMP;
        PIXI.settings.ROUND_PIXELS = true;

        //Add the pixi.js canvas to the HTML document
        document.body.appendChild(<any>this.app.view);

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

            //this.app.renderer.view.style.position = "absolute";
            //this.app.renderer.view.style.display = "block";

            //Calculates what the Width & Height should be to fit the same aspect ratio on the screen.
            const resolutionRatio = GraphicsManagerService.INITIAL_WIDTH / GraphicsManagerService.INITIAL_HEIGHT;
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
            const ratio = Math.min(width / GraphicsManagerService.INITIAL_WIDTH, height / GraphicsManagerService.INITIAL_HEIGHT);
            this.app.stage.scale.set(ratio);
        }
    }

    /**
     * Adds a child to the main container
     * @param child Container
     */
    addChild(child: Container) {
        this.container.addChild(child);
    }

    /**
     * Removes a child from the main container
     * @param child Container
     */
    removeChild(child: Container) {
        this.container.removeChild(child);
    }

    /**
     * Sets a function to run every tick.
     * @param functionToRun The Function to run.
     */
    setMainLoop(functionToRun: Function) {
        this.app.ticker.add(delta => functionToRun(delta));
    }
}