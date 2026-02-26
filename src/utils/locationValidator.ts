/**
 * Malaysia Location Validator
 * Validates if user input is relevant to Malaysian locations
 */

// Malaysian states
const MALAYSIAN_STATES = [
  'johor', 'kedah', 'kelantan', 'melaka', 'negeri sembilan',
  'pahang', 'penang', 'perak', 'perlis', 'sabah', 'sarawak',
  'selangor', 'terengganu', 'kuala lumpur', 'labuan', 'putrajaya',
  'malacca', 'malaya', 'kl', 'jb', 'ipoh'
];

// Major Malaysian cities and areas
const MALAYSIAN_CITIES = [
  'kuala lumpur', 'george town', 'ipoh', 'shah alam', 'petaling jaya',
  'johor bahru', 'malacca', 'alor setar', 'miri', 'kuching', 'kota kinabalu',
  'sandakan', 'tawau', 'lahad datu', 'kuantan', 'kuala terengganu',
  'kota bharu', 'kangar', 'seremban', 'putrajaya', 'cyberjaya',
  'subang jaya', 'klang', 'ampang', 'cheras', 'puchong', 'sungai buloh',
  'rawang', 'semenyih', 'selayang', 'damansara', 'bangi', 'kajang',
  'nilai', 'port dickson', 'melaka', 'jasin', 'alor gajah', 'tangkak',
  'segamat', 'muar', 'batu pahat', 'pontian', 'kulai', 'pasir gudang',
  'skudai', 'ulu tiram', 'masai', 'plentong', 'larkin', 'tebrau',
  'bukit indah', 'nusajaya', 'gelang patah', 'senai', 'ayer hitam',
  'kluang', 'mersing', 'tanjung sepat', 'butterworth', 'bukit mertajam',
  'nibong tebal', 'kepala batas', 'bayan lepas', 'balik pulau',
  'teluk kumbar', 'tanjung bungah', 'batu ferringhi', 'air itam',
  'kampung relau', 'sungai petani', 'kulim', 'baling', 'langkawi',
  'jitra', 'kuala kedah', 'simpang empat', 'pendang', 'yan', 'padang serai',
  'taiping', 'teluk intan', 'kuala kangsar', 'batu gajah', 'lumut',
  'sitiawan', 'kampar', 'parit buntar', 'bidor', 'tanjung malim',
  'slim river', 'tapah', 'tanah rata', 'cameron highlands', 'betong',
  'bagan serai', 'kuala sepetang', 'pantai remis', 'temerloh', 'bentong',
  'raub', 'pekan', 'jerantut', 'lipis', 'maran', 'rompin', 'chenor',
  'mentakab', 'kemaman', 'dungun', 'marang', 'setiu', 'hulu terengganu',
  'besut', 'pasir puteh', 'bachok', 'machang', 'tanah merah', 'jeli',
  'gua musang', 'kuala krai', 'tumpat', 'rantau panjang', 'wakaf bharu',
  'port klang', 'banting', 'kuala selangor', 'sabak bernam', 'kuala kubu bharu',
  'batang kali', 'janda baik', 'ulu yam', 'sepang', 'dengkil', 'seri kembangan',
  'balakong', 'bukit jalil', 'kinrara', 'serdang', 'upm', 'putrajaya',
  'presint', 'taman', 'jalan', 'kampung', 'kuala', 'sungai', 'bukit',
  'batu', 'tanjung', 'teluk', 'pulau', 'pantai', 'bandar'
];

// Non-Malaysian keywords to flag
const NON_MALAYSIAN_KEYWORDS = [
  // Countries
  'singapore', 'indonesia', 'thailand', 'brunei', 'vietnam', 'philippines',
  'china', 'japan', 'korea', 'india', 'pakistan', 'bangladesh', 'myanmar',
  'cambodia', 'laos', 'australia', 'new zealand', 'usa', 'uk', 'america',
  'europe', 'africa', 'canada', 'mexico', 'brazil', 'argentina', 'russia',
  
  // Major non-Malaysian cities
  'singapore', 'jakarta', 'bangkok', 'manila', 'hanoi', 'beijing', 'shanghai',
  'tokyo', 'seoul', 'delhi', 'mumbai', 'karachi', 'dhaka', 'yangon',
  'phnom penh', 'vientiane', 'sydney', 'melbourne', 'london', 'paris',
  'new york', 'los angeles', 'dubai', 'hong kong', 'taipei', 'macau',
  
  // Country codes
  'sg', 'id', 'th', 'bn', 'vn', 'ph', 'cn', 'jp', 'kr', 'in', 'pk', 'bd',
  
  // Saudi Arabia specific (from user's screenshot showing "ksa")
  'ksa', 'saudi', 'arabia', 'riyadh', 'jeddah', 'mecca', 'medina', 'dammam'
];

/**
 * Validate if a location string is relevant to Malaysia
 */
export const isMalaysianLocation = (location: string): boolean => {
  const normalized = location.toLowerCase().trim();
  
  // Empty input is valid (user still typing)
  if (!normalized || normalized.length < 2) return true;
  
  // Check for non-Malaysian keywords first (higher priority)
  for (const keyword of NON_MALAYSIAN_KEYWORDS) {
    if (normalized.includes(keyword)) {
      return false;
    }
  }
  
  // Check for Malaysian states
  for (const state of MALAYSIAN_STATES) {
    if (normalized.includes(state)) {
      return true;
    }
  }
  
  // Check for Malaysian cities
  for (const city of MALAYSIAN_CITIES) {
    if (normalized.includes(city)) {
      return true;
    }
  }
  
  // If location is very short (2-3 chars), assume valid (still typing)
  if (normalized.length <= 3) return true;
  
  // For longer strings without matches, flag as potentially non-Malaysian
  // But allow if it contains common Malaysian location words
  const commonWords = ['taman', 'jalan', 'kampung', 'kuala', 'sungai', 'bukit', 'batu', 'teluk', 'pantai', 'bandar'];
  for (const word of commonWords) {
    if (normalized.includes(word)) {
      return true;
    }
  }
  
  // If we reach here with a long string, it's likely not Malaysian
  return normalized.length < 5;
};

/**
 * Get suggestion message for non-Malaysian locations
 */
export const getMalaysiaLocationWarning = (): string => {
  return "⚠️ This app only covers locations in Malaysia. Please enter a Malaysian location (e.g., Kuala Lumpur, Johor, Penang).";
};

/**
 * Get example Malaysian locations for help
 */
export const getMalaysianLocationExamples = (): string[] => {
  return [
    'Kuala Lumpur',
    'Johor Bahru',
    'Penang',
    'Shah Alam',
    'Ipoh',
    'Melaka',
    'Kota Kinabalu',
    'Kuching'
  ];
};
