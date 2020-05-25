import { Schema } from "https://deno.land/x/nessie/mod.ts";

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
