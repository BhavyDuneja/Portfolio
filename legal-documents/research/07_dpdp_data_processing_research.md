# Research File 07 — Data Processing Agreement (DPDP Act 2023)

**Document purpose:** A standalone or schedule-form agreement governing the processing of personal data of identifiable individuals (Data Principals) where one party (Sutranet or its counterparty) is the **Data Fiduciary** and the other is the **Data Processor**. Required by **s.8(5) DPDP Act 2023** whenever a fiduciary engages a processor.

---

## 1. Overview & purpose

The Digital Personal Data Protection Act, 2023 ("DPDP Act") was passed by Parliament in August 2023 and the operational rules ("DPDP Rules 2025") followed in early 2025 in phased notification. It replaces the earlier informal regime under **s.43A IT Act 2000 + the Sensitive Personal Data Rules 2011**.

Three parties are recognised:

- **Data Principal** — the natural person to whom the personal data relates (s.2(j)).
- **Data Fiduciary** — any person who, alone or in conjunction with others, determines the purpose and means of processing (s.2(i)).
- **Data Processor** — any person who processes personal data on behalf of a Data Fiduciary (s.2(k)).

A **Data Processing Agreement (DPA)** is the contractual instrument by which a Data Fiduciary discharges its statutory obligation under **s.8(5)** that "a Data Fiduciary may engage, appoint, use or otherwise involve a Data Processor to process personal data on its behalf for any activity related to offering of goods or services to Data Principals only under a valid contract." Without a written DPA, the fiduciary is in default.

Sutranet will need three flavours of DPA:

1. **Sutranet as Processor → Customer as Fiduciary** — when Sutranet processes a client's data (e.g., builds a SaaS that handles client's customer data). Typically a Schedule to the MSA / SoW.
2. **Sutranet as Fiduciary → Vendor as Processor** — when Sutranet uses third-party services that process its data (payroll, cloud hosting, analytics, CRM, marketing platforms).
3. **Sub-processor DPA** — when Sutranet (as Processor) onboards its own sub-processors.

Penalties under DPDP are material: up to **₹250 crore per breach**, levied by the **Data Protection Board of India (DPB)** under s.33.

---

## 2. Governing law & statutory basis

