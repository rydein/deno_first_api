
### DB migration

https://deno.land/x/nessie

init

```bash
# nessie.config.ts を作成してdb接続情報を追記する
$ deno run --allow-net --allow-read --allow-write https://deno.land/x/nessie/cli.ts init
```

DB接続情報を追記する

```javascript
const configMySql = {
  migrationFolder: `./migrations`,
  connection: {
    hostname: "localhost", // hostからDockerのMySQLコンテナに繋ぐ
    port: 3306,
    username: "root",
    password: "Passw0rd",
    db: "deno-dev",
  },
  dialect: "mysql",
};

export default configMySql;
```


```bash
# 村民のmigration
$deno run --allow-net --allow-read --allow-write https://deno.land/x/nessie/cli.ts make create_villagers
```

村民テーブルの定義を作成する

```javascript
import { Schema } from "https://deno.land/x/nessie/mod.ts";

migration ファイルにテーブル情報を追加する
export const up = (schema: Schema): void => {
    schema.create("villagers", (table) => {
        table.id();
        table.string("name", 100).nullable();        // 名前
        table.string("gender", 100).nullable();      // 性別
        table.string("personality", 100).nullable(); // 性格
        table.string("birthday", 100).nullable();    // 誕生日
    });
};

export const down = (schema: Schema): void => {
    schema.drop("villagers");
};
```

```bash
#migration の実行
$ deno run --allow-net --allow-read https://deno.land/x/nessie/cli.ts migrate
```


### Query Builder

https://deno.land/x/dex


`models/villagers.ts` にDBに登録、取得する処理を作成する

```javascript
import Dex from "https://deno.land/x/dex/mod.ts";
import client from "./config.ts";

let dex = Dex({client: "mysql"});
let table = "villagers";

interface Villager {
    id?: number,
    name: string,
    gender: string,
    personality: string,
    birthday: string
}

///
/// 新しい村民を追加して追加したデータを返す
///
function addVillager(villager: Villager) {
    const insertQuery = dex.queryBuilder().insert([villager]).into(table).toString();
    return client.execute(insertQuery).then((result: any) => {
        const getQuery = dex.queryBuilder().select().from(table).where({id: result.lastInsertId}).toString();
        return client.execute(getQuery).then((result: any) => result.rows ? result.rows[0] : {});
    })
}

///
/// 全ての村民を返す
///
function getAllVillagers() {
    const getQuery = dex.queryBuilder().select("*").from(table).toString();
    return client.execute(getQuery);
}

///
/// 村民の更新を行う、更新されたデータを返す
///
function editVillager(id: number, villager: Villager) {
    const editQuery = dex.queryBuilder().from(table).update(villager).where({id}).toString();
    return client.execute(editQuery).then(() => {
        const getQuery = dex.queryBuilder.select().from(table).where({id}).toString();
        return client.execute(getQuery).then((result: any) => result.rows ? result.rows[0] : {});
    });
}

///
/// 村民の削除
///
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
```

### Http Server

https://deno.land/x/denotrain

`controllers/villagers.ts` にコントローラーを作成し、  
APIのルーティングを作成してリクエストを処理する  

```javascript
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
        name: ctx.req.body.make,
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
        name: ctx.req.body.make,
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
```

`index.ts` サーバーのエントリーポイントを用意し、作成したRouterとURLをセットする

```javascript
import { Application, Router } from "https://deno.land/x/denotrain@v0.4.4/mod.ts";
import api from "./controllers/villagers.ts";

const app = new Application({});
app.use("/api/villagers", api);

app.run();
```