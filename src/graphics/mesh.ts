import { Vector3 } from "../math/vector"
import { Face } from "./triangle";
import ObjFileParser from "obj-file-parser"
//import { TexCoords } from "./texture";

export class Mesh {
    private _faces: Face[] = [];
    private _vertices: Vector3[] = [];
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
    
        return this;
    }
}
