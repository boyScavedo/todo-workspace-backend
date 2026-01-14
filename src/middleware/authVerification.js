import JWT from "jsonwebtoken";

// Operation: Middleware to verify cookie token
// Additional Utilities: jsonwebtoken
// Inputs: token inside the cookies provided with request (req.cookies.token)
// Outputs:
//   Success:
//     message: "Deleted user XXXXXXXXXXX successfully"
//     passes the user data from cookie to req.user for the controller to use via next
//   Unauthorized:
//     status: 401
//     message: "Unauthorized"
//     data: null
//     error: null
//   Token expired:
//     status: 403
//     message: "Token Expired"
//     data: null
//     error: error message string
export default function authVerification(req, res, next) {
  const token = req.cookies.token;

  if (!token || token == null)
    return res
      .status(401)
      .json({ message: "Unauthorized", data: null, error: null });

  JWT.verify(token, process.env.JWT_SECRET_KEY, (error, user) => {
    if (error)
      return res
        .status(403)
        .json({ message: "Token Expired", data: null, error: null });
    req.user = user;
    next();
  });
}
