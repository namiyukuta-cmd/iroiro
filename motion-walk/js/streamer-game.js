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
   入力モード・カメラ
========================= */

let inputMode = "motion";

let cameraStream = null;
let cameraTimer = null;
let cameraCanvas = null;
let cameraContext = null;
let previousFrame = null;

let lastCameraAction = 0;

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
   家事用カメラ動作検出
========================= */

async function startCamera() {
  const video = $("cameraVideo");

  if (!video) return false;

  if (
    !navigator.mediaDevices ||
    !navigator.mediaDevices.getUserMedia
  ) {
    return false;
  }

  try {
    cameraStream =
      await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 320 },
          height: { ideal: 240 }
        },
        audio: false
      });

    video.srcObject = cameraStream;

    await video.play();

    cameraCanvas =
      document.createElement("canvas");

    cameraCanvas.width = 80;
    cameraCanvas.height = 60;

    cameraContext =
      cameraCanvas.getContext(
        "2d",
        {
          willReadFrequently: true
        }
      );

    previousFrame = null;

    clearInterval(cameraTimer);

    cameraTimer =
      setInterval(
        detectCameraMotion,
        180
      );

    return true;

  } catch (error) {
    stopCamera();
    return false;
  }
}

function stopCamera() {
  clearInterval(cameraTimer);
  cameraTimer = null;

  if (cameraStream) {
    cameraStream
      .getTracks()
      .forEach(
        track => track.stop()
      );
  }

  cameraStream = null;
  previousFrame = null;
  cameraCanvas = null;
  cameraContext = null;

  const video = $("cameraVideo");

  if (video) {
    video.pause();
    video.srcObject = null;
  }
}

function detectCameraMotion() {
  if (
    !running ||
    inputMode !== "camera"
  ) {
    return;
  }

  const video =
    $("cameraVideo");

  if (
    !video ||
    !cameraCanvas ||
    !cameraContext ||
    video.readyState < 2
  ) {
    return;
  }

  cameraContext.drawImage(
    video,
    0,
    0,
    cameraCanvas.width,
    cameraCanvas.height
  );

  const frame =
    cameraContext.getImageData(
      0,
      0,
      cameraCanvas.width,
      cameraCanvas.height
    ).data;

  if (!previousFrame) {
    previousFrame =
      new Uint8ClampedArray(frame);

    return;
  }

  let changedPixels = 0;

  const totalPixels =
    cameraCanvas.width *
    cameraCanvas.height;

  for (
    let i = 0;
    i < frame.length;
    i += 4
  ) {
    const difference =
      Math.abs(
        frame[i] -
        previousFrame[i]
      ) +
      Math.abs(
        frame[i + 1] -
        previousFrame[i + 1]
      ) +
      Math.abs(
        frame[i + 2] -
        previousFrame[i + 2]
      );

    if (difference > 75) {
      changedPixels++;
    }
  }

  previousFrame =
    new Uint8ClampedArray(frame);

  const movement =
    changedPixels /
    totalPixels;

  const now =
    performance.now();

  /*
    画面の約4%以上が変化し、
    前回カウントから450ms以上経過
  */
  if (
    movement > 0.04 &&
    now - lastCameraAction > 450
  ) {
    lastCameraAction = now;

    action();
  }
}

/* =========================
   モーション / カメラ切替
========================= */

async function toggleCameraMode() {
  const button =
    $("cameraMode");

  if (inputMode === "motion") {

    const started =
      await startCamera();

    if (!started) {
      if (button) {
        button.textContent =
          "カメラ失敗";
      }

      return;
    }

    inputMode = "camera";

    window.removeEventListener(
      "devicemotion",
      motion
    );

    if (button) {
      button.textContent =
        "カメラ ON";
    }

    return;
  }

  stopCamera();

  inputMode = "motion";

  if (running) {
    window.addEventListener(
      "devicemotion",
      motion
    );
  }

  if (button) {
    button.textContent =
      "カメラ";
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

if (inputMode === "motion") {
  window.addEventListener(
    "devicemotion",
    motion
  );
}

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

/* カメラモードならカメラも停止 */
if (inputMode === "camera") {
  stopCamera();
  inputMode = "motion";

  const cameraButton =
    $("cameraMode");

  if (cameraButton) {
    cameraButton.textContent =
      "カメラ";
  }
}

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

const cameraButton =

  $("cameraMode");

if (cameraButton) {

  cameraButton.addEventListener(

    "click",

    toggleCameraMode

  );

}