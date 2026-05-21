import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import {
  detectProjectType,
  getProjectTypeDescription,
} from "../../src/utils/project-detector.js";

// =============================================================================
// getProjectTypeDescription — pure function (EASY)
// =============================================================================

describe("getProjectTypeDescription", () => {
  it("returns correct description for frontend", () => {
    expect(getProjectTypeDescription("frontend")).toBe(
      "Frontend project (UI/client-side)",
    );
  });

  it("returns correct description for backend", () => {
    expect(getProjectTypeDescription("backend")).toBe(
      "Backend project (server-side/API)",
    );
  });

  it("returns correct description for fullstack", () => {
    expect(getProjectTypeDescription("fullstack")).toBe(
      "Fullstack project (frontend + backend)",
    );
  });

  it("returns correct description for unknown", () => {
    expect(getProjectTypeDescription("unknown")).toBe(
      "Unknown project type (defaults to fullstack)",
    );
  });

  it("all descriptions are non-empty strings", () => {
    const types = ["frontend", "backend", "fullstack", "unknown"] as const;
    for (const t of types) {
      const desc = getProjectTypeDescription(t);
      expect(typeof desc).toBe("string");
      expect(desc.length).toBeGreaterThan(0);
    }
  });
});

// =============================================================================
// detectProjectType — needs temp directory (MEDIUM)
// =============================================================================

describe("detectProjectType", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "trellis-detect-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("returns 'unknown' for empty directory", () => {
    expect(detectProjectType(tmpDir)).toBe("unknown");
  });

  // Frontend indicators
  it("detects frontend from vite.config.ts", () => {
    fs.writeFileSync(path.join(tmpDir, "vite.config.ts"), "");
    expect(detectProjectType(tmpDir)).toBe("frontend");
  });

  it("detects frontend from next.config.js", () => {
    fs.writeFileSync(path.join(tmpDir, "next.config.js"), "");
    expect(detectProjectType(tmpDir)).toBe("frontend");
  });

  it("detects frontend from package.json with react dependency", () => {
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ dependencies: { react: "^18.0.0" } }),
    );
    expect(detectProjectType(tmpDir)).toBe("frontend");
  });

  it("detects frontend from package.json with vue in devDependencies", () => {
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ devDependencies: { vue: "^3.0.0" } }),
    );
    expect(detectProjectType(tmpDir)).toBe("frontend");
  });

  // Backend indicators
  it("detects backend from go.mod", () => {
    fs.writeFileSync(path.join(tmpDir, "go.mod"), "");
    expect(detectProjectType(tmpDir)).toBe("backend");
  });

  it("detects backend from Cargo.toml", () => {
    fs.writeFileSync(path.join(tmpDir, "Cargo.toml"), "");
    expect(detectProjectType(tmpDir)).toBe("backend");
  });

  it("detects backend from requirements.txt", () => {
    fs.writeFileSync(path.join(tmpDir, "requirements.txt"), "");
    expect(detectProjectType(tmpDir)).toBe("backend");
  });

  it("detects backend from pyproject.toml", () => {
    fs.writeFileSync(path.join(tmpDir, "pyproject.toml"), "");
    expect(detectProjectType(tmpDir)).toBe("backend");
  });

  it("detects fullstack from package.json with express dependency", () => {
    // Note: package.json itself is in FRONTEND_INDICATORS (file existence check),
    // so having package.json + express dep results in fullstack, not just backend
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ dependencies: { express: "^4.0.0" } }),
    );
    expect(detectProjectType(tmpDir)).toBe("fullstack");
  });

  // Fullstack detection
  it("detects fullstack when both frontend and backend indicators exist", () => {
    fs.writeFileSync(path.join(tmpDir, "vite.config.ts"), "");
    fs.writeFileSync(path.join(tmpDir, "go.mod"), "");
    expect(detectProjectType(tmpDir)).toBe("fullstack");
  });

  it("detects fullstack from package.json with react + express", () => {
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({
        dependencies: { react: "^18.0.0", express: "^4.0.0" },
      }),
    );
    expect(detectProjectType(tmpDir)).toBe("fullstack");
  });

  // Edge cases
  it("detects frontend for package.json with no recognized deps", () => {
    // package.json itself is a FRONTEND_INDICATOR (file existence triggers frontend)
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ dependencies: { lodash: "^4.0.0" } }),
    );
    expect(detectProjectType(tmpDir)).toBe("frontend");
  });

  it("detects frontend for invalid package.json", () => {
    // package.json existence alone triggers frontend indicator
    fs.writeFileSync(path.join(tmpDir, "package.json"), "not json");
    expect(detectProjectType(tmpDir)).toBe("frontend");
  });

  it("detects frontend for package.json with no dependencies field", () => {
    // package.json existence alone triggers frontend indicator
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ name: "my-project" }),
    );
    expect(detectProjectType(tmpDir)).toBe("frontend");
  });
});
