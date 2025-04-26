document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const textInput = document.getElementById('textInput');
    const keys = document.querySelectorAll('.key');
    const characterInfo = document.getElementById('characterInfo');
    const infoChar = document.getElementById('infoChar');
    const infoPhonetic = document.getElementById('infoPhonetic');
    const infoUnicode = document.getElementById('infoUnicode');
    const directionToggle = document.getElementById('directionToggle');
    const exportBtn = document.getElementById('exportBtn');
    const copyBtn = document.getElementById('copyBtn');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const shiftKey = document.getElementById('shiftKey');
    const capsLockKey = document.getElementById('capsLockKey');
    const languageToggle = document.getElementById('languageToggle');
    
    // Language state
    let currentLanguage = 'en'; // Default language is English
    
    // Initialize text direction
    textInput.style.direction = 'rtl';
    
    // Shift and caps lock state
    let shiftActive = false;
    let capsLockActive = false;
    
    // Define consonant pairs (thick/back - light/front)
    const consonantPairs = {
        '𐰉': '𐰋', '𐰋': '𐰉',     // b pair
        '𐰑': '𐰓', '𐰓': '𐰑',     // d pair
        '𐰍': '𐰏', '𐰏': '𐰍',     // g pair
        '𐰴': '𐰚', '𐰚': '𐰴',     // k/q pair
        '𐰞': '𐰠', '𐰠': '𐰞',     // l pair
        '𐰣': '𐰤', '𐰤': '𐰣',     // n pair
        '𐰺': '𐰼', '𐰼': '𐰺',     // r pair
        '𐰽': '𐰾', '𐰾': '𐰽',     // s pair
        '𐱃': '𐱅', '𐱅': '𐱃',     // t pair
        '𐰖': '𐰘', '𐰘': '𐰖'      // y pair
    };
    
    // Store original characters of keys for toggling
    const originalChars = {};
    keys.forEach(key => {
        const char = key.getAttribute('data-char');
        if (char) {
            originalChars[key.getAttribute('data-char')] = {
                character: char,
                title: key.getAttribute('title')
            };
        }
    });
    
    // Language toggle functionality
    languageToggle.addEventListener('click', function() {
        // Toggle between English and Turkish
        currentLanguage = currentLanguage === 'en' ? 'tr' : 'en';
        updateLanguage();
        
        // Save language preference
        localStorage.setItem('language', currentLanguage);
    });
    
    // Function to update all translated elements based on current language
    function updateLanguage() {
        // Update document language
        document.documentElement.lang = currentLanguage;
        
        // Update all elements with data-lang attributes
        const elementsToTranslate = document.querySelectorAll('[data-lang-' + currentLanguage + ']');
        elementsToTranslate.forEach(element => {
            const translatedText = element.getAttribute('data-lang-' + currentLanguage);
            if (translatedText) {
                element.textContent = translatedText;
            }
        });
        
        // Update textarea placeholder
        if (textInput.hasAttribute('data-lang-placeholder-' + currentLanguage)) {
            textInput.placeholder = textInput.getAttribute('data-lang-placeholder-' + currentLanguage);
        }
        
        // Update language toggle button text
        languageToggle.textContent = languageToggle.getAttribute('data-lang-' + currentLanguage);
    }
    
    // Check for saved language preference
    if (localStorage.getItem('language')) {
        currentLanguage = localStorage.getItem('language');
        updateLanguage();
    }
    
    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    
    // Toggle text direction
    directionToggle.addEventListener('click', function() {
        if (textInput.style.direction === 'ltr') {
            textInput.style.direction = 'rtl';
        } else {
            textInput.style.direction = 'ltr';
        }
    });
    
    // Toggle dark mode
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        // Save preference
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });
    
    // Toggle shift state
    shiftKey.addEventListener('click', function() {
        // Only toggle shift if caps lock is not active
        if (!capsLockActive) {
            shiftActive = !shiftActive;
            if (shiftActive) {
                shiftKey.classList.add('active');
                updateKeyboardDisplay();
            } else {
                shiftKey.classList.remove('active');
                resetKeyboardDisplay();
            }
        }
    });
    
    // Toggle caps lock state
    capsLockKey.addEventListener('click', function() {
        capsLockActive = !capsLockActive;
        
        if (capsLockActive) {
            capsLockKey.classList.add('active');
            // If shift was active, deactivate it
            shiftActive = false;
            shiftKey.classList.remove('active');
            // Update keyboard to caps lock state
            updateKeyboardDisplay();
        } else {
            capsLockKey.classList.remove('active');
            resetKeyboardDisplay();
        }
    });
    
    // Function to update keyboard display when shift or caps lock is active
    function updateKeyboardDisplay() {
        keys.forEach(key => {
            const char = key.getAttribute('data-char');
            if (char && consonantPairs[char]) {
                // Change the visual appearance of the key
                key.textContent = consonantPairs[char];
                
                // Update the title attribute to show shift variant phonetic value
                const currentTitle = key.getAttribute('title');
                if (currentTitle && currentTitle.includes('¹')) {
                    key.setAttribute('title', currentTitle.replace('¹', '²'));
                } else if (currentTitle && currentTitle.includes('²')) {
                    key.setAttribute('title', currentTitle.replace('²', '¹'));
                }
                
                // Also update the data-char attribute for hover info
                const originalChar = key.getAttribute('data-char');
                key.setAttribute('data-char-original', originalChar);
                key.setAttribute('data-char', consonantPairs[char]);
            }
        });
    }
    
    // Function to reset keyboard display
    function resetKeyboardDisplay() {
        keys.forEach(key => {
            const originalChar = key.getAttribute('data-char-original');
            if (originalChar) {
                // Reset the key text
                key.textContent = originalChar;
                key.setAttribute('data-char', originalChar);
                key.removeAttribute('data-char-original');
                
                // Reset the title
                const currentTitle = key.getAttribute('title');
                if (currentTitle && currentTitle.includes('¹')) {
                    key.setAttribute('title', currentTitle.replace('¹', '²'));
                } else if (currentTitle && currentTitle.includes('²')) {
                    key.setAttribute('title', currentTitle.replace('²', '¹'));
                }
            } else {
                // For keys that didn't change
                const char = key.getAttribute('data-char');
                if (char) {
                    key.textContent = char;
                }
            }
        });
    }
    
    // Copy text to clipboard
    copyBtn.addEventListener('click', function() {
        const text = textInput.value;
        if (text.trim() === '') {
            alert('Please enter some text first.');
            return;
        }
        
        // Use the Clipboard API to copy text
        navigator.clipboard.writeText(text)
            .then(() => {
                // Visual feedback - temporarily change button text
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 1500);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                alert('Failed to copy text. Your browser may not support this feature.');
            });
    });
    
    // Export text
    exportBtn.addEventListener('click', function() {
        const text = textInput.value;
        if (text.trim() === '') {
            alert('Please enter some text first.');
            return;
        }
        
        // Create a blob and download link
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'koturkce-text.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    
    // Process each key
    keys.forEach(key => {
        // Initialize key text to match data-char
        const char = key.getAttribute('data-char');
        if (char && char.trim() !== '') {
            key.textContent = char;
        }
        
        // Show character info on hover
        key.addEventListener('mouseover', function() {
            const char = this.getAttribute('data-char');
            if (char && char.trim() !== '') {
                const phoneticValue = this.getAttribute('title') || '';
                const unicode = char.codePointAt(0).toString(16).toUpperCase();
                
                infoChar.textContent = char;
                infoPhonetic.textContent = phoneticValue;
                infoUnicode.textContent = 'U+' + unicode;
                characterInfo.style.display = 'block';
            }
        });
        
        // Hide character info when mouse leaves
        key.addEventListener('mouseout', function() {
            characterInfo.style.display = 'none';
        });
        
        // Handle key clicks
        key.addEventListener('click', function() {
            const char = this.getAttribute('data-char');
            const action = this.getAttribute('data-action');
            
            if (char) {
                insertTextAtCursor(char);
                
                // Turn off shift after one use if not in caps lock mode
                if (shiftActive && !capsLockActive) {
                    shiftActive = false;
                    shiftKey.classList.remove('active');
                    resetKeyboardDisplay();
                }
            } else if (action === 'backspace') {
                handleBackspace();
            } else if (action === 'enter') {
                handleEnter();
            } else if (action === 'clear') {
                clearTextInput();
            }
        });
    });
    
    // Insert text at cursor position
    function insertTextAtCursor(text) {
        const cursorPos = textInput.selectionStart;
        const textBefore = textInput.value.substring(0, cursorPos);
        const textAfter = textInput.value.substring(textInput.selectionEnd);
        textInput.value = textBefore + text + textAfter;
        
        // Move cursor position after inserted character
        textInput.selectionStart = cursorPos + text.length;
        textInput.selectionEnd = cursorPos + text.length;
        textInput.focus();
    }
    
    // Handle backspace action
    function handleBackspace() {
        const cursorPos = textInput.selectionStart;
        if (cursorPos > 0) {
            const textBefore = textInput.value.substring(0, cursorPos - 1);
            const textAfter = textInput.value.substring(textInput.selectionEnd);
            textInput.value = textBefore + textAfter;
            
            // Move cursor position back
            textInput.selectionStart = cursorPos - 1;
            textInput.selectionEnd = cursorPos - 1;
        }
        textInput.focus();
    }
    
    // Handle enter key
    function handleEnter() {
        insertTextAtCursor('\n');
        textInput.focus();
    }
    
    // Clear text input
    function clearTextInput() {
        textInput.value = '';
        textInput.focus();
    }
    
    // Enable physical keyboard input handling
    textInput.addEventListener('keydown', function(e) {
        // Prevent default behavior for Tab key
        if (e.key === 'Tab') {
            e.preventDefault();
        }
        
        // Physical keyboard shift key handling
        if (e.key === 'Shift' && !e.repeat) {
            // Only activate shift if caps lock is not active
            if (!capsLockActive) {
                shiftActive = true;
                shiftKey.classList.add('active');
                updateKeyboardDisplay();
            }
        }
        
        // Physical keyboard caps lock handling
        if (e.getModifierState('CapsLock')) {
            // If caps lock state changed to active
            if (!capsLockActive) {
                capsLockActive = true;
                capsLockKey.classList.add('active');
                // Deactivate shift if it was active
                shiftActive = false;
                shiftKey.classList.remove('active');
                updateKeyboardDisplay();
            }
        } else {
            // If caps lock state changed to inactive
            if (capsLockActive) {
                capsLockActive = false;
                capsLockKey.classList.remove('active');
                resetKeyboardDisplay();
            }
        }
        
        // Convert space key press to colon (Old Turkic word separator)
        if (e.key === ' ') {
            e.preventDefault();
            insertTextAtCursor(':');
        }
    });
    
    // Turn off shift on keyup of Shift key (but not in caps lock mode)
    textInput.addEventListener('keyup', function(e) {
        if (e.key === 'Shift' && !capsLockActive) {
            shiftActive = false;
            shiftKey.classList.remove('active');
            resetKeyboardDisplay();
        }
    });
    
    // Save text to localStorage when typing
    textInput.addEventListener('input', function() {
        localStorage.setItem('savedText', textInput.value);
    });
    
    // Load saved text if available
    if (localStorage.getItem('savedText')) {
        textInput.value = localStorage.getItem('savedText');
    }
});