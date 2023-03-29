import Canvas from "./canvas"
import { Vector3 } from "../math/vector"
import { degreeToRadian, radianToDegree } from "../math/util"; 
import { RenderingStates } from "../ui/controller"
import Camera from "./camera";
import Object from "./object";
import { Light, Lights } from "./lights";


export default class Renderer {
    private static _instance: Renderer;
    private _objects: Object[] = [];
    private _elapsedTime: number = 0;

    private constructor() {
        
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
                const shark = new Object("./assets/shark.obj", "./assets/shark.png", new Vector3(0, 0, 0), new Vector3(0, 3.14 / 2, 0));
                const cow = new Object("./assets/cow.obj", "", new Vector3(0, 1, 0), new Vector3(0, 0, 0), new Vector3(0.003, 0.003, 0.003));
                //const shark2 = new Object("./assets/shark.obj", "./assets/shark.png", new Vector3(0, 2, 0), new Vector3(0, 3.14 / 2, 0))

                this._objects.push(shark);
                this._objects.push(cow);
                //this._objects.push(shark2);
                
                const aspectX: number = Canvas.canvasView.width / Canvas.canvasView.height;
                const aspectY: number = Canvas.canvasView.height / Canvas.canvasView.width;
                const fovY: number = 60;
                const fovX: number = radianToDegree(Math.atan(Math.tan(degreeToRadian(fovY) / 2) * aspectX)) * 2;
                const near: number = 0.1;
                const far: number = 200;
                
                Camera.addCamera(new Vector3(0, 0, -10), fovX, fovY, aspectY, near, far);

                Lights.addLight(new Light(new Vector3(5, 5, 0)));
                Lights.addLight(new Light(new Vector3(-5, 5, 0)));
            }
            return true;
          } else {
                throw Error("Canvas is Not Available");
          }
    }
  
    public update(renderingStates: RenderingStates, deltaTime: number): void {
        this._elapsedTime += deltaTime;
        //this._objects[0].rotation = new Vector3(0, this._elapsedTime * 0.1, 0);
        //this._objects[1].rotation = new Vector3(0, -this._elapsedTime * 0.2, 0);

        this._objects.forEach((object: Object) => object.update(renderingStates, deltaTime));
    }

    public render(renderingStates: RenderingStates): void {
        if (!Canvas.canvasColorBufferCtx || !Canvas.canvasViewCtx) return;

        Canvas.canvasColorBufferCtx.fillStyle = "black";
        Canvas.canvasColorBufferCtx.fillRect(0, 0, Canvas.canvasView.width, Canvas.canvasView.height);
        Canvas.clearZbuffer();

        this._objects.forEach((object: Object) => object.render(renderingStates));

        Canvas.canvasViewCtx.drawImage(Canvas.canvasColorBufferCtx.canvas, 0, 0);

        // if (!this._colorBufferCtx || !this._canvas || !this._ctx) return;

        // this._colorBufferCtx.fillStyle = "black";
        // this._colorBufferCtx.fillRect(0, 0, this._canvas.width, this._canvas.height);
        // this._zBuffer = Canvas.clearZbuffer();

        // for (let i = 0; i < this._triangledToRender.length; i++) {
        //     const triangle: Triangle = this._triangledToRender[i];

        //     if (renderingStates[WIRE_FRAME_LINES]) {
        //         this.drawTriangle(
        //             triangle.points[0].x, triangle.points[0].y,
        //             triangle.points[1].x, triangle.points[1].y,
        //             triangle.points[2].x, triangle.points[2].y, "green"
        //         );
        //     }
    
        //     if (renderingStates[FILLED_TRIANGLES]) {
        //         this.drawFilledTriangle(
        //             triangle.points[0].x, triangle.points[0].y,
        //             triangle.points[1].x, triangle.points[1].y,
        //             triangle.points[2].x, triangle.points[2].y, "grey"
        //         );
        //     }

        //     if (renderingStates[TEXTURED]) {
        //         this.drawTexturedTriangle(
        //             triangle.points[0].x, triangle.points[0].y, triangle.points[0].z, triangle.points[0].w, triangle.texCoords[0].u, triangle.texCoords[0].v,
        //             triangle.points[1].x, triangle.points[1].y, triangle.points[1].z, triangle.points[1].w, triangle.texCoords[1].u, triangle.texCoords[1].v,
        //             triangle.points[2].x, triangle.points[2].y, triangle.points[2].z, triangle.points[2].w, triangle.texCoords[2].u, triangle.texCoords[2].v,
        //             this._texture
        //         );
        //     }

        //     if (renderingStates[POINTS]) {
        //         this.drawRectangle(triangle.points[0].x, triangle.points[0].y, 3, 3 , "red");
        //         this.drawRectangle(triangle.points[1].x, triangle.points[1].y, 3, 3 , "red");
        //         this.drawRectangle(triangle.points[2].x, triangle.points[2].y, 3, 3 , "red");
        //     }

        //     this._ctx.drawImage(this._colorBufferCtx.canvas, 0, 0);
        // }
    }

    // private drawTriangle(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, color: string): void {
    //     if (!this._colorBufferCtx) return;

    //     this._colorBufferCtx.beginPath();
    //     this._colorBufferCtx.moveTo(x0, y0);
    //     this._colorBufferCtx.lineTo(x1, y1);
    //     this._colorBufferCtx.lineTo(x2, y2);
    //     this._colorBufferCtx.closePath();
    //     this._colorBufferCtx.strokeStyle = color;
    //     this._colorBufferCtx.stroke();
    // }

    // private drawTexturedTriangle(
    //     x0: number, y0: number, z0: number, w0: number, u0: number, v0: number,
    //     x1: number, y1: number, z1: number, w1: number, u1: number, v1: number,
    //     x2: number, y2: number, z2: number, w2: number, u2: number, v2: number, texture: any) {
        
    //     const high = { x: x0, y: y0, z: z0, w: w0, u: u0, v: v0 };
    //     const middle = { x: x1, y: y1, z: z1, w: w1, u: u1, v: v1 };
    //     const low = { x: x2, y: y2, z: z2, w: w2, u: u2, v: v2 };   

    //     if (high.y > middle.y) {
    //         const tempX = high.x;
    //         const tempY = high.y;
    //         const tempZ = high.z;
    //         const tempW = high.w;
    //         const tempU = high.u;
    //         const tempV = high.v;
    //         high.x = middle.x;
    //         high.y = middle.y;
    //         high.z = middle.z;
    //         high.w = middle.w;
    //         high.u = middle.u;
    //         high.v = middle.v;
    //         middle.x = tempX;
    //         middle.y = tempY;
    //         middle.z = tempZ;
    //         middle.w = tempW;
    //         middle.u = tempU;
    //         middle.v = tempV;
    //     }
    
    //     if (middle.y > low.y) {
    //         const tempX = low.x;
    //         const tempY = low.y;
    //         const tempZ = low.z;
    //         const tempW = low.w;
    //         const tempU = low.u;
    //         const tempV = low.v;
    //         low.x = middle.x;
    //         low.y = middle.y;
    //         low.z = middle.z;
    //         low.w = middle.w;
    //         low.u = middle.u;
    //         low.v = middle.v;
    //         middle.x = tempX;
    //         middle.y = tempY;
    //         middle.z = tempZ;
    //         middle.w = tempW;
    //         middle.u = tempU;
    //         middle.v = tempV;
    //     }
    
    //     if (high.y > middle.y) {
    //         const tempX = high.x;
    //         const tempY = high.y;
    //         const tempZ = high.z;
    //         const tempW = high.w;
    //         const tempU = high.u;
    //         const tempV = high.v;
    //         high.x = middle.x;
    //         high.y = middle.y;
    //         high.z = middle.z;
    //         high.w = middle.w;
    //         high.u = middle.u;
    //         high.v = middle.v;
    //         middle.x = tempX;
    //         middle.y = tempY;
    //         middle.z = tempZ;
    //         middle.w = tempW;
    //         middle.u = tempU;
    //         middle.v = tempV;
    //     }
        
    //     high.v = 1.0 - high.v;
    //     middle.v = 1.0 - middle.v;
    //     low.v = 1.0 - low.v;

    //     const pointA: Vector4 = new Vector4(high.x, high.y, high.z, high.w);
    //     const pointB: Vector4 = new Vector4(middle.x, middle.y, middle.z, middle.w);
    //     const pointC: Vector4 = new Vector4(low.x, low.y, low.z, low.w);

    //     let invSlopeLeft: number = 0;
    //     let invSlopeRight: number = 0;

    //     if (middle.y - high.y != 0) {
    //         invSlopeLeft = (middle.x - high.x) / Math.abs(middle.y - high.y);
    //     }

    //     if (low.y - high.y != 0) {
    //         invSlopeRight = (low.x - high.x) / Math.abs(low.y - high.y);
    //     }

    //     if (middle.y - high.y != 0) {
    //         for (let y = high.y; y <= middle.y; y++) {
    //             let xStart: number = middle.x + (y - middle.y) * invSlopeLeft;
    //             let xEnd: number = high.x + (y - high.y) * invSlopeRight;

    //             if (xEnd < xStart)  {
    //                 let temp: number = xStart;
    //                 xStart = xEnd;
    //                 xEnd = temp;
    //             }

    //             for (let x = xStart; x < xEnd; x++) {
    //                 this.drawTexel(x, y, texture, pointA, pointB, pointC, high.u, high.v, middle.u, middle.v, low.u, low.v);
    //                 //this.drawPixel(x, y, "yellow");
    //             }
    //         }
    //     }

    //     invSlopeLeft = 0;
    //     invSlopeRight = 0;

    //     if (low.y - middle.y != 0) {
    //         invSlopeLeft = (low.x - middle.x) / Math.abs(low.y - middle.y);
    //     }

    //     if (low.y - high.y != 0) {
    //         invSlopeRight = (low.x - high.x) / Math.abs(low.y - high.y);
    //     }

    //     if (low.y - middle.y != 0) {
    //         for (let y = middle.y; y <= low.y; y++) {
    //             let xStart: number = middle.x + (y - middle.y) * invSlopeLeft;
    //             let xEnd: number = high.x + (y - high.y) * invSlopeRight;
    
    //             if (xEnd < xStart)  {
    //                 let temp: number = xStart;
    //                 xStart = xEnd;
    //                 xEnd = temp;
    //             }
    
    //             for (let x = xStart; x < xEnd; x++) {
    //                 this.drawTexel(x, y, texture, pointA, pointB, pointC, high.u, high.v, middle.u, middle.v, low.u, low.v);
    //                 //this.drawPixel(x, y, "yellow");
    //             }
    //         }
    //     }

    // }

    // private drawFilledTriangle(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, color: string): void {
    //     // screen Y order: high < middle < low
    //     const high = { x: x0, y: y0 } as Vector2;
    //     const middle = { x: x1, y: y1 } as Vector2;
    //     const low = { x: x2, y: y2 } as Vector2;
    
    //     if (high.y > middle.y) {
    //         const tempX = high.x;
    //         const tempY = high.y;
    //         high.x = middle.x;
    //         high.y = middle.y;
    //         middle.x = tempX;
    //         middle.y = tempY;
    //     }

    //     if (middle.y > low.y) {
    //         const tempX = low.x;
    //         const tempY = low.y;
    //         low.x = middle.x;
    //         low.y = middle.y;
    //         middle.x = tempX;
    //         middle.y = tempY;
    //     }

    //     if (high.y > middle.y) {
    //         const tempX = high.x;
    //         const tempY = high.y;
    //         high.x = middle.x;
    //         high.y = middle.y;
    //         middle.x = tempX;
    //         middle.y = tempY;
    //     }

    //     if (middle.y == low.y) {
    //         this.fillFlatBottomTriangle(x0, y0, x1, y1, x2, y2, color);
    //     } else if (high.y == middle.y) {
    //         this.fillFlatTopTriangle(x0, y0, x1, y1, x2, y2, color);
    //     } else {
    //         const mx: number = ((low.x - high.x) * (middle.y - high.y) / (low.y - high.y)) + high.x;
    //         const my: number = middle.y;
    
    //         this.fillFlatBottomTriangle(high.x, high.y, middle.x, middle.y, mx, my, color);
    //         this.fillFlatTopTriangle(middle.x, middle.y, mx, my, low.x, low.y, color);
    //     }
    // }

    // //       x0, y0 
    // //   x1, y1   x2, y2
    // private fillFlatBottomTriangle(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, color: string) {
    //     // const invSlopeLeft: number = (x1 - x0) / (y1 - y0);
    //     // const invSlopeRight: number = (x2 - x0) / (y2 - y0);

    //     const invSlopeLeft: number = (x1 - x0) / (y1 - y0);
    //     const invSlopeRight: number = (x2 - x0) / (y2 - y0);

    //     let xStart: number = x0;
    //     let xEnd: number = x0;

    //     for (let y = y0; y <= y2; y++) {
    //         this.drawLine(xStart, y, xEnd, y, color);
    //         xStart += invSlopeLeft;
    //         xEnd += invSlopeRight;
    //     }
    // }

    // //  x0, y0   x1, y1
    // //      x2, y2
    // private fillFlatTopTriangle(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, color: string) {
    //         //const invSlopeLeft: number = (x2 - x0) / (y2 - y0);
    //         //const invSlopeRight: number = (x2 - x1) / (y2 - y1);

    //         //const invSlopeLeft: number = (x1 - x2) / (y1 - y2);
    //         //const invSlopeRight: number = (x0 - x2) / (y0 - y2);
    
    //         const invSlopeLeft: number = (x0 - x2) / (y0 - y2);
    //         const invSlopeRight: number = (x1 - x2) / (y1 - y2);

    //         let xStart = x2;
    //         let xEnd = x2;
    
    //         for (let y = y2; y >= y0; y--) {
    //             this.drawLine(xStart, y, xEnd, y, color);
    //             xStart -= invSlopeLeft;
    //             xEnd -= invSlopeRight;
    //         }
    // }

    // private barycentricWeights(a: Vector2, b: Vector2, c: Vector2, p: Vector2) {
    //     const ac: Vector2 = Vector.subtractVec2(c, a);
    //     const ab: Vector2 = Vector.subtractVec2(b, a);
    //     const pc: Vector2 = Vector.subtractVec2(c, p);
    //     const pb: Vector2 = Vector.subtractVec2(b, p);
    //     const ap: Vector2 = Vector.subtractVec2(p, a);

    //     const areaParallelogramABC: number = ac.x * ab.y - ac.y * ab.x;
    //     const alpha: number = (pc.x * pb.y - pc.y * pb.x) / areaParallelogramABC;
    //     const beta: number = (ac.x * ap.y - ac.y * ap.x) / areaParallelogramABC;
    //     const gamma: number = 1.0 - alpha - beta;

    //     const weights: Vector3 = new Vector3(alpha, beta, gamma);

    //     return weights;

    // }

    // private drawTexel(
    //     x: number, y: number, texture: any, pointA: Vector4, pointB: Vector4, pointC: Vector4, 
    //     u0: number, v0: number, u1: number, v1: number, u2: number, v2: number
    // ) {
    //     const pointPvec2: Vector2 = new Vector2(x, y);
    //     const pointAvec2: Vector2 = new Vector2(pointA.x, pointA.y);
    //     const pointBvec2: Vector2 = new Vector2(pointB.x, pointB.y);
    //     const pointCvec2: Vector2 = new Vector2(pointC.x, pointC.y);

    //     const weights: Vector3 = this.barycentricWeights(pointAvec2, pointBvec2, pointCvec2, pointPvec2);

    //     const alpha: number = weights.x;
    //     const beta: number = weights.y;
    //     const gamma: number = weights.z;
    //     //console.log(u0, v0, u1, v1, u2, v2);

    //     let interpolatedU: number = (u0 / pointA.w) * alpha + (u1 / pointB.w) * beta + (u2 / pointC.w) * gamma;
    //     let interpolatedV: number = (v0 / pointA.w) * alpha + (v1 / pointB.w) * beta + (v2 / pointC.w) * gamma;

    //     let interpolatedReciprocalW: number = (1 / pointA.w) * alpha + (1 / pointB.w) * beta + (1 / pointC.w) * gamma;

    //     interpolatedU /= interpolatedReciprocalW;
    //     interpolatedV /= interpolatedReciprocalW;

    //     const textureX: number = Math.abs(Math.floor(interpolatedU * texture.width)) % texture.width;
    //     const textureY: number = Math.abs(Math.floor(interpolatedV * texture.height)) % texture.height;

    //     interpolatedReciprocalW = 1.0 - interpolatedReciprocalW;

    //     if (interpolatedReciprocalW < this._zBuffer[window.innerWidth * Math.floor(y) + Math.floor(x)]) {
    //         this.drawPixel(x, y, texture.data[texture.width * textureY + textureX]);
    //         this._zBuffer[window.innerWidth * Math.floor(y) + Math.floor(x)] = interpolatedReciprocalW;
    //     }

    // }

    // private drawRectangle(x: number, y: number, width: number, height: number, color: string): void {
    //     if (!this._colorBufferCtx || !this._canvas) return;
    //     if (x < 0 || y < 0 || x >= this._canvas.width || y >= this._canvas.height) return;

    //     this._colorBufferCtx.fillStyle = color;
    //     this._colorBufferCtx.fillRect(x, y, width, height);
    // }

    // private drawPixel(x: number, y: number, color: any): void {
    //     if (!this._colorBufferCtx || !this._canvas || !color) return;
    //     if (x < 0 || y < 0 || x >= this._canvas.width || y >= this._canvas.height) return;

    //     this._colorBufferCtx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
    //     this._colorBufferCtx.fillRect(x, y, 1, 1);
    // }  

    // private drawLine(x0: number, y0: number, x1: number, y1: number, color: string): void {
    //     if (!this._colorBufferCtx) return;

    //     this._colorBufferCtx.beginPath();
    //     this._colorBufferCtx.moveTo(x0, y0);
    //     this._colorBufferCtx.lineTo(x1, y1);
    //     this._colorBufferCtx.closePath();
    //     this._colorBufferCtx.strokeStyle = color;
    //     this._colorBufferCtx.stroke();
    // }
  }