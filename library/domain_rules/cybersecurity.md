---
name: cybersecurity
description: Domain rules for cybersecurity analysis, including vulnerability scanning, secure dependency management, and secrets detection.
labels: [qa, testing]
danger_level: low
danger_details: These are informational rules directing agents on how to identify vulnerabilities.
---

# Domain Rule: Cybersecurity

## Core Directives
1. Always prioritize identifying OWASP Top 10 vulnerabilities (e.g., Injection, Broken Authentication, Sensitive Data Exposure).
2. Ensure no hardcoded secrets, API keys, or credentials exist in the codebase.
3. Verify that dependencies are up to date and free from known CVEs.
4. If remediation steps are provided, they must be actionable and follow standard secure coding practices.
5. Emphasize principle of least privilege and zero trust where applicable.
