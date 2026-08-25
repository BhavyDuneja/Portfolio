# Research File 02 — Employee Confidentiality / NDA Agreement

**Document purpose:** Confidentiality and non-use undertaking signed by every Sutranet employee (and, by reference, by interns and trainees) at the time of joining. Often executed as a standalone deed *and* incorporated by reference into the Employment Agreement.

---

## 1. Overview & purpose

The Employee NDA is the single most enforceable protection an Indian employer has, because:

- the *employer–employee* relationship gives rise to an **implied duty of fidelity and confidentiality** during employment (recognised in *V.F.S. Global Services v. Suprit Roy*, (2008) Bombay HC; *Niranjan Shankar Golikari* line);
- but **post-employment**, only confidentiality and non-solicit obligations survive — non-compete is void under s.27 Indian Contract Act;
- a written NDA captures the implied duty in enforceable, evidence-friendly form, defines what is "confidential", and extends the duty for a reasonable post-employment survival window.

Sutranet should make Employee NDA execution a **gating condition** of joining (offer-letter conditional on NDA + IP Assignment + Employment Agreement signing on Day 1).

---

## 2. Governing law & statutory basis

| Statute / Provision | Relevance |
|---------------------|-----------|
| **Indian Contract Act, 1872** | s.10 (validity), s.23 (lawful object), **s.27 (restraint of trade — voids post-employment non-compete)**, s.28 (forum), s.73 (compensation), s.74 (LDs). |
| **Specific Relief Act, 1963** | ss.10, 14, 36–42; *quia timet* and perpetual injunctions are routinely granted to restrain misuse of confidential information by ex-employees (*Diljeet Titus v. Alfred A. Adebare*, 130 (2006) DLT 330 — Delhi HC restrained departed lawyers from using firm files; *Burlington Home Shopping v. Rajnish Chibber*, 61 (1995) DLT 6). |
| **Information Technology Act, 2000** | s.43 (unauthorised access/data theft), **s.43A** (negligent handling of sensitive personal data — applies to employer; employee can be the proximate breach point), s.65 (source-code tampering), **s.72A** (disclosure in breach of lawful contract — directly applicable to ex-employees who leak). |
| **Indian Penal Code, 1860 / Bharatiya Nyaya Sanhita, 2023** | Theft of property (s.378 IPC / s.303 BNS) extends to digital files in some High Court rulings; criminal breach of trust (s.405 IPC / s.316 BNS) commonly invoked when an ex-employee misuses customer lists. |
| **Copyright Act, 1957** | s.13 (works), **s.17(c) (work made in the course of employment vests in employer subject to contrary agreement)** — critical for IP chain; s.51 (infringement); s.63 (criminal). |
| **Industrial Disputes Act, 1947** | If the employee is a "workman" (s.2(s)), termination procedure differs and any liquidated-damages clause must be tested for reasonableness against industrial-disputes principles. Most knowledge-work employees at Sutranet will not be workmen, but junior staff might be. |
| **Shops & Establishments Act (state-specific)** | Every Indian state has its own — Karnataka Shops & Commercial Establishments Act 1961, Maharashtra Shops & Establishments (Regulation of Employment & Conditions of Service) Act 2017, Delhi Shops & Establishments Act 1954. Governs working hours, leave, termination notice (typically 1 month). NDA terms cannot override statutory minima. |
| **Code on Wages, 2019 / Industrial Relations Code, 2020 / Code on Social Security, 2020 / OSH Code, 2020** | Four labour codes — partly notified, full implementation pending state rules. Drafter should future-proof by referring generically to "applicable labour laws". |
| **DPDP Act, 2023** | Employee handling of personal data triggers data-fiduciary obligations; Employee NDA must contemplate. |
| **Indian Stamp Act, 1899** | Employee NDA usually executed as part of joining package; stamp at "agreement not otherwise provided for" rate (~₹100–₹200), or, if drafted as a deed, slightly higher. |

---

## 3. Mandatory & recommended clauses

### 3.1 Mandatory

