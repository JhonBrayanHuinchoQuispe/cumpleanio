// ========================================
// CONFIGURACIÓN GLOBAL Y VARIABLES
// ========================================

let currentPhotoIndex = 0;
let gameActive = false;
let gameTimer = 60;
let gameInterval;
let gadgetsFound = 0;
let treasuresFound = 0;
let audioEnabled = true;
let musicEnabled = true;
let revealedTreasures = 0;
let konamiCode = [];
let konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

// Elementos del DOM
const loadingScreen = document.getElementById('loading-screen');
const confettiContainer = document.getElementById('confetti-container');
const particlesContainer = document.getElementById('particles-container');
const backgroundMusic = document.getElementById('background-music');
const musicToggle = document.getElementById('music-toggle');
const sfxToggle = document.getElementById('sfx-toggle');

// ========================================
// INICIALIZACIÓN
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    showLoadingScreen();
    setupEventListeners();
    createParticles();
    setupScrollAnimations();
    setupNavigation();
    initializeCarousel();
    setupAudioControls();
    createGameBoard();
    setupEasterEggs();
    setupKonamiCode();
    
    // Simular carga y mostrar página
    setTimeout(() => {
        hideLoadingScreen();
        startBirthdayExperience();
    }, 3000);
}

// ========================================
// PANTALLA DE CARGA
// ========================================

function showLoadingScreen() {
    loadingScreen.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function hideLoadingScreen() {
    loadingScreen.classList.add('hidden');
    document.body.style.overflow = 'auto';
    triggerConfetti();
    // Reproducir música automáticamente
    if (musicEnabled) {
        playBackgroundMusic();
    }
}

// ========================================
// EXPERIENCIA DE CUMPLEAÑOS
// ========================================

function startBirthdayExperience() {
    // Iniciar animaciones de entrada
    animateHeroElements();
    startContinuousParticles();
}

function animateHeroElements() {
    const heroTitle = document.querySelector('.main-title');
    const heroSubtitle = document.querySelector('.typewriter');
    const heroButtons = document.querySelector('.hero-buttons');
    
    // Animar título con delay
    if (heroTitle) {
        heroTitle.style.animation = 'titleSlideIn 1s ease-out forwards';
    }
    
    // Animar botones
    setTimeout(() => {
        if (heroButtons) {
            heroButtons.style.opacity = '0';
            heroButtons.style.transform = 'translateY(30px)';
            heroButtons.style.animation = 'slideUp 0.8s ease-out forwards';
        }
    }, 2000);
}

// ========================================
// SISTEMA DE AUDIO
// ========================================

function setupAudioControls() {
    if (musicToggle) {
        musicToggle.addEventListener('click', toggleMusic);
    }
    
    if (sfxToggle) {
        sfxToggle.addEventListener('click', toggleSoundEffects);
    }
}

function toggleMusic() {
    musicEnabled = !musicEnabled;
    musicToggle.classList.toggle('active', musicEnabled);
    
    if (musicEnabled) {
        playBackgroundMusic();
    } else {
        pauseBackgroundMusic();
    }
    
    playSound('click');
}

function toggleSoundEffects() {
    audioEnabled = !audioEnabled;
    sfxToggle.classList.toggle('active', audioEnabled);
    playSound('click');
}

function playBackgroundMusic() {
    if (backgroundMusic && musicEnabled) {
        backgroundMusic.volume = 0.3;
        backgroundMusic.play().catch(e => console.log('Error playing music:', e));
    }
}

function pauseBackgroundMusic() {
    if (backgroundMusic) {
        backgroundMusic.pause();
    }
}

// Función eliminada - la música se reproduce automáticamente

function playSound(type) {
    if (!audioEnabled) return;
    
    // Crear sonidos usando Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    let frequency;
    let duration;
    
    switch(type) {
        case 'click':
            frequency = 800;
            duration = 0.1;
            break;
        case 'success':
            frequency = 600;
            duration = 0.3;
            break;
        case 'celebration':
            frequency = 800;
            duration = 0.5;
            break;
        case 'found':
            frequency = 1000;
            duration = 0.2;
            break;
        default:
            frequency = 400;
            duration = 0.1;
    }
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
}

function playMelody() {
    const notes = [264, 264, 297, 264, 352, 330, 264, 264, 297, 264, 396, 352];
    const durations = [0.5, 0.5, 0.5, 0.5, 0.5, 1, 0.5, 0.5, 0.5, 0.5, 0.5, 1];
    
    notes.forEach((note, index) => {
        setTimeout(() => {
            playTone(note, durations[index]);
        }, index * 600);
    });
}

function playTone(frequency, duration) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
}

// ========================================
// NAVEGACIÓN
// ========================================

function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            playSound('click');
        });
    }
    
    // Smooth scrolling para los enlaces de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Cerrar menú móvil si está abierto
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                
                playSound('click');
            }
        });
    });
    
    // Actualizar navegación activa en scroll
    window.addEventListener('scroll', updateActiveNavigation);
}

function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ========================================
// EFECTOS DE PARTÍCULAS Y CONFETI
// ========================================

function createParticles() {
    if (!particlesContainer) return;
    
    for (let i = 0; i < 20; i++) {
        createParticle();
    }
}

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Posición aleatoria
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
    particle.style.animationDelay = Math.random() * 2 + 's';
    
    particlesContainer.appendChild(particle);
    
    // Remover partícula después de la animación
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 5000);
}

function startContinuousParticles() {
    setInterval(createParticle, 2000);
}

