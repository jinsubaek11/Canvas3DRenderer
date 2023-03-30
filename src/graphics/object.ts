import Canvas from "./canvas"
import { Vector4, Vector3, Vector } from "../math/vector";
import { Matrix } from "../math/matrix"
import { Mesh } from "./mesh";
import { Texture } from "./texture";
import Polygon from "./polygon";
import Camera from "./camera";
import { BACKFACE_CULLING, Controller, FILLED_TRIANGLES, POINTS, RenderingStates, TEXTURED, WIRE_FRAME_LINES } from "../ui/controller";
import { Face, Triangle } from "./triangle";
import { Lights } from "./lights";


export default class Object {
    private _mesh: Mesh;
    private _texture: Texture | null = null;
    private _position: Vector3 = new Vector3();
    private _rotation: Vector3 = new Vector3();
    private _scale: Vector3 = new Vector3(1, 1, 1);
    private _triangles: Triangle[] = [];

    public constructor(
        meshPath: string, texturePath: string = "", position: Vector3 = new Vector3(), 
        rotation: Vector3 = new Vector3(), scale: Vector3 = new Vector3(1, 1, 1)) {
        this._mesh = new Mesh(meshPath);
        this._texture = texturePath ? new Texture(texturePath) : this._texture;
        this._position = position;
        this._rotation = rotation;
        this._scale = scale;

        this.load();
    }

    private async load(): Promise<void> {
        this._mesh.load();
        this._texture?.load();
        console.log(this._texture);
    }

    public update(renderingStates: RenderingStates): void {
        this._triangles = [];
        const camera = Camera.getCameras()[0];

        for (let i = 0; i < this._mesh.faces.length; i++) {
            const face: Face = this._mesh.faces[i];

            const vertices: Vector3[] = [];
            vertices[0] = this._mesh.vertices[face.a];
            vertices[1] = this._mesh.vertices[face.b];
            vertices[2] = this._mesh.vertices[face.c];
            
            const transformedVertices: Vector3[] = [];

            for (let i = 0; i < 3; i++) {
                let transformedVector = Vector.convertVec4ToVec3(Vector.multiplyMatrix4x4(
                        Matrix.scale4x4(this._scale.x, this._scale.y, this._scale.z), Vector.convertVec3ToVec4(vertices[i]))
                );

                transformedVector = Vector.rotateZvec3(transformedVector, this._rotation.z);
                transformedVector = Vector.rotateYvec3(transformedVector, this._rotation.y);
                transformedVector = Vector.rotateXvec3(transformedVector, this._rotation.x);

                transformedVector = Vector.convertVec4ToVec3(Vector.multiplyMatrix4x4(Matrix.translation4x4(
                        this.position.x, this._position.y, this._position.z), Vector.convertVec3ToVec4(transformedVector))
                );

                transformedVector = Vector.convertVec4ToVec3(Vector.multiplyMatrix4x4(
                    camera.getViewMatrix(), 
                    Vector.convertVec3ToVec4(transformedVector)
                )); 

                transformedVertices.push(transformedVector);
            }

            const vectorAB: Vector3 = Vector.subtractVec3(transformedVertices[1], transformedVertices[0]);
            const vectorAC: Vector3 = Vector.subtractVec3(transformedVertices[2], transformedVertices[0]);
            const normal: Vector3 = Vector.crossVec3(vectorAB, vectorAC);
            const cameraRay: Vector3 = Vector.subtractVec3(camera.position, transformedVertices[0]);

            if (renderingStates[BACKFACE_CULLING] && Vector.dotVec3(cameraRay, normal) < 0) {
                continue;
            }

            let contrast = 0;
            if (Lights.list.length > 0) {
                for (let i = 0; i < Lights.list.length; i++) {
                    const lightVec: Vector3 = Vector.subtractVec3(Lights.list[i].position, transformedVertices[0]);
                    let calcLight = Vector.dotVec3(Vector.normalizeVec3(lightVec), Vector.normalizeVec3(normal));
                    calcLight = Math.floor((calcLight * 0.5 + 0.5) * 255) * 0.3;

                    contrast += calcLight;
                }
            }

            const polygon: Polygon = new Polygon(
                transformedVertices[0], transformedVertices[1], transformedVertices[2],
                face.uvA, face.uvB, face.uvC
            );     
            polygon.clip(camera.frustum);      
            const clippedTriangles: Triangle[] = polygon.generateTriangles();
            
            for (let i = 0; i < clippedTriangles.length; i++) {
                const projectedPoints: Vector4[] = [];
                const triangle: Triangle = clippedTriangles[i];
    
                for (let j = 0; j < 3; j++) {
                     const projectedPoint: Vector4 = Vector.multiplyMatrix4x4(
                        camera.projection, triangle.points[j]
                    );
        
                    projectedPoint.x /= projectedPoint.w;
                    projectedPoint.y /= projectedPoint.w;
    
                    projectedPoint.x *= Canvas.canvasView.width / 2;
                    projectedPoint.y *= -Canvas.canvasView.height / 2;
    
                    projectedPoint.x += Canvas.canvasView.width / 2;
                    projectedPoint.y += Canvas.canvasView.height / 2;
    
                    projectedPoints.push(projectedPoint);
                }
    
                triangle.points = projectedPoints;
                triangle.contrast = `rgb(${contrast}, ${contrast}, ${contrast})`;
                this._triangles.push(triangle);
            }
        }
    }

    public render(renderingStates: RenderingStates): void {
        for (let i = 0; i < this._triangles.length; i++) {
            const triangle: Triangle = this._triangles[i];

            if (renderingStates[WIRE_FRAME_LINES]) {
                Canvas.drawTriangle(
                    triangle.points[0].x, triangle.points[0].y,
                    triangle.points[1].x, triangle.points[1].y,
                    triangle.points[2].x, triangle.points[2].y, "green"
                );
            }
    
            if (renderingStates[FILLED_TRIANGLES]) {
                Canvas.drawFilledTriangle(
                    triangle.points[0].x, triangle.points[0].y,
                    triangle.points[1].x, triangle.points[1].y,
                    triangle.points[2].x, triangle.points[2].y, triangle.contrast
                );
            }

            if (renderingStates[TEXTURED] && this._texture) {
                Canvas.drawTexturedTriangle(
                    triangle.points[0].x, triangle.points[0].y, triangle.points[0].z, triangle.points[0].w, triangle.texCoords[0].u, triangle.texCoords[0].v,
                    triangle.points[1].x, triangle.points[1].y, triangle.points[1].z, triangle.points[1].w, triangle.texCoords[1].u, triangle.texCoords[1].v,
                    triangle.points[2].x, triangle.points[2].y, triangle.points[2].z, triangle.points[2].w, triangle.texCoords[2].u, triangle.texCoords[2].v,
                    this._texture
                );
            }

            if (renderingStates[POINTS]) {
                Canvas.drawRectangle(triangle.points[0].x, triangle.points[0].y, 3, 3 , "red");
                Canvas.drawRectangle(triangle.points[1].x, triangle.points[1].y, 3, 3 , "red");
                Canvas.drawRectangle(triangle.points[2].x, triangle.points[2].y, 3, 3 , "red");
            }
        }
    }

    public get position(): Vector3 {
        return this._position;
    }

    public get rotation(): Vector3 {
        return this._rotation;
    }

    public get scale(): Vector3 {
        return this._scale;
    }

    public set position(value: Vector3) {
        this._position = value;
    }

    public set rotation(value: Vector3) {
        this._rotation = value;
    }

    public set scale(value: Vector3) {
        this._scale = value
    }
}