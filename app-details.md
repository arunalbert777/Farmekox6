
# Farmekox: Smart Crop Advisory System - Project Report

## 1. Abstract

The agricultural sector, particularly in regions like Karnataka, faces significant challenges related to access to timely and accurate information, efficient market linkage, and the adoption of modern farming practices. These challenges often lead to suboptimal crop yields, reduced income for farmers, and inefficient use of resources. This project, "Farmekox," aims to address these issues by developing a comprehensive, AI-powered, mobile-first web application. The platform provides farmers with a suite of intelligent tools designed to enhance decision-making, improve productivity, and increase profitability. Our approach leverages the power of Google's Gemini AI through the Genkit framework to deliver features such as location-aware crop recommendations, AI-driven advisory services in both English and Kannada, real-time weather and irrigation advice, and a direct-to-consumer sales platform.

---

## 2. Objectives

The primary goals of the Farmekox project are specific, measurable, and outcome-focused:

1.  **Develop an AI-Driven Crop Recommendation System:** To provide farmers with intelligent crop suggestions based on their geographical location, the current season, and specific climatic conditions, aiming to increase yield potential and profitability.
2.  **Implement a Multilingual AI Advisory Service:** To create an interactive voice and chat-based advisory platform using AI that supports both English and Kannada, making expert-level advice accessible to a broader audience.
3.  **Create a Smart Fertilizer Calculator:** To build a tool that uses AI to identify fertilizer details, recommend appropriate dosages, and provide step-by-step usage instructions based on a product's barcode.
4.  **Provide Actionable Weather Insights:** To deliver real-time weather forecasts and generate AI-based irrigation advice, helping farmers optimize water usage and protect crops from adverse weather.
5.  **Establish a Direct Sales Platform:** To empower farmers by creating a map-based marketplace where they can pin their produce for sale, connecting them directly with local consumers and improving their profit margins.
6.  **Offer a "Market Watch" Feature:** To keep farmers informed with live mandi (market) prices and the latest agricultural news, enabling better sales decisions.
7.  **Ensure a User-Friendly, Mobile-First Experience:** To design and build the entire application with a focus on responsiveness and ease of use on mobile devices, which are the primary access point for many farmers.

---

## 3. Proposed Method & Feasibility Study

### Proposed Method

The Farmekox application is built on a modern client-server architecture, utilizing Next.js for both the frontend and server-side business logic. This choice allows for a seamless, fast, and SEO-friendly user experience.

The core innovation of the project lies in its deep integration with **Google's Gemini AI via the Genkit framework**. This is not just a simple chatbot; Genkit allows us to create structured, agent-like AI "flows" that serve as the brains behind our key features:

*   **Structured I/O:** We use Zod schemas to define the exact input and output structure for our AI flows. This ensures that the AI's responses are predictable, reliable, and easily parsable, eliminating the guesswork of handling plain text responses. For example, the `cropRecommendationFlow` returns a clean JSON object with `recommendedCrops` and `reasoning`.
*   **Tool Use:** Genkit enables the AI to use "tools" (server-side functions) as part of its reasoning process. Our `rainAlertIrrigationAdvice` flow demonstrates this by using the `getWeatherForecast` tool. The AI decides to call this tool, receives the weather data, and then formulates its irrigation advice based on that data.
*   **Server Actions:** Communication between the client and the AI backend is handled efficiently through Next.js Server Actions. This simplifies the architecture by removing the need for separate API endpoints for each feature.

The user interface is constructed with **ShadCN UI** and **Tailwind CSS**, providing a professional, modern, and highly responsive design system that works seamlessly across all devices. For all geospatial features, we leverage the **Google Maps Platform API**.

### Feasibility Study

*   **Technological Feasibility:** The chosen technology stack is robust, mature, and well-supported. Next.js is a production-grade React framework, and Firebase App Hosting offers a scalable, serverless environment perfect for this type of application. Genkit is Google's official framework for building with Gemini, ensuring long-term support and access to the latest AI capabilities. The approach is technologically sound and relies on mainstream, proven technologies.
*   **Economic Feasibility:** The initial development and deployment costs are minimal. Firebase App Hosting, the Google Maps API, and the Gemini API all offer generous free tiers that are more than sufficient for development, testing, and small-scale production use. As the application scales, costs will increase based on usage, but this pay-as-you-go model makes the project economically viable.
*   **Operational Feasibility:** The application is designed to be low-maintenance. The serverless nature of Firebase App Hosting means there are no servers to manage. The modular design of the Genkit flows makes it easy to update, debug, or extend the AI's capabilities without overhauling the entire system.

