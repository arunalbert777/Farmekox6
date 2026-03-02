export type Translation = {
  [key: string]: {
    en: string;
    kn: string;
  };
};

export const translations: Translation = {
  // Sidebar
  dashboard: { en: 'Dashboard', kn: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್' },
  crop_recommendation: { en: 'Crop Recommendation', kn: 'ಬೆಳೆ ಶಿಫಾರಸು' },
  crop_calendar: { en: 'Crop Calendar', kn: 'ಬೆಳೆ ಕ್ಯಾಲೆಂಡರ್' },
  weather_forecast: { en: 'Weather', kn: 'ಹವಾಮಾನ' },
  fertilizer_calculator: { en: 'Fertilizer Info', kn: 'ಗೊಬ್ಬರ ಮಾಹಿತಿ' },
  market_watch: { en: 'Market Watch', kn: 'ಮಾರುಕಟ್ಟೆ ವೀಕ್ಷಣೆ' },
  ai_advisory: { en: 'AI Advisory', kn: 'AI ಸಲಹೆಗಾರ' },
  ask_expert: { en: 'Ask an Expert', kn: 'ತಜ್ಞರನ್ನು ಕೇಳಿ' },
  resources: { en: 'Nearby Resources', kn: 'ಹತ್ತಿರದ ಸಂಪನ್ಮೂಲಗಳು' },
  direct_sales: { en: 'Direct Sales', kn: 'ನೇರ ಮಾರಾಟ' },

  // General
  farmekox: { en: 'Farmekox', kn: 'ಫಾರ್ಮೆಕೋಕ್ಸ್' },
  welcome_back: { en: 'Welcome Back!', kn: 'ಮತ್ತೆ ಸ್ವಾಗತ!' },
  smart_crop_advisory: { en: 'Smart Crop Advisory System', kn: 'ಸ್ಮಾರ್ಟ್ ಬೆಳೆ ಸಲಹಾ ವ್ಯವಸ್ಥೆ' },
  language: { en: 'Language', kn: 'ಭಾಷೆ' },
  english: { en: 'English', kn: 'ಆಂಗ್ಲ' },
  kannada: { en: 'Kannada', kn: 'ಕನ್ನಡ' },
  
  // Page Titles
  dashboard_title: { en: 'Dashboard Overview', kn: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಅವಲೋಕನ' },
  crop_recommendation_title: { en: 'Get Crop Recommendations', kn: 'ಬೆಳೆ ಶಿಫಾರಸುಗಳನ್ನು ಪಡೆಯಿರಿ' },
  crop_calendar_title: { en: 'Your Crop Calendar', kn: 'ನಿಮ್ಮ ಬೆಳೆ ಕ್ಯಾಲೆಂಡರ್' },
  weather_forecast_title: { en: '7-Day Weather Forecast', kn: '7-ದಿನದ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ' },
  fertilizer_calculator_title: { en: 'Fertilizer Info System', kn: 'ಗೊಬ್ಬರ ಮಾಹಿತಿ ವ್ಯವಸ್ಥೆ' },
  market_watch_title: { en: 'News and Mandi Prices', kn: 'ಸುದ್ದಿ ಮತ್ತು ಮಂಡಿ ಬೆಲೆಗಳು' },
  ai_advisory_title: { en: 'AI Voice & Chat Advisory', kn: 'AI ಧ್ವನಿ ಮತ್ತು ಚಾಟ್ ಸಲಹೆ' },
  ask_expert_title: { en: 'Connect with an Expert', kn: 'ತಜ್ಞರೊಂದಿಗೆ ಸಂಪರ್ಕ ಸಾಧಿಸಿ' },
  resources_title: { en: 'Find Nearby Resources', kn: 'ಹತ್ತಿರದ ಸಂಪನ್ಮೂಲಗಳನ್ನು ಹುಡುಕಿ' },
  direct_sales_title: { en: 'Direct Sales from Farm', kn: 'ಫಾರ್ಮ್‌ನಿಂದ ನೇರ ಮಾರಾಟ' },

  // Forms & Buttons
  get_recommendation: { en: 'Get Recommendation', kn: 'ಶಿಫಾರಸು ಪಡೆಯಿರಿ' },
  location: { en: 'Location', kn: 'ಸ್ಥಳ' },
  season: { en: 'Season', kn: 'ಋತು' },
  climate_conditions: { en: 'Climatic Conditions', kn: 'ಹವಾಮಾನ ಪರಿಸ್ಥಿತಿಗಳು' },
  spring: { en: 'Spring', kn: 'ವಸಂತ' },
  summer: { en: 'Summer', kn: 'ಬೇಸಿಗೆ' },
  autumn: { en: 'Autumn', kn: 'ಶರತ್ಕಾಲ' },
  winter: { en: 'Winter', kn: 'ಚಳಿಗಾಲ' },
  enter_location: { en: 'e.g., Bengaluru', kn: 'ಉದಾ., ಬೆಂಗಳೂರು' },
  enter_climate: { en: 'e.g., Hot and humid', kn: 'ಉದಾ., ಬಿಸಿ ಮತ್ತು ತೇವಾಂಶ' },
  submit: { en: 'Submit', kn: 'ಸಲ್ಲಿಸಿ' },
  refresh: { en: 'Refresh', kn: 'ರಿಫ್ರೆಶ್' },
  scan_barcode: { en: 'Scan Barcode', kn: 'ಬಾರ್‌ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ' },
  barcode_number: { en: 'Barcode Number', kn: 'ಬಾರ್‌ಕೋಡ್ ಸಂಖ್ಯೆ' },
  type_your_message: { en: 'Type your message...', kn: 'ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ...' },
  send: { en: 'Send', kn: 'ಕಳುಹಿಸು' },
  
  // Weather
  chance_of_rain: { en: 'Chance of rain', kn: 'ಮಳೆಯ ಸಾಧ್ಯತೆ' },
  
  // Rain Alert
  get_irrigation_advice: { en: 'Get Irrigation Advice', kn: 'ನೀರಾವರಿ ಸಲಹೆ ಪಡೆಯಿರಿ' },
  crop_type: { en: 'Crop Type', kn: 'ಬೆಳೆ ಪ್ರಕಾರ' },
  enter_crop_type: { en: 'e.g., Rice', kn: 'ಉದಾ., ಅಕ್ಕಿ' },
  
  // Market Watch
  mandi_prices: { en: 'Mandi Prices', kn: 'ಮಂಡಿ ಬೆಲೆಗಳು' },
  latest_news: { en: 'Latest News', kn: 'ಇತ್ತೀಚೆಗಿನ ಸುದ್ದಿ' },
  commodity: { en: 'Commodity', kn: 'ಸರಕು' },
  price_per_quintal: { en: 'Price (per Quintal)', kn: 'ಬೆಲೆ (ಪ್ರತಿ ಕ್ವಿಂಟಲ್‌ಗೆ)' },
  
  // Ask Expert
  call: { en: 'Call', kn: 'ಕರೆ ಮಾಡಿ' },
  message: { en: 'Message', kn: 'ಸಂದೇಶ' },
  
  // Direct Sales
  direct_sales_description: { en: 'Buy fresh produce directly from local farmers.', kn: 'ಸ್ಥಳೀಯ ರೈತರಿಂದ ನೇರವಾಗಿ ತಾಜಾ ಉತ್ಪನ್ನಗಳನ್ನು ಖರೀದಿಸಿ.' },
  buy_now: { en: 'Buy Now', kn: 'ಈಗ ಖರೀದಿಸಿ' },

  // Fertilizer Info Specific
  soil_type: { en: 'Soil Type', kn: 'ಮಣ್ಣಿನ ಪ್ರಕಾರ' },
  farm_size: { en: 'Farm Size (Acres)', kn: 'ಫಾರ್ಮ್ ಗಾತ್ರ (ಎಕರೆ)' },
  get_ai_advice: { en: 'Get AI Personalized Advice', kn: 'AI ವೈಯಕ್ತಿಕ ಸಲಹೆ ಪಡೆಯಿರಿ' },
  product_name: { en: 'Product Name', kn: 'ಉತ್ಪನ್ನದ ಹೆಸರು' },
  brand_name: { en: 'Brand Name', kn: 'ಬ್ರಾಂಡ್ ಹೆಸರು' },
  npk_composition: { en: 'NPK Composition', kn: 'NPK ಸಂಯೋಜನೆ' },
};
