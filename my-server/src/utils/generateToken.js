import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const isProduction = process.env.NODE_ENV === "production";
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction, // Use false for localhost
    sameSite: isProduction ? "none" : "lax", // Use lax for local development
    path: "/", // Always specify the root
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export default generateToken;
