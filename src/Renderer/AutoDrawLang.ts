import type * as monaco from 'monaco-editor';

export const autoDrawConfig: monaco.languages.LanguageConfiguration = {
    wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,

    comments: {
        lineComment: '//',
    },

    brackets: [
        ['{', '}'],
        ['[', ']'],
        ['(', ')']
    ],

    onEnterRules: [
        {
            // e.g. /** | */
            beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
            afterText: /^\s*\*\/$/,
            action: {
                indentAction: window.app.monaco.languages.IndentAction.IndentOutdent,
                appendText: ' * '
            }
        },
        {
            // e.g. /** ...|
            beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
            action: {
                indentAction: window.app.monaco.languages.IndentAction.None,
                appendText: ' * '
            }
        },
        {
            // e.g.  * ...|
            beforeText: /^(\t|(\ \ ))*\ \*(\ ([^\*]|\*(?!\/))*)?$/,
            action: {
                indentAction: window.app.monaco.languages.IndentAction.None,
                appendText: '* '
            }
        },
        {
            // e.g.  */|
            beforeText: /^(\t|(\ \ ))*\ \*\/\s*$/,
            action: {
                indentAction: window.app.monaco.languages.IndentAction.None,
                removeText: 1
            }
        }
    ],

    autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
    ],
};

export const autoDrawLang: monaco.languages.IMonarchLanguage = {
    defaultToken: 'invalid',
    tokenPostfix: '.ad',

    brackets: [
        { open: '{', close: '}', token: 'delimiter.curly' },
        { open: '(', close: ')', token: 'delimiter.parenthesis' },
    ],

    keywords: [
        'else',
        'false',
        'fn',
        'if',
        'let',
        'return',
        'true',
        'var',
        'while',
    ],

    operators: [
        '=', '>', '<', '!', '~', '==', '<=', '>=', '!=',
        'and', 'or', '+', '-', '*', '/', '%',
    ],

    // we include these common regular expressions
    symbols: /[=><!~?:&|+\-*\/\^%]+/,

    // C# style strings
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

    // The main tokenizer for our languages
    tokenizer: {
        root: [
            // identifiers and keywords
            [/[a-z_$][\w$]*/, {
                cases: {
                    '@keywords': 'keyword',
                    '@default': 'identifier'
                }
            }],
            [/[A-Z][\w\$]*/, 'type.identifier'],  // to show class names nicely

            // whitespace
            { include: '@whitespace' },

            // delimiters and operators
            [/[{}()\[\]]/, '@brackets'],
            // [/(?!@symbols)/, '@brackets'],
            [/@symbols/, {
                cases: {
                    '@operators': 'operators',
                    '@default': ''
                }
            }],

            // numbers
            [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
            [/0[xX][0-9a-fA-F]+/, 'number.hex'],
            [/\d+(deg)?/, 'number'],
            [/#[0-9A-Fa-f]{6}/, 'number'],
            [/#(blue|red|green|yellow|orange|violet|black|white|gray)/, 'number'],

            // delimiter: after number because of .\d floats
            [/[;,.]/, 'delimiter'],

            // strings
            // [/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-terminated string
            // [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],

            // characters
            // [/'[^\\']'/, 'string'],
            // [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
            // [/'/, 'string.invalid']
        ],

        comment: [
            [/[^\/*]+/, 'comment'],
        ],

        whitespace: [
            [/[ \t\r\n]+/, 'white'],
            [/\/\*/, 'comment', '@comment'],
            [/\/\/.*$/, 'comment'],
        ],
    },
};
