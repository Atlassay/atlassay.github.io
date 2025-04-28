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
    
    // Vowel categories for consonant selection
    const backVowels = ['a', 'ı', 'o', 'u'];     // Thick (velar) consonants
    const frontVowels = ['e', 'i', 'ö', 'ü'];    // Thin (palatal) consonants
    
    // Define back (thick) consonants
    const backConsonants = ['𐰉', '𐰑', '𐰍', '𐰴', '𐰞', '𐰣', '𐰺', '𐰽', '𐱃', '𐰖'];
    
    // Define front (thin) consonants
    const frontConsonants = ['𐰋', '𐰓', '𐰏', '𐰚', '𐰠', '𐰤', '𐰼', '𐰾', '𐱅', '𐰘'];
    
    // Define consonant pairs for combined characters
    const combinedCharacterPairs = {
        // These are example pairs - would need to be verified with actual Köktürk combined characters
        '𐰶': '𐰶', // No pair for ık/kı
        '𐰱': '𐰱', // No pair for iç/çi
        '𐰸': '𐰰', '𐰰': '𐰸', // ok/uk <-> ök/ük
        '𐰡': '𐰡', // No pair for ld/lt
        '𐰦': '𐰦', // No pair for nd/nt
        '𐰨': '𐰨', // No pair for nç
        '𐰭': '𐰭', // No pair for ng
        '𐰪': '𐰪'  // No pair for ny
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
        'ko': '𐰸', 'ku': '𐰸',    // ko/ku combined character (alternate direction)
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
            
            // Process the word in a different way to handle combined characters better
            result += processWordWithCombinedChars(word);
        }
        
        return result;
    }
    
    // New function to process words with better combined character handling
    function processWordWithCombinedChars(word) {
        // First, check for combined letter sounds in the entire word
        const combinedPatterns = [
            { pattern: 'ny', char: '𐰪' },
            { pattern: 'ng', char: '𐰭' },
            { pattern: 'nç', char: '𐰨' },
            { pattern: 'nd', char: '𐰦' },
            { pattern: 'nt', char: '𐰦' },
            { pattern: 'ld', char: '𐰡' },
            { pattern: 'lt', char: '𐰡' },
            { pattern: 'ok', char: '𐰸' },
            { pattern: 'uk', char: '𐰸' },
            { pattern: 'ök', char: '𐰰' },
            { pattern: 'ük', char: '𐰰' },
            { pattern: 'ık', char: '𐰶' },
            { pattern: 'kı', char: '𐰶' },
            { pattern: 'iç', char: '𐰱' },
            { pattern: 'çi', char: '𐰱' }
        ];

        // Replace combined patterns first
        let processedWord = word;
        for (const { pattern, char } of combinedPatterns) {
            processedWord = processedWord.replace(new RegExp(pattern, 'g'), char);
        }

        // Now divide the processed word into syllables
        const syllables = divideTurkishWordIntoSyllables(processedWord);
        
        // Apply vowel dropping rules and consonant harmony
        let result = '';
        let lastVowel = null;
        let firstAEFound = false;
        
        for (let s = 0; s < syllables.length; s++) {
            const syllable = syllables[s];
            let syllableResult = '';
            let syllableVowel = null;
            
            // Find the vowel in this syllable
            for (let i = 0; i < syllable.length; i++) {
                const char = syllable[i];
                if ('aeıioöuü'.includes(char)) {
                    syllableVowel = char;
                    break;
                }
            }
            
            // Process each character in the syllable
            for (let i = 0; i < syllable.length; i++) {
                const char = syllable[i];
                
                // Skip all punctuation marks
                if (/[.,!?;:'"(){}\[\]<>\/\\|@#$%^&*_=+\-`~´'«»‹›„"""‘'‚'‛'′″‴‵‶‷⁅⁆〈〉⸢⸣⸤⸥⟦⟧⟨⟩⟪⟫⟬⟭⟮⟯⦃⦄⦅⦆⦇⦈⦉⦊⦋⦌⦍⦎⦏⦐⦑⦒⦓⦔⦕⦖⦗⦘⸨⸩⸪⸫⸬⸭⸮ⸯ⸰⸱⸲⸳⸴⸵⸶⸷⸸⸹⸺⸻⸼⸽⸾⸿⹀⹁⹂⹃⹄⹅⹆⹇⹈⹉⹊⹋⹌⹍⹎⹏]/.test(char)) {
                    continue;
                }
                
                if ('aeıioöuü'.includes(char)) {
                    // Handle vowels
                    // Rule 1: a/e in first syllable is never written
                    const isFirstSyllableAE = (s === 0) && (char === 'a' || char === 'e');
                    if (isFirstSyllableAE) {
                        if (!firstAEFound) {
                            firstAEFound = true;
                        }
                        continue;
                    }
                    
                    // Apply vowel dropping rule
                    if (lastVowel && (
                        ((char === 'a' || char === 'e') && (lastVowel === 'a' || lastVowel === 'e')) ||
                        (char !== 'a' && char !== 'e' && vowelGroups[char].includes(lastVowel))
                    )) {
                        continue;
                    }
                    
                    lastVowel = char;
                    syllableResult += turkishToTurkic[char];
                } else {
                    // Handle consonants
                    if (turkishToTurkic[char]) {
                        let turkicChar = turkishToTurkic[char];
                        
                        // Apply consonant shift based on syllable vowel
                        if (syllableVowel && consonantPairs[turkicChar]) {
                            if (frontVowels.includes(syllableVowel)) {
                                if (backConsonants.includes(turkicChar)) {
                                    turkicChar = consonantPairs[turkicChar];
                                }
                            } else if (backVowels.includes(syllableVowel)) {
                                if (frontConsonants.includes(turkicChar)) {
                                    turkicChar = consonantPairs[turkicChar];
                                }
                            }
                        }
                        
                        syllableResult += turkicChar;
                    } else if (!/\d/.test(char)) {
                        syllableResult += char;
                    }
                }
            }
            
            result += syllableResult;
        }
        
        return result;
    }
    
    // Function to divide a Turkish word into syllables
    function divideTurkishWordIntoSyllables(word) {
        // Basic validation
        if (!word || typeof word !== 'string') return [];
        
        const vowels = 'aeıioöuü';
        let syllables = [];
        
        // Words with no vowels (rare, but possible with abbreviations)
        if (!word.split('').some(char => vowels.includes(char))) {
            return [word];
        }
        
        // Special case: If the word has only one vowel, it's a single syllable
        const vowelCount = word.split('').filter(char => vowels.includes(char)).length;
        if (vowelCount === 1) {
            return [word]; // The entire word is one syllable
        }
        
        // For words with multiple vowels, use the standard syllable division rules
        let currentSyllable = '';
        
        // Simple implementation with key Turkish syllable rules
        for (let i = 0; i < word.length; i++) {
            currentSyllable += word[i];
            
            // Only proceed if we have a vowel in the current syllable
            if (currentSyllable.split('').some(c => vowels.includes(c))) {
                // Rule 1: If the next char is a vowel, close this syllable
                if (i + 1 < word.length && vowels.includes(word[i + 1])) {
                    syllables.push(currentSyllable);
                    currentSyllable = '';
                }
                // Rule 2: If this is a vowel followed by a consonant at the end, close this syllable
                else if (vowels.includes(word[i]) && i + 1 === word.length - 1 && !vowels.includes(word[i + 1])) {
                    currentSyllable += word[i + 1];
                    syllables.push(currentSyllable);
                    currentSyllable = '';
                    i++; // Skip the consonant we just added
                }
                // Rule 3: If we have a vowel followed by two consonants, split after first consonant
                else if (vowels.includes(word[i]) && 
                        i + 2 < word.length && 
                        !vowels.includes(word[i + 1]) && 
                        !vowels.includes(word[i + 2])) {
                    currentSyllable += word[i + 1]; // Include the first consonant
                    syllables.push(currentSyllable);
                    currentSyllable = '';
                    i++; // Skip the consonant we just added
                }
                // Rule 4: If we have a vowel followed by a consonant followed by a vowel, close after first vowel
                else if (vowels.includes(word[i]) && 
                        i + 2 < word.length && 
                        !vowels.includes(word[i + 1]) && 
                        vowels.includes(word[i + 2])) {
                    syllables.push(currentSyllable);
                    currentSyllable = '';
                }
                // Handle end of word
                else if (i === word.length - 1) {
                    syllables.push(currentSyllable);
                    currentSyllable = '';
                }
            }
        }
        
        // Add any remaining characters
        if (currentSyllable) {
            syllables.push(currentSyllable);
        }
        
        // Log for debugging
        console.log(`Divided "${word}" into syllables: [${syllables.join(', ')}]`);
        
        return syllables;
    }
    
    // Update Turkic output whenever Turkish input changes
    turkishInput.addEventListener('input', function() {
        // Convert newlines to word separator + newline in the output
        const inputText = turkishInput.value;
        let outputText = '';
        
        // For debugging - test word division and translation
        if (inputText === 'test') {
            // Test special pattern cases
            console.log('\n--- Testing Special Pattern Cases ---');
            const patternTestCases = ['okok', 'okuk', 'ukok', 'ukuk', 'koko', 'kuku', 'ökük', 'kükü'];
            
            patternTestCases.forEach(word => {
                console.log(`\nTesting special pattern "${word}":`);
                const syllables = divideTurkishWordIntoSyllables(word);
                console.log('Syllables:', syllables);
                
                const markedSyllables = syllables.map(s => markCombinedCharPatterns(s));
                console.log('Marked syllables:', markedSyllables);
                
                const translated = processWordWithCombinedChars(word);
                console.log('Translated result:', translated);
            });
            
            // Test regular words
            console.log('\n--- Testing Regular Words ---');
            const testWord = 'Gülenay';
            console.log('Testing with word:', testWord);
            const syllables = divideTurkishWordIntoSyllables(testWord.toLowerCase());
            console.log('Syllables:', syllables);
            
            // Test with combined character marking
            const markedSyllables = syllables.map(s => markCombinedCharPatterns(s));
            console.log('Marked syllables:', markedSyllables);
            
            // Test final translation
            const translated = processWordWithCombinedChars(testWord.toLowerCase());
            console.log('Translated result:', translated);
            
            // Test general words
            console.log('\n--- Testing General Words ---');
            const testCases = ['atatürk', 'istanbul', 'türkiye', 'ankara', 'izmir', 'turkish', 'yoktu', 'antalya', 'ıstanbul'];
            testCases.forEach(word => {
                console.log(`\nTesting "${word}":`);
                const sylls = divideTurkishWordIntoSyllables(word);
                console.log('Syllables:', sylls);
                
                const marked = sylls.map(s => markCombinedCharPatterns(s));
                console.log('Marked syllables:', marked);
                
                const trans = processWordWithCombinedChars(word);
                console.log('Translated:', trans);
            });
            
            // Test specific combined character cases
            console.log('\n--- Testing Combined Character Cases ---');
            const combinedTestCases = [
                // Back vowel cases
                'kaldı',       // ld with back vowel
                'antep',       // nt with back vowel
                'kanca',       // nç with back vowel
                'tango',       // ng with back vowel
                'sonya',       // ny with back vowel
                'okuldu',      // ok with back vowel
                'yok',         // ok with back vowel
                
                // Front vowel cases
                'geldi',       // ld with front vowel
                'kent',        // nt with front vowel
                'gençlik',     // nç with front vowel
                'rengi',       // ng with front vowel
                'dünya',       // ny with front vowel
                'öktem',       // ök with front vowel
                'türk',        // ök with front vowel
                
                // Special cases with only one vowel
                'tank',        // tank (single syllable with back vowel)
                'genç',        // genç (single syllable with front vowel)
                'Türk',        // türk (single syllable with front vowel)
                'bank',        // bank (single syllable with back vowel)
            ];
            
            combinedTestCases.forEach(word => {
                console.log(`\nTesting combined case "${word}":`);
                const sylls = divideTurkishWordIntoSyllables(word);
                console.log('Syllables:', sylls);
                
                const marked = sylls.map(s => markCombinedCharPatterns(s));
                console.log('Marked syllables:', marked);
                
                const translated = processWordWithCombinedChars(word);
                console.log('Translated:', translated);
            });
        }
        
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