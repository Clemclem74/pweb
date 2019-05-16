module.exports = {
    ensureAuthenticated : function( req , res , next ) {
        if (req.isAuthenticated()){
            return next();
        }
        else {
            req.flash('failure' , 'Connectez vous pour acceder à cette page');
            res.redirect('/');
        }
    },

    ensureNotAuthenticated : function( req , res , next ) {
        if (req.isAuthenticated()){
            req.flash('failure' , 'Vous êtes déjà connecté');
            res.redirect('/');
        }
        else {
            return next();
        }
    }
}

// To applicate it : 
//const { ensureAuthenticated } = require('../config/auth');
// put in 2nd parameter of the function 
//https://www.youtube.com/watch?v=6FOq4cUdH8k      1.22.50