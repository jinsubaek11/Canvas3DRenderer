import Canvas from "./canvas"
import {Vector4, Vector3, Vector2, Vector} from "../math/vector"
import {Matrix, Matrix4x4} from "../math/matrix"
import { loadCubeMeshData, loadObjFileData, Mesh, MESH_FACES, MESH_VERTICES } from "./mesh";
import { Face, Triangle } from "./triangle";
import { degreeToRadian } from "../math/util"; 
import { RenderingStates, WIRE_FRAME_LINES, FILLED_TRIANGLES, POINTS, BACKFACE_CULLING, TEXTURED } from "../ui/controller"
import { loadImageData, redbrickTexture, Texture, texture2, textureHeight, textureWidth } from "./texture";
import Camera from "./camera";

export default class Renderer {
    private static _instance: Renderer;
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _colorBufferCtx: CanvasRenderingContext2D;
    private _zBuffer: number[];
    private _cube: Vector3[] = [];
    private _projectedCube: Vector2[] = [];
    private _fovFactor: number = 200;
    private _triangledToRender: Triangle[] = [];
    private _camera: Camera;
    private _viewMat: Matrix4x4;
    private _projectionMat: Matrix4x4;
    private _mesh: Mesh;
    private _sampleTexture: any = [];
    private _texture;

    public constructor() {
    
    }

    public static getInstance(): Renderer {
        if (!this._instance) {
            this._instance = new Renderer();
        }

        return this._instance;
    }

    public async setup(): Promise<boolean> {
        if (Canvas.init()) {
            if (Canvas.canvasViewCtx && Canvas.canvasColorBufferCtx)
            {
                this._canvas = Canvas.canvasView;
                this._ctx = Canvas.canvasViewCtx;
                this._colorBufferCtx = Canvas.canvasColorBufferCtx;
                this._zBuffer = Canvas.zBuffer;
                //console.log(this._zBuffer);
                //this._sampleTexture = texture2;
                //console.log(texture2.length);
                //this._mesh = await loadObjFileData("./assets/cube.obj"); 
                //this._texture = await loadImageData("./assets/cube.png");
                //this._mesh = loadCubeMeshData();
                this._mesh = await loadObjFileData("./assets/f22.obj"); 
                this._texture = await loadImageData("./assets/f22.png");

                //console.log(img);
                //this._sampleTexture = img.data;
                this._camera = new Camera(new Vector3(0, 0, -10), new Vector3(0, 0, 0));

                const fov: number = 60;
                const aspect: number = this._canvas.height / this._canvas.width;
                const near: number = 0.1;
                const far: number = 200;

                this._projectionMat = Matrix.projection(fov, aspect, near, far);

            }
            return true;
          } else {
                throw Error("Canvas is Not Available");
          }
    }
  
