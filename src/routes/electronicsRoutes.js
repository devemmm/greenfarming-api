const express = require("express");
const { notifyFarm, checkFarmData } = require("../services/AppService");

const router = express.Router();

router
  .get("/data", async (req, res) => {
    const { fid, type, report, email } = req.query;

    try {
      if (!fid) {
        throw new Error("farm id required!");
      }

      const data = await checkFarmData({ type, fid, report, email });

      res.status(200).json({ status: 200, message: "successfull", data });
    } catch (error) {
      res
        .status(400)
        .send({ status: 400, error: true, message: error.message });
    }
  })

  .get("/users/notify/:fid", async (req, res) => {
    try {
      req.query.fid = req.params.fid;

      const data = await notifyFarm(req.query);

      return res.status(201).json({ status: 201, message: "sucessfull", data });
    } catch (error) {
      res.status(400).json({
        status: 400,
        error: true,
        message: "failed",
        errorMessage: error.message,
      });
    }
  })

  .get("/**", (req, res) => {
    res.status(404).json({
      status: 400,
      error: true,
      message: "not found",
      errorMessage: "router not found",
    });
  })

  .post("/**", (req, res) => {
    res.status(404).json({
      status: 400,
      error: true,
      message: "not found",
      errorMessage: "router not found",
    });
  })

  .patch("**", (req, res) => {
    res.status(404).json({
      status: 400,
      error: true,
      message: "not found",
      errorMessage: "router not found",
    });
  })

  .delete("**", (req, res) => {
    res.status(404).json({
      status: 400,
      error: true,
      message: "not found",
      errorMessage: "router not found",
    });
  });

module.exports = router;
