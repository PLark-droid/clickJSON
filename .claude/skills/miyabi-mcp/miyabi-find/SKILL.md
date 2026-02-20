---
name: miyabi-find
description: Search and discover miyabi-mcp-bundle tools on demand. Use when you need to find the right MCP tool for a task, check tool capabilities, or explore available tool categories. This is the entry point for all miyabi-mcp-bundle operations - search first, then call.
user-invocable: true
argument-hint: "[keyword or category]"
---

# Miyabi Find - MCP Tool Discovery

Lightweight tool finder that prevents context pollution. Instead of loading all 172 tools upfront, search for exactly what you need.

## How It Works

1. User describes what they want to do
2. This skill searches for matching tools
3. Returns tool name + usage info
4. User or Claude calls the discovered tool

## Discovery Flow

### Step 1: Identify Intent
Parse user request into keywords:
- "git" "branch" "commit" → git category
- "CPU" "memory" "slow" → resource/process category
- "container" "docker" → docker category
- "issue" "PR" "review" → github category
- "error" "crash" "debug" → log/process category
- "network" "port" "DNS" → network category
- "database" "SQL" "table" → database category

### Step 2: Search
Use MCP Discovery tools:

**By keyword:**
Call `mcp__miyabi-mcp-bundle__mcp_search_tools` with the keyword.
Returns matching tools with descriptions.

**By category:**
Call `mcp__miyabi-mcp-bundle__mcp_list_categories` to see all 21 categories.
Then `mcp__miyabi-mcp-bundle__mcp_search_tools` within that category.

**For details:**
Call `mcp__miyabi-mcp-bundle__mcp_get_tool_info` with the specific tool name.
Returns full parameter schema and usage.

### Step 3: Present Options
Show user the top 3-5 matching tools:
```
Found tools for "[keyword]":
1. [tool_name] - [description]
2. [tool_name] - [description]
3. [tool_name] - [description]
```

### Step 4: Execute
Call the selected tool with `mcp__miyabi-mcp-bundle__[tool_name]`.

## Quick Category Index

When user mentions... → Search category:

| Keywords | Category | Tool Count |
|----------|----------|-----------|
| git, branch, commit, diff, blame | Git Inspector | 19 |
| tmux, session, pane, terminal | Tmux Monitor | 10 |
| log, error, warning, search | Log Aggregator | 7 |
| cpu, memory, disk, load, battery | Resource Monitor | 10 |
| network, ping, dns, port, ssl | Network Inspector | 15 |
| process, pid, thread, kill | Process Inspector | 14 |
| file, search, tree, compare, checksum | File Watcher | 10 |
| claude, mcp, session, config | Claude Monitor | 8 |
| issue, pr, review, label, release | GitHub Integration | 21 |
| docker, container, image, build | Docker | 10 |
| compose, service, up, down | Docker Compose | 4 |
| k8s, pod, deployment, kubectl | Kubernetes | 6 |
| spec, feature, plan, task | Spec-Kit | 9 |
| db, sql, table, schema, query | Database | 6 |
| time, timezone, convert | Time | 4 |
| calc, math, unit, statistics | Calculator | 3 |
| think, reason, branch, summarize | Sequential Thinking | 3 |
| uuid, random, hash, password | Generator | 4 |
| health, check, diagnostics | Health | 1 |

## Rules

1. **Search first, call second** - Never guess tool names; always discover
2. **Minimal context** - Only load tool info when needed, not upfront
3. **Show before execute** - Present tool options to user before calling
4. **Cache within session** - If same category queried twice, reuse results
