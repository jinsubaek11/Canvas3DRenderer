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