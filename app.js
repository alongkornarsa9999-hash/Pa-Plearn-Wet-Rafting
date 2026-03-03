// ============================================================
// Google Sheets Integration
// ============================================================
// TODO: แทนที่ URL นี้ด้วย Web App URL จาก Google Apps Script ของคุณ
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbyJPQX1QIR1llVRn73-XBZNZbq1j5mMXXGmXqqj6qTCjPs0GQKJjKDoo20wQ6Ch4uBrHQ/exec';

async function submitToGoogleSheets(data) {
    try {
        const response = await fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        console.log('Google Sheets response:', result);
        return result;
    } catch (error) {
        console.error('Error submitting to Google Sheets:', error);
        return { status: 'error', message: error.toString() };
    }
}

// ============================================================
// Translations
// ============================================================
const translations = {
    th: {
        brand_name: "พาเพลินแพเปียก",
        brand_sub: "แพเปียก",
        ph_cancel_reason: "สาเหตุการยกเลิก",
        modal_cancel_title: "แจ้งยกเลิกการจอง",
        modal_cancel_desc: "กรุณาระบุข้อมูลการจองที่ต้องการยกเลิก เจ้าหน้าที่จะตรวจสอบและติดต่อกลับ",
        btn_submit_cancel_request: "ส่งเรื่องขอยกเลิก",
        btn_close_window: "ปิดหน้าต่าง",
                reason_default: "กรุณาเลือกเหตุผล...",
        reason_urgent: "ติดธุระด่วน / ป่วย",
        reason_weather: "สภาพอากาศไม่เอื้ออำนวย",
        reason_change_plan: "เปลี่ยนแผนการเดินทาง",
        reason_inconvenient: "ไม่สะดวกเดินทาง",
        reason_wrong: "จองผิดวัน / เวลา",
        reason_other: "อื่นๆ",
        modal_pdpa_title: "นโยบายความเป็นส่วนตัว (PDPA)",
        btn_acknowledge: "รับทราบ",
        modal_terms_title: "ข้อกำหนดและเงื่อนไข",
        pdpa_content: '<p class="mb-3"><strong>1. วัตถุประสงค์ในการเก็บรวบรวมข้อมูล</strong><br>ทางร้านพาเพลินแพเปียก ("เรา") เก็บรวบรวมข้อมูลส่วนบุคคลของท่าน (เช่น ชื่อ-นามสกุล, เบอร์โทรศัพท์) เพื่อใช้ในการยืนยันการจอง, ติดต่อประสานงาน และปรับปรุงการให้บริการเท่านั้น</p><p class="mb-3"><strong>2. การเปิดเผยข้อมูล</strong><br>เราจะไม่เปิดเผยข้อมูลส่วนบุคคลของท่านต่อบุคคลภายนอก ยกเว้นกรณีที่ต้องปฏิบัติตามกฎหมาย หรือได้รับความยินยอมจากท่าน</p><p class="mb-3"><strong>3. ระยะเวลาการจัดเก็บ</strong><br>ข้อมูลของท่านจะถูกจัดเก็บไว้ในระบบของเราเป็นระยะเวลาเท่าที่จำเป็นต่อการดำเนินธุรกิจ หรือจนกว่าท่านจะแจ้งขอลบข้อมูล</p><p><strong>4. สิทธิของเจ้าของข้อมูล</strong><br>ท่านมีสิทธิในการขอเข้าถึง, แก้ไข หรือขอลบข้อมูลส่วนบุคคลของท่านได้ตลอดเวลา โดยติดต่อเราผ่านช่องทางที่ระบุไว้ในเว็บไซต์</p>',
        terms_content: '<div class="mb-4"><strong class="text-brand-dark block mb-1">1. การจองและการชำระเงิน</strong><ul class="list-disc pl-5 space-y-1"><li>กรุณาชำระค่าบริการ ณ จุดให้บริการก่อนลงแพ</li></ul></div><div class="mb-4"><strong class="text-brand-dark block mb-1">2. การเปลี่ยนแปลงและยกเลิก</strong><ul class="list-disc pl-5 space-y-1"><li>หากต้องการเปลี่ยนแปลงวันหรือเวลา กรุณาแจ้งล่วงหน้าอย่างน้อย 3 วัน</li></ul></div><div class="mb-4"><strong class="text-brand-dark block mb-1">3. กฎระเบียบความปลอดภัย</strong><ul class="list-disc pl-5 space-y-1"><li>ผู้ใช้บริการทุกคนต้องสวมเสื้อชูชีพตลอดเวลาที่ลงเล่นน้ำ</li><li>ห้ามนำสิ่งเสพติดและอาวุธทุกชนิดเข้ามาในบริเวณแพ</li><li>เด็กเล็กและผู้สูงอายุต้องมีผู้ปกครองดูแลตลอดเวลา</li></ul></div><div class="mb-4"><strong class="text-brand-dark block mb-1">4. ความรับผิดชอบ</strong><ul class="list-disc pl-5 space-y-1"><li>ทางร้านไม่รับผิดชอบต่อการสูญหายของทรัพย์สินส่วนบุคคล</li><li>ผู้ใช้บริการต้องรับผิดชอบต่อความปลอดภัยของตนเองและทรัพย์สิน</li></ul></div>',
        nav_services: "บริการ",
        nav_gallery: "บรรยากาศ",
        nav_contact: "ติดต่อเรา",
        nav_booking: "ส่งคำขอจอง",
        hero_badge: "🌊 เปิดประสบการณ์ใหม่ที่เชียงราย",
        hero_title_1: "สนุกสุดเหวี่ยงกับ",
        hero_title_2: "พาเพลินแพเปียก",
        hero_desc: "ล่องแพเขื่อนแม่สรวย บรรยากาศดี อาหารอร่อย บริการเป็นกันเอง <br class='hidden md:block'>เหมาะสำหรับครอบครัวและกลุ่มเพื่อน",
        btn_check_queue: "เช็คคิวว่าง / จองแพ",
        btn_services: "ดูราคาบริการ",
        service_head_sm: "Our Services",
        service_head_lg: "บริการและอัตราค่าบริการ",
        service_desc: "เลือกรูปแบบการพักผ่อนที่เหมาะกับคุณ ไม่ว่าจะมาเป็นคู่ ครอบครัว หรือกลุ่มใหญ่ เราพร้อมดูแลให้วันหยุดของคุณพิเศษที่สุด",
        raft_title: "บริการล่องแพ",
        baht: "บาท",
        raft_pax_1: "เหมา 1-6 ท่าน",
        raft_pax_2: "120 บาท / ท่าน (7 ท่านขึ้นไป)",
        raft_feat_1: "บริการรับ-ส่งฟรี",
        raft_feat_2: "เล่นน้ำได้ไม่จำกัดเวลา",
        raft_feat_3: 'เด็กเล็กความสูงไม่เกิน 110 ซม. <strong>ฟรี!!</strong> <br>(ต้องมีผู้ปกครองดูแล)',
        food_title: "ชุดอาหารพื้นเมือง",
        food_price: "ราคาตามเมนู",
        food_desc: "เซตอาหารเหนือ ลาบ ต้มยำ ปลาทอดสมุนไพรสดๆ พร้อมเครื่องดื่ม",
        food_feat_1: "วัตถุดิบสดใหม่วันต่อวัน",
        food_feat_2: "รสชาติจัดจ้าน ดั้งเดิม",
        hut_title: "ซุ้มนั่งริมน้ำ",
        hut_unit: "ต่อวัน",
        hut_desc: "นั่งพักผ่อนริมฝั่ง ชมวิวเขื่อนชิลๆ",
        hut_feat_1: "นั่งได้ตลอดทั้งวัน",
        hut_feat_2: "สั่งอาหารมาทานได้สะดวก",
        gallery_head: "บรรยากาศที่คุณจะหลงรัก",
        gallery_desc: "สัมผัสความสดชื่นของสายน้ำและธรรมชาติที่สวยงาม",
        booking_head: "ส่งคำขอจองคิว",
        booking_desc: "เนื่องจากมีผู้สนใจจำนวนมาก เพื่อป้องกันคิวซ้ำซ้อน กรุณากรอกข้อมูลเพื่อให้เจ้าหน้าที่ตรวจสอบคิวว่างและติดต่อกลับครับ",
        booking_easy_title: "จองง่าย จ่ายสะดวก",
        booking_easy_desc: "ทีมงานพร้อมดูแลและตอบกลับอย่างรวดเร็วเพื่อให้คุณได้วันพักผ่อนที่ดีที่สุด",
        promo_title: "ฟรี ลำโพง Bluetooth",
        promo_desc: "สำหรับทุกการจอง ให้คุณสนุกได้เต็มที่",
        label_name: "ชื่อผู้จอง",
        ph_name: "ระบุชื่อของคุณ",
        label_phone: "เบอร์โทรศัพท์",
        ph_phone: "กรอกเบอร์มือถือ 10 หลัก (เฉพาะตัวเลข)",
        label_date: "วันที่ต้องการจอง",
        ph_date: "เลือกวันที่...",
        label_pax: "จำนวนคน",
        ph_pax: "ระบุจำนวน (ท่าน)",
        label_child: "*เด็กเล็กความสูงไม่เกิน 110 ซม. ฟรี!! (ต้องมีผู้ปกครองดูแล)",
        payment_type_label: "เลือกรูปแบบการชำระเงิน",
        pay_full: "จ่ายเต็มจำนวน",
        pay_full_desc: "ชำระครบในครั้งเดียว",
        pay_full_badge: "สะดวก รวดเร็ว",
        pay_deposit: "มัดจำ",
        pay_deposit_badge: "จ่ายส่วนที่เหลือหน้างาน",
        total_label: "ยอดรวม",
        label_time: "เลือกช่วงเวลาที่คุณต้องการ",
        time_am_title: "รอบเช้า",
        time_am_desc: "บรรยากาศสดชื่น",
        time_pm_title: "รอบบ่าย",
        time_pm_desc: "แดดร่มลมตก",
        select_time_slot: "เลือกรอบเวลา:",
        label_note: "หมายเหตุเพิ่มเติม (ถ้ามี)",
        ph_note: "เช่น อาหารที่แพ้อื่นๆ, ช่วงเวลาที่สะดวกรับสาย",
        payment_method: "ช่องทางการชำระเงิน",
        payment_warning: "สำคัญ: กรุณารอการยืนยันคิวจากเจ้าหน้าที่ก่อนโอนเงินทุกครั้ง",
        scan_pay: "สแกนจ่ายได้เลย",
        bank_name: "ธนาคารกสิกรไทย (KBank)",
        acct_name: "ชื่อบัญชี: พาเพลิน แพเปียก",
        label_email: "Email (ถ้ามี)",
        ph_email: "กรอกอีเมลของคุณ",
        upload_slip: "แนบหลักฐานการโอนเงิน (ถ้ามี)",
        accept_pdpa: "ข้าพเจ้ายอมรับ",
        terms_link: "เงื่อนไข",
        and_text: "และ",
        pdpa_link: "นโยบายความเป็นส่วนตัว (PDPA)",
        btn_submit_booking: "ส่งข้อมูลการจอง (รอเจ้าหน้าที่ยืนยัน)",
        footer_desc: "สัมผัสบรรยากาศธรรมชาติ ล่องแพสุดมันส์ อาหารอร่อย ณ เขื่อนแม่สรวย เชียงราย พร้อมบริการที่เป็นกันเอง",
        footer_contact: "ติดต่อเรา",
        contact_phone: "เบอร์โทรติดต่อ",
        contact_phone_sub: "สอบถามเพิ่มเติมได้ตลอดเวลา",
        contact_loc: "สถานที่ตั้ง",
        contact_loc_val: "เขื่อนแม่สรวย จ.เชียงราย",
        contact_fb: "Facebook",
        contact_fb_val: "พาเพลินแพเปียก",
        footer_map: "แผนที่เดินทาง",
        open_map: "เปิดใน Google Maps",
        copyright: "สงวนลิขสิทธิ์.",
        footer_pdpa: "นโยบาย PDPA",
        footer_terms: "เงื่อนไข",
        footer_cancel: "แจ้งยกเลิก"
    },
    en: {
        brand_name: "พาเพลินแพเปียก",
        brand_sub: "แพเปียก",
        ph_cancel_reason: "Cancellation Reason",
        modal_cancel_title: "Cancel Booking",
        modal_cancel_desc: "Please provide booking details to cancel. Our staff will check and contact you back.",
        btn_submit_cancel_request: "Submit Cancellation Request",
        btn_close_window: "Close Window",
                reason_default: "Please select a reason...",
        reason_urgent: "Urgent matter / Sickness",
        reason_weather: "Bad weather",
        reason_change_plan: "Change of plans",
        reason_inconvenient: "Inconvenient travel",
        reason_wrong: "Wrong booking date/time",
        reason_other: "Other",
        modal_pdpa_title: "Privacy Policy (PDPA)",
        btn_acknowledge: "Acknowledge",
        modal_terms_title: "Terms and Conditions",
        pdpa_content: '<p class="mb-3"><strong>1. Purpose of Data Collection</strong><br>Pa Plearn Wet Rafting ("We") collects your personal data (e.g., Name, Phone Number) solely for booking confirmation, coordination, and service improvement.</p><p class="mb-3"><strong>2. Data Disclosure</strong><br>We will not disclose your personal data to third parties unless required by law or with your consent.</p><p class="mb-3"><strong>3. Data Retention</strong><br>Your data will be stored in our system for as long as necessary for business operations or until you request deletion.</p><p><strong>4. Rights of Data Subject</strong><br>You have the right to access, correct, or request deletion of your personal data at any time by contacting us through the channels provided on the website.</p>',
        terms_content: '<div class="mb-4"><strong class="text-brand-dark block mb-1">1. Booking and Payment</strong><ul class="list-disc pl-5 space-y-1"><li>Please pay the service fee at the service point before rafting.</li></ul></div><div class="mb-4"><strong class="text-brand-dark block mb-1">2. Changes and Cancellation</strong><ul class="list-disc pl-5 space-y-1"><li>If you wish to change date or time, please notify at least 3 days in advance.</li></ul></div><div class="mb-4"><strong class="text-brand-dark block mb-1">3. Safety Regulations</strong><ul class="list-disc pl-5 space-y-1"><li>All users must wear life jackets at all times in the water.</li><li>Narcotics and weapons are strictly prohibited.</li><li>Children and elderly must be closely supervised by guardians.</li><li>Strictly follow staff instructions.</li></ul></div><div><strong class="text-brand-dark block mb-1">4. Property and Damages</strong><ul class="list-disc pl-5 space-y-1"><li>We are not responsible for loss or damage to personal valuables.</li><li>If equipment is damaged due to misuse, user must pay for damages at actual value.</li></ul></div>',
        nav_services: "Services",
        nav_gallery: "Gallery",
        nav_contact: "Contact",
        nav_booking: "Book Now",
        hero_badge: "🌊 New Experience in Chiang Rai",
        hero_title_1: "Have Fun with",
        hero_title_2: "Pa Plearn Rafting",
        hero_desc: "Rafting at Mae Suai Dam. Good atmosphere, delicious food, friendly service. <br class='hidden md:block'>Perfect for families and groups.",
        btn_check_queue: "Check Queue / Book",
        btn_services: "View Rates",
        service_head_sm: "Our Services",
        service_head_lg: "Services & Rates",
        service_desc: "Choose the package that suits you. Whether coming as a couple, family, or large group, we are ready to take care of you.",
        raft_title: "Rafting Service",
        baht: "THB",
        raft_pax_1: "Charter 1-6 Pax",
        raft_pax_2: "120 THB / Person (7+ Pax)",
        raft_feat_1: "Free Shuttle Service",
        raft_feat_2: "Unlimited Play Time",
        raft_feat_3: 'Children under 110cm <strong>FREE!!</strong> <br>(Must be supervised)',
        food_title: "Local Food Set",
        food_price: "Menu Price",
        food_desc: "Northern Thai food set: Larb, Tom Yum, Fried Fish with herbs, and drinks.",
        food_feat_1: "Fresh Ingredients Daily",
        food_feat_2: "Authentic Spicy Taste",
        hut_title: "Riverside Hut",
        hut_unit: "per day",
        hut_desc: "Relax by the shore, enjoy the dam view.",
        hut_feat_1: "Sit All Day",
        hut_feat_2: "Order Food Easily",
        gallery_head: "Atmosphere You'll Love",
        gallery_desc: "Experience the freshness of the river and beautiful nature.",
        booking_head: "Booking Request",
        booking_desc: "Due to high demand, please fill in the info for us to check availability and contact you back.",
        booking_easy_title: "Easy Booking",
        booking_easy_desc: "Our team is ready to ensure you have the best vacation.",
        promo_title: "Free Bluetooth Speaker",
        promo_desc: "For every booking, enjoy to the fullest.",
        label_name: "Name",
        ph_name: "Your Name",
        label_phone: "Phone Number",
        ph_phone: "10-digit mobile number",
        label_date: "Date",
        ph_date: "Select Date...",
        label_pax: "No. of Guests",
        ph_pax: "Number of people",
        label_child: "*Children under 110cm FREE!! (Must be supervised)",
        payment_type_label: "Select Payment Method",
        pay_full: "Full Payment",
        pay_full_desc: "Pay in full at once",
        pay_full_badge: "Quick & Easy",
        pay_deposit: "Deposit",
        pay_deposit_badge: "Pay the rest on-site",
        total_label: "Total",
        label_time: "Select Time Slot",
        time_am_title: "Morning",
        time_am_desc: "Fresh Atmosphere",
        time_pm_title: "Afternoon",
        time_pm_desc: "Sunset Chill",
        select_time_slot: "Select Time:",
        label_note: "Additional Note (Optional)",
        ph_note: "e.g., Food allergies, preferred call time",
        payment_method: "Payment Channel",
        payment_warning: "Important: Please wait for confirmation before transferring.",
        scan_pay: "Scan to Pay",
        bank_name: "Kasikorn Bank (KBank)",
        acct_name: "Account: Pa Plearn Rafting",
        label_email: "Email (Optional)",
        ph_email: "Enter your email",
        upload_slip: "Upload Slip (Optional)",
        accept_pdpa: "I accept",
        terms_link: "Terms & Conditions",
        and_text: "and",
        pdpa_link: "Privacy Policy (PDPA)",
        btn_submit_booking: "Submit Request (Wait for Confirmation)",
        footer_desc: "Touch nature, enjoy rafting, delicious food at Mae Suai Dam, Chiang Rai with friendly service.",
        footer_contact: "Contact Us",
        contact_phone: "Phone",
        contact_phone_sub: "Inquire anytime",
        contact_loc: "Location",
        contact_loc_val: "Mae Suai Dam, Chiang Rai",
        contact_fb: "Facebook",
        contact_fb_val: "Pa Plearn Wet Rafting",
        footer_map: "Map",
        open_map: "Open in Google Maps",
        copyright: "All Rights Reserved.",
        footer_pdpa: "PDPA Policy",
        footer_terms: "Terms",
        footer_cancel: "Cancel Booking"
    }
};

