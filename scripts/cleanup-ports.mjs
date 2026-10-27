import { execSync } from "child_process";

const TARGET_PORTS = [3101, 3102];

function findPidForPort(port) {
  try {
    const stdout = execSync(`netstat -ano | findstr :${port}`, { encoding: "utf8" });
    const lines = stdout.trim().split("\n");
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 5 && parts[1].endsWith(`:${port}`) && parts[3] === "LISTENING") {
        return parseInt(parts[4], 10);
      }
    }
  } catch {
    // Port not in use
  }
  return null;
}

export function cleanupFixedPorts() {
  console.log("Checking fixed ports (3101 for dev, 3102 for smoke)...");
  for (const port of TARGET_PORTS) {
    const pid = findPidForPort(port);
    if (pid && !isNaN(pid)) {
      console.log(`Port ${port} is currently bound by PID ${pid}. Freeing port...`);
      try {
        execSync(`taskkill /pid ${pid} /f /t`, { stdio: "ignore" });
        console.log(`Freed port ${port} (PID ${pid} terminated).`);
      } catch (err) {
        console.warn(`Could not terminate PID ${pid} for port ${port}:`, err.message);
      }
    } else {
      console.log(`Port ${port} is already free.`);
    }
  }
}

// When run directly from CLI
if (process.argv[1]?.includes("cleanup-ports.mjs")) {
  cleanupFixedPorts();
}
