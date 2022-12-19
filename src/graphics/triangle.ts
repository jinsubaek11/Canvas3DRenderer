import { Vector2 } from "../math/vector";
import { Texture } from "./texture";

export interface Face {
    a: number;
    b: number;
    c: number;
    uvA: Texture
    uvB: Texture
    uvC: Texture
}
 
export interface Triangle {
    points: Vector2[];
    texCoords: Texture[];
}