# Research File 03 — IPR Assignment & IP Policy

**Document purpose:** Two related instruments — (1) an **IP Assignment Deed** signed by every employee and contractor that transfers all IP created in the course of engagement to Sutranet; (2) an **IP Policy** that governs ongoing operational matters (invention disclosure, prior-IP carve-outs, open-source use, third-party rights, moral rights waiver). Together they form the core of Sutranet's IP chain of title.

---

## 1. Overview & purpose

A defective IP chain is the single most common reason an Indian software/services company loses a deal in due diligence — investors and acquirers test:

1. **Title** — does the company own its code?
2. **Vesting mechanism** — is the assignment present-tense ("hereby assigns"), not promissory ("agrees to assign")? Promissory language requires further action and creates execution risk.
3. **Author identification** — for *each* contributor, including consultants, interns, and founders, is there a signed deed?
4. **Moral-rights waiver** — has the author waived rights of attribution and integrity to the extent permissible under s.57 Copyright Act 1957?
5. **Background / Foreground IP delineation** — for client work, has Sutranet retained licence to its background IP and, where appropriate, retained Foreground IP for reuse?
6. **Open-source compliance** — have copyleft (GPL family) components been segregated?
7. **Third-party IP** — design assets, fonts, libraries, AI-generated content — properly licensed?

The IPR documentation needs to address all seven.

---

## 2. Governing law & statutory basis

