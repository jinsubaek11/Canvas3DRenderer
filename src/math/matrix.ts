import { degreeToRadian } from "./util";

const MATRIX4X4_LENGTH = 16;

export class Matrix4x4 {
    private _data: number[] = [];

    public constructor(data: number[] = [
        0, 0, 0, 0,
        0, 0, 0, 0, 
        0, 0, 0, 0, 
        0, 0, 0, 0
    ]) {
        if (data.length != MATRIX4X4_LENGTH) {
            throw Error("Does not conform to the format of the matrix")
        }

        this._data = data;
    }

    public get data(): number[] {
        return this._data;
    }
}

export class Matrix {
    public static identity(): Matrix4x4 {
        return new Matrix4x4(
            [
                1, 0, 0, 0, 
                0, 1, 0, 0,
                0, 0, 1, 0, 
                0, 0, 0, 1
            ]
        );
    }

    public static scale4x4(x: number, y: number, z: number): Matrix4x4 {
        const matrix: Matrix4x4 = new Matrix4x4();

        matrix.data[0] = x;
        matrix.data[5] = y;
        matrix.data[10] = z;
        matrix.data[15] = 1;

        return matrix;
    }

    public static translation4x4(x: number, y: number, z: number): Matrix4x4 {
        const matrix: Matrix4x4 = this.identity();
        
        matrix.data[3] = x;
        matrix.data[7] = y;
        matrix.data[11] = z;
        matrix.data[15] = 1;

        return matrix;
    }

    public static rotationX4x4(deg: number): Matrix4x4 {
        const matrix: Matrix4x4 = this.identity();
        
        const radian = degreeToRadian(deg);
        const cos = Math.cos(radian);
        const sin = Math.sin(radian);

        matrix.data[5] = cos;
        matrix.data[6] = -sin;
        matrix.data[9] = sin;
        matrix.data[10] = cos;

        return matrix;
    }

    public static rotationY4x4(deg: number): Matrix4x4 {
        const matrix: Matrix4x4 = this.identity();
    
        const radian = degreeToRadian(deg);
        const cos = Math.cos(radian);
        const sin = Math.sin(radian);

        matrix.data[0] = cos;
        matrix.data[3] = sin;
        matrix.data[8] = -sin;
        matrix.data[10] = cos;

        return matrix;
    }

    public static rotationZ4x4(deg: number): Matrix4x4 {
        const matrix: Matrix4x4 = this.identity();
        
        const radian = degreeToRadian(deg);
        const cos = Math.cos(radian);
        const sin = Math.sin(radian);

        matrix.data[0] = cos;
        matrix.data[1] = -sin;
        matrix.data[4] = sin;
        matrix.data[5] = cos;

        return matrix;
    }

    public static projection(
        fov: number, aspect: number, near: number, far: number
    ): Matrix4x4 {
        const matrix: Matrix4x4 = new Matrix4x4()
        const radian = degreeToRadian(fov);

        matrix.data[0] = aspect * (1 / Math.tan(radian / 2));
        matrix.data[5] = 1 / Math.tan(radian / 2);
        matrix.data[10] = far / (far - near);
        matrix.data[11] = (-far * near) / (far - near);
        matrix.data[14] = 1.0;

        return matrix;
    }

    public static multiply4x4(m1: Matrix4x4, m2: Matrix4x4): Matrix4x4 {
        const matrix: Matrix4x4 = new Matrix4x4();

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                matrix.data[i * 4 + j] = 
                m1.data[i * 4 + 0] * m2.data[0 + j] + m1.data[i * 4 + 1] * m2.data[4 + j] + 
                m1.data[i * 4 + 2] * m2.data[8 + j] + m1.data[i * 4 + 3] * m2.data[12 + j];
            }
        }

        return matrix;
    }
}

