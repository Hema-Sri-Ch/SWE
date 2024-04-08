export const accessControl = function(req, res, next) {
    try {
        const myLength = req.body.id.length;

        if(myLength == 4) req.user_type = 0;
        else if(myLength == 5) req.user_type = 1;
        else if(myLength == 14) req.user_type = 2;
        else req.user_type = 404;

        next();
    }

    catch(err) {
        console.log(err.message)
        req.status(401).json("Access control failed")
    }
}