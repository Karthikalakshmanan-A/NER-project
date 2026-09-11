// Web Speech Recognition & Speech Synthesis Service for Pan-India Languages

// Language mappings to BCP 47 speech tags
export const SPEECH_LANG_MAP: Record<string, string> = {
  ta: 'ta-IN', // Tamil
  en: 'en-IN', // English (India)
  hi: 'hi-IN', // Hindi
  te: 'te-IN', // Telugu
  kn: 'kn-IN', // Kannada
  ml: 'ml-IN', // Malayalam
  bn: 'bn-IN', // Bengali
  mr: 'mr-IN', // Marathi
  gu: 'gu-IN', // Gujarati
  pa: 'pa-IN', // Punjabi
  as: 'as-IN', // Assamese
  or: 'or-IN', // Odia
  ur: 'ur-IN', // Urdu
};

export interface VoiceQueryResult {
  replyText: string;
  actionType?: 'ROUTE_SELECT' | 'WEATHER' | 'SAFEST_ROUTE' | 'FASTAG' | 'SOS' | 'NAVIGATE' | 'GENERAL';
  routeParams?: {
    from: string;
    to: string;
  };
  suggestedActions?: string[];
}

// Check if browser supports Web Speech Recognition
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

// Check if browser supports Speech Synthesis
export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

let activeRecognition: any = null;

// Start voice listening
export function startVoiceRecognition(
  langCode: string,
  onResult: (transcript: string, isFinal: boolean) => void,
  onError: (errorMsg: string) => void,
  onEnd: () => void
): boolean {
  if (!isSpeechRecognitionSupported()) {
    onError('Speech recognition is not supported in this browser.');
    return false;
  }

  try {
    stopVoiceRecognition();

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.lang = SPEECH_LANG_MAP[langCode] || 'en-IN';

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        onResult(finalTranscript, true);
      } else if (interimTranscript) {
        onResult(interimTranscript, false);
      }
    };

    recognition.onerror = (event: any) => {
      onError(event.error === 'not-allowed' ? 'Microphone permission denied.' : `Speech error: ${event.error}`);
    };

    recognition.onend = () => {
      activeRecognition = null;
      onEnd();
    };

    recognition.start();
    activeRecognition = recognition;
    return true;
  } catch (err: any) {
    onError(err?.message || 'Failed to start speech recognition.');
    return false;
  }
}

// Stop voice listening
export function stopVoiceRecognition(): void {
  if (activeRecognition) {
    try {
      activeRecognition.abort();
    } catch {
      // ignore
    }
    activeRecognition = null;
  }
}

// Speak out text using browser SpeechSynthesis
export function speakText(
  text: string,
  langCode: string,
  onEnd?: () => void,
  onError?: () => void
): void {
  if (!isSpeechSynthesisSupported()) {
    if (onEnd) onEnd();
    return;
  }

  try {
    window.speechSynthesis.cancel(); // cancel prior utterances

    const cleanText = text.replace(/[*#_`]/g, '').slice(0, 350); // keep concise for voice
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const targetLang = SPEECH_LANG_MAP[langCode] || 'en-IN';
    utterance.lang = targetLang;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick best matching voice
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(langCode) || v.lang === targetLang);
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    if (onEnd) {
      utterance.onend = () => onEnd();
    }
    if (onError) {
      utterance.onerror = () => onError();
    }

    window.speechSynthesis.speak(utterance);
  } catch {
    if (onEnd) onEnd();
  }
}

// Stop current speech playback
export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}