function triggerConfetti() {
    if (!confettiContainer) return;
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createConfettiPiece();
        }, i * 100);
    }
}

function createConfettiPiece() {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    
    // Colores aleatorios
    const colors = ['#4A90E2', '#FF6B35', '#FFD93D', '#FF69B4', '#6BCF7F'];
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Posición y animación aleatoria
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
    confetti.style.animationDelay = Math.random() * 0.5 + 's';
    
    confettiContainer.appendChild(confetti);
    
    // Remover confeti después de la animación
    setTimeout(() => {
        if (confetti.parentNode) {
            confetti.parentNode.removeChild(confetti);
        }
    }, 4000);
}

function triggerSpecialAnimation() {
    // Crear fuegos artificiales
    createFireworks();
    
    // Confeti especial
    for (let i = 0; i < 200; i++) {
        setTimeout(() => {
            createConfettiPiece();
        }, i * 25);
    }
    
    // Animación especial de personajes
    animateCharacters();
}

function createFireworks() {
    const fireworksContainer = document.createElement('div');
    fireworksContainer.className = 'celebration-fireworks';
    document.body.appendChild(fireworksContainer);
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            createFirework(fireworksContainer);
        }, i * 300);
    }
    
    // Remover contenedor después de las animaciones
    setTimeout(() => {
        document.body.removeChild(fireworksContainer);
    }, 2000);
}

function createFirework(container) {
    const centerX = Math.random() * window.innerWidth;
    const centerY = Math.random() * window.innerHeight * 0.5 + 100;
    
    const colors = ['#4A90E2', '#FF6B35', '#FFD93D', '#FF69B4', '#6BCF7F'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    for (let i = 0; i < 20; i++) {
        const firework = document.createElement('div');
        firework.className = 'firework';
        firework.style.backgroundColor = color;
        firework.style.left = centerX + 'px';
        firework.style.top = centerY + 'px';
        
        const angle = (i / 20) * 2 * Math.PI;
        const velocity = Math.random() * 100 + 50;
        const x = Math.cos(angle) * velocity;
        const y = Math.sin(angle) * velocity;
        
        firework.style.setProperty('--x', x + 'px');
        firework.style.setProperty('--y', y + 'px');
        
        container.appendChild(firework);
        
        setTimeout(() => {
            if (firework.parentNode) {
                firework.parentNode.removeChild(firework);
            }
        }, 1000);
    }
}

function animateCharacters() {
    const characters = document.querySelectorAll('.character');
    characters.forEach((character, index) => {
        setTimeout(() => {
            character.style.animation = 'characterBounce 0.5s ease-in-out 3';
        }, index * 200);
    });
}

// ========================================
// CARRUSEL DE FOTOS
// ========================================

function initializeCarousel() {
    updateCarousel();
    setupCarouselControls();
    
    // Auto-play del carrusel
    setInterval(() => {
        nextPhoto();
    }, 5000);
}

function setupCarouselControls() {
    const indicators = document.querySelectorAll('.indicator');
    
            indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentPhotoIndex = index;
                updateCarousel();
            });
        });
}

function nextPhoto() {
    const photos = document.querySelectorAll('.photo-card');
    currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
    updateCarousel();
}

function previousPhoto() {
    const photos = document.querySelectorAll('.photo-card');
    currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
    updateCarousel();
}

function updateCarousel() {
    const track = document.querySelector('.carousel-track');
    const indicators = document.querySelectorAll('.indicator');
    const photos = document.querySelectorAll('.photo-card');
    
    if (track) {
        track.style.transform = `translateX(-${currentPhotoIndex * 100}%)`;
    }
    
    // Actualizar indicadores
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentPhotoIndex);
    });
    
    // Actualizar clases activas de fotos
    photos.forEach((photo, index) => {
        photo.classList.toggle('active', index === currentPhotoIndex);
    });
}

// ========================================
// SISTEMA DE MENSAJES
// ========================================

function openMessage(messageId) {
    const messageCard = document.querySelector(`.message-card:nth-child(${messageId})`);
    
    if (messageCard) {
        messageCard.classList.add('flipped');
        playSound('success');
        
        // Efecto de partículas al abrir mensaje
        createMessageParticles(messageCard);
    }
}

function createMessageParticles(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.width = '6px';
            particle.style.height = '6px';
            particle.style.backgroundColor = '#FFD93D';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1000';
            
            const angle = (i / 10) * 2 * Math.PI;
            const velocity = Math.random() * 50 + 25;
            const x = Math.cos(angle) * velocity;
            const y = Math.sin(angle) * velocity;
            
            particle.style.animation = `particleExplosion 1s ease-out forwards`;
            particle.style.setProperty('--x', x + 'px');
            particle.style.setProperty('--y', y + 'px');
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                document.body.removeChild(particle);
            }, 1000);
        }, i * 50);
    }
}

// ========================================
// JUEGO INTERACTIVO
// ========================================

function createGameBoard() {
    const gameBoard = document.getElementById('game-board');
    if (!gameBoard) return;
    
    gameBoard.innerHTML = '';
    
    // Crear elementos de juego aleatorios
    createGameItems();
}

function createGameItems() {
    const gameBoard = document.getElementById('game-board');
    const boardRect = gameBoard.getBoundingClientRect();
    
    // Crear 5 gadgets de Doraemon
    for (let i = 0; i < 5; i++) {
        createGameItem('gadget', gameBoard);
    }
    
    // Crear 5 tesoros de One Piece
    for (let i = 0; i < 5; i++) {
        createGameItem('treasure', gameBoard);
    }
}