---

## 4. Architecture Diagram

Below is a logical representation of the system's architecture.

### Block Diagram

```
[ User (Web Browser on Mobile/Desktop) ]
       |
       |  (HTTPS, React UI)
       v
[ Next.js Frontend (ShadCN UI, React) ]
       |
       |  (Server Actions, API Calls)
       v
[ Backend on Firebase App Hosting ]
 |-----------------------------------|
 |    [ Next.js Server ]             |
 |      - SSR & Page Routing         |
 |      - Server Action Handlers     |
 |      - API Route Handlers         |
 |-----------------------------------|
 |    [ Genkit AI Flows (/src/ai) ]  |  <---> [ Google AI (Gemini API) ]
 |      - Crop Recommendation Flow   |
 |      - AI Advisory (Text & TTS)   |
 |      - Fertilizer Info Flow       |
 |      - Rain Alert Flow (with Tool)|
 |-----------------------------------|
       |
       |  (External API Calls)
       v
[ Google Maps Platform API ]
 (For Maps, Places, Geolocation)
```

### Data Flow Example (Fertilizer Calculator)

1.  **User Interaction:** A farmer opens the "Fertilizer Calculator" on their phone and enters a barcode number.
2.  **Client Request:** The React component triggers a Next.js Server Action (`getFertilizerRecommendation`), passing the barcode.
3.  **Backend Processing:** The Server Action invokes the corresponding Genkit flow (`fertilizerRecommendationFlow`).
4.  **AI Invocation:** The Genkit flow constructs a prompt using the barcode and sends it to the Gemini API. The prompt specifically instructs the AI to act as an agricultural expert and generate plausible details (name, composition, dosage, usage) for the given barcode.
5.  **AI Response:** The Gemini API processes the request and returns a structured JSON object that matches the Zod schema defined in the flow.
6.  **Return to Client:** The Genkit flow passes the JSON response back through the Server Action to the React component.
7.  **UI Update:** The component updates its state with the received data and displays the fertilizer's name, composition, recommended dosage, and step-by-step instructions to the user.

---

## 5. Modules

The Farmekox application is divided into the following well-defined modules:

1.  **Dashboard:** The central hub of the application. It provides a quick overview of key metrics and features a grid of navigation tiles for easy access to all other modules.
2.  **Crop Recommendation:** An AI-powered form where users input their location, season, and climate to receive a list of suitable crops and the reasoning behind the recommendations.
3.  **Crop Calendar:** An interactive calendar for farmers to schedule and view important agricultural activities like sowing, irrigation, and harvesting.
4.  **Weather & Irrigation:** Displays a 7-day weather forecast and integrates an AI tool that advises farmers on whether to skip irrigation based on predicted rainfall.
5.  **Fertilizer Calculator:** An AI-driven tool that provides detailed fertilizer information, including composition, dosage, and usage instructions, from a scanned or manually entered barcode.
6.  **Market Watch:** A section that displays the latest commodity prices from major mandis and aggregates relevant agricultural news.
7.  **AI Advisory:** A multilingual (English/Kannada) chat and voice interface powered by Gemini. It provides text-to-speech audio responses, making it highly accessible.
8.  **Ask an Expert:** A directory page listing profiles and contact information for local agricultural experts in the Bengaluru area.
9.  **Nearby Resources:** A map-based utility that helps farmers find nearby agro-stores, fertilizer shops, and mandis using a powerful search function.
10. **Direct Sales:** An innovative map-based marketplace that allows farmers to pin their available produce directly on the map for local consumers to discover and purchase.

---

## 6. Hardware and Software Details

### Hardware

*   **Server:** No dedicated physical hardware is required. The application is deployed on **Firebase App Hosting**, a fully managed, serverless platform.
*   **Client:** Any modern device with a web browser (smartphone, tablet, desktop computer).

### Software

*   **Development Environment:** Firebase Studio, VS Code
*   **Programming Language:** TypeScript
*   **Core Framework:** Next.js 15+
*   **UI Library:** React 19+
*   **AI Framework:** Genkit 1.x
*   **AI Model:** Google Gemini 2.5 Flash / Pro
*   **Styling:** Tailwind CSS, ShadCN UI
*   **Schema Definition/Validation:** Zod
*   **Mapping Services:** Google Maps Platform API, @vis.gl/react-google-maps
*   **Deployment Platform:** Firebase App Hosting
*   **Runtime Environment:** Node.js

