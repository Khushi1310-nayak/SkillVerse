import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';

admin.initializeApp();
const db = admin.firestore();

// We will use the OPENROUTER_API_KEY from Firebase Secrets
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

// The LeetCode GraphQL API endpoint
const LEETCODE_API_URL = 'https://leetcode.com/graphql';

async function fetchLeetCodeQuestions() {
    // We will fetch the daily challenge and a few recent problems
    const query = `
    query getQuestions {
      activeDailyCodingChallengeQuestion {
        question {
          title
          titleSlug
          difficulty
          content
          topicTags { name }
        }
      }
      problemsetQuestionList: questionList(categorySlug: "", limit: 10, skip: 0, filters: {}) {
        data {
          title
          titleSlug
          difficulty
          content
          topicTags { name }
        }
      }
    }
  `;

    const response = await axios.post(LEETCODE_API_URL, { query });
    const data = response.data.data;
    
    const questions = [];
    if (data.activeDailyCodingChallengeQuestion?.question) {
        questions.push(data.activeDailyCodingChallengeQuestion.question);
    }
    if (data.problemsetQuestionList?.data) {
        // Grab first 4 from the list to make 5 total
        questions.push(...data.problemsetQuestionList.data.slice(0, 4));
    }
    return questions;
}

export const dailyQuestionRotation = functions
    .runWith({ secrets: ["OPENROUTER_API_KEY"] })
    .pubsub.schedule('every day 00:00')
    .timeZone('UTC')
    .onRun(async (context) => {
        console.log('Starting daily question rotation...');

        try {
            // 1. Fetch from LeetCode
            const rawQuestions = await fetchLeetCodeQuestions();
            console.log(`Fetched ${rawQuestions.length} questions from LeetCode.`);

            // 2. Use Gemini to categorize and format them
            const prompt = `
            You are a technical interview curator. 
            I have ${rawQuestions.length} raw coding questions from LeetCode. 
            I need you to categorize them for specific tech companies (e.g. Google, Microsoft, Meta, Amazon, Apple) and format them into a JSON array that perfectly matches this TypeScript interface:
            
            interface InterviewQuestion {
              id: string; // generate a random unique ID
              title: string;
              difficulty: 'Easy' | 'Medium' | 'Hard';
              tags: string[]; // e.g. ["Arrays", "Graph"]
              answer: string; // A brief explanation of the optimal approach in HTML/Markdown
              resourceLink: string; // The leetcode URL (https://leetcode.com/problems/{titleSlug})
            }

            You must return a JSON object with company names as keys, and an array of 5 InterviewQuestions as the value.
            Example: { "Google": [ { ... }, { ... } ], "Microsoft": [ ... ] }
            
            Raw Questions: ${JSON.stringify(rawQuestions.map(q => ({ title: q.title, slug: q.titleSlug, difficulty: q.difficulty, tags: q.topicTags }))) }
            
            Return ONLY valid JSON. Do not include markdown blocks like \`\`\`json.
            `;

            const aiResponse = await axios.post(
                "https://openrouter.ai/api/v1/chat/completions",
                {
                    model: "google/gemini-2.5-flash", // Using Gemini through OpenRouter
                    messages: [{ role: "user", content: prompt }]
                },
                {
                    headers: {
                        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const responseText = aiResponse.data.choices?.[0]?.message?.content || "{}";
            const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            const categorizedData = JSON.parse(cleanedText);

            // 3. Save to Firestore
            const batch = db.batch();
            const companiesRef = db.collection('companies');

            for (const [companyName, questions] of Object.entries(categorizedData)) {
                // We assume documents in the 'companies' collection are named by companyName (e.g. 'google', 'microsoft')
                const docId = companyName.toLowerCase();
                const docRef = companiesRef.doc(docId);
                
                batch.set(docRef, {
                    name: companyName,
                    questions: questions,
                    lastUpdated: admin.firestore.FieldValue.serverTimestamp()
                }, { merge: true });
            }

            await batch.commit();
            console.log('Successfully rotated daily questions in Firestore.');

        } catch (error) {
            console.error('Error during daily question rotation:', error);
        }
        return null;
    });
