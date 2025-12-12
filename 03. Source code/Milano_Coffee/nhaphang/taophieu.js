// ==================== TAOPHIEU.JS – HOÀN CHỈNH 100% – TẠO MỚI + SỬA PHIẾU NHẬP HOÀN HẢO ====================

const danhSachNL = [
  { ma: "NL001", ten: "Hạt cà phê Robusta", gia: 120000, dvt: "kg" },
  { ma: "NL002", ten: "Hạt cà phê Arabica", gia: 280000, dvt: "kg" },
  { ma: "NL003", ten: "Sữa đặc Ông Thọ", gia: 25000, dvt: "lon" },
  { ma: "NL004", ten: "Đường trắng Biên Hòa", gia: 18000, dvt: "kg" },
  { ma: "NL005", ten: "Ly giấy 12oz", gia: 1500, dvt: "cái" },
  { ma: "NL006", ten: "Nắp ly nhựa", gia: 800, dvt: "cái" },
  { ma: "NL007", ten: "Bột cacao nguyên chất", gia: 180000, dvt: "kg" },
  { ma: "NL008", ten: "Trà xanh Thái Nguyên", gia: 95000, dvt: "kg" },
  { ma: "NL009", ten: "Sữa tươi Vinamilk", gia: 28000, dvt: "hộp" },
  { ma: "NL010", ten: "Kem tươi Whipping", gia: 85000, dvt: "lít" }
];

let rowCount = 0;
let isEditMode = false;

// ==================== KHI TRANG LOAD ====================
document.addEventListener("DOMContentLoaded", function () {
  // LẤY THÔNG TIN NHÂN VIÊN ĐANG ĐĂNG NHẬP
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const tenNhanVien = currentUser?.username || 'NV0001';

  const params = new URLSearchParams(window.location.search);
  const editMaPhieu = params.get('edit');

  if (editMaPhieu) {
    isEditMode = true;
    const title = document.querySelector('h1') || document.querySelector('title');
    if (title) title.textContent = title.textContent.replace('Tạo', 'Chỉnh sửa');
    loadPhieuToEdit(editMaPhieu);
  } else {
    document.getElementById('maPhieu').value = getNextMaPhieu();
    document.getElementById('thoiGianTao').value = new Date().toLocaleString('vi-VN');
  }

  document.getElementById('nguoiTao').value = tenNhanVien;
  rowCount = document.querySelectorAll('.table-row').length || 0;
  attachEventToExistingRows();
});

// ==================== LẤY MÃ PHIẾU TIẾP THEO ====================
function getNextMaPhieu() {
  let last = localStorage.getItem('lastPhieuNhap') || 'PN000098';
  let num = parseInt(last.replace('PN', '')) + 1;
  let nextCode = 'PN' + String(num).padStart(6, '0');
  localStorage.setItem('lastPhieuNhap', nextCode);
  return nextCode;
}

// ==================== TẢI PHIẾU CẦN SỬA ====================
function loadPhieuToEdit(maPhieu) {
  const danhSach = JSON.parse(localStorage.getItem('danhSachPhieuNhap') || '[]');
  const phieu = danhSach.find(p => p.maPhieu === maPhieu);

  if (!phieu) {
    alert("Không tìm thấy phiếu nhập để sửa!");
    window.location.href = 'nhaphang.html';
    return;
  }

  document.getElementById('maPhieu').value = phieu.maPhieu;
  document.getElementById('thoiGianTao').value = phieu.thoiGian || new Date().toLocaleString('vi-VN');
  document.getElementById('nguoiTao').value = phieu.nguoiTao || 'NV0001';

  // Nếu có ô chọn nhà cung cấp
  const supplierInput = document.getElementById('nhaCungCapInput') || document.getElementById('supplierSelect');
  if (supplierInput) supplierInput.value = phieu.nhaCungCap || '';

  // Xóa dòng cũ
  document.querySelectorAll('.table-row').forEach(r => r.remove());

  // Load chi tiết
  phieu.chiTiet.forEach(item => themDongMoi(item));
  capNhatSTT();
  capNhatTongTien();
}

// ==================== THÊM DÒNG MỚI ====================
document.querySelector('.add-row-btn')?.addEventListener('click', () => themDongMoi());

function themDongMoi(item = null) {
  rowCount++;
  const newRow = document.createElement('div');
  newRow.className = 'table-row';
  newRow.innerHTML = `
    <div class="stt">${String(rowCount).padStart(2, '0')}</div>
    <input type="text" class="ma-nl" value="${item?.maNL || ''}">
    <div class="ten-nl-wrapper">
      <input type="text" class="ten-nl" value="${item?.tenNL || ''}">
      <div class="suggestion-box"></div>
    </div>
    <input type="number" class="don-gia" value="${item?.donGia || ''}">
    <input type="text" class="dvt" value="${item?.dvt || ''}">
    <div class="quantity-control">
      <button class="quantity-btn minus">-</button>
      <span class="quantity-display">${item?.soLuong || 1}</span>
      <button class="quantity-btn plus">+</button>
    </div>
    <input type="text" class="thanh-tien" value="${(item?.donGia * (item?.soLuong || 1) || 0).toLocaleString('vi-VN')}" disabled>
    <button class="delete-btn">Delete</button>
  `;

  const container = document.querySelector('.add-row-btn').parentElement;
  container.insertBefore(newRow, document.querySelector('.add-row-btn'));
  attachRowEvents(newRow);
  capNhatSTT();
}

