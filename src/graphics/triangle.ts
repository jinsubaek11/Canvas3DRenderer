import { Vector2 } from "../math/vector";

export interface Face {
    a: number;
    b: number;
    c: number;
}

// export class Face {
//     private _a: number;
//     private _b: number;
//     private _c: number;

//     public constructor(a: number = 0, b: number = 0, c: number = 0) {
//         this._a = a;
//         this._b = b;
//         this._c = c;
//     }

//     public get a(): number {
//         return this._a;
//     }

//     public get b(): number {
//         return this._b;
//     }

//     public get c(): number {
//         return this._c;
//     }
// }
 
export interface Triangle {
    points: Vector2[];
}