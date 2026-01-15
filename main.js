import { RaffleManager } from './logic.js';

const raffle = new RaffleManager();

const namesInput = document.getElementById('namesInput');
const startBtn = document.getElementById('startBtn');
const spinBtn = document.getElementById('spinBtn');
const poolList = document.getElementById('poolList');
const rollingTrack = document.getElementById('rollingTrack');
const winnerOverlay = document.getElementById('winnerOverlay');
const maxDrawsSelect = document.getElementById('maxDrawsSelect');
const settingsToggleBtn = document.getElementById('settingsToggleBtn');
const settingsPanel = document.getElementById('settingsPanel');

settingsToggleBtn.addEventListener('click', () => {
    const isHidden = settingsPanel.style.display === 'none';
    settingsPanel.style.display = isHidden ? 'block' : 'none';
    settingsToggleBtn.style.background = isHidden ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)';
});

let isSpinning = false;

function updatePoolUI() {
    const items = raffle.getItems();
    poolList.innerHTML = '';

    // Group by name for cleaner display
    const grouped = items.reduce((acc, item) => {
        if (!acc[item.name]) acc[item.name] = { count: 0, weight: 0 };
        acc[item.name].count++;
        acc[item.name].weight = item.weight; // All instances of same name have same weight in this logic
        return acc;
    }, {});

    Object.entries(grouped).forEach(([name, data]) => {
        const draws = raffle.drawCounts[name] || 0;
        const isMaxed = draws >= raffle.maxDraws;
        const tag = document.createElement('div');
        tag.className = 'tag' + (isMaxed ? ' maxed' : '');
        tag.innerHTML = `
      <span>${name}</span>
      <span class="tag-count">x${data.count}</span>
      <span class="weight">${isMaxed ? 'MAXED' : (data.weight * 100).toFixed(0) + '% prob.'}</span>
      <span style="font-size: 0.7rem; opacity: 0.6;">(Drawn: ${draws}/${raffle.maxDraws})</span>
    `;
        poolList.appendChild(tag);
    });

    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    spinBtn.disabled = items.length === 0 || totalWeight === 0;
}

startBtn.addEventListener('click', () => {
    raffle.setMaxDraws(maxDrawsSelect.value);
    const text = namesInput.value.trim();
    if (!text) return;

    const names = text.split('\n').map(n => n.trim().toLowerCase()).filter(n => n !== '');
    raffle.setNames(names);
    updatePoolUI();

    rollingTrack.innerHTML = '<div class="name-item">READY?</div>';
    rollingTrack.style.transform = 'translateY(0)';
});

async function spin() {
    if (isSpinning || raffle.getItems().length === 0) return;
    isSpinning = true;
    spinBtn.disabled = true;

    const winner = raffle.pickWinner();
    const items = raffle.getItems();

    // Create a long list of names for the rolling effect
    // We'll mix the current pool items randomly
    const rollCount = 40;
    const rollItems = [];
    for (let i = 0; i < rollCount; i++) {
        rollItems.push(items[Math.floor(Math.random() * items.length)].name);
    }
    // Ensure the last one is the winner
    rollItems[rollItems.length - 1] = winner.name;

    // Render the track
    rollingTrack.innerHTML = rollItems.map(name => `<div class="name-item">${name}</div>`).join('');

    // Reset position
    rollingTrack.style.transition = 'none';
    rollingTrack.style.transform = 'translateY(0)';

    // Force reflow
    rollingTrack.offsetHeight;

    // Animate
    const itemHeight = 120;
    const targetOffset = -(rollItems.length - 1) * itemHeight;

    rollingTrack.style.transition = 'transform 4s cubic-bezier(0.15, 0, 0.15, 1)';
    rollingTrack.style.transform = `translateY(${targetOffset}px)`;

    await new Promise(resolve => setTimeout(resolve, 4500));

    // Show winner
    winnerName.textContent = winner.name;
    winnerOverlay.style.display = 'flex';

    // Update logic and UI
    raffle.handleSelection(winner.id);
    updatePoolUI();

    isSpinning = false;
}

spinBtn.addEventListener('click', spin);

closeWinnerBtn.addEventListener('click', () => {
    winnerOverlay.style.display = 'none';
});

// Initial UI state
updatePoolUI();
