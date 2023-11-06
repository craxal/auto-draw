import { Token2 } from '../Lexical/Token2';
import { Expression } from './Expression';

export interface IStatementVisitor<T> {
    visitBlockStatement(statement: BlockStatement): T;
    visitExpressionStatement(statement: ExpressionStatement): T;
    visitIfStatement(statement: IfStatement): T;
    visitVarStatement(statements: VarStatement): T;
}

export abstract class Statement {
    public abstract accept<T>(visitor: IStatementVisitor<T>): T;
}

export class BlockStatement extends Statement {
    constructor(
        public readonly statements: Statement[]
    ) {
        super();
    }

    public override accept<T>(visitor: IStatementVisitor<T>): T {
        return visitor.visitBlockStatement(this);
    }
}

export class ExpressionStatement extends Statement {
    constructor(
        public readonly expression: Expression
    ) {
        super();
    }

    public override accept<T>(visitor: IStatementVisitor<T>): T {
        return visitor.visitExpressionStatement(this);
    }
}

export class IfStatement extends Statement {
    constructor(
        public readonly condition: Expression,
        public readonly thenBranch: Statement,
        public readonly elseBranch?: Statement,
    ) {
        super();
    }

    public override accept<T>(visitor: IStatementVisitor<T>): T {
        return visitor.visitIfStatement(this);
    }
}

export class VarStatement extends Statement {
    constructor(
        public readonly name: Token2,
        public readonly initializer: Expression
    ) {
        super();
    }

    public override accept<T>(visitor: IStatementVisitor<T>): T {
        return visitor.visitVarStatement(this);
    }
}