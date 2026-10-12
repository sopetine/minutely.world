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

## Version folders

- Each site iteration lives in an untracked `vN/` folder (`v2/`…). New work
  starts with `cp -R vN vN+1` (or edits the current `vN/` when asked to
  "update current version"). The repo root is what Vercel serves.

## Deploy cadence (standing authorization from the owner, 2026-10-12)

Once a batch of changes is implemented **and verified locally** (no console
errors; desktop 1440 + mobile 375/320; no horizontal scroll), ship and merge
without asking again — do not wait for "ship it" or "merge it":

1. Branch off `main` (`feat/<slug>`), copy the version folder into the root
   (`rsync -a --exclude README.md vN/ ./` + `cp vN/README.md README.md`;
   `git rm` root files the version no longer has), stage root files only.
2. Commit, push, `gh pr create --base main`.
3. Wait for the **Vercel** check on the PR. If it fails and the logs aren't
   readable, push one empty commit to retrigger; if it fails again, stop and
   report.
4. `gh pr merge --squash --delete-branch`, then `git checkout main && git pull`.
5. **Verify production**: the new `main` SHA must get a `Production`
   deployment with state `success`:
   `gh api "repos/sopetine/minutely.world/deployments?sha=<sha>&environment=Production"`
   then `…/deployments/<id>/statuses`. If no Production deployment appears
   within a few minutes (GitHub→Vercel webhook missed), open a
   `chore/redeploy-<date>` PR with an empty commit and merge it to trigger one.
6. Report the production URL and the `git diff --stat` summary.

Stop and ask instead only if: verification fails, the Vercel check fails
twice, or the change is destructive (deleting pages, rewriting history).

## Merge rules

- Default merge method: `--squash --delete-branch`.
- Never force-push to `main`. Force-pushes to feature branches are fine.

## Local setup reminder

- The repo has no build step. Preview locally with
  `python3 -m http.server 8080` from the repo root.
- `git config user.name` and `user.email` are set per-repo, not globally.
