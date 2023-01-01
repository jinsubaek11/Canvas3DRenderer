import { Matrix4x4 } from "../math/matrix";
import { Vector, Vector3 } from "../math/vector";

export default class Camera {
    private _position: Vector3;
    private _direction: Vector3;

    public constructor(position: Vector3, direction: Vector3) {
        this._position = position;
        this._direction = direction;
    }

    public get position(): Vector3 {
        return this._position;
    }

    public get direction(): Vector3 {
        return this._direction;
    }

    public set position(vec: Vector3) {
        this._position = vec;
    }  
    
    public set direction(vec: Vector3) {
        this._direction = vec;
    }

    public lookAt(target: Vector3, up: Vector3): Matrix4x4 {
        const z: Vector3 = Vector.normalizeVec3(Vector.subtractVec3(target, this._position));
        const x: Vector3 = Vector.normalizeVec3(Vector.crossVec3(up, z));
        const y: Vector3 = Vector.crossVec3(z, x);

        const tx: number = -Vector.dotVec3(x, this._position);
        const ty: number = -Vector.dotVec3(y, this._position);
        const tz: number = -Vector.dotVec3(z, this._position);

        const viewMatrix = new Matrix4x4([
            x.x, x.y, x.z, tx,
            y.x, y.y, y.z, ty,
            z.x, z.y, z.z, tz,
              0,   0,   0,  1
        ]);

        return viewMatrix;
    }
}