// ================== DỮ LIỆU TÀI KHOẢN ==================
const accounts = [
  { id: "NV0018", name: "Nguyễn Đức Anh", username: "NV0018", password: "1234" },
  { id: "NV0017", name: "Toàn Đoàn", username: "NV0017", password: "4321" },
  { id: "NV0016", name: "Pha", username: "NV0016", password: "phahaha" },
  { id: "NV0015", name: "tran nhan", username: "NV0015", password: "trannhan123" },
  { id: "NV0014", name: "dieu ngan", username: "NV0014", password: "dieu000" },
  { id: "NV0013", name: "duc anh", username: "NV0013", password: "0000" },
  { id: "NV0012", name: "khánh ly", username: "NV0012", password: "1111" },
  { id: "NV0011", name: "phạm hương", username: "NV0011", password: "55555" },
  { id: "NV0010", name: "Uyen Nhi", username: "NV0010", password: "77777" }
];

// ====== CSDL NHÂN VIÊN TỪ LOCALSTORAGE ======
// SỬA KEY NÀY cho trùng với trang "Danh sách nhân viên" đang lưu
const EMP_STORAGE_KEY = "employeeDB"; // ví dụ: "dsNhanVien"

function loadJSON(key, defaultValue) {
  const raw = localStorage.getItem(key);
  if (!raw) return defaultValue;
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Lỗi parse JSON:", key, e);
    return defaultValue;
  }
}

// danh sách nhân viên do TRANG TRƯỚC lưu vào localStorage
const employees = loadJSON(EMP_STORAGE_KEY, []);

// cố gắng lấy mã & tên nhân viên với nhiều kiểu field khác nhau
function getEmployeeId(emp) {
  return emp.id || emp.maNV || emp.maNhanVien || emp.ma_nv || "";
}

function getEmployeeName(emp) {
  return emp.name || emp.tenNV || emp.hoTen || emp.fullName || "";
}

function findEmployeeByCode(code) {
  const c = code.trim();
  if (!c) return null;
  return employees.find(emp => getEmployeeId(emp) === c) || null;
}

// map TÊN ĐĂNG NHẬP → (Mã NV, Tên NV) (fallback)
const employeeFromUsername = {
  "NV0018": { id: "NV0018", name: "Nguyễn Đức Anh" },
  "NV0017": { id: "NV0017", name: "Toàn Đoàn" },
  "NV0016": { id: "NV0016", name: "Pha" },
  "NV0015": { id: "NV0015", name: "tran nhan" },
  "NV0014": { id: "NV0014", name: "dieu ngan" },
  "NV0013": { id: "NV0013", name: "duc anh" },
  "NV0012": { id: "NV0012", name: "khánh ly" },
  "NV0011": { id: "NV0011", name: "phạm hương" },
  "NV0010": { id: "NV0010", name: "Uyen Nhi" }
};

// Lưu id tài khoản mới thêm để highlight
let lastAddedId = null;
// Lưu id tài khoản vừa cập nhật để highlight
let lastUpdatedId = null;
// Lưu id tài khoản chuẩn bị xóa
let accountIdToDelete = null;
// Lưu id đang sửa (null = đang thêm mới)
let currentEditId = null;

// ================== HÀM Suy ra mã NV & tên từ username ==================
function getEmployeeInfoFromUsername(username) {
  const key = username.trim();
  if (!key) return null;

  // 1. Ưu tiên lấy từ localStorage (employees)
  const emp = findEmployeeByCode(key);
  if (emp) {
    return {
      id: getEmployeeId(emp),
      name: getEmployeeName(emp)
    };
  }

  // 2. Nếu không có thì fallback sang map cứng
  if (employeeFromUsername[key]) return employeeFromUsername[key];

  // 3. Cuối cùng, dùng chính username làm mã & tên
  return { id: key, name: key };
}

