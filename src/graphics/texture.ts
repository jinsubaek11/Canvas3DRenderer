import { decode } from "fast-png";

interface RGBA {
    r: number,
    g: number,
    b: number,
    a: number
}

export interface TexCoords {
    u: number,
    v: number
}

export class Texture {
    private _filePath: string;
    private _width: number = 0;
    private _height: number = 0;
    private _data: RGBA[] = [];

    public constructor(filePath: string) {
        this._filePath = filePath;
    }

    public async load(): Promise<Texture> {
        const res = await fetch(this._filePath);
        const arrayBuffer = await res.arrayBuffer();
        const decodedPng = decode(arrayBuffer);
    
        this._width = decodedPng.width;
        this._height = decodedPng.height;
    
        for (let i = 0; i < decodedPng.data.length; i += 4) {
            this._data.push(
                { 
                    r: decodedPng.data[i + 0], 
                    g: decodedPng.data[i + 1], 
                    b: decodedPng.data[i + 2], 
                    a: decodedPng.data[i + 3]
                }
            );
        }
    
        return this;
    }

    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
    }

    public get data(): RGBA[] {
        return this._data;
    }
}

// export interface Texture {
//     u: number;
//     v: number;
// }



// export const loadImageData = async (filePath: string) => {
//     const res = await fetch(filePath);
//     const arrayBuffer = await res.arrayBuffer();
//     const decodedPng = decode(arrayBuffer);
//     const ret: { width: number, height: number, data: RGBA[] } = { width: 0, height: 0, data: [] };

//     ret.width = decodedPng.width;
//     ret.height = decodedPng.height;

//     for (let i = 0; i < decodedPng.data.length; i += 4) {
//         ret.data.push(
//             { 
//                 r: decodedPng.data[i + 0], 
//                 g: decodedPng.data[i + 1], 
//                 b: decodedPng.data[i + 2], 
//                 a: decodedPng.data[i + 3]
//             }
//         );
//     }

//     return ret;
// };
