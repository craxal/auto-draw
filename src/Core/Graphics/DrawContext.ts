import { Instruction } from '../Instruction';
import { Log } from '../Log';
import { Angle, cos, sin } from './Angle';
import { Color } from './Color';
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
        this.pen.angle = Angle.normalize(Angle.subtract(this.pen.angle, angle))
    }

    public turnRight(angle: Angle = Angle.right): void {
        this.pen.angle = Angle.normalize(Angle.add(this.pen.angle, angle));
    }

    public moveForward(distance: number): void {
        const newPosition = new Point(
            this.pen.coordinates.x + distance * cos(this.pen.angle),
            this.pen.coordinates.y + distance * sin(this.pen.angle),
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
            this.pen.coordinates.x + radius * sin(this.pen.angle),
            this.pen.coordinates.y - radius * cos(this.pen.angle),
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
            center.x + radius * cos(penAnglePlusRightMinusAngle),
            center.y + radius * sin(penAnglePlusRightMinusAngle),
        );
        this.pen.angle = Angle.normalize(Angle.subtract(this.pen.angle, angle));
    }

    public arcRight(angle: Angle, radius: number): void {
        const startAngle = Angle.subtract(this.pen.angle, Angle.right);
        const endAngle = Angle.subtract(Angle.add(this.pen.angle, angle), Angle.right);
        const center = new Point(
            this.pen.coordinates.x - radius * sin(this.pen.angle),
            this.pen.coordinates.y + radius * cos(this.pen.angle),
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
            center.x + radius * cos(angleMinusPenAnglePlusRight),
            center.y + radius * sin(angleMinusPenAnglePlusRight),
        );
        this.pen.angle = Angle.normalize(Angle.add(this.pen.angle, angle));
    }

    public execute(instructions: Instruction[]): void {
        for (const instruction of instructions) {
            instruction.execute(this);
            Log.debug(`${instruction.type}: ${this.pen.toString()}`);
        }
        this.#drawCursor();
    }

    #drawCursor(): void {
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
