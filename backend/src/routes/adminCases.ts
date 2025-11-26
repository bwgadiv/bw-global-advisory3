
import express from "express";
import { listCases, getCase, updateCase } from "../store";

const router = express.Router();

// list
router.get("/cases", (req, res) => {
  const cases = listCases();
  res.json({ ok: true, cases });
});

// get
router.get("/cases/:id", (req, res) => {
  const c = getCase(req.params.id);
  if (!c) {
      res.status(404).json({ ok: false });
      return;
  }
  res.json({ ok: true, case: c });
});

// review action
router.post("/cases/:id/review", (req, res) => {
  const { decision, notes } = req.body;
  const caseId = req.params.id;
  const c = getCase(caseId);
  
  if (!c) {
      res.status(404).json({ ok: false });
      return;
  }

  // Update the case with review decision
  updateCase(caseId, { 
      status: decision === 'approve' ? 'complete' : 'complete', // Mark complete but note decision
      result: { 
          ...c.result, 
          adminReview: { 
              decision, 
              notes, 
              reviewedAt: new Date().toISOString() 
          } 
      } 
  });
  
  res.json({ ok: true });
});

export default router;
