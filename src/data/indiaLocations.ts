import { IndiaLocation, IndiaRegion } from '../types';

export const INDIA_LOCATIONS: IndiaLocation[] = [
  // ==================== SOUTH INDIA ====================
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    region: 'South',
    x: 48,
    y: 78,
    lat: 13.0827,
    lng: 80.2707,
    elevationMeters: 6,
    terrainType: 'Coastal',
    majorHighways: ['NH-48', 'NH-16', 'NH-32'],
    weather: { tempC: 32, condition: 'Humid & Sunny', rainfallMm: 2, windKmh: 18, humidity: 82 }
  },
  {
    id: 'coimbatore',
    name: 'Coimbatore',
    state: 'Tamil Nadu',
    region: 'South',
    x: 36,
    y: 85,
    lat: 11.0168,
    lng: 76.9558,
    elevationMeters: 411,
    terrainType: 'Western Ghats',
    majorHighways: ['NH-544', 'NH-81', 'NH-181'],
    weather: { tempC: 28, condition: 'Pleasant Breeze', rainfallMm: 6, windKmh: 14, humidity: 68 }
  },
  {
    id: 'madurai',
    name: 'Madurai',
    state: 'Tamil Nadu',
    region: 'South',
    x: 39,
    y: 89,
    lat: 9.9252,
    lng: 78.1198,
    elevationMeters: 101,
    terrainType: 'Plains',
    majorHighways: ['NH-44', 'NH-85', 'NH-38'],
    weather: { tempC: 34, condition: 'Hot & Dry', rainfallMm: 0, windKmh: 11, humidity: 55 }
  },
  {
    id: 'tiruchirappalli',
    name: 'Tiruchirappalli (Trichy)',
    state: 'Tamil Nadu',
    region: 'South',
    x: 42,
    y: 84,
    lat: 10.7905,
    lng: 78.7047,
    elevationMeters: 88,
    terrainType: 'Plains',
    majorHighways: ['NH-83', 'NH-38', 'NH-45'],
    weather: { tempC: 33, condition: 'Clear Sky', rainfallMm: 1, windKmh: 12, humidity: 60 }
  },
  {
    id: 'salem',
    name: 'Salem',
    state: 'Tamil Nadu',
    region: 'South',
    x: 40,
    y: 81,
    lat: 11.6643,
    lng: 78.146,
    elevationMeters: 278,
    terrainType: 'Plateau',
    majorHighways: ['NH-44', 'NH-544', 'NH-79'],
    weather: { tempC: 31, condition: 'Partly Cloudy', rainfallMm: 3, windKmh: 13, humidity: 64 }
  },
  {
    id: 'kanyakumari',
    name: 'Kanyakumari',
    state: 'Tamil Nadu',
    region: 'South',
    x: 38,
    y: 96,
    lat: 8.0883,
    lng: 77.5385,
    elevationMeters: 30,
    terrainType: 'Coastal',
    majorHighways: ['NH-44 (Terminus)', 'NH-66'],
    weather: { tempC: 29, condition: 'Coastal Wind', rainfallMm: 8, windKmh: 28, humidity: 85 }
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    region: 'South',
    x: 39,
    y: 78,
    lat: 12.9716,
    lng: 77.5946,
    elevationMeters: 920,
    terrainType: 'Plateau',
    majorHighways: ['NH-44', 'NH-48', 'NH-75', 'Bangalore-Mysore Expressway'],
    weather: { tempC: 26, condition: 'Mild Overcast', rainfallMm: 5, windKmh: 15, humidity: 72 }
  },
  {
    id: 'mysuru',
    name: 'Mysuru',
    state: 'Karnataka',
    region: 'South',
    x: 36,
    y: 81,
    lat: 12.2958,
    lng: 76.6394,
    elevationMeters: 763,
    terrainType: 'Plateau',
    majorHighways: ['NH-275', 'NH-766'],
    weather: { tempC: 27, condition: 'Partly Cloudy', rainfallMm: 4, windKmh: 12, humidity: 70 }
  },
  {
    id: 'mangaluru',
    name: 'Mangaluru',
    state: 'Karnataka',
    region: 'South',
    x: 30,
    y: 79,
    lat: 12.9141,
    lng: 74.856,
    elevationMeters: 22,
    terrainType: 'Coastal',
    majorHighways: ['NH-66', 'NH-75 (Shiradi Ghat Corridor)'],
    weather: { tempC: 29, condition: 'Monsoon Showers', rainfallMm: 38, windKmh: 22, humidity: 91 }
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    region: 'South',
    x: 43,
    y: 65,
    lat: 17.385,
    lng: 78.4867,
    elevationMeters: 542,
    terrainType: 'Plateau',
    majorHighways: ['NH-44', 'NH-65', 'NH-765', 'Outer Ring Road (ORR)'],
    weather: { tempC: 31, condition: 'Clear Sky', rainfallMm: 0, windKmh: 14, humidity: 58 }
  },
  {
    id: 'visakhapatnam',
    name: 'Visakhapatnam (Vizag)',
    state: 'Andhra Pradesh',
    region: 'South',
    x: 58,
    y: 66,
    lat: 17.6868,
    lng: 83.2185,
    elevationMeters: 45,
    terrainType: 'Coastal',
    majorHighways: ['NH-16 (Golden Quadrilateral)'],
    weather: { tempC: 31, condition: 'Humid Sea Breeze', rainfallMm: 4, windKmh: 20, humidity: 80 }
  },
  {
    id: 'vijayawada',
    name: 'Vijayawada',
    state: 'Andhra Pradesh',
    region: 'South',
    x: 49,
    y: 70,
    lat: 16.5062,
    lng: 80.648,
    elevationMeters: 39,
    terrainType: 'Plains',
    majorHighways: ['NH-16', 'NH-65'],
    weather: { tempC: 33, condition: 'Sunny', rainfallMm: 2, windKmh: 13, humidity: 69 }
  },
  {
    id: 'kochi',
    name: 'Kochi (Cochin)',
    state: 'Kerala',
    region: 'South',
    x: 34,
    y: 87,
    lat: 9.9312,
    lng: 76.2673,
    elevationMeters: 2,
    terrainType: 'Coastal',
    majorHighways: ['NH-66', 'NH-544'],
    weather: { tempC: 28, condition: 'Humid Coastal Rain', rainfallMm: 42, windKmh: 24, humidity: 93 }
  },
  {
    id: 'thiruvananthapuram',
    name: 'Thiruvananthapuram (Trivandrum)',
    state: 'Kerala',
    region: 'South',
    x: 35,
    y: 93,
    lat: 8.5241,
    lng: 76.9366,
    elevationMeters: 10,
    terrainType: 'Coastal',
    majorHighways: ['NH-66'],
    weather: { tempC: 29, condition: 'Intermittent Showers', rainfallMm: 22, windKmh: 19, humidity: 88 }
  },
  {
    id: 'kozhikode',
    name: 'Kozhikode (Calicut)',
    state: 'Kerala',
    region: 'South',
    x: 32,
    y: 83,
    lat: 11.2588,
    lng: 75.7804,
    elevationMeters: 1,
    terrainType: 'Coastal',
    majorHighways: ['NH-66', 'NH-766 (Wayanad Ghat Corridor)'],
    weather: { tempC: 28, condition: 'Coastal Mist', rainfallMm: 34, windKmh: 17, humidity: 90 }
  },

  // ==================== NORTH INDIA ====================
  {
    id: 'delhi',
    name: 'New Delhi / NCR',
    state: 'Delhi',
    region: 'North',
    x: 38,
    y: 27,
    lat: 28.6139,
    lng: 77.209,
    elevationMeters: 216,
    terrainType: 'Plains',
    majorHighways: ['NH-44', 'NH-48', 'Eastern Peripheral Expressway', 'NE-4'],
    weather: { tempC: 34, condition: 'Hazy Sun', rainfallMm: 0, windKmh: 16, humidity: 48 }
  },
  {
    id: 'chandigarh',
    name: 'Chandigarh',
    state: 'Punjab / Haryana',
    region: 'North',
    x: 35,
    y: 22,
    lat: 30.7333,
    lng: 76.7794,
    elevationMeters: 321,
    terrainType: 'Plains',
    majorHighways: ['NH-5', 'NH-152D (Trans-Haryana)', 'NH-44 Link'],
    weather: { tempC: 31, condition: 'Clear', rainfallMm: 0, windKmh: 12, humidity: 52 }
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    region: 'North',
    x: 32,
    y: 32,
    lat: 26.9124,
    lng: 75.7873,
    elevationMeters: 431,
    terrainType: 'Plains',
    majorHighways: ['NH-48', 'NH-21', 'Delhi-Mumbai Expressway Spur'],
    weather: { tempC: 36, condition: 'Sunny & Dry', rainfallMm: 0, windKmh: 15, humidity: 35 }
  },
  {
    id: 'lucknow',
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    region: 'North',
    x: 48,
    y: 32,
    lat: 26.8467,
    lng: 80.9462,
    elevationMeters: 123,
    terrainType: 'Plains',
    majorHighways: ['NH-27', 'Agra-Lucknow Expressway', 'Purvanchal Expressway'],
    weather: { tempC: 33, condition: 'Warm & Sunny', rainfallMm: 2, windKmh: 10, humidity: 62 }
  },
  {
    id: 'kanpur',
    name: 'Kanpur',
    state: 'Uttar Pradesh',
    region: 'North',
    x: 47,
    y: 34,
    lat: 26.4499,
    lng: 80.3319,
    elevationMeters: 126,
    terrainType: 'Plains',
    majorHighways: ['NH-19', 'NH-27'],
    weather: { tempC: 34, condition: 'Sunny', rainfallMm: 1, windKmh: 11, humidity: 59 }
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    region: 'North',
    x: 54,
    y: 37,
    lat: 25.3176,
    lng: 82.9739,
    elevationMeters: 81,
    terrainType: 'Plains',
    majorHighways: ['NH-19 (Grand Trunk Corridor)', 'NH-31'],
    weather: { tempC: 33, condition: 'Partly Cloudy', rainfallMm: 4, windKmh: 9, humidity: 67 }
  },
  {
    id: 'agra',
    name: 'Agra',
    state: 'Uttar Pradesh',
    region: 'North',
    x: 40,
    y: 31,
    lat: 27.1767,
    lng: 78.0081,
    elevationMeters: 169,
    terrainType: 'Plains',
    majorHighways: ['Yamuna Expressway', 'Agra-Lucknow Expressway', 'NH-19', 'NH-44'],
    weather: { tempC: 35, condition: 'Sunny', rainfallMm: 0, windKmh: 13, humidity: 46 }
  },
  {
    id: 'dehradun',
    name: 'Dehradun',
    state: 'Uttarakhand',
    region: 'North',
    x: 40,
    y: 20,
    lat: 30.3165,
    lng: 78.0322,
    elevationMeters: 640,
    terrainType: 'Himalayas',
    majorHighways: ['NH-7', 'NH-307 (Mohand Pass)'],
    weather: { tempC: 26, condition: 'Mountain Showers', rainfallMm: 28, windKmh: 16, humidity: 82 }
  },
  {
    id: 'shimla',
    name: 'Shimla',
    state: 'Himachal Pradesh',
    region: 'North',
    x: 37,
    y: 19,
    lat: 31.1048,
    lng: 77.1734,
    elevationMeters: 2276,
    terrainType: 'Himalayas',
    majorHighways: ['NH-5 (Hindustan-Tibet Road)'],
    weather: { tempC: 17, condition: 'Foggy Rain', rainfallMm: 48, windKmh: 24, humidity: 91 }
  },
  {
    id: 'manali',
    name: 'Manali',
    state: 'Himachal Pradesh',
    region: 'North',
    x: 36,
    y: 15,
    lat: 32.2396,
    lng: 77.1887,
    elevationMeters: 2050,
    terrainType: 'Himalayas',
    majorHighways: ['NH-3 (Atal Tunnel & Leh Corridor)'],
    weather: { tempC: 14, condition: 'Hill Rain & Cloud', rainfallMm: 56, windKmh: 22, humidity: 88 }
  },
  {
    id: 'srinagar',
    name: 'Srinagar',
    state: 'Jammu & Kashmir',
    region: 'North',
    x: 31,
    y: 11,
    lat: 34.0837,
    lng: 74.7973,
    elevationMeters: 1585,
    terrainType: 'Himalayas',
    majorHighways: ['NH-44 (Banihal Qazigund Tunnel)'],
    weather: { tempC: 18, condition: 'Overcast & Cool', rainfallMm: 14, windKmh: 15, humidity: 76 }
  },
  {
    id: 'leh',
    name: 'Leh-Ladakh',
    state: 'Ladakh',
    region: 'North',
    x: 39,
    y: 9,
    lat: 34.1526,
    lng: 77.5771,
    elevationMeters: 3524,
    terrainType: 'Himalayas',
    majorHighways: ['NH-1 (Zoji La Pass)', 'NH-3 (Manali-Leh Highway)'],
    weather: { tempC: 7, condition: 'High Altitude Gusts', rainfallMm: 2, windKmh: 35, humidity: 32 }
  },
  {
    id: 'amritsar',
    name: 'Amritsar',
    state: 'Punjab',
    region: 'North',
    x: 30,
    y: 20,
    lat: 31.634,
    lng: 74.8723,
    elevationMeters: 234,
    terrainType: 'Plains',
    majorHighways: ['NH-3', 'NH-54'],
    weather: { tempC: 32, condition: 'Sunny', rainfallMm: 0, windKmh: 14, humidity: 54 }
  },

  // ==================== WEST INDIA ====================
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    region: 'West',
    x: 22,
    y: 58,
    lat: 19.076,
    lng: 72.8777,
    elevationMeters: 14,
    terrainType: 'Coastal',
    majorHighways: ['NH-48', 'Mumbai-Pune Expressway', 'Samruddhi Mahamarg', 'NH-66'],
    weather: { tempC: 30, condition: 'Monsoon Drizzle', rainfallMm: 25, windKmh: 24, humidity: 88 }
  },
  {
    id: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    region: 'West',
    x: 25,
    y: 61,
    lat: 18.5204,
    lng: 73.8567,
    elevationMeters: 560,
    terrainType: 'Western Ghats',
    majorHighways: ['Mumbai-Pune Expressway', 'NH-48', 'NH-65'],
    weather: { tempC: 27, condition: 'Ghat Breeze & Mist', rainfallMm: 12, windKmh: 18, humidity: 75 }
  },
  {
    id: 'nagpur',
    name: 'Nagpur',
    state: 'Maharashtra',
    region: 'West',
    x: 42,
    y: 50,
    lat: 21.1458,
    lng: 79.0882,
    elevationMeters: 310,
    terrainType: 'Plateau',
    majorHighways: ['NH-44', 'NH-53', 'Samruddhi Mahamarg (Zero Mile Hub)'],
    weather: { tempC: 34, condition: 'Dry Heat', rainfallMm: 0, windKmh: 12, humidity: 45 }
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    state: 'Gujarat',
    region: 'West',
    x: 20,
    y: 44,
    lat: 23.0225,
    lng: 72.5714,
    elevationMeters: 53,
    terrainType: 'Plains',
    majorHighways: ['NH-48', 'NE-1 (Ahmedabad-Vadodara)', 'NH-147'],
    weather: { tempC: 35, condition: 'Sunny', rainfallMm: 0, windKmh: 16, humidity: 52 }
  },
  {
    id: 'surat',
    name: 'Surat',
    state: 'Gujarat',
    region: 'West',
    x: 21,
    y: 50,
    lat: 21.1702,
    lng: 72.8311,
    elevationMeters: 13,
    terrainType: 'Coastal',
    majorHighways: ['NH-48 (Delhi-Mumbai Expressway Link)'],
    weather: { tempC: 32, condition: 'Humid & Overcast', rainfallMm: 8, windKmh: 19, humidity: 82 }
  },
  {
    id: 'vadodara',
    name: 'Vadodara',
    state: 'Gujarat',
    region: 'West',
    x: 22,
    y: 46,
    lat: 22.3072,
    lng: 73.1812,
    elevationMeters: 39,
    terrainType: 'Plains',
    majorHighways: ['NH-48', 'NE-1'],
    weather: { tempC: 33, condition: 'Clear Sky', rainfallMm: 1, windKmh: 14, humidity: 60 }
  },
  {
    id: 'panaji',
    name: 'Panaji (Goa)',
    state: 'Goa',
    region: 'West',
    x: 26,
    y: 72,
    lat: 15.4909,
    lng: 73.8278,
    elevationMeters: 7,
    terrainType: 'Coastal',
    majorHighways: ['NH-66', 'NH-748 (Chorla Ghat Road)'],
    weather: { tempC: 29, condition: 'Tropical Showers', rainfallMm: 35, windKmh: 21, humidity: 91 }
  },

  // ==================== EAST INDIA ====================
  {
    id: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    region: 'East',
    x: 70,
    y: 50,
    lat: 22.5726,
    lng: 88.3639,
    elevationMeters: 9,
    terrainType: 'Coastal',
    majorHighways: ['NH-16', 'NH-19', 'NH-12'],
    weather: { tempC: 32, condition: 'Humid & Overcast', rainfallMm: 15, windKmh: 17, humidity: 86 }
  },
  {
    id: 'siliguri',
    name: 'Siliguri',
    state: 'West Bengal',
    region: 'East',
    x: 69,
    y: 35,
    lat: 26.7271,
    lng: 88.3953,
    elevationMeters: 122,
    terrainType: 'Plains',
    majorHighways: ["NH-27 (Chicken's Neck Corridor)", 'NH-10 (Sikkim Link)'],
    weather: { tempC: 28, condition: 'Heavy Rain Showers', rainfallMm: 62, windKmh: 19, humidity: 92 }
  },
  {
    id: 'bhubaneswar',
    name: 'Bhubaneswar',
    state: 'Odisha',
    region: 'East',
    x: 63,
    y: 57,
    lat: 20.2961,
    lng: 85.8245,
    elevationMeters: 45,
    terrainType: 'Coastal',
    majorHighways: ['NH-16', 'NH-316'],
    weather: { tempC: 33, condition: 'Warm & Humid', rainfallMm: 6, windKmh: 16, humidity: 79 }
  },
  {
    id: 'patna',
    name: 'Patna',
    state: 'Bihar',
    region: 'East',
    x: 58,
    y: 36,
    lat: 25.5941,
    lng: 85.1376,
    elevationMeters: 53,
    terrainType: 'Plains',
    majorHighways: ['NH-31', 'NH-19', 'Purvanchal Corridor link'],
    weather: { tempC: 33, condition: 'Hazy Sun', rainfallMm: 4, windKmh: 11, humidity: 71 }
  },
  {
    id: 'ranchi',
    name: 'Ranchi',
    state: 'Jharkhand',
    region: 'East',
    x: 60,
    y: 44,
    lat: 23.3441,
    lng: 85.3096,
    elevationMeters: 651,
    terrainType: 'Plateau',
    majorHighways: ['NH-33', 'NH-20'],
    weather: { tempC: 28, condition: 'Mild Rain', rainfallMm: 12, windKmh: 14, humidity: 78 }
  },
  {
    id: 'jamshedpur',
    name: 'Jamshedpur',
    state: 'Jharkhand',
    region: 'East',
    x: 64,
    y: 47,
    lat: 22.8046,
    lng: 86.2029,
    elevationMeters: 159,
    terrainType: 'Plateau',
    majorHighways: ['NH-33'],
    weather: { tempC: 31, condition: 'Overcast', rainfallMm: 8, windKmh: 13, humidity: 74 }
  },

  // ==================== CENTRAL INDIA ====================
  {
    id: 'bhopal',
    name: 'Bhopal',
    state: 'Madhya Pradesh',
    region: 'Central',
    x: 35,
    y: 45,
    lat: 23.2599,
    lng: 77.4126,
    elevationMeters: 527,
    terrainType: 'Plateau',
    majorHighways: ['NH-46', 'NH-146'],
    weather: { tempC: 32, condition: 'Partly Cloudy', rainfallMm: 3, windKmh: 12, humidity: 62 }
  },
  {
    id: 'indore',
    name: 'Indore',
    state: 'Madhya Pradesh',
    region: 'Central',
    x: 30,
    y: 47,
    lat: 22.7196,
    lng: 75.8577,
    elevationMeters: 553,
    terrainType: 'Plateau',
    majorHighways: ['NH-52', 'NH-47'],
    weather: { tempC: 31, condition: 'Clear Sky', rainfallMm: 0, windKmh: 15, humidity: 55 }
  },
  {
    id: 'raipur',
    name: 'Raipur',
    state: 'Chhattisgarh',
    region: 'Central',
    x: 52,
    y: 52,
    lat: 21.2514,
    lng: 81.6296,
    elevationMeters: 298,
    terrainType: 'Plains',
    majorHighways: ['NH-53', 'NH-30'],
    weather: { tempC: 32, condition: 'Sunny', rainfallMm: 5, windKmh: 11, humidity: 68 }
  },
  {
    id: 'jabalpur',
    name: 'Jabalpur',
    state: 'Madhya Pradesh',
    region: 'Central',
    x: 44,
    y: 44,
    lat: 23.1815,
    lng: 79.9864,
    elevationMeters: 411,
    terrainType: 'Plateau',
    majorHighways: ['NH-30', 'NH-34'],
    weather: { tempC: 31, condition: 'Scattered Showers', rainfallMm: 7, windKmh: 10, humidity: 69 }
  },

  // ==================== NORTHEAST INDIA (NER) ====================
  {
    id: 'guwahati',
    name: 'Guwahati',
    state: 'Assam',
    region: 'Northeast',
    x: 80,
    y: 36,
    lat: 26.1445,
    lng: 91.7362,
    elevationMeters: 55,
    terrainType: 'Plains',
    majorHighways: ['NH-27 (East-West Corridor)', 'NH-15', 'NH-6'],
    weather: { tempC: 28, condition: 'Partly Cloudy', rainfallMm: 12, windKmh: 14, humidity: 76 }
  },
  {
    id: 'shillong',
    name: 'Shillong',
    state: 'Meghalaya',
    region: 'Northeast',
    x: 81,
    y: 39,
    lat: 25.5788,
    lng: 91.8933,
    elevationMeters: 1496,
    terrainType: 'NER Hills',
    majorHighways: ['NH-6', 'SH-5'],
    weather: { tempC: 18, condition: 'Heavy Mist & Rain', rainfallMm: 68, windKmh: 24, humidity: 92 }
  },
  {
    id: 'silchar',
    name: 'Silchar',
    state: 'Assam (Barak Valley)',
    region: 'Northeast',
    x: 86,
    y: 42,
    lat: 24.8333,
    lng: 92.7789,
    elevationMeters: 25,
    terrainType: 'Plains',
    majorHighways: ['NH-306', 'NH-27 (via Haflong)', 'NH-8'],
    weather: { tempC: 27, condition: 'Intermittent Showers', rainfallMm: 35, windKmh: 16, humidity: 88 }
  },
  {
    id: 'agartala',
    name: 'Agartala',
    state: 'Tripura',
    region: 'Northeast',
    x: 80,
    y: 46,
    lat: 23.8315,
    lng: 91.2868,
    elevationMeters: 20,
    terrainType: 'Plains',
    majorHighways: ['NH-8', 'Indo-Bangla ICP Corridor'],
    weather: { tempC: 30, condition: 'Overcast', rainfallMm: 8, windKmh: 10, humidity: 79 }
  },
  {
    id: 'aizawl',
    name: 'Aizawl',
    state: 'Mizoram',
    region: 'Northeast',
    x: 86,
    y: 46,
    lat: 23.7271,
    lng: 92.7176,
    elevationMeters: 1132,
    terrainType: 'NER Hills',
    majorHighways: ['NH-306', 'NH-6'],
    weather: { tempC: 21, condition: 'Foggy Rain', rainfallMm: 42, windKmh: 19, humidity: 90 }
  },
  {
    id: 'imphal',
    name: 'Imphal',
    state: 'Manipur',
    region: 'Northeast',
    x: 91,
    y: 41,
    lat: 24.817,
    lng: 93.9368,
    elevationMeters: 786,
    terrainType: 'NER Hills',
    majorHighways: ['NH-2 (Asian Highway 1)', 'NH-37'],
    weather: { tempC: 23, condition: 'Moderate Showers', rainfallMm: 28, windKmh: 15, humidity: 84 }
  },
  {
    id: 'kohima',
    name: 'Kohima',
    state: 'Nagaland',
    region: 'Northeast',
    x: 92,
    y: 38,
    lat: 25.6751,
    lng: 94.1086,
    elevationMeters: 1444,
    terrainType: 'NER Hills',
    majorHighways: ['NH-29', 'NH-2'],
    weather: { tempC: 19, condition: 'Continuous Drizzle', rainfallMm: 51, windKmh: 22, humidity: 93 }
  },
  {
    id: 'dimapur',
    name: 'Dimapur',
    state: 'Nagaland',
    region: 'Northeast',
    x: 89,
    y: 37,
    lat: 25.9094,
    lng: 93.7265,
    elevationMeters: 145,
    terrainType: 'Plains',
    majorHighways: ['NH-29', 'NH-36'],
    weather: { tempC: 29, condition: 'Overcast', rainfallMm: 14, windKmh: 12, humidity: 80 }
  },
  {
    id: 'itanagar',
    name: 'Itanagar',
    state: 'Arunachal Pradesh',
    region: 'Northeast',
    x: 87,
    y: 32,
    lat: 27.0844,
    lng: 93.6053,
    elevationMeters: 750,
    terrainType: 'NER Hills',
    majorHighways: ['NH-415', 'NH-15 Spur'],
    weather: { tempC: 24, condition: 'Monsoon Showers', rainfallMm: 45, windKmh: 18, humidity: 89 }
  },
  {
    id: 'tawang',
    name: 'Tawang',
    state: 'Arunachal Pradesh',
    region: 'Northeast',
    x: 78,
    y: 30,
    lat: 27.5861,
    lng: 91.8653,
    elevationMeters: 3048,
    terrainType: 'Himalayas',
    majorHighways: ['NH-13 (Sela Tunnel Corridor)'],
    weather: { tempC: 9, condition: 'High Wind & Sleet', rainfallMm: 72, windKmh: 36, humidity: 96 }
  },
  {
    id: 'dibrugarh',
    name: 'Dibrugarh',
    state: 'Assam',
    region: 'Northeast',
    x: 94,
    y: 32,
    lat: 27.4728,
    lng: 94.912,
    elevationMeters: 108,
    terrainType: 'Plains',
    majorHighways: ['NH-2', 'Bogibeel Rail-Road Bridge'],
    weather: { tempC: 29, condition: 'Heavy Rain Warning', rainfallMm: 85, windKmh: 28, humidity: 95 }
  },
  {
    id: 'gangtok',
    name: 'Gangtok',
    state: 'Sikkim',
    region: 'Northeast',
    x: 72,
    y: 33,
    lat: 27.3389,
    lng: 88.6065,
    elevationMeters: 1650,
    terrainType: 'Himalayas',
    majorHighways: ['NH-10 (Sevoke-Rangpo corridor)'],
    weather: { tempC: 16, condition: 'Hill Rain & Cloud', rainfallMm: 58, windKmh: 20, humidity: 91 }
  }
];