// ============================================================
// State
// ============================================================
let currentLang = 'th';
let fp;
let bookingCounts = {};
let currentSelectedDate = '';

// === Local Booking Counts (localStorage) ===
function getLocalCounts(dateStr) {
    try {
        const all = JSON.parse(localStorage.getItem('paplearn_local_counts') || '{}');
        return all[dateStr] || {};
    } catch { return {}; }
}

function saveLocalCount(dateStr, timeKey) {
    try {
        const all = JSON.parse(localStorage.getItem('paplearn_local_counts') || '{}');
        if (!all[dateStr]) all[dateStr] = {};
        all[dateStr][timeKey] = (all[dateStr][timeKey] || 0) + 1;
        localStorage.setItem('paplearn_local_counts', JSON.stringify(all));
    } catch (e) { console.error('localStorage error:', e); }
}

function mergeCounts(serverCounts, localCounts) {
    const merged = {};
    const allKeys = new Set([...Object.keys(serverCounts), ...Object.keys(localCounts)]);
    allKeys.forEach(key => {
        merged[key] = Math.max(serverCounts[key] || 0, localCounts[key] || 0);
    });
    return merged;
}

async function fetchBookingCounts(dateStr) {
    const localCounts = getLocalCounts(dateStr);
    // ใช้ local counts ก่อนเลย
    bookingCounts = { ...localCounts };
    try {
        const url = GOOGLE_SHEETS_URL + '?action=getBookings&date=' + encodeURIComponent(dateStr);
        const response = await fetch(url);
        const result = await response.json();
        if (result.status === 'success' && result.counts) {
            // รวม server + local โดยใช้ค่าที่มากกว่า
            bookingCounts = mergeCounts(result.counts, localCounts);
        }
    } catch (err) {
        console.error('Failed to fetch booking counts (using local):', err);
        // ใช้ local counts ต่อไป
    }
}

