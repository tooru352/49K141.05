// js/dat-mon.js – HOÀN CHỈNH 100%: CÓ HỦY + CẬP NHẬT TRẠNG THÁI BÀN
const urlParams = new URLSearchParams(window.location.search);
const tableId = urlParams.get('table');
let cart = [];

// Danh sách món (giữ nguyên 18 món của bạn)
const menu = [
    { id: 1, name: "Caffe Milano", price: 25000, category: "Coffee", img: "image/1.jpg" },
    { id: 2, name: "Cà phê sữa đá", price: 18000, category: "Coffee", img: "image/2.jpg" },
    { id: 3, name: "Cà phê đen đá", price: 15000, category: "Coffee", img: "image/3.jpg" },
    { id: 4, name: "Bạc xỉu", price: 22000, category: "Coffee", img: "image/4.jpg" },
    { id: 5, name: "Bạc xỉu muối", price: 25000, category: "Coffee", img: "image/5.jpg" },
    { id: 6, name: "Cà phê cốt dừa", price: 28000, category: "Coffee", img: "image/6.jpg" },
    { id: 7, name: "Trà đào cam sả", price: 28000, category: "Tea", img: "image/7.jpg" },
    { id: 8, name: "Trà tắc (chanh dây)", price: 25000, category: "Tea", img: "image/8.jpg" },
    { id: 9, name: "Trà ô long vải", price: 30000, category: "Tea", img: "image/9.jpg" },
    { id: 10, name: "Trà sen vàng", price: 32000, category: "Tea", img: "image/10.jpg" },
    { id: 11, name: "Trà sữa thái xanh", price: 28000, category: "Tea", img: "image/11.jpg" },
    { id: 12, name: "Trà đen macchiato", price: 25000, category: "Tea", img: "image/12.jpg" },
    { id: 13, name: "Trà sữa trân châu", price: 30000, category: "Trà sữa", img: "image/13.jpg" },
    { id: 14, name: "Trà sữa panda", price: 35000, category: "Trà sữa", img: "image/14.jpg" },
    { id: 15, name: "Trà sữa khoai môn", price: 32000, category: "Trà sữa", img: "image/15.jpg" },
    { id: 16, name: "Trà sữa matcha đỏ", price: 35000, category: "Trà sữa", img: "image/16.jpg" },
    { id: 17, name: "Trà sữa ô long kem cheese", price: 38000, category: "Trà sữa", img: "image/17.jpg" },
    { id: 18, name: "Trà sữa hoàng kim", price: 40000, category: "Trà sữa", img: "image/18.jpg" }
];

// Render menu
function renderMenu() {
    const menuList = document.getElementById('menuList');
    menuList.innerHTML = '';
    const categories = [...new Set(menu.map(m => m.category))];

    categories.forEach(cat => {
        const catTitle = document.createElement('div');
        catTitle.className = 'category-title';
        catTitle.textContent = cat;
        menuList.appendChild(catTitle);

        const grid = document.createElement('div');
        grid.className = 'menu-grid';
        menu.filter(m => m.category === cat).forEach(item => {
            const div = document.createElement('div');
            div.className = 'menu-item';
            div.onclick = () => addToCart(item);
            div.innerHTML = `
        <img src="${item.img}" alt="${item.name}">
        <h3>${item.name}</h3>
        <div class="price">${item.price.toLocaleString()}đ</div>
      `;
            grid.appendChild(div);
        });
        menuList.appendChild(grid);
    });
}

// Thêm vào giỏ
function addToCart(item) {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    updateCartDisplay();
}

// Cập nhật giỏ hàng
function updateCartDisplay() {
    const totalItems = cart.reduce((s, i) => s + i.qty, 0);
    const totalPrice = cart.reduce((s, i) => s + i.qty * i.price, 0);
    document.getElementById('cartCount').textContent = totalItems;
    document.getElementById('cartTotalItems').textContent = totalItems;
    document.getElementById('cartTotalPrice').textContent = totalPrice.toLocaleString() + 'đ';
    document.getElementById('cartFixed').style.display = totalItems > 0 ? 'flex' : 'none';
}

// HOÀN TẤT ĐẶT MÓN → LƯU + CẬP NHẬT TRẠNG THÁI BÀN = OCCUPIED
function completeOrder() {
    if (cart.length === 0) return alert("Giỏ hàng trống!");

    let tables = JSON.parse(localStorage.getItem('tables') || '[]');
    const table = tables.find(t => t.id == tableId);

    if (table) {
        // Cập nhật trạng thái bàn thành occupied
        table.status = 'occupied';
        if (table.orderCounter === 0) table.orderCounter = 1;

        // Thêm món vào bàn
        cart.forEach(cartItem => {
            const existing = table.items.find(i => i.name === cartItem.name);
            if (existing) {
                existing.qty += cartItem.qty;
            } else {
                table.items.push({ ...cartItem });
            }
        });

        localStorage.setItem('tables', JSON.stringify(tables));
    }

    alert(`Đã đặt ${cart.length} món cho bàn ${tableId}! Bàn đã được chuyển sang trạng thái ĐANG PHỤC VỤ.`);
    window.location.href = '../Quan_ly_ban_hang/index.html';
}

// HỦY ĐẶT MÓN → XÓA GIỎ HÀNG, KHÔNG ĐỔI TRẠNG THÁI BÀN
function cancelOrder() {
    if (cart.length === 0) {
        if (confirm("Giỏ hàng đã trống. Bạn có muốn quay lại không?")) {
            window.location.href = '../Quan_ly_ban_hang/index.html';
        }
        return;
    }

    if (confirm("Bạn có chắc muốn hủy toàn bộ giỏ hàng?")) {
        cart = [];
        updateCartDisplay();
        alert("Đã hủy đặt món!");
    }
}

// Tìm kiếm
document.getElementById('applyBtn').onclick = () => {
    const query = document.getElementById('searchInput').value.toLowerCase();
    document.querySelectorAll('.menu-item').forEach(item => {
        const name = item.querySelector('h3').textContent.toLowerCase();
        item.style.display = name.includes(query) ? 'block' : 'none';
    });
};

// Quay lại trang bán hàng
function goBack() {
    if (cart.length > 0) {
        if (confirm("Bạn có giỏ hàng chưa hoàn tất. Thoát sẽ mất dữ liệu. Bạn có chắc muốn thoát?")) {
            window.location.href = '../Quan_ly_ban_hang/index.html';
        }
    } else {
        window.location.href = '../Quan_ly_ban_hang/index.html';
    }
}

// Khởi động
renderMenu();
updateCartDisplay();