| Statute / Instrument | Relevance |
|----------------------|-----------|
| **Digital Personal Data Protection Act, 2023** | Primary statute. Key sections: **s.2 (definitions)**; **s.4 (lawful processing on consent or for legitimate use)**; **s.5 (notice)**; **s.6 (consent)**; **s.7 (legitimate uses without consent — including employment)**; **s.8 (general obligations of Data Fiduciary, including (4) security safeguards, (5) processor-via-contract requirement, (6) breach notification, (7) erasure on purpose-completion or consent-withdrawal)**; **s.9 (children's data)**; **s.10 (Significant Data Fiduciary — additional obligations: DPO, DPIA, audit)**; **s.11–14 (rights of Data Principals — access, correction, erasure, grievance, nominate)**; **s.15 (duties of Data Principals)**; **s.16 (processing outside India)**; **s.17 (cross-border transfer — central government may notify restricted countries)**; **s.18–28 (Data Protection Board — establishment, powers, procedure)**; **s.29 (appeal to TDSAT)**; **s.33 (penalties — Schedule)**. |
| **DPDP Rules, 2025** | Operational specifics: form of consent, breach reporting timelines and form, registration of consent managers, manner of cross-border transfer, procedures for SDFs. (Rules notified in phases; verify the latest text at execution.) |
| **Information Technology Act, 2000** | s.43A and the SPDI Rules 2011 — overlap with DPDP; SPDI Rules continue to apply in respect of bodies corporate and "sensitive personal data" until DPDP fully operational and superseded. **s.72A** — criminal penalty for disclosure in breach of contract. **s.66E** — voyeurism (privacy). |
| **Indian Telegraph Act, 1885; Telegraph Rules** | For interception. |
| **Aadhaar (Targeted Delivery of Financial and Other Subsidies) Act, 2016** | If Aadhaar-based authentication used; UIDAI regulations and *Puttaswamy II* (Constitution Bench, 2018) restrictions. |
| **Indian Contract Act, 1872** | s.10, 23, 73, 74. |
| **Specific Relief Act, 1963** | Injunctive relief for breach. |
| **Indian Evidence Act / BSA 2023** | s.65B / s.63 — admissibility of audit logs. |
| **Indian Stamp Act, 1899 + state schedules** | Nominal duty as agreement; if executed as a Schedule to the MSA, often subsumed. |
| **Sectoral regulators** | RBI (Account Aggregator framework, payment data localisation); SEBI (cyber-security circulars for market intermediaries); TRAI (UCC, do-not-disturb); IRDAI (insurance data); PFRDA; and now, MeitY for general DPDP. |
| **Constitutional foundation** | **Justice K.S. Puttaswamy v. Union of India, (2017) 10 SCC 1** — privacy is a fundamental right under Article 21. |

### Case-law touchstones

- *Justice K.S. Puttaswamy (Privacy) v. UoI*, (2017) 10 SCC 1 — privacy as fundamental right; foundation for DPDP.
- *Justice K.S. Puttaswamy (Aadhaar) v. UoI*, (2019) 1 SCC 1 — proportionality test; restrictions on Aadhaar use.
- *Anuradha Bhasin v. Union of India*, (2020) 3 SCC 637 — internet shutdowns; proportionality.
- *Internet Freedom Foundation v. UoI* — pending challenges to DPDP-precursor regimes.
- The DPDP Act's enforcement record is still developing as of April 2026; drafters should monitor DPB orders.

---

## 3. Mandatory & recommended clauses

### 3.1 Mandatory under s.8 DPDP Act and contractual best practice

1. **Definitions** aligned with s.2 DPDP Act — Data Principal, Personal Data, Sensitive Personal Data (legacy term; under DPDP the distinction is largely flattened, but some sectoral regulators retain it), Processing, Data Fiduciary, Data Processor, Sub-processor, Consent Manager (s.6(7)), Significant Data Fiduciary (s.10), Personal Data Breach.

2. **Roles** — clear identification of which party is Fiduciary and which is Processor. Recital that the fiduciary determines purpose and means; processor processes only on documented instructions.

3. **Subject-matter and duration** of processing.

4. **Nature and purpose** of processing (mirror the SoW / commercial agreement).

5. **Categories of data principals and personal data** processed (Schedule).

6. **Lawful basis** under s.4 — consent (s.6) or legitimate use (s.7); fiduciary represents and warrants lawful basis.

7. **Processor obligations** (mandatory):
   - Process only on documented instructions of the fiduciary.
   - Ensure persons authorised to process are subject to confidentiality obligations.
   - Implement appropriate technical and organisational measures (s.8(4) DPDP Act + DPDP Rules security standards).
   - Engage sub-processors only with prior written authorisation (general or specific) and subject to back-to-back terms.
   - Assist the fiduciary in fulfilling data principal rights (s.11–14).
   - Assist with security, breach notification, DPIA (where applicable), regulatory consultation.
   - Notify breaches to fiduciary without undue delay (typically 24 hours; aligns with fiduciary's 72-hour DPB notification under s.8(6)).
   - On termination, return or delete all personal data and copies (subject to legal retention).
   - Make available information to demonstrate compliance and allow audits / inspections.

8. **Sub-processors** — list of approved sub-processors (Schedule); change-notification mechanism with right to object; back-to-back DPA flow-down; processor remains primarily liable.

9. **Cross-border transfer** — s.16 (extra-territorial application) and s.17 (negative-list approach where central govt notifies restricted countries). Specify: where data is stored, where processed, route of transfer, safeguards (encryption in transit/at rest, contractual clauses equivalent to EU SCCs where the counterparty is foreign), compliance with sectoral data-localisation (RBI 2018 circular for payment data; sector-specific localisation as it evolves).

10. **Data principal rights handling** — fiduciary leads response; processor assists within agreed timelines (typically 5–7 business days).

11. **Breach notification** — processor → fiduciary within 24 hours of becoming aware; minimum information set; root-cause analysis within agreed window; cooperation with DPB notification by fiduciary within 72 hours (per draft DPDP Rules 2025; final timeframe may differ — verify).

12. **Security measures** — annexure listing technical and organisational measures: ISO 27001 alignment, encryption (AES-256 at rest, TLS 1.2+ in transit), access controls (RBAC, MFA), logging and audit trails, vulnerability management, secure SDLC, employee training, vendor risk management.

13. **Audits** — once per 12 months by fiduciary or independent auditor under NDA; on 30 days' notice; during business hours; at fiduciary's cost unless material breach found; processor to facilitate.

14. **Confidentiality** — separate clause set or cross-reference NDA / MSA confidentiality.

15. **Records of processing** — both parties to maintain ROPA; processor to assist fiduciary in preparing fiduciary's records; aligned with DPDP Rules disclosure.

16. **Termination and data return / deletion** — processor returns or deletes data within 30 days of termination; certificate of deletion; permitted retention only where required by law (with continued security obligations).

17. **Liability** — DPDP exposure is commonly *super-capped* relative to the underlying MSA's general liability cap (e.g., 2× or 3× annual fees). Processor indemnifies fiduciary against losses caused by processor's breach of DPA, including DPB penalties levied on fiduciary attributable to processor.

18. **Governing law and dispute resolution.**

### 3.2 Recommended

- **Significant Data Fiduciary obligations** flow-down — DPO appointment, DPIA, independent audit (s.10 DPDP) — relevant only if either party is notified as an SDF.
- **Children's data** (s.9) — additional protections for data principals < 18 years (verifiable parental consent; no targeted advertising or behaviour monitoring).
- **Consent Manager** (s.6(7)) — arrangements where applicable.
- **Sub-processor risk-rating** matrix.
- **Insurance** — cyber liability proportional to data volume.
- **Notification address for DPB** correspondence.
- **Cooperation with regulatory inquiries** — RBI, SEBI, IRDAI, MeitY, DPB.
- **Privileged-and-confidential treatment** of audit reports.

---

## 4. Drafting notes, pitfalls, enforceability tips

1. **Section 8(5) is mandatory.** A fiduciary that engages a processor without a written contract is in default, regardless of the processor's actual compliance. Even a one-page DPA is better than none.

2. **DPDP applies extra-territorially (s.16(2)).** Any processing outside India is within scope if it is in connection with activity related to offering goods or services to data principals within India. Foreign processors handling Indian-origin data are caught — and Sutranet should require its foreign vendors to sign a DPA.

3. **Lawful basis is the fiduciary's responsibility, not the processor's.** Processor should obtain a representation that the fiduciary has lawful basis (consent or legitimate use under s.7) and an indemnity for breach.

4. **Consent under DPDP must be free, specific, informed, unconditional, unambiguous, and through a clear affirmative action (s.6(1)).** Pre-ticked boxes, bundled consent, or consent buried in T&Cs are non-compliant. Withdrawal must be as easy as giving (s.6(4–6)).

5. **Notice (s.5)** must be in plain language, available in English and any language listed in the Eighth Schedule of the Constitution. Drafter should attach a model notice as Annexure.

6. **Children's data (s.9).** Processing of children's data (under 18) requires verifiable parental consent and bars on tracking, targeted advertising, behaviour monitoring. Penalty up to ₹200 crore. Drafter must call this out where applicable (edtech, gaming, social).

7. **Sensitive personal data.** DPDP Act doesn't have a separate "sensitive" category like GDPR — but **s.43A IT Act + SPDI Rules 2011** continue to apply to bodies corporate, and sectoral regulators (RBI, IRDAI) treat financial / health data with extra rigor. Drafter should still flag financial, health, biometric, and Aadhaar data.

8. **Breach notification timelines** (s.8(6) + DPDP Rules). Fiduciary notifies DPB and affected data principals. The Rules, as notified, set out the form and timing — practitioners typically build to a **72-hour DPB notification** standard with a **24-hour processor-to-fiduciary** internal trigger. **Verify the current text of DPDP Rules 2025 because timelines may shift.**

9. **Cross-border transfer.** s.17 takes a "negative-list" approach: transfers permitted unless to a country/territory notified by the central government as restricted. Until restrictions are notified, transfers are open. However, sectoral data-localisation (RBI's 2018 payment-data circular requires storage in India; certain SEBI cybersecurity circulars; the proposed health-data localisation) continues to apply. Draft for both freedoms and sectoral constraints; build in the right to update sub-processor list and locations on notice.

10. **EU SCCs / equivalent.** Sutranet's foreign customers may insist on EU SCC Module 2 (Controller→Processor) or Module 3 (Processor→Sub-processor). Sutranet should be ready to sign these as additional terms because EU GDPR continues to apply to EU-data flows regardless of Indian DPDP.

11. **Right of erasure (s.12).** Data principal can demand erasure when consent withdrawn or purpose completed. Processor must assist within agreed time (5–7 business days). Backups present a special challenge — common drafting solution: erasure within working dataset within 7 days; backup deletion at next backup-rotation cycle (with continued security and access prohibition until then).

12. **Right to nominate (s.14).** Data principal can nominate another individual to exercise rights in case of death/incapacity. Operational handling required; processor assists.

13. **Significant Data Fiduciary (s.10).** Central government may notify a fiduciary as SDF based on volume, sensitivity, risk to electoral democracy, security of state, public order. SDFs must appoint a DPO based in India, conduct DPIAs and audits, and observe additional obligations. Drafter should include flow-down where one party is an SDF.

14. **Penalties.** s.33 + Schedule: up to ₹250 crore for failure to take reasonable safeguards, ₹200 crore for breaches involving children's data or SDF obligations, ₹150 crore for breach-notification failures. Indemnity clause should expressly contemplate DPB penalties; courts treat regulatory penalties as recoverable damages where contractually provided (subject to s.23 ICA on unlawful object — penalties for processor's own willful default are typically held recoverable).

15. **DPB jurisdiction and appeals.** DPB orders are appealable to TDSAT (s.29). Some practitioners draft the DPA dispute-resolution clause to carve out regulatory matters (which go to DPB / TDSAT) from contractual disputes (which go to arbitration).

16. **No equivalent of GDPR Art.82 right of compensation in DPDP.** The DPDP Act does not give data principals a private right of action for compensation against fiduciary or processor. Recourse is through DPB. However, common-law tort of privacy (post-*Puttaswamy*) and contract claims remain available. Drafter should not draft as though DPDP has a private right.

17. **Processor's own use of data is forbidden** unless pseudonymised / anonymised and contractually permitted (e.g., for product improvement). Many SaaS processors over-reach here; draft strict prohibition against use for own purposes.

18. **Aggregated / anonymised data carve-out.** Permissible only if data is truly anonymised (irreversible). Drafter should specify standard (e.g., k-anonymity = 5; differential-privacy threshold).

19. **Audit logistics.** Limit to once per 12 months absent material breach; require auditor independence and NDA; carve out other customers' confidential information; reasonable cost allocation.

20. **Retention.** Specify retention period per data category; align with sectoral retention requirements (Income-tax records 8 years; Companies Act records 8 years; Banking 8–10 years).

21. **Sub-processor change.** Two models: (a) general authorisation with notification + objection right; (b) specific authorisation (slow but stronger). Enterprise customers typically demand (b) for new sub-processors.

22. **Insurance.** Cyber liability proportional to data volume; sector-typical: ₹1–10 crore for SME engagements.

23. **DPDP–IT Act overlap.** The IT (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 still apply concurrently for the purposes of s.43A IT Act compensation claims by individuals. Drafter should not pretend they're gone.

24. **Sectoral overrides.** RBI Payment Data Storage Direction 2018; SEBI Cybersecurity Framework; IRDAI Information & Cyber Security Guidelines; CERT-In Directions of April 2022 (incident-reporting in 6 hours, log retention 180 days). All continue to apply.

---

## 5. Suggested clause-by-clause structure

```
1.  Parties and Recitals
2.  Definitions (DPDP-aligned)
3.  Scope and Roles
    3.1 Identification of Fiduciary and Processor
    3.2 Subject-matter, duration, nature and purpose of processing
    3.3 Categories of data principals and personal data (Schedule)
    3.4 Fiduciary's lawful basis representation
4.  Processor's Obligations
    4.1 Process only on documented instructions
    4.2 Confidentiality of personnel
    4.3 Security measures (cross-reference Schedule)
    4.4 Sub-processors (general/specific authorisation; flow-down)
    4.5 Assistance with data principal rights
    4.6 Assistance with DPIA, breach notification, regulator consultation
    4.7 Breach notification to fiduciary (within 24 hours)
    4.8 Return / deletion at termination
    4.9 Audit cooperation
    4.10 Records of processing
5.  Cross-Border Transfer
    5.1 Permitted destinations
    5.2 Safeguards (encryption, contractual)
    5.3 Sectoral compliance (RBI / SEBI / sectoral)
    5.4 Compliance with s.16-17 DPDP and central-government notifications
6.  Data Principal Rights Handling
7.  Significant Data Fiduciary (if applicable)
8.  Children's Data (if applicable; s.9 DPDP)
9.  Sensitive / Health / Financial Data (sectoral overlay)
10. Records and Reporting
11. Audits and Inspections
12. Indemnities and Liability
    12.1 Processor indemnifies for breach of DPA
    12.2 DPB penalties recoverable
    12.3 Super-cap (2x-3x general cap)
13. Termination and Data Return / Deletion
    13.1 Return or delete within 30 days
    13.2 Certificate of deletion
    13.3 Permitted legal retention with continuing security
14. Survival
15. Notices, including DPB-related
16. Governing Law: India
17. Dispute Resolution: A&C Act 1996, sole arbitrator, seat Bengaluru;
    DPB / TDSAT exclusive for regulatory matters
18. Boilerplate
19. Schedules
    Schedule 1: Description of Processing
    Schedule 2: Categories of Data Principals and Personal Data
    Schedule 3: Approved Sub-processors and Locations
    Schedule 4: Technical and Organisational Measures
    Schedule 5: Cross-Border Transfer Safeguards (incl. EU SCCs if needed)
    Schedule 6: Privacy Notice (model)
    Schedule 7: Breach Notification Form
```

---

## 6. Market-standard values (India, 2024–2026)

| Parameter | Typical value |
|-----------|---------------|
| Breach notification: processor → fiduciary | 24 hours (sometimes 12) |
| Fiduciary → DPB | 72 hours (per DPDP Rules; verify) |
| Data principal request response | 30 days (DPDP-default); processor to assist within 5–7 days |
| Audit frequency | 1× per 12 months + breach-triggered |
| Sub-processor change notice | 30 days (general); express prior consent for enterprise |
| Data return / deletion window | 30 days from termination |
| Liability super-cap (DPDP) | 2×–3× general cap or aligned with DPB statutory exposure |
| Cyber insurance | ₹1 crore (SME), ₹5–10 crore (enterprise) |
| Encryption | AES-256 at rest; TLS 1.2+ in transit |
| Access control | RBAC + MFA |
| Retention | per data category; default 7 years (income-tax/companies-act baseline) |
| Stamp duty (when standalone, Karnataka) | ₹200 |
| Governing law | Indian law |
| Seat | Bengaluru (or party HQ) |

---

## 7. Stamp duty & execution requirements

- **As Schedule to MSA:** no separate stamp; stamp duty paid on the MSA covers it. Recital that the DPA is an integral part of the MSA.
- **Standalone:** "Agreement not otherwise provided for" — Karnataka ₹200; Maharashtra ₹100–500; Delhi ₹50–100.
- **Cross-border:** if the foreign counterparty insists on EU SCCs or the EU Commission's standard contractual clauses being separately executed, those are typically additional schedules to the DPA; stamp the underlying DPA.
- **Registration:** Not required.
- **Execution:** Wet-ink with two witnesses, or Aadhaar e-Sign / DSC for electronic execution. Counterparts permitted. Original retained by each party; PDF copy to legal/InfoSec/DPO.
- **Operational adjuncts:** Sutranet's DPO (or a designated officer) should maintain (i) ROPA (records of processing activity), (ii) DPIA register, (iii) breach register, (iv) sub-processor register, (v) consent log. The DPA is only as effective as the operational machinery behind it.

---

## 8. Cross-references to other Sutranet documents

- **MSA (file 04):** DPA is most often a Schedule to the MSA. Liability super-cap for DPDP exposure must be expressly carved out from the MSA's general cap.
- **Consultant Agreement (file 06):** if consultant processes personal data, full DPA terms apply (either inline or annexed).
- **Employee NDA (file 02):** employees handling personal data must be subject to confidentiality and DPDP-aligned obligations; the Employee NDA references the DPDP Policy.
- **Employment Agreement (file 05):** Sutranet processes employee personal data as Data Fiduciary; the EA's privacy notice and consent are part of DPDP compliance vis-à-vis its own staff.
- **IPR Policy (file 03):** datasets used to train models may be personal data; Foreground IP in trained models intersects with data principal rights; AI/ML use cases must align both files.
- **Client NDA (file 01):** if personal data is exchanged in pre-contract diligence, an inline DPDP clause set or DPA attachment is required.

End of file 07.
