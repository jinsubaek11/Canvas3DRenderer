import { Vector4 } from "../math/vector";
import { Texture } from "./texture";

export interface Face {
    a: number;
    b: number;
    c: number;
    uvA: Texture
    uvB: Texture
    uvC: Texture
}
 
// export interface Triangle {
//     points: Vector4[];
//     texCoords: Texture[];
// }

export class Triangle {
    private _points: Vector4[];
    private _texCoords: Texture[];

    public constructor(points: Vector4[], texCoords: Texture[] = []) {
        this._points = points;
        this._texCoords = texCoords;
    }

    get points(): Vector4[] {
        return this._points;
    }

    get texCoords(): Texture[] {
        return this._texCoords;
    }

    set points(value: Vector4[]) {
        this._points = value;
    }

    set texCoords(value: Texture[]) {
        this._texCoords = value;
    }
}