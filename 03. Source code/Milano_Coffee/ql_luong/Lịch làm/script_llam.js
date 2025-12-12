const employees = [
    { manv: "NV0001", name: "Lê Văn A", position: "Pha chế" },
    { manv: "NV0002", name: "Nguyễn Thị B", position: "Pha chế" },
    { manv: "NV0003", name: "Trần Doãn C", position: "Pha chế" },
    { manv: "NV0004", name: "Trần Đăng D", position: "Pha chế" },
    { manv: "NV0005", name: "Lê Thị Hoài T", position: "Phục vụ" },
    { manv: "NV0006", name: "Võ Thị M", position: "Phục vụ" },
    { manv: "NV0007", name: "Lê Quang N", position: "Phục vụ" },
    { manv: "NV0008", name: "Nguyễn Văn V", position: "Phục vụ" },
    { manv: "NV0009", name: "Cáp Thị K", position: "Phục vụ" }
];

let scheduleData = null;
let originalData = null;

const tbody = document.getElementById('scheduleBody');
const pageTitle = document.getElementById('pageTitle');
const dateRangeEl = document.getElementById('dateRange');
const actionButtons = document.getElementById('actionButtons');
const saveActions = document.getElementById('saveActions');
const confirmModal = document.getElementById('confirmModal');
const picker = document.getElementById('datePicker');
const miniTrigger = document.getElementById('miniCalendarTrigger');

let startDate = null;
let endDate = null;
let displayedYear = new Date().getFullYear();
let displayedMonth = new Date().getMonth();

// ==================== KHỞI ĐỘNG ====================
document.addEventListener('DOMContentLoaded', () => {
    loadDefaultSampleSchedule(); // TẠO SẴN LỊCH MẪU
    setupDatePicker();
    miniTrigger.onclick = () => picker.classList.toggle('active');
});

// Tạo lịch mẫu đẹp như hình bạn gửi
function loadDefaultSampleSchedule() {
    const sampleStart = "2025-12-15";
    const sampleEnd = "2025-12-21";

    scheduleData = {
        periodStart: sampleStart,
        periodEnd: sampleEnd,
        shifts: {
            "NV0001": { mon: "S", tue: "C", wed: "T", thu: "S", fri: "C", sat: "T", sun: "" },
            "NV0002": { mon: "C", tue: "T", wed: "S", thu: "C", fri: "T", sat: "S", sun: "" },
            "NV0003": { mon: "T", tue: "S", wed: "C", thu: "T", fri: "S", sat: "C", sun: "T" },
            "NV0004": { mon: "S", tue: "C", wed: "T", thu: "S", fri: "C", sat: "", sun: "S" },
            "NV0005": { mon: "C", tue: "T", wed: "S", thu: "C", fri: "T", sat: "S", sun: "C" },
            "NV0006": { mon: "T", tue: "S", wed: "C", thu: "T", fri: "S", sat: "C", sun: "T" },
            "NV0007": { mon: "S", tue: "C", wed: "T", thu: "S", fri: "C", sat: "T", sun: "" },
            "NV0008": { mon: "C", tue: "T", wed: "S", thu: "C", fri: "T", sat: "S", sun: "C" },
            "NV0009": { mon: "T", tue: "S", wed: "C", thu: "T", fri: "S", sat: "C", sun: "T" }
        }
    };

    dateRangeEl.textContent = `${formatDate(sampleStart)} - ${formatDate(sampleEnd)}`;
    miniTrigger.style.display = 'none';
    renderTable();
    disableCellEditing();
}

// SỬA LẠI – ĐÓNG DATE PICKER HOÀN TOÀN KHI CHỌN XONG
function startCreateSchedule(start, end) {
    scheduleData.periodStart = start;
    scheduleData.periodEnd = end;
    dateRangeEl.textContent = `${formatDate(start)} - ${formatDate(end)}`;

    // QUAN TRỌNG: ĐÓNG DATE PICKER HOÀN TOÀN
    picker.classList.remove('active');

    renderTable();
    enableCellEditing(); // BẮT BUỘC GỌI LẠI ĐỂ GẮN SỰ KIỆN CLICK
    document.querySelector('.main').classList.add('editing-mode');
}

