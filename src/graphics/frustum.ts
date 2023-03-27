import { degreeToRadian } from "../math/util";
import { Vector3 } from "../math/vector";
import Plane from "./plane";

export enum FrustumPlane {
    LEFT,
    RIGHT,
    TOP, 
    BOTTOM,
    NEAR,
    FAR
}

export class Frustum {
    private _planes: Plane[] = [];
    private _origin = new Vector3(0, 0, 0);

    public constructor(fovX: number, fovY: number, near: number, far: number) {
        console.log(fovX, fovY);
        const cosHalfFovX = Math.cos(degreeToRadian(fovX) / 2);
        const sinHalfFovX = Math.sin(degreeToRadian(fovX) / 2);
        const cosHalfFovY = Math.cos(degreeToRadian(fovY) / 2);
        const sinHalfFovY = Math.sin(degreeToRadian(fovY) / 2);

        this._planes[FrustumPlane.LEFT] = new Plane(this._origin, new Vector3(cosHalfFovX, 0, sinHalfFovX));
        this._planes[FrustumPlane.RIGHT] = new Plane(this._origin, new Vector3(-cosHalfFovX, 0, sinHalfFovX));
        this._planes[FrustumPlane.TOP] = new Plane(this._origin,new Vector3(0, -cosHalfFovY, sinHalfFovY));
        this._planes[FrustumPlane.BOTTOM] = new Plane(this._origin, new Vector3(0, cosHalfFovY, sinHalfFovY));
        this._planes[FrustumPlane.NEAR] = new Plane(new Vector3(0, 0, near), new Vector3(0, 0, 1));
        this._planes[FrustumPlane.FAR] = new Plane(new Vector3(0, 0, far), new Vector3(0, 0, -1));
    }

    get planes(): Plane[] {
        return this._planes;
    }
}