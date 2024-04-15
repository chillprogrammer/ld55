import {Text, Ticker, type StrokeStyle} from 'pixi.js';
import {Game} from './game';
import {Trash} from './trash';

export class GameUI {
	private game: Game;
	private trashCounter: Text;
	constructor(game: Game) {
		this.trashCounter = new Text({
			text: `Total Trash:`,
			style: {
				fontFamily: 'Wendysscript',
				fontSize: 256,
				fill: 0xffffff,
				align: 'center',
				stroke: {
					color: 'black',
					width: 32, 
				}
			}
		});
		this.trashCounter.scale = 0.07;
		this.trashCounter.zIndex = 10000;

		Ticker.shared.add(()=>{
			this.trashCounter.text = `Total Trash: ${Trash.instances.length}`;
		});

		game.mainContainer.addChild(this.trashCounter);
	}	
}
