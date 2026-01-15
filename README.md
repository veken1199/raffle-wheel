# 🎡 Raffle Wheel - Premium Selection

A modern, interactive, and highly configurable raffle wheel web application. Built with a focus on premium aesthetics and advanced selection logic.

## ✨ Features

- **🎯 Weighted Random Selection**: Ensures fair but dynamic draws based on current item weights.
- **📉 Probability Reduction**: When a name is picked, the probability of its remaining instances being picked again is reduced by 50%.
- **🔢 Max Draws Per Name**: Configure how many times a single name can be drawn. Once reached, the name remains visible in the pool but becomes unselectable.
- **⚙️ Configurable Settings**: A clean UI with advanced options tucked away under a settings toggle.
- **🌈 Premium Design**: Glassmorphism effects, smooth gradients, and a high-fidelity "rolling" animation.
- **🔡 Case-Insensitive**: Automatically handles all names as lowercase for consistency.

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)

### Installation
1. Clone the repository or download the source code.
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally
Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173/`.

## 🛠️ Tech Stack
- **Core**: Vanilla JavaScript (ES6+)
- **Styling**: Vanilla CSS with modern CSS variables and animations.
- **Build Tool**: [Vite](https://vitejs.dev/)

## 🧠 Logic Overview
The raffle uses a weighted random algorithm. Each instance of a name starts with a weight of `1.0`. 
- **Selection**: `randomValue = Math.random() * totalWeight`.
- **Post-Draw**: 
  - The specific instance drawn is removed.
  - All other instances of that name have their weight multiplied by `0.5`.
  - If a name reaches the **Max Draws** limit, all its remaining instances have their weight set to `0`.

---
*Who is the lucky one?*
