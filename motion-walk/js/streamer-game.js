const $ = id => document.getElementById(id);

let running = false;
let raw = 0;
let moves = 0;

let subs = 3;
let plays = 12;
let likes = 0;
let tips = 0;
const YEN_PER_ACTION = 10;
let sessionStartRaw = 0;
let elapsedMs = 0;
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

function addComment(text, name = anonName(), color = "") {
  const comments = $("comments");
  if (!comments) return;
  const row = document.createElement("div");
  row.className = "comment";
  if (color) row.style.setProperty("--commenter-color", color);
  const nameElement = document.createElement("span");
  nameElement.className = "commentName";
  nameElement.textContent = name;
  const messageElement = document.createElement("span");
  messageElement.textContent = text;
  row.append(nameElement, messageElement);
  comments.appendChild(row);
  while (comments.children.length > 100) comments.firstElementChild.remove();
  comments.scrollTop = comments.scrollHeight;
}

function regularComment(result) {
  const patron = result.patron;
  const icon = $("commenter-" + patron.id);
  if (icon) {
    icon.classList.remove("hit");
    void icon.offsetWidth;
    icon.classList.add("hit");
  }
  const bar = $("patronbar");
  if (bar) bar.textContent = patron.name + "さんがコメント";
  addComment(result.line, patron.name, patron.color);
}

function renderCommenters() {
  const rail = $("commenterRail");
  if (!rail || typeof StreamPatrons === "undefined") return;
  StreamPatrons.all.forEach(patron => {
    const icon = document.createElement("div");
    icon.id = "commenter-" + patron.id;
    icon.className = "tipicon commenterIcon";
    icon.style.backgroundColor = patron.color;
    icon.textContent = patron.name;
    icon.title = patron.name;
    rail.appendChild(icon);
  });
}
renderCommenters();

/* =========================
   1動作
========================= */

function action() {
  if (!running) return;
  raw++;
  if ($("exerciseCount")) $("exerciseCount").textContent = raw - sessionStartRaw;

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

  // 常連のコメントは収益に影響しない。
  if (Math.random() < 0.75 && typeof StreamPatrons !== "undefined") {
    regularComment(StreamPatrons.comment(StreamPatrons.pick()));
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
    video.classList.add("cameraOn");

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
    video.classList.remove("cameraOn");
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
      (elapsedMs + Date.now() - startAt) /
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
    inputMode === "motion" &&
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

    startAt = Date.now();
    sessionStartRaw = raw;
    if ($("exerciseCount")) $("exerciseCount").textContent = "0";
    if ($("sessionResult")) $("sessionResult").textContent = "収益は停止時に確定（1動作＝10円）";

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

  /* 配信停止：今回の動作だけを精算する。 */
  clock();
  elapsedMs += Date.now() - startAt;
  startAt = 0;
  running = false;
  const sessionActions = raw - sessionStartRaw;
  const earned = sessionActions * YEN_PER_ACTION;
  tips += earned;
  if ($("tips")) $("tips").textContent = tips.toLocaleString("ja-JP");
  if ($("sessionResult")) $("sessionResult").textContent =
    "今回 " + sessionActions + "動作 × 10円 ＝ " + earned.toLocaleString("ja-JP") + "円";
  show("今回の収益 ¥" + earned.toLocaleString("ja-JP"));

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
