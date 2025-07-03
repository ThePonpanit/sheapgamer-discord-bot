# 🤖 Discord RSS Feed Bot

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green)](https://nodejs.org/)
[![Discord.js](https://img.shields.io/badge/Discord.js-v14-blue)](https://discord.js.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

An automated Discord bot that fetches the latest articles from RSS feeds and posts them to designated Discord channels as rich embeds. Originally designed for SheapGamer content but fully configurable for any RSS feed.

## ✨ Features

- 🔄 **Automated RSS Monitoring**: Periodically checks RSS feeds every 15 minutes
- 💾 **Smart Duplicate Prevention**: Tracks processed items to avoid duplicate posts across restarts
- ⏰ **Fresh Content Filter**: Only posts articles from the last 24 hours
- 📅 **Chronological Ordering**: Posts new content in proper chronological order
- 🎨 **Rich Discord Embeds**: Beautiful formatted messages with:
  - Clickable article titles
  - Featured images (when available)
  - Publication timestamps
- 🌐 **Dual Deployment Options**: Run locally or deploy to Firebase Cloud Functions
- ⚙️ **Easy Configuration**: Simple environment variable setup

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- A Discord account with server management permissions
- Basic knowledge of environment variables

## 📋 Setup Guide

### 🤖 Discord Bot Setup

1. **Create a Discord Application**

   - Visit the [Discord Developer Portal](https://discord.com/developers/applications)
   - Click **"New Application"** and name your bot (e.g., "RSS Feed Bot")

2. **Configure the Bot**

   - Navigate to the **"Bot"** tab in the sidebar
   - Click **"Add Bot"** → **"Yes, do it!"**
   - Copy the bot token (⚠️ **Keep this secret!**)

3. **Set Gateway Intents**

   - Under "Privileged Gateway Intents"
   - For basic RSS functionality, no special intents are required
   - Enable "Message Content Intent" only if adding command features later

4. **Generate Invite Link**

   - Go to **"OAuth2"** → **"URL Generator"**
   - **Scopes**: Select `bot`
   - **Bot Permissions**: Select:
     - ✅ Send Messages
     - ✅ Embed Links
     - ✅ Read Message History (optional)
   - Copy the generated URL and invite the bot to your server

5. **Get Channel ID**
   - Enable **Developer Mode**: User Settings → Advanced → Developer Mode
   - Right-click your target channel → **"Copy ID"**

### 💻 Local Development Setup

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd sheapgamer-discord-bot
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   - Copy `.env-example` to `.env`

   ```bash
   cp .env-example .env
   ```

   - Edit `.env` with your configuration:

   ```env
   DISCORD_BOT_TOKEN=your_bot_token_here
   DISCORD_CHANNEL_ID=your_channel_id_here
   RSS_FEED_URL=https://rss.app/feeds/COiTZRnT26oDqrJf.xml
   ```

4. **Run the Bot**
   ```bash
   npm start
   # or
   node index.js
   ```

### ☁️ Firebase Cloud Functions Deployment

For 24/7 operation without maintaining a local server:

1. **Install Firebase CLI**

   ```bash
   npm install -g firebase-tools
   ```

2. **Login and Initialize**

   ```bash
   firebase login
   firebase init functions
   ```

3. **Configure Environment Variables**

   ```bash
   firebase functions:config:set discord.bot_token="your_bot_token"
   firebase functions:config:set discord.channel_id="your_channel_id"
   firebase functions:config:set rss.feed_url="your_rss_url"
   ```

4. **Deploy**
   ```bash
   cd functions
   npm install
   firebase deploy --only functions
   ```

## 📁 Project Structure

```
sheapgamer-discord-bot/
├── index.js                    # Main bot application
├── package.json                # Project dependencies
├── .env-example               # Environment template
├── firebase.json              # Firebase configuration
├── last_processed_guid.json   # Tracking file (auto-generated)
└── functions/                 # Firebase Cloud Functions
    ├── index.js               # Cloud function entry point
    ├── discordBot.js          # Bot logic for cloud deployment
    └── package.json           # Cloud function dependencies
```

## ⚙️ Configuration Options

| Variable             | Description               | Default         | Required |
| -------------------- | ------------------------- | --------------- | -------- |
| `DISCORD_BOT_TOKEN`  | Your Discord bot token    | -               | ✅       |
| `DISCORD_CHANNEL_ID` | Target Discord channel ID | -               | ✅       |
| `RSS_FEED_URL`       | RSS feed URL to monitor   | SheapGamer feed | ❌       |

## 🔧 Advanced Configuration

### Custom RSS Feeds

Replace the `RSS_FEED_URL` in your `.env` file with any valid RSS feed URL:

```env
RSS_FEED_URL=https://example.com/feed.xml
```

### Monitoring Interval

The bot checks for new posts every 15 minutes. To modify this, edit the `RSS_CHECK_INTERVAL_MS` constant in `index.js`:

```javascript
const RSS_CHECK_INTERVAL_MS = 900000; // 15 minutes in milliseconds
```

## 🚨 Troubleshooting

### Common Issues

**Bot not responding:**

- Verify bot token is correct
- Ensure bot has proper permissions in the target channel
- Check console for error messages

**No posts appearing:**

- Confirm channel ID is correct
- Verify RSS feed URL is accessible
- Check if feed has new content within 24 hours

**Duplicate posts:**

- The `last_processed_guid.json` file tracks processed items
- Delete this file to reset tracking (will repost recent items)

### Getting Help

1. Check the console output for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure the RSS feed is valid and accessible
4. Test bot permissions by sending a manual message

## 📜 Dependencies

- **[discord.js](https://discord.js.org/)** v14+ - Discord API library
- **[rss-parser](https://www.npmjs.com/package/rss-parser)** - RSS feed parsing
- **[dotenv](https://www.npmjs.com/package/dotenv)** - Environment variable management
- **[firebase-functions](https://firebase.google.com/docs/functions)** - Cloud deployment (optional)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Originally designed for [SheapGamer](https://rss.app/feeds/COiTZRnT26oDqrJf.xml) RSS feed
- Built with Discord.js community resources
- Inspired by the need for automated content sharing

---

**⭐ Found this helpful? Give it a star!**
