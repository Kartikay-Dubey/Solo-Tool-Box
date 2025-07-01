// Global variables
let timerInterval;
let stopwatchInterval;
let calcDisplay = '';
let stopwatchRunning = false;
let stopwatchTime = 0;

// Initialize particles.js with better error handling
function initParticles() {
    try {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                particles: {
                    number: { 
                        value: 80, 
                        density: { 
                            enable: true, 
                            value_area: 800 
                        } 
                    },
                    color: { value: '#9333ea' },
                    shape: { type: 'circle' },
                    opacity: { 
                        value: 0.5, 
                        random: false 
                    },
                    size: { 
                        value: 3, 
                        random: true 
                    },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: '#9333ea',
                        opacity: 0.4,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 2,
                        direction: 'none',
                        random: false,
                        straight: false,
                        out_mode: 'out',
                        bounce: false
                    }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: { 
                            enable: true, 
                            mode: 'repulse' 
                        },
                        onclick: { 
                            enable: true, 
                            mode: 'push' 
                        },
                        resize: true
                    }
                },
                retina_detect: true
            });
        } else {
            console.log('Particles.js not loaded, skipping particle initialization');
        }
    } catch (error) {
        console.error('Error initializing particles:', error);
    }
}

// Loading screen with better timing
function hideLoadingScreen() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 1500); // Reduced from 2000ms to 1500ms for better UX
}

