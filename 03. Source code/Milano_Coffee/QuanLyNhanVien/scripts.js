// ================== DỮ LIỆU NHÂN VIÊN ==================
const employees = [
  { id: "NV0018", name: "Nguyễn Đức Anh", phone: "0866089943", email: "d1234d@gmail.com", cccd: "096205015022" },
  { id: "NV0017", name: "Toàn Đoàn", phone: "0374679589", email: "sdcs4321@gmail.com", cccd: "076543210987" },
  { id: "NV0016", name: "Pha", phone: "0919095614", email: "phahaha@gmail.com", cccd: "098765432123" },
  { id: "NV0015", name: "tran nhan", phone: "0332268825", email: "trannhan123@gmail.com", cccd: "033224466880" },
  { id: "NV0014", name: "dieu ngan", phone: "0946623377", email: "hg0000@gmail.com", cccd: "059183746521" },
  { id: "NV0013", name: "duc anh", phone: "0889988889", email: "huy11111@gmail.com", cccd: "084620135792" },
  { id: "NV0012", name: "khánh ly", phone: "0525522579", email: "ha5555@gmail.com", cccd: "021468024680" },
  { id: "NV0011", name: "phạm hương", phone: "08821514102", email: "htu@gmail.com", cccd: "047258369147" },
  { id: "NV0010", name: "Uyen Nhi", phone: "03151512354", email: "sgp@gmail.com", cccd: "090123450987" }
];

// Lưu id nhân viên mới thêm để highlight
let lastAddedId = null;
// Lưu id nhân viên vừa cập nhật để highlight
let lastUpdatedId = null;


// ================== RENDER BẢNG NHÂN VIÊN ==================
function renderEmployees() {
  const tbody = document.getElementById('employeeList');
  if (!tbody) return;

  tbody.innerHTML = employees.map(emp => `
    <tr class="${
      emp.id === lastUpdatedId
        ? 'highlight-updated'
        : (emp.id === lastAddedId ? 'highlight-new' : '')
    }">
      <td>${emp.id}</td>
      <td>${emp.name}</td>
      <td>${emp.phone}</td>
      <td>${emp.email}</td>
      <td>${emp.cccd}</td>
      <td>
        <button class="action-btn edit-btn" onclick="openEditModal('${emp.id}')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M11 4H4C3.44772 4 3 4.44772 3 5V19C3 19.5523 3.44772 20 4 20H18C18.5523 20 19 19.5523 19 19V12"
              stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M17.5 3.5L20.5 6.5L12 15H9V12L17.5 3.5Z"
              stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

<button class="action-btn delete-btn" onclick="openDeletePopup('${emp.id}')">

          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6H5H21" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6M19 6V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V6H19Z"
              stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10 11V17" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 11V17" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </td>
    </tr>
  `).join('');
}

// Khởi tạo bảng
renderEmployees();

// ================== POPUP SỬA NHÂN VIÊN ==================
function openEditModal(id) {
  const emp = employees.find(e => e.id === id);
  if (!emp) return;

  const codeEl = document.getElementById("editEmployeeCode");
  const nameEl = document.getElementById("editEmployeeName");
  const phoneEl = document.getElementById("editEmployeePhone");
  const emailEl = document.getElementById("editEmployeeEmail");
  const cccdEl = document.getElementById("editEmployeeCitizenId");
  const popupEl = document.getElementById("editPopup");

  if (!codeEl || !nameEl || !phoneEl || !emailEl || !cccdEl || !popupEl) {
    console.warn("Thiếu phần tử trong popup sửa nhân viên.");
    return;
  }

  codeEl.value = emp.id;
  nameEl.value = emp.name;
  phoneEl.value = emp.phone;
  emailEl.value = emp.email;
  cccdEl.value = emp.cccd;

  popupEl.style.display = "flex";
}

function closeEditModal() {
  const popupEl = document.getElementById("editPopup");
  if (popupEl) popupEl.style.display = "none";
}

const btnCloseEdit = document.getElementById("btnCloseEdit");
if (btnCloseEdit) {
  btnCloseEdit.addEventListener("click", closeEditModal);
}

const editForm = document.getElementById("editEmployeeForm");
if (editForm) {
  editForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const id = document.getElementById("editEmployeeCode").value;
    const emp = employees.find(e => e.id === id);
    if (!emp) return;

    emp.name = document.getElementById("editEmployeeName").value.trim();
    emp.phone = document.getElementById("editEmployeePhone").value.trim();
    emp.email = document.getElementById("editEmployeeEmail").value.trim();
    emp.cccd = document.getElementById("editEmployeeCitizenId").value.trim();

// đánh dấu hàng vừa cập nhật
lastUpdatedId = id;
if (lastAddedId === id) lastAddedId = null;

renderEmployees();
closeEditModal();
openNotify("Cập nhật thành công");

setTimeout(() => {
  if (lastUpdatedId === id) {
    lastUpdatedId = null;
    renderEmployees();
  }
}, 3000);})}


