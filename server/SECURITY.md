# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x     | Yes       |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly.

**Do not open a public issue.** Instead, please contact us directly:

For security concerns, please contact: **serkanbyx1@gmail.com**

We will respond within 48 hours and work with you to address the issue promptly.

## Security Measures

This API implements the following security best practices:

- **Helmet** — Sets various HTTP headers for protection
- **Rate Limiting** — Prevents brute-force and DDoS attacks
- **MongoDB Sanitization** — Prevents NoSQL injection attacks
- **HPP** — Protects against HTTP parameter pollution
- **JWT Authentication** — Secure token-based authentication
- **Password Hashing** — bcrypt with 12 salt rounds
- **Input Validation** — express-validator on all endpoints
- **CORS** — Configured origin restriction
