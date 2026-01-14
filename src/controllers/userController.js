import User from "../models/User.js";
import { hashPassword } from "../lib/hash.js";

// Operation: Gets all the users
// Additional Utilities: None
// Inputs: none
// Outputs:
//   Success:
//     status: 200
//     message: "Fetched all users"
//     data: array of all users
//     error: null
//   Failure:
//     status: 500
//     message: "Internal server error"
//     data: {}
//     error: error message string
export async function getAllUsers(req, res) {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;

  const skip = (page - 1) * limit;

  try {
    const totalUsers = await User.countDocuments();
    const users = await User.find().skip(skip).limit(limit);

    const startPoint = skip + 1;
    const endPoint =
      skip + Number(limit) < totalUsers ? skip + Number(limit) : totalUsers;

    const totalPagesRead = endPoint - startPoint + 1;

    const normalMessage =
      startPoint > totalUsers
        ? `No data beyond record ${totalUsers}`
        : `Fetched ${totalPagesRead} user records out of ${totalUsers} records from record ${startPoint} to record ${endPoint}`;

    const responseMessage =
      totalUsers < 1 ? `No data in database` : normalMessage;

    res.status(200).json({
      message: responseMessage,
      data: users,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      data: null,
      error: error.message,
    });
  }
}

// Operation: Gets an user by id
// Additional Utilities: None
// Inputs: user_id from request params
// Outputs:
//   Success:
//     status: 200
//     message: "Fetched user"
//     data: user object
//     error: blank string
//   User not found:
//     status: 404
//     message: "User not found"
//     data: null
//     error: blank string
//   Failure:
//     status: 500
//     message: "Internal server error"
//     data: null
//     error: error message string
export async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", data: null, error: null });
    }
    res
      .status(200)
      .json({ message: "Fetched user record", data: user, error: null });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      data: null,
      error: error.message,
    });
  }
}

// Operation: Creates a new user
// Additional Utilities: hashPassword for creating a salt and hash of the password
// Inputs: email and password from request body
// Outputs:
//   Success:
//     status: 201
//     message: "User created successfully"
//     data: user object
//     error: blank string
//   Failure:
//     status: 500
//     message: "Internal server error"
//     data: {}
//     error: error message string
export async function createUser(req, res) {
  try {
    const { name, email, password } = req.body;
    const { salt, hash } = await hashPassword(password);
    const newUser = new User({
      name,
      email,
      passwordSalt: salt,
      passwordHash: hash,
    });
    await newUser.save();
    res.status(201).location(`api/v1/users/${newUser._id}`).json({
      message: "User created successfully",
      data: newUser,
      error: null,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already exists",
        data: null,
        error: null,
      });
    }

    res.status(500).json({
      message: "Internal server error",
      data: null,
      error: error.message,
    });
  }
}

// Operation: Updates a user data via patch request
// Additional Utilities: hashPassword for updating a salt and hash of the password
// Inputs: user_id from request params, email and password from request body
// Outputs:
//   Success:
//     status: 200
//     message: "User updated successfully"
//     data: user object
//     error: blank string
//   User not found:
//     status: 404
//     message: "User not found"
//     data: {}
//     error: blank string
//   Failure:
//     status: 500
//     message: "Internal server error"
//     error: error message string
export async function updateUser(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findById(req.params.id);

    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", data: null, error: null });

    if (email !== user.email)
      return res
        .status(400)
        .json({ message: "Email cannot be changed", data: null, error: null });

    const { salt, hash } = await hashPassword(password);
    user.passwordSalt = salt;
    user.passwordHash = hash;
    await user.save();

    res.status(200).location(`/api/v1/users/${user._id}`).json({
      message: "User record updated successfully",
      data: user,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      message: error,
      data: null,
      error: error.message,
    });
  }
}

// Operation: Deletes a user data via delete request
// Additional Utilities: None
// Inputs: user_id from request params, email and password from request body
// Outputs:
//   Success:
//     status: 200
//     message: "Deleted user XXXXXXXXXXX successfully"
//     data: null
//     error: null
//   User not found:
//     status: 404
//     message: "User not found"
//     data: null
//     error: null
//   Failure:
//     status: 500
//     message: "Internal server error"
//     error: error message string
export async function deleteUserById(req, res) {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser)
      return res
        .status(404)
        .json({ message: "User not found", data: null, error: null });

    res.status(200).json({
      message: `Deleted user ${userId} successfully`,
      data: null,
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

// Operation: Verifies user through cookie token
// Additional Utilities: None
// Inputs: None
// Outputs:
//   Success:
//     status: 200
//     message: "User data retrieved successfully"
//     data: data of user
//     error: null
//   User not found:
//     status: 404
//     message: "User not found"
//     data: null
//     error: null
//   Failure:
//     status: 500
//     message: "Internal server error"
//     error: error message string
export async function userVerification(req, res) {
  try {
    const user = await User.findById(req.user.id).select(
      "-passwordHash -passwordSalt"
    );

    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", data: null, error: null });

    res.status(200).json({
      message: "User data retrieved successfully",
      data: user,
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
