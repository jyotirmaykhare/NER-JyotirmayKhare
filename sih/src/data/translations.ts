export type LanguageCode = "en" | "hi" | "as" | "bn" | "mn";

export interface TranslationStrings {
  appTitle: string;
  appSubtitle: string;
  overview: string;
  liveMap: string;
  routes: string;
  vehicles: string;
  shipments: string;
  accessibility: string;
  alerts: string;
  weather: string;
  fieldReports: string;
  emergencyOps: string;
  analytics: string;
  profile: string;
  statusOperational: string;
  roadAccessibility: string;
  activeDisruptions: string;
  vehiclesInTransit: string;
  activeShipments: string;
  delayedShipments: string;
  highRiskCorridors: string;
  aiRiskDetection: string;
  viewOnMap: string;
  restrictedAccess: string;
  verifyIdentity: string;
  findRoute: string;
  offlineMode: string;
  onlineMode: string;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationStrings> = {
  en: {
    appTitle: "NER LOGISTICS INTELLIGENCE",
    appSubtitle: "AI-Powered Smart Logistics & Accessibility Platform for North Eastern Region",
    overview: "Overview",
    liveMap: "Live Map",
    routes: "Routes",
    vehicles: "Vehicles",
    shipments: "Shipments",
    accessibility: "Accessibility",
    alerts: "Alerts",
    weather: "Weather",
    fieldReports: "Field Reports",
    emergencyOps: "Emergency Operations",
    analytics: "Analytics",
    profile: "Profile",
    statusOperational: "Operational",
    roadAccessibility: "Road Accessibility",
    activeDisruptions: "Active Disruptions",
    vehiclesInTransit: "Vehicles In Transit",
    activeShipments: "Active Shipments",
    delayedShipments: "Delayed Shipments",
    highRiskCorridors: "High Risk Corridors",
    aiRiskDetection: "AI Risk Detection",
    viewOnMap: "View on Map",
    restrictedAccess: "Restricted Access",
    verifyIdentity: "Verify Identity",
    findRoute: "Find Route",
    offlineMode: "Offline",
    onlineMode: "Online",
  },
  hi: {
    appTitle: "पूर्वोत्तर लॉजिस्टिक्स इंटेलिजेंस",
    appSubtitle: "पूर्वोत्तर क्षेत्र के लिए एआई-संचालित स्मार्ट लॉजिस्टिक्स और सुगम्यता प्लेटफॉर्म",
    overview: "अवलोकन",
    liveMap: "लाइव मैप",
    routes: "मार्ग",
    vehicles: "वाहन",
    shipments: "खेप / शिपमेंट",
    accessibility: "सुगम्यता",
    alerts: "चेतावनी",
    weather: "मौसम",
    fieldReports: "फील्ड रिपोर्ट",
    emergencyOps: "आपातकालीन संचालन",
    analytics: "एनालिटिक्स",
    profile: "प्रोफ़ाइल",
    statusOperational: "सक्रिय / सामान्य",
    roadAccessibility: "सड़क सुगम्यता",
    activeDisruptions: "सक्रिय व्यवधान",
    vehiclesInTransit: "पारगमन में वाहन",
    activeShipments: "सक्रिय शिपमेंट",
    delayedShipments: "विलंबित शिपमेंट",
    highRiskCorridors: "उच्च जोखिम वाले गलियारे",
    aiRiskDetection: "एआई जोखिम पहचान",
    viewOnMap: "मानचित्र पर देखें",
    restrictedAccess: "प्रतिबंधित पहुंच",
    verifyIdentity: "पहचान सत्यापित करें",
    findRoute: "मार्ग खोजें",
    offlineMode: "ऑफ़लाइन",
    onlineMode: "ऑनलाइन",
  },
  as: {
    appTitle: "উত্তৰ-পূব লজিষ্টিকছ বুদ্ধিমত্তা",
    appSubtitle: "উত্তৰ-পূব অঞ্চলৰ বাবে এআই-চালিত স্মাৰ্ট লজিষ্টিকছ আৰু সুগম্যতা প্লেটফৰ্ম",
    overview: "সামগ্ৰিক পৰ্যালোচনা",
    liveMap: "লাইভ মেপ",
    routes: "পথসমূহ",
    vehicles: "যান-বাহন",
    shipments: "পৰিবহণ সামগ্ৰী",
    accessibility: "সুগম্যতা",
    alerts: "সতৰ্কবাৰ্তা",
    weather: "বতৰ",
    fieldReports: "ক্ষেত্ৰ প্ৰতিবেদন",
    emergencyOps: "জৰুৰীকালীন কাৰ্যকৰী ব্যৱস্থা",
    analytics: "পৰিসংখ্যা",
    profile: "প্ৰ'ফাইল",
    statusOperational: "কাৰ্যক্ষম",
    roadAccessibility: "পথ সুগম্যতা",
    activeDisruptions: "সক্ৰিয় বিঘিনি",
    vehiclesInTransit: "যাত্ৰাৰত বাহন",
    activeShipments: "সক্ৰিয় সামগ্ৰী",
    delayedShipments: "বিলম্বিত সামগ্ৰী",
    highRiskCorridors: "উচ্চ বিপদ সংকুল পথ",
    aiRiskDetection: "এআই বিপদ নিৰ্ধাৰণ",
    viewOnMap: "মানচিত্ৰত চাওক",
    restrictedAccess: "সংৰক্ষিত প্ৰৱেশাধিকাৰ",
    verifyIdentity: "পৰিচয় পৰীক্ষা কৰক",
    findRoute: "পথ বিচাৰক",
    offlineMode: "অফলাইন",
    onlineMode: "অনলাইন",
  },
  bn: {
    appTitle: "উত্তর-পূর্ব লজিস্টিকস ইন্টেলিজেন্স",
    appSubtitle: "উত্তর-পূর্ব ভারতের জন্য এআই-চালিত স্মার্ট লজিস্টিকস ও অ্যাক্সেসযোগ্যতা প্ল্যাটফর্ম",
    overview: "একনজরে",
    liveMap: "লাইভ ম্যাপ",
    routes: "রুটসমূহ",
    vehicles: "যানবাহন",
    shipments: "চালান ট্র্যাকিং",
    accessibility: "অ্যাক্সেসিবিলিটি",
    alerts: "সতর্কতা",
    weather: "আবহাওয়া",
    fieldReports: "ফিল্ড রিপোর্ট",
    emergencyOps: "জরুরি অপারেশন",
    analytics: "অ্যানালিটিক্স",
    profile: "প্রোফাইল",
    statusOperational: "সচল",
    roadAccessibility: "সড়ক অ্যাক্সেসযোগ্যতা",
    activeDisruptions: "সক্রিয় প্রতিবন্ধকতা",
    vehiclesInTransit: "চলমান যানবাহন",
    activeShipments: "সক্রিয় চালান",
    delayedShipments: "বিলম্বিত চালান",
    highRiskCorridors: "উচ্চ ঝুঁকিপূর্ণ করিডোর",
    aiRiskDetection: "এআই ঝুঁকি সনাক্তকরণ",
    viewOnMap: "ম্যাপে দেখুন",
    restrictedAccess: "সীমাবদ্ধ প্রবেশাধিকার",
    verifyIdentity: "পরিচয় যাচাই করুন",
    findRoute: "রুট খুঁজুন",
    offlineMode: "অফলাইন",
    onlineMode: "অনলাইন",
  },
  mn: {
    appTitle: "এন ই আর লোজিষ্টিক ইন্টেলিজেন্স",
    appSubtitle: "অৱাং নোংপোক লমদমগী এআইনা চলাইবা লোজিষ্টিক প্লেটফোর্ম",
    overview: "মিৎয়েং",
    liveMap: "লাইভ মেপ",
    routes: "লমবীশিং",
    vehicles: "গারিশিং",
    shipments: "পোৎ-চৈ",
    accessibility: "চৎথোক-চৎশিন",
    alerts: "চেকশিনৱা",
    weather: "নোং-নুংশিৎ",
    fieldReports: "ফিল্ড রিপোর্ত",
    emergencyOps: "জরুরি ওপরেসন",
    analytics: "এনালিটিক্স",
    profile: "প্রোফাইল",
    statusOperational: "ওপরেস্নেল",
    roadAccessibility: "লমবী ফীভম",
    activeDisruptions: "অপনবা",
    vehiclesInTransit: "চৎলিবা গারি",
    activeShipments: "এক্টিভ শিপমেন্ত",
    delayedShipments: "থেন্থখিবা পোৎলম",
    highRiskCorridors: "লমবী খুদোংথিনিংঙাই",
    aiRiskDetection: "এআই রিক্স ডিটেক্সন",
    viewOnMap: "মেপতা য়েংবিয়ু",
    restrictedAccess: "রেষ্ট্রিক্টেড",
    verifyIdentity: "আইদেন্টিটি ভেরিফাই",
    findRoute: "লমবী থিবিয়ু",
    offlineMode: "ওফলাইন",
    onlineMode: "ওনলাইন",
  },
};