---

## 7. How the App Works: A Detailed Explanation

Farmekox is designed to be a farmer's digital companion, guiding them through the entire crop lifecycle, from planning to sales.

A farmer begins their journey on the **Dashboard**, which acts as a central control panel. It presents a clean, tile-based layout, allowing for quick navigation to any of the app's powerful features.

**1. Planning & Preparation:**
Before planting, the farmer can navigate to the **Crop Recommendation** module. Here, they enter their location (e.g., "Mysuru"), the current season ("Summer"), and a brief description of the climate ("Hot and dry"). The app sends this information to the Gemini AI, which analyzes the data and returns a list of recommended crops like Ragi or Maize, along with a detailed explanation of why these crops are suitable for the given conditions.

Once a crop is chosen, the farmer uses the **Crop Calendar** to schedule key activities. They can create entries for "Sowing," "Fertilizing," and "Harvesting," building a clear timeline for the months ahead.

**2. Daily Operations & Management:**
On a daily basis, the farmer opens the **Weather** module. They see a 7-day forecast for their area. More importantly, they can use the "Get Irrigation Advice" feature. By inputting their crop type, the AI analyzes the weather forecast (specifically the chance of rain) and advises them, for instance, to "Skip irrigation today as there is a high chance of rain," conserving water and effort.

When it's time to apply fertilizer, the farmer uses the **Fertilizer Calculator**. They can either use their phone's camera to view a barcode or type it in manually. The barcode is sent to the Gemini AI, which, acting as an expert, generates a complete profile for the product. This includes its chemical composition, recommended dosage (e.g., "50 kg/acre for rice"), and simple, step-by-step usage instructions.

**3. Information & Support:**
If the farmer encounters an unexpected pest or has a general question, they can turn to the **AI Advisory** module. They can type or speak their query in either English or Kannada. The AI provides a helpful, concise answer. To enhance accessibility, the AI's text response is converted to speech and played back, making it easy for users with varying literacy levels to understand. For more complex problems beyond the AI's scope, the **Ask an Expert** page provides a list of real-world specialists in Bengaluru whom they can call or message.

**4. Market & Sales:**
As harvest approaches, the farmer consults the **Market Watch** to check the current mandi prices for their crop, helping them decide the best time to sell. To find buyers or necessary supplies, they use the **Nearby Resources** map, where they can search for "seed stores" or "mandis" near their location.

Finally, to maximize their profits, the farmer can bypass intermediaries using the **Direct Sales** module. They can add a pin on the map at their farm's location, list their "Fresh Tomatoes" at "₹30/kg," and wait for local customers to connect with them directly. This feature fosters a farm-to-table ecosystem, benefiting both the farmer and the consumer.

---

## 8. Project File Structure

Here is a high-level overview of the important files and directories in the project:

```text
src/
├── ai/
│   ├── flows/
│   │   ├── ai-voice-chat-advisory.ts     # AI flow for voice/chat advisory
│   │   ├── crop-recommendation.ts        # AI flow for crop suggestions
│   │   ├── fertilizer-recommendation.ts  # AI flow for fertilizer details
│   │   └── rain-alert-irrigation-advice.ts # AI flow for irrigation advice
│   ├── dev.ts                            # Genkit development server entrypoint
│   └── genkit.ts                         # Genkit AI plugin configuration
├── app/
│   ├── dashboard/                        # Main application section
│   │   ├── [feature]/page.tsx            # Pages for each feature module
│   │   ├── layout.tsx                      # Layout for the dashboard
│   │   └── page.tsx                        # Main dashboard landing page
│   ├── globals.css                       # Global styles and Tailwind directives
│   ├── layout.tsx                        # Root layout for the entire app
│   └── page.tsx                          # Root page (redirects to dashboard)
├── components/
│   ├── dashboard/                        # React components specific to dashboard pages
│   ├── layout/                           # Layout components (sidebar, header)
│   └── ui/                               # Reusable UI components from ShadCN
├── context/
│   └── language-context.tsx              # React context for language management (EN/KN)
├── hooks/
│   ├── use-language.ts                   # Custom hook for accessing language context
│   └── use-toast.ts                      # Custom hook for showing toast notifications
└── lib/
    ├── placeholder-images.json           # Data for placeholder images
    ├── translations.ts                   # English and Kannada translation strings
    └── utils.ts                          # Utility functions (e.g., cn for Tailwind)
```
