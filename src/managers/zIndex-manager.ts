export class ZIndexManager {

	private static instances: ZIndexManager[] = [];

	private static baseZIndex = 100;

	public static arrangeZIndicies() {

		for(let i = 0; i < ZIndexManager.instances.length; i++) {
			if (!ZIndexManager.instances[i]) {
				ZIndexManager.instances.splice(i, 1);
				i--;
			} else if (!ZIndexManager.instances[i].getYPos()) {
				ZIndexManager.instances.splice(i, 1);
				i--;
				continue;
			}
		}



		ZIndexManager.instances.sort((a, b)=>{
			return a.getYPos() - b.getYPos();
		});

		//ZIndexManager.instances.forEach((inst, index) => {
		//});
		//console.log(ZIndexManager.instances.map(e => Math.floor(e.getYPos())));

		for(let i = 0; i < ZIndexManager.instances.length; i++) {
			ZIndexManager.instances[i].setZIndex(ZIndexManager.baseZIndex + i);
			/*ZIndexManager.instances[i].setZIndex(
				Math.floor(ZIndexManager.instances[i].getYPos()) + this.baseZIndex
			)*/
		}

	}

	private getYPos: ()=>number;
	private setZIndex: (zIndex: number)=>void;

	constructor(getYPos: ()=>number, setZIndex: (zIndex: number)=>void) {
		this.getYPos = getYPos;
		this.setZIndex = setZIndex;
		ZIndexManager.instances.push(this);
	}



}
