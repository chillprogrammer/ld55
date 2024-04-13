import { Game } from "./game/game";
import { GraphicsManagerService } from "../services/graphics-manager/graphics-manager.service";
import { ServiceInjector } from "../services/service-injector.module";
import { KeyManagerService } from "../services/key-manager/key-manager.service";
import { LoadingScreen } from "./menus/loading-screen";

export class App {

    /**
     * Initializes everything in the app.
     */
    async init(): Promise<void> {
        // Initialize the GraphicsManager service.
        const graphicsManager: GraphicsManagerService = ServiceInjector.getServiceByClass(GraphicsManagerService);

        // Initialize the KeyManager service.
        ServiceInjector.getServiceByClass(KeyManagerService);

        // Initialize the ConfigManager service.
        //const configManager: ConfigManagerService = ServiceInjector.getServiceByClass(ConfigManagerService);
        // We wait for the config file to be recieved before the game loads.
        //await configManager.getConfigFile();

        const loadingScreen = new LoadingScreen();
        graphicsManager.addChild(loadingScreen.getContainer());
        // Wait for all assets to load before the game begins.
        loadingScreen.loadAssets().then(() => {
            graphicsManager.removeChild(loadingScreen.getContainer());
            // Create a new Game.
            const game = new Game();
            game.init();

        });
    }

    async loadAssets(): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 0)
        })
    }
}