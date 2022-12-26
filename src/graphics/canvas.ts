

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

    public static clearZbuffer(): number[] {
        this._zBuffer = new Array(window.innerWidth * window.innerHeight).fill(1);

        return this._zBuffer;
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