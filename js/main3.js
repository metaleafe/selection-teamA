document.addEventListener("DOMContentLoaded", function () {
  // ハンバーガーメニュー
  const toggleBtn = document.querySelector(".toggle_btn");
  const header = document.querySelector("header");
  const mask = document.querySelector(".mask");
  const navLinks = document.querySelectorAll("nav a");

  toggleBtn.addEventListener("click", function () {
    header.classList.toggle("open");
  });

  function closeMenu() {
    header.classList.remove("open");
  }

  mask.addEventListener("click", function () {
    console.log("マスクがクリックされました");
    closeMenu();
  });

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      setTimeout(closeMenu, 100);
    });
  });

  // タイピングアニメーション
  const title = document.querySelector(".introduction_title");
  const text = document.querySelector(".introduction_text");
  const originalText = title.textContent;
  title.textContent = "";

  let index = 0;

  function typeWriter() {
    if (index < originalText.length) {
      title.textContent += originalText.charAt(index);
      index++;
      setTimeout(typeWriter, 150);
    } else {
      setTimeout(() => {
        title.classList.add("moved");
        setTimeout(() => {
          text.classList.add("show");
        }, 1000);
      }, 1000);
    }
  }

  typeWriter();

  // 🔽 トップに戻るボタンの表示制御
  const backToTopBtn = document.getElementById("backToTop");
  backToTopBtn.style.display = "none"; // 初期は非表示

  window.addEventListener("scroll", function () {
    if (window.scrollY > 200) {
      backToTopBtn.style.display = "block";
    } else {
      backToTopBtn.style.display = "none";
    }
  });
});
