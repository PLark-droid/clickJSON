---
name: miyabi-github
description: GitHub operations via MCP tools. Use when managing issues, PRs, reviews, labels, CI/CD workflows, or releases.
argument-hint: "[action] [number|ref]"
---

# Miyabi GitHub Operations

MCP tool prefix: `mcp__miyabi-mcp-bundle__`

## Workflows

### Issue Triage
```
mcp__miyabi-mcp-bundle__github_list_issues (state: open)
→ mcp__miyabi-mcp-bundle__github_get_issue (number)
→ mcp__miyabi-mcp-bundle__github_add_labels
```

### Create Issue
```
mcp__miyabi-mcp-bundle__github_create_issue (title, body)
→ mcp__miyabi-mcp-bundle__github_add_labels
```

### PR Review
```
mcp__miyabi-mcp-bundle__github_get_pr (number)
→ mcp__miyabi-mcp-bundle__github_list_pr_reviews (number)
→ mcp__miyabi-mcp-bundle__github_create_review
→ mcp__miyabi-mcp-bundle__github_submit_review
```

### PR Merge (confirm with user first)
```
mcp__miyabi-mcp-bundle__github_get_pr (check mergeable)
→ mcp__miyabi-mcp-bundle__github_list_pr_reviews (check approvals)
→ mcp__miyabi-mcp-bundle__github_merge_pr (merge_method: squash)
```
**Merge strategy:** squash for feature branches, merge for release branches.

### CI/CD Check
```
mcp__miyabi-mcp-bundle__github_list_workflows
→ mcp__miyabi-mcp-bundle__github_list_workflow_runs (workflow_id)
```
If failed: report workflow name, run URL, and failure reason.

### Release
```
mcp__miyabi-mcp-bundle__github_list_releases
→ mcp__miyabi-mcp-bundle__github_compare_commits (last_tag...HEAD)
→ mcp__miyabi-mcp-bundle__github_list_milestones
```

## Failure Handling

| Error | Action |
|-------|--------|
| 401 Unauthorized | Token missing/expired. Report to user |
| 403 Forbidden | Insufficient permissions. Check token scopes |
| 404 Not Found | Wrong repo/number. Verify with `github_repo_info` |
| 422 Validation | Invalid input. Show API error message to user |
| Rate limit | Report remaining quota, suggest waiting |
| Tool fails | Fall back to `gh` CLI equivalent |

## Output Format

```
[Action]: [result summary]
URL: [link to issue/PR/workflow]
Next: [recommended follow-up action]
```