// Enhanced Modal System with better styling
function openModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 flex items-center justify-center z-50 modal-overlay';
    modal.innerHTML = `
        <div class="relative bg-gray-900 rounded-lg shadow-xl w-96 max-w-full m-4 modal-content">
            <div class="flex justify-between items-center p-4 border-b border-gray-700">
                <h3 class="text-xl font-bold modal-header">${title}</h3>
                <button onclick="closeModal(this)" class="text-gray-400 hover:text-white transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <div class="p-4">${content}</div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Add entrance animation
    setTimeout(() => {
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.transform = 'scale(1)';
            modalContent.style.opacity = '1';
        }
    }, 10);
}

function closeModal(button) {
    const modal = button.closest('.fixed');
    if (modal) {
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.transform = 'scale(0.9)';
            modalContent.style.opacity = '0';
        }
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    // Clear any running intervals
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    if (stopwatchInterval) {
        clearInterval(stopwatchInterval);
        stopwatchInterval = null;
    }
}

// Calculator Implementation
function initCalculator() {
    const calculatorCard = document.querySelector('[data-tool="calculator"]');
    if (calculatorCard) {
        calculatorCard.addEventListener('click', () => {
            const calculatorHTML = `
                <div class="calculator-container p-4">
                    <input type="text" class="w-full p-2 mb-4 bg-gray-800 text-white rounded input-field" id="calc-display" readonly>
                    <div class="grid grid-cols-4 gap-2">
                        ${['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+'].map(btn => 
                            `<button class="btn-primary" onclick="updateCalc('${btn}')">${btn}</button>`
                        ).join('')}
                    </div>
                    <div class="flex gap-2 mt-2">
                        <button class="btn-primary flex-1" onclick="clearCalc()">Clear</button>
                        <button class="btn-primary flex-1" onclick="backspaceCalc()">⌫</button>
                    </div>
                </div>
            `;
            openModal('Calculator', calculatorHTML);
        });
    }
}

function updateCalc(value) {
    const display = document.getElementById('calc-display');
    if (!display) return;
    
    if (value === '=') {
        try {
            calcDisplay = eval(calcDisplay).toString();
        } catch (e) {
            calcDisplay = 'Error';
        }
    } else {
        calcDisplay += value;
    }
    display.value = calcDisplay;
}

function clearCalc() {
    calcDisplay = '';
    const display = document.getElementById('calc-display');
    if (display) {
        display.value = calcDisplay;
    }
}

function backspaceCalc() {
    calcDisplay = calcDisplay.slice(0, -1);
    const display = document.getElementById('calc-display');
    if (display) {
        display.value = calcDisplay;
    }
}

// Currency Converter Implementation
function initCurrencyConverter() {
    const converterCard = document.querySelector('[data-tool="converter"]');
    if (converterCard) {
        converterCard.addEventListener('click', () => {
            const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR'];
            const converterHTML = `
                <div class="converter-container p-4">
                    <input type="number" class="w-full p-2 mb-4 bg-gray-800 text-white rounded input-field" id="amount" placeholder="Amount">
                    <select class="w-full p-2 mb-4 bg-gray-800 text-white rounded input-field" id="from-currency">
                        ${currencies.map(curr => `<option value="${curr}">${curr}</option>`).join('')}
                    </select>
                    <select class="w-full p-2 mb-4 bg-gray-800 text-white rounded input-field" id="to-currency">
                        ${currencies.map(curr => `<option value="${curr}">${curr}</option>`).join('')}
                    </select>
                    <button class="w-full btn-primary" onclick="convertCurrency()">Convert</button>
                    <div id="conversion-result" class="mt-4 text-center text-white"></div>
                </div>
            `;
            openModal('Currency Converter', converterHTML);
        });
    }
}

async function convertCurrency() {
    const amount = document.getElementById('amount')?.value;
    const fromCurrency = document.getElementById('from-currency')?.value;
    const toCurrency = document.getElementById('to-currency')?.value;
    const resultDiv = document.getElementById('conversion-result');
    
    if (!amount || !fromCurrency || !toCurrency || !resultDiv) {
        if (resultDiv) {
            resultDiv.textContent = 'Please enter an amount';
        }
        return;
    }
    
    try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        if (!response.ok) {
            throw new Error('Failed to fetch exchange rates');
        }
        const data = await response.json();
        const rate = data.rates[toCurrency];
        const result = (amount * rate).toFixed(2);
        resultDiv.innerHTML = `
            <div class="text-2xl font-bold text-purple-400">${amount} ${fromCurrency}</div>
            <div class="text-lg text-gray-300">=</div>
            <div class="text-3xl font-bold text-green-400">${result} ${toCurrency}</div>
            <div class="text-sm text-gray-400 mt-2">Rate: 1 ${fromCurrency} = ${rate} ${toCurrency}</div>
        `;
    } catch (error) {
        console.error('Currency conversion error:', error);
        if (resultDiv) {
            resultDiv.textContent = 'Error fetching exchange rates. Please try again later.';
        }
    }
}

// Unit Converter Implementation
function initUnitConverter() {
    const unitConverterCard = document.querySelector('[data-tool="unit-converter"]');
    if (unitConverterCard) {
        unitConverterCard.addEventListener('click', () => {
            const converterHTML = `
                <div class="unit-converter-container p-4">
                    <input type="number" class="w-full p-2 mb-4 bg-gray-800 text-white rounded input-field" id="unit-amount" placeholder="Amount">
                    <select class="w-full p-2 mb-4 bg-gray-800 text-white rounded input-field" id="unit-type">
                        <option value="length">Length</option>
                        <option value="weight">Weight</option>
                        <option value="temperature">Temperature</option>
                        <option value="volume">Volume</option>
                    </select>
                    <select class="w-full p-2 mb-4 bg-gray-800 text-white rounded input-field" id="from-unit"></select>
                    <select class="w-full p-2 mb-4 bg-gray-800 text-white rounded input-field" id="to-unit"></select>
                    <button class="w-full btn-primary" onclick="convertUnit()">Convert</button>
                    <div id="unit-result" class="mt-4 text-center text-white"></div>
                </div>
            `;
            openModal('Unit Converter', converterHTML);
            setupUnitConverter();
        });
    }
}

function setupUnitConverter() {
    const unitType = document.getElementById('unit-type');
    const fromUnit = document.getElementById('from-unit');
    const toUnit = document.getElementById('to-unit');
    
    if (!unitType || !fromUnit || !toUnit) return;
    
    const units = {
        length: ['Meter', 'Kilometer', 'Centimeter', 'Mile', 'Yard', 'Foot', 'Inch'],
        weight: ['Kilogram', 'Gram', 'Pound', 'Ounce', 'Ton'],
        temperature: ['Celsius', 'Fahrenheit', 'Kelvin'],
        volume: ['Liter', 'Milliliter', 'Gallon', 'Quart', 'Pint', 'Cup']
    };
    
    function updateUnitOptions() {
        const selectedType = unitType.value;
        const unitList = units[selectedType] || [];
        
        fromUnit.innerHTML = unitList.map(unit => `<option value="${unit}">${unit}</option>`).join('');
        toUnit.innerHTML = unitList.map(unit => `<option value="${unit}">${unit}</option>`).join('');
        
        if (unitList.length > 1) {
            toUnit.selectedIndex = 1;
        }
    }
    
    unitType.addEventListener('change', updateUnitOptions);
    updateUnitOptions();
}

function convertUnit() {
    const amount = parseFloat(document.getElementById('unit-amount')?.value);
    const unitType = document.getElementById('unit-type')?.value;
    const fromUnit = document.getElementById('from-unit')?.value;
    const toUnit = document.getElementById('to-unit')?.value;
    const resultDiv = document.getElementById('unit-result');
    
    if (!amount || !unitType || !fromUnit || !toUnit || !resultDiv) {
        if (resultDiv) {
            resultDiv.textContent = 'Please fill all fields';
        }
        return;
    }
    
    // Simple conversion logic (you can expand this)
    let result = amount;
    if (unitType === 'temperature') {
        if (fromUnit === 'Celsius' && toUnit === 'Fahrenheit') {
            result = (amount * 9/5) + 32;
        } else if (fromUnit === 'Fahrenheit' && toUnit === 'Celsius') {
            result = (amount - 32) * 5/9;
        } else if (fromUnit === 'Celsius' && toUnit === 'Kelvin') {
            result = amount + 273.15;
        } else if (fromUnit === 'Kelvin' && toUnit === 'Celsius') {
            result = amount - 273.15;
        }
    } else if (unitType === 'length') {
        if (fromUnit === 'Meter' && toUnit === 'Kilometer') {
            result = amount / 1000;
        } else if (fromUnit === 'Kilometer' && toUnit === 'Meter') {
            result = amount * 1000;
        }
    }
    
    resultDiv.innerHTML = `
        <div class="text-2xl font-bold text-purple-400">${amount} ${fromUnit}</div>
        <div class="text-lg text-gray-300">=</div>
        <div class="text-3xl font-bold text-green-400">${result.toFixed(2)} ${toUnit}</div>
    `;
}

// Timer Implementation
function initTimer() {
    const timerCard = document.querySelector('[data-tool="timer"]');
    if (timerCard) {
        timerCard.addEventListener('click', () => {
            const timerHTML = `
                <div class="timer-container p-4">
                    <div class="text-center mb-4">
                        <div id="timer-display" class="text-4xl font-bold text-purple-400">00:00:00</div>
                    </div>
                    <div class="flex gap-2 mb-4">
                        <input type="number" class="flex-1 p-2 bg-gray-800 text-white rounded input-field" id="hours" placeholder="Hours" min="0" max="99">
                        <input type="number" class="flex-1 p-2 bg-gray-800 text-white rounded input-field" id="minutes" placeholder="Minutes" min="0" max="59">
                        <input type="number" class="flex-1 p-2 bg-gray-800 text-white rounded input-field" id="seconds" placeholder="Seconds" min="0" max="59">
                    </div>
                    <div class="flex gap-2">
                        <button class="btn-primary flex-1" onclick="startTimer()">Start</button>
                        <button class="btn-primary flex-1" onclick="stopTimer()">Stop</button>
                    </div>
                </div>
            `;
            openModal('Timer', timerHTML);
        });
    }
}

function startTimer() {
    const hours = parseInt(document.getElementById('hours')?.value) || 0;
    const minutes = parseInt(document.getElementById('minutes')?.value) || 0;
    const seconds = parseInt(document.getElementById('seconds')?.value) || 0;
    
    let totalSeconds = hours * 3600 + minutes * 60 + seconds;
    
    if (totalSeconds <= 0) {
        alert('Please set a valid time!');
        return;
    }
    
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    timerInterval = setInterval(() => {
        totalSeconds--;
        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            alert('Time is up!');
            return;
        }
        
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        
        const display = document.getElementById('timer-display');
        if (display) {
            display.textContent = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Stopwatch Implementation
function initStopwatch() {
    const stopwatchCard = document.querySelector('[data-tool="stopwatch"]');
    if (stopwatchCard) {
        stopwatchCard.addEventListener('click', () => {
            const stopwatchHTML = `
                <div class="stopwatch-container p-4">
                    <div class="text-center mb-4">
                        <div id="stopwatch-display" class="text-4xl font-bold text-purple-400">00:00:00</div>
                    </div>
                    <div class="flex gap-2">
                        <button class="btn-primary flex-1" onclick="startStopwatch()">Start</button>
                        <button class="btn-primary flex-1" onclick="pauseStopwatch()">Pause</button>
                        <button class="btn-primary flex-1" onclick="resetStopwatch()">Reset</button>
                    </div>
                </div>
            `;
            openModal('Stopwatch', stopwatchHTML);
        });
    }
}

function startStopwatch() {
    if (!stopwatchRunning) {
        stopwatchRunning = true;
        const startTime = Date.now() - stopwatchTime;
        stopwatchInterval = setInterval(() => {
            stopwatchTime = Date.now() - startTime;
            updateStopwatchDisplay();
        }, 10);
    }
}

function pauseStopwatch() {
    stopwatchRunning = false;
    if (stopwatchInterval) {
        clearInterval(stopwatchInterval);
        stopwatchInterval = null;
    }
}

function resetStopwatch() {
    pauseStopwatch();
    stopwatchTime = 0;
    updateStopwatchDisplay();
}

function updateStopwatchDisplay() {
    const display = document.getElementById('stopwatch-display');
    if (!display) return;
    
    const ms = Math.floor((stopwatchTime % 1000) / 10);
    const s = Math.floor((stopwatchTime / 1000) % 60);
    const m = Math.floor((stopwatchTime / (1000 * 60)) % 60);
    const h = Math.floor(stopwatchTime / (1000 * 60 * 60));
    
    display.textContent = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// Notepad Implementation
function initNotepad() {
    const notepadCard = document.querySelector('[data-tool="notepad"]');
    if (notepadCard) {
        notepadCard.addEventListener('click', () => {
            const notepadHTML = `
                <div class="notepad-container p-4">
                    <textarea id="notepad-text" class="w-full h-32 p-4 bg-gray-800 text-white rounded resize-none input-field" 
                        placeholder="Start writing your notes..."></textarea>
                    <div class="flex gap-2 mt-4">
                        <button class="btn-primary flex-1" onclick="saveNote()">Save</button>
                        <button class="btn-primary flex-1" onclick="loadNote()">Load</button>
                        <button class="btn-primary flex-1" onclick="clearNote()">Clear</button>
                    </div>
                </div>
            `;
            openModal('Notepad', notepadHTML);
            loadNote(); // Load any existing note
        });
    }
}

function saveNote() {
    const text = document.getElementById('notepad-text')?.value || '';
    localStorage.setItem('shadowMonarchNote', text);
    alert('Note saved!');
}

function loadNote() {
    const savedNote = localStorage.getItem('shadowMonarchNote') || '';
    const textarea = document.getElementById('notepad-text');
    if (textarea) {
        textarea.value = savedNote;
    }
}

function clearNote() {
    const textarea = document.getElementById('notepad-text');
    if (textarea) {
        textarea.value = '';
    }
    localStorage.removeItem('shadowMonarchNote');
}

// Weather Implementation
function initWeather() {
    const weatherCard = document.querySelector('[data-tool="weather"]');
    if (weatherCard) {
        weatherCard.addEventListener('click', () => {
            const weatherHTML = `
                <div class="weather-container p-4">
                    <input type="text" class="w-full p-2 mb-4 bg-gray-800 text-white rounded input-field" 
                        id="city-input" placeholder="Enter city name">
                    <button class="w-full btn-primary" onclick="getWeather()">Get Weather</button>
                    <div id="weather-result" class="mt-4 text-center text-white"></div>
                </div>
            `;
            openModal('Weather', weatherHTML);
        });
    }
}

async function getWeather() {
    const city = document.getElementById('city-input')?.value;
    const resultDiv = document.getElementById('weather-result');
    
    if (!city || !resultDiv) {
        if (resultDiv) {
            resultDiv.textContent = 'Please enter a city name';
        }
        return;
    }
    
    try {
        // Using a free weather API (you might need to get an API key for production)
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=demo&units=metric`);
        
        if (!response.ok) {
            throw new Error('City not found');
        }
        
        const data = await response.json();
        const temp = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        
        resultDiv.innerHTML = `
            <div class="text-3xl font-bold text-purple-400">${city}</div>
            <div class="text-2xl font-bold text-green-400">${temp}°C</div>
            <div class="text-lg text-gray-300">${description}</div>
            <div class="text-sm text-gray-400 mt-2">
                Humidity: ${humidity}% | Wind: ${windSpeed} m/s
            </div>
        `;
    } catch (error) {
        console.error('Weather error:', error);
        if (resultDiv) {
            resultDiv.textContent = 'Error fetching weather data. Please try again.';
        }
    }
}

