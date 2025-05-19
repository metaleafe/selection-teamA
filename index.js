const pages = [
  "ここは、仲間を探す者たちが\nそっと集まる場所。",
  "あなたの物語も——\nここから始まろうとしている。",
  "冒険を始めますか？",
];

let currentPage = 0;
let isTyping = false;

function typeWriter(text, element, speed = 50, callback = null) {
  element.textContent = "";
  let i = 0;
  isTyping = true;
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else {
      isTyping = false;
      if (callback) callback();
    }
  }
  type();
}

function nextPage() {
  if (isTyping || currentPage >= pages.length - 1) return;

  const textElement = document.getElementById("intro-text");
  const choicesElement = document.getElementById("intro-choices");

  currentPage++;

  if (currentPage < pages.length - 1) {
    typeWriter(pages[currentPage], textElement);
  } else if (currentPage === pages.length - 1) {
    typeWriter(pages[currentPage], textElement, 50, () => {
      // 「冒険を始めますか？」ページが終わったら、ボタン表示
      choicesElement.style.display = "block";

      // ボタンがクリックされたときの処理を追加
      const startButtons = choicesElement.querySelectorAll("button");
      startButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const musicOn = button.textContent.includes("音楽ON");
          console.log(
            "🚀 冒険を開始します（音楽" + (musicOn ? "ON" : "OFF") + "）"
          );
          startAdventure(musicOn);
        });
      });
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");
  const textElement = document.getElementById("intro-text");
  const introContainer = document.getElementById("intro-container");
  const game = document.getElementById("gameContainer");
  const modal = document.getElementById("howToPlayModal");
  const closeBtn = document.getElementById("closeHowToPlayBtn");

  // 初回導入画面表示
  if (hasSeenIntro !== "true") {
    typeWriter(pages[0], textElement);
    const advance = () => {
      if (currentPage < pages.length - 1 && !isTyping) {
        nextPage();
      }
    };
    introContainer.addEventListener("click", advance);
    introContainer.addEventListener("touchstart", advance, { passive: true });
  } else {
    // 導入をスキップしてゲーム画面に進む
    introContainer.style.display = "none";
    game.style.display = "block";
    startAdventure(); // ここで音楽再生などの処理を呼び出す
  }

  // 遊び方モーダル（初回のみ表示）
  if (!sessionStorage.getItem("howToPlayShown")) {
    modal.classList.remove("hidden");
    sessionStorage.setItem("howToPlayShown", "true");
  }

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });
});

function startAdventure() {
  sessionStorage.setItem("hasSeenIntro", "true");

  const intro = document.getElementById("intro-container");
  const game = document.getElementById("gameContainer");

  const bgm = document.getElementById("bgm");
  const volumeSlider = document.getElementById("bgm-volume");
  const muteBtn = document.getElementById("mute-toggle");
  const muteIcon = document.getElementById("mute-icon");

  // 音量の取得（sessionStorageがなければデフォルト0.3）
  let savedVolume = sessionStorage.getItem("bgmVolume");
  savedVolume = savedVolume !== null ? parseFloat(savedVolume) : 0.3;

  bgm.volume = savedVolume;
  volumeSlider.value = savedVolume;
  bgm.muted = savedVolume === 0;
  muteIcon.textContent = bgm.muted ? "🔇" : "🎵";

  // musicOnフラグ（なければtrueで初期化）
  let musicEnabled = sessionStorage.getItem("musicOn");
  musicEnabled = musicEnabled !== null ? JSON.parse(musicEnabled) : true;

  // 🔊 自動再生（条件：音楽ONかつボリュームが0以上）
  if (musicEnabled && savedVolume > 0) {
    bgm.play().catch((e) => {
      console.warn("再生がブロックされました:", e);
    });
  }

  // 🎚️ 音量スライダー
  volumeSlider.addEventListener("input", () => {
    const volume = parseFloat(volumeSlider.value);
    bgm.volume = volume;
    bgm.muted = volume === 0;

    muteIcon.textContent = bgm.muted ? "🔇" : "🎵";
    sessionStorage.setItem("bgmVolume", volume);

    if (volume > 0) {
      // musicOnがfalseだった場合だけ再生
      const wasMusicOff = sessionStorage.getItem("musicOn") === "false";
      bgm.muted = false;
      sessionStorage.setItem("musicOn", JSON.stringify(true));

      if (wasMusicOff) {
        bgm.play().catch((e) => {
          console.warn("音楽の再生に失敗しました:", e);
        });
      }
    } else {
      sessionStorage.setItem("musicOn", JSON.stringify(false));
    }
  });

  // 🔇 ミュートボタン
  muteBtn.addEventListener("click", () => {
    if (bgm.muted || bgm.volume === 0) {
      const lastVolume = parseFloat(sessionStorage.getItem("bgmVolume")) || 0.3;
      bgm.volume = lastVolume;
      bgm.muted = false;
      volumeSlider.value = lastVolume;
      sessionStorage.setItem("musicOn", JSON.stringify(true));
    } else {
      bgm.muted = true;
      bgm.volume = 0;
      volumeSlider.value = 0;
      sessionStorage.setItem("musicOn", JSON.stringify(false));
    }
    muteIcon.textContent = bgm.muted ? "🔇" : "🎵";
    sessionStorage.setItem("bgmVolume", bgm.volume);
  });

  // 画面切り替え
  if (game) game.style.display = "block";
  intro.classList.add("fade-out");
  setTimeout(() => intro.remove(), 1000);
}