function createGameItem(type, container) {
    const item = document.createElement('div');
    item.className = `game-item ${type}`;
    
    // Posición aleatoria
    const x = Math.random() * 80 + 10; // 10% margen
    const y = Math.random() * 80 + 10;
    
    item.style.left = x + '%';
    item.style.top = y + '%';
    
    // Contenido del elemento
    if (type === 'gadget') {
        item.textContent = '🔧';
        item.title = 'Gadget de Doraemon';
    } else {
        item.textContent = '💎';
        item.title = 'Tesoro de One Piece';
    }
    
    // Event listener para encontrar elemento
    item.addEventListener('click', () => {
        findGameItem(item, type);
    });
    
    container.appendChild(item);
}

function startBirthdayAdventure() {
    // Scroll suave hacia la galería
    const gallerySection = document.getElementById('gallery');
    if (gallerySection) {
        gallerySection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    playSound('success');
    triggerConfetti();
    
    setTimeout(() => {
        showNotification('¡Tu regalo especial está listo! Disfruta cada momento 🎁', 'success');
    }, 1000);
}

function startGame() {
    if (gameActive) return;
    
    gameActive = true;
    gameTimer = 60;
    gadgetsFound = 0;
    treasuresFound = 0;
    
    updateGameStats();
    createGameBoard();
    
    const startBtn = document.getElementById('start-game');
    if (startBtn) {
        startBtn.textContent = '🎮 Juego en Progreso...';
        startBtn.disabled = true;
    }
    
    // Iniciar cronómetro
    gameInterval = setInterval(() => {
        gameTimer--;
        updateGameStats();
        
        if (gameTimer <= 0 || (gadgetsFound >= 5 && treasuresFound >= 5)) {
            endGame();
        }
    }, 1000);
    
    playSound('success');
    showNotification('¡Encuentra todos los elementos antes de que se acabe el tiempo!', 'success');
}

function findGameItem(item, type) {
    if (!gameActive) return;
    
    item.classList.add('found');
    
    if (type === 'gadget') {
        gadgetsFound++;
        showGameMessage('¡Gadget Encontrado!', getGadgetMessage());
    } else {
        treasuresFound++;
        showGameMessage('¡Tesoro Descubierto!', getTreasureMessage());
    }
    
    updateGameStats();
    playSound('found');
    
    // Remover elemento después de la animación
    setTimeout(() => {
        if (item.parentNode) {
            item.parentNode.removeChild(item);
        }
    }, 500);
    
    // Verificar si se completó el juego
    if (gadgetsFound >= 5 && treasuresFound >= 5) {
        endGame();
    }
}

function getGadgetMessage() {
    const messages = [
        '¡Has encontrado la Puerta de Cualquier Lugar! Úsala para viajar a lugares increíbles.',
        '¡El Bambú Volador! Perfecto para aventuras en las alturas.',
        '¡La Máquina del Tiempo! Para revivir momentos especiales.',
        '¡El Traductor Universal! Para entender a todos los seres.',
        '¡La Cápsula de Felicidad! Guarda tus mejores recuerdos.'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

function getTreasureMessage() {
    const messages = [
        '¡Oro de los Piratas del Sombrero de Paja! Un tesoro lleno de aventuras.',
        '¡Mapa del Grand Line! Te llevará a las mejores aventuras.',
        '¡Brújula Eterna! Siempre te guiará hacia la felicidad.',
        '¡Fruta del Diablo de la Alegría! Te dará poderes de súper diversión.',
        '¡Bandera Pirata Personal! Para liderar tu propia tripulación de sueños.'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

function showGameMessage(title, text) {
    const gameMessage = document.getElementById('game-message');
    const messageTitle = document.getElementById('message-title');
    const messageText = document.getElementById('message-text');
    
    if (gameMessage && messageTitle && messageText) {
        messageTitle.textContent = title;
        messageText.textContent = text;
        gameMessage.classList.remove('hidden');
    }
}

function closeGameMessage() {
    const gameMessage = document.getElementById('game-message');
    if (gameMessage) {
        gameMessage.classList.add('hidden');
    }
}

function updateGameStats() {
    const gadgetsSpan = document.getElementById('gadgets-found');
    const treasuresSpan = document.getElementById('treasures-found');
    const timerSpan = document.getElementById('game-timer');
    
    if (gadgetsSpan) gadgetsSpan.textContent = gadgetsFound;
    if (treasuresSpan) treasuresSpan.textContent = treasuresFound;
    if (timerSpan) timerSpan.textContent = gameTimer;
}

function endGame() {
    gameActive = false;
    clearInterval(gameInterval);
    
    const startBtn = document.getElementById('start-game');
    if (startBtn) {
        startBtn.textContent = '🎯 Comenzar Aventura';
        startBtn.disabled = false;
    }
    
    let message = '';
    if (gadgetsFound >= 5 && treasuresFound >= 5) {
        message = '¡INCREÍBLE! Has encontrado todos los elementos. ¡Eres una verdadera aventurera como Luffy y tan inteligente como Doraemon!';
        triggerSpecialAnimation();
    } else if (gadgetsFound + treasuresFound >= 7) {
        message = '¡Excelente trabajo! Has demostrado ser una gran exploradora. ¡Casi completaste la misión!';
        triggerConfetti();
    } else {
        message = '¡Buen intento! Cada aventura es una oportunidad de aprender. ¡Inténtalo de nuevo!';
    }
    
    showGameMessage('🏆 Aventura Completada', message);
    playSound('celebration');
}

function resetGame() {
    gameActive = false;
    clearInterval(gameInterval);
    gameTimer = 60;
    gadgetsFound = 0;
    treasuresFound = 0;
    
    updateGameStats();
    createGameBoard();
    
    const startBtn = document.getElementById('start-game');
    if (startBtn) {
        startBtn.textContent = '🎯 Comenzar Aventura';
        startBtn.disabled = false;
    }
}

// ========================================
// SISTEMA DE TESOROS
// ========================================

function revealTreasure(treasureId) {
    const treasure = {
        1: {
            title: '💖 Bondad Infinita',
            description: 'Tu corazón bondadoso ilumina cada lugar donde vas. Como Chopper cuidando a sus amigos, siempre piensas en los demás antes que en ti misma.'
        },
        2: {
            title: '🎨 Creatividad Mágica',
            description: 'Tu imaginación es tan poderosa como los gadgets de Doraemon. Cada idea tuya es una aventura esperando a suceder.'
        },
        3: {
            title: '⚔️ Valentía de Guerrera',
            description: 'Tienes el coraje de Luffy para enfrentar cualquier desafío. No hay obstáculo demasiado grande para tu espíritu valiente.'
        },
        4: {
            title: '🧠 Inteligencia Brillante',
            description: 'Tu mente es tan aguda como la de Nami navegando por el Grand Line. Siempre encuentras soluciones creativas a todo.'
        },
        5: {
            title: '🌟 Alegría Contagiosa',
            description: 'Tu risa es como la música más hermosa del mundo. Tienes el don de hacer feliz a cualquiera con solo sonreír.'
        },
        6: {
            title: '💕 Amor Incondicional',
            description: 'Eres el tesoro más valioso de nuestra familia. Tu amor hace que cada día sea una aventura maravillosa llena de significado.'
        }
    };
    
    const selectedTreasure = treasure[treasureId];
    if (!selectedTreasure) return;
    
    const revealedContainer = document.getElementById('revealed-treasures');
    if (!revealedContainer) return;
    
    // Verificar si ya fue revelado
    if (revealedContainer.querySelector(`[data-treasure="${treasureId}"]`)) return;
    
    const treasureElement = document.createElement('div');
    treasureElement.className = 'revealed-treasure';
    treasureElement.setAttribute('data-treasure', treasureId);
    treasureElement.innerHTML = `
        <h3>${selectedTreasure.title}</h3>
        <p>${selectedTreasure.description}</p>
    `;
    
    revealedContainer.appendChild(treasureElement);
    
    revealedTreasures++;
    playSound('found');
    
    // Efecto especial si es el tesoro central
    if (treasureId === 6) {
        triggerSpecialAnimation();
        showNotification('¡Has encontrado el tesoro más especial! 💖', 'success');
    }
    
    // Si se han revelado todos los tesoros
    if (revealedTreasures >= 6) {
        setTimeout(() => {
            showNotification('¡Has descubierto todos tus tesoros especiales! Eres verdaderamente única 🌟', 'success');
        }, 1000);
    }
}

// ========================================
// SISTEMA DE GADGETS
// ========================================

function activateGadget(gadgetId) {
    const gadgets = {
        1: {
            name: 'Puerta a Cualquier Lugar',
            effect: () => {
                showGadgetEffect('portal');
                showNotification('¡Has activado la Puerta a Cualquier Lugar! Te transporta a tus mejores recuerdos 🚪✨', 'success');
            }
        },
        2: {
            name: 'Cámara de Recuerdos',
            effect: () => {
                showGadgetEffect('camera');
                showNotification('¡La Cámara de Recuerdos captura este momento perfecto! 📸✨', 'success');
            }
        },
        3: {
            name: 'Bambú Volador',
            effect: () => {
                showGadgetEffect('fly');
                showNotification('¡El Bambú Volador te eleva hacia nuevas aventuras! 🎈✨', 'success');
            }
        },
        4: {
            name: 'Varita de Deseos',
            effect: () => {
                showGadgetEffect('magic');
                showNotification('¡La Varita de Deseos hará realidad tus sueños más hermosos! 💫✨', 'success');
            }
        },
        5: {
            name: 'Estrella de la Amistad',
            effect: () => {
                showGadgetEffect('friendship');
                showNotification('¡La Estrella de la Amistad nos une para siempre! 🌟✨', 'success');
            }
        },
        6: {
            name: 'Caja de Pandora Feliz',
            effect: () => {
                showGadgetEffect('happiness');
                showNotification('¡La Caja de Pandora libera toda la felicidad del mundo! 💝✨', 'success');
            }
        }
    };
    
    const gadget = gadgets[gadgetId];
    if (!gadget) return;
    
    // Activar efecto visual
    const gadgetElement = document.querySelector(`.gadget-item:nth-child(${gadgetId})`);
    if (gadgetElement) {
        gadgetElement.classList.add('active');
        
        setTimeout(() => {
            gadgetElement.classList.remove('active');
        }, 2000);
    }
    
    // Ejecutar efecto del gadget
    gadget.effect();
    playSound('success');
}

function showGadgetEffect(type) {
    const effect = document.createElement('div');
    effect.className = `gadget-effect ${type}`;
    effect.style.position = 'fixed';
    effect.style.top = '50%';
    effect.style.left = '50%';
    effect.style.transform = 'translate(-50%, -50%)';
    effect.style.fontSize = '5rem';
    effect.style.zIndex = '2000';
    effect.style.pointerEvents = 'none';
    effect.style.animation = 'gadgetActivation 2s ease-out forwards';
    
    const icons = {
        portal: '🌀',
        camera: '📸',
        fly: '🎈',
        magic: '✨',
        friendship: '🌟',
        happiness: '🎉'
    };
    
    effect.textContent = icons[type] || '✨';
    
    document.body.appendChild(effect);
    
    setTimeout(() => {
        document.body.removeChild(effect);
    }, 2000);
}

// ========================================
// CARTA FINAL
// ========================================

function typeWriter(element, text, speed = 50) {
    let i = 0;
    const cursor = document.getElementById('cursor');
    
    function type() {
        if (i < text.length) {
            element.innerHTML = text.substring(0, i + 1) + '<span class="cursor" id="cursor">|</span>';
            i++;
            setTimeout(type, speed);
        } else {
            // Ocultar el cursor cuando termine
            setTimeout(() => {
                element.innerHTML = text;
                // Mostrar la foto y mensaje final después de que termine el typing
                showFinalMessage();
            }, 1000);
        }
    }
    
    type();
}

function showFinalMessage() {
    const finalMessage = document.getElementById('final-message');
    if (finalMessage) {
        finalMessage.style.opacity = '1';
    }
}

function openLetter() {
    const envelope = document.querySelector('.envelope');
    const letterContent = document.querySelector('.letter-content');
    
    if (envelope && letterContent) {
        // Ocultar el sobre
        envelope.style.display = 'none';
        
        // Mostrar la carta
        letterContent.classList.add('show');
        
        // Efectos especiales
        playSound('success');
        
        // Iniciar el efecto de escritura
        setTimeout(() => {
            const typewriterElement = document.getElementById('typewriter-paragraph');
            const text = "Hermanita, espero que la pases súper bien allá en Ayacucho junto a José. Sé que van a tener momentos increíbles en ese paseo, y aunque no estamos ahí yo y Meli para celebrar, pásala bien y disfruta tu día especial.";
            typeWriter(typewriterElement, text, 60);
        }, 500);
        
        setTimeout(() => {
            showNotification('¡Carta especial desplegada! Lee cada palabra con el corazón 💝', 'success');
        }, 800);
    }
}

function closeLetter() {
    const envelope = document.querySelector('.envelope');
    const letterContent = document.querySelector('.letter-content');
    
    if (envelope && letterContent) {
        // Ocultar la carta
        letterContent.classList.remove('show');
        
        // Mostrar el sobre después de un pequeño delay
        setTimeout(() => {
            envelope.style.display = 'block';
        }, 300);
        
        showNotification('Carta cerrada. ¡Puedes abrirla cuando quieras! 💌', 'info');
    }
}

function createMagicSparkles() {
    // Crear chispas mágicas alrededor de la carta
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.style.position = 'fixed';
            sparkle.style.fontSize = '20px';
            sparkle.style.zIndex = '2000';
            sparkle.style.pointerEvents = 'none';
            sparkle.textContent = ['✨', '💫', '⭐', '🌟'][Math.floor(Math.random() * 4)];
            
            // Posición aleatoria alrededor del centro
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            sparkle.style.left = (centerX + (Math.random() - 0.5) * 400) + 'px';
            sparkle.style.top = (centerY + (Math.random() - 0.5) * 300) + 'px';
            
            sparkle.style.animation = 'sparkleFloat 2s ease-out forwards';
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => {
                if (document.body.contains(sparkle)) {
                    document.body.removeChild(sparkle);
                }
            }, 2000);
        }, i * 100);
    }
}

// ========================================
// EASTER EGGS Y SECRETOS
// ========================================

function setupEasterEggs() {
    setupSecretButtons();
    setupSpecialClickCombos();
    setupHiddenAnimations();
}

function setupSecretButtons() {
    const secretDoraemon = document.querySelector('.secret-doraemon');
    const secretOnePiece = document.querySelector('.secret-onepiece');
    
    if (secretDoraemon) {
        secretDoraemon.addEventListener('click', secretDoraemonAnimation);
    }
    
    if (secretOnePiece) {
        secretOnePiece.addEventListener('click', secretOnePieceAnimation);
    }
}

function secretDoraemonAnimation() {
    // Crear múltiples Doraemons flotando
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            createFloatingDoraemon();
        }, i * 200);
    }
    
    showNotification('¡Easter Egg de Doraemon activado! 🤖✨', 'success');
    playSound('celebration');
}

