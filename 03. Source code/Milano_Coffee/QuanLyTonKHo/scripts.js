// ================== DỮ LIỆU TỒN KHO (giống hình) ==================
// ==================== PHÂN QUYỀN TASKBAR – SIÊU MƯỢT, CHẠY TẤT CẢ TRANG ====================
document.addEventListener("DOMContentLoaded", function () {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    // Nếu chưa đăng nhập → đá về login
    if (!user || !user.username) {
        window.location.href = "../Dang_nhap/dangnhap.html";
        return;
    }

    // Lấy chức vụ (hỗ trợ nhiều kiểu lưu: role, chucvu, position...)
    const chucVu = (user.role || user.chucvu || user.position || "").toLowerCase().trim();

    // Nếu KHÔNG PHẢI quản lý → ẨN TẤT CẢ MENU, CHỈ GIỮ LẠI BÁN HÀNG + TỒN KHO
    if (chucVu !== "quản lý" && chucVu !== "admin" && chucVu !== "owner") {
        // Ẩn tất cả dropdown và link không cần thiết
        const menusToHide = document.querySelectorAll(".taskbar a, .taskbar .dropdown");

        menusToHide.forEach(item => {
            const text = item.textContent.trim();
            const href = item.getAttribute("href") || "";

            // Chỉ giữ lại: Bán hàng và Tồn kho
            const isBanHang = text.includes("Bán hàng") || href.includes("Quan_ly_ban_hang");
            const isTonKho = text.includes("Tồn kho") || href.includes("QuanLyTonKHo");

            if (!isBanHang && !isTonKho) {
                item.style.display = "none"; // Ẩn hoàn toàn
            }
        });

        // Ẩn luôn cả các dropdown con (nếu có)
        document.querySelectorAll(".dropdown-menu").forEach(menu => {
            menu.style.display = "none";
        });
    }
    // Nếu là Quản lý → không làm gì → hiện full như cũ
});
// ====== "CSDL" NGUYÊN LIỆU (không dùng localStorage) ======
const materials = [
    { code: "NL001", name: "Cà phê hạt Robusta", unit: "kg", price: 150000 },
    { code: "NL002", name: "Cà phê hạt Arabica", unit: "kg", price: 260000 },
    { code: "NL003", name: "Sữa tươi tiệt trùng (1L)", unit: "hộp", price: 32000 },
    { code: "NL004", name: "Sữa đặc có đường", unit: "hộp", price: 28000 },
    { code: "NL005", name: "Kem béo thực vật (Rich's)", unit: "hộp", price: 25000 },
    { code: "NL006", name: "Topping Cream (Kem tươi)", unit: "hộp", price: 70000 },
    { code: "NL007", name: "Bột Cacao nguyên chất", unit: "túi", price: 120000 },
    { code: "NL008", name: "Bột Matcha Đài Loan", unit: "túi", price: 250000 },
    { code: "NL009", name: "Bột Frappe (Bột Mix)", unit: "túi", price: 90000 },
    { code: "NL010", name: "Trà đen (Hồng trà)", unit: "gói", price: 85000 },
    { code: "NL011", name: "Trà Lài (Lục trà)", unit: "gói", price: 90000 },
    { code: "NL012", name: "Trà Oolong", unit: "gói", price: 140000 },
    { code: "NL013", name: "Syrup Caramel (Siro)", unit: "hộp", price: 180000 },
    { code: "NL014", name: "Syrup Đào", unit: "hộp", price: 180000 },
    { code: "NL015", name: "Đào ngâm (Đóng lon)", unit: "hộp", price: 65000 },
    { code: "NL016", name: "Vải ngâm (Đóng lon)", unit: "hộp", price: 55000 },
    { code: "NL017", name: "Đường cát trắng", unit: "kg", price: 22000 },
    { code: "NL018", name: "Ly nhựa 500ml", unit: "bịch", price: 45000 },
    { code: "NL019", name: "Ống hút đen", unit: "bịch", price: 15000 },
    { code: "NL020", name: "Khăn giấy vuông", unit: "gói", price: 12000 }
];

