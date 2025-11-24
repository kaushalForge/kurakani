import express from "express";

const router = express.Router();

// @route /
// @desc server homepage route
router.get("/", (req, res) => {
  res.send("Welcome to Kurakani API!");
});

export default router;