function secretOnePieceAnimation() {
    // Crear barcos piratas navegando
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            createSailingShip();
        }, i * 500);
    }
    
    showNotification('¡Easter Egg de One Piece activado! ⚓🏴‍☠️', 'success');
    playSound('celebration');
}

function createFloatingDoraemon() {
    const doraemon = document.createElement('div');
    doraemon.style.position = 'fixed';
    doraemon.style.fontSize = '3rem';
    doraemon.style.zIndex = '2000';
    doraemon.style.pointerEvents = 'none';
    doraemon.textContent = '🤖';
    
    // Posición inicial aleatoria
    doraemon.style.left = Math.random() * window.innerWidth + 'px';
    doraemon.style.top = window.innerHeight + 'px';
    
    // Animación flotante
    doraemon.style.animation = 'floatingDoraemon 4s ease-out forwards';
    
    document.body.appendChild(doraemon);
    
    setTimeout(() => {
        document.body.removeChild(doraemon);
    }, 4000);
}

function createSailingShip() {
    const ship = document.createElement('div');
    ship.style.position = 'fixed';
    ship.style.fontSize = '3rem';
    ship.style.zIndex = '2000';
    ship.style.pointerEvents = 'none';
    ship.textContent = '🚢';
    
    // Empezar desde la izquierda
    ship.style.left = '-100px';
    ship.style.top = Math.random() * (window.innerHeight - 100) + 'px';
    
    // Animación de navegación
    ship.style.animation = 'sailingShip 6s linear forwards';
    
    document.body.appendChild(ship);
    
    setTimeout(() => {
        document.body.removeChild(ship);
    }, 6000);
}

