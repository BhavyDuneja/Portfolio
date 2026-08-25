# Research File 04 — Master Service Agreement (MSA)

**Document purpose:** A framework agreement between Sutranet and a corporate counterparty (client or vendor) under which one or more Statements of Work (SoWs) or Purchase Orders (POs) are executed. The MSA carries the framework legal terms; the SoWs carry the commercial specifics (scope, fees, timelines, deliverables, IP allocation per project).

---

## 1. Overview & purpose

An MSA is the workhorse contract for an Indian services company. Done well, it:

- streamlines onboarding of repeat business (one MSA, many SoWs);
- centralises legal terms (liability, IP, indemnity, DPDP, dispute resolution);
- creates a stable "frame" that survives changes in the project team;
- isolates project-specific commercial deals into low-stamp-duty SoWs.

For Sutranet, the MSA is signed in **two roles**:

- **As Service Provider** (Sutranet sells services to clients) — defensive drafting (caps on liability, broad disclaimers, IP retention).
- **As Customer** (Sutranet buys services from vendors) — offensive drafting (warranties, IP assignment, audit rights, DPDP flow-down).

Templates should exist for both — and drafters should be careful not to copy a "provider-favourable" MSA into a "customer-favourable" use case.

---

## 2. Governing law & statutory basis

| Statute | Relevance |
|---------|-----------|
| **Indian Contract Act, 1872** | s.10 (validity), s.23 (lawful object/consideration), s.27 (no non-compete), s.28 (jurisdiction validity), s.55 (time as essence), s.56 (frustration), s.62 (novation), s.73–74 (damages, LDs), s.124–125 (indemnity), s.126–141 (guarantee). |
| **Sale of Goods Act, 1930** | If MSA includes hardware/goods supply; ss.14–17 (implied conditions and warranties); s.62 (exclusion permitted by agreement). |
| **Specific Relief Act, 1963** | s.10 (specific performance default for commercial contracts post-2018), s.14, s.20A (special provisions for infrastructure projects), ss.36–42 (injunctions). |
| **Information Technology Act, 2000** | s.5 (electronic signatures), s.10A (validity of contracts formed electronically), s.43A (sensitive personal data — overlaps with DPDP), s.65B / BSA s.63 (electronic evidence), s.79 (intermediary safe harbour — relevant if Sutranet is a platform). |
| **DPDP Act, 2023** | s.8 (data fiduciary obligations), **s.8(5) (must engage processor only via contract)**, s.8(6) (breach notification), s.10 (Significant Data Fiduciary), s.11–14 (data principal rights), s.17 (cross-border transfers), s.25–29 (penalties up to ₹250 crore). |
| **Copyright Act, 1957** | s.13–19 for IP allocation; s.30 licences. |
| **Patents Act, 1970**, **TM Act 1999**, **Designs Act 2000** | IP allocation. |
| **Indian Stamp Act, 1899 + State Acts** | MSAs themselves are typically nominal stamp; SoWs may be ad-valorem if they fix specific consideration. |
| **Arbitration & Conciliation Act, 1996** | dispute resolution. |
| **Foreign Exchange Management Act, 1999** | If counterparty is foreign — invoice in foreign currency, FIRC, GST export refund eligibility, transfer pricing. |
| **Income-tax Act, 1961** | s.194C (TDS on contracts — 1%/2%), s.194J (TDS on professional/technical services — 10%), s.194Q (TDS on purchase of goods if turnover > ₹10 cr — 0.1%), s.195 (TDS on payments to non-residents); s.92 (transfer pricing). |
| **CGST Act, 2017 / IGST Act, 2017** | Place of supply, time of supply, GST rate (18% for most IT services), reverse charge mechanism, refunds for export of services. |
| **Companies Act, 2013** | s.184 (interest disclosure), s.188 (related-party), s.197 (managerial remuneration if applicable). |
| **Consumer Protection Act, 2019** | Generally B2B contracts are excluded, but if Sutranet provides services to a consumer through the MSA framework, applicable. |
| **Competition Act, 2002** | exclusivity / tie-in clauses must be checked against ss.3–4. |

### Case-law touchstones

