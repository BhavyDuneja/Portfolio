# Research File 01 — Client–Company NDA (Mutual / One-Way)

**Document purpose:** Bilateral or unilateral Non-Disclosure Agreement governing exchange of confidential information between Sutranet and a current or prospective client (which may itself be an Indian or foreign corporate). NDAs are the most-frequently signed commercial document in India and the most-frequently drafted poorly.

---

## 1. Overview & purpose

NDAs in India serve three commercial functions:

1. **Pre-contract diligence**: protect information shared during pitching, RFP, due diligence, or proof-of-concept.
2. **Operational confidentiality**: govern day-to-day exchanges in advance of a master commercial agreement (MSA, SoW).
3. **Termination tail**: ensure information shared survives termination of the underlying relationship.

Sutranet should maintain **two templates**:
- **Mutual NDA** — used when both sides will exchange Confidential Information (the default for client engagements where Sutranet receives client data and shares its methodology, pricing, and architecture).
- **One-way NDA (Sutranet as Recipient)** — used in vendor-evaluation or RFP contexts when the client refuses to sign mutual.

Avoid a "one-way Sutranet as Discloser" template — clients almost never sign it because they end up bound without reciprocity.

---

## 2. Governing law & statutory basis

| Statute / Provision | Relevance |
|---------------------|-----------|
| **Indian Contract Act, 1872** | s.10 (valid contract), s.23 (lawful object — NDA must not gag whistleblowing on unlawful acts), s.27 (restraint of trade — confidentiality is permissible; non-compete is not), s.28 (jurisdiction — exclusive forum permissible only if at least one named court has jurisdiction), s.73 (compensation), s.74 (liquidated damages — caps must be a genuine pre-estimate). |
| **Specific Relief Act, 1963** | s.10 (specific performance default for commercial contracts post-2018 amendment), s.14 (when not enforceable), ss.36–42 (preventive relief / injunctions — perpetual and temporary). Confidentiality breaches are routinely enforced via interim injunctions under Order XXXIX Rule 1, CPC. |
| **Information Technology Act, 2000** | s.43 (compensation for unauthorised access to a computer system), s.43A (compensation for negligent handling of sensitive personal data — overlaps with DPDP), s.65 (tampering with source code), s.66, s.66B–F (cybercrimes), s.72 (breach of confidentiality by intermediary), **s.72A** (disclosure in breach of lawful contract — punishable with up to 3 years and ₹5 lakh fine). |
| **Indian Evidence Act, 1872 / Bharatiya Sakshya Adhiniyam, 2023** | s.65B / s.63 — admissibility of electronic records. NDA should require evidence-grade preservation (logs, hash, certificate). |
| **Copyright Act, 1957** | s.13 (subject matter), s.51 (infringement); confidential business information frequently doubles as a "literary work" or "computer programme" eligible for copyright protection alongside the contractual remedy. |
| **DPDP Act, 2023** | When Confidential Information includes personal data of identifiable individuals, NDA alone is insufficient — a DPA-style clause set is needed (see file 07). |
| **Arbitration & Conciliation Act, 1996** | s.7 (arbitration agreement), s.9 (interim measures by court — important for NDA injunctions before arbitrator is appointed), s.17 (interim measures by tribunal), s.34 (challenge to award). |
| **Indian Stamp Act, 1899** | NDAs are charged as "agreements not otherwise provided for" under Article 5 of the relevant state schedule. Typically nominal — Karnataka ₹200, Maharashtra ₹100–₹500, Delhi ₹50–₹100 — but always verify. |
| **Code of Civil Procedure, 1908** | s.20 (territorial jurisdiction — basis for forum-selection clauses); Order XXXIX Rules 1–2 (interim injunctions). |

### Trade Secrets — note on the law

India does **not** have a dedicated trade-secrets statute (no equivalent of the US DTSA or the EU Directive 2016/943). Protection is purely contractual + equitable. The leading authority remains *American Express Bank Ltd. v. Priya Puri*, (2006) 110 FLR 1097 (Delhi HC), which read in a confidentiality obligation absent express contract; and *John Richard Brady v. Chemical Process Equipments*, AIR 1987 Del 372, on equitable confidentiality. This makes a **well-drafted NDA the only meaningful protection**.

