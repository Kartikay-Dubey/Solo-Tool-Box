// site-extras.js
// Handles background music and glitch loader logic

// === BACKGROUND MUSIC ===
// Place your music file at: Self_Projects/Lego Tool/music/bg-music/Solo Leveling EP 6 OST FULL DARK ARIA LV2 by SawanoHiroyukinZkXAI Lyrics.mp3
const bgMusic = document.getElementById('bg-music');
let musicStarted = false;
let musicManuallyStarted = false;
let conquestBtn = null;

// Find the "Begin Your Conquest" button
window.addEventListener('DOMContentLoaded', () => {
    conquestBtn = document.querySelector('.hero-btn-wrap .btn-primary');
    if (conquestBtn) {
        // Add glowing ring and icon feedback
        conquestBtn.classList.add('conquest-music-btn');
        conquestBtn.addEventListener('mouseenter', () => {
            conquestBtn.classList.add('conquest-music-btn-glow');
        });
        conquestBtn.addEventListener('mouseleave', () => {
            conquestBtn.classList.remove('conquest-music-btn-glow');
        });
        conquestBtn.addEventListener('click', (e) => {
            if (!bgMusic) return;
            if (!musicStarted) {
                // First click: try to play
                bgMusic.volume = 0.7;
                bgMusic.play().then(() => {
                    musicStarted = true;
                    musicManuallyStarted = true;
                    conquestBtn.classList.add('conquest-music-btn-playing');
                }).catch(() => {
                    // If still blocked, do nothing
                });
            } else {
                // Toggle pause/play
                if (bgMusic.paused) {
                    bgMusic.play();
                    conquestBtn.classList.add('conquest-music-btn-playing');
                } else {
                    bgMusic.pause();
                    conquestBtn.classList.remove('conquest-music-btn-playing');
                }
            }
        });
        // Visual feedback for playing state
        bgMusic.addEventListener('play', () => {
            conquestBtn.classList.add('conquest-music-btn-playing');
        });
        bgMusic.addEventListener('pause', () => {
            conquestBtn.classList.remove('conquest-music-btn-playing');
        });
    }
    // Try to autoplay on load (may be blocked)
    if (bgMusic) {
        bgMusic.volume = 0.7;
        bgMusic.play().then(() => {
            musicStarted = true;
            if (conquestBtn) conquestBtn.classList.add('conquest-music-btn-playing');
        }).catch(() => {
            // Wait for user interaction
        });
    }
});

// === GLITCH LOADER ===
// Place your loader image at /images/loader-glitch.png
const glitchLoader = document.getElementById('glitch-loader');
let loaderShown = false;

function hideGlitchLoader() {
    if (!glitchLoader) return;
    glitchLoader.classList.add('hide');
    setTimeout(() => {
        glitchLoader.style.display = 'none';
    }, 800);
}

window.addEventListener('DOMContentLoaded', () => {
    // Only show loader on first load (not on reloads via navigation)
    if (window.sessionStorage.getItem('glitchLoaderShown')) {
        if (glitchLoader) glitchLoader.style.display = 'none';
        return;
    }
    loaderShown = true;
    // Hide main content while loader is active
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        hideGlitchLoader();
        document.body.style.overflow = '';
        window.sessionStorage.setItem('glitchLoaderShown', '1');
    }, 6000); // 6s duration for loader
});
