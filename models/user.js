var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    firstname : {
        type : String,
        required : true
    } ,
    lastname : {
        type : String,
        required : true
    } ,
    username : {
        type : String,
        required : true
    } ,
    mail : {
        type : String,
        required : true
    } ,
    password : {
        type : String,
        required : true
    } ,
    birthday : {
        type : Date,
        required : true
    } ,
    birtisAdmin : {
        type : Boolean,
        default : false,
        required : true
    }    
},
{versionKey: false}
);

userSchema.virtual('Review',{
    ref: 'Review',
    localField:'_id',
    foreignField:'idUser'
});

userSchema.virtual('Grade',{
    ref: 'Grade',
    localField:'_id',
    foreignField:'idUser'
});

userSchema.virtual('Recommend',{
    ref: 'Recommend',
    localField:'_id',
    foreignField:'idUserFrom'
});

userSchema.virtual('Recommend',{
    ref: 'Recommend',
    localField:'_id',
    foreignField:'idUserTo'
});

var Film = mongoose.model('User',userSchema,'User');
module.exports = Film;