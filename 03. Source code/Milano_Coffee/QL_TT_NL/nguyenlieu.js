// QL_TT_NL.js – REALTIME SEARCH + ICON SVG ĐẸP NHƯ HÌNH

let materials = JSON.parse(localStorage.getItem('materials') || '[]');

// Dữ liệu mẫu nếu chưa có
if (materials.length === 0) {
    materials = [
        { id: "NL0001", name: "Sữa tươi không đường", qty: 30, unit: "Hộp", status: "available" },
        { id: "NL0002", name: "Cà phê hạt Arabica", qty: 5, unit: "Gói", status: "low" },
        { id: "NL0003", name: "Cà phê hạt Robusta", qty: 20, unit: "Gói", status: "available" },
        { id: "NL0004", name: "Bột trà matcha", qty: 15, unit: "Gói", status: "available" },
        { id: "NL0005", name: "Sữa đặc Ông Thọ", qty: 8, unit: "Lon", status: "low" },
        { id: "NL0006", name: "Đường trắng", qty: 25, unit: "Kg", status: "available" },
        { id: "NL0007", name: "Ly giấy 12oz", qty: 3, unit: "Bịch", status: "low" },
        { id: "NL0008", name: "Nắp ly nhựa", qty: 50, unit: "Bịch", status: "available" }
    ];
    localStorage.setItem('materials', JSON.stringify(materials));
}

function saveMaterials() {
    localStorage.setItem('materials', JSON.stringify(materials));
}

// TỰ ĐỘNG TẠO MÃ NGUYÊN LIỆU
function generateMaterialId() {
    if (materials.length === 0) return "NL0001";
    const last = materials[materials.length - 1].id;
    const num = parseInt(last.replace("NL", "")) + 1;
    return "NL" + String(num).padStart(4, '0');
}

// RENDER BẢNG – ICON SVG MÀU XÁM, HOVER ĐẸP
function renderMaterials(filtered = materials) {
    const tbody = document.getElementById('materialList');
    if (!tbody) return;

    tbody.innerHTML = filtered.map(m => `
        <tr>
            <td>${m.id}</td>
            <td>${m.name}</td>
            <td>${m.qty}</td>
            <td>${m.unit}</td>
            <td><span class="status ${m.status}">${m.qty <= 10 ? 'Sắp hết' : 'Còn hàng'}</span></td>
            <td class="action-buttons">
                <button class="action-btn edit-btn hover-gold" onclick="editMaterial('${m.id}')" title="Sửa">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 4H4C3.44772 4 3 4.44772 3 5V19C3 19.5523 3.44772 20 4 20H18C18.5523 20 19 19.5523 19 19V12" stroke="#999999" stroke-width="2"/>
                        <path d="M17.5 3.5L20.5 6.5L12 15H9V12L17.5 3.5Z" stroke="#999999" stroke-width="2"/>
                    </svg>
                </button>
                <button class="action-btn delete-btn hover-red" onclick="deleteMaterial('${m.id}')" title="Xóa">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6H5H21" stroke="#999999" stroke-width="2"/>
                        <path d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6M19 6V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V6H19Z" stroke="#999999" stroke-width="2"/>
                        <path d="M10 11V17" stroke="#999999" stroke-width="2"/>
                        <path d="M14 11V17" stroke="#999999" stroke-width="2"/>
                    </svg>
                </button>
            </td>
        </tr>
    `).join('');

    // Hiển thị thông báo khi không có kết quả
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:60px;color:#999;font-size:18px;">Không tìm thấy nguyên liệu nào!</td></tr>`;
    }
}

// TÌM KIẾM REALTIME – GÕ LÀ RA NGAY
const searchInput = document.getElementById('searchInput');

function performSearch() {
    const query = (searchInput?.value || '').trim().toLowerCase();
    const filtered = materials.filter(m =>
        m.id.toLowerCase().includes(query) ||
        m.name.toLowerCase().includes(query) ||
        m.unit.toLowerCase().includes(query)
    );
    renderMaterials(filtered);
}

// Gắn sự kiện realtime
if (searchInput) {
    searchInput.addEventListener('input', performSearch);
}

// Khi xóa hết chữ → hiện lại toàn bộ
searchInput?.addEventListener('search', () => {
    if (!searchInput.value) renderMaterials();
});

// MODAL THÊM / SỬA
window.openAddModal = function () {
    document.getElementById('modalTitle').textContent = "Thêm nguyên liệu mới";
    document.getElementById('materialForm').reset();
    document.getElementById('editId').value = '';
    document.getElementById('maNL').value = generateMaterialId();
    document.getElementById('materialModal').style.display = 'flex';
};

window.editMaterial = function (id) {
    const m = materials.find(x => x.id === id);
    if (!m) return;

    document.getElementById('modalTitle').textContent = "Sửa nguyên liệu";
    document.getElementById('editId').value = m.id;
    document.getElementById('maNL').value = m.id;
    document.getElementById('tenNL').value = m.name;
    document.getElementById('soLuong').value = m.qty;
    document.getElementById('donVi').value = m.unit;
    document.getElementById('materialModal').style.display = 'flex';
};

window.saveMaterial = function () {
    const id = document.getElementById('maNL').value.trim();
    const name = document.getElementById('tenNL').value.trim();
    const qty = parseInt(document.getElementById('soLuong').value);
    const unit = document.getElementById('donVi').value.trim();
    const editId = document.getElementById('editId').value;

    if (!name || isNaN(qty) || qty < 0 || !unit) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    if (editId) {
        const idx = materials.findIndex(m => m.id === editId);
        materials[idx] = { id, name, qty, unit, status: qty <= 10 ? 'low' : 'available' };
        alert("Sửa nguyên liệu thành công!");
    } else {
        if (materials.some(m => m.id === id)) {
            alert("Mã nguyên liệu đã tồn tại!");
            return;
        }
        materials.push({ id, name, qty, unit, status: qty <= 10 ? 'low' : 'available' });
        alert("Thêm nguyên liệu thành công!");
    }

    saveMaterials();
    closeModal();
    renderMaterials();
};

window.deleteMaterial = function (id) {
    if (confirm(`Xóa nguyên liệu ${id}?`)) {
        materials = materials.filter(m => m.id !== id);
        saveMaterials();
        renderMaterials();
    }
};

window.closeModal = function () {
    document.getElementById('materialModal').style.display = 'none';
};

// KHỞI ĐỘNG
document.addEventListener("DOMContentLoaded", function () {
    renderMaterials();
});