function startAdventure() {
  sessionStorage.setItem("hasSeenIntro", "true");

  const intro = document.getElementById("intro-container");
  const game = document.getElementById("gameContainer");

  const bgm = document.getElementById("bgm");
  const volumeSlider = document.getElementById("bgm-volume");
  const muteBtn = document.getElementById("mute-toggle");
  const muteIcon = document.getElementById("mute-icon");

  // 音量の取得（sessionStorageがなければデフォルト0.3）
  let savedVolume = sessionStorage.getItem("bgmVolume");
  savedVolume = savedVolume !== null ? parseFloat(savedVolume) : 0.3;

  bgm.volume = savedVolume;
  volumeSlider.value = savedVolume;
  bgm.muted = savedVolume === 0;
  muteIcon.textContent = bgm.muted ? "🔇" : "🎵";

  // musicOnフラグ（なければtrueで初期化）
  let musicEnabled = sessionStorage.getItem("musicOn");
  musicEnabled = musicEnabled !== null ? JSON.parse(musicEnabled) : true;

  // 🔊 自動再生（条件：音楽ONかつボリュームが0以上）
  if (musicEnabled && savedVolume > 0) {
    bgm.play().catch((e) => {
      console.warn("再生がブロックされました:", e);
    });
  }

  // 🎚️ 音量スライダー
  volumeSlider.addEventListener("input", () => {
    const volume = parseFloat(volumeSlider.value);
    bgm.volume = volume;
    bgm.muted = volume === 0;

    muteIcon.textContent = bgm.muted ? "🔇" : "🎵";
    sessionStorage.setItem("bgmVolume", volume);

    if (volume > 0) {
      // musicOnがfalseだった場合だけ再生
      const wasMusicOff = sessionStorage.getItem("musicOn") === "false";
      bgm.muted = false;
      sessionStorage.setItem("musicOn", JSON.stringify(true));

      if (wasMusicOff) {
        bgm.play().catch((e) => {
          console.warn("音楽の再生に失敗しました:", e);
        });
      }
    } else {
      sessionStorage.setItem("musicOn", JSON.stringify(false));
    }
  });

  // 🔇 ミュートボタン
  muteBtn.addEventListener("click", () => {
    if (bgm.muted || bgm.volume === 0) {
      const lastVolume = parseFloat(sessionStorage.getItem("bgmVolume")) || 0.3;
      bgm.volume = lastVolume;
      bgm.muted = false;
      volumeSlider.value = lastVolume;
      sessionStorage.setItem("musicOn", JSON.stringify(true));
    } else {
      bgm.muted = true;
      bgm.volume = 0;
      volumeSlider.value = 0;
      sessionStorage.setItem("musicOn", JSON.stringify(false));
    }
    muteIcon.textContent = bgm.muted ? "🔇" : "🎵";
    sessionStorage.setItem("bgmVolume", bgm.volume);
  });

  // 画面切り替え
  if (game) game.style.display = "block";
  intro.classList.add("fade-out");
  setTimeout(() => intro.remove(), 1000);
}

// =======================================
// 1. DOM + Canvas 初期化
// =======================================

// 指定したセレクタと一致するHTML要素を取得
const canvas = document.querySelector("canvas");
// canvas要素の2Dグラフィック用のオブジェクト
const c = canvas.getContext("2d");
// ダイアログの情報取得
const dialogueBox = document.getElementById("dialogueBox");
const dialogueText = document.getElementById("dialogueText");
const dialogueName = document.getElementById("dialogueName");
// 描写画面のサイズ
canvas.width = 1024;
canvas.height = 576;
// スピード統一
const MOVE_SPEED = 3;
//野菜たちの当たり判定
const pumpkinWidth = 45;
const pumpkinHeight = 40;
const carrotWidth = 36;
const carrotHeight = 30;
const cabbageWidth = 42;
const cabbageHeight = 37;

