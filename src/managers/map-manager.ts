import { Assets, Container, Sprite, Texture } from "pixi.js";
import { TileManager } from "./tile-manager";

export class MapManager {

    // Managers
    private tileManager: TileManager = null;

    // Assets
    private tileSetAssets: any = null;
    private tileMapAssets: any = null;
    private spritesheetAssets: any = null;

    private currentMap: TilemapInterface = null;
    private currentTileset: TilesetInterface = null;
    private currentSpriteSheet: Texture = null;
    private mainContainer: Container = null;

    constructor(
        private _mainContainer: Container
    ) {
        this.mainContainer = _mainContainer;
    }

    public async init() {
        this.tileManager = new TileManager();

        // Load the TileSet assets
        this.tileSetAssets = await Assets.loadBundle('tilesets');

        // Load the Tilemap assets
        this.tileMapAssets = await Assets.loadBundle('tilemaps');

        // Spritesheet assets
        this.spritesheetAssets = await Assets.loadBundle('spritesheets');
    }

    /**
     * Sets the currently loaded tilemap
     * @param index Map Number
     */
    public loadMap(index: number) {
        switch (index) {
            case 1:
            default:
                this.currentMap = this.tileMapAssets.map1;
                break;
        }

        this.currentTileset = this.getTilesetFromTileMap(this.currentMap);
        this.currentSpriteSheet = this.spritesheetAssets[this.currentTileset.image];
    }

    /**
     * Gets the first tileset in the list of tilesets for the map.
     * It is designed so that each map has only 1 tileset.
     * @param object 
     */
    private getTilesetFromTileMap(object: TilemapInterface): TilesetInterface {
        const mapTilesetName: string = this.currentMap?.tilesets[0]?.source;

        for (const tilesetInMap of object.tilesets) {
            const entries = Object.entries(this.tileSetAssets);
            for (let [key, value] of entries) {
                if (key === mapTilesetName) {
                    return value as any;
                }
            }
        }
    }

}


interface TilemapInterface {
    compressionlevel: number,
    height: number,
    infinite: boolean,
    layers:
    {
        chunks: {
            data: number[],
            height: number,
            width: number,
            x: number,
            y: number
        }[],
        height: number,
        id: number,
        locked: boolean,
        name: string,
        opacity: number,
        startx: number,
        starty: number,
        type: string,
        visible: true,
        width: number,
        x: number,
        y: number
    }[],
    nextlayerid: number,
    nextobjectid: number,
    orientation: string,
    renderorder: string,
    tiledversion: string,
    tileheight: number,
    tilesets: {
        firstgid: number,
        source: string
    }[],
    tilewidth: number,
    type: string,
    version: string,
    width: number
}

interface TilesetInterface {
    columns: number,
    image: string
    imageheight: number,
    imagewidth: number,
    margin: number,
    name: string
    spacing: number,
    tilecount: number,
    tiledversion: string
    tileheight: number,
    tilewidth: number,
    type: string
    version: string
}