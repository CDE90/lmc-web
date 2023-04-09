import { APIEvent, json } from "solid-start";
import { apiResponseValidator } from "~/types/lmc";

export async function POST({ request }: APIEvent) {
    // get the request body as a string
    const body = await request.text();

    const url = import.meta.env.PROD
        ? "http://api.lmc.ethancoward.dev/assemble"
        : "http://localhost:5001/assemble";

    // forwards the request to the server
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain",
        },
        body,
    });

    // check if the response is ok
    if (!response.ok) {
        return json({ error: "Failed to assemble code..." }, { status: 500 });
    }

    // validate the response
    const data = apiResponseValidator.safeParse(await response.json());

    if (!data.success) {
        return json({ error: "Something went wrong..." }, { status: 500 });
    }

    return json(data.data);
}
