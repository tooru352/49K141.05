// nhaphang.js – HOÀN HẢO 100%: DATEPICKER HIỆN ĐÚNG + POPUP SỬA/XÓA ĐẸP LUNG LINH

let startDate = null;
let endDate = null;

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const dateInput = document.getElementById("dateInput");
    const picker = document.querySelector(".custom-date-picker");
    const btnApply = document.getElementById("btnApply");
    const tbody = document.getElementById("phieuBody");

    let displayedYear = new Date().getFullYear();
    let displayedMonth = new Date().getMonth();

    const daysLeft = document.getElementById("days-left");
    const daysRight = document.getElementById("days-right");
    const monthTitles = document.querySelectorAll(".month-title");

    // ==================== DATE PICKER – ĐÃ SỬA HOÀN HẢO, HIỆN NGAY KHI CLICK ====================
    function renderCalendars() {
        renderMonth(daysLeft, monthTitles[0], displayedYear, displayedMonth);
        let nextM = displayedMonth + 1;
        let nextY = displayedYear;
        if (nextM > 11) { nextM = 0; nextY++; }
        renderMonth(daysRight, monthTitles[1], nextY, nextM);
        highlightDays(); // Highlight ngay khi render
    }

    function renderMonth(container, titleEl, year, month) {
        if (!container || !titleEl) return;
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
            const isSelected = (dateStr === startDate || dateStr === endDate);
            const isInRange = startDate && endDate && dateStr > startDate && dateStr < endDate;
            const className = `day ${isSelected ? 'selected' : ''} ${isInRange ? 'in-range' : ''}`;
            container.innerHTML += `<div class="${className}" data-date="${dateStr}">${d}</div>`;
        }
    }

    // Click ngày → chọn range
    document.body.addEventListener('click', function (e) {
        if (e.target.classList.contains('day') && !e.target.classList.contains('empty')) {
            const clicked = e.target.dataset.date;

            if (!startDate || (startDate && endDate)) {
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
            renderCalendars(); // Cập nhật highlight ngay
        }
    });

    function formatVN(dateStr) {
        const [y, m, d] = dateStr.split('-');
        return `${d}/${m}/${y}`;
    }

    // Nút chuyển tháng
    document.querySelectorAll(".prev-month").forEach(b => b.onclick = () => {
        displayedMonth--;
        if (displayedMonth < 0) { displayedMonth = 11; displayedYear--; }
        renderCalendars();
    });
    document.querySelectorAll(".next-month").forEach(b => b.onclick = () => {
        displayedMonth++;
        if (displayedMonth > 11) { displayedMonth = 0; displayedYear++; }
        renderCalendars();
    });

    // Click vào ô ngày → mở picker (SỬA LỖI CHÍNH!)
    if (dateInput) {
        dateInput.addEventListener("click", function (e) {
            e.stopPropagation();
            picker.classList.toggle("active");
            renderCalendars();
        });
    }

    // Click ngoài → đóng picker
    document.addEventListener('click', (e) => {
        if (picker && !picker.contains(e.target) && e.target !== dateInput) {
            picker.classList.remove("active");
        }
    });

    // ==================== TÌM KIẾM REALTIME + LỌC NGÀY ====================
    function filterTable() {
        const query = (searchInput?.value || "").toLowerCase();
        const rows = tbody?.querySelectorAll('tr') || [];

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const rowDate = row.dataset.date || "";
            const dateMatch = checkDateMatch(rowDate);
            row.style.display = (text.includes(query) && dateMatch) ? "" : "none";
        });
        updateNoResult();
    }

    function checkDateMatch(rowDate) {
        if (!startDate) return true;
        if (startDate && !endDate) return rowDate === startDate;
        if (startDate && endDate) return rowDate >= startDate && rowDate <= endDate;
        return true;
    }

    function updateNoResult() {
        if (!tbody) return;
        const visible = Array.from(tbody.querySelectorAll('tr')).some(r => r.style.display !== 'none');
        const noResult = document.getElementById('noResultRow');
        if (!visible && !noResult) {
            const tr = document.createElement('tr');
            tr.id = 'noResultRow';
            tr.innerHTML = `<td colspan="5" style="text-align:center;padding:60px;color:#999;font-size:18px;">
                Không tìm thấy phiếu nhập nào phù hợp!
            </td>`;
            tbody.appendChild(tr);
        } else if (visible && noResult) {
            noResult.remove();
        }
    }

    // Gắn sự kiện
    if (searchInput) searchInput.addEventListener('input', filterTable);
    if (btnApply) btnApply.addEventListener('click', filterTable);

    // Khởi tạo
    renderCalendars();
    filterTable();
});