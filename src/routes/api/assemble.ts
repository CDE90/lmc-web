import { APIEvent, json } from "solid-start";

export async function POST({ request }: APIEvent) {
    // get the request body as a string
    const body = await request.text();

    // if the environment is production, use the production API
    const url = "http://api.lmc.ethancoward.dev/assemble";

    // forwards the request to the server
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain",
        },
        body,
    });

    const data = await response.json();

    return json(data);
}
