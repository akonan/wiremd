# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of wiremd seriously. If you discover a security vulnerability, please follow these steps:

### Please DO NOT:

- Open a public GitHub issue for security vulnerabilities
- Disclose the vulnerability publicly before it has been addressed

### Please DO:

1. **Email the maintainer** at the email address listed in the package.json or GitHub profile
2. **Include the following information**:
   - Description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact
   - Suggested fix (if you have one)

### What to Expect

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Varies based on severity and complexity
  - Critical: Within 7 days
  - High: Within 30 days
  - Medium/Low: Next scheduled release

### Disclosure Process

1. Security report received and acknowledged
2. Issue confirmed and severity assessed
3. Fix developed and tested
4. Patch released as quickly as possible
5. Public disclosure after users have time to update (typically 7-14 days)
6. Credit given to reporter (unless anonymity requested)

## Security Considerations

### Input Validation

wiremd parses markdown input. While markdown is generally safe, be aware:

- **HTML in markdown**: By default, markdown parsers may allow raw HTML
- **XSS risks**: When rendering HTML output, ensure proper sanitization in your application
- **File operations**: The CLI tool reads files - ensure proper file path validation

### Best Practices for Users

1. **Sanitize output**: If displaying wiremd HTML output in a web context, use a sanitization library
2. **Validate input**: If accepting user input, validate and sanitize before parsing
3. **Keep updated**: Use the latest version to get security patches
4. **Review dependencies**: Regularly audit dependencies with `npm audit`

### Dependency Security

We regularly monitor our dependencies for vulnerabilities:

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

## Known Issues

Currently no known security issues. Check the [Security Advisories](https://github.com/akonan/wiremd/security/advisories) page for updates.

## Security Updates

Security updates will be announced:

- In the [CHANGELOG.md](CHANGELOG.md)
- As GitHub Security Advisories
- In release notes
- Via npm security advisories

## Contact

For security-related questions or concerns, please contact the project maintainer through GitHub.

---

Thank you for helping keep wiremd and its users safe!