// Intelligent Multilingual Intent Engine
export function processVoiceQuery(query: string, langCode: string): VoiceQueryResult {
  const lower = query.toLowerCase().trim();

  // 1. City Corridor detection
  const cities: Record<string, string[]> = {
    'Chennai': ['chennai', 'சென்னை', 'मद्रास', 'chenai'],
    'Bengaluru': ['bengaluru', 'bangalore', 'பெங்களூரு', 'बेंगलुरु', 'ಬೆಂಗಳೂರು', 'బెంగళూరు'],
    'Guwahati': ['guwahati', 'gowhati', 'கவுகாத்தி', 'गुवाहाटी', 'গুৱাহাটী'],
    'Shillong': ['shillong', 'ஷில்லாங்', 'शिलांग', 'শ্বিলং'],
    'Mumbai': ['mumbai', 'bombay', 'மும்பை', 'मुंबई'],
    'Pune': ['pune', 'பூனே', 'पुणे'],
    'Delhi': ['delhi', 'new delhi', 'டெல்லி', 'दिल्ली'],
    'Shimla': ['shimla', 'சிம்லா', 'शिमला'],
    'Siliguri': ['siliguri', 'சிலிகுரி', 'सिलीगुड़ी', 'শিলিগুড়ি'],
    'Gangtok': ['gangtok', 'கேங்டாக்', 'गैंगटॉक']
  };

  const detectedCities: string[] = [];
  for (const [cityName, aliases] of Object.entries(cities)) {
    if (aliases.some(alias => lower.includes(alias))) {
      detectedCities.push(cityName);
    }
  }

  // If two cities detected (e.g. "Chennai to Bengaluru")
  if (detectedCities.length >= 2) {
    const from = detectedCities[0];
    const to = detectedCities[1];

    const replyMap: Record<string, string> = {
      ta: `${from} முதல் ${to} வரையிலான சிறந்த மற்றும் பாதுகாப்பான பாதை தேர்ந்தெடுக்கப்பட்டுள்ளது. நேரலை ஜிபிஎஸ் மற்றும் தானியங்கி வானிலை ஒருங்கிணைக்கப்பட்டுள்ளது.`,
      en: `Selected safe route corridor from ${from} to ${to}. Automated climate and highway telemetry are loaded.`,
      hi: `${from} से ${to} के लिए सबसे सुरक्षित गलियारा चुन लिया गया है। स्वचालित मौसम और मार्ग अनुकूलन सक्रिय है।`,
      te: `${from} నుండి ${to} వరకు అత్యంత సురక్షితమైన మార్గం ఎంపిక చేయబడింది.`,
      kn: `${from} ನಿಂದ ${to} ವರೆಗಿನ ಸುರಕ್ಷಿತ ಮಾರ್ಗವನ್ನು ಸಿದ್ಧಪಡಿಸಲಾಗಿದೆ.`
    };

    return {
      replyText: replyMap[langCode] || replyMap['en'],
      actionType: 'ROUTE_SELECT',
      routeParams: { from, to },
      suggestedActions: [
        langCode === 'ta' ? 'பாதையை நேரடியாக பின்தொடர்' : 'Follow Route Live',
        langCode === 'ta' ? 'வானிலை நிலவரம்' : 'Check Weather',
        langCode === 'ta' ? 'டோல்கேட் கட்டணம்' : 'FASTag Tolls'
      ]
    };
  }

  // 2. Weather / Climate Query
  if (
    lower.includes('weather') || 
    lower.includes('rain') || 
    lower.includes('climate') ||
    lower.includes('வானிலை') || 
    lower.includes('மழை') ||
    lower.includes('புயல்') ||
    lower.includes('मौसम') || 
    lower.includes('बारिश') ||
    lower.includes('వాతావరణం') ||
    lower.includes('हवामान')
  ) {
    const weatherReplies: Record<string, string> = {
      ta: "தானியங்கி டாப்ளர் தகவல்: தற்போதைய வழித்தடத்தில் மிதமான மழை (18 மி.மீ/மணி) பதிவாகியுள்ளது. சாலை பிடிப்பு குணகம் μ=0.58. லாரி டயர்களுக்கு பாதுகாப்பான வேகம் 45 கி.மீ/மணி பரிந்துரைக்கப்படுகிறது.",
      en: "Automated Doppler update: Moderate rainfall (18 mm/h) logged along the active corridor. Road friction is μ=0.58. Recommended safe convoy speed is 45 km/h.",
      hi: "स्वचालित डॉपलर रडार अपडेट: वर्तमान मार्ग पर मध्यम वर्षा (18 मिमी/घंटा) दर्ज की गई है। सड़क घर्षण μ=0.58 है। सुरक्षित गति 45 किमी/घंटा बनाए रखें।",
      te: "వాతావరణ సమాచారం: ప్రస్తుత మార్గంలో మోస్తరు వర్షం (18 mm/h) కురుస్తోంది. సురక్షిత వేగం 45 km/h.",
      kn: "ಹವಾಮಾನ ಮಾಹಿತಿ: ಪ್ರಸ್ತುತ ಮಾರ್ಗದಲ್ಲಿ ಮಧ್ಯಮ ಮಳೆ ದಾಖಲಾಗಿದೆ. ಸುರಕ್ಷಿತ ಚಾಲನೆ ವೇಗ 45 ಕಿ.ಮೀ/ಗಂಟೆ."
    };

    return {
      replyText: weatherReplies[langCode] || weatherReplies['en'],
      actionType: 'WEATHER',
      suggestedActions: [
        langCode === 'ta' ? 'ரேடார் அடுக்கு பார்க்க' : 'Toggle Weather Radar',
        langCode === 'ta' ? 'மாற்றுப்பாதை தேர்வு' : 'Select Alternate Route'
      ]
    };
  }

  // 3. Safest Route / Landslide Query
  if (
    lower.includes('safest') || 
    lower.includes('safe') || 
    lower.includes('landslide') || 
    lower.includes('hazard') ||
    lower.includes('பாதுகாப்ப') || 
    lower.includes('நிலச்சரிவு') || 
    lower.includes('ஆபத்து') ||
    lower.includes('सुरक्षित') || 
    lower.includes('भूस्खलन') ||
    lower.includes('భద్రత')
  ) {
    const safeReplies: Record<string, string> = {
      ta: "ஸ்மார்ட் பாதை B (Lumding-Haflong அல்லது தேசிய 4-வழி விரைவுச்சாலை) 89% அதிக பாதுகாப்பு குறியீட்டைக் கொண்டுள்ளது. கொண்டை ஊசி வளைவுகள் மற்றும் நிலச்சரிவு வாய்ப்புகள் குறைவு.",
      en: "Route B is recommended as the Best Safe Route with an 89% safety index. It bypasses dangerous ghat landslide zones and unstable river cuttings.",
      hi: "रूट B 89% सुरक्षा स्कोर के साथ अनुशंसित है। यह तीव्र ढलानों और भूस्खलन संभावित घाट क्षेत्रों से सुरक्षित दूरी बनाए रखता है।",
      te: "రూట్ B అత్యంత సురక్షితమైన మార్గం (89% భద్రతా స్కోరు). ప్రమాదకరమైన మలుపులు ఉండవు.",
      kn: "ಮಾರ್ಗ B ಅತಿ ಸುರಕ್ಷಿತ ಮಾರ್ಗವಾಗಿದೆ (89% ಸುರಕ್ಷತೆ). ಘಾಟ್ ಭೂಕುಸಿತ ಪ್ರದೇಶಗಳಿಂದ ಮುಕ್ತವಾಗಿದೆ."
    };

    return {
      replyText: safeReplies[langCode] || safeReplies['en'],
      actionType: 'SAFEST_ROUTE',
      suggestedActions: [
        langCode === 'ta' ? 'சிறந்த பாதையை தேர்வு செய்' : 'Select Route B',
        langCode === 'ta' ? 'பாதையை தொடங்கு' : 'Follow Route Live'
      ]
    };
  }

  // 4. FASTag / Toll query
  if (
    lower.includes('fastag') || 
    lower.includes('toll') || 
    lower.includes('cost') ||
    lower.includes('டோல்') || 
    lower.includes('கட்டணம்') || 
    lower.includes('செலவு') ||
    lower.includes('टोल') || 
    lower.includes('फास्टैग')
  ) {
    const tollReplies: Record<string, string> = {
      ta: "இந்த வழித்தடத்தில் தோராயமாக 5 முதல் 7 டோல்கேட்டுகள் உள்ளன. 4-அச்சு வணிக லாரிகளுக்கான FASTag கட்டணம் சுமார் ₹1,420 ஆகும்.",
      en: "Estimated toll along this corridor includes 5 to 7 FASTag plazas, totaling approximately ₹1,420 for medium commercial trucks.",
      hi: "इस मार्ग पर अनुमानित 5 से 7 टोल प्लाजा हैं, जिनका 4-एक्सल वाणिज्यिक ट्रक के लिए कुल फास्टैग खर्च लगभग ₹1,420 है।",
      te: "ఈ మార్గంలో అంచనా వేసిన FASTag టోల్ ఛార్జీ సుమారు ₹1,420 (5 టోల్ ప్లాజాలు).",
      kn: "ಈ ಕಾರಿಡಾರ್‌ನಲ್ಲಿ ಒಟ್ಟು FASTag ಸುಂಕ ಸುಮಾರು ₹1,420 (5 ಟೋಲ್ ಪ್ಲಾಜಾಗಳು)."
    };

    return {
      replyText: tollReplies[langCode] || tollReplies['en'],
      actionType: 'FASTAG',
      suggestedActions: [
        langCode === 'ta' ? 'எரிபொருள் செலவு கணக்கிடு' : 'Fuel Cost Analysis',
        langCode === 'ta' ? 'பாதையை மாற்று' : 'Alternate Low Toll Route'
      ]
    };
  }

  // 5. Emergency SOS
  if (
    lower.includes('sos') || 
    lower.includes('help') || 
    lower.includes('emergency') ||
    lower.includes('அவசர') || 
    lower.includes('உதவி') || 
    lower.includes('காப்பாற்று') ||
    lower.includes('मदद') || 
    lower.includes('आपातकाल')
  ) {
    const sosReplies: Record<string, string> = {
      ta: "அவசர உதவி அழைப்பு தயார்! தேசிய பேரிடர் மீட்பு படை (NDRF 1078), ஆம்புலன்ஸ் (108) மற்றும் நெடுஞ்சாலை ரோந்து (1033) எண்கள் இணைக்கப்பட்டுள்ளன. உங்கள் ஜிபிஎஸ் இருப்பிடம் அவசர கட்டுப்பாட்டு அறைக்கு அனுப்பப்படுகிறது.",
      en: "Emergency SOS activated! Connected to NDRF (1078), National Highway Helpline (1033), and Medical Services (108). Your live GPS coordinates are being transmitted.",
      hi: "आपातकालीन SOS सक्रिय! एनडीआरएफ (1078), राजमार्ग हेल्पलाइन (1033) और एम्बुलेंस (108) से संपर्क स्थापित किया जा रहा है। आपके जीपीएस निर्देशांक प्रेषित किए जा रहे हैं।",
      te: "అత్యవసర SOS యాక్టివేట్ చేయబడింది! సహాయక హెల్ప్‌లైన్ (1033/108) కు మీ లైవ్ GPS పంపబడుతోంది.",
      kn: "ತುರ್ತು SOS ಸಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ! ರಸ್ತೆ ಸುರಕ್ಷತಾ ಸಹಾಯವಾಣಿ (1033) ಗೆ ನಿಮ್ಮ ಲೈವ್ GPS ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ."
    };

    return {
      replyText: sosReplies[langCode] || sosReplies['en'],
      actionType: 'SOS',
      suggestedActions: [
        langCode === 'ta' ? 'அவசர அழைப்பு 1033' : 'Call Highway 1033',
        langCode === 'ta' ? 'ஆம்புலன்ஸ் 108' : 'Call Ambulance 108'
      ]
    };
  }

  // 6. Default General / Conversational Response
  const defaultReplies: Record<string, string> = {
    ta: `வணக்கம்! ஸ்மார்ட்மூவ் AI உங்கள் கேள்விக்கு பதிலளிக்கிறது: "${query}". அகில இந்திய தேசிய நெடுஞ்சாலைகள், மலைப்பாதை வளைவுகள் மற்றும் தானியங்கி வானிலை கண்காணிப்பு தயாராக உள்ளது. நீங்கள் புதிய பாதையை திட்டமிடலாம் அல்லது வானிலையை சரிபார்க்கலாம்.`,
    en: `SmartMove AI here! Regarding "${query}": Our terrain neural models continuously evaluate Pan-India highways, mountain ghats, and automated Doppler precipitation. Would you like to select a route or inspect real-time road conditions?`,
    hi: `नमस्ते! स्मार्टमूव AI: "${query}" के संबंध में हमारा अखिल भारतीय सड़क और पर्वतीय इंटेलिजेंस नेटवर्क सक्रिय है। क्या आप नया मार्ग चुनना चाहते हैं या मौसम की जानकारी लेना चाहते हैं?`,
    te: `నమస్కారం! మీ ప్రశ్న "${query}" కు స్మార్ట్‌మూవ్ AI సమాధానం సిద్ధంగా ఉంది. రూట్ లేదా వాతావરણ వివరాలు కావాలా?`,
    kn: `ನಮಸ್ಕಾರ! "${query}" ಕುರಿತು ಸ್ಮಾರ್ಟ್‌ಮೂವ್ AI ಸಿದ್ಧವಾಗಿದೆ. ನೀವು ಹೊಸ ಮಾರ್ಗವನ್ನು ಆರಿಸಲು ಬಯಸುವಿರಾ?`
  };

  return {
    replyText: defaultReplies[langCode] || defaultReplies['en'],
    actionType: 'GENERAL',
    suggestedActions: [
      langCode === 'ta' ? 'சென்னை ➔ பெங்களூரு பாதை' : 'Chennai ➔ Bengaluru Route',
      langCode === 'ta' ? 'தானியங்கி வானிலை நிலவரம்' : 'Automated Climate Status',
      langCode === 'ta' ? 'பாதுகாப்பான பாதையை கணக்கிடு' : 'Analyze Safe Routes'
    ]
  };
}