// ============================================================
// Language Functions
// ============================================================
function changeLanguage(lang) {
    currentLang = lang;
    document.getElementById('current-lang').innerHTML = lang === 'th' ? 'TH' : 'EN';
    document.getElementById('current-lang-icon').src = lang === 'th' ? 'https://flagcdn.com/w40/th.png' : 'https://flagcdn.com/w40/gb.png';
    document.getElementById('mobile-lang-text').textContent = lang === 'th' ? 'TH' : 'EN';
    document.getElementById('mobile-lang-icon').src = lang === 'th' ? 'https://flagcdn.com/w40/th.png' : 'https://flagcdn.com/w40/gb.png';

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) el.innerHTML = translations[lang][key];
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const key = el.getAttribute('data-i18n-ph');
        if (translations[lang][key]) el.placeholder = translations[lang][key];
    });

    if (fp) fp.set("locale", lang === 'th' ? "th" : "default");

    updateTotal();
    // Always regenerate time chips on language switch so text like 'ว่าง'/'Avail' updates
    const dateStr = document.getElementById('date') ? document.getElementById('date').value : '';
    if (dateStr) {
        fetchBookingCounts(dateStr).then(() => {
            generateTimeChips('morning', document.getElementById('morning-chips-container'));
            generateTimeChips('afternoon', document.getElementById('afternoon-chips-container'));
        });
    } else {
        generateTimeChips('morning', document.getElementById('morning-chips-container'));
        generateTimeChips('afternoon', document.getElementById('afternoon-chips-container'));
    }

    // Update modal content
    const pdpaEl = document.getElementById('pdpaContent');
    const termsEl = document.getElementById('termsContent');
    if (pdpaEl) pdpaEl.innerHTML = translations[lang].pdpa_content;
    if (termsEl) termsEl.innerHTML = translations[lang].terms_content;
}