// ==================== GẮN SỰ KIỆN CHO DÒNG ====================
function attachRowEvents(row) {
  row.querySelectorAll('.quantity-btn').forEach(btn => {
    btn.onclick = () => {
      const display = btn.parentElement.querySelector('.quantity-display');
      let sl = parseInt(display.textContent) || 1;
      if (btn.classList.contains('plus')) sl++;
      else if (btn.classList.contains('minus') && sl > 1) sl--;
      display.textContent = sl;
      capNhatThanhTien(row);
      capNhatTongTien();
    };
  });

  row.querySelector('.delete-btn').onclick = () => {
    if (confirm('Xóa dòng này?')) {
      row.remove();
      capNhatSTT();
      capNhatTongTien();
    }
  };

  row.querySelector('.don-gia').oninput = () => {
    capNhatThanhTien(row);
    capNhatTongTien();
  };
}

function attachEventToExistingRows() {
  document.querySelectorAll('.table-row').forEach(attachRowEvents);
}

// ==================== TÍNH TOÁN ====================
function capNhatThanhTien(row) {
  const gia = parseFloat(row.querySelector('.don-gia').value) || 0;
  const sl = parseInt(row.querySelector('.quantity-display').textContent) || 1;
  const thanhTien = gia * sl;
  row.querySelector('.thanh-tien').value = thanhTien.toLocaleString('vi-VN');
}

function capNhatTongTien() {
  let tong = 0;
  document.querySelectorAll('.thanh-tien').forEach(input => {
    const clean = input.value.replace(/\./g, '');
    tong += parseFloat(clean) || 0;
  });
  document.querySelector('.summary-value.total') &&
    (document.querySelector('.summary-value.total').textContent = tong.toLocaleString('vi-VN'));
}

function capNhatSTT() {
  document.querySelectorAll('.table-row').forEach((row, i) => {
    row.querySelector('.stt').textContent = String(i + 1).padStart(2, '0');
  });
  rowCount = document.querySelectorAll('.table-row').length;
}

// ==================== NÚT LƯU ====================
document.querySelector('.btn-save')?.addEventListener('click', function () {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const nguoiTao = currentUser?.username || 'NV0001';

  const phieu = {
    maPhieu: document.getElementById('maPhieu').value.trim(),
    ngayTao: new Date().toISOString(),
    thoiGian: new Date().toLocaleString('vi-VN'),
    nguoiTao: nguoiTao,
    nhaCungCap: document.getElementById('nhaCungCapInput')?.value || document.getElementById('supplierSelect')?.value || 'Chưa chọn',
    tongTien: 0,
    chiTiet: []
  };

  let coDuLieu = false;
  document.querySelectorAll('.table-row').forEach(row => {
    const maNL = row.querySelector('.ma-nl').value.trim();
    if (!maNL) return;
    coDuLieu = true;

    const thanhTien = parseFloat(row.querySelector('.thanh-tien').value.replace(/\./g, '')) || 0;
    phieu.chiTiet.push({
      maNL,
      tenNL: row.querySelector('.ten-nl').value.trim(),
      donGia: parseFloat(row.querySelector('.don-gia').value) || 0,
      dvt: row.querySelector('.dvt').value.trim(),
      soLuong: parseInt(row.querySelector('.quantity-display').textContent) || 1,
      thanhTien
    });
  });

  if (!coDuLieu) return alert('Vui lòng nhập ít nhất một nguyên liệu!');

  phieu.tongTien = phieu.chiTiet.reduce((t, i) => t + i.thanhTien, 0);

  let dsPhieu = JSON.parse(localStorage.getItem('danhSachPhieuNhap') || '[]');

  if (isEditMode) {
    const index = dsPhieu.findIndex(p => p.maPhieu === phieu.maPhieu);
    if (index !== -1) dsPhieu[index] = phieu;
    alert('Đã cập nhật phiếu nhập thành công!');
  } else {
    dsPhieu.unshift(phieu);
    alert('Đã tạo phiếu nhập thành công!');
  }

  localStorage.setItem('danhSachPhieuNhap', JSON.stringify(dsPhieu));
  setTimeout(() => window.location.href = 'nhaphang.html', 1500);
});

// ==================== NÚT HỦY ====================
document.querySelector('.btn-cancel')?.addEventListener('click', () => {
  if (confirm('Hủy và quay lại?')) window.location.href = 'nhaphang.html';
});