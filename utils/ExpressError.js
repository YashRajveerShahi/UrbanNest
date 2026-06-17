// this is used to send diffn responses with diiffn mesage, status codde 
class ExpressError extends Error{
    constructor(statusCode, message){
        super();
        this.statusCode=statusCode;
        this.message=message;
    }
}
module.exports=ExpressError;