function setupSpecialClickCombos() {
    let clickCount = 0;
    let clickTimer;
    
    document.addEventListener('click', () => {
        clickCount++;
        
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => {
            if (clickCount >= 10) {
                activateSecretMode();
            }
            clickCount = 0;
        }, 2000);
    });
}

function activateSecretMode() {
    document.body.classList.add('doraemon-cursor');
    
    // Modo oscuro especial
    document.body.classList.toggle('dark-mode');
    
    showNotification('¡Modo secreto activado! Has desbloqueado características especiales 🎭', 'success');
    triggerSpecialAnimation();
    
    // Cambiar cursor temporalmente
    setTimeout(() => {
        document.body.classList.remove('doraemon-cursor');
    }, 10000);
}

function setupHiddenAnimations() {
    // Animación especial al hacer scroll en ciertas secciones
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                triggerSectionAnimation(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    sections.forEach(section => observer.observe(section));
}

function triggerSectionAnimation(section) {
    const sectionId = section.getAttribute('id');
    
    switch(sectionId) {
        case 'hero':
            // Ya tiene animaciones propias
            break;
        case 'gallery':
            animateGalleryElements();
            break;
        case 'messages':
            animateMessageCards();
            break;
        case 'timeline':
            animateTimelineItems();
            break;
        case 'game':
            animateGameElements();
            break;
        case 'treasure':
            animateTreasureMap();
            break;
        case 'gadgets':
            animateGadgets();
            break;
        case 'final':
            animateFinalSection();
            break;
    }
}

function animateGalleryElements() {
    const photos = document.querySelectorAll('.photo-card');
    photos.forEach((photo, index) => {
        setTimeout(() => {
            photo.style.animation = 'slideUp 0.8s ease-out forwards';
        }, index * 200);
    });
}

function animateMessageCards() {
    const cards = document.querySelectorAll('.message-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = 'messageCardAppear 0.8s ease-out forwards';
        }, index * 150);
    });
}

