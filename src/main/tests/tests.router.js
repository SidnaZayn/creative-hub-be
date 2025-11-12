import verifyToken from "../../middleware/auth.guard.js";
import authorize from "../../middleware/authorize.guard.js";
import express from "express";

const router = express.Router();

router.get("/protected-route", verifyToken, (req, res) => {
  try {
    return res.status(200).send({ message: "Success" });
  } catch (err) {
    console.log(err);
    return res.status(401).send({ error: true, message: err });
  }
});

router.get("/admin-protected-route", verifyToken, authorize(["ADMIN"]), (req, res) => {
  try {
    return res.status(200).send({ message: "Admin Access Granted" });
  } catch (err) {
    console.log(err);
    return res.status(401).send({ error: true, message: err });
  }
})

router.get("/user-protected-route", verifyToken, authorize(["USER"]), (req, res) => {
  try {
    return res.status(200).send({ message: "User Access Granted" });
  } catch (err) {
    console.log(err);
    return res.status(401).send({ error: true, message: err });
  }
});

router.get("/owner-protected-route", verifyToken, authorize(["OWNER"]), (req, res) => {
  try {
    return res.status(200).send({ message: "Owner Access Granted" });
  } catch (err) {
    console.log(err);
    return res.status(401).send({ error: true, message: err });
  }
});

export default router;
