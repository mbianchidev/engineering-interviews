#!/bin/bash

# Script to migrate coding-challenges folder to a separate repository
# This script helps prepare the coding-challenges content for a new repository

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CHALLENGES_DIR="$REPO_ROOT/coding-challenges"
OUTPUT_DIR="${1:-/tmp/coding-challenges-repo}"

echo "=== Coding Challenges Migration Script ==="
echo "Source: $CHALLENGES_DIR"
echo "Output: $OUTPUT_DIR"
echo ""

# Check if coding-challenges directory exists
if [ ! -d "$CHALLENGES_DIR" ]; then
    echo "Error: coding-challenges directory not found at $CHALLENGES_DIR"
    exit 1
fi

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Copy coding-challenges content
echo "Copying coding-challenges content..."
cp -r "$CHALLENGES_DIR"/. "$OUTPUT_DIR/"

# Initialize git repository in output directory
echo "Initializing git repository..."
cd "$OUTPUT_DIR"
if [ ! -d ".git" ]; then
    git init
fi

# Create .gitignore
echo "Creating .gitignore..."
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
vendor/

# Build outputs
*.exe
*.out
a.out
dist/
build/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
.venv

# Go
*.test
*.prof

# Terraform
.terraform/
*.tfstate
*.tfstate.*
.terraform.lock.hcl

# Logs
*.log
EOF

# Create comprehensive README
echo "Creating README.md..."
cat > README.md << 'EOF'
# Coding Challenges

This repository contains coding challenges and exercises from various technical interviews and practice sessions spanning multiple years.

## 📁 Structure

```
.
├── 2023/           # Coding challenges from 2023
├── 2024/           # Coding challenges from 2024
└── university-exercises/  # Academic exercises
```

## 🎯 Purpose

This collection serves as:
- A reference for technical interview preparation
- Examples of real-world coding challenges
- Practice material for various programming languages and frameworks
- A showcase of problem-solving approaches

## 📂 Contents

### 2023 Challenges
- **Booking.com** - Python coding exercises
- **Omnistrate** - Multiple exercise sets
- **Replit** - Validation algorithms

### 2024 Challenges
- **AWS** - Algorithm challenges and real-world problems
- **GitHub** - Technical exercises and presentations
- **Uber** - Multi-part exercises
- **Zerotier** - Go-based API and testing exercises
- **Studocu** - Terraform infrastructure challenges

### University Exercises
- **Plot Exercises** - Academic programming challenges

## 🚀 Getting Started

Each challenge folder contains:
- Source code files
- README or documentation (where applicable)
- Test files (where applicable)
- Problem statements or requirements

To explore a challenge:
1. Navigate to the specific company/year folder
2. Read the README or problem statement
3. Review the solution code
4. Run tests if available

## 💡 Usage

These challenges can be used for:
- Interview preparation
- Learning new programming languages
- Understanding common interview patterns
- Practicing system design and algorithms

## 🤝 Contributing

While this is primarily a personal collection, suggestions and improvements are welcome via issues or pull requests.

## 📝 License

The solutions and code in this repository are provided as-is for educational purposes. Individual challenges may be subject to the intellectual property rights of the respective companies.

## 🔗 Related Resources

For more interview preparation resources and guidelines, check out the main [Engineering Interviews](https://github.com/mbianchidev/engineering-interviews) repository.

---

*This repository was extracted from the main engineering-interviews repository to provide focused access to coding challenges.*
EOF

# Create LICENSE file
echo "Creating LICENSE..."
CURRENT_YEAR=$(date +%Y)
cat > LICENSE << EOF
MIT License

Copyright (c) $CURRENT_YEAR Matteo Bianchi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF

# Create CONTRIBUTING.md
echo "Creating CONTRIBUTING.md..."
cat > CONTRIBUTING.md << 'EOF'
# Contributing Guidelines

Thank you for your interest in contributing to this repository!

## How to Contribute

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/your-feature`)
3. **Commit your changes** (`git commit -am 'Add some feature'`)
4. **Push to the branch** (`git push origin feature/your-feature`)
5. **Create a Pull Request**

## Adding New Challenges

When adding new coding challenges:

1. Create a folder structure: `YEAR/COMPANY/`
2. Include:
   - Source code files
   - README.md with problem description
   - Test files (if applicable)
   - Any relevant documentation

3. Update the main README.md to reference the new challenge

## Code Style

- Follow the conventions of the language you're using
- Include comments for complex logic
- Add documentation where helpful

## Questions?

Feel free to open an issue for any questions or suggestions!
EOF

echo ""
echo "=== Migration Preparation Complete ==="
echo ""
echo "Repository prepared at: $OUTPUT_DIR"
echo ""
echo "Next steps:"
echo "1. Review the generated files in $OUTPUT_DIR"
echo "2. Create a new repository on GitHub:"
echo "   gh repo create mbianchidev/coding-challenges --public"
echo "3. Add the remote and push:"
echo "   cd $OUTPUT_DIR"
echo "   git add ."
echo "   git commit -m 'Initial commit: Migrate coding challenges'"
echo "   git branch -M main"
echo "   git remote add origin https://github.com/mbianchidev/coding-challenges.git"
echo "   git push -u origin main"
echo ""
echo "For detailed instructions, see MIGRATION_GUIDE.md in the repository root"
