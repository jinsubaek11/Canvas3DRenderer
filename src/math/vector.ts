import { Matrix4x4 } from "./matrix"

export class Vector {
    public static convertVec3ToVec4(v: Vector3): Vector4 {
        return new Vector4(v.x, v.y, v.z, 1.0);
    }

    public static convertVec4ToVec3(v: Vector4): Vector3 {
        return new Vector3(v.x / v.w, v.y / v.w, v.z / v.w);
    }

    public static multiplyMatrix4x4(m: Matrix4x4, v: Vector4) {
        const x = m.data[0] * v.x + m.data[1] * v.y + m.data[2] * v.z + m.data[3] * v.w;
        const y = m.data[4] * v.x + m.data[5] * v.y + m.data[6] * v.z + m.data[7] * v.w;
        const z = m.data[8] * v.x + m.data[9] * v.y + m.data[10] * v.z + m.data[11] * v.w;
        const w = m.data[12] * v.x + m.data[13] * v.y + m.data[14] * v.z + m.data[15] * v.w;
        
        return new Vector4(x, y, z, w);
    }

    public static rotateXvec3(v: Vector3, r: number): Vector3 {
        const vector = new Vector3();

        vector.x = v.x;          
        vector.y = Math.cos(r) * v.y - Math.sin(r) * v.z;
        vector.z = Math.sin(r) * v.y + Math.cos(r) * v.z;
        
        return vector;
    }

    public static rotateYvec3(v: Vector3, r: number): Vector3 {
        const vector = new Vector3();

        vector.x = Math.cos(r) * v.x + Math.sin(r) * v.z;
        vector.y = v.y;          
        vector.z = -Math.sin(r) * v.x + Math.cos(r) * v.z;
        
        return vector;
    }

    public static rotateZvec3(v: Vector3, r: number): Vector3 {
        const vector = new Vector3();

        vector.x = Math.cos(r) * v.x - Math.sin(r) * v.y;
        vector.y = Math.sin(r) * v.x + Math.cos(r) * v.y;
        vector.z = v.z;          
        
        return vector;
    }

    public static subtractVec2(v1: Vector2, v2: Vector2): Vector2 {
        const vector = new Vector2();

        vector.x = v1.x - v2.x;
        vector.y = v1.y - v2.y;

        return vector;
    }

    public static subtractVec3(v1: Vector3, v2: Vector3): Vector3 {
        const vector = new Vector3();

        vector.x = v1.x - v2.x;
        vector.y = v1.y - v2.y;
        vector.z = v1.z - v2.z;

        return vector;
    }

    public static addVec3(v1: Vector3, v2: Vector3): Vector3 {
        const vector = new Vector3();

        vector.x = v1.x + v2.x;
        vector.y = v1.y + v2.y;
        vector.z = v1.z + v2.z;

        return vector;
    }

    public static multiplyScalar(v: Vector3, s: number) {
        const vector = new Vector3();
        vector.x = v.x  * s;
        vector.y = v.y  * s;
        vector.z = v.z  * s;

        return vector;
    }

    public static dotVec3(v1: Vector3, v2: Vector3): number {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }

    public static crossVec3(v1: Vector3, v2: Vector3): Vector3 {
        const vector: Vector3 = new Vector3();

        vector.x = v1.y * v2.z - v1.z * v2.y;
        vector.y = v1.z * v2.x - v1.x * v2.z;
        vector.z = v1.x * v2.y - v1.y * v2.x;

        return vector;
    }

    public static normalizeVec3(v: Vector3): Vector3 {
        const vector: Vector3 = new Vector3();
        const length: number = this.magnitudeVec3(v);

        vector.x = v.x / length;
        vector.y = v.y / length;
        vector.z = v.z / length;

        return vector;
    }

    public static magnitudeVec3(v: Vector3): number {
        return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    }
}

export class Vector2 {
    private _x: number;
    private _y: number;

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

    public set x(value: number) {
        this._x = value;
    }

    public set y(value: number) {
        this._y = value;
    }
}

export class Vector3 {
    private _x: number;
    private _y: number;
    private _z: number;

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
    
    public set x(value: number) {
        this._x = value;
    }

    public set y(value: number) {
        this._y = value;
    }

    public set z(value: number) {
        this._z = value;
    }
}

export class Vector4 {
    private _x: number;
    private _y: number;
    private _z: number;
    private _w: number;

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

    public set x(value: number) {
        this._x = value;
    }

    public set y(value: number) {
        this._y = value;
    }

    public set z(value: number) {
        this._z = value;
    }

    public set w(value: number) {
        this._w = value;
    }
}