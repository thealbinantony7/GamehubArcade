# JURISDICTION READINESS CHECKLIST

**Status**: Phase 14 Compliance Infrastructure  
**Last Updated**: 2026-01-11  
**Purpose**: Document regulatory requirements for multi-jurisdiction expansion

---

## UK GAMBLING COMMISSION

### Player Protection Requirements
- [ ] **Self-Exclusion API**: Integrate with GAMSTOP (UK national self-exclusion scheme)
  - Current: Manual cooldown via `wallet.store.ts` → `setCooldown()`
  - Required: API integration with GAMSTOP database
  - Blocker: Requires licensed operator status

- [x] **Reality Checks**: Periodic session time notifications
  - Implementation: `wallet.store.ts` → `getSessionDuration()`
  - Status: Functional (client-side only)
  - Gap: No mandatory pop-up at 60-minute intervals

- [x] **Deposit Limits**: Session and daily loss limits
  - Implementation: `wallet.store.ts` → `sessionLossLimit`, `dailyLossLimit`
  - Status: Functional with same-day lowering restriction
  - Gap: No deposit limit (only loss limit)

- [ ] **Account History Export**: 90-day transaction history
  - Current: CSV export via `VerifyDrawer.tsx` → `exportAuditLog()`
  - Status: Functional but limited to 500 rows
  - Gap: No date range filtering

### Technical Requirements
- [ ] **Age Verification**: Integration with third-party verification service
  - Current: None
  - Required: Verify 18+ before account creation

- [ ] **Geolocation**: IP-based jurisdiction detection
  - Current: None
  - Required: Block access from restricted regions

- [ ] **RTP Disclosure**: Display Return to Player percentage
  - Current: Static 98.5% in `TrustStatusBar.tsx`
  - Status: Displayed but not game-specific

---

## MALTA GAMING AUTHORITY (MGA)

### Player Protection
- [x] **Loss Limits**: Session and daily limits
  - Implementation: `wallet.store.ts` → `sessionLossLimit`, `dailyLossLimit`
  - Status: Compliant

- [ ] **Cooling-Off Periods**: 24-hour to 6-week self-exclusion
  - Current: Manual cooldown (15m, 30m, 1h)
  - Gap: No 24h+ options

- [x] **Audit Trail**: Complete bet history
  - Implementation: `wallet.store.ts` → `betHistory` (500 rows)
  - Status: Compliant with CSV export

### Technical Requirements
- [ ] **RNG Certification**: Third-party RNG testing (eCOGRA, iTech Labs)
  - Current: Client-side `Math.random()` (not certifiable)
  - Required: Server-side provably fair RNG

- [ ] **Data Retention**: 5-year bet history storage
  - Current: localStorage (browser-dependent)
  - Gap: No server-side persistence

---

## CURAÇAO eGAMING

### KYC/AML Compliance
- [ ] **Know Your Customer (KYC)**: Identity verification
  - Current: None
  - Required: Government ID upload and verification

- [ ] **Anti-Money Laundering (AML)**: Transaction monitoring
  - Current: None
  - Required: Flag deposits >€2,000 or suspicious patterns

- [ ] **Source of Funds**: High-value player verification
  - Current: None
  - Required: Verify income source for deposits >€10,000

### Technical Requirements
- [ ] **Transaction Logging**: All deposits/withdrawals logged
  - Current: Bet history only
  - Gap: No deposit/withdrawal tracking

- [ ] **Suspicious Activity Reporting**: Automated flagging
  - Current: None
  - Required: ML-based anomaly detection

---

## GENERIC COMPLIANCE (GDPR, CCPA)

### Data Privacy
- [x] **Data Export**: User can export their data
  - Implementation: `VerifyDrawer.tsx` → `exportAuditLog()`
  - Status: Compliant (CSV export)

- [ ] **Right to Erasure**: User can delete their account
  - Current: None
  - Required: "Delete Account" button with confirmation

- [x] **Data Minimization**: Only collect necessary data
  - Current: Minimal data collection (balance, bet history)
  - Status: Compliant

- [ ] **Cookie Consent**: GDPR-compliant cookie banner
  - Current: None
  - Required: Cookie consent modal on first visit

### Transparency
- [x] **Terms of Service**: Clear T&C document
  - Current: None
  - Required: Legal review and user acceptance flow

- [x] **Privacy Policy**: Data handling disclosure
  - Current: None
  - Required: Document localStorage usage

---

## IMPLEMENTATION ROADMAP

### Phase 14 (Current)
- [x] Audit log export (CSV)
- [x] Compliance dashboard (`/compliance`)
- [x] Session history extension (500 rows)
- [x] Jurisdiction readiness checklist (this document)

### Phase 15 (Proposed)
- [ ] Reality check pop-ups (60-minute intervals)
- [ ] Extended cooldown options (24h, 7d, 30d)
- [ ] Date range filtering for audit export
- [ ] Account deletion flow

### Phase 16 (Proposed)
- [ ] Server-side bet history persistence
- [ ] RNG certification preparation
- [ ] Geolocation API integration
- [ ] Age verification service integration

### Phase 17+ (Future)
- [ ] GAMSTOP API integration (UK)
- [ ] KYC/AML provider integration (Jumio, Onfido)
- [ ] Multi-currency support
- [ ] Deposit/withdrawal tracking

---

## RISK ASSESSMENT

### High Risk (Blockers for Licensed Operation)
1. **No RNG Certification**: Cannot operate in regulated markets
2. **No KYC/AML**: Legal liability for money laundering
3. **No Age Verification**: Regulatory violation (fines, license revocation)

### Medium Risk (Operational Gaps)
1. **No Server-Side Persistence**: Data loss on browser clear
2. **No Geolocation**: Cannot enforce jurisdiction restrictions
3. **No Deposit Limits**: Only loss limits (not preventative)

### Low Risk (Nice-to-Have)
1. **No Reality Check Pop-ups**: Best practice but not always mandatory
2. **No Extended Cooldowns**: Current cooldowns functional but limited
3. **No Date Range Export**: CSV export functional but not filterable

---

## COMPLIANCE CONTACTS

### Regulatory Bodies
- **UK Gambling Commission**: [www.gamblingcommission.gov.uk](https://www.gamblingcommission.gov.uk)
- **Malta Gaming Authority**: [www.mga.org.mt](https://www.mga.org.mt)
- **Curaçao eGaming**: [www.curacao-egaming.com](https://www.curacao-egaming.com)

### Third-Party Services
- **RNG Testing**: eCOGRA, iTech Labs, GLI
- **KYC/AML**: Jumio, Onfido, Trulioo
- **Self-Exclusion**: GAMSTOP (UK), OASIS (Germany)
- **Payment Processing**: Stripe, PayPal (with gambling compliance)

---

## NOTES

- This checklist is for **planning purposes only** and does not constitute legal advice
- Regulatory requirements vary by jurisdiction and change frequently
- Consult with a gambling law specialist before launching in any regulated market
- Some features (e.g., KYC, RNG certification) require licensed operator status
- Current implementation is **demo-grade** and not suitable for real-money gambling

---

**Document Version**: 1.0  
**Next Review**: Phase 15 Planning