// Password Generator Implementation
function initPasswordGenerator() {
    const passwordCard = document.querySelector('[data-tool="password-generator"]');
    if (passwordCard) {
        passwordCard.addEventListener('click', () => {
            const passwordHTML = `
                <div class="password-generator-container p-4">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-300 mb-2">Password Length:</label>
                        <input type="range" id="password-length" min="8" max="50" value="16" class="w-full">
                        <div class="text-center text-sm text-gray-400" id="length-display">16 characters</div>
                    </div>
                    <div class="mb-4 space-y-2">
                        <label class="flex items-center">
                            <input type="checkbox" id="uppercase" checked class="mr-2">
                            <span class="text-gray-300">Uppercase letters</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" id="lowercase" checked class="mr-2">
                            <span class="text-gray-300">Lowercase letters</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" id="numbers" checked class="mr-2">
                            <span class="text-gray-300">Numbers</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" id="symbols" checked class="mr-2">
                            <span class="text-gray-300">Symbols</span>
                        </label>
                    </div>
                    <button class="w-full btn-primary mb-4" onclick="generatePassword()">Generate Password</button>
                    <div id="password-result" class="text-center"></div>
                </div>
            `;
            openModal('Password Generator', passwordHTML);
            setupPasswordGenerator();
        });
    }
}