function animateTimelineItems() {
    const items = document.querySelectorAll('.timeline-item');
    items.forEach((item, index) => {
        setTimeout(() => {
            item.style.animation = 'timelineSlideIn 1s ease-out forwards';
        }, index * 200);
    });
}

function animateGameElements() {
    const gameBoard = document.getElementById('game-board');
    if (gameBoard) {
        gameBoard.style.animation = 'gameBoardGlow 2s ease-in-out infinite';
    }
}

function animateTreasureMap() {
    const chests = document.querySelectorAll('.treasure-chest');
    chests.forEach((chest, index) => {
        setTimeout(() => {
            chest.style.animation = 'treasureAppear 0.8s ease-out forwards';
        }, index * 100);
    });
}

function animateGadgets() {
    const gadgets = document.querySelectorAll('.gadget-item');
    gadgets.forEach((gadget, index) => {
        setTimeout(() => {
            gadget.style.animation = 'gadgetActivate 0.6s ease-out forwards';
        }, index * 100);
    });
}

function animateFinalSection() {
    const envelope = document.querySelector('.envelope');
    if (envelope) {
        envelope.style.animation = 'envelopeGlow 2s ease-in-out infinite';
    }
}

// ========================================
// CÓDIGO KONAMI
// ========================================

function setupKonamiCode() {
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.code);
        
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
            activateKonamiMode();
            konamiCode = [];
        }
    });
}

function activateKonamiMode() {
    // Activar modo súper especial
    document.body.style.animation = 'rainbowBackground 2s infinite';
    
    // Lluvia de elementos especiales
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            createSpecialElement();
        }, i * 100);
    }
    
    showNotification('¡CÓDIGO KONAMI ACTIVADO! ¡Modo súper especial desbloqueado! 🌈🎮', 'success');
    playMelody();
    
    setTimeout(() => {
        document.body.style.animation = '';
    }, 10000);
}

function createSpecialElement() {
    const elements = ['🎂', '🎉', '🎈', '🎁', '⭐', '💖', '🦄', '🌈'];
    const element = document.createElement('div');
    
    element.style.position = 'fixed';
    element.style.fontSize = '2rem';
    element.style.zIndex = '2000';
    element.style.pointerEvents = 'none';
    element.textContent = elements[Math.floor(Math.random() * elements.length)];
    
    element.style.left = Math.random() * window.innerWidth + 'px';
    element.style.top = '-50px';
    element.style.animation = 'specialElementFall 3s linear forwards';
    
    document.body.appendChild(element);
    
    setTimeout(() => {
        if (element.parentNode) {
            document.body.removeChild(element);
        }
    }, 3000);
}

