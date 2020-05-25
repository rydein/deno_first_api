import { Application, Router } from "https://deno.land/x/denotrain@v0.4.4/mod.ts";
import api from "./controllers/villagers.ts";

const app = new Application({});
app.use("/api/villagers", api);

app.run();