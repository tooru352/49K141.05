// === DỮ LIỆU LẤY TỪ LOCALSTORAGE ===
// Bảng lương (lương giờ, phụ cấp, thưởng, phạt)
function getSalaryData() {
    const saved = localStorage.getItem('milano_salary_data');
    if (!saved) return [
        { manv: "NV0001", name: "Lê Văn A",      position: "Pha chế",   baseRate: 22000, allowance: 25000, bonus: 100000, penalty: 0 },
        { manv: "NV0002", name: "Nguyễn Thị B",  position: "Pha chế",   baseRate: 22000, allowance: 25000, bonus: 100000, penalty: 0 },
        { manv: "NV0003", name: "Trần Doãn C",    position: "Pha chế",   baseRate: 22000, allowance: 0,     bonus: 0,      penalty: 0 },
        { manv: "NV0004", name: "Trần Đăng D",    position: "Pha chế",   baseRate: 22000, allowance: 25000, bonus: 0,      penalty: 20000 },
        { manv: "NV0005", name: "Lê Thị Hoài T",  position: "Phục vụ",   baseRate: 20000, allowance: 0,     bonus: 0,      penalty: 0 },
        { manv: "NV0006", name: "Võ Thị M",       position: "Phục vụ",   baseRate: 20000, allowance: 0,     bonus: 0,      penalty: 0 },
        { manv: "NV0007", name: "Lê Quang N",     position: "Phục vụ",   baseRate: 20000, allowance: 25000, bonus: 0,      penalty: 50000 },
        { manv: "NV0008", name: "Nguyễn Văn V",   position: "Phục vụ",   baseRate: 20000, allowance: 25000, bonus: 0,      penalty: 0 },
        { manv: "NV0009", name: "Cáp Thị K",      position: "Phục vụ",   baseRate: 20000, allowance: 0,     bonus: 0,      penalty: 0 }
    ];

    const arr = JSON.parse(saved);
    return arr.map(item => ({
        manv: item.manv,
        name: item.name,
        position: item.position,
        baseRate: parseInt(item.base.replace(/[^0-9]/g, '')) * 1000 || 20000, // "22k/giờ" → 22000
        allowance: item.allowance ? parseInt(item.allowance.replace(/[^0-9]/g, '')) * 1000 : 0,
        bonus: item.bonus ? parseInt(item.bonus.replace(/[^0-9]/g, '')) * 1000 : 0,
        penalty: item.penalty ? parseInt(item.penalty.replace(/[^0-9]/g, '')) * 1000 : 0
    }));
}

// Bảng công (tổng công đã điều chỉnh)
function getAttendanceData() {
    const saved = localStorage.getItem('milano_attendance_data');
    if (!saved) return {};
    const arr = JSON.parse(saved);
    const map = {};
    arr.forEach(item => {
        map[item.manv] = parseFloat(item.total) || 0;
    });
    return map;
}

const salaryList     = getSalaryData();
const attendanceMap  = getAttendanceData();
const tbody          = document.getElementById('payrollBody');

function renderPayroll() {
    tbody.innerHTML = '';
    let grandTotal = 0;

    salaryList.forEach(emp => {
        const totalDays = attendanceMap[emp.manv] || 0;

        // CÔNG THỨC CHÍNH XÁC THEO YÊU CẦU
        const basePay      = emp.baseRate * 5 * totalDays;        // 22k × 5 = 110k/ca
        const allowancePay = emp.allowance * totalDays;
        const totalSalary  = basePay + allowancePay + emp.bonus - emp.penalty;

        grandTotal += totalSalary;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="manv">${emp.manv}</td>
            <td>${emp.name}</td>
            <td>${emp.position}</td>
            <td>${emp.baseRate.toLocaleString()}đ/giờ</td>
            <td>${emp.allowance > 0 ? emp.allowance.toLocaleString() + 'đ/ca' : ''}</td>
            <td class="bonus">${emp.bonus > 0 ? emp.bonus.toLocaleString() + 'đ' : ''}</td>
            <td class="penalty">${emp.penalty > 0 ? emp.penalty.toLocaleString() + 'đ' : ''}</td>
            <td style="font-weight:bold;color:#c8a165;text-align:center;">${totalDays}</td>
            <td style="font-weight:bold;font-size:19px;color:#c80000;background:#fff8f0;">
                ${totalSalary.toLocaleString()}đ
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Dòng tổng cộng
    const totalRow = document.createElement('tr');
    totalRow.style.cssText = "background:#c8a165;color:white;font-weight:bold;font-size:18px;";
    totalRow.innerHTML = `
        <td colspan="8" style="text-align:right;padding-right:30px;">TỔNG LƯƠNG TOÀN BỘ</td>
        <td style="font-size:22px;">${grandTotal.toLocaleString()}đ</td>
    `;
    tbody.appendChild(totalRow);
}

// Tự động reload khi có thay đổi từ trang khác (nếu mở nhiều tab)
window.addEventListener('storage', (e) => {
    if (e.key === 'milano_salary_data' || e.key === 'milano_attendance_data') {
        location.reload();
    }
});

// Chạy khi load trang
document.addEventListener('DOMContentLoaded', renderPayroll);