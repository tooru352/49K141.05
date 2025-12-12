// nhaphang.js - Tìm kiếm realtime + Lọc ngày chỉ khi nhấn "Áp dụng"

let startDate = null;
let endDate = null;

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const dateInput = document.getElementById("dateInput");
  const picker = document.querySelector(".custom-date-picker");
  const btnApply = document.getElementById("btnApply");
  const btnCreate = document.getElementById("btnCreate");
  const tbody = document.getElementById("phieuBody");

  let displayedYear = new Date().getFullYear();
  let displayedMonth = new Date().getMonth();

  const daysLeft = document.getElementById("days-left");
  const daysRight = document.getElementById("days-right");
  const monthTitles = document.querySelectorAll(".month-title");

  // === DATE PICKER ĐẸP (giữ nguyên của bạn) ===
  function renderCalendars() {
    renderMonth(daysLeft, monthTitles[0], displayedYear, displayedMonth);
    let nextM = displayedMonth + 1;
    let nextY = displayedYear;
    if (nextM > 11) { nextM = 0; nextY++; }
    renderMonth(daysRight, monthTitles[1], nextY, nextM);
  }

  function renderMonth(container, titleEl, year, month) {
    container.innerHTML = "";
    const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
    titleEl.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;

    for (let i = 0; i < offset; i++) {
      container.innerHTML += '<div class="day empty"></div>';
    }

    const lastDate = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= lastDate; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      container.innerHTML += `<div class="day" data-date="${dateStr}">${d}</div>`;
    }
  }

  // Click ngày → chọn range
  document.body.addEventListener('click', function (e) {
    if (e.target.classList.contains('day') && !e.target.classList.contains('empty')) {
      const clicked = e.target.dataset.date;

      if (!startDate || endDate) {
        startDate = clicked;
        endDate = null;
      } else {
        if (clicked < startDate) {
          endDate = startDate;
          startDate = clicked;
        } else {
          endDate = clicked;
        }
        dateInput.value = `${formatVN(startDate)} - ${formatVN(endDate)}`;
        picker.classList.remove("active");
      }
      highlightDays();
      // Không lọc ở đây → chờ nhấn "Áp dụng"
    }
  });

  function highlightDays() {
    document.querySelectorAll('.day').forEach(d => {
      d.classList.remove('selected', 'in-range');
      if (d.dataset.date === startDate || d.dataset.date === endDate) d.classList.add('selected');
      if (startDate && endDate && d.dataset.date > startDate && d.dataset.date < endDate) {
        d.classList.add('in-range');
      }
    });
  }

  function formatVN(dateStr) {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  }

  // Nút chuyển tháng
  document.querySelectorAll(".prev-month").forEach(b => b.onclick = () => {
    displayedMonth--;
    if (displayedMonth < 0) { displayedMonth = 11; displayedYear--; }
    renderCalendars(); highlightDays();
  });
  document.querySelectorAll(".next-month").forEach(b => b.onclick = () => {
    displayedMonth++;
    if (displayedMonth > 11) { displayedMonth = 0; displayedYear++; }
    renderCalendars(); highlightDays();
  });

  // Mở/đóng picker
  dateInput.onclick = (e) => {
    e.stopPropagation();
    picker.classList.toggle("active");
    renderCalendars();
    highlightDays();
  };
  document.addEventListener('click', (e) => {
    if (!picker.contains(e.target) && e.target !== dateInput) {
      picker.classList.remove("active");
    }
  });

  // === TÌM KIẾM REALTIME ===
  searchInput.addEventListener('input', filterBySearch); // realtime

  function filterBySearch() {
    const query = searchInput.value.trim().toLowerCase();
    const rows = tbody.querySelectorAll('tr');

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const dateMatch = checkDateMatch(row.dataset.date);

      if (text.includes(query) && dateMatch) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
    updateNoResult();
  }

  // === LỌC THEO NGÀY CHỈ KHI NHẤN "ÁP DỤNG" ===
  btnApply.onclick = () => {
    filterBySearch(); // Áp dụng cả tìm kiếm realtime + ngày mới chọn
  };

  function checkDateMatch(rowDate) {
    if (!startDate) return true;
    if (startDate && !endDate) return rowDate === startDate;
    if (startDate && endDate) return rowDate >= startDate && rowDate <= endDate;
    return true;
  }

  function updateNoResult() {
    const visible = Array.from(tbody.querySelectorAll('tr')).some(r => r.style.display !== 'none');
    const noResult = document.getElementById('noResultRow');
    if (!visible && !noResult) {
      const tr = document.createElement('tr');
      tr.id = 'noResultRow';
      tr.innerHTML = `<td colspan="5" style="text-align:center;padding:50px;color:#e74c3c;font-size:18px;">
                Không tìm thấy phiếu nhập nào phù hợp!
            </td>`;
      tbody.appendChild(tr);
    } else if (visible && noResult) {
      noResult.remove();
    }
  }

  // Nút Tạo phiếu
  btnCreate.onclick = () => location.href = "taophieu.html";

  // Khởi tạo
  renderCalendars();
});
// Lưu mã phiếu cuối cùng vào localStorage (dùng để tăng dần)
function getNextMaPhieu() {
  let last = localStorage.getItem('lastPhieuNhap');
  if (!last) {
    last = 'PN000090'; // giá trị khởi tạo nếu chưa có
  }
  // Tách số và tăng 1
  let num = last.replace('PN', '');
  let nextNum = (parseInt(num) + 1).toString().padStart(6, '0');
  let nextCode = 'PN' + nextNum;
  localStorage.setItem('lastPhieuNhap', nextCode);
  return nextCode;
}

