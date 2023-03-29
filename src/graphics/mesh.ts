import { Vector3 } from "../math/vector"
import { Face } from "./triangle";
import ObjFileParser from "obj-file-parser"
//import { TexCoords } from "./texture";

export class Mesh {
    private _faces: Face[] = [];
    private _vertices: Vector3[] = [];
    //private _texCoords: TexCoords[] = [];
    private _filePath: string;

    public constructor(filePath: string) {
        this._filePath = filePath;
    }

    public get vertices(): Vector3[] {
        return this._vertices;
    }

    public get faces(): Face[] {
        return this._faces;
    }

    public async load(): Promise<Mesh> {
        const res = await fetch(this._filePath);
        const text = await res.text();
        const objFile = new ObjFileParser(text);
        const output = objFile.parse();
    
        this._vertices = output.models[0].vertices.map((v) => new Vector3(v.x, v.y, v.z));
    
        console.log(output.models[0]);
    
        const texCoords = output.models[0].textureCoords;
    
        this._faces = output.models[0].faces.map((face: ObjFileParser.Face) => ({ 
                a: face.vertices[0].vertexIndex - 1, 
                b: face.vertices[1].vertexIndex - 1, 
                c: face.vertices[2].vertexIndex - 1,
                uvA: texCoords[Math.abs(face.vertices[0].textureCoordsIndex) - 1],
                uvB: texCoords[Math.abs(face.vertices[1].textureCoordsIndex) - 1],
                uvC: texCoords[Math.abs(face.vertices[2].textureCoordsIndex) - 1]
            })
        );
    
        console.log(this._faces)

        return this;
    }
}


// export interface Mesh {
//     vertices: Vector3[];
//     faces:  Face[];
//     rotation: Vector3;
// };

// export const loadObjFileData = async (filePath: string): Promise<Mesh> => {
//     const mesh: Mesh = {vertices: [], faces: [], rotation: { x: 0, y: 0, z: 0 } as Vector3};

//     const res = await fetch(filePath);
//     const text = await res.text();
//     const objFile = new ObjFileParser(text);
//     const output = objFile.parse();

//     mesh.vertices = output.models[0].vertices.map((v) => new Vector3(v.x, v.y, v.z));

//     console.log(output.models[0]);

//     const texCoords = output.models[0].textureCoords;

//     mesh.faces = output.models[0].faces.map((face: ObjFileParser.Face) => ({ 
//             a: face.vertices[0].vertexIndex - 1, 
//             b: face.vertices[1].vertexIndex - 1, 
//             c: face.vertices[2].vertexIndex - 1,
//             uvA: texCoords[Math.abs(face.vertices[0].textureCoordsIndex) - 1],
//             uvB: texCoords[Math.abs(face.vertices[1].textureCoordsIndex) - 1],
//             uvC: texCoords[Math.abs(face.vertices[2].textureCoordsIndex) - 1]
//         })
//     );

//     console.log(mesh.faces)
//     //mesh.faces = face.fla
//     // mesh.faces = output.models[0].faces.map((face) => 
//     //     face.vertices.map((v) => ({a: v.vertexIndex, b: v.textureCoordsIndex, c: v.vertexNormalIndex}) )
//     // )
//     //console.log(face);
   
//     return mesh;
// }