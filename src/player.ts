import {Assets, Sprite, Application, Container} from 'pixi.js';

export class Player {

	private static spritesheetAssets: any;

	public static setSpritesheetAssets(spritesheetAssets: any) {
		Player.spritesheetAssets = spritesheetAssets;
	}

	private static mainContainer: Container | undefined;
	
	public static setMainContainer(app: Container) {
		Player.mainContainer = app;
	}	

	private sprite: Sprite;

	constructor() {
		if (!Player.mainContainer) throw "Need to define application before creating new player";

		this.sprite = Sprite.from(Player.spritesheetAssets['player.png']);

		Player.mainContainer.addChild(this.sprite);
	}
}


