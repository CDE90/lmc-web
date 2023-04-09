export interface State {
    ram: number[];
    acc: number;
    pc: number;
    cir: number;
    mar: number;
    mdr: number;
}

export interface ApiResponse {
    state: State;
    input_success: boolean | null;
    next_requires_input: boolean;
    output: (number | string)[];
}
