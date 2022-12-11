import Canvas from "./canvas"
import {Vector4, Vector3, Vector2, Vector} from "../math/vector"
import {Matrix, Matrix4x4} from "../math/matrix"
import { loadCubeMeshData, loadObjFileData, Mesh, MESH_FACES, MESH_VERTICES } from "./mesh";
import { Face, Triangle } from "./triangle";
import { degreeToRadian } from "../math/util"; 

export default class Renderer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private cube: Vector3[] = [];
    private projectedCube: Vector2[] = [];
    private fovFactor: number = 200;
    private triangledToRender: Triangle[] = [];
    private camera: Vector3 = { x: 0, y: 0, z: -4 } as Vector3;
    private mesh: Mesh;

    public constructor() {
    
    }

    public async setup(): Promise<boolean> {
        if (Canvas.init()) {
            if (Canvas.context != null)
            {
                this.canvas = Canvas.element;
                this.ctx = Canvas.context;

                //this.cubeMesh = loadCubeMeshData();
                //this.cubeMesh = loadObjFileData("./assets/cube.obj");    
                this.mesh = await loadObjFileData("./assets/cube.obj"); 
                
            }
            return true;
          } else {
                throw Error("Canvas is Not Available");
          }
    }
  
    public update(deltaTime: number): void {
        //console.log("update", deltaTime);
        this.triangledToRender = [];

        for (let i = 0; i < this.mesh.faces.length; i++) {
            const face: Face = this.mesh.faces[i];

            const vertices: Vector3[] = [];
            vertices[0] = this.mesh.vertices[face.a - 1];
            vertices[1] = this.mesh.vertices[face.b - 1];
            vertices[2] = this.mesh.vertices[face.c - 1];

            let triangle: Triangle = { points: [] };

            for (let i = 0; i < 3; i++) {
                //deltaTime * 0.02
                //const radian: number = degreeToRadian(deltaTime * 0.01);
                const radian: number = deltaTime * 0.001;
                // const originX: number = vertices[i].x;
                // const originY: number = vertices[i].y;

                let transformedVector = Vector.rotateZvec3(vertices[i], radian);
                transformedVector = Vector.rotateYvec3(transformedVector, radian);
                transformedVector = Vector.rotateXvec3(transformedVector, radian);

                //vertices[i].x += 0.2;
                const projectedPoint: Vector2 = this.project(transformedVector);
                //const projectedPoint: Vector2 = this.project(vertices[i]);
                projectedPoint.x += this.canvas.width / 2;
                projectedPoint.y += this.canvas.height / 2;

                triangle.points[i] = projectedPoint;
            }

            this.triangledToRender.push(triangle);
            //console.log(this.triangledToRender.length);
            //console.log(triangle);
        }
        
    }

    public render(deltaTime: number): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.mesh.faces.length; i++) {
            const triangle: Triangle = this.triangledToRender[i];
            this.drawRectangle(triangle.points[0].x, triangle.points[0].y, 3, 3 , 'red');
            this.drawRectangle(triangle.points[1].x, triangle.points[1].y, 3, 3 , 'red');
            this.drawRectangle(triangle.points[2].x, triangle.points[2].y, 3, 3 , 'red');
            this.drawTriangle(
                triangle.points[0].x, triangle.points[0].y,
                triangle.points[1].x, triangle.points[1].y,
                triangle.points[2].x, triangle.points[2].y
            );
        }



      //this.ctx.fillRect(200,200,10,10);
      //this.ctx.fillStyle = 'rgba(255, 0, 0, 255)';
        //this.drawGrid();

         //const transformMatrix = Matrix.scale4x4(0.1, 0.1, 0.1);
        //  const translationMatrix = Matrix.translation4x4(0, 0, 3);
        //  const rotationMatrix = Matrix.rotationY4x4(deltaTime * 0.01);
        //  //const transformMatrix = 
        //  const vec4Cube = this.cube.map((vector: Vector3) => Vector.convertVec3ToVec4(vector));
        //  const transformedCube = vec4Cube.map((vector: Vector4) => Vector.multiplyMatrix(translationMatrix, vector));
        
        //  const fov = 75;
        //  const aspect = this.canvas.height / this.canvas.width;
        //  const near = 0.1;
        //  const far = 200;
        //  const projectionMatrix: Matrix4x4 = Matrix.projection(fov, aspect, near, far);
        
        //  const projectedCube = transformedCube.map((vector: Vector4) => Vector.multiplyMatrix(projectionMatrix, vector));
        //  //console.log(projectedCube);
        
        //  this.projectedCube = vec4Cube.map(({ x, y }: Vector4) => this.project(x, y));
        // // this.projectedCube = projectedCube.map(({ x, y, z, w }: Vector4) => this.fitToViewport(x, y, z, w));

        // this.projectedCube.forEach(({ x, y }: Vector2) => {
        //     this.drawRectangle(x, y, 10, 10, 'rgba(255, 0, 0, 255)');
        // });
    }

    private drawGrid(): void {
        this.ctx.fillStyle = 'rgba(191, 191, 191, 1.0)' // silver;

        for (let y = 0; y < this.canvas.height; y++) {
            for (let x = 0; x < this.canvas.width; x++) {
                if (x % 10 == 0 || y % 10 == 0) {
                    this.ctx.fillRect(x, y, 1, 1);
                }
            }
        }
    }

    private project(v: Vector3): Vector2 {
        v.z += this.camera.z;
        const projectedX: number = this.fovFactor * v.x / v.z;
        const projectedY: number = this.fovFactor * v.y / v.z;
        const projectedPoints: Vector2 = new Vector2(projectedX, projectedY);

        return projectedPoints;
       // this.projectedCube.push(projectedPoints);
    }

    private perspectiveDivide(x: number, y: number, z: number, w: number): Vector3 {
        return new Vector3(x / w, y / w, z / w);
    }

    private fitToViewport(x: number, y: number, z: number, w: number): Vector2 {
        const dividedVector: Vector3 = this.perspectiveDivide(x, y, z, w);

        const viewportX: number = dividedVector.x * this.canvas.width / 2 + this.canvas.width / 2;
        const viewportY: number = -dividedVector.y * this.canvas.height / 2 + this.canvas.height / 2;

        // let viewportX = x + this.canvas.width / 2;
        // viewportX *= this.canvas.width / 2 
        // let viewportY = y + this.canvas.height / 2;
        // viewportY *= this.canvas.height / 2;

        return new Vector2(viewportX, viewportY);
    }

    private drawTriangle(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number): void {
        //console.log(x0, y0, x1, y1, x2, y2);
        this.ctx.beginPath();
        this.ctx.moveTo(x0, y0);
        this.ctx.lineTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.closePath();
        this.ctx.stroke();
    }

    private drawRectangle(x: number, y: number, width: number, height: number, color: string): void {
        if (x < 0 || y < 0 || x >= this.canvas.width || y >= this.canvas.height) return;

        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }

    private drawPixel(x: number, y: number, color: string): void {
        if (x < 0 || y < 0 || x >= this.canvas.width || y >= this.canvas.height) return;

        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, 1, 1);
    }  
  }