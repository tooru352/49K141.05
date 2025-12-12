// js/script.js – ĐÃ SỬA HOÀN HẢO: BÀN TỰ ĐỘNG CHUYỂN MÀU KHI ĐẶT MÓN
const grid = document.getElementById('tablesGrid');
let currentTable = null;

// === THÊM 2 DÒNG NÀY ĐỂ ĐỌC DỮ LIỆU TỪ LOCALSTORAGE KHI MỞ TRANG ===
let tables = JSON.parse(localStorage.getItem('tables') || '[]');
// Nếu chưa có dữ liệu → dùng dữ liệu mặc định
if (tables.length === 0) {
    tables = [
        { id: 1, number: "BÀN 01", status: "empty", orderCounter: 0, items: [] },
        { id: 2, number: "BÀN 02", status: "empty", orderCounter: 0, items: [] },
        { id: 3, number: "BÀN 03", status: "empty", orderCounter: 0, items: [] },
        { id: 4, number: "BÀN 04", status: "empty", orderCounter: 0, items: [] },
        { id: 5, number: "BÀN 05", status: "empty", orderCounter: 0, items: [] },
        { id: 6, number: "BÀN 06", status: "empty", orderCounter: 0, items: [] },
        { id: 7, number: "BÀN 07", status: "empty", orderCounter: 0, items: [] },
        { id: 8, number: "BÀN 08", status: "empty", orderCounter: 0, items: [] },
        { id: 9, number: "BÀN 09", status: "empty", orderCounter: 0, items: [] },
        { id: 10, number: "BÀN 10", status: "empty", orderCounter: 0, items: [] },
        // ... thêm bàn khác
    ];
    localStorage.setItem('tables', JSON.stringify(tables));
}

// Cập nhật lại localStorage mỗi khi có thay đổi (thêm hàm này)
function saveTables() {
    localStorage.setItem('tables', JSON.stringify(tables));
}

// ==================== TÍNH TIỀN ====================
function calculateTotal() {
    if (!currentTable || currentTable.items.length === 0) return { finalTotal: 0 };
    const subtotal = currentTable.items.reduce((s, i) => s + i.qty * i.price, 0);
    const discount = parseFloat(document.getElementById('discountInput').value.replace('%', '')) || 0;
    return { finalTotal: Math.round(subtotal * (1 - discount / 100)) };
}

function updateTotalDisplay() {
    const { finalTotal } = calculateTotal();
    document.getElementById('totalAmount').textContent = finalTotal.toLocaleString() + 'đ';
}

// ==================== RENDER BÀN ====================
function renderTables() {
    grid.innerHTML = '';
    tables.forEach(table => {
        const btn = document.createElement('button');
        btn.dataset.tableId = table.id;
        btn.className = `table-btn ${table.status === 'occupied' ? 'occupied' : ''} ${currentTable?.id === table.id ? 'active' : ''}`;
        btn.innerHTML = `
      <div class="table-number">${table.number}</div>
      <div class="status">${table.status === 'occupied' ? 'Đang phục vụ' : 'Bàn trống'}</div>
    `;

        btn.onclick = () => {
            const clickedTable = tables.find(t => t.id == btn.dataset.tableId);
            if (clickedTable.status === 'empty') {
                window.location.href = `../Chon_mon/Danh_sach_mon.html?table=${clickedTable.id}`;
            } else {
                selectTable(clickedTable);
            }
        };
        grid.appendChild(btn);
    });
}

// ==================== CHỌN BÀN ====================
function selectTable(table) {
    currentTable = table;

    if (table.orderCounter === 0) {
        table.orderCounter = 1;
    }

    const tableNum = table.number.replace("BÀN ", "");
    document.getElementById('currentTable').textContent = `HD${table.orderCounter}-B${tableNum}`;

    const itemsDiv = document.getElementById('orderItems');
    itemsDiv.innerHTML = table.items.length > 0
        ? table.items.map(item => `
        <div class="order-item">
          <span>${item.name}</span>
          <div class="quantity-controls">
            <button onclick="changeQty(${table.id}, '${item.name}', -1)">–</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${table.id}, '${item.name}', 1)">+</button>
          </div>
          <span>${(item.qty * item.price).toLocaleString()}đ</span>
        </div>
      `).join('')
        : '<p class="empty-message">Chưa có món nào</p>';

    document.getElementById('btnAddItem').style.display = 'block';
    document.getElementById('discountInput').value = '';
    updateTotalDisplay();

    document.querySelectorAll('.table-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tableId == table.id);
    });
}

// ==================== TÁCH ĐƠN ====================


