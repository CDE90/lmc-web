import { z } from "zod";

export const stateValidator = z.object({
    ram: z.array(z.number()).length(100),
    acc: z.number(),
    pc: z.number(),
    cir: z.number(),
    mar: z.number(),
    mdr: z.number(),
});

export const outputValidator = z.union([
    z.object({ Int: z.number() }),
    z.object({ Char: z.string().length(1) }),
]);

export const apiResponseValidator = z.object({
    state: stateValidator,
    input_success: z.union([z.boolean(), z.null()]),
    next_requires_input: z.boolean(),
    output: z.array(outputValidator),
});

export type ApiResponse = z.infer<typeof apiResponseValidator>;
export type State = z.infer<typeof stateValidator>;
export type Output = z.infer<typeof outputValidator>;
