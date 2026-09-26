const $ = id => document.getElementById(id);

let running = false;
let raw = 0;
let moves = 0;

let subs = 3;
let plays = 12;
let likes = 0;
let tips = 0;
let viewers = 0;

let startAt = 0;
let timer = null;

let last = 0;
let smooth = 0;

let audio = null;
let sound = true;
let pose = false;


/* =========================
   SE
========================= */

function tone(frequency) {
  if (!sound || !audio) return;

  const oscillator = audio.createOscillator();
  const gain = audio.createGain();

  oscillator.frequency.value = frequency;
  gain.gain.value = 0.025;

  oscillator.connect(gain);
  gain.connect(audio.destination);

  oscillator.start();

  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audio.currentTime + 0.1
  );

  oscillator.stop(audio.currentTime + 0.1);
}


/* =========================
   匿名視聴者名
========================= */

function anonName() {
  return "視聴者***" + String(
    Math.floor(Math.random() * 90) + 10
  );
}


/* =========================
   コメント追加
========================= */

function addComment(
  text,
  name = anonName(),
  superAmount = 0
) {
  const comments = $("comments");

  if (!comments) return;

  const row = document.createElement("div");

  row.className =
    "comment" +
    (
      superAmount
        ? " superchat sc" + superAmount
        : ""
    );

  const nameElement = document.createElement("span");
  nameElement.className = "commentName";
  nameElement.textContent = name;

  const messageElement = document.createElement("span");
  messageElement.textContent = text;

  row.append(
    nameElement,
    messageElement
  );

  comments.appendChild(row);

  comments.scrollTop =
    comments.scrollHeight;
}


/* =========================
   スパチャ
========================= */

function superChat(result) {
  const patron = result.patron;
  const amount = result.amount;

  const amountIcon =
    $("tip" + amount);

  if (amountIcon) {
    amountIcon.classList.remove("hit");

    void amountIcon.offsetWidth;

    amountIcon.classList.add("hit");
  }


  const patronBar =
    $("patronbar");

  if (patronBar) {
    const badge =
      document.createElement("div");

    badge.className =
      "patronicon sc" + amount;

    badge.textContent =
      patron.name +
      "\n¥" +
      amount;

    patronBar.appendChild(badge);


    /* 最大6人表示 */
    const badges =
      patronBar.querySelectorAll(
        ".patronicon"
      );

    if (badges.length > 6) {
      badges[0].remove();
    }


    /* 一定時間後に消える */
    setTimeout(() => {
      if (badge.isConnected) {
        badge.remove();
      }
    }, 6500);
  }


  /* スパチャ通知 */
  addComment(
    patron.name +
      "さんが¥" +
      amount +
      "スパチャしました",
    patron.name,
    amount
  );


  /* スパチャ勢本人のコメント */
  addComment(
    result.line,
    patron.name,
    amount
  );
}


/* =========================
   1動作
========================= */

function action() {
  raw++;


  /* 6動作までの進行 */
  const fill = $("fill");

  if (fill) {
    fill.style.width =
      ((raw % 6) / 6) * 100 + "%";
  }


  /* ポーズ切替 */
  pose = !pose;

  const streamerPose =
    $("streamerPose");

  if (streamerPose) {
    streamerPose.src =
      pose
        ? "./assets/streamer_up.png?v=1"
        : "./assets/streamer_down.png?v=1";
  }


  /* 6動作ごとにゲーム進行 */
  if (raw % 6 !== 0) {
    return;
  }

  moves++;
  plays++;

  const playsElement =
    $("plays");

  if (playsElement) {
    playsElement.textContent =
      plays;
  }

  if (fill) {
    fill.style.width = "100%";
  }


  /* =========================
     いいね
  ========================= */

  if (Math.random() < 0.55) {
    likes++;

    const likesElement =
      $("likes");

    if (likesElement) {
      likesElement.textContent =
        likes;
    }

    show("+1 いいね");
  }


  /* =========================
     視聴者
  ========================= */

  if (Math.random() < 0.95) {
    viewers++;

    const viewersElement =
      $("viewers");

    if (viewersElement) {
      viewersElement.textContent =
        viewers;
    }

    show("+1 視聴者");
  }


  /* =========================
     登録者
  ========================= */

  if (
    Math.random() < 0.80 &&
    viewers >= 1
  ) {
    subs++;

    const subsElement =
      $("subs");

    if (subsElement) {
      subsElement.textContent =
        subs;
    }

    show("+1 登録");
  }


  /* =========================
     スパチャ
  ========================= */

  if (
    Math.random() < 0.75 &&
    subs >= 1 &&
    typeof StreamPatrons !== "undefined"
  ) {
    const result =
      StreamPatrons.tip(
        StreamPatrons.pick()
      );

    const patron =
      result.patron;

    const amount =
      result.amount;

    tips += amount;

    const tipsElement =
      $("tips");

    if (tipsElement) {
      tipsElement.textContent =
        tips;
    }

    show(
      patron.name +
      " ¥" +
      amount
    );

    superChat(result);
  }


  /* =========================
     一般コメント
  ========================= */

  if (
    Math.random() < 0.38 &&
    typeof StreamComments !== "undefined"
  ) {
    addComment(
      StreamComments.random()
    );
  }


  tone(520);


  setTimeout(() => {
    if (fill) {
      fill.style.width = "0%";
    }
  }, 180);
}


