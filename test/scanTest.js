const { Scanner } = require('../dist/Core/Lang/Lexical/Scanner');
const { Printer } = require('../dist/Core/Lang/Parser/Printer');
const { readFileSync } = require('fs');

const filepath = process.argv[2];
const source = readFileSync(filepath).toString();

const scanner = new Scanner(source);
const tokens = scanner.scan();

console.log(tokens.map((t) => t.toString()));
