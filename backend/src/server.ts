
import express from "express";
import cors from "cors";
import { createCase, getCase, listCases } from "./store";
import { enqueue } from "./queue";

// Import new routers
import pepRouter from "./routes/pep";
import policyRouter from "./routes/policy";
import ethicsRouter from "./routes/ethics";
import adminRouter from "./routes/adminCases";

const app = express();
app.use(cors() as any);
app.use(express.json() as any);

// Mount routers
app.use("/api", pepRouter);
app.use("/api", policyRouter);
app.use("/api", ethicsRouter);
app.use("/api", adminRouter);

// Base Case Routes
app.post("/api/cases", (req, res) => {
  try {
    const c = createCase(req.body);
    enqueue({ id: c.id, payload: req.body });
    res.json({ ok: true, case: c });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.get("/api/cases/:id", (req, res) => {
  const c = getCase(req.params.id);
  if (!c) {
      res.status(404).json({ ok: false });
      return;
  }
  res.json({ ok: true, case: c });
});

app.get("/api/cases", (_, res) => {
  res.json({ ok: true, cases: listCases() });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 5002;
app.listen(PORT, () => {
  console.log(`BWGA backend listening on http://localhost:${PORT}`);
  console.log("Routes mounted: /api/cases, /api/policy, /api/pep-search, /api/cases/:id/ethics");
});
