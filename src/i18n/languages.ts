export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  badge: string;
  region: string;
}

export const AVAILABLE_LANGUAGES: LanguageOption[] = [
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', badge: 'தமி', region: 'Tamil Nadu & Puducherry' },
  { code: 'en', name: 'English', nativeName: 'English', badge: 'EN', region: 'Pan-India / Global' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', badge: 'हि', region: 'Northern & Central India' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', badge: 'తె', region: 'Andhra Pradesh & Telangana' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', badge: 'ಕ', region: 'Karnataka' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', badge: 'മ', region: 'Kerala' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', badge: 'বাং', region: 'West Bengal, Tripura & Assam' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', badge: 'म', region: 'Maharashtra' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', badge: 'অ', region: 'Assam & North East' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', badge: 'ગુ', region: 'Gujarat' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', badge: 'ਪੰ', region: 'Punjab' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', badge: 'ଓ', region: 'Odisha' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', badge: 'رد', region: 'Pan-India' },
];

export type LanguageCode = 'en' | 'ta' | 'hi' | 'te' | 'kn' | 'ml' | 'bn' | 'mr' | 'as' | 'gu' | 'pa' | 'or' | 'ur';
