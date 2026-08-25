# Sutranet Corporate Legal Documents — Research Overview

**Jurisdiction:** Republic of India
**Entity:** Sutranet (assumed Indian private limited company; if it is an LLP, sole proprietorship, or partnership firm, several execution and IP-vesting rules change — verify before drafting).
**Research date:** April 2026
**Audience:** Drafting agents producing first-draft legal templates for Sutranet's standard commercial use.

> **Caveat for all drafters:** None of this research is a substitute for sign-off by an Indian advocate. Stamp duty rates, registration thresholds, and labour-law applicability vary by state and by entity headcount. Where a number is given, treat it as a typical market figure that must be verified for the specific state of execution.

---

## 1. Document set

| # | Document | Primary parties | Research file |
|---|----------|-----------------|---------------|
| 1 | Client–Company NDA (mutual / one-way) | Sutranet ↔ Client | `01_client_nda_research.md` |
| 2 | Employee Confidentiality / NDA | Sutranet ↔ Employee | `02_employee_nda_research.md` |
| 3 | IPR Assignment & IP Policy | Sutranet ↔ Employees / Contractors | `03_ipr_research.md` |
| 4 | Master Service Agreement (MSA) | Sutranet ↔ Vendor or Client | `04_msa_research.md` |
| 5 | Employment Agreement | Sutranet ↔ Employee | `05_employment_agreement_research.md` |
| 6 | Consultant / Independent Contractor Agreement | Sutranet ↔ Consultant | `06_consultant_agreement_research.md` |
| 7 | Data Processing Agreement (DPDP Act 2023) | Sutranet (Fiduciary) ↔ Processor / Sub-processor | `07_dpdp_data_processing_research.md` |

I selected Employment Agreement, Consultant Agreement, and DPDP DPA as the three "additional" documents because:

- **Employment Agreement** is the legal anchor for the Employee NDA and the IP Assignment — those two documents typically reference the EA's term, notice, and termination clauses.
- **Consultant Agreement** is unavoidable for an Indian IT/services SME because misclassifying contractors triggers PF/ESI/gratuity exposure and breaks the IP chain (Section 17 Copyright Act vests copyright in the *author* unless validly assigned).
- **DPDP DPA** became mandatory the moment the Digital Personal Data Protection Act, 2023 rules were notified; any client touching personal data of Indian data principals will demand one.

A Founders' Agreement and a formal Vendor Agreement are also commonly needed but are deferred — Sutranet should commission those separately once cap-table and procurement workflows stabilise.

---

## 2. Cross-reference map

The drafters MUST keep the following cross-references consistent across documents. Inconsistent definitions and survival periods are the single most common drafting defect found in Indian SME template sets.

```
Employment Agreement (#5)
   ├── incorporates by reference → Employee NDA (#2)
   ├── incorporates by reference → IP Assignment & IP Policy (#3)
   └── carve-out for prior inventions → IP Policy Schedule

Employee NDA (#2)
   ├── definition of "Confidential Information" must MIRROR Client NDA (#1)
   │     so that client-supplied data flows through cleanly
   └── survival period must be ≥ Client NDA survival to avoid back-to-back gap

IP Assignment (#3)
   ├── triggered by Employment Agreement (#5) and Consultant Agreement (#6)
   ├── waiver of moral rights — only "false attribution / distortion" carve-out
   │     under s.57 Copyright Act 1957 cannot be fully waived
   └── feeds "Sutranet Background IP" warranty in MSA (#4) and Client NDA (#1)

MSA (#4)
   ├── Client NDA (#1) is typically subsumed once an MSA is signed —
   │     either supersede or treat as Schedule
   ├── DPA (#7) is annexed as a Schedule whenever the SoW touches personal data
   ├── Consultant Agreement (#6) flows down MSA obligations to subcontractors
   └── Background IP / Foreground IP definitions must align with #3

Consultant Agreement (#6)
   ├── must contain present-tense IP assignment ("hereby assigns") to overcome
   │     the Section 17(c) Copyright Act default that vests copyright in the author
   └── must contain TDS (s.194J/194C Income-tax Act) and GST (s.13 CGST Act) clauses

DPA (#7)
   ├── Schedule to MSA (#4) when Sutranet is the Processor for a client Fiduciary
   └── Standalone with vendors (e.g., SaaS, payroll, cloud) when Sutranet is the
       Fiduciary and the vendor is the Processor under s.8(5) DPDP Act 2023
```

