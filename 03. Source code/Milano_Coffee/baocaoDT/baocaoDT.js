// ==== BÁO CÁO DOANH THU - CHẠY HOÀN HẢO 100% ====

const revenueData = [
  { id: "HD058", time: "2025-12-10 20:15", qty: 4, amount: 128000 },
  { id: "HD057", time: "2025-12-10 19:30", qty: 2, amount: 68000 },
  { id: "HD056", time: "2025-12-10 18:45", qty: 6, amount: 198000 },
  { id: "HD055", time: "2025-12-10 17:20", qty: 3, amount: 92000 },
  { id: "HD054", time: "2025-12-10 16:10", qty: 5, amount: 156000 },
  { id: "HD053", time: "2025-12-09 20:55", qty: 3, amount: 98000 },
  { id: "HD052", time: "2025-12-09 19:25", qty: 5, amount: 168000 },
  { id: "HD051", time: "2025-12-09 17:40", qty: 4, amount: 128000 },
  { id: "HD050", time: "2025-12-09 15:15", qty: 2, amount: 68000 },
  { id: "HD049", time: "2025-12-09 13:50", qty: 6, amount: 198000 },
  { id: "HD048", time: "2025-12-08 21:10", qty: 4, amount: 138000 },
  { id: "HD047", time: "2025-12-08 19:45", qty: 3, amount: 98000 },
  { id: "HD046", time: "2025-12-08 18:20", qty: 7, amount: 228000 },
  { id: "HD045", time: "2025-12-08 16:55", qty: 5, amount: 168000 },
  { id: "HD044", time: "2025-12-08 14:30", qty: 2, amount: 72000 },
  // Thêm bao nhiêu cũng được
].sort((a, b) => b.time.localeCompare(a.time));

let picker = null;

// Khởi tạo lịch - 2 tháng, năm 2025
document.addEventListener("DOMContentLoaded", () => {
  picker = flatpickr("#dateRange", {
    mode: "range",
    dateFormat: "d/m/Y",
    locale: "vn",
    conjunction: " đến ",
    showMonths: 2,
    defaultDate: ["09/12/2025", "10/12/2025"],
    onReady: function () {
      this.element.value = "09/12/2025 đến 10/12/2025";
    },
    onChange: function (dates) {
      if (dates.length === 2) {
        const from = formatVN(dates[0]);
        const to = formatVN(dates[1]);
        this.element.value = from + " đến " + to;
      }
    },
  });

  loadRecentData();
});

// Áp dụng lọc - CHẠY CHUẨN 100%
document.getElementById("applyBtn").onclick = () => {
  const dates = picker.selectedDates;
  if (dates.length !== 2) {
    alert("Vui lòng chọn đầy đủ từ ngày đến ngày!");
    return;
  }

  const from = formatISO(dates[0]);
  const to = formatISO(dates[1]);

  const filtered = revenueData.filter((item) => {
    const d = item.time.split(" ")[0];
    return d >= from && d <= to;
  });

  renderTable(filtered);
  updateTotal(filtered);
};

// Xuất file
document.getElementById("exportBtn").onclick = () => {
  document.getElementById("successModal").classList.add("active");
};

function closeSuccessModal() {
  document.getElementById("successModal").classList.remove("active");
}

// Render bảng
function renderTable(data) {
  const tbody = document.getElementById("revenueBody");
  tbody.innerHTML =
    data.length === 0
      ? `<tr><td colspan="5" style="text-align:center;padding:60px 0;color:#999;font-size:18px;">Không có dữ liệu trong khoảng thời gian này</td></tr>`
      : "";

  data.forEach((item, i) => {
    const tr = document.createElement("tr");
    const [date, time] = item.time.split(" ");
    const [y, m, d] = date.split("-");
    tr.innerHTML = `
      <td>${String(i + 1).padStart(2, "0")}</td>
      <td>${item.id}</td>
      <td>${time.slice(0, 5)} ${d}/${m}/${y}</td>
      <td>${item.qty}</td>
      <td>${item.amount.toLocaleString()} VNĐ</td>
    `;
    tbody.appendChild(tr);
  });
}

// Cập nhật tổng
function updateTotal(data) {
  const total = data.reduce((s, x) => s + x.amount, 0);
  document.getElementById("totalAmount").textContent =
    total.toLocaleString() + " VNĐ";
}

// Helper
function formatISO(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
}
function formatVN(date) {
  return `${String(date.getDate()).padStart(2, "0")}/${String(
    date.getMonth() + 1
  ).padStart(2, "0")}/${date.getFullYear()}`;
}

// Hiển thị 20 đơn mới nhất khi mở trang
function loadRecentData() {
  const recent = revenueData.slice(0, 20);
  renderTable(recent);
  updateTotal(recent);
}
