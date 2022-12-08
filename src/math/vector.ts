import { Matrix, Matrix4x4 } from "./matrix"

export class Vector {
    public static convertVec3ToVec4(a: Vector3): Vector4 {
        return new Vector4(a.x, a.y, a.z, 1.0);
    }

    public static multiplyMatrix(m: Matrix4x4, v: Vector4) {
        const x = m.data[0] * v.x + m.data[1] * v.y + m.data[2] * v.z + m.data[3] * v.w;
        const y = m.data[4] * v.x + m.data[5] * v.y + m.data[6] * v.z + m.data[7] * v.w;
        const z = m.data[8] * v.x + m.data[9] * v.y + m.data[10] * v.z + m.data[11] * v.w;
        const w = m.data[12] * v.x + m.data[13] * v.y + m.data[14] * v.z + m.data[15] * v.w;
        
        return new Vector4(x, y, z, w);
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
}