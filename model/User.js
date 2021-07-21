
import Mongoose from 'mongoose'


const UserSchema = Mongoose.Schema({
    name: String,
    userID: String,
    details: String,
    score: Object

}, {
    timestamps: true
})

const UserModel = Mongoose.model('User', UserSchema)

export { UserModel }