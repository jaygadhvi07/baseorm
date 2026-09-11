export default class User extends Model {
    constructor() {
        this.fields = ["id","name","email","active","password"]
    }
}