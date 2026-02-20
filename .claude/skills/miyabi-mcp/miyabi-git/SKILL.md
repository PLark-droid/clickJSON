---
name: miyabi-git
description: Git repository analysis via MCP tools. Use when investigating branches, diffs, blame, conflicts, or preparing commits and reviews.
argument-hint: "[action] [target]"
---

# Miyabi Git Inspector

MCP tool prefix: `mcp__miyabi-mcp-bundle__`

## Auto-Trigger Patterns

### Context Check (作業開始時)
```
mcp__miyabi-mcp-bundle__git_status
→ mcp__miyabi-mcp-bundle__git_current_branch
→ mcp__miyabi-mcp-bundle__git_log (limit: 10)
```

### Pre-Commit (コミット前)
```
mcp__miyabi-mcp-bundle__git_diff
→ mcp__miyabi-mcp-bundle__git_staged_diff
→ mcp__miyabi-mcp-bundle__git_conflicts
```
**If conflicts found → STOP. Report conflicts before proceeding.**

### Branch Analysis (ブランチ調査)
```
mcp__miyabi-mcp-bundle__git_branch_list
→ mcp__miyabi-mcp-bundle__git_branch_ahead_behind
```

### Investigation (バグ調査)
```
mcp__miyabi-mcp-bundle__git_file_history (file, limit: 20)
→ mcp__miyabi-mcp-bundle__git_blame (file, start_line, end_line)
→ mcp__miyabi-mcp-bundle__git_show (suspect commit)
```

### Review Prep (レビュー準備)
```
mcp__miyabi-mcp-bundle__git_log (branch commits)
→ mcp__miyabi-mcp-bundle__git_diff
→ mcp__miyabi-mcp-bundle__git_contributors
```

## Failure Handling

| Error | Action |
|-------|--------|
| Not a git repo | Report to user, suggest `git init` |
| No remote | `mcp__miyabi-mcp-bundle__git_remote_list` to confirm, suggest adding |
| Merge conflict | List conflicting files, do NOT auto-resolve |
| Tool timeout | Retry once, then fall back to `git` CLI command |

## Output Format

```
Status: [branch] | [ahead/behind] | [clean/dirty]
Changes: [N files modified, N staged, N untracked]
Action needed: [specific recommendation]
```
