// Google Apps Script template para conectar el RSVP con Google Sheets.
// 1. Crea una hoja de cálculo en Google Sheets.
// 2. Ve a Extensiones > Apps Script.
// 3. Pega este archivo, cambia SPREADSHEET_ID y despliega como Web app.
// 4. Copia la URL del Web app en CONFIG.googleSheetsWebAppUrl dentro de app.js.

const SPREADSHEET_ID = 'PEGA_AQUI_EL_ID_DE_TU_GOOGLE_SHEET';
const SHEET_NAME = 'RSVP';

function doPost(event) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  const data = event.parameter;

  sheet.appendRow([
    new Date(),
    data.nombre || '',
    data.asistencia || '',
    data.restricciones_alimentarias || '',
    data.cancion_playlist || '',
    data.invitado_url || '',
    data.page_url || '',
    data.submitted_at || '',
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
