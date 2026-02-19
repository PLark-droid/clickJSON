---
name: miyabi-git
description: Deep git repository analysis using miyabi-mcp-bundle Git Inspector tools. Use when investigating git history, branches, diffs, blame, conflicts, contributors, or preparing commits and reviews.
---

# Miyabi Git Inspector

19 MCP tools for comprehensive git analysis.

## Auto-Trigger Patterns

### Context Check (作業開始時)
Always run at start of any git-related task:
```
git_status → git_current_branch → git_log (limit: 10)
```

### Pre-Commit (コミット前)
When user is about to commit:
```
git_diff → git_staged_diff → git_conflicts
```
If conflicts found, stop and report before proceeding.

### Branch Analysis (ブランチ調査)
When comparing or switching branches:
```
git_branch_list → git_branch_ahead_behind
```

### Investigation (調査)
When tracking down a change or bug:
```
git_file_history (target file) → git_blame (target file, lines) → git_show (suspect commit)
```

### Review Prep (レビュー準備)
When preparing for code review:
```
git_log (branch commits) → git_diff → git_contributors → git_show (each commit)
```

### Repo Health (リポジトリ健全性)
Periodic or on request:
```
git_stash_list → git_submodule_status → git_hooks_list → git_lfs_status → git_tag_list
```

## Tool Reference

| Tool | Purpose | Key Args |
|------|---------|----------|
| `git_status` | Working tree state | - |
| `git_current_branch` | Active branch | - |
| `git_log` | History | limit, branch |
| `git_diff` | Unstaged changes | path |
| `git_staged_diff` | Staged changes | - |
| `git_blame` | Line authorship | file, start_line, end_line |
| `git_file_history` | File history | file, limit |
| `git_show` | Commit detail | commit_hash |
| `git_branch_list` | All branches | - |
| `git_branch_ahead_behind` | Upstream delta | branch |
| `git_conflicts` | Merge conflicts | - |
| `git_contributors` | Contributor ranking | - |
| `git_stash_list` | Stashes | - |
| `git_tag_list` | Tags | - |
| `git_remote_list` | Remotes | - |
| `git_worktree_list` | Worktrees | - |
| `git_submodule_status` | Submodules | - |
| `git_lfs_status` | LFS files | - |
| `git_hooks_list` | Hooks | - |