function toggleLanguage() {
    changeLanguage(currentLang === 'th' ? 'en' : 'th');
}

function toggleLangDropdown(id) {
    const dropdown = document.getElementById(id);
    if (dropdown) dropdown.classList.toggle('hidden');
}

// ============================================================
// Modal Functions
// ============================================================
function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove('hidden');

    // Load modal content
    if (id === 'pdpaModal') {
        const el = document.getElementById('pdpaContent');
        if (el) el.innerHTML = translations[currentLang].pdpa_content;
    }
    if (id === 'termsModal') {
        const el = document.getElementById('termsContent');
        if (el) el.innerHTML = translations[currentLang].terms_content;
    }

    if (id === 'cancelModal') {
        const savedName = localStorage.getItem('paplearn_name');
        const savedPhone = localStorage.getItem('paplearn_phone');
        const nameInput = document.getElementById('cancelName');
        const phoneInput = document.getElementById('cancelPhone');
        if (savedName && nameInput) nameInput.value = savedName;
        if (savedPhone && phoneInput) phoneInput.value = savedPhone;
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('hidden');
}

// ============================================================
// Time Slot Functions
// ============================================================
function showTimeSlots(slot) {
    document.getElementById('morning-slots').classList.add('hidden');
    document.getElementById('afternoon-slots').classList.add('hidden');

    const slotsDiv = document.getElementById(slot + '-slots');
    if (slotsDiv) {
        slotsDiv.classList.remove('hidden');
        const otherSlot = slot === 'morning' ? 'afternoon-slots' : 'morning-slots';
        document.querySelectorAll('#' + otherSlot + ' input[type="radio"]').forEach(input => input.checked = false);
        updatePeriodDisplay(slot === 'morning' ? 'รอบเช้า' : 'รอบบ่าย', null);
    }
}

