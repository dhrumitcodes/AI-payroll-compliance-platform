import jsPDF from "jspdf";

// Same simplified progressive slabs used in complianceRules.js's TDS check,
// duplicated here in annual (not monthly) form for this document.
function computeAnnualTax(annualGross) {
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
    let remaining = taxable, lastCap = 0, tax = 0;
    for (const slab of slabs) {
        if (remaining <= 0) break;
        const band = Math.min(remaining, slab.upTo - lastCap);
        tax += band * slab.rate;
        remaining -= band;
        lastCap = slab.upTo;
    }
    return { taxable, tax: Math.round(tax) };
}

/**
 * Generates a SIMPLIFIED, educational Form-16-style annual tax summary.
 * This is NOT a legally filable Form 16 -- a real one requires a TAN,
 * TRACES-generated certificate numbers, section-wise 80C/80D deduction
 * breakdowns, and quarterly TDS deposit challan references that this
 * project doesn't model. It's built for demo/presentation purposes.
 */
export function generateForm16PDF({ employee, company, financialYear, annualGross }) {
    const { taxable, tax } = computeAnnualTax(annualGross);
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 48;
    const accent = [43, 76, 140];
    const ink = [26, 27, 30];
    const muted = [107, 109, 114];

    doc.setFillColor(...accent);
    doc.rect(margin, margin, 20, 20, "F");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text("Q", margin + 6, margin + 14);

    doc.setFontSize(13);
    doc.setTextColor(...ink);
    doc.setFont(undefined, "bold");
    doc.text(company?.name || "QuantumPay", margin + 28, margin + 15);

    doc.setFontSize(8);
    doc.setFont(undefined, "normal");
    doc.setTextColor(220, 38, 38);
    doc.text("SIMPLIFIED / EDUCATIONAL SUMMARY -- NOT A LEGALLY FILABLE FORM 16", margin + 28, margin + 27);

    let y = margin + 55;
    doc.setDrawColor(228, 228, 224);
    doc.line(margin, y, pageWidth - margin, y);
    y += 30;

    doc.setFontSize(16);
    doc.setTextColor(...ink);
    doc.setFont(undefined, "bold");
    doc.text(`Form 16 Summary -- FY ${financialYear}`, margin, y);
    y += 30;

    doc.setFontSize(9);
    doc.setTextColor(...muted);
    doc.setFont(undefined, "normal");
    doc.text("EMPLOYEE", margin, y);
    doc.text("PAN", pageWidth / 2, y);
    y += 14;
    doc.setFontSize(11);
    doc.setTextColor(...ink);
    doc.setFont(undefined, "bold");
    doc.text(`${employee.firstName} ${employee.lastName}`, margin, y);
    doc.text(employee.panNumber || "—", pageWidth / 2, y);
    y += 34;

    doc.setDrawColor(228, 228, 224);
    doc.line(margin, y, pageWidth - margin, y);
    y += 30;

    const rows = [
        ["Gross salary (annual)", annualGross],
        ["Standard deduction", -75000],
        ["Taxable income", taxable],
        ["Tax computed on total income", tax],
    ];

    doc.setFontSize(9);
    doc.setTextColor(...muted);
    doc.text("PARTICULARS", margin, y);
    doc.text("AMOUNT (Rs.)", pageWidth - margin, y, { align: "right" });
    y += 12;
    doc.line(margin, y, pageWidth - margin, y);
    y += 20;

    doc.setFontSize(11);
    rows.forEach(([label, amount], i) => {
        doc.setFont(undefined, i === rows.length - 1 ? "bold" : "normal");
        doc.setTextColor(...ink);
        doc.text(label, margin, y);
        doc.text(
            `${amount < 0 ? "-" : ""}${Math.abs(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            pageWidth - margin, y, { align: "right" }
        );
        y += 22;
    });

    y += 30;
    doc.setFontSize(8);
    doc.setFont(undefined, "normal");
    doc.setTextColor(...muted);
    doc.text(
        "This summary uses simplified new-regime-style slabs for demonstration purposes only.",
        margin, doc.internal.pageSize.getHeight() - 54
    );
    doc.text(
        "A statutory Form 16 requires employer TAN, TRACES certificate numbers, and section-wise deduction detail not modeled here.",
        margin, doc.internal.pageSize.getHeight() - 42
    );

    doc.save(`form16-summary-${employee.firstName}-${financialYear}.pdf`);
}