function findMaterialByCode(code) {
    return materials.find(m => m.code === code.trim().toUpperCase()) || null;
}
function findMaterialByName(name) {
    return materials.find(m => m.name.toLowerCase().includes(name.trim().toLowerCase())) || null;
}
function formatMoney(v) {
    return Number(v).toLocaleString('vi-VN');
}

const inventory = [
    { id: "PX0090", nhanVien: "NV0002", thoiGian: "20/09/2025", tongTien: "340.000" },
    { id: "PX0089", nhanVien: "NV0001", thoiGian: "10/09/2025", tongTien: "1.980.000" },
    { id: "PX0088", nhanVien: "NV0004", thoiGian: "10/09/2025", tongTien: "1.200.000" },
    { id: "PX0088", nhanVien: "NV0004", thoiGian: "10/09/2025", tongTien: "1.200.000" },
    { id: "PX0088", nhanVien: "NV0004", thoiGian: "10/09/2025", tongTien: "1.200.000" },
    { id: "PX0088", nhanVien: "NV0004", thoiGian: "10/09/2025", tongTien: "1.200.000" },
    { id: "PX0088", nhanVien: "NV0004", thoiGian: "10/09/2025", tongTien: "1.200.000" },
    { id: "PX0088", nhanVien: "NV0004", thoiGian: "10/09/2025", tongTien: "1.200.000" },
    { id: "PX0088", nhanVien: "NV0004", thoiGian: "10/09/2025", tongTien: "1.200.000" }
];

// Lưu id mới thêm / cập nhật (giống scripts.js)
let lastAddedId = null;

// Lưu id phiếu mới vừa tạo để highlight
// Đang sửa phiếu nào
let currentEditingSlipId = null;
let slipIdToDelete = null;

// Biến trạng thái
let lastCreatedSlipId = null;
let lastUpdatedId = null;
let startDate = null;
let endDate = null;

// Chuyển dd/mm/yyyy → yyyy-mm-dd
function toISO(dateVN) {
    if (!dateVN) return null;
    const [d, m, y] = dateVN.split('/');
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

// ================== RENDER BẢNG CHÍNH ==================
function renderInventory() {
    const tbody = document.getElementById('inventoryList');
    if (!tbody) return;

    tbody.innerHTML = inventory.map(item => {
        const iso = toISO(item.thoiGian);
        return `<tr data-date="${iso}" class="${item.id === lastCreatedSlipId ? 'highlight-new' : item.id === lastUpdatedId ? 'highlight-updated' : ''}">
            <td>${item.id}</td>
            <td>${item.nhanVien}</td>
            <td>${item.thoiGian}</td>
            <td>${item.tongTien}</td>
            <td>
                <button class="action-btn view-btn" onclick="openViewModal('${item.id}')">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#999999" stroke-width="2"/>
                        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#999999" stroke-width="2"/>
                    </svg>
                </button>
                <button class="action-btn edit-btn" onclick="openEditModal('${item.id}')">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 4H4C3.44772 4 3 4.44772 3 5V19C3 19.5523 3.44772 20 4 20H18C18.5523 20 19 19.5523 19 19V12" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M17.5 3.5L20.5 6.5L12 15H9V12L17.5 3.5Z" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <button class="action-btn delete-btn" onclick="openDeletePopup('${item.id}')">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6H5H21" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6M19 6V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V6H19Z" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10 11V17" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M14 11V17" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </td>
        </tr>`;
    }).join('');

    filterTable(); // Áp dụng lại bộ lọc hiện tại
}

// ================== TÌM KIẾM REALTIME + LỌC NGÀY ==================
function filterTable() {
    const query = (document.getElementById("searchInput")?.value || "").trim().toLowerCase();
    const rows = document.querySelectorAll('#inventoryList tr');
    let hasVisible = false;

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const rowDate = row.dataset.date;

        const matchSearch = text.includes(query);
        let matchDate = true;
        if (startDate && endDate) matchDate = rowDate >= startDate && rowDate <= endDate;
        else if (startDate) matchDate = rowDate === startDate;

        if (matchSearch && matchDate) {
            row.style.display = "";
            hasVisible = true;
        } else {
            row.style.display = "none";
        }
    });

    const noResult = document.getElementById('noResultRow');
    if (!hasVisible && !noResult) {
        const tr = document.createElement('tr');
        tr.id = 'noResultRow';
        tr.innerHTML = `<td colspan="5" style="text-align:center;padding:60px 0;color:#e74c3c;font-size:18px;">
            Không tìm thấy phiếu xuất nào phù hợp!
        </td>`;
        document.getElementById('inventoryList').appendChild(tr);
    } else if (hasVisible && noResult) {
        noResult.remove();
    }
}

