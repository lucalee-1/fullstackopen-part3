module.exports.errorHandler = (err, req, res, next) => {
    console.log(err.message);  
    if (err.name === "CastError") {
      return res.status(400).send({ error: "malformatted id" });
    }
    if (err.name === "ValidationError") {
        return res.status(400).send({ error: err.message });
      }
    next(err);
  };