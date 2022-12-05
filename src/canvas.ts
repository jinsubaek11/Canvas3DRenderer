

export default class Canvas {
    private static elem: HTMLCanvasElement;
    private static ctx: CanvasRenderingContext2D | null;

    public static init(): boolean {
        Canvas.elem = document.getElementById("canvas") as HTMLCanvasElement;   
        Canvas.ctx = this.element.getContext("2d");

        if (this.ctx) {
            this.resize();
            this.bindEvents();
            return true;
        }

        return false;
    }

    public static resize(): void {
        Canvas.elem.width = window.innerWidth;
        Canvas.elem.height = window.innerHeight;
    }

    private static bindEvents(): void {
        window.addEventListener("resize", Canvas.resize);
    }

    public static get element(): HTMLCanvasElement {
        return this.elem;
    }

    public static get context(): CanvasRenderingContext2D | null {
        return this.ctx;
    }
}