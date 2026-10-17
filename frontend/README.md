# Cook It Yourself (CIY) — Frontend

> An AI-native agent interface turning Swiggy restaurant cravings into home-cooked meals, powered by Swiggy's MCP platform (Food + Instamart).

## Features

- **Food Search & Smart Nudge**: Simulates searching for a craving (e.g., "Butter Chicken") on Swiggy and shows the AI popup *"Why not make it at home?"*.
- **Recipe Intelligence**: Interactive ingredients checklist (uncheck what you already have at home), servings adjuster, step-by-step instructions.
- **Real-Time Savings Calculator**: Compares restaurant delivery prices against Instamart grocery costs.
- **One-Tap Instamart Cart**: Populates Instamart grocery items directly for 10-15 min delivery.
- **Swiggy MCP Integration**: Checks active OAuth session and allows live testing of Swiggy MCP tools (e.g. `get_addresses`).

## Getting Started

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:5173` in your browser.