export const PAN_INDIA_CORRIDORS = [
  {
    id: 'corridor-gq-south-west',
    name: 'Golden Quadrilateral (Chennai - Bengaluru - Pune - Mumbai)',
    highways: ['NH-48'],
    lengthKm: 1340,
    color: '#22c55e',
    routePoints: [[480, 710], [420, 680], [350, 520], [330, 460]],
    avgTravelTimeHours: 21,
    riskCategory: 'Safe',
    status: 'Operational Expressways',
    terrain: 'Deccan Plateau & Western Ghats',
    keyHubs: ['Chennai', 'Bengaluru', 'Pune', 'Mumbai'],
    features: 'High speed 6-lane tollway, Western Ghats Khandala gradient, JNPT container artery.',
    description: 'NH-48 Chennai-Bengaluru expressway and Yashwantrao Chavan Mumbai-Pune Expressway.'
  },
  {
    id: 'corridor-gq-north-east',
    name: 'Golden Quadrilateral / Grand Trunk (Delhi - Agra - Varanasi - Kolkata)',
    highways: ['Yamuna Expressway', 'Agra-Lucknow Expressway', 'NH-19'],
    lengthKm: 1450,
    color: '#38bdf8',
    routePoints: [[380, 230], [430, 260], [530, 290], [620, 310], [700, 390]],
    avgTravelTimeHours: 22,
    riskCategory: 'Safe',
    status: 'Operational All-Weather',
    terrain: 'Indo-Gangetic Alluvial Plains',
    keyHubs: ['New Delhi / NCR', 'Agra', 'Kanpur', 'Varanasi', 'Kolkata'],
    features: 'Gangetic alluvial corridor, world-class expressways, high-density industrial freight.',
    description: 'World-class multi-lane access-controlled expressways connecting National Capital to Eastern port.'
  },
  {
    id: 'corridor-ns-spine',
    name: 'North-South Corridor (Srinagar - Delhi - Nagpur - Hyderabad - Bengaluru - Kanyakumari)',
    highways: ['NH-44'],
    lengthKm: 3745,
    color: '#a855f7',
    routePoints: [[370, 90], [360, 150], [380, 230], [450, 430], [440, 540], [420, 680], [430, 740], [420, 780]],
    avgTravelTimeHours: 58,
    riskCategory: 'Moderate',
    status: 'Operational 4-6 Lane',
    terrain: 'Himalayan Pass to Southern Ocean',
    keyHubs: ['Srinagar', 'Chandigarh', 'New Delhi / NCR', 'Nagpur', 'Hyderabad', 'Bengaluru', 'Salem', 'Madurai', 'Kanyakumari'],
    features: "Longest National Highway in India, traverses 12 states from Himalayas to Indian Ocean.",
    description: 'National lifeline traversing 3,745 km with 52 toll plazas and fastag automated toll collection.'
  },
  {
    id: 'corridor-ew-spine',
    name: 'East-West Corridor (Silchar - Guwahati - Siliguri - Gorakhpur - Lucknow - Porbandar)',
    highways: ['NH-27'],
    lengthKm: 3300,
    color: '#eab308',
    routePoints: [[860, 295], [830, 275], [720, 280], [580, 270], [490, 260], [330, 320], [240, 360]],
    avgTravelTimeHours: 52,
    riskCategory: 'Moderate',
    status: 'Operational 4-Lane',
    terrain: 'Brahmaputra Valley to Arabian Coast',
    keyHubs: ['Silchar', 'Guwahati', 'Siliguri', 'Patna', 'Lucknow', 'Jaipur', 'Ahmedabad'],
    features: "Connects Northeast India to Western Coast, traverses Brahmaputra plains and Chicken's Neck.",
    description: 'Spans India from east to west, bridging Assam hill ridges with Gujarat coastal ports.'
  },
  {
    id: 'corridor-coastal-west',
    name: 'Western Coastal Corridor (Mumbai - Panaji - Mangaluru - Kochi - Kanyakumari)',
    highways: ['NH-66'],
    lengthKm: 1600,
    color: '#06b6d4',
    routePoints: [[330, 460], [345, 570], [360, 660], [370, 720], [420, 780]],
    avgTravelTimeHours: 28,
    riskCategory: 'Moderate',
    status: 'Upgraded 4-Lane Coastal',
    terrain: 'Konkan Coast & Ghat Estuaries',
    keyHubs: ['Mumbai', 'Panaji', 'Mangaluru', 'Kozhikode', 'Kochi', 'Thiruvananthapuram', 'Kanyakumari'],
    features: 'Konkan coast, Western Ghats river estuaries, monsoon vulnerability, heavy container traffic.',
    description: 'Picturesque and heavy commercial logistics corridor along the Arabian Sea.'
  },
  {
    id: 'corridor-coastal-east',
    name: 'Eastern Coastal Highway (Kolkata - Bhubaneswar - Visakhapatnam - Chennai)',
    highways: ['NH-16'],
    lengthKm: 1650,
    color: '#f97316',
    routePoints: [[700, 390], [640, 460], [580, 530], [530, 610], [480, 710]],
    avgTravelTimeHours: 26,
    riskCategory: 'Safe',
    status: 'Golden Quadrilateral Eastern Arm',
    terrain: 'Coromandel Coastal Plain',
    keyHubs: ['Kolkata', 'Bhubaneswar', 'Visakhapatnam', 'Vijayawada', 'Chennai'],
    features: 'Bay of Bengal coastline, port connectivity (Paradeep, Vizag, Ennore, Chennai), cyclone prone.',
    description: 'Connects major deepwater ports along the Bay of Bengal into Tamil Nadu manufacturing hubs.'
  }
];

