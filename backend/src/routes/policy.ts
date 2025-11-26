
import express from "express";
import { readPolicy, writePolicy } from "../policyStore";

const router = express.Router();

router.get("/policy", (req, res) => {
  res.json({ ok: true, policy: readPolicy() });
});

router.post("/policy", (req, res) => {
  const p = req.body;
  try {
    const saved = writePolicy(p);
    res.json({ ok: true, policy: saved });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

export default router;
