module.exports.errorHandler = (err, req, res, next) => {
    console.log(err.message);  
    if (err.name === "CastError") {
      return res.status(400).send({ err: "malformatted id" });
    }
    next(err);
  };