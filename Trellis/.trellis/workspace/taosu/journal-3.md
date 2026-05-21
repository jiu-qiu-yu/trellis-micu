# Journal - taosu (Part 3)

> Continuation from `journal-2.md` (archived at ~2000 lines)
> Started: 2026-03-05

---



## Session 69: docs: improve record-session archive guidance

**Date**: 2026-03-05
**Task**: docs: improve record-session archive guidance

### Summary

(Add summary)

### Main Changes

## Summary

Updated record-session prompt across all platforms to clarify task archive judgment criteria.

## Changes

| Change | Description |
|--------|-------------|
| Archive guidance | Judge by actual work status (code committed, PR created), not task.json status field |
| Coverage | 9 platform templates + 3 dogfooding copies (12 files total) |

## Context

From `/trellis:break-loop` analysis — root cause was implicit assumption that task.json `status` field would be up-to-date. Fix: prompt now explicitly tells AI to archive based on work completion, not status field value.


### Git Commits

| Hash | Message |
|------|---------|
| `b9a475f` | (see git log) |

### Testing

- [OK] (Add test results)

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 70: Task lifecycle hooks + Linear sync

**Date**: 2026-03-05
**Task**: Task lifecycle hooks + Linear sync

### Summary

(Add summary)

### Main Changes

## What was done

| Feature | Description |
|---------|-------------|
| YAML parser enhancement | Rewrote `parse_simple_yaml` with recursive `_parse_yaml_block` for nested dict support |
| `get_hooks()` | New config.py function to read lifecycle hook commands from config.yaml |
| `_run_hooks()` | Non-blocking hook execution in task.py with `TASK_JSON_PATH` env var |
| 4 cmd integrations | after_create/start/finish/archive hooks in cmd_create/start/finish/archive |
| Linear sync hook | `linear_sync.py` with create/start/archive/sync actions via linearis CLI |
| Gitignored config | `hooks.local.json` for sensitive config (team, project, assignee map) |
| Spec updates | script-conventions.md + directory-structure.md updated with hooks code-spec |

## Key decisions

- Only pass `TASK_JSON_PATH` env var (not individual fields) — simple, universal
- Hook failures never block main operation (warn only)
- Sensitive config in gitignored `hooks.local.json`, hook script itself is public
- `sync` action for manually pushing prd.md to Linear description (not auto)

## Linear integration

- All active tasks linked to Linear issues (MIN-337~341)
- Parent task auto-linking via `_resolve_parent_linear_issue()`
- Auto-assign via ASSIGNEE_MAP in hooks.local.json

**Updated files**:
- `src/templates/trellis/scripts/common/worktree.py` — nested dict YAML parser
- `src/templates/trellis/scripts/common/config.py` — get_hooks()
- `src/templates/trellis/scripts/task.py` — _run_hooks() + 4 integrations
- `src/templates/trellis/config.yaml` — hooks example (commented)
- `.trellis/scripts/hooks/linear_sync.py` — Linear sync hook
- `.trellis/spec/backend/script-conventions.md` — hooks code-spec
- `.trellis/spec/backend/directory-structure.md` — hooks/ directory


### Git Commits

| Hash | Message |
|------|---------|
| `695a26d` | (see git log) |
| `086483a` | (see git log) |
| `9595d85` | (see git log) |
| `aab2113` | (see git log) |
| `8a5ed63` | (see git log) |

### Testing

- [OK] (Add test results)

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 71: Record-session prompt fix: archive before PR

**Date**: 2026-03-05
**Task**: Record-session prompt fix: archive before PR

### Summary

Fixed record-session archive guidance across 12 platform templates — archive when code committed, don't wait for PR

### Main Changes



### Git Commits

| Hash | Message |
|------|---------|
| `44f14af` | (see git log) |

### Testing

- [OK] (Add test results)

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 72: feat: --registry flag for custom spec template sources

**Date**: 2026-03-06
**Task**: feat: --registry flag for custom spec template sources

### Summary

(Add summary)

### Main Changes

## Summary

Implemented `--registry` CLI flag allowing users to download spec templates from custom remote repositories (GitHub, GitLab, Bitbucket).

## Changes

| Area | Description |
|------|-------------|
| `--registry` flag | New CLI option accepting giget-style source (e.g., `gh:myorg/myrepo/specs`) |
| `parseRegistrySource()` | Parses provider, repo, subdir, ref; builds raw URL for index.json probe |
| `probeRegistryIndex()` | Distinguishes 404 (no index.json → direct download) from transient errors (abort) |
| Marketplace mode | Custom registry with `index.json` → show picker with templates |
| Direct download mode | Custom registry without `index.json` → download directory to `.trellis/spec/` |
| Custom picker | "custom" option in template picker with back/return support |
| `-y` mode | Probes index.json; aborts if marketplace (requires `--template`); direct download if 404 |
| `--template` path | Uses `probeRegistryIndex` in `downloadTemplateById` to report real errors |
| Spec updates | 5 new patterns/mistakes in error-handling.md, quality-guidelines.md, cross-layer guide |
| Tests | 11 new tests for `parseRegistrySource` (gh/gitlab/bitbucket/refs/errors) |

## Bug Fixes (8 bugs found across 3 code review rounds)

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | P1 | `-y --registry` skipped index.json probe | Added probe in -y path |
| 2 | P1 | `#ref` dropped in giget source | Include `#ref` in constructed URI |
| 3 | P2 | 404 vs transient error indistinguishable | Added `probeRegistryIndex()` |
| 4 | P2 | Custom picker skipped overwrite prompt | Added prompt after marketplace selection |
| 5 | P1 | giget URI `#ref` in wrong position | Build full `provider:repo/path#ref`, pass null to downloadWithStrategy |
| 6 | P2 | Transient errors fell through to direct download | Abort instead of warn+continue |
| 7 | P2 | `fetchedTemplates` not reset on source switch | Reset to `[]` when entering custom path |
| 8 | P2 | `--registry --template` swallowed network errors | `downloadTemplateById` uses `probeRegistryIndex` for registry path |

**Updated Files**:
- `src/utils/template-fetcher.ts` — parseRegistrySource, probeRegistryIndex, downloadTemplateById, downloadRegistryDirect
- `src/commands/init.ts` — registry integration, custom picker, -y mode probe
- `src/cli/index.ts` — --registry option
- `test/utils/template-fetcher.test.ts` — 11 new tests
- `.trellis/spec/backend/error-handling.md` — Pattern 5, Mistakes 3-4
- `.trellis/spec/backend/quality-guidelines.md` — 4 new patterns/conventions
- `.trellis/spec/guides/cross-layer-thinking-guide.md` — Mode-Detection Probe Checklist


### Git Commits

| Hash | Message |
|------|---------|
| `3208d64` | (see git log) |
| `d174493` | (see git log) |
| `ba66fe1` | (see git log) |

### Testing

- [OK] (Add test results)

### Status

[OK] **Completed**

### Next Steps

- None - task complete
