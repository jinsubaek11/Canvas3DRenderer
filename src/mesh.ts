import { Vector, Vector3 } from "./math/vector"
import { Face } from "./triangle";

export const MESH_VERTICES: Vector3[] = [
    { x: -1, y: -1, z: -1 } as Vector3, // 1
    { x: -1, y:  1, z: -1 } as Vector3, // 2
    { x:  1, y:  1, z: -1 } as Vector3, // 3 
    { x:  1, y: -1, z: -1 } as Vector3, // 4
    { x:  1, y:  1, z:  1 } as Vector3, // 5 
    { x:  1, y: -1, z:  1 } as Vector3, // 6
    { x: -1, y:  1, z:  1 } as Vector3, // 7 
    { x: -1, y: -1, z:  1 } as Vector3  // 8
];

export const MESH_FACES: Face[] = [
    // front
    { a: 1, b: 2, c: 3 },
    { a: 1, b: 3, c: 4 },

    // right
    { a: 4, b: 3, c: 5 },
    { a: 4, b: 5, c: 6 },

    // back
    { a: 6, b: 5, c: 7 },
    { a: 6, b: 7, c: 8 },

    // left
    { a: 8, b: 7, c: 2 },
    { a: 8, b: 2, c: 1 },

    // top
    { a: 2, b: 7, c: 5 },
    { a: 2, b: 5, c: 3 },

    // bottom
    { a: 6, b: 8, c: 1 },
    { a: 6, b: 1, c: 4 },
];

export class Mesh {

}