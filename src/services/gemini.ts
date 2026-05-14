/* eslint-disable preserve-caught-error */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ExtractedInfo {
  emails: string[];
  phoneNumbers: string[];
  socialMediaLinks: { platform: string; url: string; handle?: string; followers?: string; isVerified?: boolean }[];
  addresses: string[];
  associatedPersons: { name: string; role: string; bio?: string }[];
  companyInfo?: {
    name: string;
    industry?: string;
    founded?: string;
    size?: string;
    headquarters?: string;
    legalName?: string;
  };
  offerings: { name: string; type: 'product' | 'service' | 'feature'; description?: string }[];
  businessHours?: { day: string; hours: string }[];
  insights: {
    missingElements: string[];
    improvementSuggestions: string[];
    competitors: { name: string; reason: string }[];
    marketPosition: string;
  };
  reputation: {
    latestNews: { title: string; date?: string; url?: string }[];
    awards: { title: string; year?: string; url?: string }[];
    controversies: { description: string; impact?: string; url?: string }[];
    upcomingEvents: { name: string; date?: string; description?: string }[];
  };
  metadata: {
    title?: string;
    description?: string;
    language?: string;
    category?: string;
  };
  summary: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

async function callGemini(params: any) {
  try {
    const result = await ai.models.generateContent(params);
    return result;
  } catch (error: any) {
    const status = error?.status || (error?.message?.includes('429') ? 429 : error?.message?.includes('403') ? 403 : null);
    
    if (status === 429) {
      throw new Error("RATE_LIMIT_EXCEEDED: LinkWise AI is receiving too many requests. This usually resets every 60 seconds for free tier users. Please wait a moment and click extract again to retry.");
    }
    if (status === 403) {
      throw new Error("PERMISSION_DENIED: Access restricted. Your Gemini API key may lack the 'Google Search' permission or requires a billing-enabled account for search-enhanced extraction. Check Settings > Secrets.");
    }
    
    throw new Error(`API_ERROR: ${error.message || "An unexpected error occurred while communicating with Gemini."}`);
  }
}

export async function generateOutreach(
  info: ExtractedInfo, 
  platform: string,
  options?: {
    targetRole?: string;
    cta?: string;
    focusPainPoint?: string;
  }
): Promise<string> {
  const entityName = info.companyInfo?.name || "the company";
  const { targetRole, cta, focusPainPoint } = options || {};

  const response = await callGemini({
    model: "gemini-3-flash-preview",
    contents: `Generate a professional outreach message specifically for ${platform} addressed TO ${entityName}.
               
               COMPANY DATA:
               - Entity: ${entityName}
               - Industry: ${info.companyInfo?.industry}
               - Strategic Gaps: ${info.insights.improvementSuggestions.join(", ")}
               - Missing Elements: ${info.insights.missingElements.join(", ")}
               
               OUTREACH PARAMETERS:
               - Target Role: ${targetRole || "Decision Maker"}
               - Call to Action: ${cta || "Start a conversation"}
               - Focus Pain Point: ${focusPainPoint || "general business optimization"}
               
               GUIDELINES:
               1. PLATFORM-SPECIFIC: Optimize for ${platform}. If it's X/Twitter, keep it within character limits. If it's Email, include a compelling subject line.
               2. STRATEGY-FIRST: Highlight the specific business gaps identified above, especially those related to ${focusPainPoint || 'their strategic growth'}.
               3. TONE: Professional, consultative, and value-driven.
               4. RECIPIENT: Use "${targetRole ? `Hi ${targetRole} at ${entityName}` : `Hi ${entityName} Team`}" as the greeting.
               5. GOAL: Finalize with a clear call to action: ${cta || 'Would you be open to a brief chat about these optimizations?'}.
               
               Return ONLY the message content as plain text. If it's an email, start with "Subject: [Subject Line]" followed by the body.`,
    config: {
      // No search/tools needed for drafting
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("Failed to generate outreach message.");
  }

  return text;
}

export async function extractInfo(url: string, depth: 'quick' | 'deep' = 'quick'): Promise<ExtractedInfo> {
  const depthInstructions = depth === 'quick' 
    ? `EFFICIENCY PROTOCOL (QUICK SCAN):
       1. Focus only on the provided domain and its main landing page.
       2. DO NOT exceed 5 total URL lookups. Stop early if core data is found.
       3. Extract surface-level business info, basic contact details, and primary social handles.
       4. Prioritize speed over deep historical data.`
    : `EFFICIENCY PROTOCOL (DEEP DIVE):
       1. Explore multiple layers of the provided domain (About, Contact, Press, History, Team).
       2. Use up to 25 total URL lookups to build a comprehensive footprint.
       3. Deeply search for historical news, specific awards, controversies, and key associated persons.
       4. Analyze the competitive landscape and strategic gaps with higher granularity.`;

  const response = await callGemini({
    model: "gemini-3-flash-preview",
    contents: `Thoroughly analyze the primary entity at: ${url}. 
               
               ${depthInstructions}
               
               EXTRACTION GOALS:
               - SOCIAL: Find major profiles. Mark isVerified if highly confident.
               - REPUTATION: Significant news, major awards, known controversies, and key events.
               - BUSINESS: Basic info, offerings, competitors, and strategic gaps.
               - CONTACT: Emails, phones, addresses, and hours.
 
               Omit fields that require deep specialized crawling to save quota.`,
    config: {
      tools: [{ googleSearch: {} }], // Use googleSearch instead of urlContext for broader compatibility
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          emails: { type: Type.ARRAY, items: { type: Type.STRING } },
          phoneNumbers: { type: Type.ARRAY, items: { type: Type.STRING } },
          socialMediaLinks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                platform: { type: Type.STRING },
                url: { type: Type.STRING },
                handle: { type: Type.STRING },
                followers: { type: Type.STRING },
                isVerified: { type: Type.BOOLEAN }
              },
              required: ["platform", "url"]
            }
          },
          addresses: { type: Type.ARRAY, items: { type: Type.STRING } },
          associatedPersons: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                role: { type: Type.STRING },
                bio: { type: Type.STRING }
              },
              required: ["name"]
            }
          },
          companyInfo: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              industry: { type: Type.STRING },
              founded: { type: Type.STRING },
              size: { type: Type.STRING },
              headquarters: { type: Type.STRING },
              legalName: { type: Type.STRING }
            },
            required: ["name"]
          },
          offerings: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                type: { type: Type.STRING, enum: ["product", "service", "feature"] },
                description: { type: Type.STRING }
              },
              required: ["name", "type"]
            }
          },
          businessHours: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING },
                hours: { type: Type.STRING }
              },
              required: ["day", "hours"]
            }
          },
          insights: {
            type: Type.OBJECT,
            properties: {
              missingElements: { type: Type.ARRAY, items: { type: Type.STRING } },
              improvementSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
              competitors: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    reason: { type: Type.STRING }
                  },
                  required: ["name", "reason"]
                }
              },
              marketPosition: { type: Type.STRING }
            },
            required: ["missingElements", "improvementSuggestions", "competitors", "marketPosition"]
          },
          reputation: {
            type: Type.OBJECT,
            properties: {
              latestNews: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    date: { type: Type.STRING },
                    url: { type: Type.STRING }
                  },
                  required: ["title"]
                }
              },
              awards: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    year: { type: Type.STRING },
                    url: { type: Type.STRING }
                  },
                  required: ["title"]
                }
              },
              controversies: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    description: { type: Type.STRING },
                    impact: { type: Type.STRING },
                    url: { type: Type.STRING }
                  },
                  required: ["description"]
                }
              },
              upcomingEvents: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    date: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["name"]
                }
              }
            },
            required: ["latestNews", "awards", "controversies", "upcomingEvents"]
          },
          metadata: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              language: { type: Type.STRING },
              category: { type: Type.STRING }
            }
          },
          summary: { type: Type.STRING },
          sentiment: { type: Type.STRING, enum: ["positive", "neutral", "negative"] }
        },
        required: ["emails", "phoneNumbers", "socialMediaLinks", "addresses", "associatedPersons", "offerings", "insights", "reputation", "metadata", "summary"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No information could be extracted from the provided URL.");
  }

  try {
    return JSON.parse(text);
  } catch {
    console.error("Failed to parse Gemini response:", text);
    throw new Error("The AI returned an invalid response format.");
  }
}

export async function* chatStream(message: string, history: { role: 'user' | 'model'; parts: { text: string }[] }[] = []) {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    history: history.length > 0 ? history : undefined,
    config: {
      systemInstruction: "You are LinkWise AI, a professional business intelligence assistant. You help users understand business data, web extraction results, and provide insights into companies. Be concise, professional, and helpful.",
    }
  });

  try {
    const response = await chat.sendMessageStream({ message });
    for await (const chunk of response) {
      yield chunk.text || "";
    }
  } catch (error: any) {
    const status = error?.status || (error?.message?.includes('429') ? 429 : error?.message?.includes('403') ? 403 : null);
    
    if (status === 429) {
      yield "RATE_LIMIT_EXCEEDED: LinkWise AI is currently experiencing high usage. Please wait about 60 seconds and try sending your message again. AI quotas reset frequently!";
    } else if (status === 403) {
      yield "PERMISSION_DENIED: Access restricted. Please check your Gemini API key in Settings > Secrets. You may need a billing-enabled key or specific search permissions enabled.";
    } else {
      yield "I encountered an error. Please check your connection or API key and try again.";
    }
  }
}
