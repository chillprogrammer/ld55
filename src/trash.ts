import { Ticker, Texture, Sprite, TickerCallback } from 'pixi.js'
import { Game } from './game';
import { ZIndexManager } from './managers/zIndex-manager';

export class Trash {

	private static game: Game = null;

	private static trashTextures: Texture[] = [];

	public static instances: Trash[] = [];
	public static totalGenerated: number = 0;

	public static updateAll(ticker: Ticker) {
		for (let trash of Trash.instances) {
			if (trash?.sprite) {
				trash.update(ticker);
			}
		}
	}

	public static removeAll() {
		for (let i = 0; i < Trash.instances.length; i++) {
			let trash = Trash.instances[i];
			if (trash) {
				trash.sprite?.destroy();
				trash.sprite = null;
			}
			console.log(Trash.instances)
		}
		Trash.instances = [];
	}

	public static setGame(game: Game) {
		Trash.game = game;
		Trash.trashTextures.push(
			game.spritesheetAssets['trash1.png'],
			game.spritesheetAssets['trash2.png']
		);
	}

	public static getRandomTexture(): Texture {
		if (!Trash.trashTextures.length) throw "Need to provide trash textures to create trash!";
		return Trash.trashTextures[Math.floor(Math.random() * Trash.trashTextures.length)];
	}

	public static throwFrom(x: number, y: number, count: number, vel: number = 200) {
		const heightFromGround = 40;
		const yDispersion = 20;
		for (let i = 0; i < count; i++) {
			const velocity = Math.random() * vel;
			const angle = Math.PI * ((Math.random() / 2) - (1 / 4)) + Math.PI / 2;
			const yRand = Math.random() * yDispersion - heightFromGround + y;
			const xV = Math.cos(angle) * velocity;
			const yV = Math.sin(angle) * velocity;
			new Trash(x, yRand + heightFromGround, heightFromGround, xV, yV);
		}
	}


	private static trashDropSounds: Howl[] = [
		new Howl({
			volume: 0.1,
			src: ['assets/sounds/TrashDrop1.wav']
		}),
		new Howl({
			volume: 0.1,
			src: ['assets/sounds/TrashDrop2.wav']
		}),
		new Howl({
			volume: 0.1,
			src: ['assets/sounds/TrashDrop3.wav']
		}),
		new Howl({
			volume: 0.1,
			src: ['assets/sounds/TrashDrop4.wav']
		}),
		new Howl({
			volume: 0.1,
			src: ['assets/sounds/TrashDrop5.wav']
		}),
	];


	private static playRandomDropSound() {
		const sound = Trash.trashDropSounds[Math.floor(Trash.trashDropSounds.length * Math.random())];
		sound.rate(1 + (Math.random() - 0.5));
		sound.play();
	}

	private x: number;
	private y: number;
	private h: number; // fake height off of ground

	private xV: number;
	private hV: number;

	private startingHealth: number = 3;
	private health: number = this.startingHealth;

	private ticker: Ticker;
	public sprite: Sprite;
	public index: number;

	private gravity: number = 400;
	public callback: TickerCallback<void>;

	constructor(x: number, y: number, h: number, xV: number, hV: number) {
		if (!Trash.game) throw "Need to link game to trash class!";

		this.x = x;
		this.y = y;
		this.h = h;
		this.xV = xV;
		this.hV = hV;
		//		this.ticker = Ticker.shared.add(this.update.bind(this));
		this.sprite = Sprite.from(Trash.getRandomTexture());

		this.sprite.zIndex = 1;

		this.index = Trash.instances.length;

		this.callback = this.update.bind(this);

		Trash.game.mainContainer.addChild(this.sprite);
		Trash.instances.push(this);
		Trash.totalGenerated++;
	}

	private flying: boolean = true;
	private angVel: number = (Math.random() - 0.5) * 0.01;

	public update(ticker: Ticker) {

		if (this.flying) {
			this.sprite.rotation += this.angVel * ticker.deltaMS;
		}

		if (this.h > 0) {
			this.hV -= this.gravity * ticker.deltaMS / 1000;
			this.flying = true;
		} else {
			if (this.flying === true) {
				Trash.playRandomDropSound();
			}
			this.flying = false;
			this.hV = 0;
			this.xV = 0;
		}

		this.sprite.scale.set(this.health / this.startingHealth);
		this.x += this.xV * ticker.deltaMS / 1000;
		this.h += this.hV * ticker.deltaMS / 1000;

		if (
			this.x < 0 || this.x > Trash.game.INITIAL_WIDTH
		) {
			this.xV = -this.xV;
		}



		this.sprite.position.set(
			this.x, this.y - this.h
		);

		if (this.health <= 0) this.remove();

		if (
			this.y < 0 || this.y > Trash.game.INITIAL_HEIGHT
		) {
			this.remove();
		}

	}

	public sweep(isRight: boolean) {
		this.h += 1;
		const vel = 1 + Math.random() * 200;

		this.xV = (isRight) ? vel : -vel;
		this.hV = vel / 1;
		this.health--;
	}

