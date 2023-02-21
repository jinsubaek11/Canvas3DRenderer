import internal from "node:stream";
import { degreeToRadian } from "./util";
import { Vector, Vector3 } from "./vector";


export class Polygon {
    private _vertices: Vector3[];

    public constructor(a: Vector3, b:Vector3, c:Vector3) {
        this._vertices = [a, b, c];
    }

    get vertices(): Vector3[] {
        return this._vertices;
    }

    public clip(frustum: Frustum): void {
        this.clipPolygonByPlane(frustum.planes[FrustumPlane.LEFT]);
        this.clipPolygonByPlane(frustum.planes[FrustumPlane.RIGHT]);
        this.clipPolygonByPlane(frustum.planes[FrustumPlane.TOP]);
        this.clipPolygonByPlane(frustum.planes[FrustumPlane.BOTTOM]);
        this.clipPolygonByPlane(frustum.planes[FrustumPlane.NEAR]);
        this.clipPolygonByPlane(frustum.planes[FrustumPlane.FAR]);
    }

    private clipPolygonByPlane(plane: Plane): void {
        const insideVertices: Vector3[] = [];
        let index: number = 0;
        let previousVertex: Vector3 = this._vertices[this._vertices.length - 1];
        //console.log(previousVertex);
        let previousDot: number = Vector.dotVec3(Vector.subtractVec3(previousVertex, plane.point), plane.normal);
        while (index < this._vertices.length) {
            const currentVertex: Vector3 = this._vertices[index];
            const currentDot: number = Vector.dotVec3(Vector.subtractVec3(currentVertex, plane.point), plane.normal);
               
            //console.log(currentDot, previousDot);

            if (currentDot * previousDot < 0) {
                //console.log(currentDot, previousDot);

                const t: number = previousDot / (previousDot - currentDot);
                
                let intersectionPoint: Vector3;
                intersectionPoint = Vector.addVec3(Vector.multiplyScalar(Vector.subtractVec3(currentVertex, previousVertex), t), previousVertex);

                insideVertices.push(intersectionPoint);
            }

            if (currentDot > 0) {
                insideVertices.push(currentVertex);
            }

            previousVertex = currentVertex;
            previousDot = currentDot;
            index++;
        }
        this._vertices = insideVertices;
        //console.log(this._vertices.length);
    }
}

export class Plane {
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

enum FrustumPlane {
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

    public constructor(fov: number, near: number, far: number) {
        const cosHalfFov = Math.cos(degreeToRadian(fov) / 2);
        const sinHalfFov = Math.sin(degreeToRadian(fov) / 2);

        this._planes[FrustumPlane.LEFT] = new Plane(this._origin, new Vector3(cosHalfFov, 0, sinHalfFov));
        this._planes[FrustumPlane.RIGHT] = new Plane(this._origin, new Vector3(-cosHalfFov, 0, sinHalfFov));
        this._planes[FrustumPlane.TOP] = new Plane(this._origin,new Vector3(0, -cosHalfFov, sinHalfFov));
        this._planes[FrustumPlane.BOTTOM] = new Plane(this._origin, new Vector3(0, cosHalfFov, sinHalfFov));
        this._planes[FrustumPlane.NEAR] = new Plane(new Vector3(0, 0, near), new Vector3(0, 0, 1));
        this._planes[FrustumPlane.FAR] = new Plane(new Vector3(0, 0, far), new Vector3(0, 0, -1));
    }

    get planes(): Plane[] {
        return this._planes;
    }
}