---

## 3. Mandatory & recommended clauses

### 3.1 Mandatory (without these, the NDA is not fit for purpose)

1. **Parties & capacity** — full name, CIN/LLPIN, registered office, authorised signatory.
2. **Recitals (WHEREAS)** — describe the "Purpose" precisely. Indian courts read NDAs against the discloser if the purpose is vague.
3. **Definition of "Confidential Information"** — broad, includes oral disclosures (with optional 30-day written confirmation requirement), marked or unmarked, and derivatives.
4. **Standard exclusions** — (a) public domain through no fault, (b) already known with proof, (c) independently developed, (d) lawfully received from a third party without confidentiality obligation, (e) compelled disclosure by law/court (with notice obligation).
5. **Permitted use** — limited strictly to the Purpose; "need-to-know" basis; downstream recipients (employees, advisers, affiliates) bound by equivalent obligations.
6. **Term and survival** — (a) term during which information may be exchanged; (b) confidentiality survival period after termination (market: 2–5 years for commercial information; perpetual for trade secrets and source code).
7. **Return / destruction** — within 30 days of termination, with officer's certificate. Retain one archival copy for legal/regulatory record-keeping is acceptable.
8. **Remedies & equitable relief** — explicit acknowledgement that damages are inadequate and that the Discloser is entitled to injunctive relief without the need to post a bond ("without proof of actual damage and without bond, to the maximum extent permitted by law"). Indian courts may still require a bond, but the language is persuasive.
9. **Governing law and dispute resolution** — Indian law; arbitration seat (Bengaluru / Mumbai / Delhi); language; forum for s.9 interim relief.
10. **Notices, severability, entire agreement, no-waiver, counterparts, electronic execution.**

### 3.2 Recommended (market-standard but negotiable)

11. **No licence** — disclosure does not transfer IP.
12. **No obligation to disclose / no representation as to accuracy** — shields Discloser from product-liability-style claims on shared information.
13. **No solicitation** — 12-month employee non-solicit (enforceable in India if reasonable and not extending to mere "hiring").
14. **No publicity / press release** without prior written consent.
15. **Compelled-disclosure notice clause** — recipient to give prompt written notice and cooperate with protective orders.
16. **Residual knowledge clause** — controversial; Discloser-favourable templates omit; Recipient-favourable templates include. For Sutranet, when acting as Recipient, push for a narrow residuals carve-out limited to "general knowledge, skill and experience retained in unaided memory of personnel".
17. **Data protection compliance** — when personal data is involved, an inline DPA or annexure.
18. **Export control / sanctions** representation if foreign counterparty.
19. **Audit right** (rare in NDAs but useful where source code or PII is shared).
20. **Indemnity** — uncommon in pure NDAs in India; Sutranet should resist as Recipient and consider as Discloser.

---

## 4. Drafting notes, pitfalls, enforceability tips

1. **Avoid disguised non-competes.** A clause that bars the Recipient from "engaging in any business similar to the Disclosing Party" is void under s.27 Contract Act even if labelled as confidentiality. Restrict the prohibition to *use of the Confidential Information*, not to general industry activity.

2. **Survival periods must be reasonable.** A perpetual obligation on garden-variety business information is likely to be read down. The market accepts: 2 years (low sensitivity), 3 years (default), 5 years (sensitive technical), perpetual only for true trade secrets / source code / cryptographic keys.

3. **Liquidated damages: s.74 ICA 1872.** A pre-estimate of damages (e.g., ₹50 lakh per breach) is enforceable only if it represents a genuine pre-estimate of loss; otherwise the court awards reasonable compensation not exceeding the named amount (*ONGC v. Saw Pipes*, (2003) 5 SCC 705; *Kailash Nath Associates v. DDA*, (2015) 4 SCC 136). Drafters should pair the LD figure with a recital explaining why it is a genuine pre-estimate (cost of investigation, loss of competitive advantage, etc.).

