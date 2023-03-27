import { lerp } from "../math/util";
import { Vector, Vector3, Vector4 } from "../math/vector";
import { Frustum, FrustumPlane } from "./frustum";
import Plane from "./plane";
import { Texture } from "./texture";
import { Triangle } from "./triangle";


export default class Polygon {
    private _vertices: Vector3[];
    private _texCoords: Texture[];

    public constructor(
        a: Vector3, b:Vector3, c:Vector3, uvA: Texture, uvB: Texture, uvC: Texture, 
    ) {
        this._vertices = [a, b, c];
        this._texCoords = [uvA, uvB, uvC];
    }

    get vertices(): Vector3[] {
        return this._vertices;
    }

    get texCoords(): Texture[] {
        return this._texCoords;
    }

    public generateTriangles(): Triangle[] {
        const clippedTriangles: Triangle[] = [];
        
        for (let i = 0; i < this._vertices.length - 2; i++) {
            const points: Vector4[] = [
                Vector.convertVec3ToVec4(this._vertices[0]), 
                Vector.convertVec3ToVec4(this._vertices[i+1]), 
                Vector.convertVec3ToVec4(this._vertices[i+2])
            ];

            const texCoords: Texture[] = [
                this._texCoords[0], this._texCoords[i+1], this._texCoords[i+2]
            ];

            clippedTriangles.push(new Triangle(points, texCoords));
        }

        return clippedTriangles;
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
        const insideTexCoords: Texture[] = [];
        let index: number = 0;
        let previousVertex: Vector3 = this._vertices[this._vertices.length - 1];
        let previousTexCoord: Texture = this._texCoords[this._texCoords.length - 1];

        if (!previousVertex || !previousTexCoord) return;
        
        let previousDot: number = Vector.dotVec3(Vector.subtractVec3(previousVertex, plane.point), plane.normal);
        while (index < this._vertices.length) {
            const currentVertex: Vector3 = this._vertices[index];
            const currentDot: number = Vector.dotVec3(Vector.subtractVec3(currentVertex, plane.point), plane.normal);
               
            const currentTexCoord = this._texCoords[index];

            if (currentDot * previousDot < 0) {
                const t: number = previousDot / (previousDot - currentDot);
                
                const intersectionPoint: Vector3 = new Vector3(
                    lerp(previousVertex.x, currentVertex.x, t),
                    lerp(previousVertex.y, currentVertex.y, t),
                    lerp(previousVertex.z, currentVertex.z, t),
                );

                const interpolatedTexCoord: Texture = {
                    u: lerp(previousTexCoord.u, currentTexCoord.u, t),
                    v: lerp(previousTexCoord.v, currentTexCoord.v, t),
                };

                insideVertices.push(intersectionPoint);
                insideTexCoords.push(interpolatedTexCoord);
            }

            if (currentDot > 0) {
                insideVertices.push(currentVertex);
                insideTexCoords.push(currentTexCoord);
            }

            previousVertex = currentVertex;
            previousDot = currentDot;
            previousTexCoord = currentTexCoord;
            index++;
        }

        this._vertices = insideVertices;
        this._texCoords = insideTexCoords;
    }
}