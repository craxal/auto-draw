import { AssignmentExpression, BinaryExpression, CallExpression, GroupingExpression, LiteralExpression, LogicalExpression, UnaryExpression, VariableExpression } from './Expression';
import { IProgramVisitor, Program2 } from './Program2';
import { BlockStatement, ExpressionStatement, FunctionStatement, IfStatement, ReturnStatement, VarStatement, WhileStatement } from './Statement';

export class Printer implements IProgramVisitor<string> {
    public print(program: Program2): void {
        console.log(program.accept(this));

    }
    public visitProgram(program: Program2): string {
        let results: string[] = [];
        for (const statement of program.statements) {
            results.push(statement.accept(this));
        }

        return results.join('\n');
    }

    public visitBlockStatement(statement: BlockStatement): string {
        const lines = [
            '{;}',
            ...statement.statements.slice(0, -1).map((stmt) => `├── ${stmt.accept(this).split('\n').join('\n│   ')}`),
            ...statement.statements.slice(-1).map((stmt) => `└── ${stmt.accept(this).split('\n').join('\n    ')}`),
        ];

        return lines.join('\n');
    }

    public visitExpressionStatement(statement: ExpressionStatement): string {
        const lines = [
            '{~}',
            `└── ${statement.expression.accept(this).split('\n').join('\n    ')}`,
        ];

        return lines.join('\n');
    }

    public visitFunctionStatement(statement: FunctionStatement): string {
        const lines = [
            `fn`,
            `├── ${statement.name.lexeme}`,
            ...statement.parameters.map((param) => `├── ${param.lexeme}`),
            `└── ${statement.body.accept(this).split('\n').join('\n    ')}`,
        ];

        return lines.join('\n');
    }

    public visitIfStatement(statement: IfStatement): string {
        const lines = !!statement.elseBranch
            ? [
                '{if}',
                `├── ${statement.condition.accept(this).split('\n').join('\n│   ')}`,
                `├── ${statement.thenBranch.accept(this).split('\n').join('\n│   ')}`,
                `└── ${statement.elseBranch.accept(this).split('\n').join('\n    ')}`,
            ]
            : [
                '{if}',
                `├── ${statement.condition.accept(this).split('\n').join('\n│   ')}`,
                `└── ${statement.thenBranch.accept(this).split('\n').join('\n    ')}`,

            ];

        return lines.join('\n');
    }

    public visitReturnStatement(statement: ReturnStatement): string {
        const lines = !!statement.expression
            ? [
                '{return}',
                `└── ${statement.expression.accept(this).split('\n').join('\n    ')}`,
            ]
            : [
                '{return}',
            ];

        return lines.join('\n');
    }

    public visitVarStatement(statement: VarStatement): string {
        const lines = [
            '{var}',
            `├── ${statement.name.lexeme}`,
            `└── ${statement.initializer.accept(this).split('\n').join('\n    ')}`,
        ];

        return lines.join('\n');
    }

    public visitWhileStatement(statement: WhileStatement): string {
        const lines = [
            '{while}',
            `├── ${statement.condition.accept(this).split('\n').join('\n│   ')}`,
            `└── ${statement.body.accept(this).split('\n').join('\n    ')}`,
        ];

        return lines.join('\n');
    }

    public visitAssignmentExpression(expression: AssignmentExpression): string {
        const lines = [
            '=',
            `├── ${expression.name.lexeme}`,
            `└── ${expression.value.accept(this).split('\n').join('\n    ')}`,
        ];

        return lines.join('\n');
    }

    public visitBinaryExpression(expression: BinaryExpression): string {
        const lines = [
            `${expression.operator.lexeme}`,
            `├── ${expression.left.accept(this).split('\n').join('\n│   ')}`,
            `└── ${expression.right.accept(this).split('\n').join('\n    ')}`,
        ];

        return lines.join('\n');
    }

    public visitCallExpression(expression: CallExpression): string {
        const lines = expression.args.length > 0
            ? [
                `(...)`,
                `├── ${expression.callee.accept(this).split('\n').join('\n│   ')}`,
                ...expression.args.slice(0, -1).map((expr) => `├── ${expr.accept(this).split('\n').join('\n│   ')}`),
                ...expression.args.slice(-1).map((expr) => `└── ${expr.accept(this).split('\n').join('\n    ')}`),
            ] : [
                `(...)`,
                `└── ${expression.callee.accept(this).split('\n').join('\n│   ')}`,
            ];

        return lines.join('\n');
    }

    public visitGroupingExpression(expression: GroupingExpression): string {
        const lines = [
            '()',
            `└── ${expression.expression.accept(this).split('\n').join('\n    ')}`,
        ];

        return lines.join('\n');
    }

    public visitLiteralExpression(expression: LiteralExpression): string {
        return expression.value.toString();
    }

    public visitLogicalExpression(expression: LogicalExpression): string {
        const lines = [
            `${expression.operator.lexeme}`,
            `├── ${expression.left.accept(this).split('\n').join('\n│   ')}`,
            `└── ${expression.right.accept(this).split('\n').join('\n    ')}`,
        ];

        return lines.join('\n');
    }

    public visitUnaryExpression(expression: UnaryExpression): string {
        const lines = [
            `${expression.operator.lexeme}`,
            `└── ${expression.right.accept(this).split('\n').join('\n    ')}`,
        ];

        return lines.join('\n');
    }

    public visitVariableExpression(expression: VariableExpression): string {
        return expression.name.lexeme;
    }
}