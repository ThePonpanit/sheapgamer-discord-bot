const { onSchedule } = require("firebase-functions/v2/scheduler");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();
const db = getFirestore();

const runBot = require("./discordBot");

exports.checkRssScheduled = onSchedule(
  {
    schedule: "every 15 minutes",
    timeZone: "Asia/Bangkok",
    region: "asia-southeast2",
  },
  async () => {
    try {
      await runBot(db);
    } catch (err) {
      console.error("Scheduled run failed:", err);
    }
  }
);