| Statute | Relevance |
|---------|-----------|
| **Copyright Act, 1957** | The single most important statute for software. **s.13** (works protected; computer programmes are "literary works"); **s.14** (rights — reproduction, adaptation, distribution); **s.17 (first ownership)** — proviso (a) author of work made in course of employment under contract of service for proprietor of newspaper/magazine = proprietor; **proviso (c) — work made by employee in course of employment under contract of service = employer**, *subject to any agreement to the contrary*; proviso (d) Government work; **s.18 (assignment)** — must be in writing and signed by assignor or duly authorised agent; **s.19 (mode of assignment)** — must specify work, rights assigned, duration, territorial extent, royalty; **s.19A (disputes)**; **s.30 (licences)**; **s.45 (registration — optional but evidentiary)**; **s.51 (infringement); **s.57 (author's special rights — moral rights — right of paternity and integrity)**; s.63 (criminal). |
| **Patents Act, 1970** | s.3 (non-patentable — including pure software *per se* under s.3(k); software with hardware/technical effect can be patentable); s.6 (who can apply); **s.28 (mention of inventor)**; s.68 (assignment must be in writing and registered with Patent Office for validity); s.69 (registration of assignments). |
| **Trade Marks Act, 1999** | ss.37–45 (assignment with or without goodwill; written instrument; **registration of assignment under s.45 — without registration, assignee cannot sue**); s.46 (use). |
| **Designs Act, 2000** | s.30 (assignment of registered design — written; registration mandatory for validity). |
| **Semiconductor Integrated Circuits Layout-Design Act, 2000** | Niche but applicable for hardware/IC design. |
| **Information Technology Act, 2000** | s.65 (source-code tampering); supports criminal recourse. |
| **Indian Contract Act, 1872** | s.10, 23, 27 (some "no-create-IP-after-exit" clauses can be struck as restraint); the assignment itself is a contract. |
| **Indian Stamp Act, 1899** | Assignment of IP is chargeable: most state schedules treat IP assignments under "Conveyance" or a specific "Assignment of copyright/trade mark" entry. **Stamp duty on IP assignment can be material — see section 7 below.** |
| **Registration Act, 1908** | s.17 mandates registration of certain instruments. IP assignments are *not* automatically required to register under Registration Act, but specific IP statutes require registration with the IP Office (Patent Office, TM Registry, Design Office). |
| **Companies Act, 2013** | s.188 (related-party — IP assigned by founder to company is a related-party transaction requiring board / audit-committee approval). |
| **DPDP Act, 2023** | When data sets and trained models contain personal data, IP ownership of the model and rights to the training data interact with DPDP obligations. |
| **GST law (CGST Act 2017)** | Permanent transfer of IP rights = supply of services (HSN 9973), GST 12% or 18% depending on classification. Founder-to-company IP assignment can attract GST unless properly structured. |

### Case-law touchstones

- *Indian Performing Right Society v. Eastern India Motion Pictures*, AIR 1977 SC 1443 — author's residuary rights and the scope of s.17.
- *Sahara One Media v. Sushilkumar Agrawal*, 2014 (Delhi HC) — written assignment essential under s.19.
- *Pine Labs v. Gemalto Terminals India*, 2010 (Delhi HC) — assignment without specifying duration: under s.19(5), default 5 years; under s.19(6), default Indian territory.
- *Saregama India v. New Digital Media*, 2018 — clarification on s.18 vs s.30 (assignment vs licence) in digital context.
- *Diljeet Titus v. Alfred Adebare*, 130 (2006) DLT 330 — confidential information and copyright in work product.

---

## 3. Mandatory & recommended clauses

### 3.1 IP Assignment Deed — mandatory

1. **Recitals** — Employee/Consultant has been or will be engaged by Sutranet; in the course of engagement may create IP; parties wish to confirm Sutranet's ownership.
2. **Definitions** — "Assigned IP", "Background IP", "Foreground IP", "Inventions", "Moral Rights", "Open-Source Software", "Third-Party Rights".
3. **Present-tense assignment**: "The Employee hereby irrevocably assigns to the Company, with full title guarantee, all right, title and interest (including all intellectual property rights) in and to all Foreground IP, throughout the world, for the entire duration of such rights, including all extensions and renewals." Use *hereby assigns* (present), not *agrees to assign* (future).
4. **Future inventions** — assignment extends to all IP created during the course of employment from joining until termination. (Limit to engagement scope to avoid s.27 challenge.)
5. **Compliance with s.19 Copyright Act** — specify (a) work, (b) rights, (c) duration (entire term), (d) territorial extent (worldwide), (e) royalty (one rupee — or "consideration of employment / Rs.1"). Without these, the assignment is partially defective.
6. **Patents** — separate sub-clause assigning all rights to inventions, including the right to apply, prosecute, and maintain patents; obligation to execute further documents (s.68 Patents Act registration).
7. **Trade marks and designs** — assignment with goodwill where applicable; obligation to assist registration (s.45 TM Act).
8. **Moral rights waiver** — to the maximum extent permitted under s.57 Copyright Act 1957, employee waives moral rights of attribution and integrity. **Note**: under s.57 the right to restrain "distortion, mutilation or modification… prejudicial to honour or reputation" cannot be wholly waived — but the right of paternity (attribution) can be waived contractually. Indian courts (*Amar Nath Sehgal v. Union of India*, 117 (2005) DLT 717 — Delhi HC, mural case) have read s.57 broadly. Drafter should waive to the extent legally permissible and add an undertaking not to assert.
9. **Pre-existing IP carve-out** — Schedule listing employee's pre-existing inventions (failure to list = no carve-out).
10. **Background-IP licence** — to the extent any pre-existing employee IP is incorporated into Foreground IP, employee grants Sutranet a perpetual, irrevocable, worldwide, royalty-free, sublicensable licence.
11. **Power of attorney** — irrevocable POA (coupled with interest) authorising Sutranet to execute IP filings and registrations on the employee's behalf if employee is unavailable.
12. **Further-assurances clause** — employee will execute further documents at Sutranet's reasonable request and cost.
13. **Warranties** — author is the sole creator; no third-party rights infringed; no encumbrances; freedom from open-source copyleft contamination unless disclosed.
14. **Indemnity** (modest) for breach of warranty.
15. **Stamp, governing law, jurisdiction, dispute resolution** as per overview.

### 3.2 IP Policy — mandatory operational clauses

1. **Invention Disclosure obligation** — employees must disclose inventions promptly to a named officer; non-disclosure does not affect Sutranet's title but may be grounds for disciplinary action.
2. **Use of open-source software** — categorisation (permissive: MIT/BSD/Apache; weak copyleft: LGPL/MPL; strong copyleft: GPL/AGPL); approval workflow; SBOM (software bill of materials) maintenance; obligation to flag any AGPL use.
3. **Third-party content** — no use of pirated software, unlicensed fonts, stock images without licence; AI-generated content provenance and licence chain.
4. **Use of generative AI tools** — input to LLMs constitutes disclosure (significant for confidentiality); output may carry uncertain copyright status (Indian Copyright Office accepts only human-authored works — *Ankit Sahni v. RAGHAV Artificial Intelligence Painting* registration controversy, 2020). Policy: employees may use approved AI tools (list); inputs containing client confidential data prohibited; output reviewed for third-party-rights infringement before use.
5. **Background-IP register** — maintained by IP Officer; updated on each new engagement.
6. **Foreground-IP register** — record of inventions, patent filings, copyright registrations.
7. **Joint-IP rules** — Sutranet's default position is sole ownership; joint ownership permitted only with prior written approval (joint ownership of patents in India under s.50 Patents Act has practical pitfalls — each co-owner can use without account but cannot license without consent).
8. **Customer-deliverable IP** — by default, Sutranet retains Foreground IP and grants the customer a non-exclusive licence; sole exceptions for paid bespoke development with explicit assignment in the SoW (see MSA file 04).
9. **Whistleblower / IP-theft reporting**.
10. **Sanctions for breach** — disciplinary, recovery of cost, termination, civil/criminal action.

### 3.3 Recommended

- **Inventor-recognition policy** (modest cash awards for granted patents — common in Indian product companies; ₹25,000 on filing, ₹1 lakh on grant is a market norm).
- **Trade-secret tagging policy** (folder/file naming, access control).
- **Exit interview** with IP officer including disclosure of in-flight inventions.

---

## 4. Drafting notes, pitfalls, enforceability tips

1. **Use present-tense assignment.** "Agrees to assign" is a *promise* to assign and requires a separate executed assignment to perfect title. The leading US authority *Stanford v. Roche*, 563 U.S. 776 (2011), is followed in spirit by Indian counsel — use "hereby assigns" + "and to the extent any future-arising IP cannot be assigned in present tense, employee hereby assigns the same effective from the moment of creation".

2. **Section 17(c) Copyright Act default applies only to *employees***, not to consultants/contractors. For consultants, *the author retains copyright* unless there is a written assignment compliant with s.18 + s.19. Many Indian SMEs lose IP in due diligence because their early contractors signed only an NDA, not an assignment. Sutranet's Consultant Agreement (file 06) MUST contain a present-tense assignment.

3. **Section 19 prescriptive requirements.** s.19 Copyright Act requires the assignment to (a) be in writing, (b) be signed by assignor or agent, (c) identify the work, (d) specify the rights assigned, (e) specify the duration, (f) specify the territorial extent, (g) specify the royalty payable. Defaults: if duration not specified → 5 years (s.19(5)); if territory not specified → India (s.19(6)). If royalty not specified, the assignment may be challenged. Drafter must include all parameters explicitly.

4. **Moral rights survive assignment.** s.57 grants the author special rights independent of copyright assignment. *Amar Nath Sehgal v. UoI*, 2005, demonstrated that even the State, having destroyed an artist's mural after acquiring it, was held liable for moral-rights infringement. For software/services context the practical risk is low but draft a waiver to the extent legally permissible plus an undertaking not to assert.

5. **Patent assignments must be registered.** s.68 Patents Act 1970 — an assignment of a patent is not valid against third parties unless registered with the Controller of Patents. Form 16, prescribed fee, executed deed. Same for designs (s.30 Designs Act) and trade marks (s.45 TM Act).

6. **Stamp duty on IP assignments is non-trivial.** Several states classify IP assignments under "Conveyance" with ad-valorem rates of 5–7% on consideration. Where consideration is "₹1 / employment", the deed should recite that employment is the consideration; ad-valorem may still apply on market value if a tax authority challenges. Maharashtra and Karnataka schedules merit careful checking.

7. **Joint inventions and joint copyright.** s.50 Patents Act allows each co-owner to exploit without account but not license without consent — a practical mess. Avoid joint ownership wherever possible; structure as sole ownership + cross-licence.

8. **Open-source contamination — AGPL.** AGPL requires that a network-deployed modified version be made available to users — a hidden risk in SaaS products. Policy must require Approval Officer sign-off before any AGPL component enters the codebase.

9. **AI-generated code and content.** Indian Copyright Office position is that human authorship is required (per the 2020 RAGHAV controversy). Employees should not pass AI-generated output as their own work; the policy must require attribution within the codebase and a review for licence compatibility (training-data provenance is unsettled).

10. **Founder IP transfer — related-party transaction.** When founders assign pre-incorporation IP to the company, this is a s.188 related-party transaction. Board approval and (where applicable) audit-committee approval required; disclosure in financial statements; valuation report from a registered valuer if non-cash consideration.

11. **Government grants / DSIR / Startup India.** Where IP is created with DSIR or BIRAC funding, the funding-agreement IP terms can override the default. Always check for prior funding contamination.

12. **GST on IP assignment.** Permanent transfer of IP = supply of services (HSN 9973). GST applies; founder transfers may attract GST unless structured as a contribution to capital. Take CA advice.

13. **Termination of assignment.** s.19A Copyright Act allows the Copyright Board (now Commercial Court) to revoke an assignment if the assignee fails to exercise rights within reasonable time. Drafter should require Sutranet to use commercially reasonable efforts to exploit, or explicitly say no obligation.

14. **Post-employment "trailing" assignment** — clauses that purport to capture IP created *after* termination if related to Company business are generally void as restraint of trade unless narrowly limited to inventions started during employment (the "shelved invention" doctrine). A 6-month trailing window is the maximum I would recommend, and even that is contestable.

15. **Section 23 ICA — unlawful object.** Assignments designed to defeat statutory rights of third parties (e.g., government's residual rights under DSIR-funded IP, assignment of moral rights in a way that compels the author to be misattributed) are void. Stay within statutory bounds.

---

## 5. Suggested clause-by-clause structure — IP Assignment Deed

```
1.  Parties (Company; Assignor)
2.  Recitals
3.  Definitions
4.  Assignment of IP
    4.1 Present-tense assignment of all Foreground IP
    4.2 Worldwide, perpetual, irrevocable
    4.3 All economic rights under Copyright Act, Patents Act,
        Designs Act, Trade Marks Act, SICLDA
    4.4 s.19 Copyright Act parameters: work (any work created in
        course of engagement), rights (all), duration (entire term),
        territory (worldwide), royalty (Rs.1 / consideration of employment)
    4.5 Future-arising IP: assignment effective at moment of creation
5.  Patents
    5.1 Right to apply, prosecute, maintain
    5.2 Power of attorney for filing
    5.3 Inventor identification under s.28 Patents Act
6.  Trade Marks and Designs
7.  Moral Rights
    7.1 Waiver to maximum extent permissible
    7.2 Undertaking not to assert
    7.3 Acknowledgement of s.57 Copyright Act limits
8.  Background IP and Pre-existing Inventions
    8.1 Schedule of pre-existing inventions
    8.2 Licence-back of any pre-existing IP incorporated in deliverables
9.  Open-Source / Third-Party
    9.1 Warranties of cleanliness
    9.2 Disclosure obligation
10. Power of Attorney (irrevocable, coupled with interest)
11. Further Assurances
12. Warranties and Indemnity (modest)
13. Confidentiality (cross-reference NDA)
14. Term — perpetual (deed of assignment is one-time)
15. Governing Law: India
16. Dispute Resolution
17. Jurisdiction
18. Boilerplate
19. Schedule A: Pre-existing inventions / Background IP
20. Schedule B: List of Foreground IP (updated periodically)
21. Schedule C: Form of Patent Assignment (Form 16) and TM/Design forms
```

---

## 6. Market-standard values

| Parameter | Typical value |
|-----------|---------------|
| Form of assignment | Present-tense ("hereby assigns") |
| Territorial extent | Worldwide |
| Duration | Entire term of IP including extensions |
| Royalty | ₹1 / consideration of employment |
| Moral-rights waiver | Maximum extent permissible under s.57 |
| Pre-existing IP carve-out | Schedule + warranty |
| Trailing window | 0–6 months (avoid >6 months) |
| Inventor award | ₹25,000 on filing; ₹1 lakh on grant (optional) |
| Joint ownership | Avoided by default |
| OSS approval threshold | All AGPL/GPL components require approval |
| Stamp duty (Karnataka) | ₹100–500 if structured as deed for nominal consideration; ad-valorem if material consideration |
| Patent assignment registration fee | ₹1,600 (e-filing) under Form 16 |
| TM assignment registration fee | ₹9,000 per class (form TM-P) |

---

## 7. Stamp duty & execution requirements

**This is the most state-sensitive item in the suite.** Get state-specific advice.

- **Karnataka:** Article 20(d) Karnataka Stamp Act for "assignment of debt or other actionable claim" — typically *ad valorem*. For a deed of assignment of copyright with nominal consideration, stamp under "Agreement" Article 5 at **₹200** is commonly used in practice for employee assignments (the consideration being employment), but a tax-authority challenge to revalue is possible. For high-value founder-to-company IP transfers with stated cash consideration, ad-valorem ~5% applies.
- **Maharashtra:** Article 25 / 60 Maharashtra Stamp Act — Conveyance / Assignment of intellectual property as conveyance. Could be ad-valorem 5%. For nominal employee assignments, MSA's "Agreement" Article 5(h)(B) at ₹100–500 is commonly used.
- **Delhi:** Indian Stamp Act schedule (Delhi) — Article 23 Conveyance.
- **Tamil Nadu:** similar conveyance treatment.

**Patent assignment registration:** Form 16 + ₹1,600 (small entity / individual / startup) or ₹3,200 (others) per the Patent Rules 2003 as amended. Must be filed within 6 months of execution to avoid late-filing fees.

**Trade-mark assignment registration:** Form TM-P + ₹9,000 (e-filing) per class per assignment. Mandatory for assignee to sue (s.45 TM Act).

**Design assignment registration:** Form 12 with controller of designs.

**Copyright registration:** Optional under s.45 Copyright Act 1957, but creates *prima facie* evidence of ownership; ₹500 per work (₹2,000 for software including source code listing of first 10 + last 10 pages or full code if < 20 pages).

**Execution mechanics:**
- Signed by assignor with two witnesses; counter-signed by Company representative.
- Deed format (executed as a deed) preferred for IP assignments because consideration is often nominal — deeds need no consideration to be enforceable.
- For employees: executed at joining alongside Employment Agreement and NDA.
- For consultants: executed before any work commences (do not start before deed is signed; if work has begun, execute deed of confirmation backdated to engagement start with rectification recital).

---

## 8. Cross-references to other Sutranet documents

- **Employment Agreement (file 05):** must require IP Assignment Deed execution as a condition; survival clause; reference to IP Policy.
- **Employee NDA (file 02):** confidentiality of inventions before disclosure; trade-secret protection.
- **Consultant Agreement (file 06):** **critical** — must contain present-tense IP assignment because s.17(c) Copyright Act vesting does not apply to non-employees. Without this, the consultant retains copyright.
- **MSA (file 04):** Background-IP definitions must align; Foreground-IP allocation in SoWs must be consistent with the Policy's default that Sutranet retains Foreground IP and licences it to the customer (or assigns where the SoW is bespoke development).
- **Client NDA (file 01):** confirms that disclosure is not licence; Sutranet's IP is not transferred by mere disclosure.
- **DPA (file 07):** trained-model and dataset IP intersection with personal-data rights under DPDP Act.

End of file 03.
