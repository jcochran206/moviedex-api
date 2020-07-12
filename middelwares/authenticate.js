// require("dotenv").config();
module.exports = {
validateToken: (req, res, next) => {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get("Authorization");
    console.log(apiToken, authToken);
    if (!authToken || authToken.split(" ")[1] !== apiToken) {
      return res.status(401).json({ error: "Unauthorized request" });
    }
    // move to the next middleware
    next();
  }
}