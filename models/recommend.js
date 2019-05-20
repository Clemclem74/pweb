var mongoose = require('mongoose');

var recommendSchema = new mongoose.Schema({
    idFilm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Film'
    },
    idUserFrom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    idUserTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});


var Recommend = mongoose.model('Recommend', recommendSchema, 'Recommend');
module.exports = Recommend;