/* =========================
   画面上のポップ表示
========================= */

function show(text) {
  const pop =
    $("pop");

  if (!pop) return;

  pop.textContent =
    text;

  pop.classList.remove("go");

  void pop.offsetWidth;

  pop.classList.add("go");
}


/* =========================
   スマホ動作検出
========================= */

function motion(event) {
  if (!running) return;

  const acceleration =
    event.accelerationIncludingGravity;

  if (!acceleration) return;

  const magnitude =
    Math.sqrt(
      (acceleration.x || 0) ** 2 +
      (acceleration.y || 0) ** 2 +
      (acceleration.z || 0) ** 2
    );

  smooth =
    smooth * 0.73 +
    magnitude * 0.27;

  const now =
    performance.now();

  if (
    Math.abs(
      magnitude - smooth
    ) > 1.7 &&
    now - last > 330
  ) {
    last = now;

    action();
  }
}


/* =========================
   配信時間
========================= */

function clock() {
  if (!startAt) return;

  const seconds =
    Math.floor(
      (Date.now() - startAt) /
      1000
    );

  const minutes =
    Math.floor(
      seconds / 60
    );

  const remain =
    seconds % 60;

  const time =
    $("time");

  if (time) {
    time.textContent =
      String(minutes).padStart(
        2,
        "0"
      ) +
      ":" +
      String(remain).padStart(
        2,
        "0"
      );
  }
}


/* =========================
   配信開始・停止
========================= */

async function toggleStream() {
  if (!audio) {
    const AudioContextClass =
      window.AudioContext ||
      window.webkitAudioContext;

    if (AudioContextClass) {
      audio =
        new AudioContextClass();
    }
  }


  /* iPhone モーション許可 */
  if (
    !running &&
    typeof DeviceMotionEvent !==
      "undefined" &&
    typeof DeviceMotionEvent
      .requestPermission ===
      "function"
  ) {
    try {
      const permission =
        await DeviceMotionEvent
          .requestPermission();

      if (
        permission !==
        "granted"
      ) {
        return;
      }
    } catch (error) {
      return;
    }
  }


  /* 配信開始 */
  if (!running) {
    running = true;

    if (!startAt) {
      startAt =
        Date.now();
    }

    clearInterval(timer);

    timer =
      setInterval(
        clock,
        500
      );

    window.addEventListener(
      "devicemotion",
      motion
    );

    const startButton =
      $("start");

    if (startButton) {
      startButton.textContent =
        "停止";
    }


    viewers =
      Math.max(
        1,
        viewers
      );

    const viewersElement =
      $("viewers");

    if (viewersElement) {
      viewersElement.textContent =
        viewers;
    }

    addComment(
      "配信始まった",
      "視聴者***"
    );

    return;
  }


  /* 配信停止 */
  running = false;

  clearInterval(timer);

  timer = null;

  window.removeEventListener(
    "devicemotion",
    motion
  );

  const startButton =
    $("start");

  if (startButton) {
    startButton.textContent =
      "再開";
  }
}


/* =========================
   SE ON / OFF
========================= */

function toggleSound() {
  sound = !sound;

  const soundButton =
    $("sound");

  if (soundButton) {
    soundButton.textContent =
      sound
        ? "SE ON"
        : "SE OFF";
  }
}


/* =========================
   ボタン接続
========================= */

const startButton =
  $("start");

if (startButton) {
  startButton.addEventListener(
    "click",
    toggleStream
  );
}

const soundButton =
  $("sound");

if (soundButton) {
  soundButton.addEventListener(
    "click",
    toggleSound
  );
}