- *BALCO v. Kaiser Aluminium*, (2012) 9 SCC 552 (Constitution Bench) — seat / venue distinction in arbitration.
- *Indus Mobile v. Datawind*, (2017) 7 SCC 678 — exclusive jurisdiction at seat.
- *PASL Wind Solutions v. GE Power Conversion India*, (2021) 7 SCC 1 — two Indian parties can choose foreign-seated arbitration.
- *Satyabrata Ghose v. Mugneeram Bangur*, AIR 1954 SC 44; *Energy Watchdog v. CERC*, (2017) 14 SCC 80 — frustration / force majeure.
- *Kailash Nath v. DDA*, (2015) 4 SCC 136 — s.74 Liquidated Damages.
- *ONGC v. Saw Pipes*, (2003) 5 SCC 705 — LDs and burden of proof.
- *In Re: Interplay between Arbitration Agreements and Indian Stamp Act* (2023, 7-judge bench Curative) — arbitration clauses survive non-stamping for Section 11 purposes; underlying contract still must be stamped to be marked in evidence.

---

## 3. Mandatory & recommended clauses

### 3.1 Mandatory framework

1. **Definitions** — "Affiliate", "Background IP", "Confidential Information", "Deliverables", "Effective Date", "Foreground IP", "Personal Data", "Services", "SoW", "Specifications", "Term".
2. **Structure** — MSA + SoWs; order of precedence (typically SoW > MSA > Schedules > Annexures, *except* for liability cap, indemnity, IP, confidentiality, DPDP — which are MSA-controlled).
3. **Term and renewal** — MSA term (commonly 2–3 years), automatic or affirmative renewal.
4. **Scope of services** — performed via SoWs; description, deliverables, timelines, acceptance criteria, change-control.
5. **Fees and payment** — per SoW; net 30 / 45 / 60; late-payment interest (typically SBI MCLR + 2% or 1.5% per month, capped); GST extra; TDS at applicable rates.
6. **Acceptance and warranty** — UAT, acceptance windows (typically 15 working days), warranty period (90–180 days for defects; longer for safety-critical).
7. **Personnel** — team composition, replacement procedure, background checks, **no employer–employee relationship between Sutranet personnel and the Customer**.
8. **Confidentiality** — full clause set (or supersede the standalone NDA).
9. **Intellectual property** — Background IP retained; Foreground IP — *default position*: Sutranet retains, customer gets perpetual, non-exclusive, worldwide licence to use Deliverables for its internal business purposes. **Exception**: bespoke development paid as work-for-hire — assignment to customer with present-tense language and s.19 Copyright Act parameters; carve-back of generic tools, libraries, methodologies.
10. **Data protection (DPDP Act 2023)** — full DPA-style sub-section or DPA Schedule (cross-reference file 07): roles, lawful basis, instructions, security, sub-processor approvals, breach notification (24 hours internal → 72 hours to DPB), data principal request handling, audit rights, return/destruction, cross-border transfer.
11. **Representations & warranties** — corporate authority; non-infringement; compliance with laws; no conflict.
12. **Indemnities** — IP infringement (defend, settle, pay damages; "remedies" — replace/modify/refund); breach of confidentiality; breach of DPDP/data protection. Carve-outs: customer-supplied materials, customer modifications, combination with non-Sutranet products, use beyond scope.
13. **Limitation of liability** — exclusion of indirect / consequential / loss of profits; cap on direct damages (commonly **fees paid in the 12 months preceding the claim**); **carve-outs from cap and exclusion**: (a) IP indemnity, (b) breach of confidentiality (sometimes super-cap rather than uncapped), (c) DPDP penalties / data-breach (often super-cap 2x–3x), (d) gross negligence / wilful misconduct, (e) fraud, (f) death/personal injury, (g) payment obligations.
14. **Insurance** — professional indemnity (₹1–5 crore typical for SME; ₹10 crore+ for enterprise customers); cyber liability (₹1–5 crore); workmen's comp; commercial general liability.
15. **Termination** — for convenience (60–90 days' notice, sometimes only after first 12 months); for cause (material breach + 30 days' cure); insolvency; change of control.
16. **Consequences of termination** — payment for work performed; transition assistance; return of confidential information; survival clauses.
17. **Force majeure** — enumerated events including pandemic, governmental lockdown, internet outage; notice obligation; suspension; right to terminate after 90 days.
18. **Dispute resolution** — escalation (project managers → senior management → mediation), then arbitration under Arbitration & Conciliation Act 1996, sole arbitrator, seat at Bengaluru (or as appropriate), language English. Carve-out for s.9 interim relief.
19. **Governing law and jurisdiction** — Indian law; courts at Bengaluru for s.9 / enforcement.
20. **Boilerplate** — notices, assignment (typically restricted; freely to Affiliates with notice), entire agreement, severability, no waiver, no third-party rights (unlike English law, India does not have a Contracts (Rights of Third Parties) Act — but a clause confirming no third-party beneficiaries is good practice), counterparts, electronic execution.
21. **Anti-bribery & anti-corruption (ABAC)** — Prevention of Corruption Act 1988, FCPA / UK Bribery Act compliance for cross-border.
22. **Sanctions / export controls** — applicable for foreign customers.
23. **Compliance with laws** generally.