// SỬA LẠI HÀM openDatePicker() – ĐẢM BẢO GỌI enableCellEditing()
function openDatePicker() {
    if (saveActions.style.display === 'flex') {
        if (!confirm('Bạn đang chỉnh sửa. Tạo lịch mới sẽ hủy thay đổi. Tiếp tục?')) return;
    }

    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay() + 1);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    startDate = formatISO(start);
    endDate = formatISO(end);

    scheduleData = { periodStart: startDate, periodEnd: endDate, shifts: {} };
    employees.forEach(emp => {
        scheduleData.shifts[emp.manv] = { mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' };
    });

    dateRangeEl.textContent = `${formatDate(startDate)} - ${formatDate(endDate)}`;
    pageTitle.textContent = 'Tạo lịch mới';
    actionButtons.classList.add('hidden');
    saveActions.style.display = 'flex';
    miniTrigger.style.display = 'block';

    renderTable();
    enableCellEditing(); // BẮT BUỘC GỌI LẠI SAU KHI RENDER
    document.querySelector('.main').classList.add('editing-mode');

    picker.classList.remove('active'); // Đóng picker ngay
}

// ==================== SỬA LỊCH ====================
function enterEditMode() {
    if (!scheduleData) return alert('Chưa có lịch để sửa!');
    originalData = JSON.parse(JSON.stringify(scheduleData));
    pageTitle.textContent = 'Sửa lịch';
    actionButtons.classList.add('hidden');
    saveActions.style.display = 'flex';
    miniTrigger.style.display = 'block';
    enableCellEditing();
}

// ==================== DATE PICKER (giữ nguyên logic chọn khoảng) ====================
function setupDatePicker() {
    const daysLeft = document.getElementById('days-left');
    const daysRight = document.getElementById('days-right');
    const monthTitles = document.querySelectorAll('.month-title');

    function renderCalendars() {
        renderMonth(daysLeft, monthTitles[0], displayedYear, displayedMonth);
        let nm = displayedMonth + 1, ny = displayedYear;
        if (nm > 11) { nm = 0; ny++; }
        renderMonth(daysRight, monthTitles[1], ny, nm);
    }

    function renderMonth(container, titleEl, y, m) {
        container.innerHTML = '';
        titleEl.textContent = `Tháng ${m + 1} ${y}`;
        const firstDay = new Date(y, m, 1).getDay();
        const offset = firstDay === 0 ? 6 : firstDay - 1;
        for (let i = 0; i < offset; i++) container.innerHTML += '<div class="day empty"></div>';
        const daysInMonth = new Date(y, m + 1, 0).getDate();
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            container.innerHTML += `<div class="day" data-date="${dateStr}">${d}</div>`;
        }
    }

    function highlight() {
        document.querySelectorAll('.day:not(.empty)').forEach(day => {
            day.classList.remove('selected', 'in-range');
            const cur = new Date(day.dataset.date);
            if (startDate && day.dataset.date === startDate) day.classList.add('selected');
            if (endDate && day.dataset.date === endDate) day.classList.add('selected');
            if (startDate && endDate && cur > new Date(startDate) && cur < new Date(endDate)) {
                day.classList.add('in-range');
            }
        });
    }

    document.querySelectorAll('#days-left, #days-right').forEach(c => {
        c.addEventListener('click', e => {
            if (!e.target.classList.contains('day') || e.target.classList.contains('empty')) return;
            const clicked = e.target.dataset.date;
            if (!startDate || endDate) {
                startDate = clicked; endDate = null;
            } else {
                if (new Date(clicked) < new Date(startDate)) {
                    endDate = startDate; startDate = clicked;
                } else endDate = clicked;
                startCreateSchedule(startDate, endDate);
            }
            highlight();
        });
    });

    document.querySelectorAll('.prev-month, .next-month').forEach(b => {
        b.onclick = () => {
            if (b.classList.contains('prev-month')) {
                displayedMonth--; if (displayedMonth < 0) { displayedMonth = 11; displayedYear--; }
            } else {
                displayedMonth++; if (displayedMonth > 11) { displayedMonth = 0; displayedYear++; }
            }
            renderCalendars(); highlight();
        };
    });

    // Đóng picker khi click ngoài
    document.addEventListener('click', e => {
        if (!picker.contains(e.target) && e.target !== miniTrigger && !miniTrigger.contains(e.target)) {
            picker.classList.remove('active');
        }
    });

    renderCalendars();
    highlight();
}

