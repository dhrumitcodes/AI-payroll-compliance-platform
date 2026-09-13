import jsPDF from "jspdf";

export function generatePayslipPDF(slip) {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 48;
    const accent = [43, 76, 140]; // matches --color-accent (#2b4c8c)
    const ink = [26, 27, 30];
    const muted = [107, 109, 114];
    const border = [228, 228, 224];

    doc.setFillColor(...accent);
    doc.rect(margin, margin, 20, 20, "F");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text("Q", margin + 6, margin + 14);

    doc.setFontSize(13);
    doc.setTextColor(...ink);
    doc.setFont(undefined, "bold");
    doc.text("QuantumPay", margin + 28, margin + 15);

    doc.setFontSize(9);
    doc.setFont(undefined, "normal");
    doc.setTextColor(...muted);
    doc.text("Payroll & Compliance Platform", margin + 28, margin + 27);

    doc.setFontSize(10);
    doc.setTextColor(...muted);
    doc.text(`Pay period: ${slip.payPeriod || "—"}`, pageWidth - margin, margin + 15, { align: "right" });
    doc.text(
        `Issued: ${slip.processedAt ? new Date(slip.processedAt).toLocaleDateString() : "—"}`,
        pageWidth - margin,
        margin + 27,
        { align: "right" }
    );

    let y = margin + 60;
    doc.setDrawColor(...border);
    doc.line(margin, y, pageWidth - margin, y);
    y += 30;

    doc.setFontSize(16);
    doc.setTextColor(...ink);
    doc.setFont(undefined, "bold");
    doc.text("Payslip", margin, y);
    y += 28;

    // Employee details
    doc.setFontSize(9);
    doc.setTextColor(...muted);
    doc.setFont(undefined, "normal");
    doc.text("EMPLOYEE", margin, y);
    doc.text("EMPLOYEE ID", pageWidth / 2, y);
    y += 14;

    doc.setFontSize(11);
    doc.setTextColor(...ink);
    doc.setFont(undefined, "bold");
    doc.text(slip.employeeName || "—", margin, y);
    doc.text(String(slip.employeeId ?? "—"), pageWidth / 2, y);
    y += 34;

    doc.setDrawColor(...border);
    doc.line(margin, y, pageWidth - margin, y);
    y += 30;

    // Earnings / deductions table
    const rows = [
        ["Gross pay", slip.grossPay],
        ["Total deductions", -(slip.totalDeductions || 0)],
    ];

    doc.setFontSize(9);
    doc.setTextColor(...muted);
    doc.text("DESCRIPTION", margin, y);
    doc.text("AMOUNT", pageWidth - margin, y, { align: "right" });
    y += 12;
    doc.line(margin, y, pageWidth - margin, y);
    y += 20;

    doc.setFontSize(11);
    rows.forEach(([label, amount]) => {
        doc.setTextColor(...ink);
        doc.setFont(undefined, "normal");
        doc.text(label, margin, y);
        doc.setTextColor(amount < 0 ? 179 : 26, amount < 0 ? 38 : 27, amount < 0 ? 30 : 30);
        doc.text(
            `${amount < 0 ? "-" : ""}Rs. ${Math.abs(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            pageWidth - margin,
            y,
            { align: "right" }
        );
        y += 22;
    });

    y += 8;
    doc.line(margin, y, pageWidth - margin, y);
    y += 26;

    doc.setFillColor(234, 240, 250);
    doc.roundedRect(margin, y - 18, pageWidth - margin * 2, 40, 4, 4, "F");
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.setTextColor(...ink);
    doc.text("Net pay", margin + 16, y + 6);
    doc.setTextColor(...accent);
    doc.text(
        `Rs. ${(slip.netPay || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        pageWidth - margin - 16,
        y + 6,
        { align: "right" }
    );

    doc.setFontSize(8);
    doc.setFont(undefined, "normal");
    doc.setTextColor(...muted);
    doc.text(
        "This is a system-generated payslip and does not require a signature.",
        margin,
        doc.internal.pageSize.getHeight() - 40
    );

    const fileName = `payslip-${(slip.employeeName || "employee").replace(/\s+/g, "-").toLowerCase()}-${slip.payPeriod || "period"}.pdf`;
    doc.save(fileName);
}
