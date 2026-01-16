import User from "../models/User.js";
import { comparePassword, hashPassword } from "../lib/hash.js";
import { generateToken } from "../lib/generator.js";

// Operation: Registers a new user and stores the data into the database while also creating cookie for 30 days
// Additional Utilities:
//     - generateToken which uses jsonwebtoken
//     - hashPassword which uses bcryptjs
// Inputs: email and password from request body
// Outputs:
//   Success:
//     status: 201
//     message: "User registered successfully"
//     data: all data except passwordHash and passwordSalt
//     error: null
//   User not found:
//     status: 409
//     message: "Email already in use"
//     data: null
//     error: null
//   Failure:
//     status: 500
//     message: "Internal server error"
//     error: error message string
export async function registerAuth(req, res) {
  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user)
      return res
        .status(409)
        .json({ message: "Email already in use", data: null, error: null });

    const token = generateToken();
    const cookieOption = {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    };

    const { salt, hash } = await hashPassword(password);

    const newUser = new User({
      name,
      email,
      passwordSalt: salt,
      passwordHash: hash,
    });

    await newUser.save();

    const dataResponse = newUser.toObject();

    delete dataResponse.passwordHash;
    delete dataResponse.passwordSalt;

    res.status(201).cookie("token", token, cookieOption).json({
      message: "User registered successfully",
      data: dataResponse,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      data: null,
      error: error.message,
    });
  }
}

// Operation: Logs in the user and also creates the cookie for 30 days
// Additional Utilities:
//     - generateToken which uses jsonwebtoken
//     - comparePassword which uses bcryptjs
// Inputs: email and password from request body
// Outputs:
//   Success:
//     status: 200
//     message: "Logged in successfully"
//     data: all data except passwordHash and passwordSalt
//     error: null
//   User not found:
//     status: 401
//     message: "Invalid credentials"
//     data: null
//     error: null
//   Failure:
//     status: 500
//     message: "Internal server error"
//     error: error message string
export async function loginAuth(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", data: null, error: null });
    }

    const passwordMatch = await comparePassword(password, user.passwordHash);

    if (!passwordMatch)
      return res
        .status(401)
        .json({ message: "Invalid credentials", data: null, error: null });
    const token = generateToken(user._id);
    const cookieOption = {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    };

    const userData = user.toObject();

    delete userData.passwordHash;
    delete userData.passwordSalt;

    res.status(200).cookie("token", token, cookieOption).json({
      message: "Logged in successfully",
      data: userData,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      data: null,
      error: error.message,
    });
  }
}

// Operation: Logs out the user by creating a cookie with blank string with expire date at Date(0)
// Additional Utilities: None
// Inputs: None
// Outputs:
//   Success:
//     status: 200
//     message: "Logged in successfully"
//     data: null
//     error: null
//   Failure:
//     status: 500
//     message: "Internal server error"
//     data: null
//     error: error message string
export async function logoutAuth(_, res) {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res
      .status(200)
      .json({ message: "Logged out successfully", data: null, error: null });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      data: null,
      error: error.message,
    });
  }
}
