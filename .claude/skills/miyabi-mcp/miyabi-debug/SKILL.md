---
name: miyabi-debug
description: Systematic multi-layer debugging via MCP tools. Use when troubleshooting errors, crashes, performance issues, connection problems, or port conflicts.
argument-hint: "[symptom] [target]"
---

# Miyabi Debug Assistant

MCP tool prefix: `mcp__miyabi-mcp-bundle__`

Start broad, drill down. Each layer has entry/exit criteria.

## Diagnostic Layers

### Layer 1: Quick Triage (always start here)
```
mcp__miyabi-mcp-bundle__health_check
→ mcp__miyabi-mcp-bundle__resource_overview
```
**Exit:** If all green → ask user for more detail. If red → go to matching layer.

### Layer 2: Error Investigation
**Entry:** Application error, crash, unexpected behavior
```
mcp__miyabi-mcp-bundle__log_get_errors
→ mcp__miyabi-mcp-bundle__log_search (error pattern)
→ mcp__miyabi-mcp-bundle__process_search (app name)
```
If process found → `process_info` → `process_cpu_history`
If process missing → likely crashed. Check logs for last activity.
**Exit:** Root cause identified or escalate to Layer 5.

### Layer 3: Network Issues
**Entry:** Connection refused, timeout, DNS failure
```
mcp__miyabi-mcp-bundle__network_overview
→ mcp__miyabi-mcp-bundle__network_ping (target)
→ mcp__miyabi-mcp-bundle__network_dns_lookup (hostname)
→ mcp__miyabi-mcp-bundle__network_port_check (host, port)
```
If HTTPS: add `mcp__miyabi-mcp-bundle__network_ssl_check`
**Exit:** Connectivity issue pinpointed or escalate.

### Layer 4: Port Conflicts
**Entry:** "Address already in use", bind error
```
mcp__miyabi-mcp-bundle__network_listening_ports
→ mcp__miyabi-mcp-bundle__process_ports (conflicting PID)
→ mcp__miyabi-mcp-bundle__process_info (PID)
```
**Exit:** Report which process holds the port. Do NOT auto-kill.

### Layer 5: Performance
**Entry:** Slow response, high load, CPU/memory spike
```
mcp__miyabi-mcp-bundle__resource_cpu
→ mcp__miyabi-mcp-bundle__resource_memory
→ mcp__miyabi-mcp-bundle__process_top (limit: 10)
→ mcp__miyabi-mcp-bundle__process_cpu_history (suspect PID)
→ mcp__miyabi-mcp-bundle__process_threads (suspect PID)
```
**Exit:** Top offender identified with resource trend.

### Layer 6: Disk
**Entry:** "No space left", I/O errors
```
mcp__miyabi-mcp-bundle__resource_disk
→ mcp__miyabi-mcp-bundle__file_size_summary (target dir)
→ mcp__miyabi-mcp-bundle__file_duplicates (target dir)
```
**Exit:** Largest consumers identified.

### Layer 7: Container
**Entry:** Container won't start, unhealthy, OOMKilled
```
mcp__miyabi-mcp-bundle__docker_ps
→ mcp__miyabi-mcp-bundle__docker_logs (container, tail: 100)
→ mcp__miyabi-mcp-bundle__docker_inspect (container)
```
**Exit:** Container state + error identified.

## Failure Handling

- Tool returns error → retry once, then fall back to equivalent CLI command
- 3 layers deep with no answer → report findings so far and suggest manual investigation
- Never auto-kill processes or restart services without user confirmation

## Output Template

```
Symptom: [what user reported]
Observation: [what tools found]
Diagnosis: [likely root cause]
Action: [specific fix recommendation]
```