function setupPasswordGenerator() {
    const lengthSlider = document.getElementById('password-length');
    const lengthDisplay = document.getElementById('length-display');
    
    if (lengthSlider && lengthDisplay) {
        lengthSlider.addEventListener('input', () => {
            lengthDisplay.textContent = `${lengthSlider.value} characters`;
        });
    }
}

function generatePassword() {
    const length = parseInt(document.getElementById('password-length')?.value) || 16;
    const uppercase = document.getElementById('uppercase')?.checked || false;
    const lowercase = document.getElementById('lowercase')?.checked || false;
    const numbers = document.getElementById('numbers')?.checked || false;
    const symbols = document.getElementById('symbols')?.checked || false;
    
    let chars = '';
    if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) chars += '0123456789';
    if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (!chars) {
        alert('Please select at least one character type!');
        return;
    }
    
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    const resultDiv = document.getElementById('password-result');
    if (resultDiv) {
        resultDiv.innerHTML = `
            <div class="bg-gray-800 p-4 rounded mb-2">
                <div class="text-lg font-mono text-green-400 break-all">${password}</div>
            </div>
            <button class="btn-primary" onclick="copyPassword()">Copy Password</button>
        `;
    }
}

function copyPassword() {
    const passwordElement = document.querySelector('#password-result .text-green-400');
    if (passwordElement) {
        navigator.clipboard.writeText(passwordElement.textContent).then(() => {
            alert('Password copied to clipboard!');
        }).catch(() => {
            alert('Failed to copy password');
        });
    }
}

