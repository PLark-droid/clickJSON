---
name: miyabi-docker
description: Docker and Docker Compose management using miyabi-mcp-bundle container tools. Use when managing containers, images, builds, compose services, or debugging container issues.
---

# Miyabi Docker Operations

14 MCP tools for container lifecycle management.

## Workflows

### Health Check (状態確認)
```
docker_ps → docker_stats
```
Shows all containers with live resource usage.

### Debug Container (コンテナデバッグ)
```
docker_ps → docker_logs (container, tail: 100)
→ docker_inspect (container) → docker_exec (container, command: "sh")
```

### Build & Deploy (ビルド・デプロイ)
```
docker_build (path, tag) → docker_images → docker_ps
```

### Lifecycle Management (ライフサイクル)
- Start: `docker_start (container)`
- Stop: `docker_stop (container)`
- Restart: `docker_restart (container)`

### Compose Workflow (Compose管理)
```
compose_ps → compose_logs (service, tail: 50)
```
- Start: `compose_up (detach: true)`
- Stop: `compose_down`

## Tool Reference

| Tool | Purpose | Key Args |
|------|---------|----------|
| `docker_ps` | List containers | all (bool) |
| `docker_images` | List images | - |
| `docker_logs` | Container logs | container, tail |
| `docker_inspect` | Detailed config | container_or_image |
| `docker_stats` | Live CPU/memory | container (optional) |
| `docker_exec` | Run command | container, command |
| `docker_start` | Start container | container |
| `docker_stop` | Stop container | container |
| `docker_restart` | Restart | container |
| `docker_build` | Build image | path, tag |
| `compose_ps` | Compose status | project_dir |
| `compose_up` | Start services | project_dir, detach |
| `compose_down` | Stop services | project_dir |
| `compose_logs` | Service logs | project_dir, service, tail |