// =======================================
// 2. 画像読み込み用
// =======================================

function loadImage(src) {
  const img = new Image();
  img.src = src;
  return img;
}

// =======================================
// 3. 画像リソース読み込み
// =======================================

const backgroundImage = loadImage("./img/Pellet_Town.png");
const foregroundImage = loadImage("./img/foregroundObjects.png");
const playerDownImage = loadImage("./img/playerDown.png");
const playerUpImage = loadImage("./img/playerUp.png");
const playerLeftImage = loadImage("./img/playerLeft.png");
const playerRightImage = loadImage("./img/playerRight.png");

const npcSprites = {
  down: loadImage("./img/npc1/npcDown.png"),
  up: loadImage("./img/npc1/npcUp.png"),
  left: loadImage("./img/npc1/npcLeft.png"),
  right: loadImage("./img/npc1/npcRight.png"),
};

const irukaSprites = {
  down: loadImage("./img/iruka/irukaDown.png"),
  up: loadImage("./img/iruka/irukaUp.png"),
  left: loadImage("./img/iruka/irukaLeft.png"),
  right: loadImage("./img/iruka/irukaRight.png"),
};

const kakashiSprites = {
  down: loadImage("./img/kakashi/kakashiDown.png"),
  up: loadImage("./img/kakashi/kakashiUp.png"),
  left: loadImage("./img/kakashi/kakashiLeft.png"),
  right: loadImage("./img/kakashi/kakashiRight.png"),
};

const asanoSprites = {
  down: loadImage("./img/asano/asanoDown.png"),
  up: loadImage("./img/asano/asanoUp.png"),
  left: loadImage("./img/asano/asanoLeft.png"),
  right: loadImage("./img/asano/asanoRight.png"),
};

const vegetableSprites = {
  pumpkin: loadImage("./img/vegetable/pumpkin.png"),
  carrot: loadImage("./img/vegetable/carrot.png"),
  cabbage: loadImage("./img/vegetable/cabbage.png"),
};

// =======================================
// 4. マップ境界 (collisions) 初期化
// ======================================

const mapTileWidth = 70; // マップの横幅
const collisionsMap = [];
let skipNpcCollisionFrames = 10;

// 70 要素ずつスライスして 2D 配列にする
for (let i = 0; i < collisions.length; i += mapTileWidth) {
  collisionsMap.push(collisions.slice(i, mapTileWidth + i));
}

const boundaries = [];
const offset = { x: -735, y: -650 }; // 初期位置

// 各 cell が 1025 (衝突マーク) なら Boundary インスタンスを生成
collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025) {
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
    }
  });
});

// =======================================
// 5. キャラクター初期化
// =======================================

