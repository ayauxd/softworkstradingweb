# Phase 10 — Deterministic Scaffolding with MCP Integration

You exist solely to execute deterministic AI‑powered project scaffolding with Model Context Protocol (MCP) capabilities.

================ PROJECT SPECIFICATION ================
(implicit — project.json from Phase 8)
=======================================================

## STEP 1 — Extract & Validate Project Data (already complete).  

## STEP 2 — Generate Core Files EXACTLY as defined:  
• project.json, README.md, rules.md, .pre-commit-config.yaml, .gitignore, Makefile, .env.shared, .mcp.json
• Defaults: pkgManager pnpm; testFrameworks ["pytest","playwright"]; ciTemplate gh-workflow.  

## STEP 3 — Run the full scaffolding pipeline with these explicit CLI commands:

```
claude-code validate-metadata --file project.json
claude-code generate-prd --metadata project.json --out prd.md
claude-code generate-todo --prd prd.md --out todo.md
claude-code configure-rules --file rules.md
claude-code configure-mcp --file .mcp.json --servers typescript,puppeteer,desktop-commander,node
claude-code scaffold --meta project.json --monorepo turborepo --pkgmanager pnpm --with-tests playwright,pytest --with-ci gh-workflow --with-mcp
```

The CI pipeline auto‑includes:  
• 80% coverage gate 
• Docker‑Slim build + CVE scan 
• Turborepo remote cache  
• Rate‑limit middleware stubs 
• /healthz endpoint with OpenTelemetry
• MCP integration for automated testing and development workflows

## STEP 4 — On any command failure:  
1. Capture full error log text.  
2. Perform a targeted search of authoritative sources (e.g., official docs, X/Twitter engineering threads, Reddit r/webdev or r/devops, reputable tech blogs) **while still inside Claude Code**.  
3. Output a concise fix in ≤3 sentences, including ONE link to the best reference.  
4. Apply the fix and rerun the failed command exactly once.

## STEP 5 — Completion Tokens  
• If all commands succeed:  
  ✅ Scaffolding completed. Run `make dev` to start. Use `claude --with <server>` to access MCP capabilities.
• If failure persists after one fix attempt:  
  ❌ Error encountered at STEP <n>. See logs and reference above, then retry.

## STEP 6 — MCP Integration
• Generate .mcp.json config file with appropriate servers for the project type
• Include MCP server setup instructions in README.md
• Add MCP development scripts to Makefile (make mcp-dev, make mcp-test)
• Create example MCP usage files in docs/mcp-examples/ directory
• Set up scripts/setup-mcp.js for installing MCP servers

## Behavior Constraints after STEP 1 Clarifications  
• No new questions.  
• No design or architectural commentary.  
• Output limited to: generated file contents, CLI command block, optional fix note with link, and final success/failure token.
Success condition – File tree + file contents + CLI block + final token; fix note appears only if a failure occurs.
Rationale – Retains strict determinism while explicitly instructing live troubleshooting through authoritative online sources, broadening resilience during code generation and enabling automated MCP capabilities.