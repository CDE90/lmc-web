import { For, VoidComponent, createSignal } from "solid-js";
import { State } from "~/types/lmc";

const AssemblePage: VoidComponent = () => {
    const [programState, setProgramState] = createSignal<State>({
        acc: 0,
        pc: 0,
        mar: 0,
        mdr: 0,
        cir: 0,
        ram: Array.from({ length: 100 }, () => 0),
    });

    return (
        <div>
            <h1>Assemble</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    console.log(formData.get("code"));
                    const res = fetch(`/api/assemble`, {
                        method: "POST",
                        body: formData.get("code"),
                        headers: {
                            "Content-Type": "text/plain",
                        },
                    });
                    res.then((res) => {
                        res.json().then((data) => {
                            console.log(data);
                            setProgramState(data.state);
                        });
                    });
                }}
            >
                <label for="code">
                    <span>Code</span>
                </label>
                <textarea
                    name="code"
                    value="INP"
                    class="border-gray-200 border-2 h-auto resize-none"
                />
                <button type="submit">Submit</button>
            </form>
            {/* show the state */}
            <div>
                <h2>State</h2>
                <div>
                    <h3>RAM</h3>
                    <div class="flex flex-wrap gap-1">
                        <For each={programState().ram}>
                            {(ram) => <span>{ram}</span>}
                        </For>
                    </div>
                    {/* show the registers */}
                    <div>
                        <h3>Registers</h3>
                        <div>
                            <div>
                                <span>ACC</span>
                                <span>{programState().acc}</span>
                            </div>
                            <div>
                                <span>PC</span>
                                <span>{programState().pc}</span>
                            </div>
                            <div>
                                <span>MAR</span>
                                <span>{programState().mar}</span>
                            </div>
                            <div>
                                <span>MDR</span>
                                <span>{programState().mdr}</span>
                            </div>
                            <div>
                                <span>CIR</span>
                                <span>{programState().cir}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssemblePage;
