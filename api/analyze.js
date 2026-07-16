export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { companyProfile, useCase } = req.body;

    // Extract industry and geography from company profile to build targeted prompt
    const profileLower = (companyProfile || '').toLowerCase();

    // Determine which regulatory frameworks to include
    const isHealthcare = profileLower.includes('healthcare');
    const isFinance = profileLower.includes('finance') || profileLower.includes('banking');
    const isInsurance = profileLower.includes('insurance');
    const isLegal = profileLower.includes('legal');
    const isEducation = profileLower.includes('education');
    const isRetail = profileLower.includes('retail') || profileLower.includes('e-commerce');
    const isTech = profileLower.includes('technology') || profileLower.includes('saas');
    const isManufacturing = profileLower.includes('manufacturing');
    const isGovt = profileLower.includes('government') || profileLower.includes('public sector');
    const isHR = profileLower.includes('hr') || profileLower.includes('recruitment');
    const isRealEstate = profileLower.includes('real estate') || profileLower.includes('housing');
    const isPharma = profileLower.includes('pharmaceutical') || profileLower.includes('life sciences');
    const isEnergy = profileLower.includes('energy') || profileLower.includes('utilities');
    const isTelecom = profileLower.includes('telecommunications');
    const isDefense = profileLower.includes('defense') || profileLower.includes('aerospace');
    const isNonProfit = profileLower.includes('non-profit') || profileLower.includes('ngo');
    const isChildren = profileLower.includes('children') || profileLower.includes('edtech') || profileLower.includes('under 13');

    const isEU = profileLower.includes('eu') || profileLower.includes('europe') || profileLower.includes('global');
    const isUS = profileLower.includes('us') || profileLower.includes('united states') || profileLower.includes('california') || profileLower.includes('global') || !isEU;
    const isCA = profileLower.includes('california') || profileLower.includes('global');

    // Build targeted regulatory section
    let regulatoryFrameworks = `APPLICABLE REGULATORY FRAMEWORKS:\n`;

    // Always include horizontal AI frameworks
    regulatoryFrameworks += `
HORIZONTAL AI (always apply):
- EU AI Act${isEU ? ' (APPLIES â€” EU/Global users detected)' : ' (lower priority â€” no EU users detected)'}: Unacceptable Risk=prohibited; High Risk=recruitment/credit/healthcare diagnostics/critical infrastructure/education â€” requires logging, human oversight, conformity assessment; Limited Risk=chatbots/emotion recognition â€” transparency disclosures; Minimal Risk=standard obligations
- ${isUS ? 'US AI Laws (APPLIES):' : 'US AI Laws:'} California CCPA Automated Decision-Making (consumer decisionsâ†’notice+opt-out); California AB 2013/SB 942 (generative AIâ†’training data docs+watermarking); Colorado AI Act SB 189 (housing/employment/education/banking decisionsâ†’bias impact assessment); Illinois BIPA (biometric dataâ†’consent)
`;

    // Always include core data privacy
    regulatoryFrameworks += `
DATA PRIVACY (apply based on geography):
- ${isEU ? 'GDPR (APPLIES â€” EU users detected):' : 'GDPR:'} right to be forgotten, purpose limitation, lawful basis, DPA notification
- ${isCA ? 'CCPA/CPRA (APPLIES â€” California/Global detected):' : 'CCPA/CPRA:'} data minimization, LLM vendor sharing disclosure
`;

    // Add only relevant industry frameworks
    if (isHealthcare) regulatoryFrameworks += `\nHEALTHCARE (APPLIES): HIPAA (BAAs required for all vendors processing PHI), FDA Mobile Medical App Guidance (diagnosis/treatment AI may need 510k clearance), 21st Century Cures Act interoperability rules, ONC HIT Certification for EHR integration.\n`;
    if (isFinance) regulatoryFrameworks += `\nFINANCE/BANKING (APPLIES): PCI DSS 4.0 (payment card data), SEC Rules (algorithmic trading/pricing), FCRA (credit decisioning), ECOA (lending discrimination), BSA/AML (fraud/transaction monitoring), OCC SR 11-7 Model Risk Management.\n`;
    if (isInsurance) regulatoryFrameworks += `\nINSURANCE (APPLIES): NAIC Model Bulletin on AI (explainability/fairness for underwriting/claims), state actuarial approval requirements, fair insurance practices (proxy discrimination).\n`;
    if (isLegal) regulatoryFrameworks += `\nLEGAL (APPLIES): ABA Model Rules of Professional Conduct (competence obligations), attorney-client privilege (AI systems processing legal comms), State Bar AI Guidelines, FRCP eDiscovery rules for AI document review.\n`;
    if (isEducation) regulatoryFrameworks += `\nEDUCATION (APPLIES): FERPA (student educational records â€” strict consent for AI), COPPA (students under 13), EU AI Act High Risk (AI in educational assessment), Student Data Privacy Consortium agreements.\n`;
    if (isRetail) regulatoryFrameworks += `\nRETAIL/E-COMMERCE (APPLIES): FTC Act Section 5 (unfair/deceptive AI practices), FTC AI Endorsement Guidelines (AI-generated reviews), ADA/WCAG (accessibility), PCI DSS (checkout/payment AI).\n`;
    if (isTech) regulatoryFrameworks += `\nTECHNOLOGY/SAAS (APPLIES): SOC 2 Type II (AI systems in trust service criteria), ISO 27001 (model/data pipeline security), NIST AI RMF (responsible AI framework), CAN-SPAM/CASL (AI email/comms), DMCA/Copyright (AI-generated content, training data), Open Source License compliance (GPL/Apache/MIT for open-source models).\n`;
    if (isManufacturing) regulatoryFrameworks += `\nMANUFACTURING (APPLIES): EU Machinery Regulation (AI in industrial machinery safety assessment), EU AI Act High Risk (safety components), ISO 9001 Quality Management (AI in quality control), OSHA (AI affecting workplace safety).\n`;
    if (isGovt) regulatoryFrameworks += `\nGOVERNMENT (APPLIES): FedRAMP (cloud AI for federal agencies), FISMA (federal information security), Section 508 (accessibility), OMB M-24-10 (federal AI use policies).\n`;
    if (isHR) regulatoryFrameworks += `\nHR/RECRUITMENT (APPLIES): EEOC Guidelines on AI in Hiring (disparate impact, adverse impact analysis), NYC Local Law 144 (mandatory bias audits for automated employment tools in NYC), Illinois AI Video Interview Act (consent + annual bias audits), OFCCP (federal contractor affirmative action compliance).\n`;
    if (isRealEstate) regulatoryFrameworks += `\nREAL ESTATE/HOUSING (APPLIES): Fair Housing Act (algorithmic discrimination in housing), Colorado AI Act SB 189 (housing decisions), HMDA (mortgage AI reporting).\n`;
    if (isPharma) regulatoryFrameworks += `\nPHARMACEUTICAL/LIFE SCIENCES (APPLIES): FDA 21 CFR Part 11 (electronic records in clinical trials), GxP Compliance (GMP/GLP/GCP for manufacturing/lab/clinical AI), ICH E6 Good Clinical Practice, EMA Guidelines on AI in medicines.\n`;
    if (isEnergy) regulatoryFrameworks += `\nENERGY/UTILITIES (APPLIES): NERC CIP (critical infrastructure protection for grid AI), FERC Regulations (energy trading/market AI), DOE Cybersecurity Guidelines.\n`;
    if (isTelecom) regulatoryFrameworks += `\nTELECOMMUNICATIONS (APPLIES): FCC Regulations (network management/call routing AI), CPNI (customer proprietary network information), TRACED Act (robocall/call authentication AI).\n`;
    if (isDefense) regulatoryFrameworks += `\nDEFENSE/AEROSPACE (APPLIES): ITAR (export restrictions on defense AI), CMMC (cybersecurity maturity for defense contractors), DoD AI Ethics Principles (mandatory for defense AI), EAR (AI technology export controls).\n`;
    if (isNonProfit) regulatoryFrameworks += `\nNON-PROFIT/NGO (APPLIES): IRS Form 990 (AI use in donor solicitation disclosure), donor privacy laws (state charitable solicitation), grant compliance (federal grant terms on AI), GDPR/CCPA (donor/beneficiary data).\n`;
    if (isChildren) regulatoryFrameworks += `\nCHILDREN'S APPS (APPLIES): COPPA (mandatory for users under 13 â€” prohibits behavioral tracking, requires parental consent), KOSA (Kids Online Safety Act), UK Age Appropriate Design Code, EU AI Act heightened scrutiny for child-facing AI.\n`;

    // If no specific industry matched, add generic note
    if (!isHealthcare && !isFinance && !isInsurance && !isLegal && !isEducation && !isRetail && !isTech && !isManufacturing && !isGovt && !isHR && !isRealEstate && !isPharma && !isEnergy && !isTelecom && !isDefense && !isNonProfit && !isChildren) {
      regulatoryFrameworks += `\nINDUSTRY: No specific sector detected â€” apply horizontal AI and data privacy frameworks only. Flag any sector-specific regulations identified from use case context.\n`;
    }

    const systemPrompt = `You are a senior AI governance expert and program management leader. Evaluate this AI use case against the company profile provided.

${regulatoryFrameworks}

Return ONLY valid JSON, no markdown, no backticks:

{
  "use_case_name": "Short 3-5 word name",
  "recommendation": "Proceed" | "Proceed with Conditions" | "Do Not Proceed",
  "recommendation_summary": "2 sentence summary with clear reasoning",
  "thought_process": "2 sentences on key decision factors",
  "overall_score": 3.2,
  "overall_score_rationale": "1 sentence",
  "composite_score": 2.1,
  "composite_score_rationale": "1 sentence â€” this is the primary ranking metric",
  "category1_risk_feasibility": {
    "risk_score": "Low" | "Medium" | "High" | "Critical",
    "risk_numeric": 3,
    "risk_score_rationale": "1 sentence on harm if AI fails",
    "harm_types": ["Reputational", "Financial", "Physical", "Legal", "Operational"],
    "technical_feasibility": {
      "score": 3,
      "max": 5,
      "model_type_required": "Simple classification / NLP / Generative AI / Multi-modal / Agentic",
      "complexity_rationale": "1 sentence",
      "integration_assessment": "1 sentence"
    },
    "compliance_warnings": [
      {"flag": "Warning title", "category": "Data Privacy" | "Bias & Fairness" | "Human-in-the-Loop" | "Transparency" | "Security", "detail": "1 sentence"}
    ],
    "regulatory_requirements": [
      {"regulation": "Name", "jurisdiction": "Jurisdiction", "triggered_by": "1-3 words", "requirement": "1 sentence", "priority": "Must Have" | "Should Have" | "Monitor"}
    ],
    "compliance_burden": "Low" | "Medium" | "High",
    "compliance_burden_rationale": "1 sentence"
  },
  "category2_value_roi": {
    "roi_score": 4,
    "roi_score_max": 5,
    "business_value_assessment": "1 sentence on ROI realism",
    "time_savings": {"assessment": "1 sentence", "confidence": "High" | "Medium" | "Low"},
    "quality_error_reduction": {"assessment": "1 sentence", "compliance_impact": "1 sentence"},
    "automation_vs_augmentation": {"end_state": "Full Automation (Straight-Through Processing)" | "Augmentation (AI-Assisted Human)" | "Hybrid", "rationale": "1 sentence", "human_oversight_required": true},
    "value_risks": ["1 sentence risk"]
  },
  "category3_implementation": {
    "data_readiness": {"score": 3, "max": 5, "assessment": "1 sentence", "recommendation": "Use as-is" | "Needs cleaning" | "Consider RAG" | "Consider fine-tuning" | "Significant data work required", "rag_or_finetune_rationale": "1 sentence"},
    "change_management": {"complexity": "Low" | "Medium" | "High", "assessment": "1 sentence", "key_activities": ["Specific activity"]},
    "monitoring_assessment": {"score": 2, "max": 5, "assessment": "1 sentence", "gaps": ["Gap"]},
    "implementation_timeline_assessment": "1 sentence",
    "top_actions": [
      {"action": "Specific action", "priority": "Must Have" | "Should Have" | "Nice to Have"}
    ]
  },
  "input_quality": {
    "overall": "High" | "Medium" | "Low",
    "score_confidence": "High" | "Medium" | "Low",
    "flags": ["1 sentence describing a specific vague or missing input that reduces confidence"]
  }
}

Scoring:
- overall_score: weighted decimal 0-5 (technical_feasibility 15% + roi_score 20% + risk_numeric inverted Critical=1,High=2,Medium=3,Low=4 scaled to 5 at 20% + data_readiness 20% + monitoring 10% + compliance_burden inverted High=1,Medium=3,Low=5 at 15%)
- composite_score: roi_score minus (risk_numeric * 0.6) â€” primary ranking metric
- risk_numeric: Critical=1, High=2, Medium=3, Low=4
- input_quality.overall: High = business value quantified + data described + monitoring planned; Medium = some gaps; Low = vague inputs with little specificity
- input_quality.score_confidence: reflects how much the vagueness of inputs affects reliability of scores â€” High/Medium/Low
- input_quality.flags: max 2 items â€” only flag genuinely problematic vagueness, not nitpicks
- regulatory_requirements: max 4 items â€” most important only
- compliance_warnings: max 3 items
- harm_types: max 3 items
- value_risks: max 2 items
- key_activities: max 3 items
- gaps: max 2 items
- top_actions: max 3 items
- All text fields: 1 sentence maximum â€” be concise
- Return raw JSON only`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 2500,
        system: systemPrompt,
        messages: [{ role: 'user', content: `Evaluate this AI use case:\n\nCompany Profile:\n${companyProfile}\n\nUse Case:\n${useCase}` }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(500).json({ error: `API error ${response.status}: ${errText}` });
    }

    const data = await response.json();
    if (!data.content || data.content.length === 0) {
      return res.status(500).json({ error: 'Empty response from Claude' });
    }

    const text = data.content.filter(b => b.type === 'text').map(b => b.text).join('');
    const clean = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const jsonStart = clean.indexOf('{');
    const jsonEnd = clean.lastIndexOf('}');

    if (jsonStart === -1 || jsonEnd === -1) {
      return res.status(500).json({ error: 'No JSON found in response', raw: clean });
    }

    const result = JSON.parse(clean.substring(jsonStart, jsonEnd + 1));
    return res.status(200).json(result);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
