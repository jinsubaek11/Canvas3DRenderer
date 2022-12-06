import { Matrix4x4 } from "./matrix"

export class Vector {
    public static convertVec3ToVec4(a: Vector3): Vector4 {
        return new Vector4(a.x, a.y, a.z, 1.0);
    }
}

export class Vector2 {
    private _x = 0;
    private _y = 0;

    public constructor(x: number = 0, y: number = 0) {
        this._x = x;
        this._y = y;
    }

    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }


}

export class Vector3 {
    private _x = 0;
    private _y = 0;
    private _z = 0;

    public constructor(x: number = 0, y: number = 0, z: number = 0) {
        this._x = x;
        this._y = y;
        this._z = z;
    }

    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }

    public get z(): number {
        return this._z;
    }
}

export class Vector4 {
    private _x = 0;
    private _y = 0;
    private _z = 0;
    private _w = 1;

    public constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 1) {
        this._x = x;
        this._y = y;
        this._z = z;
        this._w = w;
    }

    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }

    public get z(): number {
        return this._z;
    }

    public get w(): number {
        return this._w;
    }

    public multiplyMatrix4x4(matrix: Matrix4x4): void {
        this._x = matrix.data[0] * this._x + matrix.data[1] * this._y + matrix.data[2] * this._z + matrix.data[3] * this._w;
        this._y = matrix.data[4] * this._x + matrix.data[5] * this._y + matrix.data[6] * this._z + matrix.data[7] * this._w;
        this._z = matrix.data[8] * this._x + matrix.data[9] * this._y + matrix.data[10] * this._z + matrix.data[11] * this._w;
        this._w = matrix.data[12] * this._x + matrix.data[13] * this._y + matrix.data[14] * this._z + matrix.data[15] * this._w;
    }
}