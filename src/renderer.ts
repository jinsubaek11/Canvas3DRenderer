import Canvas from "./canvas"

export default class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

    constructor() {

    }

    public init(): boolean {
     if (Canvas.init()) {
         if (Canvas.context != null)
         {
             this.canvas = Canvas.element;
             this.ctx = Canvas.context;
         }
         return true;
       } else {
             throw Error("Canvas is Not Available");
       }
    }

    public setup(): void {

    }
  
    public update(): void {
      //console.log("update");
    }

    public render(): void {
        this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);

      //this.ctx.fillRect(200,200,10,10);
      //this.ctx.fillStyle = 'rgba(255, 0, 0, 255)';
        this.drawGrid();
        this.drawRectangle(100, 100, 30, 30, 'rgba(255, 0, 0, 255)');
        this.drawRectangle(140, 130, 30, 30, 'rgba(0, 255, 0, 255)');
        this.drawRectangle(170, 170, 30, 30, 'rgba(0, 0, 255, 255)');
        this.drawRectangle(200, 110, 30, 30, 'rgba(0, 0, 0, 255)');
     // console.log("render");
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

    private drawRectangle(x: number, y: number, width: number, height: number, color: string): void {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }
  
  }