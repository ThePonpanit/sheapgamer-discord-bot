const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  WebhookClient,
} = require("discord.js");
const Parser = require("rss-parser");
require("dotenv").config();

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;
const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL; // <— new!
const RSS_FEED_URL = process.env.RSS_FEED_URL;

const parser = new Parser();

module.exports = async function runBot(db) {
  // --- 1. Load last GUID from Firestore ---
  const lastRef = db.collection("rss").doc("lastGuid");
  const lastSnap = await lastRef.get();
  const lastGuid = lastSnap.exists ? lastSnap.data().guid : null;

  // --- 2. Choose send method (Webhook vs Bot login) ---
  let sendEmbed,
    cleanup = () => Promise.resolve();

  if (WEBHOOK_URL) {
    const webhook = new WebhookClient({ url: WEBHOOK_URL });
    sendEmbed = (embed) => webhook.send({ embeds: [embed] });
  } else {
    const client = new Client({ intents: [GatewayIntentBits.Guilds] });
    await client.login(DISCORD_BOT_TOKEN);
    const channel = await client.channels.fetch(CHANNEL_ID);
    sendEmbed = (embed) => channel.send({ embeds: [embed] });
    cleanup = () => client.destroy();
  }

  // --- 3. Fetch & filter RSS ---
  const feed = await parser.parseURL(RSS_FEED_URL);
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

  const newItems = [];
  for (const item of feed.items) {
    const guid = item.guid || item.id || item.link || `no-guid-${Date.now()}`;
    const published = item.isoDate ? Date.parse(item.isoDate) : 0;
    if (guid === lastGuid) break;
    if (published < oneDayAgo) continue;
    newItems.push(item);
  }

  // --- 4. Sort oldest→newest & build embeds ---
  newItems.sort((a, b) => Date.parse(a.isoDate) - Date.parse(b.isoDate));

  const embeds = newItems.map((entry) => {
    const e = new EmbedBuilder()
      .setTitle(entry.title || "No Title")
      .setURL(entry.link || "")
      .setColor(0x0099ff);

    // Extract image if any
    const html = entry.content || entry.summary || "";
    const imgMatch = html.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch) e.setImage(imgMatch[1]);

    if (entry.isoDate) e.setTimestamp(new Date(entry.isoDate));
    return e;
  });

  // --- 5. Send all at once (parallel) ---
  await Promise.all(embeds.map((embed) => sendEmbed(embed)));

  // --- 6. Update last GUID in Firestore ---
  if (newItems.length) {
    const last = newItems[newItems.length - 1];
    const lastId = last.guid || last.id || last.link;
    await lastRef.set({ guid: lastId });
  }

  // --- 7. Cleanup Discord client if used ---
  await cleanup();
};
