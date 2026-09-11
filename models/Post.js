export default class Post extends Model {
    constructor() {
        this.fields = ["id","title","description","content","active","users_id","FOREIGN"]
    }
}