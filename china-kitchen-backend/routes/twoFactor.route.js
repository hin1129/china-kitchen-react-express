import express from "express";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { rateLimit } from "express-rate-limit";
import User from "../models/user.model.js";
import {
  encryptTwoFactorSecret,
  decryptTwoFactorSecret,
} from "../utils/twoFactorCrypto.js";

export const router = express.Router();

const twoFactorLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message:
      "Too many two-factor attempts. Please wait and try again.",
  },
});

const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 1000,
};

const clearPendingCookie = (response) => {
  response.clearCookie("admin2fa", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
};

const getPendingAdmin = async (
  request,
  response
) => {
  const pendingToken =
    request.cookies?.admin2fa;

  if (!pendingToken) {
    response.status(401).json({
      message:
        "Admin sign-in challenge expired. Please sign in again.",
      code: "ADMIN_2FA_CHALLENGE_EXPIRED",
    });

    return null;
  }

  let decoded;

  try {
    decoded = jwt.verify(
      pendingToken,
      process.env.JWT_SECRET_KEY
    );
  }
  catch (error) {
    clearPendingCookie(response);

    response.status(401).json({
      message:
        "Admin sign-in challenge expired. Please sign in again.",
      code: "ADMIN_2FA_CHALLENGE_EXPIRED",
    });

    return null;
  }

  if (
    decoded.purpose !== "admin-2fa" ||
    !decoded.userId
  ) {
    clearPendingCookie(response);

    response.status(401).json({
      message: "Invalid admin sign-in challenge",
    });

    return null;
  }

  const user = await User.findById(
    decoded.userId
  ).select(
    "+twoFactorSecretEncrypted"
  );

  if (!user || user.role !== "admin") {
    clearPendingCookie(response);

    response.status(403).json({
      message: "Admin access required",
    });

    return null;
  }

  return user;
};

const issueAdminSession = (
  user,
  response
) => {
  const token = jwt.sign(
    {
      userId: user._id.toString(),
      twoFactorVerified: true,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );

  response.cookie(
    "token",
    token,
    authCookieOptions
  );

  clearPendingCookie(response);
};

const verifyCode = (
  secret,
  token
) => {
  return speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
    window: 1,
  });
};

router.post(
  "/admin/2fa/setup",
  twoFactorLimiter,
  async (request, response) => {
    try {
      const user =
        await getPendingAdmin(
          request,
          response
        );

      if (!user) {
        return;
      }

      if (user.twoFactorEnabled) {
        return response.status(400).json({
          message:
            "Two-factor authentication is already enabled",
        });
      }

      const secret =
        speakeasy.generateSecret({
          length: 32,
          name:
            `China Kitchen (${user.email})`,
          issuer: "China Kitchen",
        });

      user.twoFactorSecretEncrypted =
        encryptTwoFactorSecret(
          secret.base32
        );

      await user.save();

      const qrCodeDataUrl =
        await QRCode.toDataURL(
          secret.otpauth_url
        );

      return response.json({
        message:
          "Scan the QR code and enter the 6-digit code to finish setup",
        qrCodeDataUrl,
      });
    }
    catch (error) {
      console.error(
        "2FA setup error:",
        error
      );

      return response.status(500).json({
        message:
          "Failed to start two-factor authentication setup",
      });
    }
  }
);

router.post(
  "/admin/2fa/setup/verify",
  twoFactorLimiter,
  async (request, response) => {
    try {
      const user =
        await getPendingAdmin(
          request,
          response
        );

      if (!user) {
        return;
      }

      if (user.twoFactorEnabled) {
        return response.status(400).json({
          message:
            "Two-factor authentication is already enabled",
        });
      }

      const token =
        String(
          request.body?.code || ""
        ).trim();

      if (!/^\d{6}$/.test(token)) {
        return response.status(400).json({
          message:
            "Enter a valid 6-digit authentication code",
        });
      }

      if (!user.twoFactorSecretEncrypted) {
        return response.status(400).json({
          message:
            "Start two-factor setup again",
        });
      }

      const secret =
        decryptTwoFactorSecret(
          user.twoFactorSecretEncrypted
        );

      if (!verifyCode(secret, token)) {
        return response.status(401).json({
          message:
            "Invalid authentication code",
        });
      }

      user.twoFactorEnabled = true;
      await user.save();

      issueAdminSession(
        user,
        response
      );

      return response.json({
        message:
          "Two-factor authentication enabled",
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
      console.error(
        "2FA setup verification error:",
        error
      );

      return response.status(500).json({
        message:
          "Failed to verify two-factor authentication",
      });
    }
  }
);

router.post(
  "/admin/2fa/verify",
  twoFactorLimiter,
  async (request, response) => {
    try {
      const user =
        await getPendingAdmin(
          request,
          response
        );

      if (!user) {
        return;
      }

      if (
        !user.twoFactorEnabled ||
        !user.twoFactorSecretEncrypted
      ) {
        return response.status(400).json({
          message:
            "Two-factor authentication setup is required",
        });
      }

      const token =
        String(
          request.body?.code || ""
        ).trim();

      if (!/^\d{6}$/.test(token)) {
        return response.status(400).json({
          message:
            "Enter a valid 6-digit authentication code",
        });
      }

      const secret =
        decryptTwoFactorSecret(
          user.twoFactorSecretEncrypted
        );

      if (!verifyCode(secret, token)) {
        return response.status(401).json({
          message:
            "Invalid authentication code",
        });
      }

      issueAdminSession(
        user,
        response
      );

      return response.json({
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
      console.error(
        "2FA verification error:",
        error
      );

      return response.status(500).json({
        message:
          "Failed to verify two-factor authentication",
      });
    }
  }
);

export default router;
