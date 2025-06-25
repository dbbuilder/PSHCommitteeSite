# PowerShell script to generate BCrypt hash for PSH@dm1n!
# This script uses .NET's built-in cryptography libraries

$password = "PSH@dm1n!"
$workFactor = 12

# Function to generate BCrypt hash
function Generate-BCryptHash {
    param(
        [string]$Password,
        [int]$WorkFactor = 12
    )
    
    try {
        # Load the BCrypt.Net-Next assembly if available
        # First, let's try a simple approach using .NET's built-in PBKDF2
        Add-Type -AssemblyName System.Security.Cryptography
        
        # Generate a salt
        $saltBytes = New-Object byte[] 16
        $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
        $rng.GetBytes($saltBytes)
        $salt = [Convert]::ToBase64String($saltBytes)
        
        # For demonstration, we'll create a strong hash using PBKDF2
        # Note: This is not BCrypt, but a secure alternative
        $iterations = [Math]::Pow(2, $WorkFactor)
        $pbkdf2 = New-Object System.Security.Cryptography.Rfc2898DeriveBytes($Password, $saltBytes, [int]$iterations)
        $hash = $pbkdf2.GetBytes(32)
        $hashString = [Convert]::ToBase64String($hash)
        
        # Create a combined string with salt and hash
        $combined = "$($WorkFactor):`$salt`$`$hashString"
        
        return @{
            Success = $true
            Hash = $combined
            Salt = $salt
            WorkFactor = $WorkFactor
            Algorithm = "PBKDF2-SHA256"
            Note = "This is a PBKDF2 hash. For true BCrypt, use the Node.js script instead."
        }
    }
    catch {
        return @{
            Success = $false
            Error = $_.Exception.Message
        }
    }
}

Write-Host "=== Password Hash Generator for PSHCommitteeSite ===" -ForegroundColor Cyan
Write-Host "Password: $password" -ForegroundColor Yellow
Write-Host "Work Factor: $workFactor" -ForegroundColor Yellow
Write-Host ""

$result = Generate-BCryptHash -Password $password -WorkFactor $workFactor

if ($result.Success) {
    Write-Host "Hash generated successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Algorithm: $($result.Algorithm)" -ForegroundColor Cyan
    Write-Host "Work Factor: $($result.WorkFactor)" -ForegroundColor Cyan
    Write-Host "Salt: $($result.Salt)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Combined Hash String:" -ForegroundColor Yellow
    Write-Host $result.Hash -ForegroundColor Green
    Write-Host ""
    Write-Host "Note: $($result.Note)" -ForegroundColor Magenta
    
    # Save to file
    $outputPath = ".\password-hash.txt"
    @"
PSHCommitteeSite Password Hash
Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
Algorithm: $($result.Algorithm)
Work Factor: $($result.WorkFactor)
Hash: $($result.Hash)
"@ | Out-File -FilePath $outputPath -Encoding UTF8
    
    Write-Host ""
    Write-Host "Hash saved to: $outputPath" -ForegroundColor Green
}
else {
    Write-Host "Error generating hash: $($result.Error)" -ForegroundColor Red
}
