import { Token } from '../Lexical/Token';
import { BlockStatement } from './Statement';

export abstract class Expression {
    public abstract accept<T>(visitor: IExpressionVisitor<T>): T;
}

export interface IExpressionVisitor<T> {
    visitAssignmentExpression(expression: AssignmentExpression): T;
    visitBinaryExpression(expression: BinaryExpression): T;
    visitCallExpression(expression: CallExpression): T;
    visitFunctionExpression(expression: FunctionExpression): T;
    visitGroupingExpression(expression: GroupingExpression): T;
    visitLogicalExpression(expression: LogicalExpression): T;
    visitLiteralExpression(expression: LiteralExpression): T;
    visitUnaryExpression(expression: UnaryExpression): T;
    visitVariableExpression(expression: VariableExpression): T;
}

export class AssignmentExpression extends Expression {
    constructor(
        public readonly name: Token,
        public readonly value: Expression
    ) {
        super();
    }

    public override accept<T>(visitor: IExpressionVisitor<T>): T {
        return visitor.visitAssignmentExpression(this);
    }
}

export class BinaryExpression extends Expression {
    constructor(
        public readonly left: Expression,
        public readonly operator: Token,
        public readonly right: Expression
    ) {
        super();
    }

    public override accept<T>(visitor: IExpressionVisitor<T>): T {
        return visitor.visitBinaryExpression(this);
    }
}

export class CallExpression extends Expression {
    constructor(
        public readonly callee: Expression,
        public readonly paren: Token,
        public readonly args: Expression[]
    ) {
        super();
    }

    public override accept<T>(visitor: IExpressionVisitor<T>): T {
        return visitor.visitCallExpression(this);
    }
}

export class FunctionExpression extends Expression {
    constructor(
        public readonly parameters: Token[],
        public readonly body: BlockStatement,
    ) {
        super();
    }

    public override accept<T>(visitor: IExpressionVisitor<T>): T {
        return visitor.visitFunctionExpression(this);
    }
}

export class GroupingExpression extends Expression {
    constructor(
        public readonly expression: Expression
    ) {
        super();
    }

    public override accept<T>(visitor: IExpressionVisitor<T>): T {
        return visitor.visitGroupingExpression(this);
    }
}

export class LiteralExpression extends Expression {
    constructor(
        public readonly value: any
    ) {
        super();
    }

    public override accept<T>(visitor: IExpressionVisitor<T>): T {
        return visitor.visitLiteralExpression(this);
    }
}

export class LogicalExpression extends Expression {
    constructor(
        public readonly left: Expression,
        public readonly operator: Token,
        public readonly right: Expression
    ) {
        super();
    }

    public override accept<T>(visitor: IExpressionVisitor<T>): T {
        return visitor.visitLogicalExpression(this);
    }
}

export class UnaryExpression extends Expression {
    constructor(
        public readonly operator: Token,
        public readonly right: Expression,
    ) {
        super();
    }

    public override accept<T>(visitor: IExpressionVisitor<T>): T {
        return visitor.visitUnaryExpression(this);
    }
}

export class VariableExpression extends Expression {
    constructor(
        public readonly name: Token
    ) {
        super();
    }

    public override accept<T>(visitor: IExpressionVisitor<T>): T {
        return visitor.visitVariableExpression(this);
    }
}
