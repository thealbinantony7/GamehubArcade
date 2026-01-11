# Observability Ownership & SLAs

## Performance Metrics

| Metric | Threshold | Owner | Alert Channel | Response SLA | Escalation |
|--------|-----------|-------|---------------|--------------|------------|
| CLS > 0.1 | CRITICAL | Frontend Lead | #perf-alerts | 2 hours | CTO |
| INP > 200ms | HIGH | Frontend Lead | #perf-alerts | 4 hours | CTO |
| LCP > 2500ms | MEDIUM | Frontend Lead | #perf-alerts | 1 business day | CTO |

## Accessibility

| Metric | Threshold | Owner | Alert Channel | Response SLA | Escalation |
|--------|-----------|-------|---------------|--------------|------------|
| axe violations | CRITICAL | Frontend Lead | #a11y-alerts | 1 business day | CTO |
| Lighthouse A11y < 95 | CRITICAL | Frontend Lead | #a11y-alerts | 1 business day | CTO |
| Focus trap detected | MEDIUM | QA Lead | #a11y-alerts | 1 business day | Frontend Lead |

## Application Errors

| Metric | Threshold | Owner | Alert Channel | Response SLA | Escalation |
|--------|-----------|-------|---------------|--------------|------------|
| ErrorBoundary triggered | HIGH | DevOps Lead | #errors | 1 hour | CTO |
| API errors > 5% | CRITICAL | Backend Lead | #api-alerts | 30 minutes | CTO |

## User Behavior

| Metric | Threshold | Owner | Alert Channel | Response SLA | Escalation |
|--------|-----------|-------|---------------|--------------|------------|
| Rage click detected | LOW | Product Manager | #analytics | 1 week | CPO |
| Search abandonment > 50% | MEDIUM | Product Manager | #analytics | 2 business days | CPO |

## Compliance Violations

| Metric | Threshold | Owner | Alert Channel | Response SLA | Escalation |
|--------|-----------|-------|---------------|--------------|------------|
| Confetti re-introduced | CRITICAL | Legal | #compliance | IMMEDIATE | CEO |
| Fake delays detected | CRITICAL | Legal | #compliance | IMMEDIATE | CEO |
| Emotional copy deployed | HIGH | Legal | #compliance | 4 hours | CEO |

## Monitoring Infrastructure

- **RUM Dashboard**: [Link to DataDog/New Relic]
- **Error Tracking**: [Link to Sentry]
- **Analytics**: [Link to internal BI dashboard]
- **CI Artifacts**: `artifacts/releases/`

## On-Call Rotation

- **Week 1**: Frontend Lead
- **Week 2**: DevOps Lead
- **Week 3**: Backend Lead
- **Week 4**: Frontend Lead

## Incident Response

1. Alert triggered → Slack notification
2. Owner investigates (within SLA)
3. If critical → page on-call
4. Fix deployed → evidence pack regenerated
5. Post-mortem if P0 incident
