import { Vector3 } from "../math/vector";

export default class Plane {
    private _point: Vector3;
    private _normal: Vector3;

    public constructor(point: Vector3 = new Vector3(), normal: Vector3 = new Vector3()) {
        this._point = point;
        this._normal = normal;
    }

    get point(): Vector3 {
        return this._point;
    }

    get normal(): Vector3 {
        return this._normal;
    }

    set point(value: Vector3) {
        this._point = value;
    }

    set normal(value: Vector3) {
        this._normal = value;
    }
}