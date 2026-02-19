---
name: miyabi-monitor
description: System monitoring and resource analysis using miyabi-mcp-bundle Resource Monitor, Network Inspector, and Process Inspector tools. Use when checking system health, CPU/memory usage, network status, disk space, process analysis, or performance monitoring.
---

# Miyabi System Monitor

35 MCP tools for comprehensive system observability.

## Quick Commands

### Full System Health
```
health_check → resource_overview
```

### CPU & Load
```
resource_cpu → resource_load → process_top (limit: 5, sort: cpu)
```

### Memory Analysis
```
resource_memory → process_top (limit: 5, sort: memory)
→ process_memory_detail (high-usage PID)
```

### Disk Space
```
resource_disk → file_size_summary (target)
```

### Network Status
```
network_overview → network_listening_ports → network_connections
```

### Process Investigation
```
process_search (name) → process_info (PID) → process_children (PID)
→ process_file_descriptors (PID) → process_ports (PID)
```

## Monitoring Scenarios

### Performance Alert
When system feels slow:
```
resource_overview → resource_cpu → resource_memory → resource_load
→ process_top (limit: 10) → process_cpu_history (suspect PID)
```

### Network Diagnostics
When connectivity issues:
```
network_overview → network_ping (target) → network_dns_lookup (hostname)
→ network_traceroute (target) → network_port_check (host, port)
```

### Laptop Health
```
resource_battery → resource_temperature → resource_uptime
```

### Pre-Deploy Check
Before deploying:
```
resource_overview → resource_disk → network_listening_ports
→ process_search (app name) → docker_ps (if using containers)
```

## Rules
1. Always start with `resource_overview` or `health_check` for broad picture
2. Use `process_top` to identify resource hogs
3. Drill into specific PID with `process_info`, `process_memory_detail`, `process_cpu_history`
4. For network, always verify with `network_ping` before deeper investigation
5. Report findings with specific numbers and actionable suggestions
