// import axios from "axios";
// import config from "../config";
// import Logger from "./logger";

// export interface IGeminiAlertInput {
//   api_name: string;
//   status_code: number;
//   anomalyType: string;
// }

// export interface IGeminiAlertOutput {
//   rootCause: string;
//   severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
//   recommendation: string;
// }

// export const generateIntelligentAlert = async (data: IGeminiAlertInput): Promise<IGeminiAlertOutput> => {
//   try {
//     const apiKey = config.gemini.apiKey;
//     if (!apiKey) {
//       throw new Error("Gemini API Key is missing");
//     }
//     console.log("AL CALL--------------------------->")
//     const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

//     const prompt = `
//       You are an API monitoring assistant. Analyze this error and provide:
//       1. Root cause (1 sentence)
//       2. Impact severity: LOW/MEDIUM/HIGH/CRITICAL
//       3. Recommended fix (2-3 sentences)
      
//       API: ${data.api_name}, Status: ${data.status_code}, Type: ${data.anomalyType}
      
//       Return the response in strictly JSON format:
//       {
//         "rootCause": "...",
//         "severity": "...",
//         "recommendation": "..."
//       }
//     `;

//     const response = await axios.post(
//       url,
//       {
//         contents: [
//           {
//             parts: [{ text: prompt }],
//           },
//         ],
//       },
//       {
//         timeout: 10000,
//       }
//     );

//     const text = response.data.candidates[0].content.parts[0].text;
//     // Extract JSON from potential markdown code blocks
//     const jsonStr = text.replace(/```json|```/g, "").trim();
//     const parsed: IGeminiAlertOutput = JSON.parse(jsonStr);
//     console.log("parsed--------->",parsed)
//     return parsed;
//   } catch (error) {
//     Logger.error("Gemini AI Alert Generation Error:", error);
//     // Fallback response
//     return {
//       rootCause: `Detected ${data.anomalyType} on ${data.api_name} with status ${data.status_code}.`,
//       severity: data.status_code >= 500 ? "HIGH" : "MEDIUM",
//       recommendation: "Investigate API logs and check service health immediately.",
//     };
//   }
// };
//======================================================================================
import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../config";
import Logger from "./logger";

const genAI = new GoogleGenerativeAI(config.gemini.apiKey || "");

export interface IGeminiAlertInput {
  api_name: string;
  status_code: number;
  response_time_ms: number;
  records_returned: number;
  anomalyType: string; // Aligned with your worker logic
}

// Aligned with your previous output structure
export interface IGeminiAlertOutput {
  rootCause: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  recommendation: string;
}

/**
 * Generates an AI-powered human-readable alert object.
 * Aligned with the distributed queue processing architecture.
 */
export const generateIntelligentAlert = async (data: IGeminiAlertInput): Promise<IGeminiAlertOutput> => {
  try {
    if (!config.gemini.apiKey) {
      throw new Error("Gemini API Key is missing");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
      You are an expert SRE. Analyze this API anomaly and provide a structured response.
      API: ${data.api_name} | Status: ${data.status_code} | Latency: ${data.response_time_ms}ms | Records: ${data.records_returned} | Type: ${data.anomalyType}

      Return the response in strictly valid JSON format:
      {
        "rootCause": "1 short sentence explaining the issue",
        "severity": "LOW or MEDIUM or HIGH or CRITICAL",
        "recommendation": "2 concise steps to fix it"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Cleaning the response to extract JSON
    const jsonStr = text.replace(/```json|```/g, "").trim();
    const parsed: IGeminiAlertOutput = JSON.parse(jsonStr);

    return parsed;

  } catch (error: any) {
    Logger.error("Gemini AI Alert Generation Error:", error.message);

    // Dynamic Rule-based fallback to ensure data alignment in DB
    let severity: IGeminiAlertOutput['severity'] = "MEDIUM";
    if (data.status_code >= 500) severity = "CRITICAL";
    else if (data.response_time_ms > 5000) severity = "HIGH";

    return {
      rootCause: `Detected ${data.anomalyType} on ${data.api_name}. Status: ${data.status_code}.`,
      severity: severity,
      recommendation: "Investigate server logs and verify external API dependencies."
    };
  }
};

// import { GoogleGenerativeAI } from "@google/generative-ai";
// import config from "../config";
// import Logger from "./logger";

// // Initialize the Gemini AI with the API Key from your env
// const genAI = new GoogleGenerativeAI(config.gemini.apiKey || "");

// export interface IGeminiAlertInput {
//   api_name: string;
//   status_code: number;
//   response_time_ms: number;
//   records_returned: number;
// }

// export const generateIntelligentAlert = async (data: IGeminiAlertInput): Promise<string> => {
//   try {
//     if (!config.gemini.apiKey) {
//       return `Manual Alert: ${data.api_name} status ${data.status_code}.`;
//     }

//     /**
//      * SOLUTION: 
//      * Using the exact model name from your working CURL example: "gemini-flash-latest"
//      */
//     const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

//     const prompt = `
//       As an expert SRE, analyze this API response and generate a professional, 1-sentence alert.
//       API: ${data.api_name} | Status: ${data.status_code} | Latency: ${data.response_time_ms}ms | Records: ${data.records_returned}
//     `;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     return response.text().trim();

//   } catch (error: any) {
//     Logger.error("Gemini AI Alert Generation Error:", error.message);

//     // Dynamic Rule-based fallback as a professional engineering practice
//     let condition = "Unknown Issue";
//     if (data.status_code >= 500) condition = "Server Failure";
//     else if (data.response_time_ms > 2000) condition = "High Latency";
//     else if (data.records_returned === 0) condition = "Zero Records";

//     return `Intelligent Alert: ${condition} detected on ${data.api_name}. Status ${data.status_code}. Immediate check required.`;
//   }
// };