### 3.2 Recommended

- **Service levels (SLAs)** with service credits — credit-only-no-damages remedy.
- **Audit rights** — financial audit (for time-and-material engagements), security audit (for hosting/SaaS), DPDP audit.
- **Subcontracting** — prior approval; flow-down obligations.
- **Right to inspect** background-checks, OFAC checks.
- **Publicity / case studies** — opt-in, with name/logo use approval.
- **Anti-poaching** (no-solicit) — 12 months mutual.
- **Most-favoured-customer** — only if commercially negotiated; resist as Provider.
- **Step-in rights** — for mission-critical engagements; rare.
- **Transfer-pricing language** — for related-party engagements with foreign affiliates.
- **Diversity / ESG / Modern-Slavery clauses** — increasingly demanded by global enterprise customers.

---

## 4. Drafting notes, pitfalls, enforceability tips

1. **Order of precedence is a frequent fight.** Customer wants SoW to override; Provider wants MSA-controlled liability/IP/indemnity to prevail. Compromise: SoW prevails over MSA *only on commercial terms* (scope, fees, timeline); MSA prevails on liability, IP, confidentiality, DPDP, dispute resolution.

2. **Caps on liability — s.74 ICA does not apply to caps**, only to penalties. A liability cap is enforceable in India (no equivalent of UCTA reasonableness test for B2B). However, *fraud, wilful misconduct, death/personal injury* cannot be excluded as a matter of public policy (s.23 ICA).

3. **Indirect / consequential damages exclusion.** Indian courts apply *Hadley v. Baxendale* through s.73 ICA (compensation for loss naturally arising and loss in contemplation). An exclusion of "indirect, consequential, special, punitive, exemplary damages and loss of profit, revenue, goodwill, anticipated savings" is enforceable. Be precise in the list — *Karsales v. Wallis* / fundamental-breach doctrine has been read down in India but a court may still try to read narrowly.

4. **IP infringement indemnity scope.** Standard formulation: defend + settle + pay damages + remedies (replace / modify / refund). India does not have a software-publisher safe harbour like the US — the indemnity is the customer's only meaningful remedy. Carve-outs are essential: customer modifications, combination, use outside scope, customer-supplied materials.

5. **Specific performance is the default, not damages.** Post-2018 Specific Relief amendment (s.10) makes specific performance the rule. Consider whether you want this — service contracts of a personal nature (s.14(c)) cannot be specifically enforced anyway, but IP-deliverables can be.

6. **Stamp duty on SoWs.** Be mindful — if the MSA is stamped at nominal "agreement not otherwise provided for" (₹100–500) but a SoW commits ₹50 lakh, some states will treat the SoW as a separate stampable instrument. Best practice: draft SoWs as "issued under and subject to the MSA dated…" so they are clearly ancillary; some Sutranet templates also include a recital that "all stamp duty payable on this SoW is included in the MSA stamp duty paid".

7. **Arbitration seat vs venue.** Specify *seat* — that determines curial law and supervisory court. Specify *venue* if you want hearings in a different city. *BALCO v. Kaiser* (2012) 9 SCC 552, and *Indus Mobile v. Datawind*, (2017) 7 SCC 678, confirm that the courts at the seat have exclusive supervisory jurisdiction.

8. **Number of arbitrators.** Sole arbitrator for disputes ≤ ₹5 crore; three-member for higher value. If three, name appointing authority (ICA / MCIA / DIAC / ICC).

9. **Section 9 carve-out is essential.** Even when arbitration is the chosen forum, courts retain power to grant interim relief under s.9 Arbitration Act before, during, or even after arbitration (subject to the proviso). Preserving this is critical for confidentiality and IP injunctions.

10. **Stamping unstamped contract — current law.** Per *In Re: Interplay between Arbitration Agreements and Indian Stamp Act*, December 2023 (7-judge bench Curative), an unstamped contract's arbitration clause is **enforceable** at the stage of s.11 appointment, but the underlying contract must be stamped before being received in evidence at the merits stage. Practical answer: stamp on day one.

