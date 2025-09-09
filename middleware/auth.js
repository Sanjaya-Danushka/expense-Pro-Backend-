const auth = (req, res, next) => {
  console.log(req.headers);

  const accessToken = req.headers.authorization.replace("Bearer ", "");
  console.log(accessToken);
  next();
};

module.exports = auth;
