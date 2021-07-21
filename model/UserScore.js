
import Mongoose from 'mongoose'


const ScoreSchema = Mongoose.Schema({
    subjectName: String,
    userID: String,
    score: Number
}, {
    timestamps: true
})

const ScoreModel = Mongoose.model('Score', ScoreSchema)

export { ScoreModel }