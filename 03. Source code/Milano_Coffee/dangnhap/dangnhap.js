document.addEventListener("DOMContentLoaded", function () {
  // === DANH SÁCH TÀI KHOẢN (bạn có thể thêm thoải mái) ===
  const users = [
    { username: "admin", password: "123456", role: "Quản trị viên" },
    { username: "NV0001", password: "12345", role: "Chủ quán" },
    { username: "NV0002", password: "12345", role: "Quản lý" },
    { username: "NV0003", password: "12345", role: "Nhân viên" },
  ];

  const slides = document.querySelectorAll(".slide");
  const dotsContainer = document.querySelector(".dots");
  const errorMsg = document.getElementById("errorMessage");
  let currentSlide = 0;
  const totalSlides = slides.length;

  // Tạo dots
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
  const dots = document.querySelectorAll(".dot");

  function showSlide(index) {
    slides.forEach((s, i) => {
      s.classList.remove("active");
      dots[i].classList.remove("active");
    });
    slides[index].classList.add("active");
    dots[index].classList.add("active");
    currentSlide = index;
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
  }

  function goToSlide(index) {
    showSlide(index);
  }

  // Tự động chuyển ảnh mỗi 2 giây
  setInterval(nextSlide, 2000);

  // Floating label
  const inputs = document.querySelectorAll(".input-group input");
  inputs.forEach((input) => {
    input.addEventListener("focus", () =>
      input.parentNode.classList.add("focused")
    );
    input.addEventListener("blur", () => {
      if (input.value === "") input.parentNode.classList.remove("focused");
    });
  });

  // === XỬ LÝ ĐĂNG NHẬP ===
  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    // Tìm user
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      // Đăng nhập thành công
      errorMsg.classList.remove("show");

      // Lưu thông tin user vào localStorage (để dùng ở các trang khác nếu cần)
      localStorage.setItem("currentUser", JSON.stringify({
        username: user.username,
        role: user.role
      }));

      // Thông báo chào + chuyển trang ngay lập tức
      alert(`Đăng nhập thành công!\nXin chào ${user.role}: ${username}`);

      // CHUYỂN NGAY VÀO TRANG QUẢN LÝ BÁN HÀNG
      window.location.href = "../Quan_ly_ban_hang/index.html";

    } else {
      // Sai tài khoản hoặc mật khẩu
      errorMsg.classList.add("show");
      setTimeout(() => errorMsg.classList.remove("show"), 4000);
    }
  });
});
