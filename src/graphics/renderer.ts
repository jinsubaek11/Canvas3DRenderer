import Canvas from "./canvas"
import {Vector4, Vector3, Vector2, Vector} from "../math/vector"
import {Matrix, Matrix4x4} from "../math/matrix"
import { loadCubeMeshData, loadObjFileData, Mesh, MESH_FACES, MESH_VERTICES } from "./mesh";
import { Face, Triangle } from "./triangle";
import { degreeToRadian } from "../math/util"; 
import { LargeNumberLike } from "crypto";

export default class Renderer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private cube: Vector3[] = [];
    private projectedCube: Vector2[] = [];
    private fovFactor: number = 200;
    private triangledToRender: Triangle[] = [];
    private camera: Vector3 = { x: 0, y: 0, z: 0 } as Vector3;
    private mesh: Mesh;

    public constructor() {
    
    }

    public async setup(): Promise<boolean> {
        if (Canvas.init()) {
            if (Canvas.context != null)
            {
                this.canvas = Canvas.element;
                this.ctx = Canvas.context;

                //this.cubeMesh = loadCubeMeshData();
                //this.cubeMesh = loadObjFileData("./assets/cube.obj");    
                //this.mesh = await loadObjFileData("./assets/cube.obj"); 
                this.mesh = await loadObjFileData("./assets/f22.obj"); 

            }
            return true;
          } else {
                throw Error("Canvas is Not Available");
          }
    }
  
    public update(deltaTime: number): void {
        //console.log("update", deltaTime);
        this.triangledToRender = [];

        for (let i = 0; i < this.mesh.faces.length; i++) {
            const face: Face = this.mesh.faces[i];

            const vertices: Vector3[] = [];
            vertices[0] = this.mesh.vertices[face.a - 1];
            vertices[1] = this.mesh.vertices[face.b - 1];
            vertices[2] = this.mesh.vertices[face.c - 1];

            
            const radian: number = deltaTime * 0.0005;
            const transformedVertices: Vector3[] = [];

            for (let i = 0; i < 3; i++) {
                let transformedVector = Vector.rotateZvec3(vertices[i], radian);
                transformedVector = Vector.rotateYvec3(transformedVector, radian);
                transformedVector = Vector.rotateXvec3(transformedVector, radian);

                transformedVector.z += 4;

                transformedVertices.push(transformedVector);
            }

            const vectorAB: Vector3 = Vector.subtractVec3(transformedVertices[1], transformedVertices[0]);
            const vectorAC: Vector3 = Vector.subtractVec3(transformedVertices[2], transformedVertices[0]);
            const normal: Vector3 = Vector.crossVec3(vectorAB, vectorAC);
            const cameraRay: Vector3 = Vector.subtractVec3(this.camera, transformedVertices[0]);

            if (Vector.dotVec3(cameraRay, normal) < 0) {
                continue;
            }

            const triangle: Triangle = { points: [] };

            for (let i = 0; i < 3; i++) {
                const projectedPoint: Vector2 = this.project(transformedVertices[i]);
                projectedPoint.x += this.canvas.width / 2;
                projectedPoint.y += this.canvas.height / 2;

                triangle.points[i] = projectedPoint;
            }

            this.triangledToRender.push(triangle);
            //console.log(this.triangledToRender.length);
            //console.log(triangle);
        }
        
    }

    public render(deltaTime: number): void {
        //console.log(deltaTime);
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.triangledToRender.length; i++) {
            const triangle: Triangle = this.triangledToRender[i];
            this.drawRectangle(triangle.points[0].x, triangle.points[0].y, 3, 3 , "red");
            this.drawRectangle(triangle.points[1].x, triangle.points[1].y, 3, 3 , "red");
            this.drawRectangle(triangle.points[2].x, triangle.points[2].y, 3, 3 , "red");
            this.drawTriangle(
                triangle.points[0].x, triangle.points[0].y,
                triangle.points[1].x, triangle.points[1].y,
                triangle.points[2].x, triangle.points[2].y, "green"
            );
            this.drawFilledTriangle(
                triangle.points[0].x, triangle.points[0].y,
                triangle.points[1].x, triangle.points[1].y,
                triangle.points[2].x, triangle.points[2].y, "green"
            );
        }

        //this.drawFilledTriangle(300, 100, 50, 400, 500, 700, "green");
    }

    private drawGrid(): void {
        this.ctx.fillStyle = 'rgba(191, 191, 191, 1.0)' // silver;

        for (let y = 0; y < this.canvas.height; y++) {
            for (let x = 0; x < this.canvas.width; x++) {
                if (x % 10 == 0 || y % 10 == 0) {
                    this.ctx.fillRect(x, y, 1, 1);
                }
            }
        }
    }

    private project(v: Vector3): Vector2 {
        v.z += this.camera.z;
        const projectedX: number = this.fovFactor * v.x / v.z;
        const projectedY: number = this.fovFactor * v.y / v.z;
        const projectedPoints: Vector2 = new Vector2(projectedX, projectedY);

        return projectedPoints;
       // this.projectedCube.push(projectedPoints);
    }

    private perspectiveDivide(x: number, y: number, z: number, w: number): Vector3 {
        return new Vector3(x / w, y / w, z / w);
    }

    private fitToViewport(x: number, y: number, z: number, w: number): Vector2 {
        const dividedVector: Vector3 = this.perspectiveDivide(x, y, z, w);

        const viewportX: number = dividedVector.x * this.canvas.width / 2 + this.canvas.width / 2;
        const viewportY: number = -dividedVector.y * this.canvas.height / 2 + this.canvas.height / 2;

        // let viewportX = x + this.canvas.width / 2;
        // viewportX *= this.canvas.width / 2 
        // let viewportY = y + this.canvas.height / 2;
        // viewportY *= this.canvas.height / 2;

        return new Vector2(viewportX, viewportY);
    }

    private drawTriangle(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, color: string): void {
        //console.log(x0, y0, x1, y1, x2, y2);
        this.ctx.beginPath();
        this.ctx.moveTo(x0, y0);
        this.ctx.lineTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.closePath();
        this.ctx.strokeStyle = color;
        this.ctx.stroke();
    }

    private drawFilledTriangle(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, color: string): void {
        // screen Y order: high < middle < low
        const high = { x: x0, y: y0 } as Vector2;
        const middle = { x: x1, y: y1 } as Vector2;
        const low = { x: x2, y: y2 } as Vector2;
    
        if (high.y > middle.y) {
            const tempX = high.x;
            const tempY = high.y;
            high.x = middle.x;
            high.y = middle.y;
            middle.x = tempX;
            middle.y = tempY;
        }

        if (middle.y > low.y) {
            const tempX = low.x;
            const tempY = low.y;
            low.x = middle.x;
            low.y = middle.y;
            middle.x = tempX;
            middle.y = tempY;
        }

        if (high.y > middle.y) {
            const tempX = high.x;
            const tempY = high.y;
            high.x = middle.x;
            high.y = middle.y;
            middle.x = tempX;
            middle.y = tempY;
        }

        if (middle.y == low.y) {
            this.fillFlatBottomTriangle(x0, y0, x1, y1, x2, y2, color);
        } else if (high.y == middle.y) {
            this.fillFlatTopTriangle(x0, y0, x1, y1, x2, y2, color);
        } else {
            const mx: number = ((low.x - high.x) * (middle.y - high.y) / (low.y - high.y)) + high.x;
            const my: number = middle.y;
    
            this.fillFlatBottomTriangle(high.x, high.y, middle.x, middle.y, mx, my, color);
            this.fillFlatTopTriangle(middle.x, middle.y, mx, my, low.x, low.y, color);
        }
    }

    private fillFlatBottomTriangle(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, color: string) {
        const invSlopeLeft: number = (x1 - x0) / (y1 - y0);
        const invSlopeRight: number = (x2 - x0) / (y2 - y0);

        let xStart: number = x0;
        let xEnd: number = x0;

        for (let y = y0; y <= y2; y++) {
            this.drawLine(xStart, y, xEnd, y, color);
            xStart += invSlopeLeft;
            xEnd += invSlopeRight;
        }
    }

    private fillFlatTopTriangle(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, color: string) {
            //invSlopeLeft = (x2 - x1) / (y2-  y1);
            //invSlopeRight = (x2 - mx) / (y2 - my);
            const invSlopeLeft = (x1 - x2) / (y1 - y2);
            const invSlopeRight = (x0 - x2) / (y0 - y2);
    
            let xStart = x2;
            let xEnd = x2;
    
            for (let y = y2; y >= y0; y--) {
                this.drawLine(xStart, y, xEnd, y, color);
                xStart -= invSlopeLeft;
                xEnd -= invSlopeRight;
            }
    }

    private drawRectangle(x: number, y: number, width: number, height: number, color: string): void {
        if (x < 0 || y < 0 || x >= this.canvas.width || y >= this.canvas.height) return;

        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }

    private drawPixel(x: number, y: number, color: string): void {
        if (x < 0 || y < 0 || x >= this.canvas.width || y >= this.canvas.height) return;

        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, 1, 1);
    }  

    private drawLine(x0: number, y0: number, x1: number, y1: number, color: string): void {
        this.ctx.beginPath();
        this.ctx.moveTo(x0, y0);
        this.ctx.lineTo(x1, y1);
        this.ctx.closePath();
        this.ctx.strokeStyle = color;
        this.ctx.stroke();
    }
  }