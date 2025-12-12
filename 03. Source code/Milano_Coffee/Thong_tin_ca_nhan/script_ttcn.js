// script_ttcn.js – HOÀN HẢO 100%, HIỆN THÔNG TIN NGAY TỪ ĐẦU, KHÔNG CÒN LỖI
let currentUser = null;
let originalData = null;
let isEditing = false;

const fields = [
    { label: "Tên đăng nhập", key: "username", type: "text", readonly: true },
    { label: "Mật khẩu", key: "password", type: "password", placeholder: "Để trống nếu không đổi" },
    { label: "Chức vụ", key: "role", type: "text", readonly: true },
    { label: "Họ tên", key: "hoten", type: "text" },
    { label: "Ngày sinh", key: "birthday", type: "date" },
    { label: "SĐT", key: "phone", type: "tel" },
    { label: "CCCD", key: "cccd", type: "text" },
    { label: "Email", key: "email", type: "email" },
    { label: "Địa chỉ", key: "address", type: "text" }
];

// ==================== KHỞI ĐỘNG ====================
document.addEventListener("DOMContentLoaded", function () {
    currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser || !currentUser.username) {
        alert("Vui lòng đăng nhập để xem thông tin cá nhân!");
        window.location.href = "../Dang_nhap/dangnhap.html";
        return;
    }

    // CẬP NHẬT HEADER GÓC PHẢI (thay document.write)
    const headerUserId = document.querySelector(".user-area .user-id");
    if (headerUserId) {
        headerUserId.textContent = currentUser.username || currentUser.id || "NV0001";
    }

    // Cập nhật tên + mã nhân viên
    document.getElementById("profileName").textContent = currentUser.hoten || currentUser.name || "Chưa đặt tên";
    document.querySelector(".profile-id").textContent = `Mã nhân viên: ${currentUser.id || currentUser.username}`;

    // HIỆN THÔNG TIN NGAY LẬP TỨC
    renderProfile();
});

// ==================== HIỂN THỊ THÔNG TIN ====================
function renderProfile() {
    const infoList = document.getElementById("infoList"); // PHẢI LẤY LẠI Ở ĐÂY!
    if (!infoList) return;

    infoList.innerHTML = ""; // Xóa trắng trước

    fields.forEach(field => {
        let value = currentUser[field.key] || "-";
        if (field.key === "password") value = "••••••••";

        const div = document.createElement("div");
        div.className = "info-item";
        div.innerHTML = `
            <span class="info-label">${field.label}</span>
            <span class="info-value">${value}</span>
        `;
        infoList.appendChild(div);
    });
}

// ==================== CHẾ ĐỘ CHỈNH SỬA ====================
function renderEditMode() {
    const infoList = document.getElementById("infoList");
    infoList.innerHTML = "";

    fields.forEach(field => {
        const div = document.createElement("div");
        div.className = "info-item edit-mode";

        const input = document.createElement("input");
        input.type = field.type;
        input.value = field.key === "password" ? "" : (currentUser[field.key] || "");
        input.placeholder = field.placeholder || "";
        if (field.readonly) input.readOnly = true;

        div.innerHTML = `<span class="info-label">${field.label}</span>`;
        div.appendChild(input);
        infoList.appendChild(div);
    });
}

function enterEditMode() {
    if (isEditing) return;
    originalData = JSON.parse(JSON.stringify(currentUser));
    isEditing = true;

    document.getElementById("actionButtons").style.display = "none";
    document.getElementById("saveActions").style.display = "flex";
    renderEditMode();
}

function cancelEdit() {
    if (confirm("Hủy mọi thay đổi?")) {
        currentUser = JSON.parse(JSON.stringify(originalData));
        isEditing = false;
        document.getElementById("actionButtons").style.display = "flex";
        document.getElementById("saveActions").style.display = "none";
        renderProfile();
    }
}

function saveProfile() {
    const inputs = document.querySelectorAll("#infoList input");
    fields.forEach((field, i) => {
        if (!field.readonly) {
            const val = inputs[i].value.trim();
            if (val) currentUser[field.key] = val;
        }
    });

    document.getElementById("profileName").textContent = currentUser.hoten || "Chưa đặt tên";

    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const idx = allUsers.findIndex(u => u.username === currentUser.username);
    if (idx !== -1) {
        allUsers[idx] = { ...allUsers[idx], ...currentUser };
        localStorage.setItem("users", JSON.stringify(allUsers));
    }

    closeConfirmDialog();
    isEditing = false;
    document.getElementById("actionButtons").style.display = "flex";
    document.getElementById("saveActions").style.display = "none";
    renderProfile();
    alert("Đã lưu thành công!");
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
// ==================== MODAL & ĐĂNG XUẤT ====================
function showConfirmDialog() {
    document.getElementById("confirmModal").style.display = "flex";
}

function closeConfirmDialog() {
    document.getElementById("confirmModal").style.display = "none";
}

function logout() {
    if (confirm("Đăng xuất ngay?")) {
        localStorage.removeItem("currentUser");
        window.location.href = "../dangnhap/dangnhap.html";
    }
}