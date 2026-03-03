// ============================================================
// Google Apps Script - วางโค้ดนี้ใน Google Apps Script Editor
// ============================================================
// วิธีใช้:
// 1. ไปที่ https://script.google.com และสร้างโปรเจกต์ใหม่
// 2. วางโค้ดนี้ทั้งหมดแทนที่โค้ดเดิม
// 3. คลิก "Deploy" > "New deployment"
// 4. เลือก Type = "Web app"
// 5. ตั้งค่า Execute as = "Me", Who has access = "Anyone"
// 6. คลิก "Deploy" แล้วคัดลอก URL ที่ได้
// 7. นำ URL ไปวางแทนที่ GOOGLE_SHEETS_URL ในไฟล์ app.js
// ============================================================

const SHEET_NAME = 'Bookings';
const CANCEL_SHEET_NAME = 'Cancellations';

// TODO: ใส่อีเมลที่ต้องการรับแจ้งเตือน (สามารถใส่หลายอีเมลคั่นด้วย , ได้)
const NOTIFY_EMAIL = 'alongkornarsa9999@gmail.com';

// แปลงวันที่ให้เป็นรูปแบบ string ตรงๆ สำหรับเปรียบเทียบ
// รองรับทั้ง Date object จาก Google Sheets และ string จากเว็บ (flatpickr ส่ง d/m/Y)
function normalizeDate(val) {
  if (!val) return '';
  // ถ้าเป็น Date object (Google Sheets อาจแปลงให้อัตโนมัติ)
  if (Object.prototype.toString.call(val) === '[object Date]' && !isNaN(val.getTime())) {
    var y = val.getFullYear();
    var m = ('0' + (val.getMonth() + 1)).slice(-2);
    var d = ('0' + val.getDate()).slice(-2);
    return d + '/' + m + '/' + y;
  }
  // ถ้าเป็น string — ลบ ' นำหน้า (ถ้ามี) แล้ว trim
  var s = String(val).replace(/^'/, '').trim();
  // รูปแบบ DD/MM/YYYY หรือ D/M/YYYY — normalize ให้เป็น DD/MM/YYYY
  var slashMatch = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    return ('0' + slashMatch[1]).slice(-2) + '/' + ('0' + slashMatch[2]).slice(-2) + '/' + slashMatch[3];
  }
  // รูปแบบ YYYY-MM-DD — แปลงเป็น DD/MM/YYYY
  var isoMatch = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    return ('0' + isoMatch[3]).slice(-2) + '/' + ('0' + isoMatch[2]).slice(-2) + '/' + isoMatch[1];
  }
  // fallback: ลอง parse เป็น Date
  var parsed = new Date(s);
  if (!isNaN(parsed.getTime())) {
    var y2 = parsed.getFullYear();
    var m2 = ('0' + (parsed.getMonth() + 1)).slice(-2);
    var d2 = ('0' + parsed.getDate()).slice(-2);
    return d2 + '/' + m2 + '/' + y2;
  }
  return s;
}

