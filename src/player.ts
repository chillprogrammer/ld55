import {Assets, Sprite, Application, Container, Ticker} from 'pixi.js';
import {KeyManager} from './managers/key-manager';
import {ZIndexManager} from './managers/zIndex-manager';
import {Game} from './game';

/** The main player class for the game */
export class Player {

	public static instance: Player | undefined;

	private SPEED = 0.1;

	// ---------------------------- GLOBALS ------------------------------
	
	private static game: Game | undefined;	
	public static setGame(game: Game) {
		Player.game = game;
	}

	public static get keyManager() {
		return Player.game.keyManager;
	}


	public static get spritesheetAssets() {
		return Player.game.spritesheetAssets;
	}


	public static get mainContainer() {
		return Player.game.mainContainer;
	}	

	// -------------------------------------------------------------------

	public container: Container = new Container();
	public sprite: Sprite;
	public broom: Sprite;

	public get x() {
		return this.container.x;
	}

	private set x(value: number) {
		this.container.x = value;
	}

	public get y() {
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

	private spriteScale = 1;

	// ---------------------- Z Index Manager ------------------------

	public getZIndexY() {
		return this.container.getBounds().bottom;
//		return this.y + this.container.height / 2;
	}

	public setZIndex(value: number) {
		this.container.zIndex = value;
//		this.container.zIndex = value;
	}

	private zIndexManager = new ZIndexManager(this.getZIndexY.bind(this), this.setZIndex.bind(this));

	constructor() {
		if (!Player.keyManager) throw "Need to define keyManager before creating new player";
		if (!Player.spritesheetAssets) throw "Need to define spritesheetAssets before creating new player";
		if (!Player.mainContainer) throw "Need to define mainContainer before creating new player";

		Player.instance = this;

		this.sprite = Sprite.from(Player.spritesheetAssets['player.png']);
		this.sprite.scale.set(this.spriteScale, this.spriteScale);
		this.sprite.anchor.set(0.5, 0.5);
		this.container.addChild(this.sprite);

		this.broom = Sprite.from(Player.spritesheetAssets['broom.png']);
		this.broom.anchor.set(0.5, 0.5);
		this.broom.position.set(0, 5);
		this.broom.rotation = 1;
		this.container.addChild(this.broom);

		this.container.position.set(Player.game.INITIAL_WIDTH / 2, Player.game.INITIAL_HEIGHT / 2);

		Player.mainContainer.addChild(this.container);

		Ticker.shared.add(this.update.bind(this));

	}

	// Time it takes for the player to tilt other direction in ms
	private walkTiltTime = 100;
	// Boolean stating whether player is tilting right or left
	private tiltingRight = true;
	private walkTiltTimer = this.walkTiltTime;

	private update(ticker: Ticker) {
		this.movement(ticker);
		this.broomLogic(ticker);
	}


	private movement(ticker: Ticker) {
		const {deltaMS} = ticker;

		// ------------- movement ------------------
		
		const w = Player.keyManager.isKeyPressed('w');		
		const a = Player.keyManager.isKeyPressed('a');
		const s = Player.keyManager.isKeyPressed('s');		
		const d = Player.keyManager.isKeyPressed('d');		
	
		// The "+" syntax converts a boolean to number
		const dx = (+d - +a);
		const dy = (+s - +w);
		let dDist = Math.sqrt(dx ** 2 + dy ** 2);
		if (dDist == 0) dDist = 1;

		this.x += dx * this.SPEED * deltaMS / dDist;
		this.y += dy * this.SPEED * deltaMS / dDist;

		// ------------- player left-right ------------

		if (dx > 0)
			this.container.scale.set(this.spriteScale, this.spriteScale);
		if (dx < 0)
			this.container.scale.set(-this.spriteScale, this.spriteScale);

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

	private broomState: 'Holding' | 'Prehit' | 'Hitting' = 'Holding';
	private broomHitDelay = 200;
	private broomTimer = this.broomHitDelay;

	private broomLogic(ticker: Ticker) {
		switch(this.broomState) {
			case 'Holding':
				if (Player.keyManager.isKeyPressed('mouse0')) {
					this.broomState = 'Prehit';	
				}
			break;
			case 'Prehit':
			break;
			case 'Hitting':
			break;
		}
	}

}


