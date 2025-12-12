const defaultAttendance = [
    { manv: "NV0001", name: "Lê Văn A",      position: "Pha chế",   baseTotal: 15, adjust: "", reason: "", total: "15" },
    { manv: "NV0002", name: "Nguyễn Thị B",  position: "Pha chế",   baseTotal: 20, adjust: "", reason: "", total: "20" },
    { manv: "NV0003", name: "Trần Doãn C",    position: "Pha chế",   baseTotal: 10, adjust: "", reason: "", total: "10" },
    { manv: "NV0004", name: "Trần Đăng D",    position: "Pha chế",   baseTotal: 14, adjust: "", reason: "", total: "14" },
    { manv: "NV0005", name: "Lê Thị Hoài T",  position: "Phục vụ",   baseTotal: 21, adjust: "", reason: "", total: "21" },
    { manv: "NV0006", name: "Võ Thị M",       position: "Phục vụ",   baseTotal: 16, adjust: "", reason: "", total: "16" },
    { manv: "NV0007", name: "Lê Quang N",     position: "Phục vụ",   baseTotal: 9,  adjust: "", reason: "", total: "9" },
    { manv: "NV0008", name: "Nguyễn Văn V",   position: "Phục vụ",   baseTotal: 10, adjust: "", reason: "", total: "10" },
    { manv: "NV0009", name: "Cáp Thị K",      position: "Phục vụ",   baseTotal: 15, adjust: "", reason: "", total: "15" }
];

let attendanceData = [];
let isEditing = false;
let currentCell = null;

const tbody       = document.getElementById('attendanceBody');
const editBtn     = document.getElementById('editBtn');
const saveActions = document.getElementById('saveActions');

// Load dữ liệu
function loadData() {
    const saved = localStorage.getItem('milano_attendance_data');
    attendanceData = saved ? JSON.parse(saved) : [...defaultAttendance];

    // Khôi phục baseTotal + tính lại total
    attendanceData.forEach(item => {
        const orig = defaultAttendance.find(x => x.manv === item.manv);
        if (orig) item.baseTotal = orig.baseTotal;
        item.total = calculateTotal(item.baseTotal, item.adjust);
    });

    renderTable();
}

// Tính tổng công
function calculateTotal(base, adjustText) {
    if (!adjustText || adjustText.trim() === '') return base.toString();
    const match = adjustText.trim().match(/^([+-]?\d*\.?\d+)$/);
    if (!match) return base.toString();
    const val = parseFloat(match[1]);
    const result = base + val;
    return result < 0 ? "0" : result.toString();
}

// Render bảng
function renderTable() {
    tbody.innerHTML = '';
    attendanceData.forEach((row, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="manv">${row.manv}</td>
            <td>${row.name}</td>
            <td>${row.position}</td>
            <td class="cell adjust"   data-index="${idx}">${row.adjust || ''}</td>
            <td class="cell reason"   data-index="${idx}">${row.reason || ''}</td>
            <td class="total-display">${row.total}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Bật chế độ sửa – giống lịch làm
function enableEditing() {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.onclick = function(e) {
            if (currentCell && currentCell !== this) {
                finishEditing();
            }

            this.contentEditable = true;
            this.focus();
            currentCell = this;
            this.classList.add('editing');

            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(this);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
        };
    });

    isEditing = true;
    editBtn.classList.add('hidden');
    saveActions.style.display = 'flex';
}

// Kết thúc sửa ô hiện tại
function finishEditing() {
    if (!currentCell) return;

    const value = currentCell.textContent.trim();
    const index = parseInt(currentCell.dataset.index);
    const isAdjust = currentCell.classList.contains('adjust');

    if (isAdjust) {
        attendanceData[index].adjust = value;
        attendanceData[index].total = calculateTotal(attendanceData[index].baseTotal, value);

        // Cập nhật ô tổng công
        const totalCell = currentCell.closest('tr').querySelector('.total-display');
        totalCell.textContent = attendanceData[index].total;
        totalCell.style.color = value.startsWith('-') ? '#dc3545' : (value ? '#28a745' : '#333');
        totalCell.style.fontWeight = 'bold';
    } else {
        // Lý do
        attendanceData[index].reason = value;
    }

    currentCell.contentEditable = false;
    currentCell.classList.remove('editing');
    currentCell = null;
}

// Hủy bỏ
function cancelEdit() {
    if (confirm('Hủy tất cả thay đổi?')) {
        loadData();
        exitEditMode();
    }
}

// Lưu
function saveChanges() {
    localStorage.setItem('milano_attendance_data', JSON.stringify(attendanceData));
    closeConfirmDialog();
    exitEditMode();
    alert('Đã lưu bảng công thành công!');
}

function exitEditMode() {
    isEditing = false;
    currentCell = null;
    editBtn.classList.remove('hidden');
    saveActions.style.display = 'none';
    document.querySelectorAll('.cell').forEach(c => {
        c.contentEditable = false;
        c.classList.remove('editing');
        c.onclick = null;
    });
    renderTable();
}

function toggleEditMode() {
    if (!isEditing) enableEditing();
}

// Xử lý Enter / Escape / click ngoài
document.addEventListener('keydown', (e) => {
    if (!currentCell) return;
    if (e.key === 'Enter') {
        e.preventDefault();
        finishEditing();
    } else if (e.key === 'Escape') {
        const index = currentCell.dataset.index;
        const isAdjust = currentCell.classList.contains('adjust');
        currentCell.textContent = isAdjust ? attendanceData[index].adjust : attendanceData[index].reason;
        finishEditing();
    }
});

document.addEventListener('click', (e) => {
    if (currentCell && !currentCell.contains(e.target)) {
        finishEditing();
    }
});

// Popup
function showConfirmDialog() {
    document.getElementById('confirmModal').style.display = 'flex';
    document.getElementById('modalOverlay').style.display = 'block';
}

function closeConfirmDialog() {
    document.getElementById('confirmModal').style.display = 'none';
    document.getElementById('modalOverlay').style.display = 'none';
}

// Khởi động
document.addEventListener('DOMContentLoaded', loadData);