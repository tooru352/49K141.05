const defaultData = [
    { manv: "NV0001", name: "Lê Văn A",      position: "Pha chế",   base: "22k/giờ", allowance: "25k/ca", bonus: "100k", penalty: "" },
    { manv: "NV0002", name: "Nguyễn Thị B",  position: "Pha chế",   base: "22k/giờ", allowance: "25k/ca", bonus: "100k", penalty: "" },
    { manv: "NV0003", name: "Trần Doãn C",   position: "Pha chế",   base: "22k/giờ", allowance: "",       bonus: "",     penalty: "" },
    { manv: "NV0004", name: "Trần Đăng D",   position: "Pha chế",   base: "22k/giờ", allowance: "25k/ca", bonus: "",     penalty: "20k" },
    { manv: "NV0005", name: "Lê Thị Hoài T", position: "Phục vụ",   base: "20k/giờ", allowance: "",       bonus: "",     penalty: "" },
    { manv: "NV0006", name: "Võ Thị M",      position: "Phục vụ",   base: "20k/giờ", allowance: "",       bonus: "",     penalty: "20k" },
    { manv: "NV0007", name: "Lê Quang N",    position: "Phục vụ",   base: "20k/giờ", allowance: "25k/ca", bonus: "",     penalty: "50k" },
    { manv: "NV0008", name: "Nguyễn Văn V",  position: "Phục vụ",   base: "20k/giờ", allowance: "25k/ca", bonus: "",     penalty: "" },
    { manv: "NV0009", name: "Cáp Thị K",     position: "Phục vụ",   base: "20k/giờ", allowance: "",       bonus: "",     penalty: "" }
];

let salaryData = [];
let isEditing = false;
let currentCell = null;

const tbody       = document.getElementById('salaryBody');
const editBtn     = document.getElementById('editBtn');
const saveActions = document.getElementById('saveActions');

// Load dữ liệu
function loadData() {
    const saved = localStorage.getItem('milano_salary_data');
    salaryData = saved ? JSON.parse(saved) : [...defaultData];
    renderTable();
}

// Render bảng
function renderTable() {
    tbody.innerHTML = '';
    salaryData.forEach((row, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="manv">${row.manv}</td>
            <td class="cell" data-field="name"      data-index="${idx}">${row.name}</td>
            <td class="cell" data-field="position"  data-index="${idx}">${row.position}</td>
            <td class="cell" data-field="base"      data-index="${idx}">${row.base}</td>
            <td class="cell" data-field="allowance" data-index="${idx}">${row.allowance}</td>
            <td class="cell bonus ${row.bonus ? 'filled' : ''}" data-field="bonus"    data-index="${idx}">${row.bonus}</td>
            <td class="cell penalty ${row.penalty ? 'filled' : ''}" data-field="penalty"  data-index="${idx}">${row.penalty}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Bật chế độ sửa – click để nhập
function enableEditing() {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.onclick = function (e) {
            if (currentCell && currentCell !== this) {
                finishEditing();
            }

            this.contentEditable = true;
            this.focus();
            currentCell = this;
            this.classList.add('editing');

            // Đặt con trỏ cuối dòng
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
    const field = currentCell.dataset.field;

    // Cập nhật mảng dữ liệu
    salaryData[index][field] = value;

    // Cập nhật class filled cho thưởng/phạt
    if (field === 'bonus' || field === 'penalty') {
        if (value === '') {
            currentCell.classList.remove('filled');
        } else {
            currentCell.classList.add('filled');
        }
    }

    currentCell.contentEditable = false;
    currentCell.classList.remove('editing');
    currentCell = null;
}

// Hủy bỏ
function cancelEdit() {
    if (confirm('Hủy tất cả thay đổi và quay lại dữ liệu cũ?')) {
        loadData();
        exitEditMode();
    }
}

// Lưu vào localStorage
function saveChanges() {
    localStorage.setItem('milano_salary_data', JSON.stringify(salaryData));
    closeConfirmDialog();
    exitEditMode();
    alert('Đã lưu bảng lương thành công!');
}

// Thoát chế độ sửa
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
}

// Toggle chế độ
function toggleEditMode() {
    if (!isEditing) enableEditing();
}

// Xử lý phím Enter / Escape / click ngoài
document.addEventListener('keydown', (e) => {
    if (!currentCell) return;
    if (e.key === 'Enter') {
        e.preventDefault();
        finishEditing();
    } else if (e.key === 'Escape') {
        currentCell.textContent = salaryData[currentCell.dataset.index][currentCell.dataset.field];
        finishEditing();
    }
});

document.addEventListener('click', (e) => {
    if (currentCell && !currentCell.contains(e.target)) {
        finishEditing();
    }
});

// Popup xác nhận
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