import { Vector2, Vector3, Vector } from "./vector";

export const degreeToRadian = (deg: number): number => {
    const radian = Math.PI * deg / 180;
    
    return radian;
}

export const radianToDegree = (rad: number): number => {
    const degree = rad / Math.PI * 180;

    return degree;
}

export const lerp = (a: number, b: number, t: number): number => {
    return (1 - t) * a + b * t;
}

export const barycentricWeights = (a: Vector2, b: Vector2, c: Vector2, p: Vector2): Vector3 => {
    const ac: Vector2 = Vector.subtractVec2(c, a);
    const ab: Vector2 = Vector.subtractVec2(b, a);
    const pc: Vector2 = Vector.subtractVec2(c, p);
    const pb: Vector2 = Vector.subtractVec2(b, p);
    const ap: Vector2 = Vector.subtractVec2(p, a);

    const areaParallelogramABC: number = ac.x * ab.y - ac.y * ab.x;
    const alpha: number = (pc.x * pb.y - pc.y * pb.x) / areaParallelogramABC;
    const beta: number = (ac.x * ap.y - ac.y * ap.x) / areaParallelogramABC;
    const gamma: number = 1.0 - alpha - beta;

    const weights: Vector3 = new Vector3(alpha, beta, gamma);

    return weights;
}