JavaScript// ==================== NHAPHANG.JS – HOÀN CHỈNH 100% ====================
const phieuBody = document.getElementById('phieuBody');
const btnCreate = document.getElementById('btnCreate');

// Tạo phiếu mới
btnCreate.addEventListener('click', () => {
  window.location.href = 'taophieu.html';
});

// Load danh sách phiếu khi mở trang
function loadDanhSachPhieu() {
  const danhSach = JSON.parse(localStorage.getItem('danhSachPhieuNhap') || '[]');

  // Xóa bảng cũ
  phieuBody.innerHTML = '';

  if (danhSach.length === 0) {
    phieuBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; padding:40px; color:#999;">
          Chưa có phiếu nhập nào.<br>
          <button class="btn-create" style="margin-top:16px; padding:10px 24px; background:#c8a165; color:white; border:none; border-radius:8px; cursor:pointer;">
            Tạo phiếu đầu tiên
          </button>
        </td>
      </tr>
    `;
    phieuBody.querySelector('button').onclick = () => window.location.href = 'taophieu.html';
    return;
  }

  // Sắp xếp mới nhất lên đầu
  danhSach.sort((a, b) => new Date(b.ngayTao) - new Date(a.ngayTao));

  danhSach.forEach((phieu, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${phieu.maPhieu}</strong></td>
      <td>${phieu.nhaCungCap.split(' - ')[0] || 'Chưa chọn'}</td>
      <td>${formatDate(phieu.ngayTao)}</td>
      <td class="total-money">${phieu.tongTien.toLocaleString('vi-VN')} ₫</td>
      <td class="actions">
        <button class="view-btn" title="Xem chi tiết">View</button>
        <button class="edit-btn" title="Sửa">Edit</button>
        <button class="delete-btn" title="Xóa" onclick="xoaPhieu('${phieu.maPhieu}', this)">Delete</button>
      </td>
    `;
    phieuBody.appendChild(tr);

    // Nút Xem chi tiết
    tr.querySelector('.view-btn').addEventListener('click', () => {
      alert(`Phiếu: ${phieu.maPhieu}\nNhà cung cấp: ${phieu.nhaCungCap}\nTổng tiền: ${phieu.tongTien.toLocaleString()} ₫\nSố nguyên liệu: ${phieu.chiTiet.length}`);
      // Có thể mở modal chi tiết sau này
    });

    // Nút Sửa → mở lại trang tạo phiếu + truyền dữ liệu (tùy chọn nâng cao)
    tr.querySelector('.edit-btn').addEventListener('click', () => {
      localStorage.setItem('phieuDangSua', JSON.stringify(phieu));
      window.location.href = 'taophieu.html?edit=' + phieu.maPhieu;
    });
  });
}

// Hàm định dạng ngày đẹp hơn
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

// Xóa phiếu
window.xoaPhieu = function (maPhieu, button) {
  if (!confirm(`Xóa phiếu ${maPhieu}? Không thể khôi phục!`)) return;

  let danhSach = JSON.parse(localStorage.getItem('danhSachPhieuNhap') || '[]');
  danhSach = danhSach.filter(p => p.maPhieu !== maPhieu);
  localStorage.setItem('danhSachPhieuNhap', JSON.stringify(danhSach));

  button.closest('tr').remove();
  alert('Đã xóa phiếu!');
};

// Tự động load khi mở trang
document.addEventListener('DOMContentLoaded', loadDanhSachPhieu);
document.addEventListener("DOMContentLoaded", function () {
  loadDanhSachPhieu();
});

function loadDanhSachPhieu() {
  const ds = JSON.parse(localStorage.getItem('danhSachPhieuNhap') || '[]');
  const tbody = document.getElementById('danhSachPhieu'); // hoặc tbody của bạn
  tbody.innerHTML = '';

  ds.forEach(phieu => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${phieu.maPhieu}</td>
      <td>${phieu.thoiGian}</td>
      <td>${phieu.nhaCungCap}</td>
      <td>${phieu.tongTien.toLocaleString('vi-VN')}đ</td>
      <td>${phieu.nguoiTao}</td>
      <td><button onclick="xemChiTiet('${phieu.maPhieu}')">Xem</button></td>
    `;
    tbody.appendChild(tr);
  });
}