1. **Definition of Employee, Effective Date, joining date.**
2. **Definition of Confidential Information** — broad: technical (source code, architecture, algorithms, API designs, cloud configs), commercial (client lists, pricing, RFP responses, margins), financial (forecasts, payroll), HR (compensation, performance), client-supplied data, and Personal Data as defined under DPDP Act 2023.
3. **Acknowledgement that information is the property of the Company / its clients.**
4. **Permitted use** — solely for performance of duties, no copying outside Company systems, no personal cloud (Gmail, personal Dropbox, personal GitHub).
5. **Standard of care** — same as own information; in any case reasonable care; immediate reporting of suspected breach.
6. **Restrictions during employment**:
   - No external work without written consent (moonlighting clause — see drafting note 4 below).
   - No use of confidential information for personal benefit.
   - Compliance with Company's IT/Acceptable-Use Policy.
7. **Restrictions post-employment**:
   - **Confidentiality survives** (3 years for general; perpetual for trade secrets/source code).
   - **Non-solicit of clients/customers** for 12 months — limited to clients the employee personally dealt with in the 12 months preceding exit.
   - **Non-solicit of employees** for 12 months — drafter should restrict to "actively solicit" not "hire".
   - **NO non-compete** (drop entirely or limit to *during* employment only).
8. **Return of property** — devices, documents, badges, passwords; "no-shadow-copy" certificate at exit.
9. **IP Assignment incorporation** — refer to the standalone IP Assignment (file 03) and confirm s.17(c) Copyright Act vesting + present-tense assignment of patents and other IP.
10. **Survival** clause and severability (so that if a court strikes down one restraint, the rest stand).
11. **Remedies** — acknowledgement of irreparable harm; injunctive relief preserved; right to set off any liquidated damages against final settlement.
12. **Governing law and jurisdiction.** Employer's state (Karnataka, if Bengaluru).

### 3.2 Recommended

