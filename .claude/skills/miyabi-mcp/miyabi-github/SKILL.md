---
name: miyabi-github
description: GitHub operations using miyabi-mcp-bundle GitHub Integration tools. Use when managing issues, pull requests, reviews, labels, releases, CI/CD workflows, or repository metadata on GitHub.
argument-hint: "[action] [target]"
---

# Miyabi GitHub Operations

21 MCP tools for full GitHub lifecycle management.

## Operation Workflows

### Issue Management
**Create from bug report:**
```
github_create_issue (title, body, labels) → github_add_labels
```

**Triage existing issues:**
```
github_list_issues (state: open, sort: created) → github_get_issue (number)
→ github_add_labels → github_update_issue (assignees)
```

**Close with comment:**
```
github_add_comment (issue, body) → github_update_issue (state: closed)
```

### Pull Request Lifecycle
**Create PR:**
```
github_create_pr (title, body, base, head) → github_add_labels
```

**Review PR:**
```
github_get_pr (number) → github_list_pr_reviews (number)
→ github_create_review (event: COMMENT/APPROVE/REQUEST_CHANGES)
→ github_submit_review
```

**Merge PR:**
```
github_get_pr → github_list_pr_reviews (check approvals)
→ github_merge_pr (merge_method: squash/merge/rebase)
```

### CI/CD Monitoring
**Check workflow status:**
```
github_list_workflows → github_list_workflow_runs (workflow_id)
```
If failed: investigate logs and suggest fix.

### Repository Management
**Overview:**
```
github_repo_info → github_list_branches → github_list_labels
```

**Release management:**
```
github_list_releases → github_list_milestones → github_compare_commits (tag..HEAD)
```

## Tool Reference

| Tool | Purpose |
|------|---------|
| `github_list_issues` | List with filters (state, labels, sort) |
| `github_get_issue` | Full details by number |
| `github_create_issue` | New issue (title, body, labels, assignees) |
| `github_update_issue` | Update title/body/state/labels/assignees |
| `github_add_comment` | Comment on issue or PR |
| `github_list_prs` | List PRs with filters |
| `github_get_pr` | PR details + diff stats |
| `github_create_pr` | New PR (title, body, base, head) |
| `github_merge_pr` | Merge with strategy |
| `github_list_labels` | All labels |
| `github_add_labels` | Add labels to issue/PR |
| `github_list_milestones` | Milestones |
| `github_list_workflows` | GitHub Actions workflows |
| `github_list_workflow_runs` | Recent runs |
| `github_repo_info` | Repo metadata |
| `github_list_releases` | Releases |
| `github_list_branches` | Branches + protection |
| `github_compare_commits` | Diff between refs |
| `github_list_pr_reviews` | Reviews on PR |
| `github_create_review` | Create review |
| `github_submit_review` | Submit review |
