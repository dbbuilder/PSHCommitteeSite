using System;
using BCrypt.Net;

namespace GenerateBCryptHash
{
    class Program
    {
        static void Main(string[] args)
        {
            string password = "PSH@dm1n!";
            int workFactor = 12;
            
            Console.WriteLine("=== BCrypt Hash Generator for PSHCommitteeSite ===");
            Console.WriteLine($"Password: {password}");
            Console.WriteLine($"Work Factor: {workFactor}");
            Console.WriteLine();
            
            try
            {
                // Generate BCrypt hash
                string hash = BCrypt.Net.BCrypt.HashPassword(password, workFactor);
                
                Console.WriteLine("BCrypt Hash Generated Successfully!");
                Console.WriteLine();
                Console.WriteLine("Hash:");
                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine(hash);
                Console.ResetColor();
                Console.WriteLine();
                
                // Verify the hash works
                bool isValid = BCrypt.Net.BCrypt.Verify(password, hash);
                Console.WriteLine($"Verification Test: {(isValid ? "PASSED" : "FAILED")}");
                
                // Save to file
                string output = $@"PSHCommitteeSite BCrypt Password Hash
Generated: {DateTime.Now:yyyy-MM-dd HH:mm:ss}
Algorithm: BCrypt
Work Factor: {workFactor}
Hash: {hash}
Verified: {isValid}

Usage in appsettings.json:
{{
  ""AdminSettings"": {{
    ""PasswordHash"": ""{hash}""
  }}
}}

Usage in Azure Key Vault:
Secret Name: admin-password-hash
Secret Value: {hash}
";
                
                System.IO.File.WriteAllText("bcrypt-hash.txt", output);
                Console.WriteLine();
                Console.WriteLine("Hash saved to: bcrypt-hash.txt");
                
                // Also display environment variable format
                Console.WriteLine();
                Console.WriteLine("To set as environment variable:");
                Console.ForegroundColor = ConsoleColor.Yellow;
                Console.WriteLine($"set ADMIN_PASSWORD_HASH={hash}");
                Console.ResetColor();
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"Error: {ex.Message}");
                Console.ResetColor();
            }
            
            Console.WriteLine();
            Console.WriteLine("Press any key to exit...");
            Console.ReadKey();
        }
    }
}
