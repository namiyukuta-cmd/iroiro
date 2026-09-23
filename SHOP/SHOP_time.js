(() => {
  'use strict';

  const PRAYERS = Object.freeze([
    Object.freeze({id:'fajr', label:'ファジュル', minute:300}),
    Object.freeze({id:'dhuhr', label:'ズフル', minute:720}),
    Object.freeze({id:'asr', label:'アスル', minute:930}),
    Object.freeze({id:'maghrib', label:'マグリブ', minute:1080}),
    Object.freeze({id:'isha', label:'イシャー', minute:1170})
  ]);

  const PRAYER_NOTICE_MINUTES = 30;

  function format(totalMinutes) {
    const value = Math.max(0, Number(totalMinutes) || 0) % 1440;
    const hour = Math.floor(value / 60);
    const minute = value % 60;
    return String(hour).padStart(2, '0') + ':' + String(minute).padStart(2, '0');
  }

  function getPrayerStatus(totalMinutes) {
    const now = Math.max(0, Number(totalMinutes) || 0) % 1440;
    const active = PRAYERS.find(prayer =>
      now >= prayer.minute && now < prayer.minute + PRAYER_NOTICE_MINUTES
    );
    if (active) return '🕌 ' + active.label;

    const next = PRAYERS.find(prayer => prayer.minute > now) || PRAYERS[0];
    return '→' + format(next.minute);
  }

  window.SHOP_TIME = Object.freeze({
    prayers: PRAYERS,
    prayerNoticeMinutes: PRAYER_NOTICE_MINUTES,
    format,
    getPrayerStatus
  });
})();