// ============================================================
// Utility Functions
// ============================================================
function copyBankNumber() {
    const accNo = "xxx-x-xxxxx-x";
    const textarea = document.createElement('textarea');
    textarea.value = accNo;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 2000, timerProgressBar: true }).fire({
            icon: 'success',
            title: currentLang === 'th' ? 'คัดลอกเลขบัญชีแล้ว' : 'Account number copied'
        });
    } catch (err) { console.error('Failed to copy: ', err); }
    finally { document.body.removeChild(textarea); }
}

function updateTotal() {
    const guestInput = document.getElementById('guestCount');
    const totalInput = document.getElementById('totalPriceDisplay');
    if (!guestInput || !totalInput) return;

    let count = parseInt(guestInput.value) || 0;
    let price = 800;
    if (count > 6) price += (count - 6) * 120;
    totalInput.textContent = price.toLocaleString();
}

function updatePeriodDisplay(period, time, iconClass) {
    const displayEl = document.getElementById('selectedPeriodDisplay');
    if (time) {
        displayEl.innerHTML = '<i class="' + (iconClass || 'fa-regular fa-clock') + ' mr-1"></i> ' + period + ' ' + time;
        displayEl.classList.remove('hidden');
    } else {
        displayEl.innerHTML = '';
        displayEl.classList.add('hidden');
    }
}

function updateNavbar() {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 20) {
        nav.classList.remove('at-top');
        nav.classList.add('scrolled');
    } else {
        nav.classList.add('at-top');
        nav.classList.remove('scrolled');
    }
}

// ============================================================
// Time Chips Generation
// ============================================================
const MAX_QUEUE = 8;
const timeConfigs = {
    morning: ['09:00', '10:00', '11:00', '12:00'],
    afternoon: ['13:00', '14:00', '15:00', '16:00', '17:00', '18:00']
};

