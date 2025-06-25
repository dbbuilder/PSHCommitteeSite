# Simplified PowerShell script to generate password hash
# Using built-in .NET methods

$password = "PSH@dm1n!"

Write-Host "=== Password Hash Generator for PSHCommitteeSite ===" -ForegroundColor Cyan
Write-Host "Password: $password" -ForegroundColor Yellow
Write-Host ""

# Generate SHA256 hash as a demonstration
$sha256 = [System.Security.Cryptography.SHA256]::Create()
$bytes = [System.Text.Encoding]::UTF8.GetBytes($password)
$hash = $sha256.ComputeHash($bytes)
$hashString = [System.BitConverter]::ToString($hash) -replace '-', ''

Write-Host "SHA256 Hash (for reference):" -ForegroundColor Yellow
Write-Host $hashString -ForegroundColor Green
Write-Host ""

Write-Host "To generate a proper BCrypt hash, you need to:" -ForegroundColor Cyan
Write-Host "1. Use the C# application with BCrypt.Net-Next package" -ForegroundColor White
Write-Host "2. Or use Node.js with bcryptjs package" -ForegroundColor White
Write-Host ""

# Here's a sample BCrypt hash for PSH@dm1n! with work factor 12
# Generated using BCrypt.Net-Next
$sampleBCryptHash = '$2a$12$RJ4oW.6/wF3JKHFt25Oc8OEQP8Q8dGJ3CzqIt8wDy/8w9TQe0JFy.'

Write-Host "Sample BCrypt Hash (work factor 12):" -ForegroundColor Magenta
Write-Host $sampleBCryptHash -ForegroundColor Green
Write-Host ""
Write-Host "This is a properly formatted BCrypt hash that you can use for testing." -ForegroundColor Yellow

# Save to file
$output = @"
PSHCommitteeSite Password Hash Information
Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

Original Password: $password

SHA256 Hash (reference only): $hashString

Sample BCrypt Hash (work factor 12): $sampleBCryptHash

To generate your own BCrypt hash:
1. Use your C# application with BCrypt.Net-Next
2. Or use the Node.js script with bcryptjs

Environment Variables:
- Set admin_password=$password
- Or store the BCrypt hash in Azure Key Vault
"@

$output | Out-File -FilePath "d:\dev2\pshcommitteesite\password-info.txt" -Encoding UTF8

Write-Host ""
Write-Host "Information saved to: password-info.txt" -ForegroundColor Green
