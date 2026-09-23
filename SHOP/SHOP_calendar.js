(() => {
  'use strict';

  const MONTHS = Object.freeze([
    Object.freeze({name:'ムハッラム', days:30}),
    Object.freeze({name:'サファル', days:29}),
    Object.freeze({name:'ラビー1', days:30}),
    Object.freeze({name:'ラビー2', days:29}),
    Object.freeze({name:'ジュマーダ1', days:30}),
    Object.freeze({name:'ジュマーダ2', days:29}),
    Object.freeze({name:'ラジャブ', days:30}),
    Object.freeze({name:'シャアバーン', days:29}),
    Object.freeze({name:'ラマダーン', days:30}),
    Object.freeze({name:'シャウワール', days:29}),
    Object.freeze({name:'ズルカアダ', days:30}),
    Object.freeze({name:'ズルヒッジャ', days:29})
  ]);

  function getDate(gameDay) {
    const day = Math.max(1, Number(gameDay) || 1);
    const yearDays = MONTHS.reduce((sum, month) => sum + month.days, 0);
    let cursor = (day - 1) % yearDays;

    for (const month of MONTHS) {
      if (cursor < month.days) {
        return {
          monthName: month.name,
          dayInMonth: cursor + 1,
          gameDay: day
        };
      }
      cursor -= month.days;
    }

    return {monthName: MONTHS[0].name, dayInMonth: 1, gameDay: day};
  }

  window.SHOP_CALENDAR = Object.freeze({
    months: MONTHS,
    getDate
  });
})();