// Global Audio Player Module
// This module handles the global Quran audio player functionality that persists across pages

// Initialize the audio player state
let audioPlayerState = {
  currentAudio: null,
  currentSurah: null,
  currentReader: null,
  currentRewaya: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  audioSrc: null,
  tabId: generateTabId() // Generate a unique ID for this tab
};

// Generate a unique ID for this tab instance
function generateTabId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Function to save player state to localStorage
const savePlayerState = () => {
  if (audioPlayerState.currentAudio) {
    const state = {
      currentSurah: audioPlayerState.currentSurah,
      currentReader: audioPlayerState.currentReader,
      currentRewaya: audioPlayerState.currentRewaya,
      isPlaying: audioPlayerState.isPlaying,
      currentTime: audioPlayerState.currentAudio.currentTime,
      duration: audioPlayerState.currentAudio.duration,
      audioSrc: audioPlayerState.audioSrc,
      tabId: audioPlayerState.tabId,
      lastUpdated: Date.now()
    };
    localStorage.setItem('quranPlayerState', JSON.stringify(state));
    
    // Also store which tab is currently playing
    if (audioPlayerState.isPlaying) {
      localStorage.setItem('quranPlayerActiveTab', audioPlayerState.tabId);
    }
  }
};

// Function to load player state from localStorage
const loadPlayerState = () => {
  const savedState = localStorage.getItem('quranPlayerState');
  if (savedState) {
    const state = JSON.parse(savedState);
    
    // If this is a different tab from the one that saved the state,
    // and that tab is still active (playing), we should not set isPlaying to true
    const activeTab = localStorage.getItem('quranPlayerActiveTab');
    if (activeTab && activeTab !== audioPlayerState.tabId) {
      state.isPlaying = false;
    }
    
    audioPlayerState = {
      ...audioPlayerState,
      ...state,
      currentAudio: audioPlayerState.currentAudio,
      tabId: audioPlayerState.tabId // Maintain this tab's ID
    };
    return state;
  }
  return null;
};

// Listen for storage events to sync player state across tabs
window.addEventListener('storage', (event) => {
  if (event.key === 'quranPlayerState') {
    const newState = JSON.parse(event.newValue);
    
    // Check if this is our tab or another tab
    if (newState.tabId !== audioPlayerState.tabId) {
      // Another tab updated the state
      const activeTab = localStorage.getItem('quranPlayerActiveTab');
      const isActiveTab = activeTab === audioPlayerState.tabId;
      
      if (isActiveTab && !newState.isPlaying) {
        // If our tab is the active one and the new state says not playing,
        // sync our state but keep playing
        syncPlayerState(newState, true);
      } else if (!isActiveTab && newState.isPlaying) {
        // Another tab is now playing, pause this one
        syncPlayerState(newState, false);
      } else {
        // In other cases, just sync to the same state
        syncPlayerState(newState);
      }
    }
  }
  
  if (event.key === 'quranPlayerActiveTab') {
    const activeTab = event.newValue;
    
    // If this tab is not the active one, pause playback
    if (activeTab && activeTab !== audioPlayerState.tabId) {
      if (audioPlayerState.isPlaying) {
        pauseAudio(false); // Don't update localStorage when pausing due to tab change
      }
    }
  }
});

// Sync player state from localStorage without affecting localStorage
const syncPlayerState = (newState, keepPlaying = false) => {
  if (!audioPlayerState.currentAudio) return;
  
  // Update the source if different
  if (newState.audioSrc && newState.audioSrc !== audioPlayerState.audioSrc) {
    audioPlayerState.audioSrc = newState.audioSrc;
    audioPlayerState.currentAudio.src = newState.audioSrc;
    audioPlayerState.currentAudio.load();
  }
  
  // Update the time position
  if (newState.currentTime) {
    audioPlayerState.currentAudio.currentTime = newState.currentTime;
  }
  
  // Update metadata
  audioPlayerState.currentSurah = newState.currentSurah;
  audioPlayerState.currentReader = newState.currentReader;
  audioPlayerState.currentRewaya = newState.currentRewaya;
  audioPlayerState.duration = newState.duration;
  
  // Show player and update UI
  const playerContainer = document.getElementById('globalQuranPlayer');
  if (playerContainer) {
    playerContainer.style.display = 'block';
  }
  
  // Set play state
  if (keepPlaying) {
    playAudio(false); // Continue playing but don't update localStorage
  } else if (newState.isPlaying) {
    playAudio(false); // Play but don't update localStorage
  } else {
    pauseAudio(false); // Pause but don't update localStorage
  }
  
  // Update UI
  updatePlayerUI(audioPlayerState);
};

