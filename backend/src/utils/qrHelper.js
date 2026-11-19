const QRCode = require('qrcode');

/**
 * Generates a Base64 Data URL QR Code representing the cinema boarding pass
 * @param {Object} payload Minimal ticket data (PNR, showtime, and booking ID)
 */
const generateTicketQR = async (payload) => {
  try {
    const qrData = JSON.stringify({
      pnr: payload.pnr,
      bookingId: payload.bookingId,
      screen: payload.screen,
      showDate: payload.showDate,
      showTime: payload.showTime,
      seats: payload.seats,
      venue: 'Cineplex, Airia Mall, Gurugram'
    });

    const qrDataURL = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H',
      margin: 2,
      color: {
        dark: '#0B0F17',
        light: '#FFFFFF'
      }
    });

    return qrDataURL;
  } catch (error) {
    console.error(`[QR Error] Failed to generate QR code: ${error.message}`);
    return '';
  }
};

module.exports = { generateTicketQR };