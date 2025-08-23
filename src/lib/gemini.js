import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDzZ-3Mp6CGzhKyYEnfDkHq_Ath6uAO-Ig");

export const gemini = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
