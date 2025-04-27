document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const turkishInput = document.getElementById('turkishInput');
    const turkicOutput = document.getElementById('turkicOutput');
    const keys = document.querySelectorAll('.key');
    const characterInfo = document.getElementById('characterInfo');
    const infoTurkish = document.getElementById('infoTurkish');
    const infoTurkic = document.getElementById('infoTurkic');
    const directionToggle = document.getElementById('directionToggle');
    const exportBtn = document.getElementById('exportBtn');
    const copyBtn = document.getElementById('copyBtn');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const turkishClearKey = document.getElementById('turkishClearKey');
    const turkicShiftKey = document.getElementById('turkicShiftKey');
    const turkicCapsLockKey = document.getElementById('turkicCapsLockKey');
    const languageToggle = document.getElementById('languageToggle');
    
    // State variables
    let currentLanguage = localStorage.getItem('language') || 'en'; // Default language is English
    let turkicShiftActive = false;
    let turkicCapsLockActive = false;
    
    // Define consonant pairs for Old Turkic (thick/back - light/front)
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
        if (turkishInput.hasAttribute('data-lang-placeholder-' + currentLanguage)) {
            turkishInput.placeholder = turkishInput.getAttribute('data-lang-placeholder-' + currentLanguage);
        }
        if (turkicOutput.hasAttribute('data-lang-placeholder-' + currentLanguage)) {
            turkicOutput.placeholder = turkicOutput.getAttribute('data-lang-placeholder-' + currentLanguage);
        }
        
        // Update language toggle button text
        if (languageToggle) {
            languageToggle.textContent = languageToggle.getAttribute('data-lang-' + currentLanguage);
        }
        
        console.log("Language changed to: " + currentLanguage);
    }
    
    // Initialize language immediately
    updateLanguage();
    
    // Initialize text directions
    turkishInput.style.direction = 'ltr'; // Turkish input is left-to-right
    turkicOutput.style.direction = 'rtl'; // Old Turkic output is right-to-left
    
    // Turkish to Old Turkic character mapping
    const turkishToTurkic = {
        // Vowels
        'a': '𐰀', 'e': '𐰀', 
        'ı': '𐰃', 'i': '𐰃',
        'o': '𐰆', 'u': '𐰆',
        'ö': '𐰇', 'ü': '𐰇',
        
        // Consonants
        'b': '𐰉', 'p': '𐰯',
        'd': '𐰑', 't': '𐱃',
        'g': '𐰍', 'k': '𐰴', 
        'ç': '𐰲', 
        'l': '𐰞', 'm': '𐰢',
        'n': '𐰣', 'r': '𐰺',
        's': '𐰽', 'ş': '𐱁',
        'y': '𐰖', 'z': '𐰔',
        
        // Letters not in Köktürk script with their replacements
        'c': '𐰲',    // c → ç (using the ç symbol)
        'f': '𐰉',    // f → b
        'ğ': '𐰍',    // ğ → g
        'h': '𐰴',    // h → k
        'j': '𐰖',    // j → y
        
        // Combined sound characters
        'ık': '𐰶', 'kı': '𐰶',    // ık/kı combined character
        'iç': '𐰱', 'çi': '𐰱',    // iç/çi combined character
        'ok': '𐰸', 'uk': '𐰸',    // ok/uk combined character
        'ök': '𐰰', 'ük': '𐰰',    // ök/ük combined character
        'ld': '𐰡', 'lt': '𐰡',    // ld/lt combined character
        'nd': '𐰦', 'nt': '𐰦',    // nd/nt combined character
        'nç': '𐰨',                // nç combined character
        'ng': '𐰭',                // ng combined character
        'ny': '𐰪',                // ny combined character
        
        // Special character for word separation
        ' ': ':'
    };
    
    // Vowel groups for the dropping rule
    const vowelGroups = {
        'a': ['a', 'e'],  // Front vowels
        'e': ['a', 'e'],
        'ı': ['ı', 'i'],  // High vowels
        'i': ['ı', 'i'],
        'o': ['o', 'u'],  // Back rounded vowels
        'u': ['o', 'u'],
        'ö': ['ö', 'ü'],  // Front rounded vowels
        'ü': ['ö', 'ü']
    };
    
    // Number to Turkish word mapping
    const numberToTurkishWord = {
        '0': 'sıfır',
        '1': 'bir',
        '2': 'iki',
        '3': 'üç',
        '4': 'dört',
        '5': 'beş',
        '6': 'altı',
        '7': 'yedi',
        '8': 'sekiz',
        '9': 'dokuz',
        '10': 'on',
        '20': 'yirmi',
        '30': 'otuz',
        '40': 'kırk',
        '50': 'elli',
        '60': 'altmış',
        '70': 'yetmiş',
        '80': 'seksen',
        '90': 'doksan',
        '100': 'yüz',
        '1000': 'bin',
        '1000000': 'milyon',
        '1000000000': 'milyar',
        '1000000000000': 'trilyon'
    };
    
    // Function to convert numbers to Turkish words
    function convertNumbersToWords(text) {
        // Regular expression to match numbers in text
        return text.replace(/\b\d+\b/g, function(match) {
            const num = parseInt(match, 10);
            
            // Don't convert numbers larger than one trillion
            if (num > 999999999999) {
                return match;
            }
            
            return convertNumberToTurkishWord(num);
        });
    }
    
    // Convert a single number to Turkish word
    function convertNumberToTurkishWord(num) {
        // Handle 0
        if (num === 0) return numberToTurkishWord['0'];
        
        let result = '';
        
        // Handle trillions (1 - 999 trillion)
        if (num >= 1000000000000) {
            const trillions = Math.floor(num / 1000000000000);
            // For exactly 1 trillion, use "bir trilyon"
            if (trillions === 1) {
                result += 'bir ';
            } else {
                // For values like 52 trillion, use "elli iki trilyon"
                result += convertThreeDigitNumber(trillions) + ' ';
            }
            result += 'trilyon ';
            num %= 1000000000000;
        }
        
        // Handle billions (1 - 999 billion)
        if (num >= 1000000000) {
            const billions = Math.floor(num / 1000000000);
            // For exactly 1 billion, use "bir milyar"
            if (billions === 1) {
                result += 'bir ';
            } else {
                // For values like 52 billion, use "elli iki milyar"
                result += convertThreeDigitNumber(billions) + ' ';
            }
            result += 'milyar ';
            num %= 1000000000;
        }
        
        // Handle millions (1 - 999 million)
        if (num >= 1000000) {
            const millions = Math.floor(num / 1000000);
            // For exactly 1 million, use "bir milyon"
            if (millions === 1) {
                result += 'bir ';
            } else {
                // For values like 52 million, use "elli iki milyon"
                result += convertThreeDigitNumber(millions) + ' ';
            }
            result += 'milyon ';
            num %= 1000000;
        }
        
        // Handle thousands (1 - 999 thousand)
        if (num >= 1000) {
            const thousands = Math.floor(num / 1000);
            // Special case: "bin" (not "bir bin") for exactly 1000
            if (thousands === 1) {
                result += '';  // Just "bin", no "bir" prefix
            } else {
                // For values like 52 thousand, use "elli iki bin"
                result += convertThreeDigitNumber(thousands) + ' ';
            }
            result += 'bin ';
            num %= 1000;
        }
        
        // Handle remaining 1-999
        if (num > 0) {
            result += convertThreeDigitNumber(num);
        }
        
        return result.trim();
    }
    
    // Helper function to convert a three-digit number (1-999)
    function convertThreeDigitNumber(num) {
        if (num === 0) return '';
        let result = '';
        
        // Handle hundreds (100-999)
        if (num >= 100) {
            const hundreds = Math.floor(num / 100);
            // Special case: "yüz" (not "bir yüz") for exactly 100
            if (hundreds === 1) {
                result += '';  // Just "yüz", no "bir" prefix
            } else {
                result += numberToTurkishWord[hundreds.toString()] + ' ';
            }
            result += 'yüz ';
            num %= 100;
        }
        
        // Handle tens (10-99)
        if (num >= 10) {
            const tens = Math.floor(num / 10) * 10;
            result += numberToTurkishWord[tens.toString()] + ' ';
            num %= 10;
        }
        
        // Handle ones (1-9)
        if (num > 0) {
            result += numberToTurkishWord[num.toString()];
        }
        
        return result.trim();
    }
    
    // Store original characters of Old Turkic keys for toggling
    const originalChars = {};
    const turkicKeys = document.querySelectorAll('#turkicKeyboard .key');
    turkicKeys.forEach(key => {
        const char = key.getAttribute('data-char');
        if (char) {
            originalChars[key.getAttribute('data-char')] = {
                character: char,
                title: key.getAttribute('title')
            };
        }
    });
    
    // Function to translate Turkish text to Old Turkic
    function translateToTurkic(text) {
        if (!text) return '';
        
        // Convert numbers to Turkish words
        text = convertNumbersToWords(text);
        
        // Convert to lowercase for consistent mapping
        text = text.toLowerCase();
        
        // Split text into words and process each word
        const words = text.split(/\s+/);
        let result = '';
        
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            if (word.trim() === '') continue;
            
            // Add word separator
            if (i > 0) result += turkishToTurkic[' '];
            
            // Apply vowel dropping rule and translate word
            result += translateWordWithVowelDropping(word);
        }
        
        return result;
    }
    
    // Function to translate a single word with vowel dropping rule
    function translateWordWithVowelDropping(word) {
        let result = '';
        let lastVowel = null;
        let firstAEFound = false;
        let i = 0;
        let syllableCount = 0;
        
        // Find syllables in the word
        const syllables = [];
        let currentSyllable = '';
        let hasVowel = false;
        
        for (let j = 0; j < word.length; j++) {
            const char = word[j];
            currentSyllable += char;
            
            // Check if current character is a vowel
            if ('aeıioöuü'.includes(char)) {
                hasVowel = true;
                
                // If we already have a vowel and find another one, it's a new syllable
                if (currentSyllable.length > 1 && 'aeıioöuü'.split('').filter(v => currentSyllable.includes(v)).length > 1) {
                    // Remove the current character, it belongs to the next syllable
                    currentSyllable = currentSyllable.slice(0, -1);
                    syllables.push(currentSyllable);
                    currentSyllable = char;
                    hasVowel = true;
                }
            } else if (hasVowel && j < word.length - 1 && 
                      !('aeıioöuü'.includes(word[j+1])) && 
                      currentSyllable.length > 1) {
                // If we have a vowel followed by two consonants, split after the first consonant
                syllables.push(currentSyllable);
                currentSyllable = '';
                hasVowel = false;
            }
        }
        
        // Add the last syllable if it has content
        if (currentSyllable) {
            syllables.push(currentSyllable);
        }
        
        // Process the word with syllable awareness
        while (i < word.length) {
            // Check for three-character combinations first
            if (i < word.length - 2) {
                const threeChars = word.substring(i, i + 3);
                if (turkishToTurkic[threeChars]) {
                    result += turkishToTurkic[threeChars];
                    i += 3;
                    continue;
                }
            }
            
            // Check for two-character combinations next
            if (i < word.length - 1) {
                const twoChars = word.substring(i, i + 2);
                if (turkishToTurkic[twoChars]) {
                    result += turkishToTurkic[twoChars];
                    i += 2;
                    continue;
                }
            }
            
            // Process single character
            const char = word[i];
            
            // Skip punctuation
            if (/[.,!?;:'"(){}\[\]<>\/\\|@#$%^&*_=+\-`~]/.test(char)) {
                i++;
                continue;
            }
            
            // Check if it's a vowel
            if ('aeıioöuü'.includes(char)) {
                // Exception: always write vowels at the end of the word
                const isLastLetter = (i === word.length - 1);
                
                // Rule 1: a/e in first syllable is never written
                const isFirstSyllableAE = !firstAEFound && (char === 'a' || char === 'e');
                
                // Find current syllable position
                let currentSyllableIndex = 0;
                let charPosition = 0;
                for (let s = 0; s < syllables.length; s++) {
                    if (charPosition + syllables[s].length > i) {
                        currentSyllableIndex = s;
                        break;
                    }
                    charPosition += syllables[s].length;
                }
                
                // Set first A/E found flag if this is the first a/e
                if (char === 'a' || char === 'e') {
                    if (!firstAEFound) {
                        firstAEFound = true;
                    }
                    
                    // Rule: Skip a/e in first syllable
                    if (currentSyllableIndex === 0) {
                        i++;
                        continue;
                    }
                }
                
                // Apply the vowel dropping rule with all exceptions
                if (!isLastLetter && (
                    // Drop a/e if the last vowel was a/e (unless another vowel has appeared)
                    ((char === 'a' || char === 'e') && lastVowel && (lastVowel === 'a' || lastVowel === 'e')) ||
                    // Apply standard vowel dropping for other vowel types
                    (char !== 'a' && char !== 'e' && lastVowel && vowelGroups[char].includes(lastVowel))
                )) {
                    // Skip this vowel (don't add to result)
                    i++;
                    continue;
                }
                
                // For non-a/e vowels, or when exceptions apply, record this vowel
                lastVowel = char;
            }
            
            // Translate and add character
            if (turkishToTurkic[char]) {
                result += turkishToTurkic[char];
            } else if (!/\d/.test(char)) {
                result += char;
            }
            
            i++;
        }
        
        return result;
    }
    
    // Update Turkic output whenever Turkish input changes
    turkishInput.addEventListener('input', function() {
        // Convert newlines to word separator + newline in the output
        const inputText = turkishInput.value;
        let outputText = '';
        
        // Split by newlines and process each line
        const lines = inputText.split('\n');
        for (let i = 0; i < lines.length; i++) {
            // Translate each line
            const translatedLine = translateToTurkic(lines[i]);
            
            // Add to output with line breaks
            if (i > 0) {
                outputText += '\n';
            }
            outputText += translatedLine;
        }
        
        turkicOutput.value = outputText;
        
        // Save text to localStorage
        localStorage.setItem('savedTurkishText', turkishInput.value);
        localStorage.setItem('savedTurkicText', turkicOutput.value);
    });
    
    // Function to update Old Turkic keyboard display when shift or caps lock is active
    function updateTurkicKeyboardDisplay() {
        turkicKeys.forEach(key => {
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
    
    // Function to reset Old Turkic keyboard display
    function resetTurkicKeyboardDisplay() {
        turkicKeys.forEach(key => {
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
    
    // Process each key in the Turkish keyboard
    const turkishKeys = document.querySelectorAll('#turkishKeyboard .key');
    turkishKeys.forEach(key => {
        const char = key.getAttribute('data-char');
        const action = key.getAttribute('data-action');
        
        if (char && char.trim() !== '') {
            key.textContent = char;
        }
        
        // Show character info on hover
        key.addEventListener('mouseover', function() {
            const char = this.getAttribute('data-char');
            if (char && char.trim() !== '') {
                // Skip for non-translatable keys like Enter, Backspace, etc.
                if (char === ' ') {
                    infoTurkish.textContent = 'Space';
                    infoTurkic.textContent = ':';
                } else {
                    const turkicChar = turkishToTurkic[char.toLowerCase()] || 'N/A';
                    infoTurkish.textContent = char;
                    infoTurkic.textContent = turkicChar;
                }
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
                insertTextAtCursor(turkishInput, char);
                // Trigger input event to update translation
                turkishInput.dispatchEvent(new Event('input'));
            } else if (action === 'backspace') {
                handleBackspace(turkishInput);
            } else if (action === 'clear') {
                clearTextInput();
            } else if (action === 'enter') {
                insertTextAtCursor(turkishInput, '\n');
                // Trigger input event to update translation
                turkishInput.dispatchEvent(new Event('input'));
            }
        });
    });
    
    // Process each key in the Old Turkic keyboard
    turkicKeys.forEach(key => {
        const char = key.getAttribute('data-char');
        const action = key.getAttribute('data-action');
        
        if (char && char.trim() !== '') {
            key.textContent = char;
        }
        
        // Show character info on hover
        key.addEventListener('mouseover', function() {
            const char = this.getAttribute('data-char');
            const title = this.getAttribute('title');
            
            if (char && char.trim() !== '' && !action) {
                const unicode = char.codePointAt(0).toString(16).toUpperCase();
                infoTurkish.textContent = title || '';
                infoTurkic.textContent = char;
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
            
            if (char && !action) {
                insertTextAtCursor(turkicOutput, char);
            } else if (action === 'shift') {
                // Only toggle shift if caps lock is not active
                if (!turkicCapsLockActive) {
                    turkicShiftActive = !turkicShiftActive;
                    if (turkicShiftActive) {
                        turkicShiftKey.classList.add('active');
                        updateTurkicKeyboardDisplay();
                    } else {
                        turkicShiftKey.classList.remove('active');
                        resetTurkicKeyboardDisplay();
                    }
                }
            } else if (action === 'capslock') {
                turkicCapsLockActive = !turkicCapsLockActive;
                
                if (turkicCapsLockActive) {
                    turkicCapsLockKey.classList.add('active');
                    // If shift was active, deactivate it
                    turkicShiftActive = false;
                    turkicShiftKey.classList.remove('active');
                    // Update keyboard to caps lock state
                    updateTurkicKeyboardDisplay();
                } else {
                    turkicCapsLockKey.classList.remove('active');
                    resetTurkicKeyboardDisplay();
                }
            } else if (action === 'backspace') {
                handleBackspace(turkicOutput);
            } else if (action === 'clear') {
                turkicOutput.value = '';
                turkicOutput.focus();
            } else if (action === 'enter') {
                insertTextAtCursor(turkicOutput, '\n');
            }
        });
    });
    
    // Insert text at cursor position
    function insertTextAtCursor(textArea, text) {
        const cursorPos = textArea.selectionStart;
        const textBefore = textArea.value.substring(0, cursorPos);
        const textAfter = textArea.value.substring(textArea.selectionEnd);
        textArea.value = textBefore + text + textAfter;
        
        // Move cursor position after inserted character
        textArea.selectionStart = cursorPos + text.length;
        textArea.selectionEnd = cursorPos + text.length;
        textArea.focus();
    }
    
    // Handle backspace action
    function handleBackspace(textArea) {
        const startPos = textArea.selectionStart;
        const endPos = textArea.selectionEnd;
        
        // Handle selection deletion
        if (startPos !== endPos) {
            const textBefore = textArea.value.substring(0, startPos);
            const textAfter = textArea.value.substring(endPos);
            textArea.value = textBefore + textAfter;
            textArea.selectionStart = textArea.selectionEnd = startPos;
        }
        // Handle single character deletion
        else if (startPos > 0) {
            // Check for surrogate pairs (Old Turkic characters)
            if (startPos >= 2 && textArea === turkicOutput) {
                const text = textArea.value;
                const highSurrogate = text.charCodeAt(startPos - 2);
                const lowSurrogate = text.charCodeAt(startPos - 1);
                
                // Check if this is a surrogate pair (which is how Old Turkic characters are encoded)
                const isSurrogatePair = 
                    highSurrogate >= 0xD800 && highSurrogate <= 0xDBFF &&
                    lowSurrogate >= 0xDC00 && lowSurrogate <= 0xDFFF;
                
                if (isSurrogatePair) {
                    // Delete both code units of the surrogate pair
                    const textBefore = text.substring(0, startPos - 2);
                    const textAfter = text.substring(startPos);
                    textArea.value = textBefore + textAfter;
                    textArea.selectionStart = textArea.selectionEnd = startPos - 2;
                    textArea.focus();
                    return;
                }
            }
            
            // Standard backspace for non-surrogate pairs
            const textBefore = textArea.value.substring(0, startPos - 1);
            const textAfter = textArea.value.substring(startPos);
            textArea.value = textBefore + textAfter;
            textArea.selectionStart = textArea.selectionEnd = startPos - 1;
        }
        
        textArea.focus();
        
        // Trigger input event if this is the Turkish input
        if (textArea === turkishInput) {
            textArea.dispatchEvent(new Event('input'));
        }
    }
    
    // Clear text input
    function clearTextInput() {
        turkishInput.value = '';
        turkicOutput.value = '';
        
        // Clear in localStorage
        localStorage.removeItem('savedTurkishText');
        localStorage.removeItem('savedTurkicText');
        
        // Focus on input textarea
        turkishInput.focus();
    }
    
    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    
    // Toggle text direction for the output
    directionToggle.addEventListener('click', function() {
        if (turkicOutput.style.direction === 'ltr') {
            turkicOutput.style.direction = 'rtl';
        } else {
            turkicOutput.style.direction = 'ltr';
        }
    });
    
    // Toggle dark mode
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        // Save preference
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });
    
    // Copy translated text to clipboard
    copyBtn.addEventListener('click', function() {
        const text = turkicOutput.value;
        if (text.trim() === '') {
            alert('Please enter some text first.');
            return;
        }
        
        // Add RTL mark for proper copying
        const rtlText = '\u200F' + text;
        
        navigator.clipboard.writeText(rtlText)
            .then(() => {
                // Visual feedback
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
    
    // Export translated text
    exportBtn.addEventListener('click', function() {
        const text = turkicOutput.value;
        if (text.trim() === '') {
            alert('Please enter some text first.');
            return;
        }
        
        // Create download link
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'koturkce-translation.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    
    // Language toggle functionality
    languageToggle.addEventListener('click', function() {
        // Toggle between English and Turkish
        currentLanguage = currentLanguage === 'en' ? 'tr' : 'en';
        
        // Update UI
        updateLanguage();
        
        // Save language preference
        localStorage.setItem('language', currentLanguage);
    });
    
    // Handle physical keyboard input for special keys
    turkishInput.addEventListener('keydown', function(e) {
        // Handle Enter/Return key
        if (e.key === 'Enter') {
            // Let the default behavior happen to add the line break
            // The input event will handle the translation
        }
    });
    
    // Double-click handler for shift key to toggle caps lock mode
    turkicShiftKey.addEventListener('dblclick', function() {
        turkicCapsLockActive = !turkicCapsLockActive;
        turkicShiftActive = false;
        
        if (turkicCapsLockActive) {
            turkicCapsLockKey.classList.add('active');
            turkicShiftKey.classList.remove('active');
            updateTurkicKeyboardDisplay();
        } else {
            turkicCapsLockKey.classList.remove('active');
            resetTurkicKeyboardDisplay();
        }
    });
    
    // Load saved text if available
    if (localStorage.getItem('savedTurkishText')) {
        turkishInput.value = localStorage.getItem('savedTurkishText');
        turkicOutput.value = localStorage.getItem('savedTurkicText');
    }
}); 