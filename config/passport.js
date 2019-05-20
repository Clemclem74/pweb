const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = function (passport) {
    passport.use(new LocalStrategy(function (username, password, done) {
        //Matching of username
        let query = { username: username };
        User.findOne(query, (err, user) => {
            if (err) {
                console.log(err);
            }
            if (!user) {
                return done(null)
            }

            // Matching of password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    console.log(err);
                }
                if (isMatch) {
                    return done(null, user);
                }
                else {
                    return done(null, false, { message: 'Mauvais mot de passe ' })
                }
            })

        })
    }))
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
}