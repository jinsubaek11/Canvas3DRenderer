

interface Elements {
    [key: string]: HTMLElement | null;
}

interface RenderingStates {
    [key: string]: boolean;
}

const WIRE_FRAME_LINES: string = "wireFrameLines";
const FILLED_TRIANGLES: string = "filledTriangles";
const POINTS: string = "points";
const BACKFACE_CULLING: string = "backfaceCulling";

export default class Controller {
    private static _instance: Controller;
    private _elements: Elements = {};
    private _renderingStates: RenderingStates = {};

    private constructor() {
        this._elements[WIRE_FRAME_LINES] = document.getElementById(WIRE_FRAME_LINES);
        this._elements[FILLED_TRIANGLES] = document.getElementById(FILLED_TRIANGLES);
        this._elements[POINTS] = document.getElementById(POINTS);
        this._elements[BACKFACE_CULLING] = document.getElementById(BACKFACE_CULLING);

        this._renderingStates[WIRE_FRAME_LINES] = true;
        this._renderingStates[FILLED_TRIANGLES] = false;
        this._renderingStates[POINTS] = false;
        this._renderingStates[BACKFACE_CULLING] = false;
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