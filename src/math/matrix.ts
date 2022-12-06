
const MATRIX4X4_LENGTH = 16;

export class Matrix {
    public static getProjectionMatrix(
        fov: number, aspect: number, near: number, far: number
    ): Matrix4x4 {

        const matrix: Matrix4x4 = new Matrix4x4()
        matrix.data[0] = aspect * (1 / Math.tan(fov / 2));
        matrix.data[5] = 1 / Math.tan(fov / 2);
        matrix.data[10] = far / (far - near);
        matrix.data[11] = (-far * near) / (far - near);
        matrix.data[14] = 1.0;

        return matrix;
    }

}

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