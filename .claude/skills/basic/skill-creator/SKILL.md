---
name: skill-creator
description: Create new Claude Code skills with proper structure, frontmatter, and best practices. Use when building custom skills, slash commands, automating workflows, or integrating MCP tools into skills.
allowed-tools: "Read, Write, Bash, Glob, Grep"
argument-hint: "[skill-name] [description]"
---

# Skill Creator v2.0

Production-quality Claude Code skill generator with full frontmatter support.

## Workflow

### Step 1: Gather Requirements

Determine from user input or ask:
1. **Name** - kebab-case identifier (e.g., `deploy-app`, `review-pr`)
2. **Purpose** - What does this skill do?
3. **Trigger** - When should it activate?
4. **Scope** - Project-level (`.claude/skills/`) or global (`~/.claude/skills/`)?
5. **Invocation** - User-only, Claude-only, or both?
6. **Tools needed** - Which tools should be allowed?
7. **MCP integration** - Does it need miyabi-mcp-bundle tools?

### Step 2: Select Skill Type

| Type | Use Case | Key Settings |
|------|----------|-------------|
| **Reference** | Domain knowledge, conventions | Default invocation, no side effects |
| **Task** | Step-by-step workflows | `disable-model-invocation: true` |
| **Background** | Auto-loaded context | `user-invocable: false` |
| **Orchestrator** | Multi-tool coordination | `allowed-tools` with MCP tools |

### Step 3: Create Directory Structure

```bash
mkdir -p [scope-path]/skills/[category]/[skill-name]
```

Scope paths:
- Global: `~/.claude/skills/`
- Project: `.claude/skills/`

### Step 4: Generate SKILL.md

Use the appropriate template from [templates/](templates/).

**Frontmatter Reference:**

```yaml
---
name: skill-name                    # Required: kebab-case, max 64 chars
description: What + When trigger    # Required: action verb + use conditions
disable-model-invocation: false     # true = user-only invocation
user-invocable: true                # false = Claude-only (background knowledge)
argument-hint: "[args]"             # Shown in autocomplete
allowed-tools: "Read, Grep, Bash"   # Restrict tool access
model: opus                         # Force specific model
context: fork                       # Run in isolated subagent
agent: Explore                      # Subagent type when context: fork
---
```

**String Substitutions:**
- `$ARGUMENTS` - All arguments passed
- `$0`, `$1`, `$2` - Individual arguments by index
- `${CLAUDE_SESSION_ID}` - Current session ID

### Step 5: Add Supporting Files (if needed)

For skills over 200 lines, split into:
- `reference.md` - Detailed documentation
- `examples.md` - Usage examples
- `templates/` - Output templates
- `scripts/` - Helper scripts

Reference them from SKILL.md:
```markdown
For details, see [reference.md](reference.md)
```

### Step 6: Validate

1. Check SKILL.md is under 500 lines
2. Verify frontmatter YAML is valid
3. Confirm name is kebab-case, no reserved words
4. Test with `/skill-name` invocation
5. Check `/context` for budget warnings

```bash
# Verify file exists and is valid
cat [path]/SKILL.md | head -5
wc -l [path]/SKILL.md
```

## Rules

- **Name**: kebab-case only, max 64 chars
- **No reserved words**: claude, anthropic, mcp, system
- **Description format**: "[Action verb] ... Use when [trigger conditions]."
- **SKILL.md**: Under 500 lines; move details to supporting files
- **One responsibility**: Each skill does one thing well
- **Include examples**: Show Claude what good output looks like

## MCP Integration Pattern

When creating skills that use miyabi-mcp-bundle tools, reference them as MCP tool calls:

```markdown
## Available MCP Tools
Use the following miyabi-mcp-bundle tools:
- `mcp__miyabi-mcp-bundle__[tool_name]` for [purpose]
```

Categories available: Git (19), Tmux (10), Logs (7), Resources (10), Network (15), Process (14), Files (10), Claude Monitor (8), GitHub (21), Docker (14), K8s (6), Spec-Kit (9), DB (6), Time (4), Calc (3), Think (3), Generator (4), Health (1)
