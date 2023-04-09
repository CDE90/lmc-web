import { For, Show, VoidComponent, createSignal } from "solid-js";
import { ApiError, ApiResponse, Output, State } from "~/types/lmc";
import { createRouteAction } from "solid-start";
import { examples } from "~/examples";

const AssemblePage: VoidComponent = () => {
    const [programState, setProgramState] = createSignal<State>({
        acc: 0,
        pc: 0,
        mar: 0,
        mdr: 0,
        cir: 0,
        ram: Array.from({ length: 100 }, () => 0),
    });
    const [prevState, setPrevState] = createSignal<State | null>(null);
    const [isError, setIsError] = createSignal(false);
    const [errorMessage, setErrorMessage] = createSignal("");
    const [input, setInput] = createSignal<number | null>(null);
    const [outputs, setOutputs] = createSignal<Output[]>([]);
    const [nextRequiresInput, setNextRequiresInput] = createSignal(false);
    const [executionSpeed, setExecutionSpeed] = createSignal(50);

    const [_, { Form }] = createRouteAction(async (formData: FormData) => {
        setIsError(false);
        setErrorMessage("");
        setOutputs([]);

        const res = await fetch(`/api/assemble`, {
            method: "POST",
            body: formData.get("code"),
            headers: {
                "Content-Type": "text/plain",
            },
        });
        const data = await res.json();

        if (res.ok) {
            setProgramState(data.state);
            if (data.state.ram[0] === 901) {
                setNextRequiresInput(true);
            }
        } else {
            setIsError(true);
            setErrorMessage(data.error);
        }
    });

    const stepExecution = async () => {
        if (programState().pc === -1) {
            return false;
        }

        if (nextRequiresInput()) {
            const input = prompt("Enter input");
            if (input) {
                setInput(parseInt(input));
            } else {
                setInput(0);
            }
        }

        const body = JSON.stringify({
            state: programState(),
            input: input() !== null ? [input()] : [],
        });

        setInput(null);

        const res = await fetch(`/api/step`, {
            method: "POST",
            body: body,
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = (await res.json()) as ApiResponse | ApiError;

        if (res.ok && "state" in data) {
            setPrevState(programState());
            setProgramState(data.state);
            setNextRequiresInput(data.next_requires_input);
            if (data.output) {
                setOutputs((outputs) => [...outputs, ...data.output]);
            }
            return data.state.pc !== -1;
        } else if ("error" in data) {
            setIsError(true);
            setErrorMessage(data.error);
        } else {
            setIsError(true);
            setErrorMessage("Unknown error");
        }
        return false;
    };

    const runExecution = async () => {
        while (await stepExecution()) {
            await new Promise((resolve) =>
                setTimeout(resolve, 1000 - executionSpeed() * 10)
            );
        }
    };

    return (
        <div class="p-2 h-full">
            <div class="min-w-0 flex-1 mb-4">
                <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                    Little Man Computer - Assembler
                </h2>
            </div>
            <Form
                class="grid grid-cols-1 md:grid-cols-3 gap-4"
                id="assemble-form"
            >
                <div class="flex flex-col gap-2">
                    <div class="h-full">
                        <h2 class="block text-sm font-medium leading-6 text-gray-900">
                            Code
                        </h2>
                        <div class="mt-2">
                            <textarea
                                rows={20}
                                name="code"
                                id="code"
                                class="block font-mono w-full h-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6 resize-none"
                                default-value={""}
                            />
                        </div>
                    </div>
                    <select
                        name="examples"
                        id="examples"
                        class="block w-full font-mono h-10 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                        onChange={(e) => {
                            const codeElement = document.getElementById(
                                "code"
                            ) as HTMLTextAreaElement;

                            if (e.target.value && codeElement.value) {
                                if (
                                    !confirm(
                                        "Are you sure you want to overwrite your code?"
                                    )
                                ) {
                                    return;
                                }
                            }
                            const code = examples.find(
                                (example) => example.name === e.target.value
                            )?.code;
                            if (code) {
                                codeElement.value = code;
                            }
                        }}
                    >
                        <option value="">Select an example</option>
                        <For each={examples}>
                            {(example) => (
                                <option value={example.name}>
                                    {example.name}
                                </option>
                            )}
                        </For>
                    </select>
                </div>
                <div class="flex flex-col gap-2">
                    <div class="h-full">
                        <h2 class="block text-sm font-medium leading-6 text-gray-900">
                            RAM
                        </h2>
                        <div class="mt-2 font-mono">
                            <div class="grid grid-cols-10 gap-2">
                                <For each={programState().ram}>
                                    {(value, address) => (
                                        <div
                                            class={`h-10 w-10 rounded-md text-center ${
                                                programState().pc === address()
                                                    ? "bg-yellow-400"
                                                    : "bg-gray-200"
                                            }`}
                                        >
                                            <div class="text-sm font-bold">
                                                {address()}
                                            </div>
                                            <div class="text-sm">
                                                {value
                                                    .toString()
                                                    .padStart(3, "0")}
                                            </div>
                                        </div>
                                    )}
                                </For>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <div class="h-full">
                        <h2 class="block text-sm font-medium leading-6 text-gray-900">
                            Registers
                        </h2>
                        <div class="mt-2 font-mono gap-2 flex flex-col">
                            <div class="bg-gray-200 rounded-md text-center">
                                <div class="text-sm font-bold">
                                    Program Counter
                                </div>
                                <div class="text-sm">
                                    {programState().pc === -1
                                        ? "-1"
                                        : programState()
                                              .pc.toString()
                                              .padStart(3, "0")}
                                </div>
                            </div>
                            <div class="bg-gray-200 rounded-md text-center">
                                <div class="text-sm font-bold">Accumulator</div>
                                <div class="text-sm">
                                    {programState()
                                        .acc.toString()
                                        .padStart(3, "0")}
                                </div>
                            </div>
                            <div class="bg-gray-200 rounded-md text-center">
                                <div class="text-sm font-bold">
                                    Memory Address Register
                                </div>
                                <div class="text-sm">
                                    {programState()
                                        .mar.toString()
                                        .padStart(3, "0")}
                                </div>
                            </div>
                            <div class="bg-gray-200 rounded-md text-center">
                                <div class="text-sm font-bold">
                                    Memory Data Register
                                </div>
                                <div class="text-sm">
                                    {programState()
                                        .mdr.toString()
                                        .padStart(3, "0")}
                                </div>
                            </div>
                            <div class="bg-gray-200 rounded-md text-center">
                                <div class="text-sm font-bold">
                                    Current Instruction Register
                                </div>
                                <div class="text-sm">
                                    {programState()
                                        .cir.toString()
                                        .padStart(3, "0")}
                                </div>
                            </div>
                        </div>
                        <h2 class="block text-sm font-medium leading-6 text-gray-900 mt-4">
                            Controls
                        </h2>
                        <div class="mt-2 gap-2 flex flex-col">
                            <button
                                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                type="submit"
                                form="assemble-form"
                            >
                                Assemble
                            </button>
                        </div>
                        <div class="mt-2 gap-2 flex flex-col">
                            <button
                                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                type="button"
                                onClick={() => stepExecution()}
                            >
                                Step
                            </button>
                        </div>
                        <div class="mt-2 gap-2 flex flex-col">
                            <button
                                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                type="button"
                                onClick={() => runExecution()}
                            >
                                Run
                            </button>
                        </div>
                        <div class="mt-2 gap-2 flex flex-col">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={executionSpeed()}
                                onInput={(e) => {
                                    setExecutionSpeed(e.target.value as any);
                                }}
                            />
                            <div class="text-sm font-bold">
                                Execution Speed: {executionSpeed()}%
                            </div>
                        </div>

                        <Show when={isError() && programState().pc !== -1}>
                            <div
                                class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4"
                                role="alert"
                            >
                                <strong class="font-bold">Error! </strong>
                                <span class="block sm:inline">
                                    {errorMessage()}
                                </span>
                            </div>
                        </Show>
                        <Show when={!isError() && programState().pc !== -1}>
                            <div
                                class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4"
                                role="alert"
                            >
                                <strong class="font-bold">OK!</strong>
                            </div>
                        </Show>
                        <Show when={programState().pc === -1}>
                            <div
                                class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4"
                                role="alert"
                            >
                                <strong class="font-bold">Done!</strong>
                            </div>
                        </Show>
                    </div>
                </div>
            </Form>
            <div class="bg-gray-200 rounded-md text-center mt-2">
                <div class="text-sm font-bold">Output:</div>
                <div class="text-sm flex gap-2 font-mono p-2 flex-wrap">
                    <For each={outputs()}>
                        {(output) => (
                            <div class="bg-gray-300 rounded-md text-center w-6 h-6 p-1">
                                {"Int" in output ? output.Int : output.Char}
                            </div>
                        )}
                    </For>
                </div>
            </div>
        </div>
    );
};

export default AssemblePage;
