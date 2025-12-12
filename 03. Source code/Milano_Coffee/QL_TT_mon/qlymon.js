// ==== QUAN-LY-MON.JS – REALTIME SEARCH + COFFEE BÍ MẬT, ĐẸP LUNG LINH ====

let menu = JSON.parse(localStorage.getItem("menuItems")) || [
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

// Danh sách Coffee bí mật (chỉ hiện khi gõ từ khóa coffee)
const secretCoffeeList = [
  { name: "Espresso", price: 29000, img: "image/19.jpg" },
  { name: "Caffee đặc biệt", price: 32000, img: "image/20.jpg" },
  { name: "Cappuccino", price: 35000, img: "image/21.jpg" },
  { name: "Sương sáo", price: 35000, img: "image/22.jpg" },
  { name: "Bạc xỉu muối", price: 35000, img: "image/23.jpg" },
  { name: "Bạc xỉu kem", price: 35000, img: "image/24.jpg" },
  { name: "Sữa SG", price: 35000, img: "image/25.jpg" },
  { name: "Caffee đen", price: 35000, img: "image/26.jpg" },
  { name: "Caffee kem", price: 35000, img: "image/27.jpg" }
];

let editingItemId = null;
let deletingItemId = null;

function saveMenu() {
  localStorage.setItem("menuItems", JSON.stringify(menu));
}

function renderMenu(items = menu) {
  const menuList = document.getElementById("menuList");
  if (!menuList) return;
  menuList.innerHTML = "";

  const categories = [...new Set(items.map(m => m.category))];

  categories.forEach(cat => {
    const catDiv = document.createElement("div");
    catDiv.className = "category";
    catDiv.innerHTML = `<div class="category-title">${cat}</div>`;

    const grid = document.createElement("div");
    grid.className = "menu-grid";

    items
      .filter(m => m.category === cat)
      .forEach(item => {
        const div = document.createElement("div");
        div.className = "menu-item";
        div.onclick = () => handleItemClick(item);
        div.innerHTML = `
          <img src="${item.img}" alt="${item.name}" 
               onerror="this.src='https://via.placeholder.com/180x180/c8a165/white?text=${encodeURIComponent(item.name)}'">
          <h3>${item.name}</h3>
          <div class="price">${item.price.toLocaleString()}đ</div>
        `;
        grid.appendChild(div);
      });

    catDiv.appendChild(grid);
    menuList.appendChild(catDiv);
  });
}

function handleItemClick(item) {
  const editBtn = document.querySelector(".btn-edit");
  const deleteBtn = document.querySelector(".btn-delete");

  if (editBtn?.classList.contains("active")) {
    openEditModal(item);
  } else if (deleteBtn?.classList.contains("active")) {
    openDeleteModal(item);
  }
}

// NÚT CHỈNH SỬA & XÓA (chỉ đổi màu khi bấm)
document.querySelector(".btn-edit")?.addEventListener("click", function () {
  this.classList.toggle("active");
  document.querySelector(".btn-delete")?.classList.remove("active");
});

document.querySelector(".btn-delete")?.addEventListener("click", function () {
  this.classList.toggle("active");
  document.querySelector(".btn-edit")?.classList.remove("active");
});

// ==================== TÌM KIẾM REALTIME + COFFEE BÍ MẬT ====================
const searchInput = document.getElementById("searchInput");

function performSearch() {
  const query = (searchInput?.value || "").trim().toLowerCase();

  let resultItems = menu;

  // Nếu gõ từ khóa coffee → hiện cả menu Coffee + danh sách bí mật
  if (query && ["coffee", "caffee", "cà phê", "cf", "phin", "espresso", "latte", "cappuccino"].some(w => query.includes(w))) {
    const secretWithId = secretCoffeeList.map((c, i) => ({
      ...c,
      id: 9999 + i,
      category: "Coffee"
    }));
    const allCoffee = [
      ...menu.filter(m => m.category === "Coffee"),
      ...secretWithId
    ];
    resultItems = allCoffee;
  }
  // Tìm theo tên món
  else if (query) {
    resultItems = menu.filter(m => m.name.toLowerCase().includes(query));
  }

  renderMenu(resultItems);
}

// Gõ là tìm ngay – realtime siêu mượt!
if (searchInput) {
  searchInput.addEventListener("input", performSearch);
}

// Khi xóa hết chữ → quay về menu gốc
searchInput?.addEventListener("search", () => {
  if (!searchInput.value) renderMenu();
});

// ==================== THÊM / SỬA / XÓA (giữ nguyên như cũ) ====================
// ... (giữ nguyên toàn bộ các hàm: openAddModal, saveNewItem, openEditModal, saveEditedItem, openDeleteModal, confirmDelete, v.v.)

// Ví dụ ngắn gọn (bạn giữ nguyên code cũ của bạn ở dưới đây)
document.getElementById("openAddModal")?.addEventListener("click", () => {
  document.getElementById("addModal").classList.add("active");
});

function closeAddModal() {
  document.getElementById("addModal").classList.remove("active");
  document.getElementById("newName").value = "";
  document.getElementById("newPrice").value = "";
  document.getElementById("newImage").value = "";
  document.getElementById("uploadText").style.display = "block";
  document.getElementById("previewImg").style.display = "none";
}

function previewImage(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = ev => {
      document.getElementById("previewImg").src = ev.target.result;
      document.getElementById("previewImg").style.display = "block";
      document.getElementById("uploadText").style.display = "none";
    };
    reader.readAsDataURL(file);
  }
}

function saveNewItem() {
  const name = document.getElementById("newName").value.trim();
  const price = parseInt(document.getElementById("newPrice").value);
  const category = document.getElementById("newCategory").value;
  const fileInput = document.getElementById("newImage");

  if (!name || isNaN(price) || price <= 0) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  let imgUrl = "https://via.placeholder.com/180x180/c8a165/white?text=New";
  if (fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      imgUrl = e.target.result;
      addItemToMenu(name, price, category, imgUrl);
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    addItemToMenu(name, price, category, imgUrl);
  }
}

function addItemToMenu(name, price, category, imgUrl) {
  const newId = menu.length ? Math.max(...menu.map(m => m.id)) + 1 : 1;
  menu.push({ id: newId, name, price, category, img: imgUrl });
  saveMenu();
  renderMenu();
  closeAddModal();
}

// Các hàm edit, delete giữ nguyên như cũ của bạn...
// (openEditModal, saveEditedItem, openDeleteModal, confirmDelete, v.v.)

// KHỞI ĐỘNG
document.addEventListener("DOMContentLoaded", () => {
  renderMenu();
});