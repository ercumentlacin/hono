import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { sql } from './sql';

sqlite3.verbose();

type SqlParams = string | number | null;

// function runQueries(db: sqlite3.Database) {
//     db.all(`
//     select hero_name, is_xman, was_snapped from hero h
//     inner join hero_power hp on h.hero_id = hp.hero_id
//     where hero_power = ?`, "Total Nerd", (err, rows) => {
//         rows.forEach((row: any) => {
//             console.log(row.hero_name + "\t" +
//                 row.is_xman + "\t" +
//                 row.was_snapped);
//         });
//     });
// }

// function createTables(newdb: sqlite3.Database) {
//     newdb.exec(`
//     create table hero (
//         hero_id int primary key not null,
//         hero_name text not null,
//         is_xman text not null,
//         was_snapped text not null
//     );
//     insert into hero (hero_id, hero_name, is_xman, was_snapped)
//         values (1, 'Spiderman', 'N', 'Y'),
//                (2, 'Tony Stark', 'N', 'N'),
//                (3, 'Jean Grey', 'Y', 'N');

//     create table hero_power (
//         hero_id int not null,
//         hero_power text not null
//     );

//     insert into hero_power (hero_id, hero_power)
//         values (1, 'Web Slinging'),
//                (1, 'Super Strength'),
//                (1, 'Total Nerd'),
//                (2, 'Total Nerd'),
//                (3, 'Telepathic Manipulation'),
//                (3, 'Astral Projection');
//         `, () => {
//         runQueries(newdb);
//     });
// }

// export const db = new Database('../../mcu.db', {
//     verbose: console.log
// });

export  const db = async () => {
    return open({
        filename: '../../mcu.db',
        driver: sqlite3.Database
    });
}
export  const createDbConnection = async () => {
    return open({
        filename: '../../mcu.db',
        driver: sqlite3.Database
    });
}

const quotes = (str: string) => `'${str.replace("'", "\\'")}'`

// const sql = (strings: TemplateStringsArray, ...values: SqlParams[]) => {
//     return strings.reduce((prev, string, index) => {
//         return `${prev}${string}${(values && values[index]) ?  quotes(values[index] as string) : ""}`
//     }, "")
//   };
  

// sql`CREATE TABLE IF NOT EXISTS users (
//     id BLOB PRIMARY KEY NOT NULL,
//     name TEXT NOT NULL,
//     email TEXT NOT NULL,
//     password TEXT NOT NULL
// )`

