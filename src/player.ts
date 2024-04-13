import {Assets, Sprite, Application, Container, Ticker} from 'pixi.js';
import {KeyManager} from './managers/key-manager';

/** The main player class for the game */
export class Player {

	private SPEED = 10;

	// ---------------------------- GLOBALS ------------------------------

	private static _keyManager: KeyManager | undefined;
	public static set keyManager(keyManager: KeyManager) {
		Player._keyManager = keyManager;
	}


	private static _spritesheetAssets: any | undefined;
	public static set spritesheetAssets(spritesheetAssets: any) {
		Player._spritesheetAssets = spritesheetAssets;
	}


	private static _mainContainer: Container | undefined;
	public static set mainContainer(app: Container) {
		Player._mainContainer = app;
	}	

	// -------------------------------------------------------------------

	private container: Container = new Container();
	private sprite: Sprite;

	private get x() {
		return this.container.x;
	}

	private set x(value: number) {
		this.container.x = value;
	}

	private get y() {
		return this.container.y;
	}

	private set y(value: number) {
		this.container.y = value;
	}



	constructor() {
		if (!Player._keyManager) throw "Need to define keyManager before creating new player";
		if (!Player._spritesheetAssets) throw "Need to define spritesheetAssets before creating new player";
		if (!Player._mainContainer) throw "Need to define mainContainer before creating new player";

		this.sprite = Sprite.from(Player._spritesheetAssets['player.png']);
		this.container.addChild(this.sprite);

		Player._mainContainer.addChild(this.container);

		Ticker.shared.add(this.update.bind(this));

	}

	private update(ticker: Ticker) {

	}
}


