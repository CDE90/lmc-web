import { APIEvent, json } from "solid-start";
import { apiRequestValidator, apiResponseValidator } from "~/types/lmc";

export async function POST({ request }: APIEvent) {
    const body = await request.json();

    const data = apiRequestValidator.safeParse(body);

    if (!data.success) {
        return json({ error: "Bad request..." }, { status: 400 });
    }

    const url = import.meta.env.PROD
        ? "http://api.lmc.ethancoward.dev/step"
        : "http://localhost:5001/step";

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data.data),
    });

    if (!response.ok) {
        return json({ error: "Failed to execute code..." }, { status: 500 });
    }

    const data2 = apiResponseValidator.safeParse(await response.json());

    if (!data2.success) {
        return json({ error: "Something went wrong..." }, { status: 500 });
    }

    return json(data2.data);
}
