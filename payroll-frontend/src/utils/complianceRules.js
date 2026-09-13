/**
 * Statutory compliance rules engine.
 *
 * These are SIMPLIFIED, illustrative Indian statutory thresholds for a
 * student/demo project — not verified tax advice. Real payroll software
 * needs CA-verified figures, and Professional Tax in particular varies
 * by state (this uses one generic slab as a placeholder).
 */

export function evaluateEPF(basicSalary) {
    const APPLICABLE_THRESHOLD = 15000; // Basic+DA ceiling for mandatory EPF
    const applicable = basicSalary <= APPLICABLE_THRESHOLD;
    const employeeContribution = applicable ? Math.round(basicSalary * 0.12) : 0;
    const employerContribution = applicable ? Math.round(basicSalary * 0.12) : 0;

    return {
        id: "epf",
        label: "Provident Fund (EPF)",
        applicable,
        pass: true, // informational — EPF applicability itself isn't a failure state
        detail: applicable
            ? `Mandatory — basic salary (₹${basicSalary.toLocaleString()}) is at or below the ₹${APPLICABLE_THRESHOLD.toLocaleString()} ceiling.`
            : `Not mandatory — basic salary exceeds the ₹${APPLICABLE_THRESHOLD.toLocaleString()} ceiling (employer may still opt in).`,
        employeeContribution,
        employerContribution,
    };
}

export function evaluateESI(grossSalary) {
    const APPLICABLE_THRESHOLD = 21000; // Gross monthly wage ceiling for ESI
    const applicable = grossSalary <= APPLICABLE_THRESHOLD;
    const employeeContribution = applicable ? Math.round(grossSalary * 0.0075) : 0;
    const employerContribution = applicable ? Math.round(grossSalary * 0.0325) : 0;

    return {
        id: "esi",
        label: "Employee State Insurance (ESI)",
        applicable,
        pass: true,
        detail: applicable
            ? `Applicable — gross salary (₹${grossSalary.toLocaleString()}) is at or below the ₹${APPLICABLE_THRESHOLD.toLocaleString()} ceiling.`
            : `Not applicable — gross salary exceeds the ₹${APPLICABLE_THRESHOLD.toLocaleString()} ceiling.`,
        employeeContribution,
        employerContribution,
    };
}

export function evaluateProfessionalTax(grossSalary) {
    // Generic placeholder slab — real value depends on the employee's state.
    const amount = grossSalary > 15000 ? 200 : 0;
    return {
        id: "pt",
        label: "Professional Tax",
        applicable: amount > 0,
        pass: true,
        detail: amount > 0
            ? `₹${amount}/month applicable under the default slab (state-specific rules may differ).`
            : "No Professional Tax applicable under the default slab for this gross salary.",
        employeeContribution: amount,
        employerContribution: 0,
    };
}

export function evaluateTDS(annualGross) {
    // Simplified new-regime-style slabs with a flat standard deduction.
    const STANDARD_DEDUCTION = 75000;
    const taxable = Math.max(0, annualGross - STANDARD_DEDUCTION);

    const slabs = [
        { upTo: 300000, rate: 0 },
        { upTo: 600000, rate: 0.05 },
        { upTo: 900000, rate: 0.10 },
        { upTo: 1200000, rate: 0.15 },
        { upTo: 1500000, rate: 0.20 },
        { upTo: Infinity, rate: 0.30 },
    ];

    let remaining = taxable;
    let lastCap = 0;
    let annualTax = 0;

    for (const slab of slabs) {
        if (remaining <= 0) break;
        const band = Math.min(remaining, slab.upTo - lastCap);
        annualTax += band * slab.rate;
        remaining -= band;
        lastCap = slab.upTo;
    }

    const monthlyTDS = Math.round(annualTax / 12);

    return {
        id: "tds",
        label: "Income Tax (TDS)",
        applicable: monthlyTDS > 0,
        pass: true,
        detail: monthlyTDS > 0
            ? `Estimated ₹${monthlyTDS.toLocaleString()}/month TDS on an annualized gross of ₹${annualGross.toLocaleString()}.`
            : `No TDS liability — annualized gross of ₹${annualGross.toLocaleString()} falls within the exempt band.`,
        employeeContribution: monthlyTDS,
        employerContribution: 0,
    };
}

export function evaluateDocuments(docs) {
    const required = [
        { key: "pan", label: "PAN card" },
        { key: "aadhaar", label: "Aadhaar" },
        { key: "bankDetails", label: "Bank account details" },
        { key: "taxDeclaration", label: "Tax exemption declaration" },
    ];

    const missing = required.filter((r) => !docs[r.key]);

    return {
        id: "documents",
        label: "Document verification",
        applicable: true,
        pass: missing.length === 0,
        detail:
            missing.length === 0
                ? "All required documents are on file."
                : `Missing: ${missing.map((m) => m.label).join(", ")}.`,
        missing,
    };
}

/**
 * Runs the full evaluation and returns a structured report.
 * input: { basicSalary, grossSalary, docs: { pan, aadhaar, bankDetails, taxDeclaration } }
 */
export function runComplianceEvaluation(input) {
    const { basicSalary, grossSalary, docs } = input;
    const annualGross = grossSalary * 12;

    const checks = [
        evaluateEPF(basicSalary),
        evaluateESI(grossSalary),
        evaluateProfessionalTax(grossSalary),
        evaluateTDS(annualGross),
        evaluateDocuments(docs),
    ];

    const failedChecks = checks.filter((c) => c.pass === false);
    const riskScore = Math.round((failedChecks.length / checks.length) * 100) / 10; // 0–10 scale
    const totalMonthlyDeductions = checks.reduce(
        (sum, c) => sum + (c.employeeContribution || 0),
        0
    );

    return {
        complianceStatus: failedChecks.length === 0 ? "COMPLIANT" : "NON_COMPLIANT",
        riskScore,
        checks,
        totalMonthlyDeductions,
        evaluatedAt: new Date().toISOString(),
    };
}