    public update(renderingStates: RenderingStates, deltaTime: number): void {
        //console.log("update", deltaTime);
        this._triangledToRender = [];


        for (let i = 0; i < this._mesh.faces.length; i++) {
            const face: Face = this._mesh.faces[i];

            const vertices: Vector3[] = [];
            vertices[0] = this._mesh.vertices[face.a];
            vertices[1] = this._mesh.vertices[face.b];
            vertices[2] = this._mesh.vertices[face.c];

            
            const radian: number = deltaTime * 0.0002;
            const transformedVertices: Vector3[] = [];

            //this._camera.position.x += 0.0001;

            for (let i = 0; i < 3; i++) {
                 let transformedVector = Vector.rotateZvec3(vertices[i], 0);
                //  transformedVector = Vector.rotateYvec3(transformedVector, radian);
                //  transformedVector = Vector.rotateXvec3(transformedVector, radian);

                transformedVector = Vector.convertVec4ToVec3(Vector.multiplyMatrix4x4(
                    this._camera.lookAt(this._camera.direction, new Vector3(0, 1, 0)), 
                    Vector.convertVec3ToVec4(transformedVector)
                )); 

                transformedVertices.push(transformedVector);
            }

            const vectorAB: Vector3 = Vector.subtractVec3(transformedVertices[1], transformedVertices[0]);
            const vectorAC: Vector3 = Vector.subtractVec3(transformedVertices[2], transformedVertices[0]);
            const normal: Vector3 = Vector.crossVec3(vectorAB, vectorAC);
            const cameraRay: Vector3 = Vector.subtractVec3(this._camera.position, transformedVertices[0]);

            if (renderingStates[BACKFACE_CULLING] && Vector.dotVec3(cameraRay, normal) < 0) {
                continue;
            }

            const projectedPoints: Vector4[] = [];
            const triangle: Triangle = { points: [], texCoords: [] };

            for (let i = 0; i < 3; i++) {
                 const projectedPoint: Vector4 = Vector.multiplyMatrix4x4(
                    this._projectionMat, Vector.convertVec3ToVec4(transformedVertices[i]));

                // const projectedPoint: Vector2 = this.project(transformedVertices[i]);

                projectedPoint.x /= projectedPoint.w;
                projectedPoint.y /= projectedPoint.w;

                projectedPoint.x *= this._canvas.width / 2;
                projectedPoint.y *= -this._canvas.height / 2;

                projectedPoint.x += this._canvas.width / 2;
                projectedPoint.y += this._canvas.height / 2;

                projectedPoints.push(projectedPoint);
            }

            triangle.points = [
                new Vector4(projectedPoints[0].x, projectedPoints[0].y, projectedPoints[0].z, projectedPoints[0].w),
                new Vector4(projectedPoints[1].x, projectedPoints[1].y, projectedPoints[1].z, projectedPoints[1].w),
                new Vector4(projectedPoints[2].x, projectedPoints[2].y, projectedPoints[2].z, projectedPoints[2].w),
            ];

            triangle.texCoords = [
                { u: face.uvA.u, v: face.uvA.v },
                { u: face.uvB.u, v: face.uvB.v },
                { u: face.uvC.u, v: face.uvC.v }
            ];

            this._triangledToRender.push(triangle);
        }
        
    }

    public render(renderingStates: RenderingStates, deltaTime: number): void {

       this._colorBufferCtx.fillStyle = "black";
       this._colorBufferCtx.fillRect(0, 0, this._canvas.width, this._canvas.height);
       //this._zBuffer = Canvas.clearZbuffer();
       this._zBuffer = Canvas.clearZbuffer();

        for (let i = 0; i < this._triangledToRender.length; i++) {
            const triangle: Triangle = this._triangledToRender[i];

            if (renderingStates[WIRE_FRAME_LINES]) {
                this.drawTriangle(
                    triangle.points[0].x, triangle.points[0].y,
                    triangle.points[1].x, triangle.points[1].y,
                    triangle.points[2].x, triangle.points[2].y, "green"
                );
            }
    
            if (renderingStates[FILLED_TRIANGLES]) {
                this.drawFilledTriangle(
                    triangle.points[0].x, triangle.points[0].y,
                    triangle.points[1].x, triangle.points[1].y,
                    triangle.points[2].x, triangle.points[2].y, "grey"
                );
            }

            if (renderingStates[TEXTURED]) {
                this.drawTexturedTriangle(
                    triangle.points[0].x, triangle.points[0].y, triangle.points[0].z, triangle.points[0].w, triangle.texCoords[0].u, triangle.texCoords[0].v,
                    triangle.points[1].x, triangle.points[1].y, triangle.points[1].z, triangle.points[1].w, triangle.texCoords[1].u, triangle.texCoords[1].v,
                    triangle.points[2].x, triangle.points[2].y, triangle.points[2].z, triangle.points[2].w, triangle.texCoords[2].u, triangle.texCoords[2].v,
                    this._texture
                );
            }

            if (renderingStates[POINTS]) {
                this.drawRectangle(triangle.points[0].x, triangle.points[0].y, 3, 3 , "red");
                this.drawRectangle(triangle.points[1].x, triangle.points[1].y, 3, 3 , "red");
                this.drawRectangle(triangle.points[2].x, triangle.points[2].y, 3, 3 , "red");
            }

            this._ctx.drawImage(this._colorBufferCtx.canvas, 0, 0);
        }

        //this.drawFilledTriangle(300, 100, 50, 400, 500, 700, "green");
    }

