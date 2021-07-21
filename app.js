
import bodyParser from 'body-parser'
import Express from 'express'
import Mongoose from 'mongoose'
import { CONNECTION_URI } from './config/connectMongo.js'
import { UserModel } from './model/User.js'
import { ScoreModel } from './model/UserScore.js'

const app = new Express()
const PORT = '3001'

app.use(bodyParser.json({ limit: '50mb' }))
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
  })
)
Mongoose.connect(CONNECTION_URI).then(() => {
    console.log('connection Successful to MongoDB')
}).catch((e) =>{
    console.log(e,'some error occured')
})

app.get('/', (request, response, next) => {
    return response.status('200').json({"test": "hello_world"})
  })
app.get('/user', async (request, response, next) => {
    const userList  = await UserModel.find({})
    return response.status('200').json(userList)
})
app.post('/user', async (request, response, next) => {
    const { userDetails = {}, scores = [] } = request.body
    let userList  = await UserModel.create(userDetails)
    if (scores.length ) {
        scores.forEach(async (score) =>{
            score.userID = userDetails.userID
            await ScoreModel.create(score)
        })
    }
    if(userList){
        return response.status('200').json(userList)
    } else {
        return response.status('400').json({"status":400, "message": "bad request"})
    }
})

app.post('/user/filter/:userID?', async (request, response) => {
    const userID = request.params.userID
    const { subjectName = '' } = request.body
    if (userID) {
        let user  = await UserModel.findOne({userID: userID})
        let query = {userID: user.userID}
        if(subjectName) {
            query = { userID: user.userID, subjectName: subjectName}
        }
        var score =  await ScoreModel.find(query)
        user.score = score
        return response.status('200').json(user)
    } else {
        return response.status('400').json({"status":400, "message": "bad request"})
    }
})

const server = app.listen(PORT, () => {
console.log(`server started on ${PORT}`)
})
