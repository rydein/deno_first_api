import Dex from "https://deno.land/x/dex/mod.ts";
import client from "./config.ts";

// Setting the dialect for the query builder
let dex = Dex({client: "mysql"});
let table = "villagers";

interface Villager {
    id?: number,
    name: string,
    gender: string,
    personality: string,
    birthday: string
}

function addVillager(villager: Villager) {
    const insertQuery = dex.queryBuilder().insert([villager]).into(table).toString();
    return client.execute(insertQuery).then((result: any) => {
        const getQuery = dex.queryBuilder().select().from(table).where({id: result.lastInsertId}).toString();
        return client.execute(getQuery).then((result: any) => result.rows ? result.rows[0] : {});
    })
}

function getAllVillagers() {
    const getQuery = dex.queryBuilder().select("*").from(table).toString();
    return client.execute(getQuery);
}

function editVillager(id: number, villager: Villager) {
    const editQuery = dex.queryBuilder().from(table).update(villager).where({id}).toString();
    return client.execute(editQuery).then(() => {
        const getQuery = dex.queryBuilder.select().from(table).where({id}).toString();
        return client.execute(getQuery).then((result: any) => result.rows ? result.rows[0] : {});
    });
}

function deleteVillager(id: number) {
    const deleteQuery = dex.queryBuilder().from(table).delete().where({id}).toString();
    return client.execute(deleteQuery)
}

export {
    addVillager,
    getAllVillagers,
    editVillager,
    deleteVillager
}