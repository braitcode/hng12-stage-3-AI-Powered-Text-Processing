import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import bot from "../assets/images/bot.png"
import { v4 as uuidv4 } from "uuid";
import { NavLink } from "react-router-dom";

const Home = () => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    async function detectLanguage(text) {
        if (!("ai" in self) || !("languageDetector" in self.ai)) {
            console.error("Language Detector API not supported.");
            return null;
        }

        try {
            const detector = await self.ai.languageDetector.create();
            const results = await detector.detect(text);
            return results.length > 0 ? results[0].detectedLanguage : null;
        } catch (error) {
            console.error("Language detection error:", error);
            return null;
        }
    }

    async function translateText(text, sourceLang, targetLang) {
        if (!("ai" in self) || !("translator" in self.ai)) {
            console.error("Translator API not supported.");
            return;
        }

        try {
            const translator = await self.ai.translator.create({
                sourceLanguage: sourceLang,
                targetLanguage: targetLang,
            });
            return await translator.translate(text);
        } catch (error) {
            console.error("Translation error:", error);
            return null;
        }
    }

    async function summarizeText(text) {
        if (!("ai" in self) || !("summarizer" in self.ai)) {
            console.error("Summarizer API not supported.");
            return;
        }

        try {
            setLoading(true);
            const summarizer = await self.ai.summarizer.create({
                type: "key-points",
                format: "plain-text",
                length: "short",
            });
            return await summarizer.summarize(text);
        } catch (error) {
            console.error("Summarization error:", error);
            return null;
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const detectedLanguage = await detectLanguage(inputText);
        const newMessage = {
            id: uuidv4(),
            text: inputText,
            detectedLanguage,
            summary: "",
            translation: "",
            selectedLanguage: "en"
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setInputText("");
    };

    const handleTranslate = async (index, targetLanguage) => {
        setLoading(true);
        const updatedMessages = [...messages];
        const message = updatedMessages[index];
        const translation = await translateText(message.text, message.detectedLanguage, targetLanguage);

        if (translation) {
            message.translation = translation;
            message.selectedLanguage = targetLanguage;
            setMessages(updatedMessages);
        }
        setLoading(false);
    };

    const handleSummarize = async (index) => {
        const message = messages[index];
        const summary = await summarizeText(message.text);
        if (summary) {
            const updatedMessages = [...messages];
            updatedMessages[index].summary = summary;
            setMessages(updatedMessages);
        }
    };

    return (
        <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} w-full h-[100vh] flex justify-center items-center py-10`}>
            <div className={`${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"} xl:w-[40%] md:w-[60%] md:h-[70%] lg:w-[60%] h-[80%] border border-blue-600 rounded-4xl p-6 flex flex-col relative`}>
                <NavLink to='/'>

                <button className="flex justify-items-start justify-center cursor-pointer hover:bg-gray-500 rounded-md bg-gray-700 text-white w-[100px] h-[30px]">Go Back!</button>
                </NavLink>
                <button onClick={() => setDarkMode(!darkMode)} className="absolute cursor-pointer hover:bg-gray-500 top-6 right-6 bg-gray-700 text-white px-3 py-1 rounded-md text-sm">
                    {darkMode ? "🌙 Dark" : "☀️ Light"}
                </button>

                <div className="flex-1 overflow-y-auto p-2 space-y-4">
                    {messages.map((msg, index) => (
                        <motion.div key={msg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex flex-col items-end">
                            <div className="bg-blue-500 text-white p-3 rounded-3xl rounded-tr-none max-w-[75%]">
                                <p>{msg.text}</p>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Detected: {msg.detectedLanguage}</p>
                            <div className="mt-2 flex mb-2 items-center space-x-2 self-start">
                                <select className="border px-2 py-1 rounded text-sm bg-gray-200 text-black" value={msg.selectedLanguage} onChange={(e) => {
                                    const updatedMessages = [...messages];
                                    updatedMessages[index].selectedLanguage = e.target.value;
                                    setMessages(updatedMessages);
                                }}>
                                    <option value="en">English</option>
                                    <option value="pt">Portuguese</option>
                                    <option value="es">Spanish</option>
                                    <option value="ru">Russian</option>
                                    <option value="tr">Turkish</option>
                                    <option value="fr">French</option>
                                </select>
                                <button onClick={() => handleTranslate(index, msg.selectedLanguage)} className="text-sm bg-blue-500 cursor-pointer hover:bg-blue-400 text-white px-3 py-1 rounded"> Translate</button>
                                {msg.text.length > 150 && msg.detectedLanguage === "en" && (
                                    <button onClick={() => handleSummarize(index)} className=" text-sm bg-blue-600 hover:bg-blue-400 cursor-pointer text-white px-3 py-1 rounded">Summarize</button>
                                )}
                            </div>
                                {msg.summary && <motion.div className={`${darkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-black"} p-3 rounded-lg rounded-bl-none max-w-[75%] self-start`}><p>Summary: {msg.summary}</p></motion.div>}
                            {msg.translation && (
                                <div className="flex items-end gap-2">
                                    <img src={bot} alt="Bot" className="w-[26px] h-[26px] drop-shadow-lg" />
                                    <motion.div className="bg-gray-300 text-black p-3 font-light rounded-3xl rounded-bl-none max-w-[90%] self-start">
                                        <p>Translation: {msg.translation}</p>
                                    </motion.div>
                                </div>

                            )}
                        </motion.div>

                    ))}
                </div>

                <form onSubmit={handleSubmit} className="border-t border-gray-300 p-4 flex items-center space-x-2">
                    <textarea className={`flex-1 p-2 shadow rounded-3xl focus:outline-none ${darkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`} rows="2" placeholder="Type your text here..." value={inputText} onChange={(e) => setInputText(e.target.value)} />
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-400 text-white px-4 py-2 rounded-full disabled:opacity-50 flex items-center justify-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            "➤"
                        )}
                    </motion.button>
                </form>
            </div>
        </div>
    );
};

export default Home;
