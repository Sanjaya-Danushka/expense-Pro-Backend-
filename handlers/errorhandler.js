const errorhandler = (error, req, res,next) => {
    if(error){
        res.status(400).json({status:400, message:error.message})
    }
    next(error)
}

module.exports = errorhandler