function doPost(e) {
  try {
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);

    const data = JSON.parse(e.postData.contents);

    // แยกประเภท: booking หรือ cancellation
    if (data.type === 'cancellation') {
      const result = handleCancellation(data);
      lock.releaseLock();
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // === Booking ===
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.getRange(1, 1, 1, 10).setValues([[
        'Timestamp', 'คิวที่', 'ชื่อผู้จอง', 'เบอร์โทร', 'Email',
        'วันที่จอง', 'จำนวนคน', 'ช่วงเวลา (เช้า/บ่าย)', 'รอบเวลา', 'ยอดรวม (บาท)', 'หมายเหตุ'
      ]]);
      const headerRange = sheet.getRange(1, 1, 1, 10);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#F97316');
      headerRange.setFontColor('#FFFFFF');
      sheet.setFrozenRows(1);
      sheet.setColumnWidths(1, 1, 180);
      sheet.setColumnWidths(2, 1, 80);
      sheet.setColumnWidths(3, 1, 150);
      sheet.setColumnWidths(4, 1, 120);
      sheet.setColumnWidths(5, 1, 180);
      sheet.setColumnWidths(6, 1, 120);
      sheet.setColumnWidths(7, 1, 100);
      sheet.setColumnWidths(8, 1, 130);
      sheet.setColumnWidths(9, 1, 200);
      sheet.setColumnWidths(10, 1, 120);
    }

    // คำนวณคิวที่ (เริ่มที่ 1 ต่อวัน)
    // นับจำนวนการจองในแต่ละวันที่เดียวกัน เพื่อกำหนดคิวที่
    // ลำดับ: คิวที่ 1-8 = รอบเช้า, คิวที่ 9-16 = รอบบ่าย
    let queueNumber = 1;
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const allDates = sheet.getRange(2, 6, lastRow - 1, 1).getDisplayValues();
      let morningCount = 0;
      let afternoonCount = 0;
      const targetDate = String(data.date || '').trim();
      const targetTimeSlot = data.timeSlotMain || '';
      
      for (let i = 0; i < allDates.length; i++) {
        const cellDate = String(allDates[i][0]).replace(/^'/, '').trim();
        const cellTimeSlot = String(allDates[i][5] || '').trim();
        
        if (cellDate === targetDate) {
          if (targetTimeSlot === 'morning' && (cellTimeSlot === 'รอบเช้า' || cellTimeSlot === 'Morning')) {
            morningCount++;
          } else if (targetTimeSlot === 'afternoon' && (cellTimeSlot === 'รอบบ่าย' || cellTimeSlot === 'Afternoon')) {
            afternoonCount++;
          }
        }
      }
      
      // กำหนดคิวที่ตามช่วงเวลาที่เลือก
      if (targetTimeSlot === 'morning') {
        queueNumber = morningCount + 1;
      } else if (targetTimeSlot === 'afternoon') {
        queueNumber = afternoonCount + 1;
      } else {
        queueNumber = morningCount + afternoonCount + 1;
      }
      console.log('DEBUG queue: target=' + targetDate + ', timeSlot=' + targetTimeSlot + ', morning=' + morningCount + ', afternoon=' + afternoonCount + ', queue=' + queueNumber);
    }

    const timestamp = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });

    const newRow = lastRow + 1;
    // บังคับเก็บวันที่เป็น text (ใส่ ' นำหน้า) เพื่อไม่ให้ Sheets แปลงรูปแบบ
    const dateText = data.date ? "'" + String(data.date).trim() : '';
    sheet.getRange(newRow, 1, 1, 10).setValues([[
      timestamp,
      queueNumber,
      data.name || '',
      data.phone || '',
      data.email || '',
      dateText,
      data.guestCount || '',
      data.timeSlotMain || '',
      data.timeDetail || '',
      data.totalPrice || '',
      data.note || ''
    ]]);

    // ถ้ามี slipUrl ให้แสดงรูป thumbnail + hyperlink ใน cell
    if (slipUrl && slipFileId) {
      const thumbUrl = 'https://drive.google.com/thumbnail?id=' + slipFileId + '&sz=w200';
      sheet.getRange(newRow, 13).setFormula('=HYPERLINK("' + slipUrl + '",IMAGE("' + thumbUrl + '"))');
      sheet.setRowHeight(newRow, 80);
    } else if (slipUrl) {
      sheet.getRange(newRow, 13).setFormula('=HYPERLINK("' + slipUrl + '","ดูสลิป")');
    }

    SpreadsheetApp.flush();
    lock.releaseLock();

    sendBookingNotification(data, queueNumber, timestamp, slipUrl, slipFileId);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', queue: queueNumber }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================================
