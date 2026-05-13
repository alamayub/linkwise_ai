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
    awards: { title: string; year?: string }[];
    controversies: { description: string; impact?: string }[];
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

export async function extractInfo(url: string): Promise<ExtractedInfo> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Thoroughly analyze the primary entity at: ${url}. 
               
               EFFICIENCY PROTOCOL:
               1. Focus only on the provided domain and its main About/Contact pages.
               2. DO NOT exceed 15 total URL lookups. Stop early if core data is found.
               3. If a social handle is found, do NOT crawl the social platform deeply; just verify the handle and moves on.
               
               EXTRACTION GOALS:
               - SOCIAL: Find major profiles. Mark isVerified if highly confident (official badges/high follower count).
               - REPUTATION: Significant news, major awards, known controversies, and key events.
               - BUSINESS: Basic info, offerings, competitors, and strategic gaps.
               - CONTACT: Emails, phones, addresses, and hours.

               Omit fields that require deep specialized crawling (like specific case studies or sub-pages) to save quota.`,
    config: {
      tools: [{ urlContext: {} }],
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
                    year: { type: Type.STRING }
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
                    impact: { type: Type.STRING }
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

  const response = await chat.sendMessageStream({ message });
  for await (const chunk of response) {
    yield chunk.text || "";
  }
}
