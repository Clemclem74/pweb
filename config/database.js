module.exports = {
    database : process.env.MONGODB_URI || 'mongodb://localhost/users',
    secret : 'secret'
}