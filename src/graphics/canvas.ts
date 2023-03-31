import { barycentricWeights } from "../math/util";
import { Vector2, Vector3, Vector4 } from "../math/vector";
import { Texture } from "./texture";


export default class Canvas {
    private static _canvasView: HTMLCanvasElement;
    private static _canvasViewCtx: CanvasRenderingContext2D | null;
    private static _canvasColorBuffer: HTMLCanvasElement;
    private static _canvasColorBufferCtx: CanvasRenderingContext2D | null;
    private static _zBuffer: number[];

    public static init(): boolean {
        this._canvasView = document.getElementById("canvas") as HTMLCanvasElement;   
        this._canvasViewCtx = this._canvasView.getContext("2d");
        this._canvasColorBuffer = document.createElement("canvas");   
        this._canvasColorBufferCtx = this._canvasColorBuffer.getContext("2d");
        this._zBuffer = Array(window.innerWidth * window.innerHeight).fill(1);

        if (this._canvasViewCtx && this._canvasColorBufferCtx) {
            this.resize();
            this.bindEvents();
            return true;
        }

        return false;
    }

    public static resize(): void {
        this._canvasView.width = window.innerWidth;
        this._canvasView.height = window.innerHeight;
        this._canvasColorBuffer.width = window.innerWidth;
        this._canvasColorBuffer.height = window.innerHeight;
        this._zBuffer = new Array(window.innerWidth * window.innerHeight).fill(1);

    }

    private static bindEvents(): void {
        window.addEventListener("resize", () => this.resize());
    }

    public static clearZbuffer(): void {
        this._zBuffer = new Array(window.innerWidth * window.innerHeight).fill(1);
    }

    public static drawTriangle(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, color: string): void {
        if (!Canvas._canvasColorBufferCtx) return;

        Canvas._canvasColorBufferCtx.beginPath();
        Canvas._canvasColorBufferCtx.moveTo(x0, y0);
        Canvas._canvasColorBufferCtx.lineTo(x1, y1);
        Canvas._canvasColorBufferCtx.lineTo(x2, y2);
        Canvas._canvasColorBufferCtx.closePath();
        Canvas._canvasColorBufferCtx.strokeStyle = color;
        Canvas._canvasColorBufferCtx.stroke();
    }

    public static drawTexturedTriangle(
        x0: number, y0: number, z0: number, w0: number, u0: number, v0: number,
        x1: number, y1: number, z1: number, w1: number, u1: number, v1: number,
        x2: number, y2: number, z2: number, w2: number, u2: number, v2: number, texture: Texture): void {
        
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
                    Canvas.drawTexel(x, y, texture, pointA, pointB, pointC, high.u, high.v, middle.u, middle.v, low.u, low.v);
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

    public static drawFilledTriangle(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, color: string): void {
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
            Canvas.fillFlatBottomTriangle(x0, y0, x1, y1, x2, y2, color);
        } else if (high.y == middle.y) {
            Canvas.fillFlatTopTriangle(x0, y0, x1, y1, x2, y2, color);
        } else {
            const mx: number = ((low.x - high.x) * (middle.y - high.y) / (low.y - high.y)) + high.x;
            const my: number = middle.y;
    
            Canvas.fillFlatBottomTriangle(high.x, high.y, middle.x, middle.y, mx, my, color);
            Canvas.fillFlatTopTriangle(middle.x, middle.y, mx, my, low.x, low.y, color);
        }
    }

    //       x0, y0 
    //   x1, y1   x2, y2
    private static fillFlatBottomTriangle(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, color: string) {
        // const invSlopeLeft: number = (x1 - x0) / (y1 - y0);
        // const invSlopeRight: number = (x2 - x0) / (y2 - y0);

        const invSlopeLeft: number = (x1 - x0) / (y1 - y0);
        const invSlopeRight: number = (x2 - x0) / (y2 - y0);

        let xStart: number = x0;
        let xEnd: number = x0;

        for (let y = y0; y <= y2; y++) {
            Canvas.drawLine(xStart, y, xEnd, y, color);
            xStart += invSlopeLeft;
            xEnd += invSlopeRight;
        }
    }