const npcs = [
  // new Npc({
  //   position: { x: 100, y: 200 },
  //   image: npcSprites.down,
  //   sprites: npcSprites,
  //   dialogue: ["ようこそ！", "この街へ"],
  //   name: "村人A",
  // }),

  // new ChoiceNpc({
  //   position: { x: 300, y: 200 },
  //   image: npcSprites.down,
  //   sprites: npcSprites,
  //   dialogue: ["冒険に出発しますか？", "またな！"],
  //   name: "村人B",
  //   choices: [
  //     {
  //       label: "はい",
  //       advance: true,
  //       action: () => fadeOutAndNavigate("contact.html"),
  //     },
  //     {
  //       label: "いいえ",
  //       advance: false,
  //       action: () => startAdventure(),
  //     },
  //   ],
  // }),

  new ChoiceNpc({
    position: { x: 1450, y: -20 },
    image: irukaSprites.down,
    sprites: irukaSprites,
    dialogue: [
      "こんにちは、冒険者さん！\n過去の僕たちの冒険の記録見ていかない？",
      "また興味が出たら話しかけてね！",
    ],
    name: "いるか",
    choices: [
      {
        label: "はい",
        advance: true,
        action: () => fadeOutAndNavigate("index2.html"),
      },
      {
        label: "いいえ",
        advance: false,
        action: () => {
          startAdventure();
        },
      },
    ],
  }),

  new ChoiceNpc({
    position: { x: 1160, y: 605 },
    image: kakashiSprites.down,
    sprites: kakashiSprites,
    dialogue: [
      "やあ、冒険者さん！今度、僕らの集いがあるんだ！\n 仲間を出来る数少ないチャンスだよ！君も来ないか？",
      "仲間を作れるのは今しかないチャンスだから\n君も逃さないようにね！",
    ],
    name: "かかし",
    choices: [
      {
        label: "はい",
        advance: true,
        action: () => fadeOutAndNavigate("contact.html"),
      },
      {
        label: "いいえ",
        advance: false,
        action: () => {
          startAdventure();
        },
      },
    ],
  }),

  new Npc({
    position: { x: 700, y: 235 },
    image: asanoSprites.down,
    sprites: asanoSprites,
    dialogue: [
      "ようこそ、冒険者さん！\n何か困ってることがあったら、僕がアシストするよ！",
      "そうだ！この道の先に行ってみるといいんじゃないかな！\n君の為になると思うよ！",
      "君が頑張るなら僕も全力で応援するからね！",
    ],
    name: "あさの",
  }),

  //ここから野菜たち
  new Npc({
    position: { x: 1690, y: 375 },
    image: vegetableSprites.pumpkin,
    dialogue: [
      "ねえ、知ってる？",
      "大体のプログラミングの案件単価って、\nバナー制作　3千～5千円 ・ チラシ制作　5千～2万円",
      "LP制作　5万～2万円 ・ HP制作　30万～100万円 くらいなんだよ！",
      "スキルを武器に、5万円から一緒に頑張ろうね！",
    ],
    name: "南瓜A",
    width: pumpkinWidth,
    height: pumpkinHeight,
  }),

  new Npc({
    position: { x: 1635, y: 425 },
    image: vegetableSprites.pumpkin,
    dialogue: [
      "ねえ、知ってる？\npx・em・remの違いってね、",
      "絶対値：他の要素に左右されない値（px）\n相対値：他の要素を基準に変わる値（em・rem）　なんだって！",
      "つまり、絶対値(px)指定だと閲覧するデバイスの拡大縮小によって、\n見えにくくなることもあるんだ...",
      "そういう時は相対値(em・rem)を使って、見え方を変える必要があるよ！",
      "更に、相対値(em・rem)を使うと「全体的に文字サイズを変更したい」などの\nお客様要望も簡単に手直し出来るんだ！",
      "もっと知りたいなら、君も仲間を見つけに行こうよ！",
    ],
    name: "南瓜B",
    width: pumpkinWidth,
    height: pumpkinHeight,
  }),
  new Npc({
    position: { x: 1690, y: 475 },
    image: vegetableSprites.pumpkin,
    dialogue: [
      "ねえ、知ってる？\n",
      "CSSって “どう書くか” より “どう整理するか” が大事 なんだって！\nたとえば “BEM(ベム)” っていう書き方ルールを使うと",
      "どのパーツがどこに対応してるかが一目でわかって、\nあとから修正するときにも迷わなくなるんだよ。",
      "BEM(ベム)の考え方は、Webサイトを『部品』としてとらえて、\nそれぞれに “名前” と “役割” をつけて管理するってイメージ！",
      "まるでレゴブロックを組み立てるみたいな感覚！",
      "慣れると “どこで何を変更してるか” がすぐわかるようになって、\nチーム作業でも大活躍するんだ✨",
    ],
    name: "南瓜C",
    width: pumpkinWidth,
    height: pumpkinHeight,
  }),

  new Npc({
    position: { x: 600, y: 510 },
    image: vegetableSprites.carrot,
    dialogue: [
      "ねえ、知ってる？",
      "よく使う VSCode ショートカットでね、\n【ファイルを保存】　Ctrl＋S もしくは Command＋S",
      "【選択行のコメント化】　Ctrl＋'/' もしくは Command＋'/'\n【クラス名をつける】　'.'＋クラス名＋Tab → <div class=\"クラス名\"> </div>",
      "ここら辺はよく使うから、知ってたかな？\n君も少しずつ覚えて作業時間短縮マスターになろう！",
    ],

    name: "人参A",
    width: carrotWidth,
    height: carrotHeight,
  }),
  new Npc({
    position: { x: 715, y: 510 },
    image: vegetableSprites.carrot,
    dialogue: [
      "ねえ、知ってる？",
      "よく使う VSCode ショートカットでね、\n【検索】　Ctrl＋F /【置換】　Ctrl＋H",
      "【次を検索】　F3 \n 【前を検索】　Shift＋F3",
      "ここら辺は覚えたらどんなお客様要望にもサクッと対応できるね！\nお客様も大満足だ！",
    ],

    name: "人参B",
    width: carrotWidth,
    height: carrotHeight,
  }),
  new Npc({
    position: { x: 545, y: 540 },
    image: vegetableSprites.cabbage,
    dialogue: [
      "ねえ、“アクセシビリティ” って知ってる？",
      "実はこれ、“どんな人にも使いやすいWebを作ろう！” っていう考え方なんだ！",
      "たとえば、目が見えにくい人が音声読み上げを使ったり、\nキーボードだけで操作する人もいるよね？",
      "そういう人たちにも “ちゃんと情報が伝わる・使いやすい” ようにすること\nそれが “アクセシビリティ” なんだって！",
      "文字サイズを変更しやすくしたり、色だけに頼らない設計にしたり、\nほんの少しの工夫が “誰かにとってすごく大きな助け” になるんだよ✨",
    ],
    name: "ｷｬﾍﾞﾂ",
    width: cabbageWidth,
    height: cabbageHeight,
  }),
  new Npc({
    position: { x: 655, y: 540 },
    image: vegetableSprites.cabbage,
    dialogue: [
      "ねえ、UI/UX ってよく聞くけど、何が違うか知ってる？",
      "UIは “User Interface（ユーザーインターフェース）” の略で、\nつまり『見た目』のこと。ボタンの形とか、色、配置とかね！",
      "UXは “User Experience（ユーザー体験）” の略で、\n『使ったときに感じることすべて』を指すんだ！",
      "たとえば、“見やすい” UIがあることで、\n “わかりやすくてストレスなく使えた！” というUXにつながるんだよ。",
      "UIが良くてもUXが悪いと、“イライラするサイト” になることもあるから、\n両方をバランスよく考えるのが大切なんだね！",
    ],
    name: "ｷｬﾍﾞﾂ",
    width: cabbageWidth,
    height: cabbageHeight,
  }),
  new Npc({
    position: { x: 765, y: 540 },
    image: vegetableSprites.cabbage,
    dialogue: [
      "ねえ、SEOって知ってる？",
      "SEOは “検索結果で上に出るようにする工夫” のことなんだって！",
      "難しそうに見えるけど、\n本当に大事なのは “読んだ人がわかりやすいかどうか” ！",
      "知りたいことがすぐ見つかる・スマホでも読みやすい、\nそんなページがGoogleにも高く評価されるんだよ✨",
      "つまりSEOって、\n “検索エンジン” より “人のため” に作るのが近道なんだって！",
    ],
    name: "ｷｬﾍﾞﾂ",
    width: cabbageWidth,
    height: cabbageHeight,
  }),
];

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2, // 192→player画像の幅
    y: canvas.height / 2 - 68 / 2, // 68→player画像の高さ
  },
  image: playerDownImage,
  frames: { max: 4 },
  sprites: {
    up: playerUpImage,
    left: playerLeftImage,
    right: playerRightImage,
    down: playerDownImage,
  },
});

