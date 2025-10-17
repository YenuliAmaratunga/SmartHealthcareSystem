import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// existing single-shot kept as-is…

export async function exportSectionsToPdf({ ids = [], title = "Analytics Report", meta = {} }) {
  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 36;
  const gap = 16;

  const ts = new Date().toLocaleString();
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.text(title, margin, margin);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  const metaLine = [
    meta.from ? `From: ${meta.from}` : null,
    meta.to ? `To: ${meta.to}` : null,
    `Generated: ${ts}`
  ].filter(Boolean).join("  •  ");
  pdf.text(metaLine, margin, margin + 16);

  let y = margin + 36;

  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el) continue;

    // wait a tick in case a chart has just mounted
    // eslint-disable-next-line no-await-in-loop
    await new Promise(r => setTimeout(r, 50));

    // eslint-disable-next-line no-await-in-loop
    const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#fff" });
    const img = canvas.toDataURL("image/png");

    const targetW = pageW - margin * 2;
    const targetH = (canvas.height * targetW) / canvas.width;

    if (y + targetH > pageH - margin) {
      pdf.addPage();
      y = margin;
    }

    pdf.addImage(img, "PNG", margin, y, targetW, targetH, undefined, "FAST");
    y += targetH + gap;
  }

  return pdf.output("dataurlstring");
}
