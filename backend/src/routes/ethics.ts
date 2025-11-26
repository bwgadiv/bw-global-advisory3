
import express from "express";
import { getCase } from "../store";

const router = express.Router();

router.get("/cases/:id/ethics", (req, res) => {
  const c = getCase(req.params.id);
  if (!c) {
      res.status(404).json({ ok: false });
      return;
  }
  const ethics = c.result?.ethics ?? null;
  res.json({ ok: true, ethics });
});

export default router;
