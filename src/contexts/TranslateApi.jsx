import React from 'react'

const TRANSLATOR_API_URL = "https://translation.googleapis.com/v1/translateText"; // Replace with the correct endpoint
const API_TOKEN = "Au84U6xfVvZ0k3d9h+7XU2V1x9MPwG9cRoHLl6I9S2gMsdMVAV5uix/XpMK6WGwoJHGkqn5KZAkV55nZMugggQUAAABReyJvcmlnaW4iOiJodHRwOi8vbG9jYWxob3N0OjUxNzMiLCJmZWF0dXJlIjoiVHJhbnNsYXRpb25BUEkiLCJleHBpcnkiOjE3NTMxNDI0MDB9"; 

const translateText = async (text, targetLang) => {
  try {
    const response = await fetch(TRANSLATOR_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_TOKEN}`, // Include your API token in the header
      },
      body: JSON.stringify({
        q: text,         // The text to translate
        target: targetLang, // The target language (e.g., "es" for Spanish)
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.translation; // Extract translated text from response
  } catch (error) {
    console.error("Translation failed:", error);
    return "Error translating text";
  }
};

export default TranslateApi