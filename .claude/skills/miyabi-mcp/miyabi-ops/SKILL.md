---
name: miyabi-ops
description: Route development tasks to the right miyabi-mcp tool. Use when you need DevOps, monitoring, debugging, or infrastructure operations.
argument-hint: "[intent]"
disable-model-invocation: true
---

# Miyabi Ops - Lightweight Router

Routes user intent to the correct miyabi-mcp-bundle tools. Does NOT load all 172 tools into context. Uses discovery-first approach.

## Routing Table

| User Intent | Action |
|-------------|--------|
| Git analysis / commit prep / branch work | Invoke `/miyabi-git` |
| GitHub issues / PRs / CI/CD / releases | Invoke `/miyabi-github` |
| Errors / crashes / connection problems | Invoke `/miyabi-debug` |
| Docker / Compose / container management | Invoke `/miyabi-docker` |
| CPU / memory / disk / network monitoring | Invoke `/miyabi-monitor` |
| Don't know which tool to use | Invoke `/miyabi-find` to search |

## Execution Protocol

1. **Parse intent** from user request
2. **Route** to the appropriate specialized skill above
3. If intent is unclear, use `/miyabi-find` to discover tools by keyword
4. If a specialized skill's tool fails:
   - Check error message
   - Try alternative tool from same category
   - If 2 failures, report to user with error details and suggest manual approach

## When NOT to Use This

- Simple file edits → Use standard Read/Write/Edit
- Git commits → Use standard `git` commands
- Quick `gh` commands → Use `gh` CLI directly
- Only use MCP tools when you need structured data or tool chaining

For the full 172-tool catalog, see [references/tool-catalog.md](references/tool-catalog.md).