// บันทึกสลิปลง Google Drive
// ============================================================
function saveSlipToDrive(base64Data, fileName, customerName) {
  try {
    // หาหรือสร้างโฟลเดอร์เก็บสลิป
    let folders = DriveApp.getFoldersByName(SLIP_FOLDER_NAME);
    let folder;
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(SLIP_FOLDER_NAME);
    }

    // แปลง base64 เป็น blob
    const mimeMatch = base64Data.match(/^data:(.*?);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const base64Content = base64Data.replace(/^data:.*?;base64,/, '');
    const blob = Utilities.newBlob(Utilities.base64Decode(base64Content), mimeType);

    // ตั้งชื่อไฟล์: ชื่อลูกค้า_วันที่เวลา.นามสกุล
    const ext = fileName.split('.').pop() || 'jpg';
    const timestamp = Utilities.formatDate(new Date(), 'Asia/Bangkok', 'yyyyMMdd_HHmmss');
    const safeName = customerName.replace(/[^a-zA-Z0-9ก-๙]/g, '_');
    blob.setName('slip_' + safeName + '_' + timestamp + '.' + ext);

    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return { url: file.getUrl(), fileId: file.getId() };
  } catch (err) {
    console.error('Slip upload failed:', err);
    return '';
  }
}

// ============================================================
// ส่งอีเมลแจ้งเตือนการยกเลิก
// จัดการคำขอยกเลิก
// ============================================================
function handleCancellation(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(CANCEL_SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(CANCEL_SHEET_NAME);
      sheet.getRange(1, 1, 1, 5).setValues([[
        'Timestamp', 'ชื่อผู้จอง', 'เบอร์โทร', 'สาเหตุ', 'สถานะ'
      ]]);
      const headerRange = sheet.getRange(1, 1, 1, 5);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#DC2626');
      headerRange.setFontColor('#FFFFFF');
      sheet.setFrozenRows(1);
      sheet.setColumnWidths(1, 1, 180);
      sheet.setColumnWidths(2, 1, 150);
      sheet.setColumnWidths(3, 1, 120);
      sheet.setColumnWidths(4, 1, 250);
      sheet.setColumnWidths(5, 1, 120);
    }

    const timestamp = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow + 1, 1, 1, 5).setValues([[
      timestamp,
      data.name || '',
      data.phone || '',
      data.reason || '',
      'รอดำเนินการ'
    ]]);

    SpreadsheetApp.flush();

    // ส่งอีเมลแจ้งเตือนการยกเลิก
    sendCancellationNotification(data, timestamp);

    return { status: 'success' };
  } catch (err) {
    return { status: 'error', message: err.toString() };
  }
}

