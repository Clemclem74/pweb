module.exports = {
    ensureAuthenticated : function( req , res , next ) {
        if (req.isAuthenticated()){
            return next();
        }
        else {
            req.flash('error_msg' , 'Connectez vous pour acceder à cette page');
            res.redirect('/user/login');
        }
    }
}

// To applicate it : 
//const { ensureAuthenticated } = require('../config/auth');
// put in 2nd parameter of the function 
//https://www.youtube.com/watch?v=6FOq4cUdH8k      1.22.50