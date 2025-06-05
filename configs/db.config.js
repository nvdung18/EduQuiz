const mongoose = require('mongoose');
const mongodbUrl = process.env.MONGO_DB_URL;
mongoose
    .connect(mongodbUrl, {})
    .then(() => console.log('Connected!'))
    .catch((error)=>{
        console.log(error);
    })
// mongoose.connect('mongodb://127.0.0.1:27017/testEdu')
//     .then(() => console.log('Connected!'));
module.exports = mongoose