// Create the global player UI
const createGlobalPlayer = () => {
  // Check if player already exists
  if (document.getElementById('globalQuranPlayer')) {
    return;
  }

  // Create player container
  const playerContainer = document.createElement('div');
  playerContainer.id = 'globalQuranPlayer';
  playerContainer.className = 'global-quran-player';
  
  // Create audio element
  const audio = document.createElement('audio');
  audio.id = 'globalQuranAudio';
  playerContainer.appendChild(audio);
  
  // Create player UI
  playerContainer.innerHTML += `
    <div class="player-info">
      <div class="surah-info">
        <span id="globalPlayerSurahName"></span>
        <span id="globalPlayerReader"></span>
      </div>
      <div class="player-controls">
        <button id="globalPlayerPrev" aria-label="السورة السابقة" title="السورة السابقة">
          <i class="fa-solid fa-backward-step"></i>
        </button>
        <button id="globalPlayerPlayPause" aria-label="تشغيل/إيقاف" title="تشغيل/إيقاف">
          <i class="fa-solid fa-play"></i>
        </button>
        <button id="globalPlayerNext" aria-label="السورة التالية" title="السورة التالية">
          <i class="fa-solid fa-forward-step"></i>
        </button>
        <button id="globalPlayerClose" aria-label="إغلاق" title="إغلاق المشغل">
          <i class="fa-solid fa-times"></i>
        </button>
      </div>
    </div>
    <div class="player-progress">
      <span id="globalPlayerCurrentTime">00:00</span>
      <input type="range" id="globalPlayerProgressBar" min="0" max="100" value="0">
      <span id="globalPlayerDuration">00:00</span>
    </div>
  `;
  
  document.body.appendChild(playerContainer);
  
  // Set up the audio element
  audioPlayerState.currentAudio = audio;
  
  // Load saved state if exists
  const savedState = loadPlayerState();
  if (savedState && savedState.audioSrc) {
    audio.src = savedState.audioSrc;
    if (savedState.currentTime) {
      audio.currentTime = savedState.currentTime;
    }
    updatePlayerUI(savedState);
    
    // Check if we should auto-play
    const activeTab = localStorage.getItem('quranPlayerActiveTab');
    if (savedState.isPlaying && (!activeTab || activeTab === audioPlayerState.tabId)) {
      // This tab was the one that was playing, so resume playback
      localStorage.setItem('quranPlayerActiveTab', audioPlayerState.tabId);
      playAudio();
    } else if (!activeTab && savedState.isPlaying) {
      // No tab is playing, but saved state says it should play
      localStorage.setItem('quranPlayerActiveTab', audioPlayerState.tabId);
      playAudio();
    } else {
      playerContainer.style.display = savedState.audioSrc ? 'block' : 'none';
    }
  } else {
    playerContainer.style.display = 'none';
  }
  
  // Set up event listeners
  setupEventListeners();
  
  // Handle page visibility changes
  handleVisibilityChange();
  
  // Save state on page navigation within site
  handlePageNavigation();
};

// Handle page visibility changes
const handleVisibilityChange = () => {
  document.addEventListener('visibilitychange', () => {
    const activeTab = localStorage.getItem('quranPlayerActiveTab');
    
    if (document.hidden) {
      // If page is hidden and this tab was playing, update the time
      if (activeTab === audioPlayerState.tabId && audioPlayerState.isPlaying) {
        savePlayerState();
      }
    } else {
      // Page is visible again
      const savedState = localStorage.getItem('quranPlayerState');
      if (savedState) {
        const state = JSON.parse(savedState);
        
        // If this tab was the active one before, reclaim it
        if (activeTab === audioPlayerState.tabId) {
          if (audioPlayerState.currentAudio && state.currentTime) {
            audioPlayerState.currentAudio.currentTime = state.currentTime;
          }
          if (!audioPlayerState.isPlaying && state.isPlaying) {
            playAudio();
          }
        }
      }
    }
  });
};