    private drawGrid(): void {
        this._ctx.fillStyle = 'rgba(191, 191, 191, 1.0)' // silver;

        for (let y = 0; y < this._canvas.height; y++) {
            for (let x = 0; x < this._canvas.width; x++) {
                if (x % 10 == 0 || y % 10 == 0) {
                    this._ctx.fillRect(x, y, 1, 1);
                }
            }
        }
    }

    // private project(v: Vector3): Vector2 {
    //     v.z += this._camera.z;
    //     const projectedX: number = this._fovFactor * v.x / v.z;
    //     const projectedY: number = this._fovFactor * v.y / v.z;
    //     const projectedPoints: Vector2 = new Vector2(projectedX, projectedY);

    //     return projectedPoints;
    //    // this.projectedCube.push(projectedPoints);
    // }

    private perspectiveDivide(x: number, y: number, z: number, w: number): Vector3 {
        return new Vector3(x / w, y / w, z / w);
    }

    private fitToViewport(x: number, y: number, z: number, w: number): Vector2 {
        const dividedVector: Vector3 = this.perspectiveDivide(x, y, z, w);

        const viewportX: number = dividedVector.x * this._canvas.width / 2 + this._canvas.width / 2;
        const viewportY: number = -dividedVector.y * this._canvas.height / 2 + this._canvas.height / 2;

        // let viewportX = x + this.canvas.width / 2;
        // viewportX *= this.canvas.width / 2 
        // let viewportY = y + this.canvas.height / 2;
        // viewportY *= this.canvas.height / 2;

        return new Vector2(viewportX, viewportY);
    }

    private drawTriangle(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, color: string): void {
        //console.log(x0, y0, x1, y1, x2, y2);
        this._colorBufferCtx.beginPath();
        this._colorBufferCtx.moveTo(x0, y0);
        this._colorBufferCtx.lineTo(x1, y1);
        this._colorBufferCtx.lineTo(x2, y2);
        this._colorBufferCtx.closePath();
        this._colorBufferCtx.strokeStyle = color;
        this._colorBufferCtx.stroke();
    }

