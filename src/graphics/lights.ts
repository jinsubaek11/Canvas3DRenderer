import { Vector3 } from "../math/vector"


export class Light {
    private _position: Vector3;
    private _id: number = 0;

    public constructor(position: Vector3 = new Vector3()) {
        this._position = position;
    }

    public get position(): Vector3 {
        return this._position;
    }

    public set position(value: Vector3) {
        this._position = value;
    }

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }
}

export class Lights {
    private static _lists: Light[] = [];
    private static _id: number = 0;

    public static addLight(light: Light): void {
        light.id = this.generateId();
        this._lists.push(light);
    }

    public static removeLight(id: number): void {
        this._lists = this._lists.filter((light) => light.id !== id);
    }

    private static generateId(): number {
        return this._id++;
    }

    public static get list(): Light[] {
        return this._lists;
    }
}