---

## 3. Common definitions to standardise across the suite

To prevent drift, the drafters should use a single canonical definition of these terms. The "Master Definitions" sheet below is the recommended baseline; individual documents may narrow but must not contradict.

| Term | Canonical definition (recommended) |
|------|-----------------------------------|
| **Confidential Information** | All non-public technical, commercial, financial, customer, employee, source-code, algorithmic, and product information disclosed by or on behalf of the Disclosing Party in any form, whether or not marked "confidential", that a reasonable person would consider confidential in the circumstances. Includes derivatives and analyses. |
| **Personal Data** | Has the meaning given in s.2(t) of the Digital Personal Data Protection Act, 2023 — "any data about an individual who is identifiable by or in relation to such data." |
| **Data Fiduciary / Data Processor** | As defined in s.2(i) and s.2(k) DPDP Act 2023. |
| **Background IP** | IP owned or licensed by a Party prior to the Effective Date or developed independently of this Agreement. |
| **Foreground IP** | IP created in the course of, or as a result of, performance under this Agreement. |
| **Affiliate** | Any entity that controls, is controlled by, or is under common control with a Party, where "control" means beneficial ownership of ≥ 50% of voting equity. |
| **Working Day** | A day other than Saturday, Sunday, or a public holiday in Bengaluru, Karnataka (or whichever state Sutranet's registered office is in — confirm). |
| **INR** | Indian Rupees, the lawful currency of India. |
| **Effective Date** | The later of (a) the date of last signature, or (b) the date stamp duty is paid (where applicable). |

---

## 4. India-wide drafting principles every drafter must apply

1. **Section 27, Indian Contract Act, 1872** voids any agreement in restraint of trade. Post-employment non-compete clauses are **unenforceable** in India regardless of how narrowly drafted (*Niranjan Shankar Golikari v. Century Spinning & Mfg. Co. Ltd*, AIR 1967 SC 1098, allows restraints only *during* employment; *Superintendence Co. of India v. Krishan Murgai*, AIR 1980 SC 1717, confirms unenforceability post-termination; *Percept D'Mark (India) v. Zaheer Khan*, (2006) 4 SCC 227, struck down right-of-first-refusal as restraint). Non-solicit and confidentiality, however, are enforceable if reasonable (*Gujarat Bottling v. Coca Cola*, (1995) 5 SCC 545).

2. **Stamp duty is a state subject** under Entry 44, List III, Seventh Schedule of the Constitution. Duty payable depends on (i) the state where the document is *executed* and (ii) where it will be *brought into use*. Under-stamped documents are **inadmissible in evidence** under s.35 Indian Stamp Act 1899 until stamped + penalty paid (up to 10× deficient duty).

3. **Specific Relief Act, 1963** (as amended in 2018) makes specific performance the *rule* rather than the exception for commercial contracts (s.10) — a powerful remedy for IP and confidentiality breaches when coupled with s.14 (injunctive relief).

4. **Arbitration & Conciliation Act, 1996** (post-2015 and 2019 amendments): Indian-seated arbitration with a sole arbitrator under the Arbitration & Conciliation Act is the market default for B2B contracts under ₹10 crore. SIAC is preferred for cross-border. Always specify **seat** (which determines curial law) separately from **venue**.

5. **Information Technology Act, 2000** — s.65B Indian Evidence Act 1872 (now Bharatiya Sakshya Adhiniyam, 2023, s.63) governs admissibility of electronic records; s.5 IT Act recognises digital signatures; s.43A (overlapping with DPDP) imposes liability for negligent handling of "sensitive personal data"; s.72A criminalises disclosure in breach of contract. Drafters should require electronic execution be done via **Aadhaar e-sign** or DSC for evidentiary strength.

6. **DPDP Act 2023** rules notified in early 2025 phase. Every document touching personal data must include: lawful basis, purpose limitation, retention period, data principal rights, breach notification (72-hour to Data Protection Board), and processor obligations under s.8(5).

7. **Companies Act, 2013** affects: (a) execution under common seal — most companies have dispensed with seals via Articles; (b) related-party transaction approvals (s.188) for contracts with directors/relatives; (c) board resolution/POA for execution, which counterparties will request.

8. **Indian Stamp Act 1899 + state-specific Stamp Acts** (Maharashtra Stamp Act 1958, Karnataka Stamp Act 1957, Delhi follows ISA with state schedule). Sutranet should normally execute in **Karnataka** if Bengaluru-based; e-stamp via SHCIL is the standard mechanism.

9. **Jurisdiction clauses**: Indian courts will respect an exclusive jurisdiction clause only if at least one of the courts named has jurisdiction under s.20 CPC (where defendant resides or cause of action arose) — see *A.B.C. Laminart v. A.P. Agencies*, (1989) 2 SCC 163, and *Swastik Gases v. Indian Oil*, (2013) 9 SCC 32 (the words "only", "alone", "exclusive" are not strictly required but help).

10. **Force majeure** is contractual in India; the *Energy Watchdog v. CERC*, (2017) 14 SCC 80 line of cases confirms that mere economic hardship (and broadly, COVID lockdowns) does not automatically trigger FM unless the clause is drafted to cover it. Drafters must enumerate triggering events and the COVID-style "pandemic / epidemic / governmental lockdown" trigger.

---

## 5. Execution checklist (applies to all documents)

- [ ] Stamp duty paid in the state of execution (e-stamp via SHCIL or franking).
- [ ] If the agreement creates an interest in immovable property OR is a lease > 11 months OR is an IP assignment of patents/designs/trade marks → registration under Registration Act 1908.
- [ ] Board resolution authorising signatory (kept in minute book; copy to counterparty if requested).
- [ ] Two witnesses to signature where document creates obligations beyond NDAs (best practice; mandatory for assignments under s.18 Trade Marks Act 1999 and s.19 Copyright Act 1957).
- [ ] PAN of both parties on record (TDS / GST compliance trail).
- [ ] If a foreign party is involved: FEMA route (LRS, ODI, FDI) checked; Section 195 Income-tax TDS clause inserted; tax residency certificate request inserted.
- [ ] Retain executed counterparts with the Company Secretary; lodge an electronic copy with HR / Legal repository.

---

## 6. Recommended reading for drafters before starting

- Indian Contract Act, 1872 — esp. ss.10, 23, 27, 28, 73, 74.
- Specific Relief Act, 1963 — esp. ss.10, 14, 36-42 (injunctions).
- Information Technology Act, 2000 — ss.5, 43A, 65B, 72, 72A.
- Digital Personal Data Protection Act, 2023 — ss.2, 4-11, 16-19, 25-29, 33.
- Copyright Act, 1957 — ss.17, 18, 19, 19A, 30, 57.
- Patents Act, 1970 — ss.3, 6, 28, 68, 69.
- Trade Marks Act, 1999 — ss.37-45.
- Designs Act, 2000 — s.30.
- Companies Act, 2013 — ss.21, 22, 188, 189; Schedule IV (board approvals).
- Indian Stamp Act, 1899 + applicable State Schedule.
- Arbitration & Conciliation Act, 1996 — ss.7, 11, 16, 20, 28, 34.

The drafters should follow the document-specific files for clause-by-clause guidance. End of overview.
