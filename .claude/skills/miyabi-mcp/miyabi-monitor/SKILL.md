---
name: miyabi-monitor
description: System monitoring via MCP tools. Use when checking CPU, memory, disk, network, process status, or overall system health.
argument-hint: "[target]"
---

# Miyabi System Monitor

MCP tool prefix: `mcp__miyabi-mcp-bundle__`

## Quick Commands

### Full Health
```
mcp__miyabi-mcp-bundle__health_check
→ mcp__miyabi-mcp-bundle__resource_overview
```

### CPU & Load
```
mcp__miyabi-mcp-bundle__resource_cpu
→ mcp__miyabi-mcp-bundle__resource_load
→ mcp__miyabi-mcp-bundle__process_top (limit: 5, sort: cpu)
```

### Memory
```
mcp__miyabi-mcp-bundle__resource_memory
→ mcp__miyabi-mcp-bundle__process_top (limit: 5, sort: memory)
→ mcp__miyabi-mcp-bundle__process_memory_detail (high-usage PID)
```

### Disk Space
```
mcp__miyabi-mcp-bundle__resource_disk
→ mcp__miyabi-mcp-bundle__file_size_summary (target dir)
```

### Network Status
```
mcp__miyabi-mcp-bundle__network_overview
→ mcp__miyabi-mcp-bundle__network_listening_ports
```

### Process Investigation
```
mcp__miyabi-mcp-bundle__process_search (name)
→ mcp__miyabi-mcp-bundle__process_info (PID)
→ mcp__miyabi-mcp-bundle__process_children (PID)
→ mcp__miyabi-mcp-bundle__process_ports (PID)
```

### Laptop Health
```
mcp__miyabi-mcp-bundle__resource_battery
→ mcp__miyabi-mcp-bundle__resource_temperature
→ mcp__miyabi-mcp-bundle__resource_uptime
```

## Scenarios

### Performance Alert
**Trigger:** System feels slow, high load
```
resource_overview → resource_cpu → resource_memory → resource_load
→ process_top (limit: 10) → process_cpu_history (suspect PID)
```

### Pre-Deploy Check
```
resource_overview → resource_disk → network_listening_ports
→ process_search (app) → docker_ps (if containers)
```

## Alert Thresholds (for reporting)

| Metric | Warning | Critical |
|--------|---------|----------|
| CPU | > 70% sustained | > 90% sustained |
| Memory | > 80% used | > 95% used |
| Disk | > 80% full | > 95% full |
| Load | > core count | > 2x core count |

## Failure Handling

- Tool returns error → fall back to equivalent CLI (`top`, `df`, `free`, etc.)
- Permission denied → report which tool needs elevated access
- Unsupported on platform → skip and note (e.g., `resource_temperature` may not work on all Macs)

## Output Format

```
System: [hostname] | Uptime: [time]
CPU: [usage%] | Load: [1/5/15 min]
Memory: [used/total] ([%])
Disk: [used/total] ([%]) on [mount]
Alert: [any threshold breaches]
Top Process: [name] PID [pid] CPU [%] MEM [%]
```
