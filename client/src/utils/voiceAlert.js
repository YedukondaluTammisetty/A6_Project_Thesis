export const speakAlert = (message) => {

    if (!("speechSynthesis" in window)) return;

    const speech = new SpeechSynthesisUtterance(message);

    const voices = window.speechSynthesis.getVoices();

    // Prefer US English voice
    const selectedVoice =
        voices.find(v => v.lang === "en-US") ||
        voices.find(v => v.name.includes("US")) ||
        voices[0];

    if (selectedVoice) {
        speech.voice = selectedVoice;
    }

    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.cancel(); // stop previous voice
    window.speechSynthesis.speak(speech);
};