const { Scanner } = require('../dist/Core/Lang/Lexical/Scanner');
const { Parser } = require('../dist/Core/Lang/Parser2/Parser2');
const { Printer } = require('../dist/Core/Lang/Parser2/Printer');
const { readFileSync } = require('fs');

const filepath = process.argv[2];
const source = readFileSync(filepath).toString();

const scanner = new Scanner(source);
const tokens = scanner.scan();

const parser = new Parser(tokens);
const parseResult = parser.parse();
if (parseResult.type === 'error') {
    console.error(`${filepath}:${parseResult.error.token.line} > [ERROR] ${parseResult.error.message}`);
} else {
    const printer = new Printer();
    console.log(printer.print(parseResult.result));
}
