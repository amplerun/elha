import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

// --- ROBUST FIREBASE INITIALIZATION BLOCK ---
const __dirname = path.resolve();
const serviceAccountPath = path.join(__dirname, 'server', 'config', 'serviceAccountKey.json');

try {
  // Check if the file actually exists before trying to read it
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    // Initialize the app only if it hasn't been initialized yet
    if (admin.apps.length === 0) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log("Firebase Admin SDK initialized successfully.");
    }
  } else {
    // This is not a fatal error, so we just warn the user.
    console.warn(`Firebase Admin: serviceAccountKey.json not found at path: ${serviceAccountPath}. Firebase auth bridge will not work.`);
  }
} catch (error) {
  // Catch any other errors (e.g., malformed JSON)
  console.error("Firebase Admin SDK Initialization Error:", error);
}
// --- END INITIALIZATION BLOCK ---


/**
 * @desc    Register a new user
 * @route   POST /api/users
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  const user = await User.create({ name, email, password });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

/**
 * @desc    Auth user & get token
 * @route   POST /api/users/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

/**
 * @desc    Firebase Auth Bridge
 * @route   POST /api/users/firebase-auth
 * @access  Public
 */
const firebaseAuthBridge = asyncHandler(async (req, res) => {
    const { firebaseToken } = req.body;
    if (!admin.apps.length) {
      res.status(500);
      throw new Error('Firebase Admin SDK not initialized. Cannot perform social login.');
    }
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const { uid, email, name } = decodedToken;
    let user = await User.findOne({ email });
    if (!user) {
        const randomPassword = Math.random().toString(36).slice(-16);
        user = await User.create({
            name: name || email, email, password: randomPassword, firebase_uid: uid,
        });
    } else {
        if (!user.firebase_uid) {
            user.firebase_uid = uid;
            await user.save();
        }
    }
    res.json({
        _id: user._id, name: user.name, email: user.email,
        role: user.role, token: generateToken(user._id),
    });
});

/**
 * @desc    Get user profile
 * @route   GET /api/users/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Get all users (Admin)
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

// Make sure to export all functions
export { 
    registerUser, 
    loginUser, 
    getMe, 
    firebaseAuthBridge, 
    getUsers 
};