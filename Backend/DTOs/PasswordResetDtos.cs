namespace MoneyManager.API.DTOs;

public class ForgotPasswordRequest
{
    public string UsernameOrEmail { get; set; } = string.Empty;
}

public class ResetPasswordRequest
{
    public string UsernameOrEmail { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
}

public class ForgotPasswordResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? PhoneNumberHint { get; set; }
}

public class ResetPasswordResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}
