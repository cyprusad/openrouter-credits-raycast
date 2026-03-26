# OpenRouter Credits - Raycast Extension

Monitor your OpenRouter API credits directly in your menu bar.

## Features

- Shows current credit balance in menu bar
- Color-coded indicators (green/yellow/red based on remaining credits)
- Updates automatically every 15 minutes
- Caches data for offline viewing
- Quick refresh option
- One-click access to OpenRouter dashboard

## Setup

1. Install the extension
2. Open Raycast Preferences
3. Add your OpenRouter **Management API Key** (not regular API key)
4. The menu bar icon will appear automatically

## Getting Your API Key

1. Go to https://openrouter.ai/settings/management-keys
2. Click "Create New Key"
3. Copy the key and paste it into the extension preferences

## Usage

The extension displays your remaining credits in the menu bar. Click the icon to:
- See detailed balance info
- Refresh the data manually
- Open OpenRouter dashboard
- Access preferences

## Color Indicators

- **Green**: Healthy balance (> $5)
- **Yellow**: Low balance (≤ $5)
- **Red**: Depleted (≤ $0)

## Development

```bash
npm install
npm run dev
```

## License

MIT
