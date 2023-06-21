const mongoose = require('mongoose');
const mongodbUrl = `mongodb://${process.env.MONGGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;
mongoose
    .connect(mongodbUrl, {})
    .then(() => console.log('Connected!'))
    .catch((error)=>{
        console.log(error);
    })
// mongoose.connect('mongodb://127.0.0.1:27017/testEdu')
//     .then(() => console.log('Connected!'));
module.exports = mongoose

