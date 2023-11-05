import { IExpressionVisitor } from "./Expression";
import { IStatementVisitor, Statement } from "./Statement";

export interface IProgramVisitor<T, TStmt = T, TExpr = T> extends IStatementVisitor<TStmt>, IExpressionVisitor<TExpr> {
    visitProgram(program: Program2): T;
}

export class Program2 {
    constructor(
        public statements: Statement[]
    ) { }

    public accept<T>(visitor: IProgramVisitor<T>): T {
        return visitor.visitProgram(this);
    }
}
