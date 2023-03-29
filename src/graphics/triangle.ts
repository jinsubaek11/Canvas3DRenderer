import { Vector4 } from "../math/vector";
import { TexCoords } from "./texture";

export interface Face {
    a: number;
    b: number;
    c: number;
    uvA: TexCoords
    uvB: TexCoords
    uvC: TexCoords
}

export class Triangle {
    private _points: Vector4[];
    private _texCoords: TexCoords[];
    private _contrast: string = "rgb(0, 0, 0)";

    public constructor(points: Vector4[], texCoords: TexCoords[] = []) {
        this._points = points;
        this._texCoords = texCoords;
    }

    get points(): Vector4[] {
        return this._points;
    }

    get texCoords(): TexCoords[] {
        return this._texCoords;
    }

    get contrast(): string {
        return this._contrast;
    }

    set points(value: Vector4[]) {
        this._points = value;
    }

    set texCoords(value: TexCoords[]) {
        this._texCoords = value;
    }

    set contrast(value: string) {
        this._contrast = value;
    }
}