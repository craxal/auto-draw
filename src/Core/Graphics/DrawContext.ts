import { Interpreter } from '../Lang/Interpreter/Interpreter';
import { Instruction } from '../Lang/Parser/Instruction';
import { Angle } from '../Lang/Types/Angle';
import { Color } from '../Lang/Types/Color';
import { Log } from '../Util/Log';
import { Pen } from './Pen';
import { Point } from './Point';

export class DrawContext {
    #context: CanvasRenderingContext2D;
    #pen = new Pen();

    constructor(context: CanvasRenderingContext2D) {
        this.#context = context;
        this.#context.lineWidth = 3;
        this.#context.lineCap = 'round';
        context.translate(context.canvas.width / 2, context.canvas.height / 2);
    }

    public get pen(): Pen { return this.#pen; }

    public setPenColor(color: Color = Color.black): void {
        this.#context.fillStyle = color.toHex();
        this.#context.strokeStyle = color.toHex();
        this.pen.color = color;
    }

    public penUp(): void {
        this.pen.position = 'up';
    }

    public penDown(): void {
        this.pen.position = 'down';
    }

    public turnLeft(angle: Angle = Angle.right): void {
        this.pen.angle = Angle.reduce(Angle.subtract(this.pen.angle, angle));
    }

    public turnRight(angle: Angle = Angle.right): void {
        this.pen.angle = Angle.reduce(Angle.add(this.pen.angle, angle));
    }

    public moveForward(distance: number): void {
        const newPosition = new Point(
            this.pen.coordinates.x + distance * this.pen.angle.cos(),
            this.pen.coordinates.y + distance * this.pen.angle.sin(),
        );

        this.#context.beginPath();
        this.#context.moveTo(this.pen.coordinates.x, this.pen.coordinates.y);
        this.#context.lineTo(newPosition.x, newPosition.y);

        if (this.pen.position === 'down') {
            this.#context.strokeStyle = this.pen.color.toHex();
            this.#context.stroke();
        }

        this.pen.coordinates = newPosition;
    }

    public arcLeft(angle: Angle, radius: number): void {
        const startAngle = Angle.add(this.pen.angle, Angle.right);
        const endAngle = Angle.add(Angle.subtract(this.pen.angle, angle), Angle.right);
        const center = new Point(
            this.pen.coordinates.x + radius * this.pen.angle.sin(),
            this.pen.coordinates.y - radius * this.pen.angle.cos(),
        );

        this.#context.beginPath();
        this.#context.arc(
            center.x,
            center.y,
            radius,
            startAngle.radians,
            endAngle.radians,
            true
        );
        if (this.pen.position === 'down') {
            this.#context.stroke();
        }

        const penAnglePlusRightMinusAngle = Angle.subtract(Angle.add(this.pen.angle, Angle.right), angle);
        this.pen.coordinates = new Point(
            center.x + radius * penAnglePlusRightMinusAngle.cos(),
            center.y + radius * penAnglePlusRightMinusAngle.sin(),
        );
        this.pen.angle = Angle.reduce(Angle.subtract(this.pen.angle, angle));
    }

    public arcRight(angle: Angle, radius: number): void {
        const startAngle = Angle.subtract(this.pen.angle, Angle.right);
        const endAngle = Angle.subtract(Angle.add(this.pen.angle, angle), Angle.right);
        const center = new Point(
            this.pen.coordinates.x - radius * this.pen.angle.sin(),
            this.pen.coordinates.y + radius * this.pen.angle.cos(),
        );

        this.#context.beginPath();
        this.#context.arc(
            center.x,
            center.y,
            radius,
            startAngle.radians,
            endAngle.radians,
            false
        );
        if (this.pen.position === 'down') {
            this.#context.stroke();
        }

        const angleMinusPenAnglePlusRight = Angle.subtract(Angle.add(angle, this.pen.angle), Angle.right);
        this.pen.coordinates = new Point(
            center.x + radius * angleMinusPenAnglePlusRight.cos(),
            center.y + radius * angleMinusPenAnglePlusRight.sin(),
        );
        this.pen.angle = Angle.reduce(Angle.add(this.pen.angle, angle));
    }

    public execute(instructions: Instruction[]): void {
        const interpreter = new Interpreter(this);
        for (const instruction of instructions) {
            instruction.accept(interpreter);
            Log.debug(`${instruction}: ${this.pen.toString()}`);
        }
        this.drawCursor();
    }

    public drawCursor(): void {
        this.#context.save();

        this.#context.translate(this.pen.coordinates.x, this.pen.coordinates.y);
        this.#context.rotate(Angle.add(this.pen.angle, Angle.right).radians);

        const arrowPath = new Path2D();
        arrowPath.moveTo(-10, 0);
        arrowPath.lineTo(0, -20);
        arrowPath.lineTo(10, 0);
        arrowPath.closePath();

        this.#context.strokeStyle = 'black';
        this.#context.stroke(arrowPath);

        const circlePath = new Path2D();
        circlePath.ellipse(0, 0, 5, 5, 0, 0, 2 * Math.PI);
        if (this.pen.position === 'down') {
            this.#context.fillStyle = this.pen.color.toHex();
            this.#context.fill(circlePath);
        } else {
            this.#context.strokeStyle = this.pen.color.toHex();
            this.#context.stroke(circlePath);
        }

        this.#context.restore();
    }
}
