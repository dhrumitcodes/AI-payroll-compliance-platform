import jsPDF from "jspdf";

/**
 * Generates an INTERNAL quarterly payroll summary from a set of processed
 * payslips. This is NOT an official statutory filing (e.g. Form 24Q) --
 * a real one requires challan-level TDS deposit references and a specific
 * government-prescribed schema this project doesn't model. Built for
 * demo/presentation purposes as an internal management report.
 */
export function generateQuarterlyReportPDF({ company, quarterLabel, payslips }) {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 48;
    const accent = [43, 76, 140];
    const ink = [26, 27, 30];
    const muted = [107, 109, 114];

    const totalGross = payslips.reduce((s, p) => s + Number(p.grossPay || 0), 0);
    const totalDeductions = payslips.reduce((s, p) => s + Number(p.totalDeductions || 0), 0);
    const totalNet = payslips.reduce((s, p) => s + Number(p.netPay || 0), 0);

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
    doc.text("INTERNAL SUMMARY -- NOT AN OFFICIAL STATUTORY FILING", margin + 28, margin + 27);

    let y = margin + 55;
    doc.setDrawColor(228, 228, 224);
    doc.line(margin, y, pageWidth - margin, y);
    y += 30;

    doc.setFontSize(16);
    doc.setTextColor(...ink);
    doc.setFont(undefined, "bold");
    doc.text(`Quarterly Payroll Summary -- ${quarterLabel}`, margin, y);
    y += 30;

    const totals = [
        ["Employees paid", payslips.length],
        ["Total gross pay", `Rs. ${totalGross.toLocaleString()}`],
        ["Total deductions", `Rs. ${totalDeductions.toLocaleString()}`],
        ["Total net pay", `Rs. ${totalNet.toLocaleString()}`],
    ];

    doc.setFontSize(10);
    totals.forEach(([label, value]) => {
        doc.setTextColor(...muted);
        doc.setFont(undefined, "normal");
        doc.text(label, margin, y);
        doc.setTextColor(...ink);
        doc.setFont(undefined, "bold");
        doc.text(String(value), pageWidth - margin, y, { align: "right" });
        y += 20;
    });

    y += 15;
    doc.setDrawColor(228, 228, 224);
    doc.line(margin, y, pageWidth - margin, y);
    y += 25;

    doc.setFontSize(9);
    doc.setTextColor(...muted);
    doc.text("EMPLOYEE", margin, y);
    doc.text("PERIOD", margin + 180, y);
    doc.text("NET PAY", pageWidth - margin, y, { align: "right" });
    y += 14;
    doc.line(margin, y, pageWidth - margin, y);
    y += 18;

    doc.setFontSize(10);
    payslips.forEach((slip) => {
        if (y > pageHeight - 80) {
            doc.addPage();
            y = margin;
        }
        doc.setTextColor(...ink);
        doc.setFont(undefined, "normal");
        doc.text(slip.employeeName || "—", margin, y);
        doc.text(slip.payPeriod || "—", margin + 180, y);
        doc.text(`Rs. ${Number(slip.netPay || 0).toLocaleString()}`, pageWidth - margin, y, { align: "right" });
        y += 18;
    });

    doc.setFontSize(8);
    doc.setTextColor(...muted);
    doc.text(
        "Generated from processed payslip records for this period. Does not include challan/TAN-level TDS deposit detail.",
        margin, pageHeight - 40
    );

    doc.save(`quarterly-summary-${quarterLabel.replace(/\s+/g, "-").toLowerCase()}.pdf`);
}