// ============================================================
// ส่งอีเมลแจ้งเตือนการจองใหม่
// ============================================================
function sendBookingNotification(data, queueNumber, timestamp, slipUrl, slipFileId) {
  try {
    const ssUrl = SpreadsheetApp.getActiveSpreadsheet().getUrl();
    const subject = '🔔 การจองใหม่ #' + queueNumber + ' - ' + (data.name || 'ไม่ระบุชื่อ') + ' (' + (data.date || '') + ')';

    // สร้าง thumbnail URL สำหรับแสดงรูปใน Gmail
    let slipImageHtml = '';
    if (slipUrl && slipFileId) {
      const thumbnailUrl = 'https://drive.google.com/thumbnail?id=' + slipFileId + '&sz=w400';
      slipImageHtml = '<tr style="background:#FFF7ED;"><td colspan="2" style="padding:16px 12px;text-align:center;">'
        + '<p style="font-weight:bold;color:#374151;margin:0 0 12px;font-size:14px;">� สลิปโอนเงิน</p>'
        + '<a href="' + slipUrl + '" target="_blank"><img src="' + thumbnailUrl + '" alt="สลิปโอนเงิน" style="max-width:300px;width:100%;border-radius:12px;border:2px solid #F97316;box-shadow:0 2px 8px rgba(0,0,0,0.1);" /></a>'
        + '<br/><a href="' + slipUrl + '" style="display:inline-block;margin-top:8px;color:#F97316;text-decoration:underline;font-weight:bold;font-size:13px;">ดูรูปเต็มขนาด</a>'
        + '</td></tr>';
    }

    const htmlBody = '<div style="font-family:\'Prompt\',Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;">'
      + '<div style="background:linear-gradient(135deg,#F97316,#FB923C);padding:24px;border-radius:16px 16px 0 0;text-align:center;">'
      + '<h1 style="color:white;margin:0;font-size:24px;">🚣 พาเพลินแพเปียก</h1>'
      + '<p style="color:#FFF7ED;margin:4px 0 0;font-size:14px;">มีการจองคิวใหม่เข้ามา!</p>'
      + '</div>'
      + '<div style="background:white;padding:24px;border:1px solid #E5E7EB;border-top:none;">'
      + '<table style="width:100%;border-collapse:collapse;font-size:14px;">'
      + '<tr style="background:#FFF7ED;"><td style="padding:10px 12px;font-weight:bold;color:#9a3412;width:140px;">📋 คิวที่</td><td style="padding:10px 12px;font-weight:bold;font-size:18px;color:#F97316;">' + queueNumber + '</td></tr>'
      + '<tr><td style="padding:10px 12px;font-weight:bold;color:#374151;">👤 ชื่อผู้จอง</td><td style="padding:10px 12px;">' + (data.name || '-') + '</td></tr>'
      + '<tr style="background:#F9FAFB;"><td style="padding:10px 12px;font-weight:bold;color:#374151;">📞 เบอร์โทร</td><td style="padding:10px 12px;"><a href="tel:' + (data.phone || '') + '" style="color:#F97316;text-decoration:none;font-weight:bold;">' + (data.phone || '-') + '</a></td></tr>'
      + (data.email ? '<tr><td style="padding:10px 12px;font-weight:bold;color:#374151;">📧 Email</td><td style="padding:10px 12px;"><a href="mailto:' + data.email + '" style="color:#F97316;text-decoration:none;">' + data.email + '</a></td></tr>' : '')
      + '<tr style="background:#F9FAFB;"><td style="padding:10px 12px;font-weight:bold;color:#374151;">📅 วันที่จอง</td><td style="padding:10px 12px;">' + (data.date || '-') + '</td></tr>'
      + '<tr style="background:#F9FAFB;"><td style="padding:10px 12px;font-weight:bold;color:#374151;">👥 จำนวนคน</td><td style="padding:10px 12px;">' + (data.guestCount || '-') + ' ท่าน</td></tr>'
      + '<tr><td style="padding:10px 12px;font-weight:bold;color:#374151;">🕐 ช่วงเวลา</td><td style="padding:10px 12px;">' + (data.timeSlotMain || '-') + '</td></tr>'
      + '<tr style="background:#F9FAFB;"><td style="padding:10px 12px;font-weight:bold;color:#374151;">⏰ รอบเวลา</td><td style="padding:10px 12px;font-weight:bold;color:#F97316;">' + (data.timeDetail || '-') + '</td></tr>'
      + '<tr><td style="padding:10px 12px;font-weight:bold;color:#374151;">💳 ประเภทชำระ</td><td style="padding:10px 12px;">' + (data.paymentType || '-') + '</td></tr>'
      + '<tr style="background:#F9FAFB;"><td style="padding:10px 12px;font-weight:bold;color:#374151;">💰 ยอดรวม</td><td style="padding:10px 12px;font-weight:bold;color:#16a34a;">' + (data.totalPrice || '-') + ' บาท</td></tr>'
      + (data.note ? '<tr><td style="padding:10px 12px;font-weight:bold;color:#374151;">📝 หมายเหตุ</td><td style="padding:10px 12px;color:#6B7280;">' + data.note + '</td></tr>' : '')
      + slipImageHtml
      + '</table>'
      + '</div>'
      + '<div style="background:#F3F4F6;padding:20px 24px;border-radius:0 0 16px 16px;border:1px solid #E5E7EB;border-top:none;text-align:center;">'
      + '<a href="' + ssUrl + '" style="display:inline-block;background:#F97316;color:white;padding:12px 28px;border-radius:25px;text-decoration:none;font-weight:bold;font-size:14px;box-shadow:0 2px 6px rgba(249,115,22,0.4);">📊 เปิด Google Sheets</a>'
      + '<p style="margin:12px 0 0;font-size:12px;color:#6B7280;">⏱ เวลาที่จอง: ' + timestamp + '</p>'
      + '<p style="margin:4px 0 0;font-size:11px;color:#9CA3AF;">อีเมลนี้ส่งอัตโนมัติจากระบบจองคิว พาเพลินแพเปียก</p>'
      + '</div>'
      + '</div>';

    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: subject,
      htmlBody: htmlBody
    });
  } catch (emailError) {
    console.error('Email notification failed:', emailError);
  }
}

