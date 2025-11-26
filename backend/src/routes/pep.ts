
import express from "express";
import { pepLookup } from "../services/pepService";

const router = express.Router();

router.post("/pep-search", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
        res.status(400).json({ ok: false, error: "name required" });
        return;
    }
    const r = await pepLookup(name);
    res.json({ ok: true, result: r });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

export default router;
