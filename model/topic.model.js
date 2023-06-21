var mongoose = require('mongoose')
const Schema = mongoose.Schema

const TopicSchema = new Schema({
    nameTopic: {type:String, required:true},
}, {
    collection: 'topic'
})

const TopicModel = mongoose.model('topic', TopicSchema)

// class Topic {
//     constructor(idTopic, nameTopic) {
//         this.idTopic = idTopic
//         this.nameTopic = nameTopic
//     }
// }

module.exports = {
    TopicModel
}