import { useState } from "react";

export const languageNames = {
  fr: "French",
  en: "English",
  nl: "Dutch",
  "ar-Latn": "Arabic (Latin)",
  lb: "Luxembourgish",
  ca: "Catalan",
  de: "German",
  sv: "Swedish",
  hu: "Hungarian",
  tr: "Turkish",
  ht: "Haitian Creole",
  it: "Italian",
  vi: "Vietnamese",
  pt: "Portuguese",
  no: "Norwegian",
  fi: "Finnish",
  da: "Danish",
  id: "Indonesian",
  hr: "Croatian",
  ja: "Japanese",
  hi: "Hindi",
  es: "Spanish",
  mk: "Macedonian",
  ar: "Arabic",
  ro: "Romanian",
  "hi-Latn": "Hindi (Latin)",
  sr: "Serbian",
  yi: "Yiddish",
  uk: "Ukrainian",
  ur: "Urdu",
  "ru-Latn": "Russian (Latin)",
  fa: "Persian",
  cs: "Czech",
  pl: "Polish",
  ga: "Irish",
  mg: "Malagasy",
  el: "Greek",
  ps: "Pashto",
  kk: "Kazakh",
  af: "Afrikaans",
  mn: "Mongolian",
  "bg-Latn": "Bulgarian (Latin)",
  zh: "Chinese",
  gu: "Gujarati",
  sq: "Albanian",
  ms: "Malay",
  mr: "Marathi",
  bg: "Bulgarian",
  ru: "Russian",
  lt: "Lithuanian",
  fy: "Frisian",
  sd: "Sindhi",
  ky: "Kyrgyz",
  ny: "Chichewa",
  iw: "Hebrew",
  mt: "Maltese",
  sk: "Slovak",
  sn: "Shona",
  ne: "Nepali",
  la: "Latin",
  sw: "Swahili",
  fil: "Filipino",
  co: "Corsican",
  bs: "Bosnian",
  az: "Azerbaijani",
  unknown: "Unknown",
  my: "Burmese",
  te: "Telugu",
  lv: "Latvian",
  kn: "Kannada",
  th: "Thai",
  ku: "Kurdish",
  st: "Sesotho",
  zu: "Zulu",
  gd: "Scottish Gaelic",
  ko: "Korean",
  am: "Amharic",
  tg: "Tajik",
  sl: "Slovenian",
  su: "Sundanese",
  "ja-Latn": "Japanese (Latin)",
  jv: "Javanese",
  ig: "Igbo",
  pa: "Punjabi",
  be: "Belarusian",
  ka: "Georgian",
  ceb: "Cebuano",
  "el-Latn": "Greek (Latin)",
  ha: "Hausa",
  eo: "Esperanto",
  mi: "Maori",
  ml: "Malayalam",
  uz: "Uzbek",
  gl: "Galician",
  sm: "Samoan",
  yo: "Yoruba",
};

export const useLanguageDetector = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [detectedLanguage, setDetectedLanguage] = useState("");

    const detectLanguage = async (inputText) => {
        if (!("ai" in self && "languageDetector" in self.ai)) {
            console.log("❌ The Language Detector API is not supported in this browser.");
            return;
        }

        setIsLoading(true);
        console.log("✅ The Language Detector API is available.");

        try {
            const capabilities = await self.ai.languageDetector.capabilities();

            if (capabilities.available === "no") {
                console.error("🚫 Language Detector is not available.");
                setIsLoading(false);
                return;
            }

            let detector;
            if (capabilities.available === "readily") {
                detector = await self.ai.languageDetector.create();
                console.log("✅ Detector initialized successfully.");
            } else {
                detector = await self.ai.languageDetector.create({
                    monitor(m) {
                        m.addEventListener("downloadprogress", (e) => {
                            console.log(`Downloading: ${e.loaded} of ${e.total} bytes.`);
                        });
                    },
                });
                await detector.ready;
                console.log("✅ Model downloaded and detector initialized.");
            }

            if (!detector) {
                console.error("🚫 Detector initialization failed.");
                setIsLoading(false);
                return;
            }

            const results = await detector.detect(inputText);
            if (results.length > 0) {
                const detectedCode = results[0].detectedLanguage;
                const detectedName = languageNames[detectedCode] || "Unknown";
            
                setDetectedLanguage(detectedName); // Store full language name
                console.log(`Detected Language: ${detectedName} (${detectedCode}), Confidence: ${results[0].confidence}`);
            
            return detectedName; 
            } else {
                setDetectedLanguage("Unknown");
            }
        } catch (error) {
            console.error("Error detecting language:", error);
        }

        setIsLoading(false);
    };

    return { detectLanguage, isLoading, detectedLanguage, languageNames };
};