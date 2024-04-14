import {Ticker} from 'pixi.js'
import {Game} from './game';

export class Trash {

	private static game: Game = null;

	public static setGame(game: Game) {
		Trash.game = game;
	}	

	private x;
	private y: number;
	private h: number; // fake height off of ground

	private xV: number;
	private hV: number;

	private ticker: Ticker;

	constructor(x: number, y: number, h: number, xV: number, hV: number) {
		if (!Trash.game) throw "Need to link game to trash class!";	
		this.x = x;
		this.y = y;
		this.h = h;
		this.xV = xV;
		this.hV = hV;
		this.ticker = Ticker.shared.add(this.update.bind(this));
	}

	public update(ticker: Ticker) {

		this.x = this.xV * ticker.deltaMS;	
		this.h = this.hV * ticker.deltaMS;	

		this.y = this.y + this.h;
	}

	public remove() {
		this.ticker.stop();	
	}
}
