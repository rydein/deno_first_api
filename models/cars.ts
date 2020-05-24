import Dex from "https://deno.land/x/dex/mod.ts";
import client from "./config.ts";

// Setting the dialect for the query builder
let dex = Dex({client: "mysql"});

interface Car {
    id?: number,
    make: string,
    model: string,
    year: number
}

function addCar(car: Car) {
    const insertQuery = dex.queryBuilder().insert([car]).into("cars").toString();
    return client.execute(insertQuery).then((result: any) => {
        const getQuery = dex.queryBuilder().select().from("cars").where({id: result.lastInsertId}).toString();
        return client.execute(getQuery).then((result: any) => result.rows ? result.rows[0] : {});
    })
}

function getAllCars() {
    const getQuery = dex.queryBuilder().select("*").from("cars").toString();
    return client.execute(getQuery);
}

function editCar(id: number, car: Car) {
    const editQuery = dex.queryBuilder().from("cars").update(car).where({id}).toString();
    return client.execute(editQuery).then(() => {
        const getQuery = dex.queryBuilder.select().from("cars").where({id}).toString();
        return client.execute(getQuery).then((result: any) => result.rows ? result.rows[0] : {});
    });
}

function deleteCar(id: number) {
    const deleteQuery = dex.queryBuilder().from("cars").delete().where({id}).toString();
    return client.execute(deleteQuery)
}

export {
    addCar,
    getAllCars,
    editCar,
    deleteCar
}