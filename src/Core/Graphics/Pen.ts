import { Angle } from './Angle';
import { Color } from './Color';
import { Point } from './Point';

export type PenPosition = 'up' | 'down';

export class Pen {
    public coordinates = new Point(0, 0);
    public angle = new Angle({ degrees: -90 });
    public color: Color = Color.black;
    public position: PenPosition = 'up';

    public toString(): string {
        return `${this.coordinates.toString()} ${this.angle.toString()} ${this.color.toSwatchString()} ${this.position === 'up' ? '↑' : '↓'}`;
    }
}
