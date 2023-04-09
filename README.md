# Little Man Computer Website

This is a website to interact with the Little Man Computer Assembly language. It is written in TypeScript and uses the solid-start framework.

All logic is handled by an API written in Rust which in turn uses the [lmc-assembly crate](https://github.com/CDE90/lmc-assembly) which I wrote. See [lmc-api](https://github.com/CDE90/lmc-api) to see the source code for the API.

The website is hosted at [https://lmc.ethancoward.dev](https://lmc.ethancoward.dev) (via. Vercel). The API is hosted at [https://api.lmc.ethancoward.dev](https://api.lmc.ethancoward.dev).

## What is the Little Man Computer?

From [wikipedia](https://en.wikipedia.org/wiki/Little_man_computer):

The Little Man Computer (LMC) is an instructional model of a computer, created by Dr. Stuart Madnick in 1965. The LMC is generally used to teach students, because it models a simple von Neumann architecture computer—which has all of the basic features of a modern computer.

### Instruction Set

| Mnemonic  | Name                | Description                                                                                                                 | Op Code  |
|---------- |-------------------- |---------------------------------------------------------------------------------------------------------------------------- |--------- |
| INP       | INPUT               | Retrieve user input and stores it in the accumulator.                                                                       | 901      |
| OUT       | OUTPUT              | Output the value stored in the accumulator.                                                                                 | 902      |
| LDA       | LOAD                | Load the Accumulator with the contents of the memory address given.                                                         | 5xx      |
| STA       | STORE               | Store the value in the Accumulator in the memory address given.                                                             | 3xx      |
| ADD       | ADD                 | Add the contents of the memory address to the Accumulator                                                                   | 1xx      |
| SUB       | SUBTRACT            | Subtract the contents of the memory address from the Accumulator                                                            | 2xx      |
| BRP       | BRANCH IF POSITIVE  | Branch/Jump to the address given if the Accumulator is zero or positive.                                                    | 8xx      |
| BRZ       | BRANCH IF ZERO      | Branch/Jump to the address given if the Accumulator is zero.                                                                | 7xx      |
| BRA       | BRANCH ALWAYS       | Branch/Jump to the address given.                                                                                           | 6xx      |
| HLT       | HALT                | Stop the code.                                                                                                              | 000      |
| DAT       | DATA LOCATION       | Used to associate a label to a free memory address. An optional value can also be used to be stored at the memory address.  |          |

Empty lines and lines starting with `//` are ignored.

### Example Program

```asm
// This program adds 2 numbers together and outputs the result

INP         // Get the first number
STA FIRST   // Store it in memory
INP         // Get the second number
ADD FIRST   // Add the first number to the second
OUT         // Output the result
HLT         // Stop the program

FIRST DAT 0 // This is a data location with an initial value of 0
```

More examples can be found in the dropdown menu on the website.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