// ============================================================
// ส่งอีเมลแจ้งเตือนการยกเลิก
// ============================================================
function sendCancellationNotification(data, timestamp) {
  try {
    const ssUrl = SpreadsheetApp.getActiveSpreadsheet().getUrl();
    const subject = '❌ แจ้งยกเลิกการจอง - ' + (data.name || 'ไม่ระบุชื่อ');

    const htmlBody = '<div style="font-family:\'Prompt\',Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;">'
      + '<div style="background:linear-gradient(135deg,#DC2626,#EF4444);padding:24px;border-radius:16px 16px 0 0;text-align:center;">'
      + '<h1 style="color:white;margin:0;font-size:24px;">❌ แจ้งยกเลิกการจอง</h1>'
      + '<p style="color:#FEE2E2;margin:4px 0 0;font-size:14px;">มีลูกค้าแจ้งยกเลิกการจอง</p>'
      + '</div>'
      + '<div style="background:white;padding:24px;border:1px solid #E5E7EB;border-top:none;">'
      + '<table style="width:100%;border-collapse:collapse;font-size:14px;">'
      + '<tr><td style="padding:10px 12px;font-weight:bold;color:#374151;width:140px;">👤 ชื่อผู้จอง</td><td style="padding:10px 12px;">' + (data.name || '-') + '</td></tr>'
      + '<tr style="background:#F9FAFB;"><td style="padding:10px 12px;font-weight:bold;color:#374151;">📞 เบอร์โทร</td><td style="padding:10px 12px;"><a href="tel:' + (data.phone || '') + '" style="color:#DC2626;text-decoration:none;font-weight:bold;">' + (data.phone || '-') + '</a></td></tr>'
      + '<tr><td style="padding:10px 12px;font-weight:bold;color:#374151;">📝 สาเหตุ</td><td style="padding:10px 12px;color:#DC2626;font-weight:bold;">' + (data.reason || '-') + '</td></tr>'
      + '</table>'
      + '</div>'
      + '<div style="background:#FEF2F2;padding:20px 24px;border-radius:0 0 16px 16px;border:1px solid #FECACA;border-top:none;text-align:center;">'
      + '<a href="' + ssUrl + '" style="display:inline-block;background:#DC2626;color:white;padding:12px 28px;border-radius:25px;text-decoration:none;font-weight:bold;font-size:14px;box-shadow:0 2px 6px rgba(220,38,38,0.4);">📊 เปิด Google Sheets</a>'
      + '<p style="margin:12px 0 0;font-size:12px;color:#991B1B;">⏱ เวลาที่แจ้ง: ' + timestamp + '</p>'
      + '<p style="margin:4px 0 0;font-size:11px;color:#B91C1C;">กรุณาตรวจสอบและติดต่อลูกค้ากลับโดยเร็ว</p>'
      + '</div>'
      + '</div>';

    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: subject,
      htmlBody: htmlBody
    });
  } catch (emailError) {
    console.error('Cancellation email failed:', emailError);
  }
}

function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) ? e.parameter.action : '';

    // ดึงจำนวนคิวที่จองแล้วตามวันที่
    if (action === 'getBookings') {
      const date = (e.parameter.date || '').trim();
      if (!date) {
        return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Missing date' }))
          .setMimeType(ContentService.MimeType.JSON);
      }

      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName(SHEET_NAME);
      const counts = {};

      if (sheet && sheet.getLastRow() > 1) {
        const lastRow = sheet.getLastRow();
        const dates = sheet.getRange(2, 6, lastRow - 1, 1).getValues();
        const times = sheet.getRange(2, 9, lastRow - 1, 1).getValues();
        for (let i = 0; i < dates.length; i++) {
          if (String(dates[i][0]).trim() === date) {
            const t = String(times[i][0]).trim();
            counts[t] = (counts[t] || 0) + 1;
          }
        }
      }

      return ContentService.createTextOutput(JSON.stringify({ status: 'success', counts: counts }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', message: 'Booking API is running' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
