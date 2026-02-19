---
name: miyabi-debug
description: Systematic debugging using miyabi-mcp-bundle tools for logs, processes, network, and system diagnostics. Use when troubleshooting errors, crashes, performance issues, connection problems, port conflicts, or unresponsive services.
---

# Miyabi Debug Assistant

Multi-layer diagnostic toolkit. Start broad, drill down.

## Diagnostic Flowchart

### Layer 1: Quick Triage
Always start here:
```
health_check → resource_overview
```

### Layer 2: Error Investigation
On application error or crash:
```
log_get_errors → log_search (error pattern) → process_search (app name)
```
If process found: `process_info → process_cpu_history → process_memory_detail`
If process missing: check if it crashed, review logs.

### Layer 3: Network Issues
On connection failure or timeout:
```
network_overview → network_ping (target host) → network_dns_lookup (hostname)
→ network_port_check (host, port) → network_ssl_check (if HTTPS)
```

### Layer 4: Port Conflicts
On "address already in use" / bind error:
```
network_listening_ports → process_ports (conflicting PID)
→ process_info (PID) → process_search (name)
```

### Layer 5: Performance Degradation
On slow response or high load:
```
resource_cpu → resource_memory → resource_load
→ process_top (limit: 10) → process_cpu_history (suspect PID)
→ process_threads (suspect PID)
```

### Layer 6: Disk Issues
On "no space left" or I/O errors:
```
resource_disk → file_size_summary (target dir)
→ file_duplicates (target dir) → log_stats
```

### Layer 7: Container Issues
On Docker/container problems:
```
docker_ps → docker_logs (container) → docker_inspect (container)
→ docker_stats → docker_exec (diagnostic command)
```

## Rules

1. **Always Layer 1 first** - Quick triage before deep dive
2. **Follow the evidence** - Let tool output guide next tool call
3. **Parallel independent checks** - Call unrelated tools simultaneously
4. **Report actionable findings** - Don't dump raw output; summarize with fix suggestions
5. **Escalate when stuck** - If 3 layers deep with no answer, suggest manual investigation paths
