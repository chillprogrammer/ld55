import { Sprite } from "pixi.js";

export class TileManager {

    private tileList: Sprite[]

    constructor() {

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