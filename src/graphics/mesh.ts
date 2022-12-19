import { Vector, Vector3 } from "../math/vector"
import { Face } from "./triangle";

import ObjFileParser from "obj-file-parser"
import { Texture } from "./texture";

export interface Mesh {
    vertices: Vector3[];
    faces:  Face[];
    rotation: Vector3;
};

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
    { a: 1, b: 2, c: 3, uvA: { u: 0, v: 0 }, uvB: { u: 0, v: 1 }, uvC: { u: 1, v: 1 } },
    { a: 1, b: 3, c: 4, uvA: { u: 0, v: 0 }, uvB: { u: 1, v: 1 }, uvC: { u: 1, v: 0 } },

    // right
    { a: 4, b: 3, c: 5, uvA: { u: 0, v: 0 }, uvB: { u: 0, v: 1 }, uvC: { u: 1, v: 1 } },
    { a: 4, b: 5, c: 6, uvA: { u: 0, v: 0 }, uvB: { u: 1, v: 1 }, uvC: { u: 1, v: 0 } },

    // back
    { a: 6, b: 5, c: 7, uvA: { u: 0, v: 0 }, uvB: { u: 0, v: 1 }, uvC: { u: 1, v: 1 } },
    { a: 6, b: 7, c: 8, uvA: { u: 0, v: 0 }, uvB: { u: 1, v: 1 }, uvC: { u: 1, v: 0 } },

    // left
    { a: 8, b: 7, c: 2, uvA: { u: 0, v: 0 }, uvB: { u: 0, v: 1 }, uvC: { u: 1, v: 1 } },
    { a: 8, b: 2, c: 1, uvA: { u: 0, v: 0 }, uvB: { u: 1, v: 1 }, uvC: { u: 1, v: 0 } },

    // top
    { a: 2, b: 7, c: 5, uvA: { u: 0, v: 0 }, uvB: { u: 0, v: 1 }, uvC: { u: 1, v: 1 } },
    { a: 2, b: 5, c: 3, uvA: { u: 0, v: 0 }, uvB: { u: 1, v: 1 }, uvC: { u: 1, v: 0 } },

    // bottom
    { a: 6, b: 8, c: 1, uvA: { u: 0, v: 0 }, uvB: { u: 0, v: 1 }, uvC: { u: 1, v: 1 } },
    { a: 6, b: 1, c: 4, uvA: { u: 0, v: 0 }, uvB: { u: 1, v: 1 }, uvC: { u: 1, v: 0 } },
];

export const loadCubeMeshData = (): Mesh => {
    let cubeMesh: Mesh = {
        vertices: [], faces: [], rotation: { x: 0, y: 0, z: 0 } as Vector3
    };

    for (let i = 0; i < MESH_VERTICES.length; i++) {
        cubeMesh.vertices.push(MESH_VERTICES[i]);
    }

    for (let i = 0; i < MESH_FACES.length; i++) {
        cubeMesh.faces.push(MESH_FACES[i]);
    }

    return cubeMesh;
}

export const loadObjFileData = async (filePath: string): Promise<Mesh> => {
    const mesh: Mesh = {vertices: [], faces: [], rotation: { x: 0, y: 0, z: 0 } as Vector3};

    const res = await fetch(filePath);
    const text = await res.text();
    const objFile = new ObjFileParser(text);
    const output = objFile.parse();

    mesh.vertices = output.models[0].vertices.map((v) => new Vector3(v.x, v.y, v.z));

    mesh.faces = output.models[0].faces.map((face) => ({ 
            a: face.vertices[0].vertexIndex, 
            b: face.vertices[1].vertexIndex, 
            c: face.vertices[2].vertexIndex 
        })
    );
    //mesh.faces = face.fla
    // mesh.faces = output.models[0].faces.map((face) => 
    //     face.vertices.map((v) => ({a: v.vertexIndex, b: v.textureCoordsIndex, c: v.vertexNormalIndex}) )
    // )
    //console.log(face);
   
    return mesh;
}