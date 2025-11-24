import jwt from "jsonwebtoken";

export const genToken = ({ email }) => {
  if (!email) return null;

  return jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "12d",
  });
};