    private drawTexturedTriangle(
        x0: number, y0: number, z0: number, w0: number, u0: number, v0: number,
        x1: number, y1: number, z1: number, w1: number, u1: number, v1: number,
        x2: number, y2: number, z2: number, w2: number, u2: number, v2: number, texture: any) {
        
        const high = { x: x0, y: y0, z: z0, w: w0, u: u0, v: v0 };
        const middle = { x: x1, y: y1, z: z1, w: w1, u: u1, v: v1 };
        const low = { x: x2, y: y2, z: z2, w: w2, u: u2, v: v2 };   

        if (high.y > middle.y) {
            const tempX = high.x;
            const tempY = high.y;
            const tempZ = high.z;
            const tempW = high.w;
            const tempU = high.u;
            const tempV = high.v;
            high.x = middle.x;
            high.y = middle.y;
            high.z = middle.z;
            high.w = middle.w;
            high.u = middle.u;
            high.v = middle.v;
            middle.x = tempX;
            middle.y = tempY;
            middle.z = tempZ;
            middle.w = tempW;
            middle.u = tempU;
            middle.v = tempV;
        }
    
        if (middle.y > low.y) {
            const tempX = low.x;
            const tempY = low.y;
            const tempZ = low.z;
            const tempW = low.w;
            const tempU = low.u;
            const tempV = low.v;
            low.x = middle.x;
            low.y = middle.y;
            low.z = middle.z;
            low.w = middle.w;
            low.u = middle.u;
            low.v = middle.v;
            middle.x = tempX;
            middle.y = tempY;
            middle.z = tempZ;
            middle.w = tempW;
            middle.u = tempU;
            middle.v = tempV;
        }
    
        if (high.y > middle.y) {
            const tempX = high.x;
            const tempY = high.y;
            const tempZ = high.z;
            const tempW = high.w;
            const tempU = high.u;
            const tempV = high.v;
            high.x = middle.x;
            high.y = middle.y;
            high.z = middle.z;
            high.w = middle.w;
            high.u = middle.u;
            high.v = middle.v;
            middle.x = tempX;
            middle.y = tempY;
            middle.z = tempZ;
            middle.w = tempW;
            middle.u = tempU;
            middle.v = tempV;
        }
        
        high.v = 1.0 - high.v;
        middle.v = 1.0 - middle.v;
        low.v = 1.0 - low.v;

        const pointA: Vector4 = new Vector4(high.x, high.y, high.z, high.w);
        const pointB: Vector4 = new Vector4(middle.x, middle.y, middle.z, middle.w);
        const pointC: Vector4 = new Vector4(low.x, low.y, low.z, low.w);

        let invSlopeLeft: number = 0;
        let invSlopeRight: number = 0;

        if (middle.y - high.y != 0) {
            invSlopeLeft = (middle.x - high.x) / Math.abs(middle.y - high.y);
        }

        if (low.y - high.y != 0) {
            invSlopeRight = (low.x - high.x) / Math.abs(low.y - high.y);
        }

        if (middle.y - high.y != 0) {
            for (let y = high.y; y <= middle.y; y++) {
                let xStart: number = middle.x + (y - middle.y) * invSlopeLeft;
                let xEnd: number = high.x + (y - high.y) * invSlopeRight;

                if (xEnd < xStart)  {
                    let temp: number = xStart;
                    xStart = xEnd;
                    xEnd = temp;
                }

                for (let x = xStart; x < xEnd; x++) {
                    this.drawTexel(x, y, texture, pointA, pointB, pointC, high.u, high.v, middle.u, middle.v, low.u, low.v);
                    //this.drawPixel(x, y, "yellow");
                }
            }
        }

        invSlopeLeft = 0;
        invSlopeRight = 0;

        if (low.y - middle.y != 0) {
            invSlopeLeft = (low.x - middle.x) / Math.abs(low.y - middle.y);
        }

        if (low.y - high.y != 0) {
            invSlopeRight = (low.x - high.x) / Math.abs(low.y - high.y);
        }

        if (low.y - middle.y != 0) {
            for (let y = middle.y; y <= low.y; y++) {
                let xStart: number = middle.x + (y - middle.y) * invSlopeLeft;
                let xEnd: number = high.x + (y - high.y) * invSlopeRight;
    
                if (xEnd < xStart)  {
                    let temp: number = xStart;
                    xStart = xEnd;
                    xEnd = temp;
                }
    
                for (let x = xStart; x < xEnd; x++) {
                    this.drawTexel(x, y, texture, pointA, pointB, pointC, high.u, high.v, middle.u, middle.v, low.u, low.v);
                    //this.drawPixel(x, y, "yellow");
                }
            }
        }

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

    //       x0, y0 
    //   x1, y1   x2, y2
    private fillFlatBottomTriangle(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, color: string) {
        // const invSlopeLeft: number = (x1 - x0) / (y1 - y0);
        // const invSlopeRight: number = (x2 - x0) / (y2 - y0);

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

    //  x0, y0   x1, y1
    //      x2, y2
    private fillFlatTopTriangle(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, color: string) {
            //const invSlopeLeft: number = (x2 - x0) / (y2 - y0);
            //const invSlopeRight: number = (x2 - x1) / (y2 - y1);

            //const invSlopeLeft: number = (x1 - x2) / (y1 - y2);
            //const invSlopeRight: number = (x0 - x2) / (y0 - y2);
    
            const invSlopeLeft: number = (x0 - x2) / (y0 - y2);
            const invSlopeRight: number = (x1 - x2) / (y1 - y2);

            let xStart = x2;
            let xEnd = x2;
    
            for (let y = y2; y >= y0; y--) {
                this.drawLine(xStart, y, xEnd, y, color);
                xStart -= invSlopeLeft;
                xEnd -= invSlopeRight;
            }
    }

    private barycentricWeights(a: Vector2, b: Vector2, c: Vector2, p: Vector2) {
        const ac: Vector2 = Vector.subtractVec2(c, a);
        const ab: Vector2 = Vector.subtractVec2(b, a);
        const pc: Vector2 = Vector.subtractVec2(c, p);
        const pb: Vector2 = Vector.subtractVec2(b, p);
        const ap: Vector2 = Vector.subtractVec2(p, a);

        const areaParallelogramABC: number = ac.x * ab.y - ac.y * ab.x;
        const alpha: number = (pc.x * pb.y - pc.y * pb.x) / areaParallelogramABC;
        const beta: number = (ac.x * ap.y - ac.y * ap.x) / areaParallelogramABC;
        const gamma: number = 1.0 - alpha - beta;

        const weights: Vector3 = new Vector3(alpha, beta, gamma);

        return weights;

    }

    private drawTexel(
        x: number, y: number, texture: any, pointA: Vector4, pointB: Vector4, pointC: Vector4, 
        u0: number, v0: number, u1: number, v1: number, u2: number, v2: number
    ) {
        const pointPvec2: Vector2 = new Vector2(x, y);
        const pointAvec2: Vector2 = new Vector2(pointA.x, pointA.y);
        const pointBvec2: Vector2 = new Vector2(pointB.x, pointB.y);
        const pointCvec2: Vector2 = new Vector2(pointC.x, pointC.y);

        const weights: Vector3 = this.barycentricWeights(pointAvec2, pointBvec2, pointCvec2, pointPvec2);

        const alpha: number = weights.x;
        const beta: number = weights.y;
        const gamma: number = weights.z;
        //console.log(u0, v0, u1, v1, u2, v2);

        let interpolatedU: number = (u0 / pointA.w) * alpha + (u1 / pointB.w) * beta + (u2 / pointC.w) * gamma;
        let interpolatedV: number = (v0 / pointA.w) * alpha + (v1 / pointB.w) * beta + (v2 / pointC.w) * gamma;

        let interpolatedReciprocalW: number = (1 / pointA.w) * alpha + (1 / pointB.w) * beta + (1 / pointC.w) * gamma;

        interpolatedU /= interpolatedReciprocalW;
        interpolatedV /= interpolatedReciprocalW;

        const textureX: number = Math.abs(Math.floor(interpolatedU * texture.width)) % texture.width;
        const textureY: number = Math.abs(Math.floor(interpolatedV * texture.height)) % texture.height;

        interpolatedReciprocalW = 1.0 - interpolatedReciprocalW;

        if (interpolatedReciprocalW < this._zBuffer[window.innerWidth * Math.floor(y) + Math.floor(x)]) {
            this.drawPixel(x, y, texture.data[texture.width * textureY + textureX]);
            this._zBuffer[window.innerWidth * Math.floor(y) + Math.floor(x)] = interpolatedReciprocalW;
        }

    }

    private drawRectangle(x: number, y: number, width: number, height: number, color: string): void {
        if (x < 0 || y < 0 || x >= this._canvas.width || y >= this._canvas.height) return;

        this._colorBufferCtx.fillStyle = color;
        this._colorBufferCtx.fillRect(x, y, width, height);
    }

    private drawPixel(x: number, y: number, color: any): void {
        if (x < 0 || y < 0 || x >= this._canvas.width || y >= this._canvas.height) return;
        // 4개씩 묶어서 컬러값지정해야함, 하나씩 들어옴
        //console.log(color);
        if (!color) return;
        //const {r, g, b, a} = color;
        this._colorBufferCtx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
        this._colorBufferCtx.fillRect(x, y, 1, 1);
    }  

    private drawLine(x0: number, y0: number, x1: number, y1: number, color: string): void {
        this._colorBufferCtx.beginPath();
        this._colorBufferCtx.moveTo(x0, y0);
        this._colorBufferCtx.lineTo(x1, y1);
        this._colorBufferCtx.closePath();
        this._colorBufferCtx.strokeStyle = color;
        this._colorBufferCtx.stroke();
    }
  }