11. **GST on services.** B2B services typically 18%. Place-of-supply rules (s.12 IGST Act) determine intra-state CGST+SGST or inter-state IGST. Export of services (subject to conditions including receipt in convertible foreign exchange) is zero-rated.

12. **TDS rates.** Customers will deduct TDS — Sutranet should include a clause requiring TDS certificate within the prescribed time and providing for gross-up only if explicitly negotiated.

13. **Anti-bribery for foreign customers.** US customers will demand FCPA flow-down; UK customers Bribery Act 2010; India's Prevention of Corruption Act 1988 (as amended 2018) makes both giving and receiving an offence and includes commercial bribery.

14. **DPDP cross-border transfer.** Under s.17 DPDP Act 2023, the central government may notify countries to which transfer is *restricted* (negative-list approach). Until notified, transfer is generally permitted but subject to standard contractual safeguards. Customers (especially from EU/UK/US) will want EU SCCs / Module-2 equivalents — Sutranet should be ready to sign.

15. **Insurance evidence.** Customers ask for COI (certificate of insurance); Sutranet should require its own vendors to provide COIs.

16. **No employer–employee relationship.** Particularly important for staff-augmentation engagements; courts have re-characterised some staffing contracts as deemed employment under PF and ESI laws. Drafter should add (a) Sutranet remains employer; (b) PF/ESI/gratuity Sutranet's responsibility; (c) customer has no power to discipline; (d) indemnity for any deemed-employment claim.

17. **Anti-poaching clause.** 12 months, mutual, limited to "active solicitation" — same s.27 ICA constraints as employee non-solicit.

18. **Change of control termination.** Demanded by enterprise customers; Sutranet as Provider should resist for ordinary M&A but accept for sale to a competitor of the customer.

19. **Audit rights.** Customer audit triggers data security and confidentiality concerns. Limit to: (a) once per 12 months, (b) on 30 days' notice, (c) during business hours, (d) by independent auditor under NDA, (e) at customer's cost unless material breach found, (f) excludes other customers' information.

20. **Indian-counterparty foreign-seated arbitration.** Permissible per *PASL Wind Solutions* (2021), but enforcement of award under Part II Arbitration Act. Be deliberate.

---

## 5. Suggested clause-by-clause structure

```
1.  Definitions and Interpretation
2.  Structure of Agreement (MSA + SoWs; precedence)
3.  Term and Renewal
4.  Statements of Work
    4.1 SoW form (Schedule)
    4.2 Change control
    4.3 Acceptance
5.  Fees and Payment
    5.1 Fees per SoW
    5.2 Invoicing
    5.3 Payment terms (Net 30/45)
    5.4 Late-payment interest
    5.5 GST
    5.6 TDS
    5.7 Disputed invoices
6.  Service Levels (Schedule)
7.  Personnel
    7.1 No employment relationship
    7.2 Background checks
    7.3 Replacement
    7.4 Anti-poaching
8.  Subcontracting
9.  Confidentiality
10. Intellectual Property
    10.1 Background IP retention
    10.2 Foreground IP — default Sutranet ownership + licence
    10.3 Bespoke / work-for-hire — assignment with s.19 parameters
    10.4 Open-source disclosure
    10.5 Residual knowledge
11. Personal Data Protection (cross-reference DPA Schedule / inline)
12. Representations and Warranties
13. Indemnities
    13.1 IP infringement
    13.2 Confidentiality breach
    13.3 DPDP / data-breach
    13.4 Procedure (notice, defence, settlement)
    13.5 Sole and exclusive remedy
14. Limitation of Liability
    14.1 Exclusion of indirect / consequential
    14.2 Cap on direct damages
    14.3 Carve-outs (IP indemnity, confidentiality super-cap,
         DPDP super-cap, fraud, wilful misconduct, payment obligations,
         death/personal injury)
15. Insurance
16. Compliance with Laws
    16.1 ABAC
    16.2 Sanctions / export
    16.3 Modern slavery / ESG (where applicable)
17. Force Majeure
18. Suspension and Termination
    18.1 Termination for convenience
    18.2 Termination for cause
    18.3 Insolvency
    18.4 Change of control
    18.5 Consequences and survival
    18.6 Transition assistance
19. Dispute Resolution
    19.1 Escalation
    19.2 Mediation (optional)
    19.3 Arbitration: A&C Act 1996, sole arbitrator, seat Bengaluru,
         language English
    19.4 s.9 court relief preserved
20. Governing Law and Jurisdiction
21. Boilerplate
    21.1 Notices
    21.2 Assignment
    21.3 No third-party rights
    21.4 Entire agreement
    21.5 Amendment
    21.6 Severability
    21.7 No waiver
    21.8 Counterparts and electronic execution
22. Signatures + 2 witnesses
Schedules:
  Schedule 1: Form of SoW
  Schedule 2: Service Levels
  Schedule 3: Data Processing Addendum (DPDP-aligned)
  Schedule 4: Insurance requirements
  Schedule 5: Approved Sub-processors
  Schedule 6: Security Standards (ISO 27001, SOC 2 references)
```

