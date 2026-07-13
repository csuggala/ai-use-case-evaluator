export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { companyProfile, useCase } = req.body;

    const systemPrompt = `You are a senior AI governance expert and program management leader. Evaluate this AI use case in the context of the company profile provided. Return a structured assessment.

REGULATORY FRAMEWORK â€” apply based on industry, geography, decision type, user population:

HORIZONTAL AI FRAMEWORKS:
- EU AI Act: Unacceptable Risk (prohibited) | High Risk (recruitment, credit, critical infrastructure, healthcare diagnostics, education) | Limited Risk (chatbots) | Minimal Risk
- California CCPA Automated Decision-Making: consumer decisions â†’ pre-use notice + opt-out
- California AB 2013 & SB 942: generative AI â†’ training data docs + watermarking
- Colorado AI Act SB 189: consequential decisions in housing/employment/education/banking
- Illinois BIPA: biometric data collection

DATA PRIVACY: GDPR (EU residents), CCPA/CPRA (California), PIPEDA (Canada), LGPD (Brazil)

INDUSTRY-SPECIFIC:
- Healthcare: HIPAA, FDA Mobile Medical App, 21st Century Cures Act
- Finance/Banking: PCI DSS 4.0, SEC Rules, FCRA, ECOA, BSA/AML, OCC SR 11-7
- Insurance: NAIC Model Bulletin, state actuarial approval
- HR/Recruitment: EEOC Guidelines, NYC Local Law 144, Illinois AI Video Interview Act
- Real Estate: Fair Housing Act, Colorado AI Act SB 189, HMDA
- Education: FERPA, COPPA, EU AI Act High Risk
- Technology/SaaS: SOC 2 Type II, ISO 27001, NIST AI RMF, DMCA/Copyright
- Pharmaceutical: FDA 21 CFR Part 11, GxP, ICH E6
- Energy/Utilities: NERC CIP, FERC
- Telecommunications: FCC, CPNI, TRACED Act
- Defense/Aerospace: ITAR, CMMC, DoD AI Ethics, EAR
- Government: FedRAMP, FISMA, Section 508, OMB M-24-10
- Legal: ABA Model Rules, attorney-client privilege, FRCP eDiscovery
- Retail/E-commerce: FTC Act Section 5, ADA/WCAG, PCI DSS
- Manufacturing: EU Machinery Regulation, ISO 9001, OSHA
- Non-profit: IRS Form 990, donor privacy, grant compliance
- Children's Apps: COPPA, KOSA, UK Age Appropriate Design Code

Return ONLY valid JSON, no markdown, no backticks:

{
  "use_case_name": "Short 3-5 word name for this use case",
  "recommendation": "Proceed" | "Proceed with Conditions" | "Do Not Proceed",
  "recommendation_summary": "2 sentence summary with clear reasoning",
  "thought_process": "2-3 sentences on evaluation logic and key decision factors",
  "overall_score": 3.2,
  "overall_score_rationale": "1 sentence explaining the score",
  "composite_score": 2.1,
  "composite_score_rationale": "1-2 sentences on value minus risk composite â€” this is the primary ranking metric",

  "category1_risk_feasibility": {
    "risk_score": "Low" | "Medium" | "High" | "Critical",
    "risk_numeric": 3,
    "risk_score_rationale": "2 sentences on harm potential if AI fails or hallucinates",
    "harm_types": ["Reputational", "Financial", "Physical", "Legal", "Operational"],
    "technical_feasibility": {
      "score": 3,
      "max": 5,
      "model_type_required": "Simple classification / NLP / Generative AI / Multi-modal / Agentic",
      "complexity_rationale": "2 sentences on model complexity and integration",
      "integration_assessment": "2 sentences on systems and difficulty"
    },
    "compliance_warnings": [
      {"flag": "Warning title", "category": "Data Privacy" | "Bias & Fairness" | "Human-in-the-Loop" | "Transparency" | "Security", "detail": "2 sentence explanation"}
    ],
    "regulatory_requirements": [
      {"regulation": "Name", "jurisdiction": "Jurisdiction", "triggered_by": "What triggered this", "applicability": "Why it applies", "requirement": "What must be done", "priority": "Must Have" | "Should Have" | "Monitor"}
    ],
    "compliance_burden": "Low" | "Medium" | "High",
    "compliance_burden_rationale": "2 sentences on compliance burden and investment"
  },

  "category2_value_roi": {
    "roi_score": 4,
    "roi_score_max": 5,
    "business_value_assessment": "2 sentences on whether value is realistic and ROI justifies investment",
    "time_savings": {
      "assessment": "2 sentences on labor-hour reductions vs current approach",
      "confidence": "High" | "Medium" | "Low"
    },
    "quality_error_reduction": {
      "assessment": "2 sentences on projected error/rework reduction",
      "compliance_impact": "1 sentence on compliance impact"
    },
    "automation_vs_augmentation": {
      "end_state": "Full Automation (Straight-Through Processing)" | "Augmentation (AI-Assisted Human)" | "Hybrid",
      "rationale": "2 sentences on end-state classification",
      "human_oversight_required": true
    },
    "value_risks": ["Risk that could erode projected value"]
  },

  "category3_implementation": {
    "data_readiness": {
      "score": 3,
      "max": 5,
      "assessment": "2 sentences on data quality and fitness",
      "recommendation": "Use as-is" | "Needs cleaning" | "Consider RAG" | "Consider fine-tuning" | "Significant data work required",
      "rag_or_finetune_rationale": "2 sentences on RAG or fine-tuning recommendation"
    },
    "change_management": {
      "complexity": "Low" | "Medium" | "High",
      "assessment": "2 sentences on training and workflow adjustment",
      "key_activities": ["Specific activity", "Specific activity"]
    },
    "monitoring_assessment": {
      "score": 2,
      "max": 5,
      "assessment": "2 sentences on monitoring plan",
      "gaps": ["Monitoring gap"]
    },
    "implementation_timeline_assessment": "2 sentences on timeline and budget realism",
    "top_actions": [
      {"action": "Specific action with owner and timeline", "priority": "Must Have" | "Should Have" | "Nice to Have"}
    ]
  }
}

Scoring rules:
- overall_score: weighted decimal 0-5 (technical_feasibility 15% + roi_score 20% + risk_numeric inverted where Critical=1,High=2,Medium=3,Low=4 â€” scaled to 5 â€” 20% + data_readiness 20% + monitoring 10% + compliance_burden inverted High=1,Medium=3,Low=5 â€” 15%)
- composite_score: roi_score minus (risk_numeric * 0.6) â€” higher is better, range roughly -3 to +5 â€” this is the PRIMARY RANKING METRIC
- risk_numeric: Critical=1, High=2, Medium=3, Low=4
- Return raw JSON only`;

    const userContent = `Company Profile:
${companyProfile}

Use Case to Evaluate:
${useCase}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: 'user', content: userContent }]
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
