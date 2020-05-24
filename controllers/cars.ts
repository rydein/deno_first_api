import { Router } from "https://deno.land/x/denotrain@v0.4.4/mod.ts";
import { addCar, getAllCars, editCar, deleteCar } from "../models/cars.ts";

const api = new Router();

api.get("/", (ctx) => {
    return getAllCars().then((result: any) => {
        return result.rows;
    })
})

api.post("/", (ctx) => {
    const body = {
        make: ctx.req.body.make,
        model: ctx.req.body.model,
        year: ctx.req.body.year,
    }

    return addCar(body).then((newCar: any) => {
        ctx.res.setStatus(201);
        return newCar;
    })
})

api.patch("/:id", (ctx) => {
    const car = {
        make: ctx.req.body.make,
        model: ctx.req.body.model,
        year: ctx.req.body.year,
    }

    return editCar(ctx.req.params.id as number, car).then((result: any) => {
        return result;
    })
});

api.delete("/:id", ctx => {
    return deleteCar(ctx.req.params.id as number).then(() => {
        ctx.res.setStatus(204);
        return true;
    })
});

export default api;