// ========================================
// SISTEMA DE NOTIFICACIONES
// ========================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        color: #333;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 3000;
        font-weight: 600;
        border-left: 4px solid #4A90E2;
        animation: notificationSlide 0.5s ease-out forwards;
        max-width: 350px;
        word-wrap: break-word;
    `;
    
    if (type === 'success') {
        notification.style.borderLeftColor = '#6BCF7F';
    } else if (type === 'warning') {
        notification.style.borderLeftColor = '#FFD93D';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'notificationSlideOut 0.5s ease-in forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 500);
    }, 4000);
}

// ========================================
// ANIMACIONES DE SCROLL
// ========================================

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos que necesitan animación
    const animatedElements = document.querySelectorAll(
        '.section-header, .photo-card, .message-card, .timeline-item, .gadget-item, .treasure-chest'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// ========================================
// FUNCIONES DE UTILIDAD
// ========================================

function shareExperience() {
    if (navigator.share) {
        navigator.share({
            title: '🎉 ¡Feliz Cumpleaños Deysi! 🎂',
            text: 'Una experiencia especial de cumpleaños llena de amor, aventuras de Doraemon y One Piece',
            url: window.location.href
        }).then(() => {
            showNotification('¡Gracias por compartir esta experiencia especial! 💝', 'success');
        }).catch(err => {
            copyToClipboard();
        });
    } else {
        copyToClipboard();
    }
    
    playSound('success');
}

function copyToClipboard() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        showNotification('¡Enlace copiado al portapapeles! 📋', 'success');
    }).catch(() => {
        showNotification('No se pudo copiar el enlace, pero puedes compartir manualmente 😊', 'warning');
    });
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// ========================================
// EVENT LISTENERS GLOBALES
// ========================================

function setupEventListeners() {
    // Botón de abrir regalo
    const startAdventureBtn = document.querySelector('.cta-button.primary');
    if (startAdventureBtn) {
        startAdventureBtn.addEventListener('click', startBirthdayAdventure);
    }
    
    // Botones del juego
    const startGameBtn = document.getElementById('start-game');
    const resetGameBtn = document.getElementById('reset-game');
    
    if (startGameBtn) {
        startGameBtn.addEventListener('click', startGame);
    }
    
    if (resetGameBtn) {
        resetGameBtn.addEventListener('click', resetGame);
    }
    
    // Cerrar modal con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeGameMessage();
        }
    });
    
    // Click fuera del modal para cerrar
    const modal = document.getElementById('modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // Prevenir click derecho en imágenes (protección básica)
    document.addEventListener('contextmenu', (e) => {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
        }
    });
    
    // Efecto de cursor personalizado
    document.addEventListener('mousemove', (e) => {
        createCursorTrail(e.clientX, e.clientY);
    });
}

function createCursorTrail(x, y) {
    const trail = document.createElement('div');
    trail.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 6px;
        height: 6px;
        background: rgba(74, 144, 226, 0.6);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        animation: cursorTrail 1s ease-out forwards;
    `;
    
    document.body.appendChild(trail);
    
    setTimeout(() => {
        if (trail.parentNode) {
            document.body.removeChild(trail);
        }
    }, 1000);
}

// ========================================
// ESTILOS DINÁMICOS ADICIONALES
// ========================================

