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
    const clearKey = document.querySelector('.key[data-action="clear"]');
    
    // Language state
    let currentLanguage = localStorage.getItem('language') || 'en'; // Default language is English
    
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
        if (languageToggle) {
            languageToggle.textContent = languageToggle.getAttribute('data-lang-' + currentLanguage);
        }
        
        // Debug information
        console.log("Language changed to: " + currentLanguage);
        console.log("Elements updated: " + elementsToTranslate.length);
    }
    
    // Initialize language immediately
    console.log("Initializing with language: " + currentLanguage);
    updateLanguage();
    
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
    if (languageToggle) {
        languageToggle.addEventListener('click', function(event) {
            console.log("Language toggle clicked. Current language: " + currentLanguage);
            
            // Toggle between English and Turkish
            currentLanguage = currentLanguage === 'en' ? 'tr' : 'en';
            
            // Update UI
            updateLanguage();
            
            // Save language preference
            localStorage.setItem('language', currentLanguage);
            
            console.log("Language switched to: " + currentLanguage);
            
            // Prevent default behavior to avoid any issues
            event.preventDefault();
        });
    } else {
        console.error("Language toggle button not found!");
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
    
    // Add dedicated clear button handler
    if (clearKey) {
        clearKey.addEventListener('click', function() {
            clearTextInput();
            console.log("Clear button clicked directly");
        });
    } else {
        console.error("Clear button not found!");
    }
    
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
        const textArea = textInput;
        const startPos = textArea.selectionStart;
        const endPos = textArea.selectionEnd;
        
        console.log("Backspace: startPos =", startPos, "endPos =", endPos);
        
        // Handle selection deletion
        if (startPos !== endPos) {
            const textBefore = textArea.value.substring(0, startPos);
            const textAfter = textArea.value.substring(endPos);
            textArea.value = textBefore + textAfter;
            textArea.selectionStart = textArea.selectionEnd = startPos;
            textArea.focus();
            console.log("Deleted selection");
            return;
        }
        
        // Handle single character deletion (backspace)
        if (startPos > 0) {
            try {
                // Old Turkic characters are in Unicode range U+10C00 to U+10C48
                // This means they are represented as surrogate pairs in JavaScript strings
                
                // Get the full string value
                const text = textArea.value;
                
                // Calculate the position to delete from
                // We need to find the previous character boundary
                let deletePos = startPos;
                
                // Check if the character before cursor is a surrogate pair
                if (startPos >= 2) {
                    const highSurrogate = text.charCodeAt(startPos - 2);
                    const lowSurrogate = text.charCodeAt(startPos - 1);
                    
                    console.log("Checking surrogate pair at", startPos - 2, 
                                "highSurrogate =", highSurrogate.toString(16), 
                                "lowSurrogate =", lowSurrogate.toString(16));
                    
                    // Check if this is a surrogate pair (which is how Old Turkic characters are encoded)
                    const isSurrogatePair = 
                        highSurrogate >= 0xD800 && highSurrogate <= 0xDBFF &&
                        lowSurrogate >= 0xDC00 && lowSurrogate <= 0xDFFF;
                    
                    // Specifically check for Old Turkic script range (U+10C00 to U+10C48)
                    // The high surrogate for this range would be 0xD803 and the low surrogate 
                    // would start with 0xDC00 for U+10C00
                    const isOldTurkic = highSurrogate === 0xD803 && 
                                        lowSurrogate >= 0xDC00 && 
                                        lowSurrogate <= 0xDC48;
                    
                    console.log("isSurrogatePair:", isSurrogatePair, "isOldTurkic:", isOldTurkic);
                    
                    if (isSurrogatePair || isOldTurkic) {
                        // Delete both code units of the surrogate pair
                        deletePos = startPos - 2;
                        console.log("Deleting surrogate pair from position", deletePos);
                    } else {
                        // Just a regular character - delete one code unit
                        deletePos = startPos - 1;
                        console.log("Deleting regular character from position", deletePos);
                    }
                } else if (startPos === 1) {
                    // Only one character to delete
                    deletePos = 0;
                    console.log("Deleting first character");
                }
                
                // Create the new text by removing the character(s)
                const before = text.substring(0, deletePos);
                const after = text.substring(startPos);
                
                console.log("New value: before =", JSON.stringify(before), 
                            "after =", JSON.stringify(after));
                
                textArea.value = before + after;
                
                // Set the cursor position
                textArea.selectionStart = textArea.selectionEnd = deletePos;
                console.log("Cursor position set to", deletePos);
            } catch (error) {
                console.error("Error in backspace handler:", error);
                // Fallback to a simple method if the above fails
                const before = textArea.value.substring(0, startPos - 1);
                const after = textArea.value.substring(startPos);
                textArea.value = before + after;
                textArea.selectionStart = textArea.selectionEnd = startPos - 1;
                console.log("Used fallback backspace method");
            }
        }
        
        textArea.focus();
    }
    
    // Handle enter key
    function handleEnter() {
        insertTextAtCursor('\n');
        textInput.focus();
    }
    
    // Clear text input
    function clearTextInput() {
        try {
            // Clear in the DOM
            textInput.value = '';
            
            // Also clear in localStorage to ensure persistence is reset
            localStorage.removeItem('savedText');
            
            // Focus back on textarea
            textInput.focus();
            
            // Provide some feedback
            console.log("Text cleared successfully");
            
            // Dispatch input event to ensure any listeners know the content changed
            textInput.dispatchEvent(new Event('input', {
                bubbles: true,
                cancelable: true
            }));
        } catch (error) {
            console.error("Error clearing text:", error);
        }
    }
    
    // Enable physical keyboard input handling
    textInput.addEventListener('keydown', function(e) {
        console.log("Key pressed:", e.key, "keyCode:", e.keyCode);
        
        // Prevent default behavior for Tab key
        if (e.key === 'Tab') {
            e.preventDefault();
        }
        
        // Handle physical Backspace and Delete keys
        if (e.key === 'Backspace' || e.key === 'Delete' || e.keyCode === 8 || e.keyCode === 46) {
            e.preventDefault(); // Prevent default backspace/delete behavior
            console.log("Backspace/Delete key pressed - handling manually");
            handleBackspace();
            return;
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