// ================== RENDER BẢNG TÀI KHOẢN ==================
function renderAccounts() {
  const tbody = document.getElementById('accountList');
  if (!tbody) return;

  tbody.innerHTML = accounts.map(acc => `
    <tr class="${acc.id === lastUpdatedId ? 'highlight-updated' : (acc.id === lastAddedId ? 'highlight-new' : '')}">
      <td>${acc.id}</td>
      <td>${acc.name}</td>
      <td>${acc.username}</td>
      <td>${acc.password}</td>
      <td>
        <button class="action-btn edit-btn" onclick="openEditModal('${acc.id}')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 4H4C3.44772 4 3 4.44772 3 5V19C3 19.5523 3.44772 20 4 20H18C18.5523 20 19 19.5523 19 19V12" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M17.5 3.5L20.5 6.5L12 15H9V12L17.5 3.5Z" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="action-btn delete-btn" onclick="openDeletePopup('${acc.id}')">
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

// ================== MỞ POPUP THÊM ==================
function openAddModal() {
  const popup = document.getElementById('addPopup');
  const title = document.getElementById('popupTitle');
  const form = document.getElementById('addAccountForm');
  currentEditId = null;

  if (popup && title && form) {
    title.textContent = 'THÊM TÀI KHOẢN';
    form.reset();
   

    const btn = form.querySelector('.btn-save');
    addUsername.removeAttribute('readonly');

    if (btn) btn.textContent = 'Thêm';
    popup.style.display = 'flex';
  }
}

// ================== POPUP THÊM THÀNH CÔNG ==================
function openSuccessPopup() {
  const overlay = document.getElementById("successPopup");
  if (overlay) overlay.style.display = "flex";
}
function closeSuccessPopup() {
  const overlay = document.getElementById("successPopup");
  if (overlay) overlay.style.display = "none";
}

// ================== POPUP CẬP NHẬT THÀNH CÔNG ==================
function openUpdatePopup() {
  const overlay = document.getElementById("updatePopup");
  if (overlay) overlay.style.display = "flex";
}
function closeUpdatePopup() {
  const overlay = document.getElementById("updatePopup");
  if (overlay) overlay.style.display = "none";
}

// ================== MỞ POPUP SỬA ==================
function openEditModal(id) {
  const acc = accounts.find(a => a.id === id);
  if (!acc) return;

  currentEditId = id;

  const popup = document.getElementById('addPopup');
  const title = document.getElementById('popupTitle');
  const form = document.getElementById('addAccountForm');

  if (popup && title && form) {
    title.textContent = 'CẬP NHẬT TÀI KHOẢN';
    document.getElementById('addUsername').value = acc.username;
    document.getElementById('addPassword').value = acc.password;
    document.getElementById('addConfirmPassword').value = acc.password;

    const btn = form.querySelector('.btn-save');
    addUsername.setAttribute('readonly', true);

    if (btn) btn.textContent = 'Lưu';

    popup.style.display = 'flex';
  }
}

// ================== ĐÓNG POPUP THÊM/SỬA ==================
function closeAddModal() {
  const popup = document.getElementById('addPopup');
  if (popup) popup.style.display = 'none';
  currentEditId = null;
}

// ================== SUBMIT FORM THÊM/SỬA ==================
document.getElementById('addAccountForm')?.addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('addUsername').value.trim();
  const password = document.getElementById('addPassword').value.trim();
  const confirmPassword = document.getElementById('addConfirmPassword').value.trim();

  if (!username || !password || !confirmPassword) {
    alert('Vui lòng nhập đầy đủ thông tin.');
    return;
  }

  if (password !== confirmPassword) {
    alert('Mật khẩu xác nhận không khớp.');
    return;
  }

  const isEdit = !!currentEditId; // giữ trạng thái trước khi bị reset

  if (isEdit) {
    // Sửa tài khoản hiện có
    const index = accounts.findIndex(a => a.id === currentEditId);
    if (index !== -1) {
      accounts[index] = {
        ...accounts[index],
        username,
        password
      };
      lastUpdatedId = currentEditId;
      lastAddedId = null;
    }
  } else {
    // Thêm mới: suy ra mã NV + tên NV từ tên đăng nhập
    const empInfo = getEmployeeInfoFromUsername(username);
    if (!empInfo) {
      alert('Không tìm được thông tin nhân viên từ tên đăng nhập.');
      return;
    }

    const existingIndex = accounts.findIndex(a => a.id === empInfo.id);

    if (existingIndex !== -1) {
      // Nếu đã có tài khoản cho mã NV này -> cập nhật
      accounts[existingIndex] = {
        ...accounts[existingIndex],
        username,
        password
      };
      lastUpdatedId = empInfo.id;
      lastAddedId = null;
    } else {
      // Thêm mới
      accounts.unshift({
        id: empInfo.id,
        name: empInfo.name,
        username,
        password
      });
      lastAddedId = empInfo.id;
      lastUpdatedId = null;
    }
  }

  renderAccounts();
  closeAddModal();

  // mở popup đúng theo mode
  if (isEdit) openUpdatePopup();
  else openSuccessPopup();

  // Bỏ highlight sau 3 giây
  setTimeout(() => {
    lastAddedId = null;
    lastUpdatedId = null;
    renderAccounts();
  }, 3000);
});

// ================== XÓA TÀI KHOẢN ==================
function openDeletePopup(id) {
  accountIdToDelete = id;
  const overlay = document.getElementById('deleteOverlay');
  if (overlay) overlay.style.display = 'flex';
}

function closeDeletePopup() {
  const overlay = document.getElementById('deleteOverlay');
  if (overlay) overlay.style.display = 'none';
  accountIdToDelete = null;
}

function confirmDelete() {
  if (!accountIdToDelete) {
    closeDeletePopup();
    return;
  }

  const index = accounts.findIndex(a => a.id === accountIdToDelete);
  if (index !== -1) {
    accounts.splice(index, 1);
    if (lastAddedId === accountIdToDelete) lastAddedId = null;
    if (lastUpdatedId === accountIdToDelete) lastUpdatedId = null;
    renderAccounts();
  }

  closeDeletePopup();
  openDeleteSuccess();
}

// ================== POPUP THÔNG BÁO CŨ (nếu cần) ==================
function openNotify(message) {
  const overlay = document.getElementById('notifyOverlay');
  const title = document.querySelector('.notify-title');
  if (overlay && title) {
    title.textContent = message;
    overlay.style.display = 'flex';
  }
}

function closeNotify() {
  const overlay = document.getElementById('notifyOverlay');
  if (overlay) overlay.style.display = 'none';
}

// ================== POPUP XÓA THÀNH CÔNG ==================
function openDeleteSuccess() {
  const overlay = document.getElementById('deleteSuccessPopup');
  if (overlay) overlay.style.display = 'flex';
}

function closeDeleteSuccess() {
  const overlay = document.getElementById('deleteSuccessPopup');
  if (overlay) overlay.style.display = 'none';
}

// ================== NÚT ĐÓNG POPUP XÓA ==================
document.getElementById('btnCloseDelete')?.addEventListener('click', closeDeletePopup);
document.getElementById('btnConfirmDelete')?.addEventListener('click', confirmDelete);

// ================== NÚT ĐÓNG POPUP THÊM ==================
document.getElementById('btnCloseAdd')?.addEventListener('click', closeAddModal);

// ================== KHỞI ĐỘNG ==================
renderAccounts();
