document.addEventListener("DOMContentLoaded", () => {
  const title = document.querySelector(".record_title");
  const textCenter = document.querySelector(".text-center");
  const text = "冒険者たちの記録";
  let i = 0;

  // 初期状態
  title.textContent = "";
  textCenter.classList.remove("visible");

  function typeWriter() {
    if (i < text.length) {
      title.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 100);
    } else {
      // 1秒後にタイトルを上へ
      setTimeout(() => {
        title.classList.add("moved");
      }, 500);

      // タイトル移動後に text-center を表示
      setTimeout(() => {
        textCenter.classList.add("visible");
      }, 1500);
    }
  }

  typeWriter();
});



document.addEventListener("DOMContentLoaded", function () {
  const h4Elements = document.querySelectorAll(".voices h4, .voices2 h4, .voices3 h4");// アニメーションを適用したい対象を取得

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0) {
        // 要素がビューポート（画面）に入っているかどうか && 少しでも入っているかどうか
        entry.target.classList.add("inview");
        // ビューポートに入ったら、対象のh4にinviewクラスを追加
      }
    });
  }, {
    root: null,
    rootMargin: "0px 0px -200px 0px", // 画面下から200px手前で発火
    threshold: 0
  });

  h4Elements.forEach(h4 => observer.observe(h4));

});