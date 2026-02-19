---
name: miyabi-ops
description: Intelligent orchestrator for miyabi-mcp-bundle 172 tools. Automatically selects and calls the right MCP tools at the optimal timing for development, monitoring, debugging, and DevOps workflows. Use when you need system diagnostics, git analysis, GitHub operations, Docker management, network inspection, process monitoring, database queries, or any development infrastructure task.
allowed-tools: "Read, Grep, Glob, Bash"
---

# Miyabi Ops - Intelligent MCP Tool Orchestrator

172 MCP tools from miyabi-mcp-bundle, called at the right time automatically.

## Decision Engine

Based on the user's intent, select tools from the matrix below. Always start with the most relevant diagnostic tool, then chain related tools.

### Intent Detection & Tool Routing

**Development Flow (コード開発)**
| Trigger | Tools to Chain | Timing |
|---------|---------------|--------|
| Starting work / context check | `git_status` → `git_current_branch` → `git_log` | First, always |
| Before commit | `git_diff` → `git_staged_diff` → `git_conflicts` | Pre-commit |
| Branch investigation | `git_branch_list` → `git_branch_ahead_behind` | When switching/comparing |
| File history / blame | `git_file_history` → `git_blame` | When investigating changes |
| Code review prep | `git_show` → `git_contributors` → `git_diff` | Before review |

**GitHub Operations (GitHub連携)**
| Trigger | Tools to Chain | Timing |
|---------|---------------|--------|
| Issue management | `github_list_issues` → `github_get_issue` | When discussing issues |
| PR workflow | `github_list_prs` → `github_get_pr` → `github_list_pr_reviews` | PR review time |
| Create issue from bug | `github_create_issue` → `github_add_labels` | After identifying bug |
| PR creation | `github_create_pr` → `github_add_labels` | After implementation |
| CI/CD check | `github_list_workflows` → `github_list_workflow_runs` | After push / on failure |
| Release management | `github_list_releases` → `github_list_milestones` | Release planning |

**System Diagnostics (システム診断)**
| Trigger | Tools to Chain | Timing |
|---------|---------------|--------|
| Performance issue | `resource_overview` → `resource_cpu` → `resource_memory` → `process_top` | When slow |
| Disk space | `resource_disk` → `file_size_summary` → `file_duplicates` | When full |
| System health | `health_check` → `resource_overview` → `resource_load` | Periodic / on issue |
| Battery / thermal | `resource_battery` → `resource_temperature` | Laptop monitoring |

**Debugging (デバッグ)**
| Trigger | Tools to Chain | Timing |
|---------|---------------|--------|
| App crash / error | `log_get_errors` → `log_search` → `process_info` | On error |
| Network issue | `network_overview` → `network_ping` → `network_dns_lookup` → `network_port_check` | Connection problems |
| Process hung | `process_search` → `process_info` → `process_cpu_history` → `process_threads` | When unresponsive |
| Port conflict | `network_listening_ports` → `process_ports` → `process_search` | Bind error |
| SSL/TLS issue | `network_ssl_check` → `network_dns_lookup` | Certificate errors |

**Docker / Container (コンテナ)**
| Trigger | Tools to Chain | Timing |
|---------|---------------|--------|
| Container status | `docker_ps` → `docker_stats` | Health check |
| Container debug | `docker_logs` → `docker_inspect` → `docker_exec` | On container issue |
| Build & deploy | `docker_build` → `docker_ps` → `docker_stats` | Build time |
| Compose workflow | `compose_ps` → `compose_logs` → `compose_up` | Service management |

**Database (データベース)**
| Trigger | Tools to Chain | Timing |
|---------|---------------|--------|
| DB investigation | `db_connect` → `db_tables` → `db_schema` | Start of DB work |
| Query analysis | `db_query` → `db_explain` | Performance tuning |
| DB health | `db_health` → `db_tables` | Periodic check |

**File & Log Analysis (ファイル・ログ)**
| Trigger | Tools to Chain | Timing |
|---------|---------------|--------|
| Find files | `file_search` → `file_tree` | Exploring project |
| Recent changes | `file_recent_changes` → `file_stats` | After deployment |
| Log investigation | `log_sources` → `log_get_recent` → `log_search` | Troubleshooting |
| File integrity | `file_checksum` → `file_compare` | Verification |

**Utilities (ユーティリティ)**
| Trigger | Tools to Chain | Timing |
|---------|---------------|--------|
| Time conversion | `time_current` → `time_convert` | Cross-timezone work |
| Quick calculation | `calc_expression` → `calc_unit_convert` | On demand |
| Generate IDs | `gen_uuid` or `gen_password` | When needed |
| Structured thinking | `think_step` → `think_branch` → `think_summarize` | Complex decisions |

## Execution Rules

1. **Start diagnostic, then drill down** - Always begin with overview tools, then narrow
2. **Chain related tools** - Don't call tools in isolation; follow the chain in the matrix
3. **Parallel when independent** - Call unrelated tools simultaneously for speed
4. **Report concisely** - Summarize findings in actionable format, not raw data dumps
5. **Suggest next steps** - After diagnostics, recommend specific actions

## Tool Naming Convention

All miyabi-mcp-bundle tools are called as:
```
mcp__miyabi-mcp-bundle__[tool_name]
```

For the full tool reference, see [references/tool-catalog.md](references/tool-catalog.md).
