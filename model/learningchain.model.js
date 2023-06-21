var mongoose = require('../connect_db')
const Schema = mongoose.Schema

const LearningChainSchema = new Schema({
    learnedDay: Date,
    idUser: String
}, {
    collection: 'learningchain'
})

const LearningChainModel = mongoose.model('learningchain', LearningChainSchema)

// class LearningChain {
//     constructor(idLearningChain, learnedDay, idUser) {
//         this.idLearningChain = idLearningChain
//         this.learnedDay = learnedDay
//         this.idUser = idUser
//     }
// }
module.exports = {
    LearningChainModel
}
module.exports.LearningChain = LearningChain