// 始まりの地
const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: backgroundImage,
});

// 被った部分の画像
const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: foregroundImage,
});
const movables = [background, ...boundaries, ...npcs, foreground];

// =======================================
// 6. キー状態管理
// =======================================

const keys = {
  w: { pressed: false },
  a: { pressed: false },
  s: { pressed: false },
  d: { pressed: false },
};
let lastKey = "";
let targetPosition = null; // 目的地を保存

// =======================================
// 7. 衝突判定ユーティリティ
// =======================================

function rectangularCollision({ rectangle1, rectangle2 }) {
  const foot = {
    x: rectangle1.position.x + 8,
    y: rectangle1.position.y + 48,
    width: 32,
    height: 20,
  };
  return (
    foot.x + foot.width >= rectangle2.position.x &&
    foot.x <= rectangle2.position.x + rectangle2.width &&
    foot.y + foot.height >= rectangle2.position.y &&
    foot.y <= rectangle2.position.y + rectangle2.height
  );
}

// =======================================
// 8. メインループ
// =======================================

function handleMovement(direction, axis, delta) {
  player.moving = true;
  player.image = player.sprites[direction];

  const intendedMove = axis === "x" ? { x: delta, y: 0 } : { x: 0, y: delta };

  const collisionWithBoundary = boundaries.some((boundary) =>
    rectangularCollision({
      rectangle1: player,
      rectangle2: {
        ...boundary,
        position: {
          x: boundary.position.x - intendedMove.x,
          y: boundary.position.y - intendedMove.y,
        },
      },
    })
  );

  const collisionWithNpc = checkNpcCollision(player, npcs, intendedMove);

  if (!collisionWithBoundary && !collisionWithNpc) {
    movables.forEach((movable) => {
      movable.position.x -= intendedMove.x;
      movable.position.y -= intendedMove.y;
    });
  } else {
    console.log(`${direction}に当たるよ！`);
    player.moving = false;
  }
}