13. **Notice period for resignation** — usually 1–3 months for managerial/IT, 30 days for junior; reference Employment Agreement, do not duplicate.
14. **Garden leave clause** — Sutranet may, at its option, place the employee on garden leave during the notice period (paid, no work). Garden leave during notice is enforceable (it is a *during-employment* restraint, not post-employment).
15. **Whistleblower carve-out** — employee may report unlawful activity to regulators / Whistleblower Committee; consistent with s.23 ICA and SEBI LODR practice for listed counterparties.
16. **Sexual Harassment carve-out** — POSH Act 2013 protects complainant; NDA cannot gag a POSH complainant — explicitly say so.
17. **Use of personal devices (BYOD)** — only if policy permits; mandatory MDM enrolment.
18. **Background-check consent** — DPDP-compliant consent for verification.
19. **Personal Data of Employee** — Sutranet's own handling of employee data must comply with DPDP; include a notice/consent clause.
20. **Liquidated damages for breach** — modest (~3–6 months' CTC) to remain enforceable under s.74; *bond* clauses for training are enforceable only to the extent of actual cost (*Sicpa India v. Manas Pratim Deb*, (2011) Delhi HC; *Satyam v. Madhavi*, AP HC, 2010 — bond reduced to actual training cost).

---

## 4. Drafting notes, pitfalls, enforceability tips (India-specific)

1. **Section 27 ICA is absolute as to post-employment non-compete.** Do not hide non-compete language inside "non-solicit" or "non-dealing" clauses — Indian courts pierce the label. *Pepsi Foods Ltd. v. Bharat Coca-Cola Holdings*, 81 (1999) DLT 122 (Delhi HC); *Wipro v. Beckman Coulter*, 131 (2006) DLT 681 (Delhi HC) — even a 12-month non-deal with the employer's customers was struck as restraint of trade. The safe formulation is **non-solicit** (cannot actively *solicit* identified customers / employees) without a non-deal element.

2. **Non-solicit is enforceable if reasonable** — *Desiccant Rotors v. Bappaditya Sarkar*, 2009 (110) DRJ 691 (Delhi HC) upheld 12-month non-solicit; *FL Smidth Pvt Ltd v. M/s Secan Invescast (India)*, 2013 (1) CTC 886 (Madras HC) confirmed the same principle. Keep duration ≤ 12 months and limit to clients the employee personally serviced.

3. **Garden-leave is enforceable** during the contractual notice period because it is a restraint *during* employment (subject to *VFS Global v. Suprit Roy*, 2008 Bom HC, which struck down a 3-month garden leave that effectively operated as a post-termination non-compete because the employee had already resigned and salary was paid in lieu — read carefully). Drafter should draft garden leave as an *option exercisable by employer during the notice period* with full salary continuation.

4. **Moonlighting.** Indian law has no statutory prohibition. Industry-standard contracts may prohibit external commercial activity that conflicts with the employee's duties or uses Company resources. The clause must be reasonable; a blanket "no other engagement of any kind" is over-broad.

5. **Liquidated damages and "service bonds"** — enforceable only to the extent of actual quantifiable loss (training cost, recruitment cost). *Toshnial Brothers v. ESI Sundaram*, AIR 1996 SC 2491; *Sicpa India v. Manas Pratim Deb*, 2011 Delhi HC. Avoid figures like "₹10 lakh on early exit" without backing — courts will reduce to actual cost.

6. **POSH Act 2013 trumps NDA.** A complainant in a Sexual Harassment Internal Committee proceeding can disclose information notwithstanding the NDA; the NDA itself can include a confidentiality clause but cannot bar the complaint or witnesses from participating.

7. **Whistleblower / SEBI LODR / FCRA carve-outs.** Public-policy disclosures cannot be gagged (s.23 ICA — unlawful object). Include an express carve-out.

8. **DPDP Act 2023 personal-data flow.** Employees often handle personal data of clients' end-users. The Employee NDA must oblige the employee to act consistently with Sutranet's role as Data Fiduciary or Processor, including (a) lawful purpose, (b) no exfiltration to personal devices, (c) breach reporting within 24 hours internally so Sutranet can meet 72-hour reporting to DPB.

9. **Stamp duty and unstamped instruments.** Employee NDAs are routinely under-stamped. The cost of stamping ~₹200 is trivial; the cost of *not* being able to use the document in evidence is severe. Always stamp.

10. **Witnesses and execution.** Two witnesses recommended. If executed electronically, use Aadhaar e-Sign — DocuSign / SignDesk / Leegality wrappers around Aadhaar e-Sign are acceptable.

11. **Bond / training-cost recovery.** Permitted to recover *actual* documented training cost on early exit, pro-rated by service length. Keep formula transparent and capped at the documented amount.

12. **Industrial Disputes Act applicability.** If the employee is or becomes a "workman" (predominantly manual / clerical / skilled / unskilled work), termination requires specific procedure. The NDA cannot waive these. Best practice: include a saving clause "subject to applicable labour legislation".

13. **Enforcement venue choice.** Where Sutranet is in Bengaluru, courts at Bengaluru should be the chosen jurisdiction (s.20 CPC — registered office of employer). Avoid choosing a state where neither party resides; the clause will fail.

14. **Survival of access credentials.** Often forgotten: explicitly oblige the employee to disclose all account passwords, SaaS logins, GitHub repos, AWS IAM users, third-party-tool credentials at exit.

---

## 5. Suggested clause-by-clause structure

```
1.  Parties (Company; Employee — full name, address, designation)
2.  Recitals
3.  Definitions
    "Confidential Information"
    "Company Group" (includes Affiliates)
    "Personal Data" (DPDP)
    "Restricted Period" — 12 months post-termination
    "Trade Secrets"
4.  Acknowledgement of Confidentiality
5.  Obligations During Employment
    5.1 Use only for Company business
    5.2 Standard of care
    5.3 Compliance with IT / acceptable-use / data-protection policies
    5.4 No moonlighting that conflicts (carefully drafted)
    5.5 Disclosure of conflicts of interest
6.  Obligations Post-Termination
    6.1 Continuing confidentiality
    6.2 Return of property + certificate
    6.3 Non-solicit of customers (12 months, personally-dealt-with)
    6.4 Non-solicit of personnel (12 months, no active recruitment)
    6.5 (Drop or limit to during employment) Non-compete
7.  Personal Data Handling (DPDP-aligned)
8.  Sexual-Harassment / Whistleblower / Public-Policy Carve-Outs
9.  IP Assignment (cross-reference to standalone Assignment Deed)
10. Garden Leave (option exercisable by Company during notice)
11. Remedies
    11.1 Acknowledgement of irreparable harm
    11.2 Injunction without bond (to extent permitted)
    11.3 Liquidated damages (modest, justified)
    11.4 Set-off against final settlement
12. Term and Survival
13. Governing Law: India
14. Jurisdiction: Courts at Bengaluru (or Sutranet's HQ city)
15. Boilerplate
    15.1 Severability
    15.2 No waiver
    15.3 Entire agreement (subject to Employment Agreement)
    15.4 Amendment in writing
    15.5 Notices
    15.6 Counterparts and electronic execution
16. Signatures + 2 witnesses
Annexure A: List of pre-existing IP / inventions of Employee (carve-out)
Annexure B: List of SaaS logins / repos at termination (filled at exit)
```

---

## 6. Market-standard values

| Parameter | Typical value | Notes |
|-----------|---------------|-------|
| Confidentiality survival | 3 years general; perpetual for trade secrets / source code | |
| Non-solicit (clients) | 12 months | Must be personally-dealt-with |
| Non-solicit (employees) | 12 months | "Active solicitation" only |
| Non-compete | NOT included (void) | Or "during employment" only |
| Garden leave option | During notice period | Salary continues |
| Notice period (resignation) | 60–90 days for IT/managerial; 30 days for junior | Subject to S&E Act minima |
| Liquidated damages | 1–3 months' gross salary | Must be a pre-estimate; courts may reduce |
| Training-bond | Actual documented cost, pro-rated | Not lump-sum penalty |
| Stamp duty | ₹100–200 | State-dependent |
| Jurisdiction | Sutranet's HQ city | Karnataka / Maharashtra / Delhi |
| Governing law | Indian law | |
| Execution | Wet-ink + 2 witnesses, OR Aadhaar e-Sign | |

---

## 7. Stamp duty & execution requirements

- **Karnataka:** ~₹200 under Article 5(j), Karnataka Stamp Act schedule. Use SHCIL e-stamp paper.
- **Maharashtra:** ~₹100 (Article 5(h) MSA 1958).
- **Delhi:** ~₹50–100 (Indian Stamp Act, Delhi schedule).
- **Tamil Nadu:** ~₹100.
- Where executed as a **Deed of Confidentiality and Non-Solicit**, some states stamp deeds slightly higher (Maharashtra Article 6 — confirm).

**Registration:** Not required.

**Execution best practice:** Wet-ink with two witnesses on the joining date; counterpart for HR file; original in Company Secretary's safe; scanned PDF in HRMS. If electronic, Aadhaar e-Sign with audit trail. Ensure the Employee signs both (a) the Employment Agreement, (b) the Employee NDA, and (c) the IP Assignment Deed simultaneously — failure to execute any one of the three creates a chain-of-title gap.

---

## 8. Cross-references to other Sutranet documents

- **Employment Agreement (file 05):** the master agreement; this NDA is incorporated by reference. The Employment Agreement should expressly state that (i) NDA execution is a condition precedent; (ii) the NDA survives termination; (iii) breach of NDA is grounds for summary termination.
- **IPR Assignment & Policy (file 03):** typically a separate deed signed alongside the NDA. Some firms collapse Employee NDA + IP Assignment into a single instrument; Sutranet should keep them separate so client-facing audits can be served just the IP Assignment.
- **Client NDA (file 01):** definition of Confidential Information must be at least as broad here so that client-confidential information passes through cleanly.
- **DPDP DPA (file 07):** employees handling client personal data must understand Sutranet's processor obligations; the Employee NDA cross-references the company's DPDP policy.
- **Consultant Agreement (file 06):** same principles, but applied to non-employees with a *present-tense IP assignment* because s.17(c) Copyright Act vesting does not operate for independent contractors.

End of file 02.
