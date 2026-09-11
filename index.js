import DB from "./src/Database.js"
import User from "./models/User.js"

DB.migration("databasefile.db", (schema) => {

    schema.table("users", "User")
        .integer("id", true , true)
        .string("name")
        .string("email")
        .bool("active")
        .string("password")
        .hasMany("posts")

    schema.table("posts", "Post")
        .integer("id", true, true)
        .string("title")
        .string("description")
        .text("content")
        .bool("active")
        .integer("users_id")

    schema.create()
})

const user = new User
user.posts.
