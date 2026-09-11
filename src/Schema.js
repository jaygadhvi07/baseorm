import DB from "./Database.js"
import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "url"

export default class Schema {

    constructor(database) {
        this._database = database
        this.schema = []
        this.tablename = null
        this.relationships = []
    }

    table = (tableName, model) => {

        this.tablename = {
            tableName,
            model,
            fields: [],
        }

        this.schema.push(this.tablename)

        return this
    }

    bool = (field) => {
        this.tablename.fields.push(`${field} BOOLEAN`)
        return this
    }

    integer = (field, PK = false, increment = false) => {
        // this.fields.push(`${field} INTEGER ${PK ? 'PRIMARY KEY' : ''} ${increment ? 'AUTOINCREMENT' : ''}`)
        
        this.tablename.fields.push(`${field} INTEGER ${PK ? 'PRIMARY KEY' : ''} ${increment ? 'AUTOINCREMENT' : ''}`)
        return this
    }

    text = (field) => {
        this.tablename.fields.push(`${field} TEXT`)
        return this
    }

    string = (field, size='255', PK = false) => {
        this.tablename.fields.push(`${field} VARCHAR(${size}) ${PK ? 'PRIMARY KEY' : ''}`)
        return this
    }

    schema = () => {
        const schema = this._database.prepare(`PRAGMA table_info(${this.table})`).all()
        return schema 
    }

    #model = async (tabledata) => {
        console.log("generate model here")


        const dir = path.join(process.cwd(), "models")
        await fs.mkdir(dir, { recursive: true })

        let fields = []
        tabledata.fields.map((ele) => {
            fields.push(String(ele.split(" ")[0]))
        })

        // console.log(fields)

        const content = dedent(`
        export default class ${tabledata.model} extends Model {
            constructor() {
                this.fields = ${JSON.stringify(fields)}
            }
        }
        `)

        await fs.writeFile(path.join(dir, `${tabledata.model}.js`), content, 'utf-8')
    }

    create = () => {

        for(let i = 0; i < this.schema.length; i++) {

            // console.log("schema", this.schema[i])
            // console.log("schema", this.relationships)

            this.relationships.map((ele) => {
                console.log("this ele", ele)
                /*console.log("matching", this.schema[i].tableName, ele[this.schema[i].tableName])
                console.log("whole table", this.schema[i].fields.push(ele[this.schema[i].tableName]))*/
                if (ele[this.schema[i].tableName] != undefined) {
                    this.schema[i].fields.push(ele[this.schema[i].tableName])
                }
            })


            console.log("fields", this.schema[i].tableName, this.schema[i].fields)

            const statement = `SELECT EXISTS (SELECT 1 FROM sqlite_master WHERE type='table' AND name='${this.schema[i].tableName}')`
            const exists = this._database.exec(statement)

            if (exists) {
                console.error("table already exists!")
            }

            const schema = `CREATE TABLE IF NOT EXISTS ${this.schema[i].tableName} (`+ this.schema[i].fields.join(", ") + `)`
            console.log("schema", schema)

            this._database.exec(schema)
            this.#model(this.schema[i])
        }

        return this
    }

    hasMany = (tablename) => {
        this.relationships.push({ [tablename] : `FOREIGN KEY (${this.tablename.tableName + '_id'}) REFERENCES ${this.tablename.tableName}(id)`})
    }

    belongsTo = () => {

    }
}

function dedent(str) {
  const lines = str.split("\n");

  // Remove empty first/last lines
  while (lines.length && lines[0].trim() === "") lines.shift();
  while (lines.length && lines[lines.length - 1].trim() === "") lines.pop();

  // Find the smallest indentation
  const indent = Math.min(
    ...lines
      .filter(line => line.trim())
      .map(line => line.match(/^[ \t]*/)[0].length)
  );

  return lines.map(line => line.slice(indent)).join("\n");
}