// Agregar estilos de animación dinámicamente
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes notificationSlide {
        0% { transform: translateX(100%); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes notificationSlideOut {
        0% { transform: translateX(0); opacity: 1; }
        100% { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes particleExplosion {
        0% { opacity: 1; transform: translate(0, 0) scale(1); }
        100% { opacity: 0; transform: translate(var(--x), var(--y)) scale(0.5); }
    }
    
    @keyframes gadgetActivation {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0) rotate(0deg); }
        50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2) rotate(180deg); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(1) rotate(360deg); }
    }
    
    @keyframes floatingDoraemon {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
    }
    
    @keyframes sailingShip {
        0% { transform: translateX(0) rotate(0deg); }
        100% { transform: translateX(calc(100vw + 100px)) rotate(360deg); }
    }
    
    @keyframes rainbowBackground {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
    
    @keyframes specialElementFall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }
    
    @keyframes cursorTrail {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0); }
    }
    
    @keyframes messageCardAppear {
        0% { opacity: 0; transform: translateY(30px) rotateY(45deg); }
        100% { opacity: 1; transform: translateY(0) rotateY(0deg); }
    }
    
    @keyframes treasureAppear {
        0% { opacity: 0; transform: scale(0) rotate(0deg); }
        100% { opacity: 1; transform: scale(1) rotate(360deg); }
    }
    
    @keyframes gadgetActivate {
        0% { opacity: 0; transform: translateY(20px) scale(0.8); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    
    @keyframes gameBoardGlow {
        0%, 100% { box-shadow: 0 8px 30px rgba(74, 144, 226, 0.3); }
        50% { box-shadow: 0 8px 30px rgba(255, 107, 53, 0.3); }
    }
    
    @keyframes envelopeGlow {
        0%, 100% { box-shadow: 0 15px 50px rgba(74, 144, 226, 0.2); }
        50% { box-shadow: 0 15px 50px rgba(255, 217, 61, 0.4); }
    }
`;

document.head.appendChild(additionalStyles);

// ========================================
// INICIALIZACIÓN FINAL
// ========================================

// Asegurar que todo esté listo cuando el DOM se cargue completamente
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWebsite);
} else {
    initializeWebsite();
}

// ========================================
// FUNCIONES GLOBALES PARA EL HTML
// ========================================

// Estas funciones se llaman desde el HTML, así que deben estar en el scope global
window.startBirthdayAdventure = startBirthdayAdventure;
window.nextPhoto = nextPhoto;
window.previousPhoto = previousPhoto;
window.openMessage = openMessage;
window.startGame = startGame;
window.resetGame = resetGame;
window.closeGameMessage = closeGameMessage;
window.revealTreasure = revealTreasure;
window.activateGadget = activateGadget;
window.openLetter = openLetter;
window.shareExperience = shareExperience;
window.closeModal = closeModal;
window.secretDoraemonAnimation = secretDoraemonAnimation;
window.secretOnePieceAnimation = secretOnePieceAnimation;

console.log('🎉 ¡Sistema de cumpleaños de Deysi cargado exitosamente! 🎂');
console.log('🤖 Funciones de Doraemon activadas ✨');
console.log('🏴‍☠️ Aventuras de One Piece listas para navegar ⚓');
console.log('💝 Todo preparado para una experiencia inolvidable 🌟');

// =========================================
// SISTEMA DE FUEGOS ARTIFICIALES ESPECTACULAR
// =========================================

// Variables globales para fuegos artificiales
let canvas, ctx;
let then;
let birthday;

// Funciones auxiliares
const PI2 = Math.PI * 2;
const random = (min, max) => Math.random() * (max - min + 1) + min | 0;
const timestamp = _ => new Date().getTime();

// Clase principal de cumpleaños con fuegos artificiales
class Birthday {
    constructor() {
        this.resize();
        // Crear un lugar para almacenar los fuegos artificiales
        this.fireworks = [];
        this.counter = 0;
    }
    
    resize() {
        this.width = canvas.width = window.innerWidth;
        let center = this.width / 2 | 0;
        this.spawnA = center - center / 4 | 0;
        this.spawnB = center + center / 4 | 0;
        
        this.height = canvas.height = window.innerHeight;
        this.spawnC = this.height * .1;
        this.spawnD = this.height * .5;
    }
    
    onClick(evt) {
        // Solo activar en clics fuera de elementos interactivos
        if (evt.target.closest('button, .nav-link, .cta-button, .game-btn, .carousel-btn')) {
            return;
        }
        
        let x = evt.clientX || evt.touches && evt.touches[0].pageX;
        let y = evt.clientY || evt.touches && evt.touches[0].pageY;
        
        let count = random(3, 5);
        for(let i = 0; i < count; i++) {
            this.fireworks.push(new Firework(
                random(this.spawnA, this.spawnB),
                this.height,
                x,
                y,
                random(0, 360),
                random(50, 150)
            ));
        }
        
        this.counter = -1;
    }
    
    update(delta) {
        // Limpiar canvas con transparencia para mantener fondo original
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = `rgba(0,0,0,${delta * 3})`;
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.globalCompositeOperation = 'lighter';
        for (let firework of this.fireworks) firework.update(delta);

        // Si ha pasado suficiente tiempo... crear nuevo fuego artificial
        this.counter += delta * 2; // cada segundo
        if (this.counter >= 1) {
            this.fireworks.push(new Firework(
                random(this.spawnA, this.spawnB),
                this.height,
                random(0, this.width),
                random(this.spawnC, this.spawnD),
                random(0, 360),
                random(60, 120)
            ));
            this.counter = 0;
        }

        // Eliminar fuegos artificiales muertos
        if (this.fireworks.length > 1000) {
            this.fireworks = this.fireworks.filter(firework => !firework.dead);
        }
    }
}

// Clase de fuego artificial
class Firework {
    constructor(x, y, targetX, targetY, shade, offsprings) {
        this.dead = false;
        this.offsprings = offsprings;

        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;

        this.shade = shade;
        this.history = [];
    }
    
    update(delta) {
        if (this.dead) return;

        let xDiff = this.targetX - this.x;
        let yDiff = this.targetY - this.y;
        
        if (Math.abs(xDiff) > 3 || Math.abs(yDiff) > 3) { // Aún se está moviendo
            this.x += xDiff * 2 * delta;
            this.y += yDiff * 2 * delta;

            this.history.push({
                x: this.x,
                y: this.y
            });

            if (this.history.length > 20) this.history.shift();

        } else {
            if (this.offsprings && !this.madeChilds) {
                
                let babies = this.offsprings / 2;
                for (let i = 0; i < babies; i++) {
                    let targetX = this.x + this.offsprings * Math.cos(PI2 * i / babies) | 0;
                    let targetY = this.y + this.offsprings * Math.sin(PI2 * i / babies) | 0;

                    birthday.fireworks.push(new Firework(this.x, this.y, targetX, targetY, this.shade, 0));
                }
            }
            this.madeChilds = true;
            this.history.shift();
        }
        
        if (this.history.length === 0) this.dead = true;
        else if (this.offsprings) { 
            for (let i = 0; this.history.length > i; i++) {
                let point = this.history[i];
                ctx.beginPath();
                ctx.fillStyle = 'hsl(' + this.shade + ',100%,' + i + '%)';
                ctx.arc(point.x, point.y, 1, 0, PI2, false);
                ctx.fill();
            } 
        } else {
            ctx.beginPath();
            ctx.fillStyle = 'hsl(' + this.shade + ',100%,50%)';
            ctx.arc(this.x, this.y, 1, 0, PI2, false);
            ctx.fill();
        }
    }
}

// Inicializar sistema de fuegos artificiales
function initializeFireworks() {
    canvas = document.getElementById('fireworksCanvas');
    if (!canvas) return;
    
    ctx = canvas.getContext('2d');
    then = timestamp();
    
    birthday = new Birthday();
    
    // Event listeners
    window.onresize = () => birthday.resize();
    document.onclick = evt => birthday.onClick(evt);
    document.ontouchstart = evt => birthday.onClick(evt);
    
    // Loop de animación
    (function loop(){
        requestAnimationFrame(loop);

        let now = timestamp();
        let delta = now - then;

        then = now;
        birthday.update(delta / 1000);
    })();
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Esperar un poco para que todo esté cargado
    setTimeout(initializeFireworks, 1000);
});