export function findLocationByNameOrId(query: string): IndiaLocation | null {
  if (!query) return null;
  const clean = query.trim().toLowerCase();
  
  // Exact match on id
  const byId = INDIA_LOCATIONS.find(loc => loc.id === clean);
  if (byId) return byId;

  // Exact or partial match on name
  const byName = INDIA_LOCATIONS.find(loc => {
    const locName = loc.name.toLowerCase();
    return locName === clean || locName.includes(clean) || clean.includes(locName);
  });
  if (byName) return byName;

  // Match state
  const byState = INDIA_LOCATIONS.find(loc => loc.state.toLowerCase().includes(clean));
  if (byState) return byState;

  return null;
}

export function searchLocations(term: string, region?: IndiaRegion): IndiaLocation[] {
  let list = INDIA_LOCATIONS;
  if (region && region !== 'All India') {
    list = list.filter(loc => loc.region === region);
  }
  if (!term.trim()) return list;

  const clean = term.toLowerCase().trim();
  return list.filter(loc => 
    loc.name.toLowerCase().includes(clean) ||
    loc.state.toLowerCase().includes(clean) ||
    loc.majorHighways.some(hw => hw.toLowerCase().includes(clean))
  );
}

// Haversine distance calculator between any two lat/lng coordinates (in km)
export function calculateHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}
