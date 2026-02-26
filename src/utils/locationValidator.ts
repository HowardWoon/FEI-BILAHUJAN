/**
 * Malaysia Location Validator
 * Validates if user input is relevant to Malaysian locations.
 * Strategy: ONLY block known non-Malaysian places. Accept anything unrecognised
 * — the geocoder always appends ", Malaysia" so it self-corrects.
 */

// Malaysian states
const MALAYSIAN_STATES = [
  'johor', 'kedah', 'kelantan', 'melaka', 'negeri sembilan',
  'pahang', 'penang', 'perak', 'perlis', 'sabah', 'sarawak',
  'selangor', 'terengganu', 'kuala lumpur', 'labuan', 'putrajaya',
  'malacca', 'malaya', 'kl', 'jb', 'ipoh'
];

// Major Malaysian cities and areas (non-exhaustive — validator never blocks unknowns)
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
  'balakong', 'bukit jalil', 'kinrara', 'serdang', 'upm',
  'presint', 'taman', 'jalan', 'kampung', 'kuala', 'sungai', 'bukit',
  'batu', 'tanjung', 'teluk', 'pulau', 'pantai', 'bandar',
  // Additional common towns
  'bahau', 'tampin', 'gemas', 'rembau', 'kuala pilah', 'johol',
  'labis', 'chaah', 'yong peng', 'simpang renggam', 'benut',
  'senggarang', 'parit raja', 'parit sulong', 'bukit gambir',
  'batu 9', 'pekan nanas', 'kukup', 'tanjung piai', 'bekok',
  'kluang', 'layang', 'renggam', 'pulai chondong', 'machang',
  'keningau', 'beaufort', 'kudat', 'papar', 'tuaran', 'ranau',
  'semporna', 'kunak', 'tongod', 'kinabatangan', 'beluran',
  'pitas', 'kota belud', 'penampang', 'putatan', 'membakut',
  'limbang', 'lawas', 'sundar', 'bintulu', 'sibu', 'sarikei',
  'kapit', 'mukah', 'dalat', 'oya', 'balingian', 'tatau',
  'bau', 'serian', 'samarahan', 'asajaya', 'simunjan', 'sri aman',
  'betong', 'saratok', 'roban', 'lingga', 'pusa', 'kabong',
  'lubok antu', 'engkilili', 'lachau', 'spaoh', 'julau', 'pakan',
  'kanowit', 'selangau', 'tanjung manis', 'balingian', 'belawai',
  'daro', 'matu', 'bintangor', 'sematan', 'lundu', 'tebedu'
];

// ONLY reject clearly non-Malaysian countries and major foreign cities.
// Do NOT add generic or short strings — false positives hurt real Malaysian places.
const NON_MALAYSIAN_KEYWORDS = [
  // Foreign countries
  'singapore', 'indonesia', 'thailand', 'brunei', 'vietnam', 'philippines',
  'china', 'japan', 'korea', 'india', 'pakistan', 'bangladesh', 'myanmar',
  'cambodia', 'laos', 'australia', 'new zealand', 'usa', 'america',
  'united states', 'united kingdom', 'europe', 'africa', 'canada',
  'mexico', 'brazil', 'argentina', 'russia', 'turkey',

  // Major foreign cities (explicit full names only to avoid false positives)
  'jakarta', 'bangkok', 'manila', 'hanoi', 'ho chi minh', 'beijing',
  'shanghai', 'guangzhou', 'tokyo', 'osaka', 'seoul', 'busan',
  'mumbai', 'delhi', 'karachi', 'dhaka', 'yangon', 'naypyidaw',
  'phnom penh', 'vientiane', 'sydney', 'melbourne', 'auckland',
  'london', 'paris', 'berlin', 'madrid', 'rome', 'amsterdam',
  'new york', 'los angeles', 'chicago', 'toronto', 'dubai',
  'abu dhabi', 'riyadh', 'jeddah', 'mecca', 'medina', 'dammam',
  'hong kong', 'macau', 'taipei', 'tainan', 'taichung',

  // Country codes / abbreviations
  'ksa', 'saudi arabia',
];

/**
 * Validate if a location string is relevant to Malaysia.
 * Only blocks KNOWN non-Malaysian places. All unrecognised inputs are allowed
 * through — the geocoder enforces the real boundary via ", Malaysia" suffix.
 */
export const isMalaysianLocation = (location: string): boolean => {
  const normalized = location.toLowerCase().trim();

  // Very short input — user still typing, allow through
  if (!normalized || normalized.length < 2) return true;

  // Block known non-Malaysian places (exact substring match on full keyword only)
  for (const keyword of NON_MALAYSIAN_KEYWORDS) {
    // Use word-boundary-style check: keyword must appear as a whole word
    const regex = new RegExp(`(^|\\s|,)${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|,|$)`, 'i');
    if (regex.test(normalized)) {
      return false;
    }
  }

  // Explicitly pass known Malaysian states
  for (const state of MALAYSIAN_STATES) {
    if (normalized.includes(state)) return true;
  }

  // Explicitly pass known Malaysian cities
  for (const city of MALAYSIAN_CITIES) {
    if (normalized.includes(city)) return true;
  }

  // IMPORTANT: For anything unrecognised, allow it through.
  // Malaysia has thousands of towns, kampungs and localities not in our list.
  // The geocoder appends ", Malaysia" which handles the real geographic constraint.
  return true;
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
    'Kuching',
    'Taiping',
    'Seremban',
  ];
};
