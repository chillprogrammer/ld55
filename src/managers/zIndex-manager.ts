export class ZIndexManager {

	private static instances: ZIndexManager[] = [];

	private static baseZIndex = 20;

	public static arrangeZIndicies() {

		ZIndexManager.instances.sort((a, b)=>{
			if (a.getYPos() > b.getYPos()) 
				return 1;
			else if (a.getYPos() < b.getYPos()) 
				return -1;

			return 0;
		});

		for(let i = 0; i < ZIndexManager.instances.length; i++) {
			ZIndexManager.instances[i].setZIndex(ZIndexManager.baseZIndex + i);
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
