#!/bin/bash
# Pre-commit hook to check for sensitive data
# This script helps prevent committing sensitive information to GitHub

echo "🔍 Running pre-commit security checks..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check for .env files
if git diff --cached --name-only | grep -E '\.env$|\.env\.local$|\.env\.production$'; then
    echo -e "${RED}❌ ERROR: Attempting to commit .env file!${NC}"
    echo "Please ensure .env files are in .gitignore"
    exit 1
fi

# Check for potential API keys or secrets in staged files
SUSPICIOUS_PATTERNS=(
    "api[_-]?key\s*=\s*['\"][^'\"]+['\"]"
    "secret[_-]?key\s*=\s*['\"][^'\"]+['\"]"
    "private[_-]?key\s*=\s*['\"][^'\"]+['\"]"
    "password\s*=\s*['\"][^'\"]+['\"]"
    "GEMINI_API_KEY\s*=\s*['\"][^'\"]+['\"]"
    "THIRDWEB_SECRET_KEY\s*=\s*['\"][^'\"]+['\"]"
    "DEPLOYER_PRIVATE_KEY\s*=\s*['\"][^'\"]+['\"]"
)

FOUND_SUSPICIOUS=false

for pattern in "${SUSPICIOUS_PATTERNS[@]}"; do
    if git diff --cached | grep -iE "$pattern" | grep -v "your_" | grep -v "example" | grep -v "test"; then
        echo -e "${YELLOW}⚠️  WARNING: Potential sensitive data found: $pattern${NC}"
        FOUND_SUSPICIOUS=true
    fi
done

if [ "$FOUND_SUSPICIOUS" = true ]; then
    echo -e "${RED}❌ Please review your changes for sensitive data before committing${NC}"
    echo "If this is a false positive, you can skip this check with --no-verify"
    exit 1
fi

# Check commit message length
COMMIT_MSG_FILE=$(git rev-parse --git-dir)/COMMIT_EDITMSG
if [ -f "$COMMIT_MSG_FILE" ]; then
    MSG_LENGTH=$(wc -c < "$COMMIT_MSG_FILE")
    if [ "$MSG_LENGTH" -lt 10 ]; then
        echo -e "${YELLOW}⚠️  WARNING: Commit message is very short. Consider adding more detail.${NC}"
    fi
fi

echo -e "${GREEN}✅ Pre-commit checks passed!${NC}"
exit 0