function animate() {
  window.requestAnimationFrame(animate);

  // 会話後のフレームスキップ減算
  if (skipNpcCollisionFrames > 0) skipNpcCollisionFrames--;

  // ── 描画順 ──
  background.draw();
  boundaries.forEach((b) => b.draw());
  npcs.forEach((npc) => npc.draw());
  player.draw();
  foreground.draw();
  // positionDialogueBox();

  // デバッグ用：プレイヤーの当たり判定を水色で表示（足元判定用）
  // c.strokeStyle = "cyan";
  // c.strokeRect(player.position.x + 8, player.position.y + 48, 32, 24);

  // クリック移動処理
  if (targetPosition) {
    const playerWorldPosition = {
      x: canvas.width / 2 - player.width / 2 - background.position.x,
      y: canvas.height / 2 - player.height / 2 - background.position.y,
    };

    let intendedMove = { x: 0, y: 0 };

    if (Math.abs(playerWorldPosition.y - targetPosition.y) > 4) {
      intendedMove.y =
        playerWorldPosition.y < targetPosition.y ? MOVE_SPEED : -MOVE_SPEED;
    } else if (Math.abs(playerWorldPosition.x - targetPosition.x) > 4) {
      intendedMove.x =
        playerWorldPosition.x < targetPosition.x ? MOVE_SPEED : -MOVE_SPEED;
    } else {
      targetPosition = null;
      player.moving = false;
      return;
    }

    const collisionWithBoundary = boundaries.some((boundary) =>
      rectangularCollision({
        rectangle1: player,
        rectangle2: {
          ...boundary,
          position: {
            x: boundary.position.x - intendedMove.x,
            y: boundary.position.y - intendedMove.y,
          },
        },
      })
    );

    const collisionWithNpc = checkNpcCollision(player, npcs, intendedMove);

    if (!collisionWithBoundary && !collisionWithNpc) {
      movables.forEach((movable) => {
        movable.position.x -= intendedMove.x;
        movable.position.y -= intendedMove.y;
      });
      player.moving = true;

      if (intendedMove.y !== 0) {
        player.image =
          intendedMove.y > 0 ? player.sprites.down : player.sprites.up;
      } else if (intendedMove.x !== 0) {
        player.image =
          intendedMove.x > 0 ? player.sprites.right : player.sprites.left;
      }
    } else {
      targetPosition = null;
      player.moving = false;
    }
    return;
  }

  let moving = true;
  player.moving = false;

  if (keys.w.pressed && lastKey === "w") {
    handleMovement("up", "y", -MOVE_SPEED);
  } else if (keys.a.pressed && lastKey === "a") {
    handleMovement("left", "x", -MOVE_SPEED);
  } else if (keys.s.pressed && lastKey === "s") {
    handleMovement("down", "y", MOVE_SPEED);
  } else if (keys.d.pressed && lastKey === "d") {
    handleMovement("right", "x", MOVE_SPEED);
  }
}
function waitForImage(img) {
  return new Promise((resolve) => {
    if (img.complete) {
      resolve(); // すでに読み込み済み
    } else {
      img.onload = resolve;
    }
  });
}
animate();

//NPC人物判定
function checkNpcCollision(player, npcs, intendedMove) {
  if (skipNpcCollisionFrames > 0) return false; // ← この1行を先頭に追加！

  const playerFootArea = {
    position: {
      x: player.position.x + 8 + intendedMove.x,
      y: player.position.y + 32 + intendedMove.y,
    },
    width: 32,
    height: 24,
  };

  return npcs.some((npc) => {
    const npcArea = {
      position: {
        x: npc.position.x,
        y: npc.position.y,
      },
      width: npc.width,
      height: npc.height,
    };

    return (
      playerFootArea.position.x + playerFootArea.width >= npcArea.position.x &&
      playerFootArea.position.x <= npcArea.position.x + npcArea.width &&
      playerFootArea.position.y + playerFootArea.height >= npcArea.position.y &&
      playerFootArea.position.y <= npcArea.position.y + npcArea.height
    );
  });
}

// =======================================
// 11. イベントリスナー登録
// =======================================

