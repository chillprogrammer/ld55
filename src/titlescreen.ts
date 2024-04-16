import {Text, Sprite, Ticker, BlurFilter, HardMixBlend, Container, Color, Rectangle, MeshPlane} from 'pixi.js';
import {Game} from './game';

export default function titlescreen(game: Game): Promise<void> { return new Promise<void>(async (resolve) => {
		const {
			app, spritesheetAssets,
			fontAssets,
			INITIAL_WIDTH, INITIAL_HEIGHT
		} = game;

		const titlescreenContainer = new Container();

		app.renderer.background.color = 0xee6666;

		const xVerts = 100;
		const yVerts = 100;
	
		const wizardX = INITIAL_WIDTH * 2 / 3;
		const wizardY = INITIAL_HEIGHT / 2;

		const wizard = new MeshPlane({
			texture: spritesheetAssets['player.png'], verticesX: xVerts, verticesY: yVerts
		});

		wizard.scale.set(6, 6);
		wizard.position.set(
			wizardX - wizard.width / 2, 
			wizardY - wizard.height / 2
		);

		const title = new Text({
			text: `Shenanigans at Schmendy's`,
			style: {
				fontFamily: 'Wendysscript',
				fontSize: 256,
				fill: 0xffffff,
				align: 'center',
				padding: 40,
				dropShadow: {
					blur: 32,
					color: 0x000000,
				},
				stroke: {
					color: 'black',
					width: 32, 
				}
			}
		});

		title.scale.set(1/8, 1/8);
		title.position.set(10, 10);

		const startButtonText = new Text({
			text: `play game`,
			style: {
				fontFamily: 'Wendysscript',
				fontSize: 200,
				fill: 0xffffff,
				align: 'center',
				padding: 40,
				dropShadow: {
					blur: 32,
					color: 0x000000
				},
				stroke: {
					color: 'black',
					width: 32, 
				}
			}
		});

		startButtonText.scale.set(1/8, 1/8);

		const startButton = new Container();
		startButton.addChild(startButtonText);
		startButton.position.set(10, 50);

		startButton.onclick = () => {
			startButton.position.set(13, 50);
			startButton.scale.set(0.9, 1.0)

			setTimeout(()=>{
				startButton.position.set(10, 50);
				startButton.scale.set(1.0, 1.0)
			}, 50);

			setTimeout(()=>{
				titlescreenContainer.destroy();
				ticker.destroy();
				resolve();
			}, 300)
		}

		startButton.onmouseover = () => {

			startButton.position.set(7, 50);
			startButton.scale.set(1.1, 1.0)
		}

		startButton.onmouseout = () => {
			startButton.position.set(10, 50);
			startButton.scale.set(1.0, 1.0)
		}

		startButton.interactive = true;
		

		titlescreenContainer.addChild(wizard);
		titlescreenContainer.addChild(title);
		titlescreenContainer.addChild(startButton);
		app.stage.addChild(titlescreenContainer);
		const { buffer } = wizard.geometry.getAttribute('aPosition');

		const oldData = [...buffer.data];

		let timer = 0;

		const update = (ticker: Ticker) => {
			timer += ticker.deltaMS;

			for(let i = 0; i < buffer.data.length; i += 2) {
				const x = oldData[i];	
				const y = oldData[i + 1];	
				const dx = x - 20;
				const dy = y - 20;
				let dist = Math.sqrt(dx ** 2 + dy ** 2);
				if (dist === 0) dist = 1;
					
				buffer.data[i] += Math.sin((timer / 100 + dx)) * 0.01;
				buffer.data[i + 1] += Math.sin((timer / 100 + dy)) * 0.01;
			}

			buffer.update();
		}
		
		const ticker = Ticker.shared.add(update);

	});	
}
