import { Assets, Sprite, Application, Container, Ticker, TickerCallback, Bounds } from 'pixi.js';
import { KeyManager } from './managers/key-manager';
import { ZIndexManager } from './managers/zIndex-manager';
import { Game } from './game';
import { Howl } from 'howler'
import { Trash } from './trash';
import { colliding } from './utils';
import { WizardSpawner } from './wizard';

/** The main player class for the game */
export class Player {

	public static instance: Player | undefined;

	private SPEED = 0.1;

	private collidables: Bounds[] = [];

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

	private broomSweepSound = new Howl({
		volume: 0.4,
		src: ['assets/sounds/BroomSweep.wav']
	});

	private broomReadySound = new Howl({
		volume: 0.4,
		src: ['assets/sounds/BroomReady.wav']
	});

	private broomHitSound = new Howl({
		src: ['assets/sounds/Broomhit.wav']
	});

	private footstepSound = new Howl({
		volume: 0.1,
		src: ['assets/sounds/Footstep.wav']
	});

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
		return this.sprite.getBounds().bottom;
		//		return this.y + this.container.height / 2;
	}

	public setZIndex(value: number) {
		this.container.zIndex = value;
		//		this.container.zIndex = value;
	}

	private zIndexManager = new ZIndexManager(this.getZIndexY.bind(this), this.setZIndex.bind(this));
	private facingRight: boolean = true;

	private callback: TickerCallback<void>;

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
		this.container.addChild(this.broom);

		this.container.position.set(Player.game.INITIAL_WIDTH / 2, Player.game.INITIAL_HEIGHT / 2);

		Player.mainContainer.addChild(this.container);

		Ticker.shared.add(this.update.bind(this));

	}

	setCollidables(values: Bounds[]): void {
		this.collidables = values
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
		const { deltaMS } = ticker;

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



		const movingLeft = (dx * this.SPEED * deltaMS / dDist) < 0 ? true : false;
		const movingRight = (dx * this.SPEED * deltaMS / dDist) > 0 ? true : false;

		const movingUp = (dy * this.SPEED * deltaMS / dDist) < 0 ? true : false;
		const movingDown = (dy * this.SPEED * deltaMS / dDist) > 0 ? true : false;


		this.x += dx * this.SPEED * deltaMS / dDist;
		this.y += dy * this.SPEED * deltaMS / dDist;

		for(let bound of this.collidables) {
			if(colliding(this.container.getBounds(), bound)) {
				if(movingRight || movingLeft) {
					this.x -= dx * this.SPEED * deltaMS / dDist;
				}
				if(movingUp || movingDown) {
					this.y -= dy * this.SPEED * deltaMS / dDist;
				}
			}
		}


		// ------------- player left-right ------------

		if (dx > 0) {
			this.container.scale.set(this.spriteScale, this.spriteScale);
			this.facingRight = true;
		}
		if (dx < 0) {
			this.container.scale.set(-this.spriteScale, this.spriteScale);
			this.facingRight = false;
		}

		// ------------- player tilt ------------------

		const isMoving = (dx !== 0 || dy !== 0);

		if (isMoving)
			this.walkTiltTimer -= deltaMS;

		if (this.walkTiltTimer <= 0) {
			this.walkTiltTimer = this.walkTiltTime;
			this.tiltingRight = !this.tiltingRight;
			this.footstepSound.rate(1 - Math.random() * 0.25);
			this.footstepSound.play();
		}

		this.rotation = (isMoving) ?
			(this.tiltingRight)
				? 0.1
				: -0.1
			: 0;
	}

	private broomState: 'Holding' | 'Prehit' | 'Hitting' | 'Sweeping' = 'Holding';
	private broomSweepDelay = 300;
	private broomSweepTimer = this.broomSweepDelay;
	private broomHitDelay = 200;
	private broomTimer = this.broomHitDelay;

	private broomLogic(ticker: Ticker) {
		switch (this.broomState) {
			case 'Holding':
				if (Player.keyManager.isKeyPressed('mouse0')) {
					this.broomState = 'Prehit';
					this.broomReadySound.play();
				}
				if (Player.keyManager.isKeyPressed('mouse2')) {
					this.broomState = 'Sweeping';
					this.broomSweepSound.play();
					this.sweepTrash();
				}
				this.broom.anchor.set(0.5, 0.5);
				this.broom.position.set(0, 5);
				this.broom.rotation = 1;
				break;
			case 'Prehit':
				if (!Player.keyManager.isKeyPressed('mouse0')) {
					this.broomState = 'Hitting';
					this.broomTimer = this.broomHitDelay;
					this.attackWizards();
				}

				this.broom.anchor.set(0.5, 0.5);
				this.broom.position.set(-4, 0);
				this.broom.rotation = Math.PI / 2 + 0.2;
				break;
			case 'Hitting':
				if (this.broomTimer === this.broomHitDelay) {
					this.broomHitSound.rate(1 + Math.random() * 0.2);
					this.broomHitSound.play();
				}

				if (this.broomTimer <= 0) {
					this.broomState = 'Holding';
				}
				this.broomTimer -= ticker.deltaMS;

				this.broom.anchor.set(0.5, 0.2);
				this.broom.position.set(8, 0);
				this.broom.rotation = -Math.PI / 2;
				break;
			case 'Sweeping':
				if (this.broomSweepTimer <= 0) {
					this.broomState = 'Holding';
					this.broomSweepTimer = this.broomSweepDelay;
				}
				this.broomSweepTimer -= ticker.deltaMS;
				const sweepFactor = (this.broomSweepTimer / this.broomSweepDelay) * 2 - 1;

				this.broom.anchor.set(0.5, 0.2);
				this.broom.position.set(0, 0);
				this.broom.rotation = Math.PI * sweepFactor / 4;
				break;
		}
	}

	private sweepTrash() {
		for (const trash of Trash.instances) {
			if (colliding(trash.sprite.getBounds(), this.container.getBounds())) {
				trash.sweep(this.facingRight);
			}
		}
	}

	private attackWizards() {
		for (const wizard of WizardSpawner.wizardList) {
			if (!wizard.sprite) {
				continue;
			}
			if (colliding(wizard.sprite.getBounds(), this.container.getBounds())) {
				wizard.die(true);
			}
		}
	}
}