4. **Indian-seated arbitration is strongly preferred** for B2B NDAs unless the counterparty is foreign. For foreign counterparties, **SIAC** (Singapore International Arbitration Centre) is the market default; the *BALCO v. Kaiser* line of authority (Constitution Bench, (2012) 9 SCC 552, and post-2015 amendments) makes Part I non-applicable to foreign-seated arbitrations, simplifying the regime.

5. **Section 9 interim relief is available even for foreign-seated arbitration** under the post-2015 proviso to s.2(2) Arbitration Act unless expressly excluded — drafters should explicitly preserve this for confidentiality breaches because it is the single most important remedy in a leak scenario.

6. **Stamp duty on NDAs.** Inadequately stamped NDAs are inadmissible until stamped + penalty paid. Recent SC five-judge bench in *In Re: Interplay between Arbitration Agreements and the Indian Stamp Act* (Curative, December 2023) restored the position that an unstamped arbitration agreement is enforceable but the underlying contract still needs to be stamped before being received in evidence. Practical answer: stamp the NDA properly via SHCIL e-stamp on day one — it costs ₹100–₹500 in most states.

7. **Electronic execution.** Aadhaar e-Sign (s.5 IT Act + s.3A) and digital signature certificates (DSC) are valid; OTP-based clickwrap is enforceable but evidentiary value is weaker. For NDAs of any commercial weight, insist on Aadhaar e-Sign at minimum.

8. **No-Hire vs No-Solicit.** A pure "no-hire" (cannot employ, even if employee approaches) is on shakier ground than "no-solicit" (cannot actively recruit). 12 months is the market norm; 24 months is borderline.