// ==================== XÓA ĐƠN ====================
document.getElementById('btnDeleteOrder').addEventListener('click', function () {
    if (!currentTable) return alert("Vui lòng chọn bàn!");
    if (!confirm(`Xóa toàn bộ đơn của ${currentTable.number}?`)) return;

    currentTable.items = [];
    currentTable.status = 'empty';
    currentTable.orderCounter = 0;
    currentTable = null;

    saveTables(); // LƯU LẠI SAU KHI XÓA

    document.getElementById('currentTable').textContent = "Chọn bàn để xem đơn";
    document.getElementById('orderItems').innerHTML = '<p class="empty-message">Chưa có món nào</p>';
    document.getElementById('totalAmount').textContent = '0đ';
    document.getElementById('btnAddItem').style.display = 'none';
    document.getElementById('discountInput').value = '';

    renderTables();
});

// ==================== THAY ĐỔI SỐ LƯỢNG ====================
window.changeQty = function (tableId, name, delta) {
    const table = tables.find(t => t.id === tableId);
    if (!table) return;

    const item = table.items.find(i => i.name === name);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            table.items = table.items.filter(i => i.name !== name);
        }
        if (table.items.length === 0) {
            table.status = 'empty';
            if (currentTable?.id === tableId) {
                currentTable = null;
                document.getElementById('btnAddItem').style.display = 'none';
                document.getElementById('currentTable').textContent = "Chọn bàn để xem đơn";
                document.getElementById('orderItems').innerHTML = '<p class="empty-message">Chưa có món nào</p>';
                document.getElementById('discountInput').value = '';
            }
        }
        selectTable(table);
        saveTables(); // LƯU LẠI KHI THAY ĐỔI
    }
};

// ==================== CÁC SỰ KIỆN ====================
function addMoreItems() {
    if (currentTable) {
        window.location.href = `../Chon_mon/Danh_sach_mon.html?table=${currentTable.id}&continue=1`;
    }
}


document.getElementById('discountInput').addEventListener('input', updateTotalDisplay);
// Thêm vào cuối file script.js của bạn
function thanhToan() {
    if (!currentTable || currentTable.items.length === 0) {
        alert("Vui lòng chọn bàn có đơn hàng để thanh toán!");
        return;
    }

    // Tạo dữ liệu hóa đơn
    const items = currentTable.items.map(item => ({
        ten: item.name,
        gia: item.price,
        soLuong: item.qty
    }));

    const tongThanhTien = items.reduce((sum, i) => sum + i.gia * i.soLuong, 0);
    const khuyenMai = parseInt(document.getElementById("discountInput").value.replace(/[^0-9]/g, "")) || 0;
    const tongCong = tongThanhTien - khuyenMai;

    const maHD = `HD${currentTable.orderCounter.toString().padStart(3, '0')}`;
    const tableNum = currentTable.number.replace("BÀN ", "");

    const orderData = {
        maHD: maHD,
        soBan: tableNum,
        tenKH: "Khách lẻ",
        gioVao: new Date().toLocaleString("vi-VN"),
        gioRa: new Date().toLocaleString("vi-VN"),
        items: items,
        tongThanhTien: tongThanhTien,
        khuyenMai: khuyenMai,
        tongCong: tongCong
    };

    // Mở hóa đơn
    const url = `../Hoadon/hoadon.html?data=${encodeURIComponent(JSON.stringify(orderData))}`;
    const win = window.open(url, "_blank", "width=520,height=900");

    // THEO DÕI: KHI KHÁCH BẤM "IN HÓA ĐƠN" → TỰ ĐỘNG XÓA ĐƠN
    const checkClosed = setInterval(() => {
        if (win.closed) {
            clearInterval(checkClosed);
            // Kiểm tra xem có bấm "In hóa đơn" không (dùng localStorage làm cờ)
            if (localStorage.getItem("daInHoaDon") === "true") {
                localStorage.removeItem("daInHoaDon");

                // XÓA ĐƠN + CẬP NHẬT BÀN
                currentTable.items = [];
                currentTable.status = "empty";
                currentTable.orderCounter += 1;
                currentTable = null; // DÒNG NÀY LÀ THỦ PHẠM! PHẢI CÓ NÓ MỚI ĐÚNG!

                saveTables();
                renderTables();

                // Reset giao diện
                document.getElementById("currentTable").textContent = "Chọn bàn để xem đơn";
                document.getElementById("orderItems").innerHTML = '<p class="empty-message">Chưa có món nào</p>';
                document.getElementById("totalAmount").textContent = "0đ";
                document.getElementById("discountInput").value = "";
                document.getElementById("btnAddItem").style.display = "none";
                currentTable = null;

                alert(`Thanh toán thành công! Hóa đơn ${maHD} đã được in.`);
            }
            // Nếu chỉ bấm Đóng → không làm gì cả → đơn vẫn còn!
        }
    }, 500);
}

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
// ==================== KHỞI ĐỘNG ====================
renderTables();