# PSHCommitteeSite Password Configuration

## Generated BCrypt Hash
```
$2a$12$PU48alh6l1eD1VAck3AxFO5UKa5el3WGpc98b3UCv/uCIQxh.vH9S
```

## Configuration Options

### 1. Environment Variables (Development)

#### Windows Command Prompt:
```cmd
set ADMIN_PASSWORD=PSH@dm1n!
set ADMIN_PASSWORD_HASH=$2a$12$PU48alh6l1eD1VAck3AxFO5UKa5el3WGpc98b3UCv/uCIQxh.vH9S
```

#### Windows PowerShell:
```powershell
$env:ADMIN_PASSWORD = "PSH@dm1n!"
$env:ADMIN_PASSWORD_HASH = '$2a$12$PU48alh6l1eD1VAck3AxFO5UKa5el3WGpc98b3UCv/uCIQxh.vH9S'
```

#### Linux/Mac:
```bash
export ADMIN_PASSWORD='PSH@dm1n!'
export ADMIN_PASSWORD_HASH='$2a$12$PU48alh6l1eD1VAck3AxFO5UKa5el3WGpc98b3UCv/uCIQxh.vH9S'
```

### 2. appsettings.json (Development Only)
```json
{
  "AdminSettings": {
    "PasswordHash": "$2a$12$PU48alh6l1eD1VAck3AxFO5UKa5el3WGpc98b3UCv/uCIQxh.vH9S"
  }
}
```

### 3. Azure Key Vault (Production - Recommended)

Create a secret in Azure Key Vault:
- **Secret Name**: `admin-password-hash`
- **Secret Value**: `$2a$12$PU48alh6l1eD1VAck3AxFO5UKa5el3WGpc98b3UCv/uCIQxh.vH9S`

### 4. Azure App Service Configuration

Using Azure CLI:
```bash
az webapp config appsettings set \
  --name your-app-name \
  --resource-group your-rg \
  --settings ADMIN_PASSWORD_HASH='$2a$12$PU48alh6l1eD1VAck3AxFO5UKa5el3WGpc98b3UCv/uCIQxh.vH9S'
```

## C# Usage Example

```csharp
using BCrypt.Net;
using Microsoft.Extensions.Configuration;

public class AuthenticationService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthenticationService> _logger;
    
    public AuthenticationService(IConfiguration configuration, ILogger<AuthenticationService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }
    
    public bool ValidateAdminPassword(string password)
    {
        try
        {
            // Get hash from configuration
            var storedHash = _configuration["AdminSettings:PasswordHash"] 
                           ?? Environment.GetEnvironmentVariable("ADMIN_PASSWORD_HASH");
            
            if (string.IsNullOrEmpty(storedHash))
            {
                _logger.LogError("Admin password hash not configured");
                return false;
            }
            
            // Verify password against hash
            bool isValid = BCrypt.Net.BCrypt.Verify(password, storedHash);
            
            _logger.LogInformation("Admin password validation: {Result}", isValid ? "Success" : "Failed");
            
            return isValid;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating admin password");
            return false;
        }
    }
}
```

## Security Notes

1. **Never commit passwords or hashes to source control**
2. **Use Azure Key Vault for production environments**
3. **The plain text password should only be stored in secure locations**
4. **Consider implementing password rotation policies**
5. **Add rate limiting to prevent brute force attacks**
6. **Log authentication attempts for security monitoring**

## Generated Files
- `password-hash-bcrypt.txt` - Contains the BCrypt hash
- `generate-password-hash.js` - Node.js script to generate hashes
- `GenerateBCryptHash.cs` - C# console app to generate hashes

## Verification
To verify the hash is working correctly, you can use the following:

```javascript
// Node.js
const bcrypt = require('bcryptjs');
const isValid = bcrypt.compareSync('PSH@dm1n!', '$2a$12$PU48alh6l1eD1VAck3AxFO5UKa5el3WGpc98b3UCv/uCIQxh.vH9S');
console.log(isValid); // Should print: true
```

```csharp
// C#
bool isValid = BCrypt.Net.BCrypt.Verify("PSH@dm1n!", "$2a$12$PU48alh6l1eD1VAck3AxFO5UKa5el3WGpc98b3UCv/uCIQxh.vH9S");
Console.WriteLine(isValid); // Should print: True
```