// Color Picker Implementation
function initColorPicker() {
    const colorCard = document.querySelector('[data-tool="color-picker"]');
    if (colorCard) {
        colorCard.addEventListener('click', () => {
            const colorHTML = `
                <div class="color-picker-container p-4">
                    <div class="text-center mb-4">
                        <input type="color" id="color-input" class="w-20 h-20 rounded cursor-pointer">
                    </div>
                    <div class="text-center mb-4">
                        <div id="color-display" class="text-2xl font-bold text-purple-400">#000000</div>
                    </div>
                    <button class="w-full btn-primary" onclick="copyColor()">Copy Color Code</button>
                </div>
            `;
            openModal('Color Picker', colorHTML);
            setupColorPicker();
        });
    }
}

function setupColorPicker() {
    const colorInput = document.getElementById('color-input');
    const colorDisplay = document.getElementById('color-display');
    
    if (colorInput && colorDisplay) {
        function updateColor() {
            const color = colorInput.value;
            colorDisplay.textContent = color.toUpperCase();
            colorDisplay.style.color = color;
        }
        
        colorInput.addEventListener('input', updateColor);
        updateColor();
    }
}

function copyColor() {
    const colorDisplay = document.getElementById('color-display');
    if (colorDisplay) {
        navigator.clipboard.writeText(colorDisplay.textContent).then(() => {
            alert('Color code copied to clipboard!');
        }).catch(() => {
            alert('Failed to copy color code');
        });
    }
}

