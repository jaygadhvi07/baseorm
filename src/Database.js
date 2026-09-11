import Database from "better-sqlite3"
import Schema from "./Schema.js"

export default class DB {

    static conn = null;
    static schema = null;

    constructor(filename) {
        if(!DB.conn) {
            DB.conn = new Database(filename)
        }

        if(!DB.schema) {
            DB.schema = new Schema(DB.conn)
        }
    }

    static migration(filename, callback) {
        new DB(filename)

        callback(DB.schema)
    }
}