// ================== POPUP THÔNG BÁO (THÊM/CẬP NHẬT) ==================
function openNotify(message) {
  const overlay = document.getElementById("notifyOverlay");
  const titleEl = document.querySelector(".notify-title");

  if (titleEl && message) {
    titleEl.textContent = message;
  }
  if (overlay) overlay.style.display = "flex";
}

function closeNotify() {
  const overlay = document.getElementById("notifyOverlay");
  if (overlay) overlay.style.display = "none";
}

// ================== POPUP THÊM NHÂN VIÊN ==================
function openAddModal() {
  const popupEl = document.getElementById("addPopup");
  const nameEl = document.getElementById("addName");
  const phoneEl = document.getElementById("addPhone");
  const emailEl = document.getElementById("addEmail");
  const cccdEl = document.getElementById("addCccd");

  if (!popupEl || !nameEl || !phoneEl || !emailEl || !cccdEl) {
    console.warn("Thiếu phần tử trong popup thêm nhân viên.");
    return;
  }

  nameEl.value = "";
  phoneEl.value = "";
  emailEl.value = "";
  cccdEl.value = "";

  popupEl.style.display = "flex";
}

function closeAddModal() {
  const popupEl = document.getElementById("addPopup");
  if (popupEl) popupEl.style.display = "none";
}

const btnCloseAdd = document.getElementById("btnCloseAdd");
if (btnCloseAdd) {
  btnCloseAdd.addEventListener("click", closeAddModal);
}

// Tạo mã nhân viên mới: NV + số lớn nhất + 1 (4 chữ số)
function generateNewEmployeeId() {
  if (employees.length === 0) return "NV0001";

  let maxNum = 0;
  employees.forEach(emp => {
    const num = parseInt(emp.id.replace(/\D/g, ""), 10);
    if (!isNaN(num) && num > maxNum) maxNum = num;
  });

  const next = maxNum + 1;
  return "NV" + String(next).padStart(4, "0");
}

const addForm = document.getElementById("addEmployeeForm");
if (addForm) {
  addForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name  = document.getElementById("addName").value.trim();
    const phone = document.getElementById("addPhone").value.trim();
    const email = document.getElementById("addEmail").value.trim();
    const cccd  = document.getElementById("addCccd").value.trim();

    if (!name || !phone || !email || !cccd) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    const newId  = generateNewEmployeeId();
    const newEmp = { id: newId, name, phone, email, cccd };

    // Cho nhân viên mới lên ĐẦU danh sách
    employees.unshift(newEmp);

    // Đánh dấu dòng mới để highlight
    lastAddedId   = newId;
    lastUpdatedId = null; // nếu trước đó có highlight updated thì bỏ

    renderEmployees();
    closeAddModal();
    openNotify("Thêm thành công");

    // CHỈ GIỮ HIGHLIGHT 3 GIÂY
    setTimeout(() => {
      // chỉ xóa nếu vẫn đang highlight cho đúng dòng đó
      if (lastAddedId === newId) {
        lastAddedId = null;
        renderEmployees();
      }
    }, 3000);
  });
}



// ================== XÓA NHÂN VIÊN ==================
// ================== XÓA NHÂN VIÊN VỚI POPUP ==================
function openDeletePopup(id) {
  employeeIdToDelete = id;
  const overlay = document.getElementById("deleteOverlay");
  if (overlay) {
    overlay.style.display = "flex";
  }
}

function closeDeletePopup() {
  const overlay = document.getElementById("deleteOverlay");
  if (overlay) {
    overlay.style.display = "none";
  }
  employeeIdToDelete = null;
}

function confirmDelete() {
  if (!employeeIdToDelete) {
    closeDeletePopup();
    return;
  }

  const index = employees.findIndex(e => e.id === employeeIdToDelete);
  if (index !== -1) {
    employees.splice(index, 1);

    // xóa luôn cờ highlight nếu đang trỏ vào dòng bị xóa
    if (lastAddedId === employeeIdToDelete) {
      lastAddedId = null;
    }
    if (lastUpdatedId === employeeIdToDelete) {
      lastUpdatedId = null;
    }

    renderEmployees();
  }

  closeDeletePopup();
  // Mở popup "XÓA THÀNH CÔNG"
  openDeleteSuccess();
}



// ===== POPUP THÔNG BÁO XÓA THÀNH CÔNG =====
function openDeleteSuccess() {
  const ov = document.getElementById("deleteSuccessOverlay");
  if (ov) ov.style.display = "flex";
}

function closeDeleteSuccess() {
  const ov = document.getElementById("deleteSuccessOverlay");
  if (ov) ov.style.display = "none";
}


// Lưu id nhân viên chuẩn bị xóa (dùng cho popup xác nhận)
let employeeIdToDelete = null;



EMP_STORAGE_KEY = "dsNhanVien";
EMP_STORAGE_KEY = "dsNhanVien";

employees = JSON.parse(localStorage.getItem(EMP_STORAGE_KEY)) || [];
renderEmployees();


localStorage.setItem(EMP_STORAGE_KEY, JSON.stringify(employees));