function getQueueLevel(remaining) {
    if (remaining <= 0) return { th: 'เต็ม', en: 'Full', color: 'red', icon: 'fa-solid fa-ban' };
    if (remaining <= 2) return { th: 'ใกล้เต็ม', en: 'Almost Full', color: 'amber', icon: 'fa-solid fa-triangle-exclamation' };
    if (remaining <= 5) return { th: 'ว่าง', en: 'Available', color: 'blue', icon: 'fa-solid fa-circle-check' };
    return { th: 'ว่างมาก', en: 'Many Available', color: 'green', icon: 'fa-solid fa-circle-check' };
}

function generateTimeChips(slot, container) {
    container.innerHTML = '';
    const times = timeConfigs[slot];

    times.forEach(time => {
        const timeKeyTh = time + ' น.';
        const timeKeyEn = time;
        const currentBookings = (bookingCounts[timeKeyTh] || 0) + (bookingCounts[timeKeyEn] || 0);
        const remaining = Math.max(0, MAX_QUEUE - currentBookings);
        const isFull = remaining <= 0;
        const level = getQueueLevel(remaining);
        const levelText = currentLang === 'th' ? level.th : level.en;

        const label = document.createElement('label');
        label.className = 'cursor-pointer';

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'time_detail';
        input.value = time + (currentLang === 'th' ? ' น.' : '');
        input.className = 'peer sr-only specific-time-input';
        input.disabled = isFull;

        input.addEventListener('change', function () {
            const mainSlot = document.querySelector('input[name="time_slot_main"]:checked')?.value;
            let periodName = '';
            if (mainSlot === 'morning') periodName = currentLang === 'th' ? 'รอบเช้า' : 'Morning';
            else periodName = currentLang === 'th' ? 'รอบบ่าย' : 'Afternoon';
            const iconClass = mainSlot === 'morning' ? 'fa-regular fa-sun' : 'fa-solid fa-cloud-sun';
            updatePeriodDisplay(periodName, this.value, iconClass);
        });

        const div = document.createElement('div');
        const timeUnit = currentLang === 'th' ? 'น.' : '';
        const queueText = currentLang === 'th' ? 'คิว' : '';

        if (isFull) {
            div.className = 'px-4 py-3 border-2 rounded-xl text-sm transition-all shadow-sm bg-red-50 text-red-400 border-red-200 cursor-not-allowed';
            div.innerHTML = '<span class="line-through">' + time + ' ' + timeUnit + '</span>';
        } else {
            let borderColor, hoverBorder, hoverText;
            if (level.color === 'green') {
                borderColor = 'border-green-200'; hoverBorder = 'hover:border-green-400'; hoverText = 'hover:text-green-600';
            } else if (level.color === 'blue') {
                borderColor = 'border-blue-200'; hoverBorder = 'hover:border-blue-400'; hoverText = 'hover:text-blue-600';
            } else {
                borderColor = 'border-amber-200'; hoverBorder = 'hover:border-amber-400'; hoverText = 'hover:text-amber-600';
            }
            div.className = 'px-4 py-3 border-2 rounded-xl text-sm transition-all shadow-sm bg-white '
                + borderColor + ' text-gray-600 ' + hoverBorder + ' ' + hoverText + ' cursor-pointer';
            div.innerHTML = '<span class="font-medium">' + time + ' ' + timeUnit + '</span>';
        }

        label.appendChild(input);
        label.appendChild(div);
        container.appendChild(label);
    });
}