// Handle page navigation within the site
const handlePageNavigation = () => {
  // Save state before navigating away
  document.addEventListener('click', (event) => {
    // Check if the click was on a link to a page within the site
    const link = event.target.closest('a');
    if (link && link.href && link.href.includes(window.location.hostname)) {
      // Save the current state before navigating
      if (audioPlayerState.isPlaying) {
        // We need to ensure the state is saved before navigation
        savePlayerState();
      }
    }
  });
  
  // Attempt to resume playback after page loads if it was playing
  window.addEventListener('load', () => {
    setTimeout(() => {
      const activeTab = localStorage.getItem('quranPlayerActiveTab');
      const savedState = localStorage.getItem('quranPlayerState');
      
      if (savedState) {
        const state = JSON.parse(savedState);
        if (state.isPlaying && (!activeTab || activeTab === audioPlayerState.tabId)) {
          // Force this tab to claim playback if it was playing before
          localStorage.setItem('quranPlayerActiveTab', audioPlayerState.tabId);
          
          // Give a small delay to ensure audio element is ready
          setTimeout(() => {
            if (audioPlayerState.currentAudio && audioPlayerState.audioSrc) {
              playAudio();
            }
          }, 500);
        }
      }
    }, 100);
  });
};

// Format time in MM:SS or HH:MM:SS format
const formatTime = (timeInSeconds) => {
  if (isNaN(timeInSeconds)) return '00:00';
  
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Update player UI with current state
const updatePlayerUI = (state) => {
  const player = document.getElementById('globalQuranPlayer');
  const surahNameEl = document.getElementById('globalPlayerSurahName');
  const readerEl = document.getElementById('globalPlayerReader');
  const progressBar = document.getElementById('globalPlayerProgressBar');
  const currentTimeEl = document.getElementById('globalPlayerCurrentTime');
  const durationEl = document.getElementById('globalPlayerDuration');
  const playPauseBtn = document.getElementById('globalPlayerPlayPause');
  
  if (!player) return;
  
  // Show player if it was hidden
  player.style.display = 'block';
  
  // Update surah and reader info
  if (surahNameEl && state.currentSurah) {
    surahNameEl.textContent = `سورة ${state.currentSurah}`;
  }
  
  if (readerEl && state.currentReader) {
    readerEl.textContent = `${state.currentReader}${state.currentRewaya ? ` - ${state.currentRewaya}` : ''}`;
  }
  
  // Update play/pause button icon
  if (playPauseBtn) {
    playPauseBtn.innerHTML = state.isPlaying ? 
      '<i class="fa-solid fa-pause"></i>' : 
      '<i class="fa-solid fa-play"></i>';
  }
  
  // Update time display and progress bar
  if (progressBar && !isNaN(state.duration) && state.duration > 0) {
    const progress = (state.currentTime / state.duration) * 100;
    progressBar.value = progress;
    
    if (currentTimeEl) {
      currentTimeEl.textContent = formatTime(state.currentTime);
    }
    
    if (durationEl) {
      durationEl.textContent = formatTime(state.duration);
    }
  }
};

// Play the audio
const playAudio = (updateStorage = true) => {
  if (audioPlayerState.currentAudio && audioPlayerState.audioSrc) {
    // Make sure the audio element has the correct source
    if (audioPlayerState.currentAudio.src !== audioPlayerState.audioSrc) {
      audioPlayerState.currentAudio.src = audioPlayerState.audioSrc;
      audioPlayerState.currentAudio.load();
    }
    
    const playPromise = audioPlayerState.currentAudio.play();
    
    if (playPromise !== undefined) {
      playPromise.then(() => {
        audioPlayerState.isPlaying = true;
        
        // Set this tab as the active playing tab
        if (updateStorage) {
          localStorage.setItem('quranPlayerActiveTab', audioPlayerState.tabId);
        }
        
        updatePlayerUI(audioPlayerState);
        
        if (updateStorage) {
          savePlayerState();
        }
      }).catch(error => {
        // AutoPlay was prevented by browser (common issue)
        console.error('Error playing audio:', error);
        
        // User interaction is required - show the player but don't play
        const playerContainer = document.getElementById('globalQuranPlayer');
        if (playerContainer) {
          playerContainer.style.display = 'block';
        }
        
        // Update state to not playing
        audioPlayerState.isPlaying = false;
        updatePlayerUI(audioPlayerState);
        
        if (updateStorage) {
          savePlayerState();
        }
      });
    }
  }
};

// Pause the audio
const pauseAudio = (updateStorage = true) => {
  if (audioPlayerState.currentAudio) {
    audioPlayerState.currentAudio.pause();
    audioPlayerState.isPlaying = false;
    updatePlayerUI(audioPlayerState);
    
    if (updateStorage) {
      // If this was the active tab, clear the active tab marker
      const activeTab = localStorage.getItem('quranPlayerActiveTab');
      if (activeTab === audioPlayerState.tabId) {
        localStorage.removeItem('quranPlayerActiveTab');
      }
      
      savePlayerState();
    }
  }
};

// Set up event listeners for the player controls
const setupEventListeners = () => {
  const audio = audioPlayerState.currentAudio;
  const playPauseBtn = document.getElementById('globalPlayerPlayPause');
  const progressBar = document.getElementById('globalPlayerProgressBar');
  const prevBtn = document.getElementById('globalPlayerPrev');
  const nextBtn = document.getElementById('globalPlayerNext');
  const closeBtn = document.getElementById('globalPlayerClose');
  
  if (!audio) return;
  
  // Play/Pause button
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      if (audioPlayerState.isPlaying) {
        pauseAudio();
      } else {
        playAudio();
      }
    });
  }
  
  // Progress bar interaction
  if (progressBar) {
    progressBar.addEventListener('input', () => {
      if (audio.duration) {
        const seekTime = (progressBar.value / 100) * audio.duration;
        audio.currentTime = seekTime;
        audioPlayerState.currentTime = seekTime;
        updatePlayerUI(audioPlayerState);
        savePlayerState();
      }
    });
  }
  
  // Previous/Next buttons (will be implemented when navigating to surah pages)
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      // Navigation functionality will be handled in the page-specific code
      const prevLink = document.getElementById('previousSurah');
      if (prevLink) {
        // Save state before navigating
        savePlayerState();
        window.location.href = prevLink.href;
      }
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      // Navigation functionality will be handled in the page-specific code
      const nextLink = document.getElementById('nextSurah');
      if (nextLink) {
        // Save state before navigating
        savePlayerState();
        window.location.href = nextLink.href;
      }
    });
  }
  
  // Close button
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      pauseAudio();
      document.getElementById('globalQuranPlayer').style.display = 'none';
      
      // Clear all player state when closing
      localStorage.removeItem('quranPlayerState');
      localStorage.removeItem('quranPlayerActiveTab');
    });
  }
  
  // Audio events
  audio.addEventListener('timeupdate', () => {
    audioPlayerState.currentTime = audio.currentTime;
    updatePlayerUI(audioPlayerState);
    
    // Periodically update localStorage (every 5 seconds) to sync across tabs
    if (audioPlayerState.isPlaying && audio.currentTime % 5 < 0.5) {
      savePlayerState();
    }
  });
  
  audio.addEventListener('loadedmetadata', () => {
    audioPlayerState.duration = audio.duration;
    updatePlayerUI(audioPlayerState);
    savePlayerState();
  });
  
  audio.addEventListener('ended', () => {
    audioPlayerState.isPlaying = false;
    audioPlayerState.currentTime = 0;
    updatePlayerUI(audioPlayerState);
    savePlayerState();
    
    // Clear active tab
    const activeTab = localStorage.getItem('quranPlayerActiveTab');
    if (activeTab === audioPlayerState.tabId) {
      localStorage.removeItem('quranPlayerActiveTab');
    }
    
    // Optionally auto-play next surah
    const nextLink = document.getElementById('nextSurah');
    if (nextLink) {
      window.location.href = nextLink.href;
    }
  });
  
  // Ensure audio plays when resuming from pause
  audio.addEventListener('pause', () => {
    // If this was not triggered by our code and we think we should be playing
    if (audioPlayerState.isPlaying) {
      // Try to resume playback
      setTimeout(() => {
        if (audioPlayerState.isPlaying) {
          audio.play().catch(error => {
            console.error('Error resuming audio after pause event:', error);
            audioPlayerState.isPlaying = false;
            updatePlayerUI(audioPlayerState);
            savePlayerState();
          });
        }
      }, 100);
    }
  });
  
  // Save state before page unload
  window.addEventListener('beforeunload', () => {
    // Save current state before unloading
    if (audioPlayerState.isPlaying) {
      savePlayerState();
    }
  });
};

// Play a specific surah with a specific reader
const playSurah = (surahName, readerName, rewayaName, audioSrc) => {
  // Create player if it doesn't exist
  if (!document.getElementById('globalQuranPlayer')) {
    createGlobalPlayer();
  }
  
  const audio = audioPlayerState.currentAudio;
  if (!audio) return;
  
  // Update player state
  audioPlayerState.currentSurah = surahName;
  audioPlayerState.currentReader = readerName;
  audioPlayerState.currentRewaya = rewayaName;
  audioPlayerState.audioSrc = audioSrc;
  
  // Set audio source and play
  if (audio.src !== audioSrc) {
    audio.src = audioSrc;
    audio.load();
  }
  
  // Set this tab as the active one
  localStorage.setItem('quranPlayerActiveTab', audioPlayerState.tabId);
  
  playAudio();
};

// Initialize the player when the DOM is loaded
document.addEventListener('DOMContentLoaded', createGlobalPlayer);

export { playSurah, pauseAudio, playAudio, loadPlayerState }; 