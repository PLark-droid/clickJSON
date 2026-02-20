---
name: miyabi-docker
description: Docker and Compose management via MCP tools. Use when managing containers, images, builds, compose services, or debugging container issues.
argument-hint: "[action] [target]"
---

# Miyabi Docker Operations

MCP tool prefix: `mcp__miyabi-mcp-bundle__`

## Workflows

### Health Check
```
mcp__miyabi-mcp-bundle__docker_ps
→ mcp__miyabi-mcp-bundle__docker_stats
```

### Debug Container
```
mcp__miyabi-mcp-bundle__docker_ps
→ mcp__miyabi-mcp-bundle__docker_logs (container, tail: 100)
→ mcp__miyabi-mcp-bundle__docker_inspect (container)
→ mcp__miyabi-mcp-bundle__docker_exec (container, command: "/bin/sh")
```
If `/bin/sh` fails, try `/bin/bash`. If both fail, report shell unavailability.

### Build
```
mcp__miyabi-mcp-bundle__docker_build (path, tag)
→ mcp__miyabi-mcp-bundle__docker_images
→ mcp__miyabi-mcp-bundle__docker_ps
```
If build fails: suggest `--no-cache` rebuild, check Dockerfile context.

### Lifecycle
- Start: `mcp__miyabi-mcp-bundle__docker_start (container)`
- Stop: `mcp__miyabi-mcp-bundle__docker_stop (container)`
- Restart: `mcp__miyabi-mcp-bundle__docker_restart (container)`

### Compose
```
mcp__miyabi-mcp-bundle__compose_ps
→ mcp__miyabi-mcp-bundle__compose_logs (service, tail: 50)
```
- Start: `mcp__miyabi-mcp-bundle__compose_up (detach: true)`
- Stop: `mcp__miyabi-mcp-bundle__compose_down`

## Failure Handling

| Error | Action |
|-------|--------|
| Docker daemon not running | Report to user, suggest starting Docker |
| Image not found | Check `docker_images`, suggest `docker_build` or `docker pull` |
| Container OOMKilled | `docker_inspect` for memory limits, suggest increasing |
| Build context too large | Suggest `.dockerignore` review |
| Compose file not found | Check working directory for `docker-compose.yml` / `compose.yml` |
| Tool fails | Fall back to `docker` / `docker compose` CLI |

## Output Format

```
Containers: [N running, N stopped]
[container_name]: [status] | CPU [%] | MEM [MB/limit]
Action: [recommendation]
```
