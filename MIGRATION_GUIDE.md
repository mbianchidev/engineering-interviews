# Migration Guide: Coding Challenges to Separate Repository

This guide provides step-by-step instructions for migrating the `coding-challenges` folder to a separate public repository.

## Overview

The goal is to extract the `coding-challenges` content from this repository into a new, standalone repository at `mbianchidev/coding-challenges`. This allows for:
- Better organization and focus
- Easier sharing of coding challenges specifically
- Independent versioning and maintenance
- Clearer repository purposes

## Prerequisites

- Git installed and configured
- GitHub account access (mbianchidev)
- GitHub CLI (`gh`) installed (recommended) OR web browser access

## Method 1: Automated Migration (Recommended)

### Step 1: Run the Migration Script

```bash
# Make the script executable
chmod +x scripts/migrate-coding-challenges.sh

# Run the script (output will be in /tmp/coding-challenges-repo by default)
./scripts/migrate-coding-challenges.sh

# Or specify a custom output directory
./scripts/migrate-coding-challenges.sh ~/my-coding-challenges
```

This script will:
- Copy all content from `coding-challenges/` folder
- Create a new git repository
- Generate README.md, LICENSE, .gitignore, and CONTRIBUTING.md
- Provide next steps

### Step 2: Create the GitHub Repository

Using GitHub CLI:
```bash
gh repo create mbianchidev/coding-challenges --public --description "Collection of coding challenges from technical interviews"
```

Or via GitHub Web Interface:
1. Go to https://github.com/new
2. Repository name: `coding-challenges`
3. Description: "Collection of coding challenges from technical interviews"
4. Visibility: **Public**
5. Do NOT initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### Step 3: Push to GitHub

```bash
cd /tmp/coding-challenges-repo  # or your custom output directory

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Migrate coding challenges from engineering-interviews repository"

# Set default branch to main
git branch -M main

# Add remote origin
git remote add origin https://github.com/mbianchidev/coding-challenges.git

# Push to GitHub
git push -u origin main
```

### Step 4: Update the Original Repository

After successfully creating the new repository, update this repository's README to reference it:

```bash
# In the engineering-interviews repository
# Edit README.md to add a link to the new repository
```

Add a section like:
```markdown
## Coding Challenges

The coding challenges have been moved to a separate repository for better organization:
👉 [mbianchidev/coding-challenges](https://github.com/mbianchidev/coding-challenges)
```

## Method 2: Manual Migration with Git History (Advanced)

If you want to preserve the git history for the `coding-challenges` folder:

### Step 1: Clone the Repository

```bash
git clone https://github.com/mbianchidev/engineering-interviews.git coding-challenges-repo
cd coding-challenges-repo
```

### Step 2: Filter the Repository

Using `git filter-repo` (install with `pip install git-filter-repo`):

```bash
git filter-repo --path coding-challenges/ --path-rename coding-challenges/:
```

Or using `git filter-branch` (deprecated but available):

```bash
git filter-branch --subdirectory-filter coding-challenges -- --all
```

### Step 3: Create the New Repository on GitHub

Follow Step 2 from Method 1 above.

### Step 4: Push the Filtered Repository

```bash
git remote add origin https://github.com/mbianchidev/coding-challenges.git
git branch -M main
git push -u origin main
```

## Method 3: Manual Copy (Simple)

### Step 1: Create New Repository on GitHub

Follow Step 2 from Method 1 above.

### Step 2: Clone and Setup

```bash
# Clone the new empty repository
git clone https://github.com/mbianchidev/coding-challenges.git
cd coding-challenges

# Copy content from the engineering-interviews repository
cp -r /path/to/engineering-interviews/coding-challenges/* .

# Create necessary files (README, LICENSE, etc.)
# You can copy the generated files from the automated script
```

### Step 3: Commit and Push

```bash
git add .
git commit -m "Initial commit: Coding challenges collection"
git push origin main
```

## Post-Migration Steps

### 1. Update Original Repository

In the `engineering-interviews` repository:

1. Update README.md to reference the new repository
2. Consider adding a note in the `coding-challenges` folder itself
3. Optionally: Remove the `coding-challenges` folder if no longer needed (create backup first!)

### 2. Configure New Repository

In the new `coding-challenges` repository:

1. Add repository description and topics on GitHub:
   - Topics: `coding-challenges`, `interviews`, `algorithms`, `data-structures`, `interview-preparation`

2. Enable GitHub Pages (optional):
   - Settings → Pages → Source → Deploy from a branch → main

3. Add repository settings:
   - Enable Issues for discussions
   - Enable Discussions if desired

### 3. Cross-Reference

Add links between repositories:
- In `engineering-interviews`: Link to `coding-challenges` repository
- In `coding-challenges`: Link back to `engineering-interviews` for interview guidelines

## Verification

After migration, verify:

- [ ] All files are present in the new repository
- [ ] README.md is properly formatted and displays correctly
- [ ] LICENSE file is present
- [ ] Repository is public
- [ ] All subdirectories and files are accessible
- [ ] Links in README work correctly

## Troubleshooting

### Issue: Permission Denied
- Ensure you have write access to `mbianchidev` account
- Check SSH keys or HTTPS authentication
- Try using `gh auth login` to authenticate

### Issue: Files Missing
- Verify the source path in the migration script
- Check that hidden files are copied (use `cp -r` with appropriate flags)

### Issue: Large File Warnings
- Some PDF files might trigger warnings
- Consider using Git LFS for large files: `git lfs install`

## Rollback

If you need to rollback:

1. Delete the new repository on GitHub
2. The original repository remains unchanged
3. Start the migration process again

## Support

For questions or issues:
1. Check GitHub documentation: https://docs.github.com
2. Open an issue in the relevant repository
3. Review git documentation: https://git-scm.com/doc

---

**Note**: This migration does not affect the original `engineering-interviews` repository. The coding-challenges folder will remain there until explicitly removed.