---

## 6. Market-standard values (India, 2024–2026)

| Parameter | Typical SME value | Typical Enterprise value |
|-----------|-------------------|--------------------------|
| Term | 2 years | 3 years + auto-renew |
| Termination for convenience | 60 days, after first 12 months | 30–90 days |
| Cure period (material breach) | 30 days | 30 days |
| Net payment terms | Net 30 | Net 45 / 60 |
| Late-payment interest | 1.5% per month | SBI MCLR + 2%, capped at 18% |
| Acceptance window | 10–15 business days | 15–30 days |
| Warranty period | 90 days | 180 days |
| Liability cap | Fees in last 12 months | 1× annual contract value, sometimes 2× |
| Confidentiality super-cap | 2× cap or uncapped | 2×–3× cap |
| DPDP super-cap | 2× cap | 2×–3× cap or aligned with statutory exposure |
| Indirect damages | Excluded | Excluded |
| IP indemnity | Uncapped | Uncapped (sometimes super-capped 3×) |
| Professional indemnity insurance | ₹1–2 crore | ₹5–10 crore |
| Cyber-liability insurance | ₹1 crore | ₹5 crore |
| Anti-poach period | 12 months | 12 months |
| Audit frequency | 1× per 12 months | 1× per 12 months + breach-triggered |
| Sub-processor approval | Notice + objection | Express prior consent |
| Arbitrator | Sole | Sole or 3 (above ₹5 crore) |
| Seat | Bengaluru / Mumbai / Delhi | Bengaluru / Mumbai / Delhi / SIAC for cross-border |
| Stamp duty (Karnataka) | ₹200–500 (MSA), per-state on SoW | per-state on SoW |

---

## 7. Stamp duty & execution requirements

- **MSA itself:** typically a framework with no fixed monetary obligation → stamped as "agreement not otherwise provided for" — Karnataka ₹200, Maharashtra ₹100–500, Delhi ₹50–100.
- **SoW:** if it fixes a quantified consideration, some states may treat it as a separate stampable contract under "agreement relating to" the specific subject matter. Practical workaround: stamp each SoW at nominal rate + recital that it is an "ancillary instrument" to the MSA. For high-value SoWs (₹50 lakh+), take advice on potential ad-valorem exposure.
- **Cross-state usage:** if MSA executed in Karnataka but used in Maharashtra, top-up to higher rate within 3 months under s.19 Indian Stamp Act.
- **Foreign execution:** if executed outside India, must be stamped within 3 months of receipt in India (s.18 ISA).

**Registration:** Not required for an MSA. Required only if an SoW conveys an interest in immovable property or is a lease > 11 months.

**Execution mechanics:**
- Two duly authorised signatories (board resolution or POA on file).
- Counterparts clause used; PDF circulation acceptable.
- Aadhaar e-Sign or DSC for electronic execution; preserve evidentiary trail (timestamp, IP, audit log) per s.65B Evidence Act / s.63 BSA 2023.
- For foreign-counterparty MSA: apostille or notarisation may be requested by the foreign party for use overseas; for use in India, e-stamp + e-Sign is sufficient.

---

## 8. Cross-references to other Sutranet documents

- **Client NDA (file 01):** typically supersedes upon MSA execution; insert express survival/transition clause.
- **DPA (file 07):** attach as Schedule 3 whenever scope touches personal data; flow down to sub-processors.
- **IPR Policy (file 03):** Background-IP and Foreground-IP definitions must align; bespoke-development carve-out wording must be consistent.
- **Consultant Agreement (file 06):** when Sutranet uses subcontractors to deliver SoWs, the Consultant Agreement must contain back-to-back obligations on confidentiality, IP, and DPDP.
- **Employee NDA (file 02) and Employment Agreement (file 05):** employees performing under SoWs are bound by the customer's confidentiality and DPDP standards through the Employee NDA — the Employee NDA's definition of Confidential Information must therefore include client-supplied data.

End of file 04.
