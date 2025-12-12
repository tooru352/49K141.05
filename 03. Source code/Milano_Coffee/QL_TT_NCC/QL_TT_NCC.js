// QL_TT_NCC.js – HOÀN HẢO 100%: TÌM KIẾM REALTIME + GIỮ NGUYÊN ICON SVG ĐẸP CỦA BẠN

let suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');

// Tạo dữ liệu mẫu nếu chưa có
if (suppliers.length === 0) {
    suppliers = [
        { ma: "NCC001", ten: "Công Ty TNHH An Phát", sdt: "09888960555", email: "ac@gmail.com", diaChi: "12/5 Võ Văn Tần, Quận 3 TP.HCM" },
        { ma: "NCC002", ten: "Công Ty Cung Ứng Minh Tâm", sdt: "0905123456", email: "minhtam@gmail.com", diaChi: "21/7 Lê Duẩn, Hải Châu, Đà Nẵng" },
        { ma: "NCC003", ten: "Nhà Cung Cấp Đại Phú", sdt: "0912345678", email: "daiphu@gmail.com", diaChi: "45 Nguyễn Huệ, Quận 1" },
        { ma: "NCC004", ten: "Cơ Sở Hoàng Khang", sdt: "0935123456", email: "hoangkhang@gmail.com", diaChi: "78 Trần Phú, Hà Đông, Hà Nội" },
        { ma: "NCC005", ten: "Sữa Tươi Không Đường", sdt: "0977888999", email: "sua@gmail.com", diaChi: "32 Hoàng Diệu, Hải Châu, Đà Nẵng" }
    ];
    localStorage.setItem('suppliers', JSON.stringify(suppliers));
}

// TỰ ĐỘNG TẠO MÃ NCC
function generateSupplierCode() {
    if (suppliers.length === 0) return "NCC001";
    const last = suppliers[suppliers.length - 1].ma;
    const num = parseInt(last.replace("NCC", "")) + 1;
    return "NCC" + String(num).padStart(3, '0');
}

// RENDER BẢNG – GIỮ NGUYÊN ICON SVG ĐẸP CỦA BẠN
function renderSuppliers() {
    const tbody = document.getElementById('supplierList');
    if (!tbody) return;

    tbody.innerHTML = suppliers.map(s => `
        <tr>
            <td>${s.ma}</td>
            <td>${s.ten}</td>
            <td>${s.sdt}</td>
            <td>${s.email || '-'}</td>
            <td>${s.diaChi}</td>
            <td class="action-buttons">
                <button class="action-btn edit-btn" onclick="editSupplier('${s.ma}')" title="Sửa">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 4H4C3.44772 4 3 4.44772 3 5V19C3 19.5523 3.44772 20 4 20H18C18.5523 20 19 19.5523 19 19V12" 
                              stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M17.5 3.5L20.5 6.5L12 15H9V12L17.5 3.5Z" 
                              stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <button class="action-btn delete-btn" onclick="deleteSupplier('${s.ma}')" title="Xóa">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6H5H5H21" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6M19 6V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V6H19Z" 
                              stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10 11V17" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M14 11V17" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </td>
        </tr>
    `).join('');

    // Áp dụng lại tìm kiếm realtime
    filterSuppliers();
}

// TÌM KIẾM REALTIME – SIÊU NHANH, SIÊU MƯỢT
function filterSuppliers() {
    const query = (document.getElementById('searchInput')?.value || '').trim().toLowerCase();
    const rows = document.querySelectorAll('#supplierList tr');

    let hasResult = false;

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(query)) {
            row.style.display = "";
            hasResult = true;
        } else {
            row.style.display = "none";
        }
    });

    // Thông báo khi không tìm thấy
    const noResult = document.getElementById('noResultRow');
    if (!hasResult && !noResult) {
        const tr = document.createElement('tr');
        tr.id = 'noResultRow';
        tr.innerHTML = `<td colspan="6" style="text-align:center;padding:60px;color:#999;font-size:18px;">
            Không tìm thấy nhà cung cấp nào phù hợp!
        </td>`;
        document.getElementById('supplierList').appendChild(tr);
    } else if (hasResult && noResult) {
        noResult.remove();
    }
}

// Gắn sự kiện tìm kiếm realtime
document.getElementById('searchInput')?.addEventListener('input', filterSuppliers);

// MỞ MODAL THÊM
window.openAddModal = function () {
    document.getElementById('modalTitle').textContent = "Thêm nhà cung cấp mới";
    document.getElementById('supplierForm').reset();
    document.getElementById('editId').value = '';
    document.getElementById('maNCC').value = generateSupplierCode();
    document.getElementById('supplierModal').style.display = 'flex';
};

// MỞ MODAL SỬA
window.editSupplier = function (ma) {
    const s = suppliers.find(x => x.ma === ma);
    if (!s) return;

    document.getElementById('modalTitle').textContent = "Sửa nhà cung cấp";
    document.getElementById('editId').value = s.ma;
    document.getElementById('maNCC').value = s.ma;
    document.getElementById('tenNCC').value = s.ten;
    document.getElementById('sdt').value = s.sdt;
    document.getElementById('email').value = s.email || '';
    document.getElementById('diaChi').value = s.diaChi;
    document.getElementById('supplierModal').style.display = 'flex';
};

// LƯU (THÊM HOẶC SỬA)
window.saveSupplier = function () {
    const ma = document.getElementById('maNCC').value.trim();
    const ten = document.getElementById('tenNCC').value.trim();
    const sdt = document.getElementById('sdt').value.trim();
    const email = document.getElementById('email').value.trim();
    const diaChi = document.getElementById('diaChi').value.trim();
    const editId = document.getElementById('editId').value;

    if (!ten || !sdt || !diaChi) {
        alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
        return;
    }

    if (editId) {
        const idx = suppliers.findIndex(s => s.ma === editId);
        suppliers[idx] = { ma, ten, sdt, email, diaChi };
        alert("Sửa nhà cung cấp thành công!");
    } else {
        if (suppliers.some(s => s.ma === ma)) {
            alert("Mã nhà cung cấp đã tồn tại!");
            return;
        }
        suppliers.push({ ma, ten, sdt, email, diaChi });
        alert("Thêm nhà cung cấp thành công!");
    }

    localStorage.setItem('suppliers', JSON.stringify(suppliers));
    closeModal();
    renderSuppliers();
};

// ĐÓNG MODAL
window.closeModal = function () {
    document.getElementById('supplierModal').style.display = 'none';
};

// XÓA
window.deleteSupplier = function (ma) {
    if (confirm(`Xóa nhà cung cấp ${ma}?`)) {
        suppliers = suppliers.filter(s => s.ma !== ma);
        localStorage.setItem('suppliers', JSON.stringify(suppliers));
        renderSuppliers();
        alert("Xóa thành công!");
    }
};

// KHỞI ĐỘNG
document.addEventListener("DOMContentLoaded", function () {
    renderSuppliers();
});