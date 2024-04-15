import {Ticker, Texture, Sprite} from 'pixi.js'
import {Game} from './game';
import {ZIndexManager} from './managers/zIndex-manager';

export class Trash {

	private static game: Game = null;

	private static trashTextures: Texture[] = [];

	public static instances: Trash[] = [];

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
		const heightFromGround = 20;
		const yDispersion = 20;
		for(let i = 0; i < count; i++) {
			const velocity = Math.random() * vel;
			const angle = Math.PI * ((Math.random() / 2) - (1/4)) + Math.PI / 2;
			const yRand = Math.random() * yDispersion - heightFromGround + y;
			const xV = Math.cos(angle) * velocity;
			const yV = Math.sin(angle) * velocity;
			new Trash(x, yRand + heightFromGround, heightFromGround, xV, yV);
		}
	}

	private x: number;
	private y: number;
	private h: number; // fake height off of ground

	private xV: number;
	private hV: number;

	private ticker: Ticker;
	public sprite: Sprite;

	private gravity: number = 400;

	constructor(x: number, y: number, h: number, xV: number, hV: number) {
		if (!Trash.game) throw "Need to link game to trash class!";	

		this.x = x;
		this.y = y;
		this.h = h;
		this.xV = xV;
		this.hV = hV;
		this.ticker = Ticker.shared.add(this.update.bind(this));
		this.sprite = Sprite.from(Trash.getRandomTexture());

		this.sprite.zIndex = 1;

		Trash.game.mainContainer.addChild(this.sprite);
		Trash.instances.push(this);
	}

	public update(ticker: Ticker) {

		if (this.h > 0) {
			this.hV -= this.gravity * ticker.deltaMS / 1000;
		} else {
			this.hV = 0;
			this.xV = 0;
		}

		this.x += this.xV * ticker.deltaMS / 1000;	
		this.h += this.hV * ticker.deltaMS / 1000;	

		this.sprite.position.set(
			this.x, this.y - this.h
		);
	}

	public sweep(isRight: boolean) {
		this.h += 1;	
		const vel = 1 + Math.random() * 200;

		this.xV = (isRight) ? vel : -vel;
		this.hV = vel / 1;
	}

	public remove() {
		this.ticker.stop();	
	}

	public getZIndexY() {
		if (this.h > 0) return 100000;

		return this.sprite.getBounds().bottom;
	}

	public setZIndex(value: number) {
		this.sprite.zIndex = value;
	}

	private zIndexManager = new ZIndexManager(this.getZIndexY.bind(this), this.setZIndex.bind(this));

}
