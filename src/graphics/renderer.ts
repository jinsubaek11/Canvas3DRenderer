import Canvas from "./canvas"
import { Vector3 } from "../math/vector"
import { degreeToRadian, radianToDegree } from "../math/util"; 
import { Controller, RenderingStates } from "../ui/controller"
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
                const shark = new Object("./assets/shark.obj", "./assets/shark.png", new Vector3(0, 0, 0), new Vector3(0, Math.PI * 0.5, 0));
                const cow = new Object("./assets/cow.obj", "", new Vector3(-0.5, 1.5, 0), new Vector3(0, 0, 0), new Vector3(0.002, 0.002, 0.002));
                const cat = new Object("./assets/cat.obj", "", new Vector3(2, -2.5, 0), new Vector3(0, Math.PI * 0.5, 0), new Vector3(0.05, 0.05, 0.05))
                const chicken = new Object("./assets/chicken.obj", "", new Vector3(-3, -2.5, 0), new Vector3(0, Math.PI * 0.5, 0), new Vector3(0.03, 0.03, 0.03))

                this._objects.push(shark);
                this._objects.push(cow);
                this._objects.push(cat);
                this._objects.push(chicken);
                
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
        this._elapsedTime = this._elapsedTime + deltaTime;
        
        this._objects[0].rotation = new Vector3(0, this._elapsedTime * 0.2, 0);
        this._objects[1].rotation = new Vector3(0, -this._elapsedTime * 0.2, 0);
        this._objects[2].rotation = new Vector3(0, this._elapsedTime * 0.2, 0);
        this._objects[3].rotation = new Vector3(0, -this._elapsedTime * 0.2, 0);

        const controller: Controller = Controller.getInstance();
        Camera.getCameras()[0].update(controller.movementStates, controller.mouseStates, deltaTime);
        controller.mouseStates.dx = 0;
        controller.mouseStates.dy = 0;    

        this._objects.forEach((object: Object) => object.update(renderingStates));
    }

    public render(renderingStates: RenderingStates): void {
        if (!Canvas.canvasColorBufferCtx || !Canvas.canvasViewCtx) return;

        Canvas.canvasColorBufferCtx.fillStyle = "black";
        Canvas.canvasColorBufferCtx.fillRect(0, 0, Canvas.canvasView.width, Canvas.canvasView.height);
        Canvas.clearZbuffer();

        this._objects.forEach((object: Object) => object.render(renderingStates));

        Canvas.canvasViewCtx.drawImage(Canvas.canvasColorBufferCtx.canvas, 0, 0);
    }
  }