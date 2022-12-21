

interface Elements {
    [key: string]: HTMLElement | null;
}

export interface RenderingStates {
    [key: string]: boolean;
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

    private constructor() {
        this._elements[WIRE_FRAME_LINES] = document.getElementById(WIRE_FRAME_LINES);
        this._elements[FILLED_TRIANGLES] = document.getElementById(FILLED_TRIANGLES);
        this._elements[TEXTURED] = document.getElementById(TEXTURED);
        this._elements[POINTS] = document.getElementById(POINTS);
        this._elements[BACKFACE_CULLING] = document.getElementById(BACKFACE_CULLING);

        this._renderingStates[WIRE_FRAME_LINES] = true;
        this._renderingStates[FILLED_TRIANGLES] = false;
        this._renderingStates[TEXTURED] = true;
        this._renderingStates[POINTS] = true;
        this._renderingStates[BACKFACE_CULLING] = true;
    }

    public bindEvents(): void {
        for (const key in this._elements) {
            this._elements[key]?.addEventListener("change", () => {
                this._renderingStates[key] = !this._renderingStates[key];
            })
        }
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
}