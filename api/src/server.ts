import { createApp } from "./app";
import { createMemoryStore } from "./memoryStore";

const port = Number(process.env.PORT ?? 3001);

createApp(createMemoryStore()).listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
});