using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using MoneyManager.API.Data;
using MoneyManager.API.DTOs;
using MoneyManager.API.Models;

namespace MoneyManager.API.Services;

public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(LoginRequest request);
    Task<RegisterResponse> RegisterAsync(RegisterRequest request);
    Task<bool> UsernameExistsAsync(string username);
    Task<ForgotPasswordResponse> ForgotPasswordAsync(ForgotPasswordRequest request);
    Task<ResetPasswordResponse> ResetPasswordAsync(ResetPasswordRequest request);
}

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<LoginResponse?> LoginAsync(LoginRequest request)
    {
        Console.WriteLine($"=== LOGIN ATTEMPT ===");
        Console.WriteLine($"Username: {request.Username}");
        Console.WriteLine($"Password: {request.Password}");
        
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == request.Username);

        if (user == null)
        {
            Console.WriteLine("User not found in database");
            return null;
        }

        Console.WriteLine($"User found: {user.Username}");
        Console.WriteLine($"Stored hash: {user.PasswordHash}");
        
        var inputHash = HashPassword(request.Password);
        Console.WriteLine($"Computed hash: {inputHash}");
        Console.WriteLine($"Hashes match: {inputHash == user.PasswordHash}");

        if (!VerifyPassword(request.Password, user.PasswordHash))
        {
            Console.WriteLine("Password verification FAILED");
            return null;
        }

        Console.WriteLine("Login SUCCESS!");
        user.LastLoginAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        var token = GenerateJwtToken(user);

        return new LoginResponse
        {
            UserId = user.Id,
            Username = user.Username,
            Name = user.Name,
            Email = user.Email,
            Token = token
        };
    }

    public async Task<RegisterResponse> RegisterAsync(RegisterRequest request)
    {
        // Check if username already exists
        if (await UsernameExistsAsync(request.Username))
        {
            return new RegisterResponse
            {
                Success = false,
                Message = "Username already exists. Please choose a different username."
            };
        }

        // Check if email already exists
        var emailExists = await _context.Users
            .AnyAsync(u => u.Email == request.Email);

        if (emailExists)
        {
            return new RegisterResponse
            {
                Success = false,
                Message = "Email already registered. Please use a different email."
            };
        }

        var user = new User
        {
            Username = request.Username,
            PasswordHash = HashPassword(request.Password),
            Email = request.Email,
            PhoneNumber = request.PhoneNumber,
            Name = request.Name,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return new RegisterResponse
        {
            Success = true,
            Message = "Account created successfully! Please login with your credentials."
        };
    }

    public async Task<bool> UsernameExistsAsync(string username)
    {
        return await _context.Users.AnyAsync(u => u.Username == username);
    }

    private string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }

    private bool VerifyPassword(string password, string passwordHash)
    {
        var hash = HashPassword(password);
        return hash == passwordHash;
    }

    private string GenerateJwtToken(User user)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            _configuration["JwtSettings:SecretKey"] ?? "YourSuperSecretKeyForJWTTokenGeneration12345!"));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email)
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["JwtSettings:Issuer"] ?? "MoneyManagerAPI",
            audience: _configuration["JwtSettings:Audience"] ?? "MoneyManagerClient",
            claims: claims,
            expires: DateTime.Now.AddDays(30),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<ForgotPasswordResponse> ForgotPasswordAsync(ForgotPasswordRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == request.UsernameOrEmail || u.Email == request.UsernameOrEmail);

        if (user == null)
        {
            return new ForgotPasswordResponse
            {
                Success = false,
                Message = "User not found with the provided username or email."
            };
        }

        var maskedPhone = MaskPhoneNumber(user.PhoneNumber);

        return new ForgotPasswordResponse
        {
            Success = true,
            Message = "User found. Please verify your phone number to reset password.",
            PhoneNumberHint = maskedPhone
        };
    }

    public async Task<ResetPasswordResponse> ResetPasswordAsync(ResetPasswordRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == request.UsernameOrEmail || u.Email == request.UsernameOrEmail);

        if (user == null)
        {
            return new ResetPasswordResponse
            {
                Success = false,
                Message = "User not found."
            };
        }

        if (user.PhoneNumber != request.PhoneNumber)
        {
            return new ResetPasswordResponse
            {
                Success = false,
                Message = "Phone number verification failed."
            };
        }

        user.PasswordHash = HashPassword(request.NewPassword);
        await _context.SaveChangesAsync();

        return new ResetPasswordResponse
        {
            Success = true,
            Message = "Password reset successfully. You can now login with your new password."
        };
    }

    private string MaskPhoneNumber(string phoneNumber)
    {
        if (string.IsNullOrEmpty(phoneNumber) || phoneNumber.Length < 4)
            return "****";

        var visibleDigits = 4;
        var maskedPart = new string('*', phoneNumber.Length - visibleDigits);
        var visiblePart = phoneNumber.Substring(phoneNumber.Length - visibleDigits);

        return maskedPart + visiblePart;
    }
}
