import { describe, expect, it } from "vitest";
import path from "node:path";
import {
  getInstallPath,
  parseRegistrySource,
} from "../../src/utils/template-fetcher.js";

// =============================================================================
// getInstallPath — pure function (EASY)
// =============================================================================

describe("getInstallPath", () => {
  it("returns spec path for 'spec' type", () => {
    const result = getInstallPath("/project", "spec");
    expect(result).toBe(path.join("/project", ".trellis/spec"));
  });

  it("returns skill path for 'skill' type", () => {
    const result = getInstallPath("/project", "skill");
    expect(result).toBe(path.join("/project", ".agents/skills"));
  });

  it("returns command path for 'command' type", () => {
    const result = getInstallPath("/project", "command");
    expect(result).toBe(path.join("/project", ".claude/commands"));
  });

  it("returns project root for 'full' type", () => {
    const result = getInstallPath("/project", "full");
    expect(result).toBe(path.join("/project", "."));
  });

  it("falls back to spec path for unknown type", () => {
    const result = getInstallPath("/project", "unknown-type");
    expect(result).toBe(path.join("/project", ".trellis/spec"));
  });

  it("works with different cwd values", () => {
    const result = getInstallPath("/home/user/my-project", "spec");
    expect(result).toBe(path.join("/home/user/my-project", ".trellis/spec"));
  });
});

// =============================================================================
// parseRegistrySource — pure function
// =============================================================================

describe("parseRegistrySource", () => {
  // -------------------------------------------------------------------------
  // GitHub (gh: / github:)
  // -------------------------------------------------------------------------

  it("parses gh:user/repo/subdir", () => {
    const result = parseRegistrySource("gh:myorg/myrepo/marketplace");
    expect(result.provider).toBe("gh");
    expect(result.repo).toBe("myorg/myrepo");
    expect(result.subdir).toBe("marketplace");
    expect(result.ref).toBe("main");
    expect(result.rawBaseUrl).toBe(
      "https://raw.githubusercontent.com/myorg/myrepo/main/marketplace",
    );
    expect(result.gigetSource).toBe("gh:myorg/myrepo/marketplace");
  });

  it("parses gh:user/repo/nested/subdir", () => {
    const result = parseRegistrySource("gh:myorg/myrepo/specs/backend");
    expect(result.repo).toBe("myorg/myrepo");
    expect(result.subdir).toBe("specs/backend");
    expect(result.rawBaseUrl).toBe(
      "https://raw.githubusercontent.com/myorg/myrepo/main/specs/backend",
    );
  });

  it("parses gh:user/repo (no subdir)", () => {
    const result = parseRegistrySource("gh:myorg/myrepo");
    expect(result.repo).toBe("myorg/myrepo");
    expect(result.subdir).toBe("");
    expect(result.rawBaseUrl).toBe(
      "https://raw.githubusercontent.com/myorg/myrepo/main/",
    );
  });

  it("parses gh:user/repo/path#ref", () => {
    const result = parseRegistrySource("gh:myorg/myrepo/marketplace#develop");
    expect(result.repo).toBe("myorg/myrepo");
    expect(result.subdir).toBe("marketplace");
    expect(result.ref).toBe("develop");
    expect(result.rawBaseUrl).toBe(
      "https://raw.githubusercontent.com/myorg/myrepo/develop/marketplace",
    );
  });

  it("parses github: prefix same as gh:", () => {
    const result = parseRegistrySource("github:myorg/myrepo/specs");
    expect(result.provider).toBe("github");
    expect(result.repo).toBe("myorg/myrepo");
    expect(result.subdir).toBe("specs");
    expect(result.rawBaseUrl).toBe(
      "https://raw.githubusercontent.com/myorg/myrepo/main/specs",
    );
  });

  // -------------------------------------------------------------------------
  // GitLab
  // -------------------------------------------------------------------------

  it("parses gitlab:user/repo/subdir", () => {
    const result = parseRegistrySource("gitlab:myorg/myrepo/templates");
    expect(result.provider).toBe("gitlab");
    expect(result.repo).toBe("myorg/myrepo");
    expect(result.subdir).toBe("templates");
    expect(result.rawBaseUrl).toBe(
      "https://gitlab.com/myorg/myrepo/-/raw/main/templates",
    );
  });

  it("parses gitlab: with custom ref", () => {
    const result = parseRegistrySource("gitlab:myorg/myrepo/specs#v2");
    expect(result.ref).toBe("v2");
    expect(result.rawBaseUrl).toBe(
      "https://gitlab.com/myorg/myrepo/-/raw/v2/specs",
    );
  });

  // -------------------------------------------------------------------------
  // Bitbucket
  // -------------------------------------------------------------------------

  it("parses bitbucket:user/repo/subdir", () => {
    const result = parseRegistrySource("bitbucket:myorg/myrepo/specs");
    expect(result.provider).toBe("bitbucket");
    expect(result.repo).toBe("myorg/myrepo");
    expect(result.subdir).toBe("specs");
    expect(result.rawBaseUrl).toBe(
      "https://bitbucket.org/myorg/myrepo/raw/main/specs",
    );
  });

  // -------------------------------------------------------------------------
  // Error cases
  // -------------------------------------------------------------------------

  it("throws on missing colon (no provider)", () => {
    expect(() => parseRegistrySource("myorg/myrepo/path")).toThrow(
      "Invalid registry source",
    );
  });

  it("throws on unsupported provider", () => {
    expect(() => parseRegistrySource("sourcehut:user/repo")).toThrow(
      "Unsupported provider",
    );
  });

  it("throws on missing repo (only user)", () => {
    expect(() => parseRegistrySource("gh:myorg")).toThrow(
      "Must include user/repo",
    );
  });

});
