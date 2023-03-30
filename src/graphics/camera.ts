import { Matrix4x4, Matrix } from "../math/matrix";
import { degreeToRadian } from "../math/util";
import { Vector, Vector3 } from "../math/vector";
import { MouseStates, MovementStates } from "../ui/controller";
import { Frustum } from "./frustum";

export default class Camera {
    private static _lists: Camera[] = [];
    private _position: Vector3;
    private _direction: Vector3 = new Vector3(0, 0, 1);
    private _yaw: number = 90;
    private _pitch: number = 0;
    private _speed: number = 2;
    private _forward: Vector3 = new Vector3();
    private _right: Vector3 = new Vector3();
    private _up: Vector3 = new Vector3();
    private _projection: Matrix4x4;
    private _frustum: Frustum;

    private constructor(position: Vector3, fovX: number, fovY: number, aspectY: number, near: number, far: number) {
        this._position = position;
        this._projection = Matrix.projection(fovY, aspectY, near, far);
        this._frustum = new Frustum(fovX, fovY, near, far);
    }

    public static addCamera(position: Vector3, fovX: number, fovY: number, aspectY: number, near: number, far: number): void {
        const camera: Camera = new Camera(position, fovX, fovY, aspectY, near, far);
        this._lists.push(camera);
    }

    public static getCameras(): Camera[] {
        return this._lists;
    }

    public get position(): Vector3 {
        return this._position;
    }

    public get direction(): Vector3 {
        return this._direction;
    }

    public get projection(): Matrix4x4 {
        return this._projection;
    }

    public get frustum(): Frustum {
        return this._frustum;
    }

    public set position(vec: Vector3) {
        this._position = vec;
    }  
    
    public set direction(vec: Vector3) {
        this._direction = vec;
    }

    public update(movement: MovementStates, mouse: MouseStates, deltaTime: number) {
        this._yaw += mouse.dx * 0.3;
        this._pitch += mouse.dy * 0.3;

        if (this._pitch < -89)
        {
            this._pitch = -89;
        }
        else if (this._pitch > 89)
        {
            this._pitch = 89;
        }

        const yawRadian = degreeToRadian(this._yaw);
        const pitchRadian = degreeToRadian(this._pitch);

        this._direction.x = -Math.cos(yawRadian) * Math.cos(pitchRadian);
        this._direction.y = Math.sin(pitchRadian);
        this._direction.z = Math.sin(yawRadian) * Math.cos(pitchRadian);

        this._direction = Vector.normalizeVec3(this.direction);

        if (movement.forward) {
            this._position = Vector.addVec3(this._position, Vector.multiplyScalar(this._forward,  -this._speed * deltaTime));
        }
        if (movement.backward) {
            this._position = Vector.addVec3(this._position, Vector.multiplyScalar(this._forward,  this._speed * deltaTime));
        }
        if (movement.right) {
            this._position = Vector.addVec3(this._position, Vector.multiplyScalar(this._right,  this._speed * deltaTime));
        }
        if (movement.left) {
            this._position = Vector.addVec3(this._position, Vector.multiplyScalar(this._right,  -this._speed * deltaTime));
        }
        if (movement.up) {
            this._position = Vector.addVec3(this._position, Vector.multiplyScalar(this._up,  this._speed * deltaTime));
        }
        if (movement.down) {
            this._position = Vector.addVec3(this._position, Vector.multiplyScalar(this._up,  -this._speed * deltaTime));
        }
    }

    public getViewMatrix(): Matrix4x4 {
        const upVector = new Vector3(0, 1, 0);
        const viewMat: Matrix4x4 = this.lookAt(this._position, Vector.addVec3(this._position, this.direction), upVector);

        return viewMat;
    }

    public lookAt(eye: Vector3, target: Vector3, up: Vector3): Matrix4x4 {
        const z: Vector3 = Vector.normalizeVec3(Vector.subtractVec3(target, eye));
        const x: Vector3 = Vector.normalizeVec3(Vector.crossVec3(up, z));
        const y: Vector3 = Vector.crossVec3(z, x);

        this._forward = Vector.multiplyScalar(z, -1);
        this._right = x;
        this._up = y;

        const tx: number = -Vector.dotVec3(x, eye);
        const ty: number = -Vector.dotVec3(y, eye);
        const tz: number = -Vector.dotVec3(z, eye);

        const viewMatrix = new Matrix4x4([
            x.x, x.y, x.z, tx,
            y.x, y.y, y.z, ty,
            z.x, z.y, z.z, tz,
              0,   0,   0,  1
        ]);

        return viewMatrix;
    }
}