import { before } from "node:test";


interface Elements {
    [key: string]: HTMLElement | null;
}

export interface RenderingStates {
    [key: string]: boolean;
}

enum Movement {
    FORWARD = 'w',
    BACKWARD = 's',
    LEFT = 'a',
    RIGHT = 'd',
    UP = 'e',
    DOWN = 'q',
}

export interface MovementStates {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
}

export interface MouseStates {
    dx: number;
    dy: number;
}

export const WIRE_FRAME_LINES: string = "wireFrameLines";
export const FILLED_TRIANGLES: string = "filledTriangles";
export const POINTS: string = "points";
export const BACKFACE_CULLING: string = "backfaceCulling";
export const TEXTURED: string = "textured";

export class Controller {
    private static _instance: Controller;
    private _elements: Elements = {};
    private _renderingStates: RenderingStates = {};
    private _movementStates: MovementStates = {};
    private _mouseStates: MouseStates = {};
    private _isFirstMove = true;
    private _beforeX = 0;
    private _beforeY = 0;

    private constructor() {
        this._elements[WIRE_FRAME_LINES] = document.getElementById(WIRE_FRAME_LINES);
        this._elements[FILLED_TRIANGLES] = document.getElementById(FILLED_TRIANGLES);
        this._elements[TEXTURED] = document.getElementById(TEXTURED);
        this._elements[POINTS] = document.getElementById(POINTS);
        this._elements[BACKFACE_CULLING] = document.getElementById(BACKFACE_CULLING);

        this._renderingStates[WIRE_FRAME_LINES] = true;
        this._renderingStates[FILLED_TRIANGLES] = false;
        this._renderingStates[TEXTURED] = false;
        this._renderingStates[POINTS] = false;
        this._renderingStates[BACKFACE_CULLING] = true;

        this._movementStates.forward = false;
        this._movementStates.backward = false;
        this._movementStates.right = false;
        this._movementStates.left = false;
        this._movementStates.up = false;
        this._movementStates.down = false;

        this._mouseStates.dx = 0;
        this._mouseStates.dy = 0;
    }

    public bindEvents(): void {
        for (const key in this._elements) {
            this._elements[key]?.addEventListener("change", () => {
                this._renderingStates[key] = !this._renderingStates[key];
            })
        }

        window.addEventListener("keypress", (event:KeyboardEvent) => {
            switch (event.key) {
                case Movement.LEFT:
                    this._movementStates.left = true;
                    break;
                case Movement.RIGHT:
                    this._movementStates.right = true;
                    break;
                case Movement.FORWARD:
                    this._movementStates.forward = true;
                    break;
                case Movement.BACKWARD:
                    this._movementStates.backward = true;
                    break;
                case Movement.UP:
                    this._movementStates.up = true;
                    break;
                case Movement.DOWN:
                    this._movementStates.down = true;
                    break;
                default:
                    break;
            }
        })

        window.addEventListener("keyup", (event:KeyboardEvent) => {
            switch (event.key) {
                case Movement.LEFT:
                    this._movementStates.left = false;
                    break;
                case Movement.RIGHT:
                    this._movementStates.right = false;
                    break;
                case Movement.FORWARD:
                    this._movementStates.forward = false;
                    break;
                case Movement.BACKWARD:
                    this._movementStates.backward = false;
                    break;
                case Movement.UP:
                    this._movementStates.up = false;
                    break;
                case Movement.DOWN:
                    this._movementStates.down = false;
                    break;
                default:
                    break;
            }
        })

        window.addEventListener('mousemove', (event: MouseEvent) => {
            if (this._isFirstMove) {
                this._beforeX = event.clientX;
                this._beforeY = event.clientY;
                this._isFirstMove = false;
                return;
            }
            const deltaX: number = event.clientX - this._beforeX;
            const deltaY: number = this._beforeY - event.clientY;

            this._beforeX = event.clientX;
            this._beforeY = event.clientY;

            this.mouseStates.dx = deltaX;
            this.mouseStates.dy = deltaY;

            //console.log(this._mouseStates.yaw, this._mouseStates.pitch);
        })
    }

    public static getInstance(): Controller {
        if (!this._instance) {
            this._instance = new Controller();
        }

        return this._instance;
    }

    public get renderingStates(): RenderingStates {
        return this._renderingStates;
    }

    public get movementStates(): MovementStates {
        return this._movementStates;
    }

    public get mouseStates(): MouseStates {
        return this._mouseStates;
    }
}