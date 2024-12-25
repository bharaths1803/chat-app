import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { email, fullName, password } = req.body;
    if (!email || !fullName || !password) {
      return res.status(400).json({ message: `All fields are required` });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: `Password must contain at least 6 characters` });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: `Email already exists` });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      fullName,
    });
    if (!newUser) {
      res.status(500).json({ message: `Invalid user data` });
    } else {
      generateToken(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    }
  } catch (error) {
    console.log(`Error in signup controller ${error.message}`);
    res.status(400).json({ message: `Internal server error` });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: `All fields are required` });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: `Invalid credentials` });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(404).json({ message: `Invalid credentials` });
    }
    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log(`Error in login controller ${error.message}`);
    res.status(500).json({ message: `Internal server error` });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: `Logged out succcessfully` });
  } catch (error) {
    console.log(`Error in logout controller ${error.message}`);
    res.status(500).json({ message: `Internal server error` });
  }
};