// ============================================================
// DOMContentLoaded - Initialization
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('year').textContent = new Date().getFullYear();

    // Flatpickr
    fp = flatpickr("#date", {
        locale: "th",
        dateFormat: "d/m/Y",
        minDate: "today",
        disableMobile: "true",
        onChange: function (selectedDates, dateStr) {
            document.getElementById('morning-slots').classList.add('hidden');
            document.getElementById('afternoon-slots').classList.add('hidden');
            updatePeriodDisplay('', null);
            currentSelectedDate = dateStr || '';
            // โหลด local counts ทันที แล้ว fetch จาก server อัปเดตทีหลัง
            bookingCounts = getLocalCounts(currentSelectedDate);
            generateTimeChips('morning', document.getElementById('morning-chips-container'));
            generateTimeChips('afternoon', document.getElementById('afternoon-chips-container'));
            if (dateStr) {
                fetchBookingCounts(dateStr).then(() => {
                    generateTimeChips('morning', document.getElementById('morning-chips-container'));
                    generateTimeChips('afternoon', document.getElementById('afternoon-chips-container'));
                });
            }
        }
    });

    // Mobile Menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));

        // ปิดเมนูอัตโนมัติเมื่อผู้ใช้กดเลือกรายการเมนู (ลิงก์ anchor)
        mobileMenu.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // Smooth scroll to contact section for all "ติดต่อเรา" links
    const contactLinks = document.querySelectorAll('a[href="#contact"]');
    const contactSection = document.getElementById('contact');
    if (contactSection && contactLinks.length) {
        contactLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }

    // Navbar Scroll
    window.addEventListener('scroll', updateNavbar);
    updateNavbar();

    // Guest Count
    const guestInput = document.getElementById('guestCount');
    if (guestInput) guestInput.addEventListener('input', updateTotal);

    // ============================================================
    // Booking Form Submit - ส่งข้อมูลไป Google Sheets
    // ============================================================
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const pdpaChecked = document.getElementById('pdpaConsent').checked;
            if (!pdpaChecked) {
                Swal.fire(currentLang === 'th' ? 'แจ้งเตือน' : 'Warning', currentLang === 'th' ? 'กรุณายอมรับนโยบายความเป็นส่วนตัว (PDPA)' : 'Please accept PDPA Policy', 'warning');
                return;
            }

            const btn = document.getElementById('submitBtn');
            const originalContent = btn.innerHTML;
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email') ? document.getElementById('email').value : '';
            const date = document.getElementById('date').value;
            const guestCount = document.getElementById('guestCount').value;
            const note = document.getElementById('note').value;
            const timeSlotMain = document.querySelector('input[name="time_slot_main"]:checked')?.value || '';
            const timeDetail = document.querySelector('input[name="time_detail"]:checked')?.value;
            const totalPrice = document.getElementById('totalPriceDisplay').textContent;

            if (!timeDetail) {
                Swal.fire(currentLang === 'th' ? 'แจ้งเตือน' : 'Warning', currentLang === 'th' ? 'กรุณาเลือกช่วงเวลาที่ต้องการ' : 'Please select a time slot', 'warning');
                return;
            }

            localStorage.setItem('paplearn_name', name);
            localStorage.setItem('paplearn_phone', phone);

            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';
            btn.disabled = true;
            btn.classList.add('opacity-75');

            // ส่งข้อมูลไป Google Sheets
            const bookingData = {
                name: name,
                phone: phone,
                email: email,
                date: date,
                guestCount: guestCount,
                timeSlotMain: timeSlotMain === 'morning' ? (currentLang === 'th' ? 'รอบเช้า' : 'Morning') : (currentLang === 'th' ? 'รอบบ่าย' : 'Afternoon'),
                timeDetail: timeDetail,
                totalPrice: totalPrice,
                note: note
            };

            // ส่งข้อมูลไป Google Sheets แบบเบื้องหลัง เพื่อให้หน้าตอบสนองได้เร็วขึ้น
            submitToGoogleSheets(bookingData).catch(err => {
                console.error('Submit booking failed:', err);
            });

            // ตัดคิวทันทีฝั่ง frontend + บันทึกลง localStorage
            if (timeDetail && date) {
                saveLocalCount(date, timeDetail);
                bookingCounts[timeDetail] = (bookingCounts[timeDetail] || 0) + 1;
                generateTimeChips('morning', document.getElementById('morning-chips-container'));
                generateTimeChips('afternoon', document.getElementById('afternoon-chips-container'));
            }

            const title = currentLang === 'th' ? 'ได้รับคำขอจองแล้ว' : 'Booking Received';
            const htmlTh =
                '<div style="padding:12px 4px; text-align:left; line-height:1.6;">' +
                    '<div style="display:flex; align-items:center; margin-bottom:10px;">' +
                        '<div style="width:40px;height:40px;border-radius:999px;background:#FEF3C7;display:flex;align-items:center;justify-content:center;margin-right:10px;">' +
                            '<i class="fa-solid fa-paper-plane" style="color:#F97316;"></i>' +
                        '</div>' +
                        '<div>' +
                            '<div style="font-size:13px;color:#6B7280;">รายละเอียดการจองของคุณ</div>' +
                            '<div style="font-size:16px;font-weight:700;color:#111827;">แพเปียก เขื่อนแม่สรวย</div>' +
                        '</div>' +
                    '</div>' +
                    '<div style="background:#F9FAFB;border-radius:14px;padding:10px 12px;margin-bottom:10px;">' +
                        '<div style="display:flex;justify-content:space-between;font-size:13px;color:#4B5563;margin-bottom:4px;">' +
                            '<span>จำนวนผู้เข้าร่วม</span>' +
                            '<span style="font-weight:600;color:#111827;">' + guestCount + ' ท่าน</span>' +
                        '</div>' +
                        '<div style="display:flex;justify-content:space-between;font-size:13px;color:#4B5563;">' +
                            '<span>ช่วงเวลา</span>' +
                            '<span style="font-weight:600;color:#111827;">' + timeDetail + '</span>' +
                        '</div>' +
                    '</div>' +
                    '<div style="font-size:12px;color:#F97316;margin-bottom:2px;">' +
                        'เจ้าหน้าที่จะตรวจสอบคิวว่างและติดต่อกลับไปที่เบอร์ ' + phone + ' โดยเร็วที่สุดครับ' +
                    '</div>' +
                '</div>';

            const htmlEn =
                '<div style="padding:12px 4px; text-align:left; line-height:1.6;">' +
                    '<div style="display:flex; align-items:center; margin-bottom:10px;">' +
                        '<div style="width:40px;height:40px;border-radius:999px;background:#FEF3C7;display:flex;align-items:center;justify-content:center;margin-right:10px;">' +
                            '<i class="fa-solid fa-paper-plane" style="color:#F97316;"></i>' +
                        '</div>' +
                        '<div>' +
                            '<div style="font-size:13px;color:#6B7280;">Your booking details</div>' +
                            '<div style="font-size:16px;font-weight:700;color:#111827;">Pa Plearn Wet Rafting</div>' +
                        '</div>' +
                    '</div>' +
                    '<div style="background:#F9FAFB;border-radius:14px;padding:10px 12px;margin-bottom:10px;">' +
                        '<div style="display:flex;justify-content:space-between;font-size:13px;color:#4B5563;margin-bottom:4px;">' +
                            '<span>Guests</span>' +
                            '<span style="font-weight:600;color:#111827;">' + guestCount + ' Pax</span>' +
                        '</div>' +
                        '<div style="display:flex;justify-content:space-between;font-size:13px;color:#4B5563;">' +
                            '<span>Time</span>' +
                            '<span style="font-weight:600;color:#111827;">' + timeDetail + '</span>' +
                        '</div>' +
                    '</div>' +
                    '<div style="font-size:12px;color:#F97316;margin-bottom:6px;">' +
                        'Our staff will check availability and contact ' + phone + ' shortly.' +
                    '</div>' +
                    '<div style="font-size:11px;color:#9CA3AF;">' +
                        'If you need to modify your booking, please contact us via phone or Facebook Page.' +
                    '</div>' +
                '</div>';

            Swal.fire({
                title: title,
                html: currentLang === 'th' ? htmlTh : htmlEn,
                icon: 'success',
                confirmButtonText: currentLang === 'th' ? 'รับทราบ' : 'OK',
                confirmButtonColor: '#F97316'
            });

            // reset ฟอร์มแต่ไม่ซ่อน time chips เพื่อให้เห็นคิวที่ตัดไป
            document.getElementById('name').value = '';
            document.getElementById('phone').value = '';
            if (document.getElementById('email')) document.getElementById('email').value = '';
            document.getElementById('guestCount').value = '';
            document.getElementById('note').value = '';
            if (document.getElementById('slipUpload')) document.getElementById('slipUpload').value = '';
            document.getElementById('pdpaConsent').checked = false;
            document.getElementById('selectedPeriodDisplay').classList.add('hidden');
            const defaultPayment = document.querySelector('input[name="payment_type"][value="full"]');
            if (defaultPayment) defaultPayment.checked = true;
            // ยกเลิกการเลือก time radio
            document.querySelectorAll('input[name="time_detail"]').forEach(r => r.checked = false);
            document.querySelectorAll('input[name="time_slot_main"]').forEach(r => r.checked = false);
            updateTotal();

            btn.innerHTML = originalContent;
            btn.disabled = false;
            btn.classList.remove('opacity-75');
        });
    }

    // Cancel Form
    const cancelReason = document.getElementById('cancelReason');
    const otherReasonDiv = document.getElementById('otherReasonDiv');
    const otherReasonText = document.getElementById('otherReasonText');
    
    if (cancelReason && otherReasonDiv) {
        cancelReason.addEventListener('change', function() {
            if (this.value === 'other') {
                otherReasonDiv.classList.remove('hidden');
                otherReasonText.required = true;
            } else {
                otherReasonDiv.classList.add('hidden');
                otherReasonText.required = false;
                otherReasonText.value = '';
            }
        });
    }
    
    const submitCancel = document.getElementById('submitCancel');
    if (submitCancel) {
        submitCancel.addEventListener('click', async function () {
            const btn = this;
            const originalContent = btn.innerHTML;
            const name = document.getElementById('cancelName').value;
            const phone = document.getElementById('cancelPhone').value;
            const reasonEl = document.getElementById('cancelReason');
            const otherReasonText = document.getElementById('otherReasonText');
            let reason = reasonEl ? reasonEl.options[reasonEl.selectedIndex].text : '';
            
            // If "other" is selected, include the custom text
            if (reasonEl && reasonEl.value === 'other' && otherReasonText) {
                reason += ': ' + otherReasonText.value;
            }

            if (!name || !phone || (reasonEl && reasonEl.value === 'other' && !otherReasonText.value)) {
                Swal.fire(currentLang === 'th' ? 'แจ้งเตือน' : 'Warning', currentLang === 'th' ? 'กรุณากรอกชื่อและเบอร์โทรศัพท์' : 'Please fill name and phone', 'warning');
                return;
            }

            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';
            btn.disabled = true;

            // ส่งข้อมูลยกเลิกไป Google Sheets + Gmail
            const cancelData = {
                type: 'cancellation',
                name: name,
                phone: phone,
                reason: reason
            };
            await submitToGoogleSheets(cancelData);

            closeModal('cancelModal');
            Swal.fire({
                title: currentLang === 'th' ? 'ส่งคำขอเรียบร้อย' : 'Request Sent',
                text: currentLang === 'th' ? 'เราได้รับเรื่องการยกเลิกของคุณแล้ว จะดำเนินการตรวจสอบตามเงื่อนไขครับ' : 'Cancellation request received. We will verify shortly.',
                icon: 'info',
                confirmButtonText: currentLang === 'th' ? 'รับทราบ' : 'OK',
                confirmButtonColor: '#DC2626'
            });

            document.getElementById('cancelForm').reset();
            btn.innerHTML = originalContent;
            btn.disabled = false;
        });
    }

    // Initial chips
    generateTimeChips('morning', document.getElementById('morning-chips-container'));
    generateTimeChips('afternoon', document.getElementById('afternoon-chips-container'));

    // Initial modal content
    const pdpaEl = document.getElementById('pdpaContent');
    const termsEl = document.getElementById('termsContent');
    if (pdpaEl) pdpaEl.innerHTML = translations[currentLang].pdpa_content;
    if (termsEl) termsEl.innerHTML = translations[currentLang].terms_content;
});
