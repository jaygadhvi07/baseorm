import DB from "./src/Database.js"

DB.migration("databasefile.db", (schema) => {

    schema.table("users", "User")
        .integer("id")
        .string("name")
        .string("email")
        .bool("active")
        .string("password")
        .hasMany("posts")

    schema.table("posts", "Post")
        .integer("id")
        .string("title")
        .string("description")
        .text("content")
        .bool("active")
        .integer("users_id")

    schema.create()
})

