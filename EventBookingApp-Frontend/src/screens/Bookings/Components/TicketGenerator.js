import jsPDF from "jspdf";
import QRCode from "qrcode";

const GenerateTicketPdf = async (booking) => {
  try {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a6",
    });

    const docWidth = doc.internal.pageSize.getWidth();
    const docHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    const stubWidth = 50;
    const mainContentWidth = docWidth - stubWidth - margin * 2;

    // --- Colors & Fonts ---
    const darkBlue = "#1A2C5B";
    const primaryColor = darkBlue;
    const headingColor = "#1a1a1a";
    const textColor = "#333333";
    const lightTextColor = "#ffffff";
    const dividerColor = "#dddddd";

    doc.setFont("helvetica");

    // --- Main Ticket Body (Left Side) ---

    // Header with Eventify brand
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor);
    doc.text("Eventify", margin, 15);

    // Event Title
    const eventTitleStartY = 25;
    doc.setFontSize(13);
    doc.setTextColor(headingColor);
    doc.setFont("helvetica", "bold");
    const eventTitleLines = doc.splitTextToSize(
      booking.event,
      mainContentWidth - 5
    );
    doc.text(eventTitleLines, margin, eventTitleStartY);

    const afterTitleY = eventTitleStartY + eventTitleLines.length * 5 + 5;

    // Draw a subtle horizontal line for visual separation
    doc.setDrawColor(dividerColor);
    doc.line(margin, afterTitleY, margin + mainContentWidth, afterTitleY);

    // Booking Details
    let currentY = afterTitleY + 8;
    doc.setFontSize(9);
    doc.setTextColor(textColor);
    doc.setFont("helvetica", "normal");

    doc.text("BOOKING ID:", margin, currentY);
    doc.setFont("helvetica", "bold");
    doc.text(booking.id.substring(0, 18).toUpperCase(), margin, currentY + 4);
    currentY += 10;

    doc.setFont("helvetica", "normal");
    doc.text("BOOKED ON:", margin, currentY);
    doc.setFont("helvetica", "bold");
    doc.text(booking.bookedOn, margin, currentY + 4);
    currentY += 10;

    doc.setFont("helvetica", "normal");
    doc.text("SEATS:", margin, currentY);
    doc.setFont("helvetica", "bold");
    doc.text(String(booking.seats), margin, currentY + 4);
    currentY += 10;

    doc.setFont("helvetica", "normal");
    doc.text("AMOUNT PAID:", margin, currentY);
    doc.setFont("helvetica", "bold");
    doc.text(`₹${booking.amount.toFixed(2)}`, margin, currentY + 4);
    currentY += 10;

    doc.setFont("helvetica", "normal");
    doc.text("STATUS:", margin, currentY);
    doc.setFont("helvetica", "bold");
    doc.text(booking.status, margin, currentY + 4);

    // --- Ticket Stub (Right Side) ---
    const stubX = docWidth - stubWidth;

    // Draw a decorative background for the stub
    doc.setFillColor(primaryColor);
    doc.rect(stubX, 0, stubWidth, docHeight, "F");

    // Draw a dashed line to separate the stub clearly
    doc.setLineDashPattern([2, 1.5], 0);
    doc.setDrawColor(dividerColor);
    doc.line(stubX, margin, stubX, docHeight - margin);
    doc.setLineDashPattern([], 0);

    // QR Code - Centered within the stub
    const qrCodeSize = 38;
    const qrCodeX = stubX + stubWidth / 2 - qrCodeSize / 2;
    const qrCodeY = 12;
    const qrData = JSON.stringify({
      bookingId: booking.id,
      event: booking.event,
      seats: booking.seats,
    });
    const qrCodeUrl = await QRCode.toDataURL(qrData, { width: 128 });
    doc.addImage(qrCodeUrl, "PNG", qrCodeX, qrCodeY, qrCodeSize, qrCodeSize);

    // Add "Scan Me" text below QR code, centered
    doc.setFontSize(9);
    doc.setTextColor(lightTextColor);
    doc.setFont("helvetica", "bold");
    doc.text("SCAN AT ENTRY", stubX + stubWidth / 2, qrCodeY + qrCodeSize + 5, {
      align: "center",
    });

    // Add event details on the stub (Date and Time, Location)
    let stubDetailsY = qrCodeY + qrCodeSize + 15;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(lightTextColor);

    // Date & Time
    doc.setFont("helvetica", "bold");
    const dateTextLines = doc.splitTextToSize(
      booking.date,
      stubWidth - margin * 2
    );
    doc.text(dateTextLines, stubX + stubWidth / 2, stubDetailsY, {
      align: "center",
    });
    stubDetailsY += dateTextLines.length * 3.5 + 3; // Line height + small gap

    // Location
    doc.setFont("helvetica", "normal");
    const locationTextLines = doc.splitTextToSize(
      booking.location || "Venue Not Specified",
      stubWidth - margin * 2
    );
    doc.text(locationTextLines, stubX + stubWidth / 2, stubDetailsY, {
      align: "center",
    });

    // --- Footer (Instructions) ---
    doc.setFontSize(6);
    doc.setTextColor(textColor);
    doc.text(
      "This ticket is non-transferable and admits one person per seat. Please present this digital ticket at the entrance.",
      margin,
      docHeight - 8
    );
    doc.text("All rights reserved by Eventify © 2025.", margin, docHeight - 5);

    // --- Download the PDF ---
    const fileName = `Ticket-Eventify-${booking.id.substring(0, 8)}.pdf`;
    doc.save(fileName);
  } catch (err) {
    console.error("Error generating PDF ticket:", err);
  }
};

export default GenerateTicketPdf;
