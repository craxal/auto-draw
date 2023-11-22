import { Token } from '../Lexical/Token';
import { Expression } from './Expression';

export interface IStatementVisitor<T> {
    visitBlockStatement(statement: BlockStatement): T;
    visitExpressionStatement(statement: ExpressionStatement): T;
    visitIfStatement(statement: IfStatement): T;
    visitLetStatement(statement: LetStatement): T;
    visitReturnStatement(statement: ReturnStatement): T;
    visitVarStatement(statement: VarStatement): T;
    visitWhileStatement(statement: WhileStatement): T;
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

export class LetStatement extends Statement {
    constructor(
        public readonly name: Token,
        public readonly initializer: Expression
    ) {
        super();
    }

    public override accept<T>(visitor: IStatementVisitor<T>): T {
        return visitor.visitLetStatement(this);
    }
}

export class ReturnStatement extends Statement {
    constructor(
        public readonly keyword: Token,
        public readonly expression?: Expression,
    ) {
        super();
    }

    public override accept<T>(visitor: IStatementVisitor<T>): T {
        return visitor.visitReturnStatement(this);
    }
}

export class VarStatement extends Statement {
    constructor(
        public readonly name: Token,
        public readonly initializer: Expression
    ) {
        super();
    }

    public override accept<T>(visitor: IStatementVisitor<T>): T {
        return visitor.visitVarStatement(this);
    }
}

export class WhileStatement extends Statement {
    constructor(
        public readonly condition: Expression,
        public readonly body: Statement
    ) {
        super();
    }

    public override accept<T>(visitor: IStatementVisitor<T>): T {
        return visitor.visitWhileStatement(this);
    }
}
