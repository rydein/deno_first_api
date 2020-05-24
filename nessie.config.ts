
const configMySql = {
  migrationFolder: `./migrations`,
  connection: {
    hostname: "localhost",
    port: 3306,
    username: "root",
    password: "Passw0rd",
    db: "deno-dev",
  },
  dialect: "mysql",
};

export default configMySql;
