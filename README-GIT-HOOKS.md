# Server-Side Git Hooks

This repository includes server-side Git hooks to enforce repository policies.

## Pre-receive Hook

The `pre-receive` hook prevents:

- Branch deletions
- Force pushes

## Installation on the Server

These hooks need to be manually installed on your Git server:

### For a Bare Git Repository

1. Copy the hook to the server:

   ```bash
   scp .git-hooks/pre-receive user@server:/path/to/repo.git/hooks/
   ```

2. Make it executable:
   ```bash
   ssh user@server "chmod +x /path/to/repo.git/hooks/pre-receive"
   ```

### For GitHub

GitHub Enterprise allows custom pre-receive hooks. Contact your GitHub admin to install this hook.

### For GitLab

GitLab calls these "server hooks" and supports custom pre-receive hooks. See GitLab documentation for installation.

### For Bitbucket Server

Bitbucket Server supports pre-receive hooks through the "Hook Scripts" plugin.

## Usage Notes

This hook blocks two potentially destructive actions:

1. **Branch deletion**: Prevents accidental or unauthorized deletion of branches
2. **Force pushes**: Prevents history rewriting which can cause issues for other team members

If you legitimately need to perform either action, contact your repository administrator.
