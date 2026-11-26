/* Bloom Wellness diary: greeting, quote, journal note and self-care reminder for the home page.
   All text lives here, so it works offline. Picks are based on the calendar day, so the quote and
   reminder stay the same all day and change at midnight. Nothing here writes to saved user data. */
(function () {
  "use strict";
  var G = {
    morning: ["Good morning, lovely", "Rise and bloom", "A fresh page awaits", "Morning, sunshine"],
    afternoon: ["Good afternoon, lovely", "Hello, bright one", "Afternoon, dear heart", "Keep blooming, lovely"],
    evening: ["Good evening, lovely", "Evening, sweet soul", "Settle in, dear", "A soft evening to you"],
    night: ["Good night, lovely", "Soft night, dear heart", "Time to wind down", "Rest is part of the plan"]
  };
  var N = {
    morning: ["Dear diary, today I will move gently and eat something kind.", "A new page, a clean pen, and all the time I need.", "Today I will water the garden of my habits.", "Small steps first, then the rest of the day."],
    afternoon: ["Dear diary, halfway through and still blooming.", "I paused, took a breath, and began again.", "Even a short walk is a page worth writing.", "Drinking water, standing tall, doing my best."],
    evening: ["Dear diary, the day was enough, and so am I.", "Tonight I will be proud of the little things.", "I fed my body and listened to it today.", "Pressing today’s good moments between the pages."],
    night: ["Dear diary, I did what I could and that counts.", "Closing the book softly. Tomorrow is a new page.", "Rest now. The garden grows while I sleep.", "Lights low, shoulders down, heart quiet."]
  };
  var Q = [
    ["Small steps still count. Be proud of today.", ""],
    ["You are growing at your own pace, and that is allowed.", ""],
    ["Earth laughs in flowers.", "Ralph Waldo Emerson"],
    ["Rest is not laziness. It is how the garden grows.", ""],
    ["A journey of a thousand miles begins with a single step.", "Lao Tzu"],
    ["Be gentle with yourself. You are still learning.", ""],
    ["Nothing great was ever achieved without enthusiasm.", "Ralph Waldo Emerson"],
    ["Nourish the body, quiet the mind, bloom anyway.", ""],
    ["Progress is progress, even when it is slow.", ""],
    ["In every walk with nature one receives far more than he seeks.", "John Muir"],
    ["Today’s kindness to yourself is tomorrow’s strength.", ""],
    ["You do not have to be perfect to be wonderful.", ""],
    ["The best way out is always through.", "Robert Frost"],
    ["Drink water, take a breath, begin again.", ""],
    ["Every flower takes its time. So can you.", ""],
    ["Choose the next small good thing.", ""],
    ["Your body is listening. Speak to it kindly.", ""],
    ["A little movement is a little love.", ""],
    ["Plant one good habit today and watch it grow.", ""],
    ["You showed up, and that is the hardest part.", ""],
    ["Soft days are still strong days.", ""],
    ["Let today be simple, warm and enough.", ""],
    ["Healthy is a garden, not a finish line.", ""],
    ["Go slowly. You are going somewhere beautiful.", ""]
  ];
  var C = [
    ["Drink a glass of water", "Hydration is a quiet kindness."],
    ["Stretch your shoulders", "Roll them back three times."],
    ["Step outside for a minute", "Fresh air counts as self-care."],
    ["Eat something colourful", "Your plate can be a little garden."],
    ["Take three slow breaths", "In through the nose, out slowly."],
    ["Look out of a window", "Rest your eyes on something far away."],
    ["Write down one good thing", "Even a small one belongs in the diary."],
    ["Take a short walk", "A few minutes lifts the whole day."],
    ["Be kind to yourself", "Progress is allowed to be slow."],
    ["Get to bed on time tonight", "Rest is part of the routine."],
    ["Add a fruit to your day", "Sweet, simple and good for you."],
    ["Unclench your jaw", "Let your shoulders drop too."]
  ];
  var MON = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  function $(id) { return document.getElementById(id); }
  function set(id, t) { var e = $(id); if (e && e.textContent !== String(t)) e.textContent = t; }
  function pick(a, n) { return a[((n % a.length) + a.length) % a.length]; }
  function period(h) { return h >= 5 && h < 12 ? "morning" : h < 17 && h >= 12 ? "afternoon" : h >= 17 && h < 21 ? "evening" : "night"; }

  function paint() {
    try {
      var d = new Date(), day = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5), p = period(d.getHours());
      var q = pick(Q, day), c = pick(C, day);
      set("greeting", pick(G[p], day));
      set("diaryNote", pick(N[p], day + 1));
      set("quoteText", "\u201C" + q[0] + "\u201D");
      set("quoteBy", q[1] ? "\u2014 " + q[1] : "\u2014 a note to self");
      set("careTitle", c[0]);
      set("careText", c[1]);
      set("stampDay", d.getDate());
      set("stampMon", MON[d.getMonth()]);
    } catch (e) { /* the diary is decoration, so it must never break the app */ }
  }

  function num(id) { var e = $(id); return e ? parseInt((e.textContent || "").replace(/[^0-9]/g, ""), 10) || 0 : 0; }
  var lastGoal = {};
  function goal(id) {
    var e = $(id); if (!e) return 0;
    var g = Math.round(parseFloat(e.value)), lo = parseFloat(e.min), hi = parseFloat(e.max);
    // the app only accepts goals inside the field's min and max, so ignore anything else
    if (g > 0 && (isNaN(lo) || g >= lo) && (isNaN(hi) || g <= hi)) { lastGoal[id] = g; return g; }
    return lastGoal[id] || 0;
  }
  function meter(valId, goalId, barId, txtId, unit) {
    try {
      var v = num(valId), g = goal(goalId), bar = $(barId);
      if (!bar) return;
      bar.style.width = (g > 0 ? Math.min(100, Math.round(v / g * 100)) : 0) + "%";
      bar.className = g > 0 && v > g ? "over" : "";
      set(txtId, g > 0 ? unit + " of " + g.toLocaleString() + " goal" : unit + " logged");
    } catch (e) { }
  }
  function meters() {
    meter("dashCalories", "goal", "calMeter", "calGoalTxt", "kcal");
    meter("dashSteps", "stGoal", "stepMeter", "stepGoalTxt", "steps");
  }
  function later() { setTimeout(meters, 80); }

  function start() {
    paint(); meters();
    ["dashCalories", "dashSteps"].forEach(function (id) {
      var e = $(id);
      if (e && window.MutationObserver) new MutationObserver(later).observe(e, { childList: true, characterData: true, subtree: true });
    });
    ["click", "input", "change"].forEach(function (ev) { document.addEventListener(ev, later, true); });
    document.addEventListener("visibilitychange", paint);
    window.addEventListener("focus", paint);
    setInterval(paint, 300000);
    setTimeout(meters, 400);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
