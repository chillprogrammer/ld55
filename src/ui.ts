import { Sprite, Text, Texture, Ticker, type StrokeStyle } from 'pixi.js';
import { Game } from './game';
import { Trash } from './trash';

export class GameUI {
	private game: Game;
	private trashCounter: Text;
	private trashCleanedCounter: Text;
	private shiftClockRemainingCounter: Text;

	private restartButton: Sprite = null;
	private restartText: Text = null;

	constructor(game: Game) {
		this.game = game;

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
		this.trashCleanedCounter = new Text({
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
		this.shiftClockRemainingCounter = new Text({
			text: `Shift Left:`,
			style: {
				fontFamily: 'Wendysscript',
				fontSize: 256,
				fill: 0xffffff,
				align: 'left',
				stroke: {
					color: 'black',
					width: 32,
				}
			}
		});

		this.trashCounter.scale = 0.07;
		this.trashCounter.zIndex = 10000;

		this.trashCleanedCounter.scale = 0.07;
		this.trashCleanedCounter.zIndex = 10000;
		this.trashCleanedCounter.y = 40

		this.shiftClockRemainingCounter.scale = 0.07;
		this.shiftClockRemainingCounter.zIndex = 10000;
		this.shiftClockRemainingCounter.x = game.INITIAL_WIDTH / 2 + 145

		Ticker.shared.add(() => {
			this.trashCounter.text = `Total Trash: ${Trash.instances.length}`;
			this.trashCleanedCounter.text = `Cleaned: ${Trash.totalGenerated - Trash.instances.length}`;
			this.shiftClockRemainingCounter.text = `Shift\nClock: ${this.msToClockTime(this.game.shiftClockTimeRemaining)}`;
		});

		game.mainContainer.addChild(this.trashCounter);
		game.mainContainer.addChild(this.trashCleanedCounter);
		game.mainContainer.addChild(this.shiftClockRemainingCounter);


		this.restartButton = Sprite.from(Texture.WHITE);
		this.restartButton.tint = 0xFF5555;
		this.restartButton.setSize(this.game.INITIAL_WIDTH / 4, 30);
		this.restartButton.position.set(this.game.INITIAL_WIDTH / 2 - this.restartButton.width / 2, this.game.INITIAL_HEIGHT / 1.3);
		this.restartButton.interactive = true;

		this.restartText = new Text({
			text: `Start Next Shift`,
			style: {
				fontFamily: 'Wendysscript',
				fontSize: 256,
				fill: 0xffffff,
				align: 'left',
				stroke: {
					color: 'black',
					width: 32,
				}
			}
		});
		this.restartText.scale = 0.07;
		this.restartText.zIndex = 10000;


		this.restartText.position.set(this.restartButton.position.x + this.restartButton.width / 2 - this.restartText.width / 2, this.restartButton.position.y + this.restartButton.height / this.restartText.height / 2);
		
		this.restartText.visible = false;
		this.restartButton.visible = false;

		this.game.mainContainer.addChild(this.restartText);
		this.game.mainContainer.addChild(this.restartButton);

		this.restartButton.onclick = () => {
			this.restartText.visible = false;
			this.restartButton.visible = false;
			this.game.restartGame();
		}

		this.restartButton.onmouseover = () => {
			this.restartText.scale = 0.075;
			this.restartText.position.set(this.restartButton.position.x + this.restartButton.width / 2 - this.restartText.width / 2 - 1, this.restartButton.position.y + this.restartButton.height / this.restartText.height / 2 - 1);
		}

		this.restartButton.onmouseout = () => {
			this.restartText.scale = 0.07
			this.restartText.position.set(this.restartButton.position.x + this.restartButton.width / 2 - this.restartText.width / 2, this.restartButton.position.y + this.restartButton.height / this.restartText.height / 2);
		}
	}

	private msToClockTime(valInMS: number): string {
		let mins = 0;
		let seconds = 0;

		mins = Math.floor((valInMS / 1000) / 60);
		seconds = Math.floor((valInMS / 1000) % 60);


		return `${mins !== 0 ? mins : '00'}:${seconds !== 0 ? seconds : '00'}`;
	}

	public showStartNextShiftButton() {
		this.restartText.visible = true;
		this.restartButton.visible = true;
	}
}
