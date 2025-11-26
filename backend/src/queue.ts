
import { updateCase, appendLog } from "./store";
import { computeSPI } from "./spi";
import { runEthicsChecks } from "./ethicsEngine";

type Job = {
  id: string;
  payload: any;
};

const queue: Job[] = [];
let working = false;

export function enqueue(job: Job) {
  queue.push(job);
  processQueue();
}

async function processQueue() {
  if (working) return;
  const job = queue.shift();
  if (!job) return;

  working = true;
  const id = job.id;

  updateCase(id, { status: "processing" });
  appendLog(id, "Job started: running Ethics Engine");

  try {
    // 1. Ethics Check
    const ethics = await runEthicsChecks(job.payload);
    appendLog(id, `Ethics Engine completed: flag=${ethics.overallFlag}`);
    updateCase(id, { result: { ethics } });

    if (ethics.overallFlag === "BLOCK") {
      appendLog(id, "Processing halted due to ethics BLOCK flag");
      updateCase(id, { status: "complete", result: { ethics, spi: null, note: "Halted for human review" } });
      working = false;
      processQueue();
      return;
    }

    // 2. SPI Calculation (if passed ethics)
    appendLog(id, "Proceeding to compute SPI");
    // Simulate slight delay for compute
    await new Promise(r => setTimeout(r, 500));
    
    const spi = computeSPI(job.payload);
    appendLog(id, "SPI computed");

    updateCase(id, {
      status: "complete",
      result: {
        ethics,
        spi,
        note: ethics.overallFlag === "CAUTION" ? "Proceed with caution - mitigation suggested" : "OK"
      }
    });
  } catch (e: any) {
    appendLog(id, "ERROR: " + e.message);
    updateCase(id, { status: "error" });
  }

  working = false;
  processQueue();
}
