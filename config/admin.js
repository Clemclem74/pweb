module.exports = {
    ensureAdmin : function( req , res , next ) {
        if (req.user.isAdmin){
            return next();
        }
        else {
            req.flash('error_msg' , 'Il faut etre admin pour acceder à cette page');
            res.redirect('/');
        }
    }
}

// To applicate it : 
//const { ensureAuthenticated } = require('../config/auth');
// put in 2nd parameter of the function 
//https://www.youtube.com/watch?v=6FOq4cUdH8k      1.22.50