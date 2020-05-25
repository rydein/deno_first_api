import { Router } from "https://deno.land/x/denotrain@v0.4.4/mod.ts";
import { addVillager, getAllVillagers, editVillager, deleteVillager } from "../models/villagers.ts";

const api = new Router();

api.get("/", (ctx) => {
    return getAllVillagers().then((result: any) => {
        return result.rows;
    })
})

api.post("/", (ctx) => {
    const body = {
        name: ctx.req.body.name,
        gender: ctx.req.body.gender,
        personality: ctx.req.body.personality,
        birthday: ctx.req.body.birthday,
    }

    return addVillager(body).then((villager: any) => {
        ctx.res.setStatus(201);
        return villager;
    })
})

api.patch("/:id", (ctx) => {
    const body = {
        name: ctx.req.body.name,
        gender: ctx.req.body.gender,
        personality: ctx.req.body.personality,
        birthday: ctx.req.body.birthday,
    }

    return editVillager(ctx.req.params.id as number, body).then((result: any) => {
        return result;
    })
});

api.delete("/:id", ctx => {
    return deleteVillager(ctx.req.params.id as number).then(() => {
        ctx.res.setStatus(204);
        return true;
    })
});

export default api;