9. **Carve-out for whistleblower / regulatory reporting.** Especially when dealing with listed companies or US clients, include an express carve-out preserving the employee's/individual's right to report violations of law to regulators (avoids running afoul of s.23 ICA's "lawful object" requirement and is increasingly demanded under SEBI LODR for listed counterparties).

10. **Compelled disclosure: the "reasonable cooperation" trap.** If you draft "Recipient shall, at Discloser's cost, oppose any subpoena", this can become an open-ended obligation. Cap cooperation at "commercially reasonable steps".

---

## 5. Suggested clause-by-clause structure

```
1.  Parties
2.  Recitals (background, "Purpose")
3.  Definitions
    3.1 "Affiliate"
    3.2 "Confidential Information"
    3.3 "Discloser" / "Recipient"
    3.4 "Effective Date"
    3.5 "Personal Data" (DPDP-compliant)
    3.6 "Purpose"
    3.7 "Representatives"
4.  Confidentiality Obligations
    4.1 Standard of care (no less than for own confidential info,
        in any case reasonable care)
    4.2 Permitted disclosures (Representatives, need-to-know,
        bound by equivalent obligations)
    4.3 Use restrictions (solely for Purpose)
    4.4 Exclusions (a)–(e)
    4.5 Compelled disclosure (notice + cooperation)
5.  Personal Data Protection (DPDP Act 2023 alignment)
6.  No Licence / No Representations
7.  Return or Destruction
8.  Term & Survival
    8.1 Term: 2 years from Effective Date (typical)
    8.2 Survival: Confidentiality continues for 3 years
        post-termination; trade secrets perpetual
9.  Remedies
    9.1 Acknowledgement of inadequacy of damages
    9.2 Right to injunctive / equitable relief
    9.3 (Optional) Liquidated damages with s.74 recital
10. Non-Solicitation of Personnel (12 months, soft carve-outs for
    general advertising and unsolicited applications)
11. No Publicity
12. Representations & Warranties (limited)
13. Indemnity (optional; usually omitted)
14. Notices
15. Governing Law: laws of India
16. Dispute Resolution: arbitration under Arbitration & Conciliation
    Act 1996, sole arbitrator, seat at Bengaluru, language English,
    ICA / MCIA / DIAC institutional rules optional;
    s.9 court relief expressly preserved
17. Jurisdiction for s.9: courts at Bengaluru
18. Boilerplate
    18.1 Entire Agreement
    18.2 Amendment (in writing)
    18.3 Severability
    18.4 No Waiver
    18.5 No Assignment without consent
    18.6 Counterparts & Electronic Execution
    18.7 Force Majeure (light, since NDA has few performance obligations)
19. Signatures (with witness lines)
Schedule 1: Description of Purpose
Schedule 2: (Optional) DPDP Annexure
```

---

## 6. Market-standard values (India, 2024–2026)

| Parameter | Typical value | Notes |
|-----------|---------------|-------|
| Term of NDA | 1–2 years | Auto-renewal occasionally seen |
| Confidentiality survival | 3 years (default), 5 years (technical), perpetual (trade secrets/source code) | Avoid >5 years for general info |
| Notice for compelled disclosure | 5 working days (or "as soon as legally permissible") | |
| Return / destruction window | 30 days | |
| Non-solicit duration | 12 months post-termination | 24 months sometimes seen, weaker |
| Liquidated damages (per breach) | ₹10–50 lakh for SMB engagements | Must be a genuine pre-estimate |
| Indemnity cap (if included) | 1× contract value or ₹1 crore, whichever lower | Often omitted in NDA |
| Stamp duty | ₹100–500 (state-dependent) | Karnataka: ₹200 typical |
| Seat of arbitration | Bengaluru / Mumbai / New Delhi | Match Sutranet's HQ |
| Arbitrator | Sole arbitrator | Three-member only for high-value |
| Governing law | Indian law | |

---

## 7. Stamp duty & execution requirements

- **Karnataka (Bengaluru execution):** Article 5(j) of Karnataka Stamp Act schedule — agreement not otherwise provided for: typically **₹200** for an NDA. Use **e-stamp via SHCIL** (Stock Holding Corporation of India Ltd.) — the standard Karnataka e-stamp paper.
- **Maharashtra (Mumbai execution):** Article 5(h)(B) Maharashtra Stamp Act — typically **₹100–₹500** depending on monetary obligation; pure NDA usually **₹100**.
- **Delhi (NCT execution):** Article 5(c) of Indian Stamp (Delhi) Act — typically **₹50–₹100**.
- **Tamil Nadu (Chennai):** Article 5 Schedule I of Indian Stamp Act as adapted — typically **₹100**.
- **Cross-state execution rule:** s.19 ISA — if executed outside the state but used inside, top-up to the state-of-use rate within 3 months.

**Verify all rates** against the latest schedule before execution; states amend stamp schedules without much fanfare.

**Registration:** NDAs are **not required to be registered** under the Registration Act 1908 — they do not create an interest in immovable property. However, when the NDA contains an IP assignment (rare in pure NDAs but seen in some hybrids), separate registration under s.45 Trade Marks Act / s.69 Patents Act may be required.

**Execution mechanics:**
- Two duly authorised signatories (board resolution attached to the file copy).
- Two witnesses recommended though not strictly required.
- Aadhaar e-Sign or DSC where electronic execution is used; preserve audit trail per s.65B Evidence Act / s.63 BSA 2023.
- Counterparts clause permitted under s.10 Contract Act — courts accept executed counterparts.
- One executed original retained by each party; PDF scans circulated for record.

---

## 8. Cross-references to other Sutranet documents

- **MSA (file 04):** when an MSA is signed, the NDA is typically *superseded* or attached as a Schedule. Drafter must include a survival/transition clause so confidentiality obligations carry forward without gap.
- **Employee NDA (file 02):** Sutranet's employees handling client data must be bound by equivalent obligations — the Employee NDA's "Confidential Information" definition must encompass client-supplied information.
- **DPA (file 07):** when shared information includes personal data of identifiable individuals, attach DPA as Annexure or insert DPDP-aligned clause set inline.
- **IPR Policy (file 03):** confirms that any IP shared under NDA remains with Discloser — i.e., NDA does *not* operate as licence or assignment.

End of file 01.