	public remove() {
		this.sprite?.destroy();
		this.sprite = null;

		for (let i = this.index + 1; i < Trash.instances.length; i++) {
			Trash.instances[i].index--;
		}
		Trash.instances.splice(this.index, 1);
	}

	public getZIndexY() {
		if (this.sprite === null) return 100000;
		if (this.h > 0) return 100000;
		return this.sprite.getBounds().bottom;
	}

	public setZIndex(value: number) {
		if (!this.sprite) return;
		this.sprite.zIndex = value;
	}

	private zIndexManager = new ZIndexManager(this.getZIndexY.bind(this), this.setZIndex.bind(this));

}

export class WizardDust {

	private static game: Game = null;

	private static trashTextures: Texture[] = [];

	public static instances: WizardDust[] = [];

	public static removeAll() {
		for (let i = 0; i < WizardDust.instances.length; i++) {
			const dust = WizardDust.instances[i];
			if (dust && dust.sprite) {
				dust.sprite.destroy();
				WizardDust.game.mainContainer.removeChild(dust.sprite);
			}
		}
		WizardDust.instances = [];
	}

	public static updateAll(ticker: Ticker) {
		for (const trash of WizardDust.instances) {
			trash.update(ticker);
		}
	}

	public static setGame(game: Game) {
		WizardDust.game = game;
		WizardDust.trashTextures.push(
			game.spritesheetAssets['wizardDust.png'],
		);
	}

	public static getRandomTexture(): Texture {
		if (!WizardDust.trashTextures.length) throw "Need to provide trash textures to create trash!";
		return WizardDust.trashTextures[Math.floor(Math.random() * WizardDust.trashTextures.length)];
	}

	public static throwFrom(x: number, y: number, count: number, vel: number = 200) {
		const heightFromGround = 20;
		const yDispersion = 20;
		for (let i = 0; i < count; i++) {
			const velocity = Math.random() * vel;
			const angle = Math.PI * ((Math.random() / 2) - (1 / 4)) + Math.PI / 2;
			const yRand = Math.random() * yDispersion - heightFromGround + y;
			const xV = Math.cos(angle) * velocity;
			const yV = Math.sin(angle) * velocity;
			new WizardDust(x, yRand + heightFromGround, heightFromGround, xV, yV);
		}
	}

	private x: number;
	private y: number;
	private h: number; // fake height off of ground

	private xV: number;
	private hV: number;

	private initialHealth: number = 500 + Math.random() * 500;
	private health: number = this.initialHealth;

	private ticker: Ticker;
	public sprite: Sprite;
	public index: number;

	private gravity: number = 100;
	public callback: TickerCallback<void>;

	constructor(x: number, y: number, h: number, xV: number, hV: number) {
		if (!WizardDust.game) throw "Need to link game to trash class!";

		this.x = x;
		this.y = y;
		this.h = h;
		this.xV = xV;
		this.hV = hV;
		//		this.ticker = Ticker.shared.add(this.update.bind(this));
		this.sprite = Sprite.from(WizardDust.getRandomTexture());

		this.sprite.zIndex = 1;

		this.index = WizardDust.instances.length;

		this.callback = this.update.bind(this);


		WizardDust.game.mainContainer.addChild(this.sprite);
		WizardDust.instances.push(this);
	}

	public update(ticker: Ticker) {

		if (this.h > 0) {
			this.hV -= this.gravity * ticker.deltaMS / 1000;
		} else {
			this.hV = 0;
			this.xV = 0;
		}

		this.health -= ticker.deltaMS;
		//		this.sprite.alpha = this.health / this.initialHealth;
		this.sprite.scale.set(this.health / this.initialHealth);

		this.xV += (Math.random() - 0.5) * ticker.deltaMS;
		this.hV += (Math.random() - 0.5) * ticker.deltaMS;

		this.x += this.xV * ticker.deltaMS / 1000;
		this.h += this.hV * ticker.deltaMS / 1000;



		this.sprite.position.set(
			this.x, this.y - this.h
		);

		if (this.health <= 0) this.remove();
	}

	public sweep(isRight: boolean) {
		this.h += 1;
		const vel = 1 + Math.random() * 200;

		this.xV = (isRight) ? vel : -vel;
		this.hV = vel / 1;
	}

	public remove() {
		this.sprite.destroy();
		this.sprite = null;
		for (let i = this.index + 1; i < WizardDust.instances.length; i++) {
			WizardDust.instances[i].index--;
		}
		new Howl({
			volume: 0.05 * Math.random(),
			src: 'assets/sounds/WizardDust.wav',
			rate: 1 - (Math.random() - 0.5) * 0.8
		}).play();

		WizardDust.instances.splice(this.index, 1);
	}

	public getZIndexY() {
		if (this.sprite === null) return 100000;
		if (this.h > 0) return 100000;
		return this.sprite.getBounds().bottom;
	}

	public setZIndex(value: number) {
		if (!this.sprite) return;
		this.sprite.zIndex = value;
	}

	private zIndexManager = new ZIndexManager(this.getZIndexY.bind(this), this.setZIndex.bind(this));

}