window.addEventListener("keydown", (e) => {
  if (isTalking) return; // ✅ 会話中なら無視

  switch (e.key) {
    case "w":
      keys.w.pressed = true;
      lastKey = "w";
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "s":
      keys.s.pressed = true;
      lastKey = "s";
      break;
    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
});

// クリックで会話進行
dialogueBox.addEventListener("click", () => {
  if (isTalking) {
    advanceDialogue();
  }
});
canvas.addEventListener("click", (e) => {
  // プレイヤーが移動中なら、会話を行わない
  if (player.moving) {
    console.log("移動中のため会話をキャンセル");
    return;
  }

  if (isTalking) {
    advanceDialogue();
    return;
  }

  const canvasRect = canvas.getBoundingClientRect();
  const clickX = e.clientX - canvasRect.left;
  const clickY = e.clientY - canvasRect.top;

  // NPC クリック判定
  const clickedNpc = npcs.find((npc) => {
    return (
      clickX >= npc.position.x &&
      clickX <= npc.position.x + npc.width &&
      clickY >= npc.position.y &&
      clickY <= npc.position.y + npc.height &&
      isNearNpc(player, npc)
    );
  });

  if (clickedNpc) {
    targetPosition = null;

    if (clickedNpc.sprites) {
      const direction = getFacingDirection(clickedNpc, player);
      clickedNpc.image = clickedNpc.sprites[direction];
    }
    console.log("clickedNpcの型:", clickedNpc.constructor.name);
    console.log("clickedNpc.choices:", clickedNpc.choices);
    console.log("choicesの配列長:", clickedNpc.choices.length);

    console.log("NPCに話しかけた！");
    requestAnimationFrame(() => {
      showDialogue(clickedNpc.dialogue, clickedNpc.name, clickedNpc);
    });
    console.log("clickedNpc.choices=" + clickedNpc.choices);

    if (clickedNpc instanceof ChoiceNpc && clickedNpc.choices.length > 0) {
      console.log("選択肢ありNPCに話しかけた！");
      clickedNpc.showChoices();
    }

    return;
  }
  // 目的地設定
  targetPosition = {
    x: clickX - background.position.x - player.width / 2,
    y: clickY - background.position.y - player.height / 2 - 32,
  };
  console.log(`クリック位置: (${clickX}, ${clickY})`);
});

// =======================================
// 12. 会話制御
// =======================================

let isTalking = false;
let currentDialogue = null;

function faceNpc(player, npc) {
  const dx = npc.position.x - player.position.x;
  const dy = npc.position.y - player.position.y;

  if (Math.abs(dx) > Math.abs(dy)) {
    // 左右に離れている
    player.direction = dx > 0 ? "right" : "left";
  } else {
    // 上下に離れている
    player.direction = dy > 0 ? "down" : "up";
  }

  // 向きに応じて画像を変更
  if (player.sprites && player.sprites[player.direction]) {
    player.image = player.sprites[player.direction];
  }
}

function showDialogue(lines, name = "", npc = null) {
  if (!dialogueText || lines.length === 0) return;

  currentDialogue = { lines, name, npc, index: 0 };
  isTalking = true;
  dialogueName.innerText = name;
  dialogueText.innerText = lines[0];

  dialogueBox.classList.remove("hidden");
  void dialogueBox.offsetHeight; // ← これでレイアウト再計算を強制！
  if (npc) faceNpc(player, npc); //NPC向かせる
  positionDialogueBox();

  // ▼を表示して点滅させる
  const nextArrow = document.getElementById("nextArrow");
  if (nextArrow) {
    nextArrow.style.display = "inline";

    // すでに setInterval が動いてたら重複させないように一度クリア
    if (window.arrowBlinkInterval) clearInterval(window.arrowBlinkInterval);

    // 新しい点滅処理をセット
    window.arrowBlinkInterval = setInterval(() => {
      nextArrow.style.visibility =
        nextArrow.style.visibility === "hidden" ? "visible" : "hidden";
    }, 500);
  }
}

function advanceDialogue() {
  if (!currentDialogue) return;
  // ✅ 選択肢UIの後始末 ←ここが重要！
  const choiceBox = document.getElementById("choiceBox");
  choiceBox.classList.add("hidden");
  choiceBox.innerHTML = "";

  currentDialogue.index++;
  if (currentDialogue.index < currentDialogue.lines.length) {
    dialogueText.innerText = currentDialogue.lines[currentDialogue.index];
  } else {
    dialogueBox.classList.add("hidden");
    isTalking = false;
    skipNpcCollisionFrames = 3;

    const { npc } = currentDialogue;
    const dx = player.position.x - npc.position.x;
    const dy = player.position.y - npc.position.y;
    const pushAmount = 4;

    if (Math.abs(dx) > Math.abs(dy)) {
      const pushX = dx > 0 ? pushAmount : -pushAmount;
      movables.forEach((movable) => {
        movable.position.x -= pushX;
      });
    } else {
      const pushY = dy > 0 ? pushAmount : -pushAmount;
      movables.forEach((movable) => {
        movable.position.y -= pushY;
      });
    }

    // NPCの向きリセット
    if (npc && npc.sprites) {
      const dir = npc.defaultDirection || "down";
      npc.image = npc.sprites[dir];
    }
    currentDialogue = null;
  }
}

// =======================================
// 13. NPC 接近判定 & 向き判定
// =======================================

function isNearNpc(player, npc) {
  const buf = 12;
  const bufBottom = 24; // 下方向だけ広げたい場合はこれを少し大きめにする

  const playerFootArea = {
    x: player.position.x + 8,
    y: player.position.y + 48,
    width: 32,
    height: 20,
  };

  const npcArea = {
    x: npc.position.x,
    y: npc.position.y,
    width: npc.width,
    height: npc.height,
  };

  const Top =
    playerFootArea.y + playerFootArea.height >= npcArea.y - buf &&
    playerFootArea.y + playerFootArea.height <= npcArea.y + buf &&
    playerFootArea.x + playerFootArea.width > npcArea.x &&
    playerFootArea.x < npcArea.x + npcArea.width;

  const Bottom =
    playerFootArea.y <= npcArea.y + npcArea.height + bufBottom &&
    playerFootArea.y >= npcArea.y + npcArea.height - bufBottom &&
    playerFootArea.x + playerFootArea.width > npcArea.x &&
    playerFootArea.x < npcArea.x + npcArea.width;

  const Left =
    playerFootArea.x + playerFootArea.width >= npcArea.x - buf &&
    playerFootArea.x + playerFootArea.width <= npcArea.x + buf &&
    playerFootArea.y + playerFootArea.height > npcArea.y &&
    playerFootArea.y < npcArea.y + npcArea.height;

  const Right =
    playerFootArea.x <= npcArea.x + npcArea.width + buf &&
    playerFootArea.x >= npcArea.x + npcArea.width - buf &&
    playerFootArea.y + playerFootArea.height > npcArea.y &&
    playerFootArea.y < npcArea.y + npcArea.height;

  return Top || Bottom || Left || Right;
}

// NPCがクリックされたときにプレイヤーの位置と比較して、向きを判定
function getFacingDirection(npc, player) {
  const dx = player.position.x - npc.position.x;
  const dy = player.position.y - npc.position.y;
  return Math.abs(dx) > Math.abs(dy)
    ? dx > 0
      ? "right"
      : "left"
    : dy > 0
    ? "down"
    : "up"; // 三項演算子
}
function showChoices(options) {
  const choiceBox = document.getElementById("choiceBox");
  // optionsが無い、または空であれば、選択肢を表示しない
  if (!options || options.length === 0) {
    choiceBox.classList.add("hidden");
    return;
  }
  // choiceBoxを表示
  choiceBox.innerHTML = "";
  choiceBox.classList.remove("hidden");

  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.textContent = opt.label;

    // ボタンがクリックされた時の処理
    btn.onclick = async () => {
      // クリックされた時点でボタンを非表示にする
      choiceBox.classList.add("hidden");

      // opt.action()が非同期関数の場合に対応
      if (opt.action && typeof opt.action === "function") {
        await opt.action();
      }
    };

    // ボタンをchoiceBoxに追加
    choiceBox.appendChild(btn);
  });
}