    //  x0, y0   x1, y1
    //      x2, y2
    private static fillFlatTopTriangle(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, color: string) {
            //const invSlopeLeft: number = (x2 - x0) / (y2 - y0);
            //const invSlopeRight: number = (x2 - x1) / (y2 - y1);

            //const invSlopeLeft: number = (x1 - x2) / (y1 - y2);
            //const invSlopeRight: number = (x0 - x2) / (y0 - y2);
    
            const invSlopeLeft: number = (x0 - x2) / (y0 - y2);
            const invSlopeRight: number = (x1 - x2) / (y1 - y2);

            let xStart = x2;
            let xEnd = x2;
    
            for (let y = y2; y >= y0; y--) {
                Canvas.drawLine(xStart, y, xEnd, y, color);
                xStart -= invSlopeLeft;
                xEnd -= invSlopeRight;
            }
    }

    private static drawTexel(
        x: number, y: number, texture: Texture, pointA: Vector4, pointB: Vector4, pointC: Vector4, 
        u0: number, v0: number, u1: number, v1: number, u2: number, v2: number
    ) {
        const pointPvec2: Vector2 = new Vector2(x, y);
        const pointAvec2: Vector2 = new Vector2(pointA.x, pointA.y);
        const pointBvec2: Vector2 = new Vector2(pointB.x, pointB.y);
        const pointCvec2: Vector2 = new Vector2(pointC.x, pointC.y);

        const weights: Vector3 = barycentricWeights(pointAvec2, pointBvec2, pointCvec2, pointPvec2);

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

        if (interpolatedReciprocalW < Canvas._zBuffer[window.innerWidth * Math.floor(y) + Math.floor(x)]) {
            Canvas.drawPixel(x, y, texture.data[texture.width * textureY + textureX]);
            Canvas._zBuffer[window.innerWidth * Math.floor(y) + Math.floor(x)] = interpolatedReciprocalW;
        }

    }

    public static drawRectangle(x: number, y: number, width: number, height: number, color: string): void {
        if (!Canvas._canvasColorBufferCtx || !Canvas._canvasView) return;
        if (x < 0 || y < 0 || x >= Canvas._canvasView.width || y >= Canvas._canvasView.height) return;

        Canvas._canvasColorBufferCtx.fillStyle = color;
        Canvas._canvasColorBufferCtx.fillRect(x, y, width, height);
    }

    private static drawPixel(x: number, y: number, color: any): void {
        if (!Canvas._canvasColorBufferCtx || !Canvas.canvasView || !color) return;
        if (x < 0 || y < 0 || x >= Canvas.canvasView.width || y >= Canvas.canvasView.height) return;

        Canvas._canvasColorBufferCtx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
        Canvas._canvasColorBufferCtx.fillRect(x, y, 1, 1);
    }  

    private static drawLine(x0: number, y0: number, x1: number, y1: number, color: string): void {
        if (!Canvas._canvasColorBufferCtx) return;

        Canvas._canvasColorBufferCtx.beginPath();
        Canvas._canvasColorBufferCtx.moveTo(x0, y0);
        Canvas._canvasColorBufferCtx.lineTo(x1, y1);
        Canvas._canvasColorBufferCtx.closePath();
        Canvas._canvasColorBufferCtx.strokeStyle = color;
        Canvas._canvasColorBufferCtx.stroke();
    }

    public static get canvasView(): HTMLCanvasElement {
        return this._canvasView;
    }

    public static get canvasViewCtx(): CanvasRenderingContext2D | null {
        return this._canvasViewCtx;
    }

    public static get canvasColorBuffer(): HTMLCanvasElement {
        return this._canvasColorBuffer;
    }

    public static get canvasColorBufferCtx(): CanvasRenderingContext2D | null {
        return this._canvasColorBufferCtx;
    }

    public static get zBuffer(): number[] {
        return this._zBuffer;
    }
}