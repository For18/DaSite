namespace backend.controllers
{
    public class IdentityController
    {
        private const string tokenSecret = "ThisWasNotSoSecureAfterAllWasIt";
        private static readonly Timespan tokenLifespan = TimeSpan.FromHours(2);

        [HttpPost("token")]
        public IActionResult GenerateToken([FromBody]GenerateTokenRequest request)
        {
            // Validate user credentials
            var user = ValidateUserCredentials(request.Email, request.Password);
            if (user == null || user.Id != request.uid || user.Email != request.Email || user.Password != request.Password)
            {
                return Unauthorized();
            }

            // Create JWT token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(tokenSecret);
            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new(JwtRegisteredClaimNames.Sub, request.Email),
                new(JwtRegisteredClaimNames.Email, request.Email),
                new("uid", request.uid.ToString())
            };

            // Add custom claims
            foreach (var claimPair in request.CustomClaims)
            {
                var jsonElement = (JsonElement)claimPair.Value;
                var valueType = jsonElement.ValueKind switch
                {
                    JsonValueKind.Number => jsonElement.GetRawText(),
                    JsonValueKind.True => "true",
                    JsonValueKind.False => "false",
                    _ => ClaimValueTypes.String
                };
            }

            // Add the claim
            var claim = new Claim(claimPair.Key, claimPair.Value.ToString()!, valueType);
                claims.Add(claim);
            
            // Create the token descriptor with issuer and audience
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.Add(tokenLifespan),
                Issuer = "", // TODO: Add issuer
                Audience = "", // TODO: Add audience
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            // Return the token
            var jwt = tokenHandler.WriteToken(token);
            return Ok(jwt);
        }
    }
}