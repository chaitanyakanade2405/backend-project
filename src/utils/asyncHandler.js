const asyncHandler = (requestHandler) => {
    return (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next)).catch((err) => next(err))
    }
}

export {asyncHandler};

//try catch method
// const asyncHandler = (func) => async(req,res,next) => {
//     try{
//         await func(req,res,next);
//     }catch(err) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message,
//     })
// }