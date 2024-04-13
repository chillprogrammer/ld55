import {Assets, Sprite, Application, Container, Ticker} from 'pixi.js';
import {KeyManager} from './managers/key-manager';

/** The main player class for the game */
export class Player {

	private SPEED = 0.1;

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

	private get rotation() {
		return this.container.rotation;
	}

	private set rotation(value: number) {
		this.container.rotation = value;
	}

	constructor() {
		if (!Player._keyManager) throw "Need to define keyManager before creating new player";
		if (!Player._spritesheetAssets) throw "Need to define spritesheetAssets before creating new player";
		if (!Player._mainContainer) throw "Need to define mainContainer before creating new player";

		this.container.scale.set(0.5, 0.5);

		this.container.position.set(100, 200);

		this.sprite = Sprite.from(Player._spritesheetAssets['player.png']);
		this.sprite.anchor.set(0.5, 0.5);
		this.container.addChild(this.sprite);

		Player._mainContainer.addChild(this.container);

		Ticker.shared.add(this.update.bind(this));

	}

	// Time it takes for the player to tilt other direction in ms
	private walkTiltTime = 100;
	// Boolean stating whether player is tilting right or left
	private tiltingRight = true;
	private walkTiltTimer = this.walkTiltTime;

	private update(ticker: Ticker) {
		const {deltaMS} = ticker;

		// ------------- movement ------------------
		
		const w = Player._keyManager.isKeyPressed('w');		
		const a = Player._keyManager.isKeyPressed('a');		
		const s = Player._keyManager.isKeyPressed('s');		
		const d = Player._keyManager.isKeyPressed('d');		
	
		// The "+" syntax converts a boolean to number
		const dx = (+d - +a);
		const dy = (+s - +w);
		let dDist = Math.sqrt(dx ** 2 + dy ** 2);
		if (dDist == 0) dDist = 1;

		this.x += dx * this.SPEED * deltaMS / dDist;
		this.y += dy * this.SPEED * deltaMS / dDist;

		// ------------- player left-right ------------

		if (dx > 0)
			this.container.scale.set(0.5, 0.5);
		if (dx < 0)
			this.container.scale.set(-0.5, 0.5);

		// ------------- player tilt ------------------
		
		const isMoving = (dx !== 0 || dy !== 0);
		
		if (isMoving)
			this.walkTiltTimer -= deltaMS;

		if(this.walkTiltTimer<=0) {
			this.walkTiltTimer = this.walkTiltTime;	
			this.tiltingRight = !this.tiltingRight;
		}

		this.rotation = (isMoving) ?
			(this.tiltingRight)
				? 0.1 
				: -0.1
			: 0;

	}
}