function formatDate(iso) {
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
}

function formatISO(date) {
    return date.toISOString().split('T')[0];
}

// ==================== BẢNG & CHỈNH SỬA ====================
function renderTable() {
    tbody.innerHTML = '';
    employees.forEach(emp => {
        const s = scheduleData?.shifts?.[emp.manv] || { mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' };
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="manv">${emp.manv}</td>
            <td>${emp.name}</td>
            <td>${emp.position}</td>
            <td class="shift-cell" data-day="mon">${s.mon || ''}</td>
            <td class="shift-cell" data-day="tue">${s.tue || ''}</td>
            <td class="shift-cell" data-day="wed">${s.wed || ''}</td>
            <td class="shift-cell" data-day="thu">${s.thu || ''}</td>
            <td class="shift-cell" data-day="fri">${s.fri || ''}</td>
            <td class="shift-cell" data-day="sat">${s.sat || ''}</td>
            <td class="shift-cell" data-day="sun">${s.sun || ''}</td>
        `;
        tbody.appendChild(tr);
    });
}

function enableCellEditing() {
    document.querySelectorAll('.shift-cell').forEach(cell => {
        cell.contentEditable = true;
        cell.style.background = '#fff9f0';
        cell.style.cursor = 'pointer';
        cell.onclick = function () {
            const opts = ['', 'S', 'C', 'T'];
            let cur = this.textContent.trim().toUpperCase();
            let idx = opts.indexOf(cur) + 1;
            if (idx >= opts.length) idx = 0;
            this.textContent = opts[idx];
            const manv = this.closest('tr').querySelector('.manv').textContent;
            const day = this.dataset.day;
            scheduleData.shifts[manv][day] = opts[idx];
        };
    });
}

function disableCellEditing() {
    document.querySelectorAll('.shift-cell').forEach(cell => {
        cell.contentEditable = false;
        cell.style.background = '';
        cell.style.cursor = 'default';
        cell.onclick = null;
    });
}

// ==================== HỦY & LƯU ====================
function backToViewMode() {
    // Kiểm tra xem có đang ở chế độ CHỈNH SỬA không
    const isEditing = saveActions.style.display === 'flex';

    if (isEditing) {
        // ĐANG CHỈNH SỬA → Hỏi xác nhận → Quay về chế độ XEM (màn hình chính Lịch làm việc)
        if (confirm('Bạn đang chỉnh sửa lịch làm việc.\nHủy sẽ mất toàn bộ thay đổi.\nBạn có chắc chắn muốn hủy không?')) {
            loadDefaultSampleSchedule(); // Load lại lịch mẫu hoặc lịch đã lưu
            actionButtons.classList.remove('hidden');
            saveActions.style.display = 'none';
            miniTrigger.style.display = 'none';
            pageTitle.textContent = 'Lịch làm';
            disableCellEditing();
            document.querySelector('.main').classList.remove('editing-mode');
        }
        // Nếu bấm "Hủy" trong confirm → không làm gì cả, vẫn ở trang chỉnh sửa
    } else {
        // ĐANG Ở MÀN HÌNH CHÍNH LỊCH LÀM VIỆC → Chuyển về trang BÁN HÀNG
        window.location.href = '../../Quan_ly_ban_hang/index.html';
    }
}

function showConfirmDialog() { confirmModal.style.display = 'flex'; }
function closeConfirmDialog() { confirmModal.style.display = 'none'; }
function saveSchedule() {
    localStorage.setItem('milano_schedule', JSON.stringify(scheduleData));
    closeConfirmDialog();
    alert('Đã lưu lịch làm việc thành công!');
    actionButtons.classList.remove('hidden');
    saveActions.style.display = 'none';
    miniTrigger.style.display = 'none';
    pageTitle.textContent = 'Lịch làm';
    disableCellEditing();
    document.querySelector('.main').classList.remove('editing-mode');
}