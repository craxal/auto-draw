const { Scanner } = require('../dist/Core/Lang/Lexical/Scanner');
const { Parser } = require('../dist/Core/Lang/Parser2/Parser2');
const { Interpreter2 } = require('../dist/Core/Lang/Interpreter2/Interpreter2');
const { readFileSync } = require('fs');

const filepath = process.argv[2];
const source = readFileSync(filepath).toString();

const scanner = new Scanner(source);
const tokens = scanner.scan();

const parser = new Parser(tokens);
const parseResult = parser.parse();
if (parseResult.type === 'error') {
    parseResult.error.forEach((err) => {
        console.error(`${filepath}:${parseResult.err.token.line} > [ERROR] ${parseResult.err.message}`);
    });
} else {
    const interpreter = new Interpreter2();
    const intResult = interpreter.interpret(parseResult.result);
}
