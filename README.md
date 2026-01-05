# Köktürkçe Virtual Keyboard

A simple virtual keyboard for typing in Old Turkic script (Köktürkçe).

## Köktürkçe Translator (Turkish → Old Turkic)

This repo also includes a **rule-based** translator that converts **modern Turkish** text into **Old Turkic script** using historical phonetic / orthographic mapping rules.

Open `translator.html` to use it.

## Multilingual input via Turkish pivot (LibreTranslate)

To support **multi-language input** while **preserving the existing Turkish→Köktürkçe rule-based module**, the translator now supports a pivot architecture:

- **source text (any language)** → (LibreTranslate API) → **normalized Turkish**
- **normalized Turkish** → (existing rule-based converter) → **Old Turkic output**

There is **no extra semantic modeling** between steps; the Turkish output from LibreTranslate is passed directly into the existing converter pipeline.

### Configuration notes

Public LibreTranslate instances are often **rate-limited**, **unreliable**, or require an **API key**. For a truly free setup, run LibreTranslate locally.

#### Free option (recommended): run LibreTranslate locally with Docker

1. Start LibreTranslate:

```bash
docker compose up -d
```

2. Serve the site locally (so you don’t run into file:// quirks):

```bash
python3 -m http.server 8080
```

3. Open the translator at `http://localhost:8080/translator.html`
4. The default LibreTranslate endpoint in the UI is `http://localhost:5000/translate`

#### Notes

- If the browser blocks requests due to **CORS**, ensure your LibreTranslate instance is configured to allow it (the provided `docker-compose.yml` sets permissive CORS for local use).
- API keys are optional depending on your instance (and are **not persisted** in localStorage).

## About Old Turkic Script

The Old Turkic script (also known as Orkhon-Yenisei script or Köktürkçe) is the alphabet used by the Göktürk and other early Turkic khanates during the 8th to 10th centuries. The script is derived from the Old Sogdian alphabet and was used to write the Old Turkic language.

The script is written from right to left and consists of 38 letters, many of which represent both consonants and vowels, depending on context.

## How to Use

1. Open `index.html` in a web browser.
2. Click on the virtual keyboard buttons to type Old Turkic characters in the text area.
3. Use the Backspace button to delete characters.
4. Use the Space button to add spaces.
5. Use the Clear button to clear the entire text area.

## Features

- Virtual keyboard with all Old Turkic characters
- Text input area with proper display of the Old Turkic script
- Simple, responsive design

## Note on Character Display

To properly display the Old Turkic characters, your system must have fonts that support the Unicode Old Turkic block (U+10C00 to U+10C4F). If the characters appear as boxes or placeholder symbols, you may need to install a font that supports these characters, such as Noto Sans Old Turkic. 