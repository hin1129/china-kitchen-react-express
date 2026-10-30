import express from "express";
import User from "../models/user.model.js";
import { body, validationResult } from "express-validator";
import { rateLimit } from "express-rate-limit";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { verifyToken } from "../middleware/VerifyToken.js";

dotenv.config();

export const router = express.Router();

const normalCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 1000,
};

const pendingAdminCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 5 * 60 * 1000,
};

const signInLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    message:
      "Too many failed sign-in attempts. Please wait and try again.",
  },
});

router.post(
  "/signin",
  signInLimiter,
  [
    body("email")
      .isEmail()
      .withMessage("Invalid email format")
      .normalizeEmail(),
    body("password")
      .notEmpty()
      .withMessage("Password is required"),
  ],
  async (request, response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { email, password } = request.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        await bcrypt.compare(
          password,
          "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
        );

        return response.status(401).json({
          message: "Invalid email or password",
        });
      }

      const passwordMatches = await bcrypt.compare(
        password,
        user.password
      );

      if (!passwordMatches) {
        return response.status(401).json({
          message: "Invalid email or password",
        });
      }

      if (!user.isEmailVerified) {
        return response.status(403).json({
          message: "Email not verified",
          code: "EMAIL_NOT_VERIFIED",
        });
      }

      if (user.role === "admin") {
        const pendingToken = jwt.sign(
          {
            userId: user._id.toString(),
            purpose: "admin-2fa",
          },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "5m",
          }
        );

        response.cookie(
          "admin2fa",
          pendingToken,
          pendingAdminCookieOptions
        );

        return response.status(200).json({
          message: user.twoFactorEnabled
            ? "Two-factor authentication required"
            : "Two-factor authentication setup required",
          requiresTwoFactor: true,
          requiresTwoFactorSetup:
            !user.twoFactorEnabled,
        });
      }

      const token = jwt.sign(
        {
          userId: user._id.toString(),
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );

      response.cookie(
        "token",
        token,
        normalCookieOptions
      );

      return response.status(200).json({
        message: "Login successful",
        user: {
          id: user._id,
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      });
    }
    catch (error) {
      console.error("Signin error:", error);

      return response.status(500).json({
        message: "Server error while signing in",
      });
    }
  }
);

router.post("/logout", (request, response) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  };

  response.clearCookie("token", cookieOptions);
  response.clearCookie("admin2fa", cookieOptions);

  return response.json({
    message: "Logged out successfully",
  });
});

router.get("/me", verifyToken, async (request, response) => {
  try {
    const user = await User.findById(
      request.user.userId
    ).select(
      "username fullName email role"
    );

    if (!user) {
      return response.status(401).json({
        message: "User not found",
      });
    }

    return response.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  }
  catch (error) {
    console.error(error);

    return response.status(500).json({
      message: "Failed to retrieve user",
    });
  }
});
