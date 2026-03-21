---
description: Create a pull request for the current code.
---

## Steps

1. If on master branch, create a new branch. Ask the user for a name and give some suggestions.

2. Make sure all code is staged and create a commit with a fitting title.

3. Draft the PR using this template:

```
gh pr create --title "<short title under 70 chars>" --body "$(cat <<'EOF'
## Background

<Why are we doing this? What problem does it solve or what goal does it serve?>

## What was done

<High-level overview of changes>

### Architectural changes

<Any structural or architectural changes. Remove this section if none.>

### API and DTO changes

<Changes to API endpoints, request/response DTOs, or data contracts. Remove this section if none.>

### UI changes

<Notable frontend/visual changes. Include screenshots if applicable. Remove this section if none.>

## Test plan

<What was tested — new/updated automated tests, manual verification steps, or other validation>
EOF
)"
```

4. Return the PR URL when done.

## Important

- Remove any sections from the template that don't apply (e.g., no architectural changes = remove that section)
- Be specific and concise — no filler text
- The title should describe what changed, not why
- The background section should describe why, not what
