import {TilingSprite, Texture, Ticker} from 'pixi.js';
import {Game} from './game';
import {Player} from './player';

export default function createMap(game: Game) {
	const counter = new TilingSprite({
		texture: game.spritesheetAssets['counter.png'],
		width: 32,
		height: 32
	});

	const floor = new TilingSprite({
		texture: game.spritesheetAssets['floor.png'],
		width: 32,
		height: 32
	});

	floor.zIndex = -100;
	floor.width = game.INITIAL_WIDTH;
	floor.height = game.INITIAL_HEIGHT;

	counter.position.y = 32 * 2;
	counter.position.x = 32 * 3;
	counter.width = 32 * 9;

	Ticker.shared.add((ticker: Ticker)=>{
		if (!Player.instance) return;
		const player = Player.instance;
		const bottomPlayer = player.y;
		const bottomCounter = counter.position.y + counter.height / 2;
		counter.zIndex = (bottomPlayer < bottomCounter)
			? 100
			: -99;
	});

	game.mainContainer.addChild(floor);
	game.mainContainer.addChild(counter);
}
