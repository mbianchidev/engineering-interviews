# Quick Start: Migrate Coding Challenges

This is a quick reference for migrating the coding-challenges folder to a separate repository.

## One-Line Quick Start

```bash
# 1. Run the migration script
./scripts/migrate-coding-challenges.sh

# 2. Create the GitHub repository and push
cd /tmp/coding-challenges-repo
git add .
git commit -m "Initial commit: Migrate coding challenges"
git branch -M main
gh repo create mbianchidev/coding-challenges --public --source=. --remote=origin --push
```

## Detailed Steps

### Step 1: Run Migration Script
```bash
chmod +x scripts/migrate-coding-challenges.sh
./scripts/migrate-coding-challenges.sh
```

The script will:
- ✅ Copy all coding-challenges content to `/tmp/coding-challenges-repo`
- ✅ Initialize a git repository
- ✅ Create README.md, LICENSE, .gitignore, and CONTRIBUTING.md
- ✅ Provide clear next steps

### Step 2: Review Generated Content
```bash
cd /tmp/coding-challenges-repo
ls -la
cat README.md
```

### Step 3: Create GitHub Repository

**Option A - Using GitHub CLI (Recommended):**
```bash
cd /tmp/coding-challenges-repo
git add .
git commit -m "Initial commit: Migrate coding challenges"
git branch -M main
gh repo create mbianchidev/coding-challenges --public --source=. --remote=origin --push
```

**Option B - Manual:**
1. Go to https://github.com/new
2. Repository name: `coding-challenges`
3. Visibility: **Public**
4. Click "Create repository"
5. Then run:
```bash
cd /tmp/coding-challenges-repo
git add .
git commit -m "Initial commit: Migrate coding challenges"
git branch -M main
git remote add origin https://github.com/mbianchidev/coding-challenges.git
git push -u origin main
```

## Result

After completion, you'll have:
- ✅ New public repository at `https://github.com/mbianchidev/coding-challenges`
- ✅ All coding challenges properly organized
- ✅ Professional README, LICENSE, and documentation
- ✅ Updated main repository with links to new location

## Need More Help?

See [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) for:
- Alternative migration methods
- Troubleshooting
- Advanced options (preserving git history)
- Post-migration configuration

## Files Created by This PR

- `scripts/migrate-coding-challenges.sh` - Automated migration script
- `MIGRATION_GUIDE.md` - Comprehensive migration guide
- `coding-challenges/README.md` - Migration notice in original location
- Updated `README.md` - Links to new repository location