// QR Code Generator Implementation
function initQRGenerator() {
    const qrCard = document.querySelector('[data-tool="qr-generator"]');
    if (qrCard) {
        qrCard.addEventListener('click', () => {
            const qrHTML = `
                <div class="qr-generator-container p-4">
                    <input type="text" class="w-full p-2 mb-4 bg-gray-800 text-white rounded input-field" 
                        id="qr-text" placeholder="Enter text or URL">
                    <button class="w-full btn-primary" onclick="generateQR()">Generate QR Code</button>
                    <div id="qr-result" class="mt-4 text-center"></div>
                </div>
            `;
            openModal('QR Code Generator', qrHTML);
        });
    }
}

function generateQR() {
    const text = document.getElementById('qr-text')?.value;
    const qrResult = document.getElementById('qr-result');
    
    if (!text || !qrResult) {
        alert('Please enter some text or URL!');
        return;
    }
    
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
    
    qrResult.innerHTML = `
        <img src="${qrUrl}" alt="QR Code" class="mx-auto mb-4 border border-gray-600">
        <button class="btn-primary" onclick="downloadQR('${qrUrl}')">Download QR Code</button>
    `;
}

function downloadQR(qrUrl) {
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = 'qr-code.png';
    link.click();
}

// Text Analyzer Implementation
function initTextAnalyzer() {
    const analyzerCard = document.querySelector('[data-tool="text-analyzer"]');
    if (analyzerCard) {
        analyzerCard.addEventListener('click', () => {
            const analyzerHTML = `
                <div class="text-analyzer-container p-4">
                    <textarea id="analyze-text" class="w-full h-32 p-4 bg-gray-800 text-white rounded resize-none input-field" 
                        placeholder="Enter text to analyze..."></textarea>
                    <button class="w-full btn-primary mt-4" onclick="analyzeText()">Analyze Text</button>
                    <div id="analysis-result" class="mt-4 space-y-2"></div>
                </div>
            `;
            openModal('Text Analyzer', analyzerHTML);
        });
    }
}

