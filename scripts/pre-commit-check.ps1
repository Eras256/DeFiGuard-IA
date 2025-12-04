# Pre-commit hook for PowerShell (Windows)
# This script helps prevent committing sensitive information to GitHub

Write-Host "🔍 Running pre-commit security checks..." -ForegroundColor Cyan

$ErrorFound = $false

# Check for .env files in staged changes
$stagedFiles = git diff --cached --name-only
$envFiles = $stagedFiles | Select-String -Pattern '\.env$|\.env\.local$|\.env\.production$'

if ($envFiles) {
    Write-Host "❌ ERROR: Attempting to commit .env file!" -ForegroundColor Red
    Write-Host "Please ensure .env files are in .gitignore" -ForegroundColor Yellow
    $ErrorFound = $true
}

# Check for potential API keys or secrets
$suspiciousPatterns = @(
    'api[_-]?key\s*=\s*[''""][^''""]+[''""]',
    'secret[_-]?key\s*=\s*[''""][^''""]+[''""]',
    'private[_-]?key\s*=\s*[''""][^''""]+[''""]',
    'password\s*=\s*[''""][^''""]+[''""]',
    'GEMINI_API_KEY\s*=\s*[''""][^''""]+[''""]',
    'THIRDWEB_SECRET_KEY\s*=\s*[''""][^''""]+[''""]',
    'DEPLOYER_PRIVATE_KEY\s*=\s*[''""][^''""]+[''""]'
)

$diffContent = git diff --cached

foreach ($pattern in $suspiciousPatterns) {
    $matches = $diffContent | Select-String -Pattern $pattern -CaseSensitive:$false
    if ($matches) {
        $filtered = $matches | Where-Object { 
            $_.Line -notmatch 'your_|example|test|placeholder|TODO'
        }
        if ($filtered) {
            Write-Host "⚠️  WARNING: Potential sensitive data found: $pattern" -ForegroundColor Yellow
            $ErrorFound = $true
        }
    }
}

if ($ErrorFound) {
    Write-Host "❌ Please review your changes for sensitive data before committing" -ForegroundColor Red
    Write-Host "If this is a false positive, you can skip this check with --no-verify" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Pre-commit checks passed!" -ForegroundColor Green
exit 0