function positionDialogueBox() {
  const rect = canvas.getBoundingClientRect();
  dialogueBox.style.top = rect.bottom - 220 + "px"; // 下から少し上（例:150px）
  dialogueBox.style.left = rect.left + canvas.width / 2 + "px"; // canvas中心
}
// NPCとの会話開始処理の一部例
function startDialogue(npc) {
  document.getElementById("dialogueBox").classList.remove("hidden");
  document.getElementById("dialogueName").textContent = npc.name;

  // NPCのセリフが空でないことを確認
  if (npc.dialogue && npc.dialogue.length > 0) {
    document.getElementById("dialogueText").textContent = npc.dialogue[0];
  } else {
    console.error("NPCのセリフが設定されていません！");
  }
}

//アニメーション
function fadeOutAndNavigate(url) {
  const tl = gsap.timeline();

  tl.to(
    CSSRulePlugin.getRule("body:before"),
    {
      duration: 0.6,
      cssRule: { top: "0%" },
      ease: "power2.inOut",
    },
    0
  )
    .to(
      CSSRulePlugin.getRule("body:after"),
      {
        duration: 0.6,
        cssRule: { bottom: "0%" },
        ease: "power2.inOut",
      },
      0
    )
    .to(
      ".loader",
      {
        duration: 1,
        opacity: 1,
        ease: "power2.out",
        onComplete: () => {
          window.location.href = url;
        },
      },
      1
    );
}