function analyzeText() {
    const text = document.getElementById('analyze-text')?.value;
    const resultDiv = document.getElementById('analysis-result');
    
    if (!text || !resultDiv) {
        alert('Please enter some text!');
        return;
    }
    
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
    const paragraphs = text.split(/\n\s*\n/).filter(para => para.trim().length > 0).length;
    
    resultDiv.innerHTML = `
        <div class="grid grid-cols-2 gap-4 text-sm">
            <div class="bg-gray-800 p-3 rounded">
                <div class="text-purple-400 font-bold">${words.length}</div>
                <div class="text-gray-400">Words</div>
            </div>
            <div class="bg-gray-800 p-3 rounded">
                <div class="text-purple-400 font-bold">${characters}</div>
                <div class="text-gray-400">Characters</div>
            </div>
            <div class="bg-gray-800 p-3 rounded">
                <div class="text-purple-400 font-bold">${charactersNoSpaces}</div>
                <div class="text-gray-400">Characters (no spaces)</div>
            </div>
            <div class="bg-gray-800 p-3 rounded">
                <div class="text-purple-400 font-bold">${sentences}</div>
                <div class="text-gray-400">Sentences</div>
            </div>
            <div class="bg-gray-800 p-3 rounded">
                <div class="text-purple-400 font-bold">${paragraphs}</div>
                <div class="text-gray-400">Paragraphs</div>
            </div>
            <div class="bg-gray-800 p-3 rounded">
                <div class="text-purple-400 font-bold">${sentences > 0 ? Math.round((words.length / sentences) * 10) / 10 : 0}</div>
                <div class="text-gray-400">Avg words/sentence</div>
            </div>
        </div>
    `;
}

// File Converter Implementation (Basic)
function initFileConverter() {
    const converterCard = document.querySelector('[data-tool="file-converter"]');
    if (converterCard) {
        converterCard.addEventListener('click', () => {
            const converterHTML = `
                <div class="file-converter-container p-4">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-300 mb-2">Select file:</label>
                        <input type="file" id="file-input" class="w-full p-2 bg-gray-800 text-white rounded input-field">
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-300 mb-2">Convert to:</label>
                        <select id="convert-format" class="w-full p-2 bg-gray-800 text-white rounded input-field">
                            <option value="text">Text</option>
                            <option value="json">JSON</option>
                            <option value="csv">CSV</option>
                        </select>
                    </div>
                    <button class="w-full btn-primary" onclick="convertFile()">Convert File</button>
                    <div id="file-result" class="mt-4"></div>
                </div>
            `;
            openModal('File Converter', converterHTML);
        });
    }
}

function convertFile() {
    const fileInput = document.getElementById('file-input');
    const format = document.getElementById('convert-format')?.value;
    const resultDiv = document.getElementById('file-result');
    
    if (!fileInput?.files[0] || !format || !resultDiv) {
        alert('Please select a file!');
        return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const content = e.target.result;
        let convertedContent = content;
        
        if (format === 'json') {
            try {
                convertedContent = JSON.stringify(JSON.parse(content), null, 2);
            } catch (error) {
                convertedContent = JSON.stringify({ content: content }, null, 2);
            }
        } else if (format === 'csv') {
            // Simple CSV conversion
            convertedContent = content.replace(/\t/g, ',').replace(/\n/g, '\n');
        }
        
        resultDiv.innerHTML = `
            <div class="bg-gray-800 p-4 rounded">
                <h4 class="text-lg font-bold text-purple-400 mb-2">Converted Content:</h4>
                <textarea class="w-full h-32 p-2 bg-gray-700 text-white rounded resize-none" readonly>${convertedContent}</textarea>
                <button class="btn-primary mt-2" onclick="downloadConvertedFile('${convertedContent.replace(/'/g, "\\'")}', '${format}')">Download</button>
            </div>
        `;
    };
    
    reader.readAsText(file);
}

function downloadConvertedFile(content, format) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `converted.${format}`;
    link.click();
    URL.revokeObjectURL(url);
}

// Initialize all tools
document.addEventListener('DOMContentLoaded', () => {
    console.log('Shadow Monarch Arsenal initializing...');
    
    // Hide loading screen
    hideLoadingScreen();
    
    // Initialize particles with delay to ensure DOM is ready
    setTimeout(() => {
        initParticles();
    }, 100);
    
    // Initialize all tool event listeners
    initCalculator();
    initCurrencyConverter();
    initUnitConverter();
    initTimer();
    initStopwatch();
    initNotepad();
    initWeather();
    initPasswordGenerator();
    initColorPicker();
    initQRGenerator();
    initTextAnalyzer();
    initFileConverter();
    
    // Add click sound effect to tool cards
    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach(card => {
        card.addEventListener('click', () => {
            // Add click animation
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);
        });
    });
    
    console.log('Shadow Monarch Arsenal initialized successfully!');
});