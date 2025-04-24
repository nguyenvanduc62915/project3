function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    // const formattedTime = `${hours}:${minutes}:${seconds}`;
    
    document.getElementById('hours').textContent = `${hours}h`;
    document.getElementById('minutes').textContent = `${minutes}p`;
    document.getElementById('seconds').textContent = `${seconds}s`;
}

// Update the clock every second
setInterval(updateClock, 1000);

// Initial call to display the clock immediately
updateClock();