// ================== DATE PICKER ==================
document.addEventListener("DOMContentLoaded", function () {
    const dateInput = document.getElementById("dateInput");
    const picker = document.querySelector(".custom-date-picker");
    const btnApply = document.getElementById("btnApply");
    const searchInput = document.getElementById("searchInput");
    const btnCreate = document.getElementById("btnCreate");

    let displayedYear = new Date().getFullYear();
    let displayedMonth = new Date().getMonth();

    const daysLeft = document.getElementById("days-left");
    const daysRight = document.getElementById("days-right");
    const monthTitles = document.querySelectorAll(".month-title");

    function renderMonth(container, titleEl, y, m) {
        container.innerHTML = "";
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

    function renderCalendars() {
        renderMonth(daysLeft, monthTitles[0], displayedYear, displayedMonth);
        const nextM = displayedMonth + 1 < 12 ? displayedMonth + 1 : 0;
        const nextY = displayedMonth + 1 < 12 ? displayedYear : displayedYear + 1;
        renderMonth(daysRight, monthTitles[1], nextY, nextM);
    }

    function highlightDays() {
        document.querySelectorAll('.day').forEach(d => {
            d.classList.remove('selected', 'in-range');
            if (d.dataset.date === startDate || d.dataset.date === endDate) d.classList.add('selected');
            if (startDate && endDate && d.dataset.date > startDate && d.dataset.date < endDate) d.classList.add('in-range');
        });
    }

    document.body.addEventListener('click', e => {
        if (e.target.classList.contains('day') && !e.target.classList.contains('empty')) {
            const clicked = e.target.dataset.date;
            if (!startDate || endDate) {
                startDate = clicked; endDate = null;
            } else {
                if (clicked < startDate) { endDate = startDate; startDate = clicked; }
                else endDate = clicked;
                const [sy, sm, sd] = startDate.split('-');
                const [ey, em, ed] = endDate.split('-');
                dateInput.value = `${sd}/${sm}/${sy} - ${ed}/${em}/${ey}`;
                picker.classList.remove("active");
            }
            highlightDays();
        }
    });

    document.querySelectorAll(".prev-month").forEach(b => b.onclick = () => {
        displayedMonth--; if (displayedMonth < 0) { displayedMonth = 11; displayedYear--; }
        renderCalendars(); highlightDays();
    });
    document.querySelectorAll(".next-month").forEach(b => b.onclick = () => {
        displayedMonth++; if (displayedMonth > 11) { displayedMonth = 0; displayedYear++; }
        renderCalendars(); highlightDays();
    });

    dateInput.onclick = e => { e.stopPropagation(); picker.classList.toggle("active"); renderCalendars(); highlightDays(); };
    document.addEventListener('click', e => {
        if (!picker.contains(e.target) && e.target !== dateInput) picker.classList.remove("active");
    });

    searchInput.addEventListener('input', filterTable);
    btnApply.onclick = filterTable;
    btnCreate.onclick = openCreatePopup;

    renderCalendars();
    renderInventory();
});


// ================== CHI TIẾT TỪNG PHIẾU (dùng cho popup) ==================
const inventoryDetails = {
    "PX0090": {
        maPhieu: "PX0090",
        nhanVien: "Duc Anh",
        thoiGian: "10/09/2025",
        items: [
            { ma: "NL001", ten: "Bột cacao", donGia: "50.000", dvt: "gói", soLuong: 4, thanhTien: "100.000" },
            { ma: "NL002", ten: "Bột matcha", donGia: "60.000", dvt: "Hộp", soLuong: 2, thanhTien: "120.000" },
            { ma: "NL003", ten: "Đường", donGia: "20.000", dvt: "gói", soLuong: 2, thanhTien: "20.000" }
        ]
    }
    // nếu sau này có PX khác thì thêm vào đây
};

// ===== POPUP TẠO PHIẾU XUẤT KHO =====

// dùng luôn nút "Tạo phiếu" gọi openAddModal()
function openAddModal() {
    openCreatePopup();
}

function openCreatePopup() {
    const overlay = document.getElementById('createPopup');
    if (!overlay) return;

    // auto mã phiếu mới
    const maxNumber = inventory.reduce((max, item) => {
        const num = parseInt(String(item.id).replace(/\D/g, ''), 10);
        return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    const next = maxNumber + 1;
    const newId = "PX" + String(next).padStart(4, "0");

    document.getElementById('createMaPhieu').value = newId;

    // auto thời gian hiện tại
    const now = new Date();
    const dateStr = now.toLocaleDateString('vi-VN');
    document.getElementById('createThoiGian').value = `${dateStr}`;

    // người tạo: lấy từ góc trên nếu muốn
    const user = JSON.parse(localStorage.getItem("currentUser"));
    document.getElementById('createNguoiTao').value = user ? user.username : "";

    // xoá hết dòng cũ, tạo 1 dòng mới
    const tbody = document.getElementById('createItemsBody');
    tbody.innerHTML = "";
    addDetailRow();

    overlay.style.display = "flex";
}

function closeCreatePopup() {
    const overlay = document.getElementById('createPopup');
    if (overlay) overlay.style.display = "none";
}

function openCreateSuccessPopup() {
    const overlay = document.getElementById('createSuccessPopup');
    if (overlay) overlay.style.display = 'flex';
}

function closeCreateSuccessPopup() {
    const overlay = document.getElementById('createSuccessPopup');
    if (overlay) overlay.style.display = 'none';
}


// ================== RENDER BẢNG (giống scripts.js, thêm view button) ==================
function renderInventory() {
    const tbody = document.getElementById('inventoryList');
    if (!tbody) return;

    tbody.innerHTML = inventory.map(item => `
    <tr class="${item.id === lastCreatedSlipId
            ? 'highlight-new'
            : (item.id === lastUpdatedId ? 'highlight-updated' : '')
        }">

      <td>${item.id}</td>
      <td>${item.nhanVien}</td>
      <td>${item.thoiGian}</td>
      <td>${item.tongTien}</td>
      <td>
        <button class="action-btn view-btn" onclick="openViewModal('${item.id}')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#999999" stroke-width="2"/>
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#999999" stroke-width="2"/>
          </svg>
        </button>
        <button class="action-btn edit-btn" onclick="openEditModal('${item.id}')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 4H4C3.44772 4 3 4.44772 3 5V19C3 19.5523 3.44772 20 4 20H18C18.5523 20 19 19.5523 19 19V12" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M17.5 3.5L20.5 6.5L12 15H9V12L17.5 3.5Z" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="action-btn delete-btn" onclick="openDeletePopup('${item.id}')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6H5H21" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6M19 6V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V6H19Z" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10 11V17" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 11V17" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </td>
    </tr>
  `).join('');
}


// Khởi tạo bảng
renderInventory();




// ================== POPUP XEM CHI TIẾT PHIẾU ==================
function openViewModal(id) {
    const popup = document.getElementById('viewPopup');
    if (!popup) return;

    const detail = inventoryDetails[id];
    if (!detail) {
        alert("Chưa khai báo chi tiết cho phiếu " + id);
        return;
    }

    document.getElementById('detailMaPhieu').textContent = detail.maPhieu;
    document.getElementById('detailNhanVien').textContent = detail.nhanVien;
    document.getElementById('detailThoiGian').textContent = detail.thoiGian;

    const tbody = document.getElementById('detailItemsBody');
    tbody.innerHTML = detail.items.map((item, index) => `
    <tr>
      <td>${String(index + 1).padStart(2, "0")}</td>
      <td>${item.ma}</td>
      <td>${item.ten}</td>
      <td>${item.donGia}</td>
      <td>${item.dvt}</td>
      <td>${item.soLuong}</td>
      <td>${item.thanhTien}</td>
    </tr>
  `).join('');

    popup.style.display = 'flex';
}


function openEditModal(id) {
    const overlay = document.getElementById('editPopup');
    if (!overlay) return;

    const detail = inventoryDetails[id];
    if (!detail) {
        alert("Chưa có dữ liệu chi tiết cho phiếu " + id);
        return;
    }

    currentEditingSlipId = id;

    // Fill info đầu phiếu (readonly)
    document.getElementById('editMaPhieu').value = detail.maPhieu || id;
    document.getElementById('editThoiGian').value = detail.thoiGian || "";
    document.getElementById('editNguoiTao').value = detail.nhanVien || "";

    // Fill bảng chi tiết
    const tbody = document.getElementById('editItemsBody');
    tbody.innerHTML = "";

    detail.items.forEach((item, index) => {
        const tr = document.createElement('tr');

        const stt = String(index + 1).padStart(2, '0');

        // Lấy lại đơn giá & đơn vị: ưu tiên từ bảng materials
        const mat = findMaterialByCode(item.ma || item.code) ||
            findMaterialByName(item.ten || item.name) || null;

        const priceNumber =
            mat ? mat.price :
                (typeof item.donGia === 'number'
                    ? item.donGia
                    : parseInt(String(item.donGia || "").replace(/\D/g, ''), 10) || 0);

        const unitText = mat ? mat.unit : (item.dvt || item.unit || "");

        tr.innerHTML = `
      <td><input class="create-stt" type="text" value="${stt}" readonly></td>
      <td><input type="text" class="cell-code" value="${item.ma || item.code || ""}"></td>
      <td><input type="text" class="cell-name" value="${item.ten || item.name || ""}"></td>
      <td><input type="text" class="cell-price" readonly></td>
      <td><input type="text" class="cell-unit" readonly></td>
      <td><input type="number" class="cell-qty" min="0" value="${item.soLuong || item.qty || 0}"></td>
      <td><input type="text" class="cell-total" readonly></td>
    `;

        tbody.appendChild(tr);

        // set price / unit / total
        const priceInput = tr.querySelector('.cell-price');
        const unitInput = tr.querySelector('.cell-unit');
        const qtyInput = tr.querySelector('.cell-qty');
        const totalInput = tr.querySelector('.cell-total');

        priceInput.dataset.value = priceNumber;
        priceInput.value = priceNumber ? formatMoney(priceNumber) : "";
        unitInput.value = unitText;

        // Tổng tiền ban đầu
        const lineTotal = priceNumber * Number(qtyInput.value || 0);
        totalInput.value = lineTotal ? formatMoney(lineTotal) : "";

        // Gắn sự kiện giống tạo phiếu (sửa được code / name / qty)
        attachRowEvents(tr);
    });

    overlay.style.display = 'flex';
}

function closeEditPopup() {
    const overlay = document.getElementById('editPopup');
    if (overlay) overlay.style.display = 'none';
    currentEditingSlipId = null;
}

function closeViewModal() {
    const popup = document.getElementById('viewPopup');
    if (popup) popup.style.display = 'none';
}




// Các function popup, add, edit, delete giống scripts.js, nhưng thay employees bằng inventory, và adjust ID
// ... (copy từ scripts.js, thay tên biến và ID tương ứng: employee -> inventory, NV -> PX, v.v.)

// Ví dụ: function generateNewId() { ... return "PX" + String(next).padStart(4, "0"); }

// LocalStorage giống
const STORAGE_KEY = "dsTonKho";
inventory = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
renderInventory();
localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));


function addDetailRow() {
    const tbody = document.getElementById('createItemsBody');
    const index = tbody.querySelectorAll('tr').length + 1;

    const tr = document.createElement('tr');
    tr.innerHTML = `
    <td><input class="create-stt" type="text"
               value="${String(index).padStart(2, '0')}" readonly></td>
    <td><input type="text" class="cell-code" placeholder="NL001"></td>
    <td><input type="text" class="cell-name" placeholder="Cà phê hạt..."></td>
    <td><input type="text" class="cell-price" readonly></td>
    <td><input type="text" class="cell-unit" readonly></td>
    <td><input type="number" class="cell-qty" min="0" value="0"></td>
    <td><input type="text" class="cell-total" readonly></td>
  `;
    tbody.appendChild(tr);
    attachRowEvents(tr);
}



function renumberRows() {
    const rows = document.querySelectorAll('#createItemsBody tr');
    rows.forEach((tr, idx) => {
        const sttInput = tr.querySelector('.create-stt');
        if (sttInput) sttInput.value = String(idx + 1).padStart(2, '0');
    });
}

function attachRowEvents(tr) {
    const codeInput = tr.querySelector('.cell-code');
    const nameInput = tr.querySelector('.cell-name');
    const qtyInput = tr.querySelector('.cell-qty');
    const priceInput = tr.querySelector('.cell-price');
    const unitInput = tr.querySelector('.cell-unit');
    const totalInput = tr.querySelector('.cell-total');

    // chọn theo MÃ
    codeInput.addEventListener('change', () => {
        const mat = findMaterialByCode(codeInput.value);
        if (mat) {
            codeInput.value = mat.code;
            nameInput.value = mat.name;
            unitInput.value = mat.unit;
            priceInput.dataset.value = mat.price;
            priceInput.value = formatMoney(mat.price);
            updateRowTotal(tr);
            autoAddRowIfNeeded(tr);
        } else {
            nameInput.value = "";
            unitInput.value = "";
            priceInput.value = "";
            priceInput.dataset.value = "0";
            totalInput.value = "";
        }
    });

    // chọn theo TÊN
    nameInput.addEventListener('change', () => {
        const mat = findMaterialByName(nameInput.value);
        if (mat) {
            codeInput.value = mat.code;
            nameInput.value = mat.name;
            unitInput.value = mat.unit;
            priceInput.dataset.value = mat.price;
            priceInput.value = formatMoney(mat.price);
            updateRowTotal(tr);
            autoAddRowIfNeeded(tr);
        } else {
            codeInput.value = "";
            unitInput.value = "";
            priceInput.value = "";
            priceInput.dataset.value = "0";
            totalInput.value = "";
        }
    });

    // nhập SỐ LƯỢNG
    qtyInput.addEventListener('input', () => {
        // ép về số nguyên, tự bỏ hết 0 ở đầu
        const raw = qtyInput.value;
        const num = parseInt(raw || '0', 10);

        if (isNaN(num) || num < 0) {
            qtyInput.value = '0';
        } else {
            qtyInput.value = String(num);   // ví dụ '002' -> 2
        }

        updateRowTotal(tr);
        autoAddRowIfNeeded(tr);
    });

}





function updateRowTotal(tr) {
    const qtyInput = tr.querySelector('.cell-qty');
    const priceInput = tr.querySelector('.cell-price');
    const totalInput = tr.querySelector('.cell-total');

    const qty = Number(qtyInput.value || 0);
    const price = Number(priceInput.dataset.value || 0);
    const total = qty * price;

    totalInput.value = total ? formatMoney(total) : "";
}
function autoAddRowIfNeeded(tr) {
    const tbody = document.getElementById('createItemsBody');
    const qtyInput = tr.querySelector('.cell-qty');
    const priceInput = tr.querySelector('.cell-price');
    const totalInput = tr.querySelector('.cell-total');

    const qty = Number(qtyInput.value || 0);
    const price = Number(priceInput.dataset.value || 0);

    // chỉ khi: có đơn giá, số lượng > 0, có thành tiền
    if (price > 0 && qty > 0 && totalInput.value.trim() !== "") {
        // và đây là dòng cuối cùng
        if (tbody.lastElementChild === tr) {
            addDetailRow();
        }
    }
}

function saveEditedSlip() {
    if (!currentEditingSlipId) {
        closeEditPopup();
        return;
    }

    const maPhieu = document.getElementById('editMaPhieu').value.trim();
    const thoiGian = document.getElementById('editThoiGian').value.trim();
    const nguoiTao = document.getElementById('editNguoiTao').value.trim() || "N/A";

    const rows = document.querySelectorAll('#editItemsBody tr');
    let totalMoney = 0;
    const detailItems = [];

    rows.forEach((tr) => {
        const code = tr.querySelector('.cell-code').value.trim();
        const name = tr.querySelector('.cell-name').value.trim();
        const unit = tr.querySelector('.cell-unit').value.trim();
        const qty = Number(tr.querySelector('.cell-qty').value || 0);
        const price = Number(tr.querySelector('.cell-price').dataset.value || 0);

        if (!code || !name || qty <= 0) return; // bỏ dòng rỗng

        const lineTotal = qty * price;
        totalMoney += lineTotal;

        detailItems.push({ code, name, unit, qty, price, total: lineTotal });
    });

    if (!detailItems.length) {
        alert("Chưa nhập dòng chi tiết nào.");
        return;
    }

    // Cập nhật bảng inventory (dòng trên màn hình chính)
    const idx = inventory.findIndex(item => item.id === currentEditingSlipId);
    if (idx !== -1) {
        inventory[idx] = {
            id: maPhieu,
            nhanVien: nguoiTao,
            thoiGian: thoiGian,
            tongTien: formatMoney(totalMoney)
        };
    }

    // Cập nhật chi tiết cho popup xem / sửa
    inventoryDetails[maPhieu] = {
        maPhieu,
        nhanVien: nguoiTao,
        thoiGian,
        items: detailItems.map(it => ({
            ma: it.code,
            ten: it.name,
            donGia: formatMoney(it.price),
            dvt: it.unit,
            soLuong: it.qty,
            thanhTien: formatMoney(it.total)
        }))
    };

    // Nếu đổi mã phiếu, xóa key cũ
    if (maPhieu !== currentEditingSlipId && inventoryDetails[currentEditingSlipId]) {
        delete inventoryDetails[currentEditingSlipId];
    }

    currentEditingSlipId = null;
    closeEditPopup();


    // Highlight dòng vừa cập nhật (nếu muốn)
    lastUpdatedId = maPhieu;
    renderInventory();
    const titleEl = document.querySelector('#createSuccessOverlay .create-success-title');
    if (titleEl) titleEl.textContent = 'ĐÃ CẬP NHẬT THÀNH CÔNG';

    // MỞ POPUP THÔNG BÁO
    openCreateSuccess();
    setTimeout(() => {
        if (lastUpdatedId === maPhieu) {
            lastUpdatedId = null;
            renderInventory();
        }
    }, 3000);
}



function saveSlip() {
    const maPhieu = document.getElementById('createMaPhieu').value.trim();
    const thoiGian = document.getElementById('createThoiGian').value.trim();
    const nguoiTao = document.getElementById('createNguoiTao').value.trim() || "N/A";

    const rows = document.querySelectorAll('#createItemsBody tr');
    let totalMoney = 0;

    const detailItems = [];

    rows.forEach((tr) => {
        const code = tr.querySelector('.cell-code').value.trim();
        const name = tr.querySelector('.cell-name').value.trim();
        const unit = tr.querySelector('.cell-unit').value.trim();
        const qty = Number(tr.querySelector('.cell-qty').value || 0);
        const price = Number(tr.querySelector('.cell-price').dataset.value || 0);

        if (!code || !name || !qty) return; // bỏ dòng trống

        const lineTotal = qty * price;
        totalMoney += lineTotal;

        detailItems.push({ code, name, unit, qty, price, total: lineTotal });
    });

    if (!detailItems.length) {
        alert("Chưa nhập dòng chi tiết nào.");
        return;
    }

    // Thêm vào bảng tồn kho (dùng biến inventory có sẵn)
    inventory.unshift({
        id: maPhieu,
        nhanVien: nguoiTao,
        thoiGian: thoiGian,
        tongTien: formatMoney(totalMoney)
    });

    // nếu mày có object inventoryDetails cho popup mắt thì có thể lưu luôn:
    if (typeof inventoryDetails === "object") {
        inventoryDetails[maPhieu] = {
            maPhieu: maPhieu,
            nhanVien: nguoiTao,
            thoiGian: thoiGian,
            items: detailItems.map((it) => ({
                ma: it.code,
                ten: it.name,
                donGia: formatMoney(it.price),
                dvt: it.unit,
                soLuong: it.qty,
                thanhTien: formatMoney(it.total)
            }))
        };
    }

    renderInventory();
    closeCreatePopup();
    // ĐÁNH DẤU phiếu mới để highlight
    lastCreatedSlipId = maPhieu;
    renderInventory();   // vẽ lại để thêm class highlight

    // Hiện popup "ĐÃ TẠO THÀNH CÔNG"
    openCreateSuccess();

    // Tự tắt highlight sau 3s
    setTimeout(() => {
        if (lastCreatedSlipId === maPhieu) {
            lastCreatedSlipId = null;
            renderInventory();
        }
    }, 3000);
}

function openCreateSuccess() {
    const ov = document.getElementById('createSuccessOverlay');
    if (ov) ov.style.display = 'flex';
}

function closeCreateSuccess() {
    const ov = document.getElementById('createSuccessOverlay');
    if (ov) ov.style.display = 'none';
}
function openEditSuccess() {
    const ov = document.getElementById('editSuccessOverlay');
    if (ov) ov.style.display = 'flex';
}

function closeEditSuccess() {
    const ov = document.getElementById('editSuccessOverlay');
    if (ov) ov.style.display = 'none';
}
function openDeletePopup(id) {
    slipIdToDelete = id;
    document.getElementById('deleteOverlay').style.display = "flex";
}
function closeDeletePopup() {
    slipIdToDelete = null;
    document.getElementById('deleteOverlay').style.display = "none";
}

function openDeleteSuccess() {
    document.getElementById('deleteSuccessOverlay').style.display = "flex";
}

function closeDeleteSuccess() {
    document.getElementById('deleteSuccessOverlay').style.display = "none";
}


function confirmDeleteSlip() {
    if (!slipIdToDelete) return;

    // Xóa dữ liệu
    const idx = inventory.findIndex(x => x.id === slipIdToDelete);
    if (idx !== -1) inventory.splice(idx, 1);

    closeDeletePopup();
    renderInventory();

    // Mở popup “ĐÃ XÓA THÀNH CÔNG”
    openDeleteSuccess();
}

