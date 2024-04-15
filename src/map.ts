import { TilingSprite, Texture, Ticker, Sprite, Bounds } from 'pixi.js';
import { Game } from './game';
import { Player } from './player';
import { ZIndexManager } from './managers/zIndex-manager';

const TILE_SIZE = 32;

export const collidables: Bounds[] = [];

export default function createMap(game: Game) {

	const createMapElements = (...sprites: (TilingSprite | Sprite)[]) => {
		for (const sprite of sprites) {
			if (sprite.zIndex === 0) {
				new ZIndexManager(
					() => {
						return sprite.getBounds().bottom;
					},
					(value: number) => {
						sprite.zIndex = value;
					}
				);
			}
			game.mainContainer.addChild(sprite);

			if (sprite !== floor) {
				collidables.push(sprite.getBounds());
			}
		}
	}

	const counter = new TilingSprite({
		texture: game.spritesheetAssets['counter.png'],
		width: TILE_SIZE * 5,
		height: TILE_SIZE,
		x: TILE_SIZE * 5,
		y: TILE_SIZE * 2
	});

	const floor = new TilingSprite({
		texture: game.spritesheetAssets['floor.png'],
		width: game.INITIAL_WIDTH,
		height: game.INITIAL_HEIGHT,
		zIndex: -100
	});

	const leftWallTop = new TilingSprite({
		texture: game.spritesheetAssets['wall.png'],
		width: TILE_SIZE * 3,
		height: TILE_SIZE * 2.5
	});

	const leftWallBottom = new TilingSprite({
		texture: game.spritesheetAssets['wallBaseboard.png'],
		width: TILE_SIZE * 3,
		height: TILE_SIZE * 1,
		y: TILE_SIZE * 2
	});

	const rightWallX = TILE_SIZE * 12;

	const rightWallTop = new TilingSprite({
		texture: game.spritesheetAssets['wall.png'],
		x: rightWallX,
		width: TILE_SIZE * 3,
		height: TILE_SIZE * 2.5
	});

	const rightWallBottom = new TilingSprite({
		texture: game.spritesheetAssets['wallBaseboard.png'],
		x: rightWallX,
		width: TILE_SIZE * 3,
		height: TILE_SIZE * 1,
		y: TILE_SIZE * 2
	});

	const billboard = new Sprite({
		texture: game.spritesheetAssets['billboard.png'],
		x: TILE_SIZE * 3,
		zIndex: 255
	});

	createMapElements(
		counter, floor, leftWallTop, leftWallBottom, rightWallTop, rightWallBottom, billboard
	);

}
