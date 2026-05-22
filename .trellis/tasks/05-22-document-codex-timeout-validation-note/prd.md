# Document Codex timeout validation note

## Goal

Add a troubleshooting note to the root README so students using an older Trellis setup know why Codex 0.133 rejects the configuration and how to fix it.

## Requirements

- Document that Codex 0.133 validates `features.multi_agent_v2.default_wait_timeout_ms` against `features.multi_agent_v2.min_wait_timeout_ms` strictly.
- Explain that Codex 0.130 did not reject this older Trellis configuration.
- Include the exact error text users may see.
- Explain the old May 16 Trellis setup only had `min_wait_timeout_ms = 480000` and no `default_wait_timeout_ms`.
- Provide the minimal fix: add `default_wait_timeout_ms` with a value greater than or equal to `min_wait_timeout_ms`.

## Acceptance Criteria

- [ ] Root `README.md` contains the compatibility note.
- [ ] The note is in Chinese and fits the classroom README audience.
- [ ] No source code or Trellis template files are changed.

## Out of Scope

- Changing Codex or Trellis config files.
- Updating upstream `Trellis/README.md` or `Trellis/README_CN.md`.
- Verifying behavior across Codex versions.

## Technical Notes

- Root `README.md` is the student-facing entry point for this repository.
- `.codex/config.toml` already documents why project-scoped config does not write a `[features.multi_agent_v2]` block.
