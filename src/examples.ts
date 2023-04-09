const ADD = `        INP
        STA NUM
        INP
        ADD NUM
        OUT
        HLT

NUM     DAT
`;

const SUB = `        INP
        STA NUM
        INP
        SUB NUM
        OUT
        HLT

NUM     DAT
`;

const ASCII = `        LDA SPACE
        STA CHAR
LOOP    LDA CHAR
        OTC
        ADD ONE
        STA CHAR
        SUB MAX
        BRZ END
        BRA LOOP
END     HLT
SPACE   DAT 32
ONE     DAT 1
MAX     DAT 127
CHAR    DAT
`;

const MAX = `        INP
        STA NUM1
        INP
        STA NUM2
        SUB NUM1
        BRP POS
        LDA NUM1
        OUT
        BRA END
POS     LDA NUM2
        OUT
END     HLT

NUM1    DAT
NUM2    DAT
`;

const COUNTDOWN = `        INP
LOOP    OUT
        STA COUNT
        SUB ONE
        STA COUNT
        BRP LOOP
        HLT

COUNT   DAT
ONE     DAT 1
`;

const MULTIPLY = `        INP
        STA NUM1
        INP 
        STA NUM2
LOOP    LDA TOTAL
        ADD NUM1
        STA TOTAL
        LDA NUM2
        SUB ONE
        STA NUM2
        BRP LOOP
        LDA TOTAL
        OUT
        HLT

NUM1    DAT
NUM2    DAT
ONE     DAT 1
TOTAL   DAT 0
`;

const FIBONACCI = `        INP
        STA NUM
LOOP    LDA FIRST
        SUB NUM
        BRP ENDLOOP
        LDA FIRST
        OUT
        LDA SECOND
        ADD FIRST
        STA ACC
        LDA SECOND
        STA FIRST
        LDA ACC
        STA SECOND
        BRA LOOP
ENDLOOP HLT

FIRST   DAT 0
SECOND  DAT 1
NUM     DAT
ACC     DAT
`;

const PRIMES = `        INP
        SUB ONE
        STA NUM
        INP
        STA MAX
TLOOP   LDA NUM
        ADD ONE
        STA NUM
        SUB MAX
        BRZ HALT
        LDA ONE
        STA DIV
DLOOP   LDA DIV
        ADD ONE
        STA DIV
        SUB NUM
        BRZ PRIME
        LDA NUM
MODULUS SUB DIV
        BRP MODULUS
        ADD DIV
        BRZ NPRIME
        BRA DLOOP
PRIME   LDA NUM
        OUT
NPRIME  BRA TLOOP
HALT    HLT

NUM     DAT
DIV     DAT
MAX     DAT
ONE     DAT 1
`;

export const examples = [
    { name: "Add", code: ADD },
    { name: "Subtract", code: SUB },
    { name: "ASCII", code: ASCII },
    { name: "Maximum", code: MAX },
    { name: "Countdown", code: COUNTDOWN },
    { name: "Multiply", code: MULTIPLY },
    { name: "Fibonacci", code: FIBONACCI },
    { name: "Primes", code: PRIMES },
];
