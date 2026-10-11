# Repo rules for AI agents

This file is loaded into the working context of any AI coding agent that
opens this repository. Follow these rules at all times.

## Branch + PR workflow

- `main` is production. **Never commit directly to `main`.**
- Every change starts from a fresh branch off `main`:
  - `feat/<short-slug>` for new features / content
  - `fix/<short-slug>` for bug fixes
  - `chore/<short-slug>` for tooling, docs, config
- Push the branch and open a Pull Request with `gh pr create --base main`.
- Vercel will automatically post a Preview Deploy URL on the PR.

## Confirmation cadence

- Batch several edits in one session, then show a single `git diff --stat
  main...HEAD` summary and a per-file note at the end.
- Wait for the user's explicit "ship it" / "commit + PR" before staging,
  committing, or pushing. Do not commit speculatively.
- Do not merge. Wait for the user to review the Vercel preview and say
  "merge it" before running `gh pr merge`.

## Merge rules

- Default merge method: `--squash --delete-branch`.
- Only run `gh pr merge` after the user says "merge it" (or equivalent).
- Never force-push to `main`. Force-pushes to feature branches are fine.

## Local setup reminder

- The repo has no build step. Preview locally with
  `python3 -m http.server 8080` from the repo root.
- `git config user.name` and `user.email` are set per-repo, not globally.
