#!/bin/bash
set -e

echo "Building for GitHub Pages (static export)..."

# Temporarily move the API directory outside the app folder to exclude it from the build
if [ -d "app/api" ]; then
  echo "Temporarily moving API routes (not compatible with static export)..."
  mv app/api /tmp/api-backup-$$
fi

# Run the build with static export enabled
DEPLOY_ENV=github-pages npm run build

# Restore the API directory after build
if [ -d "/tmp/api-backup-$$" ]; then
  echo "Restoring API routes..."
  mv /tmp/api-backup-$$ app/api
fi

echo "Build completed successfully!"
