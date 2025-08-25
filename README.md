# Scan&Safe

## Choosing safe packaged food is a daily struggle for millions of people who live with food allergies or chronic health conditions such as diabetes, celiac disease, and lactose intolerance. For them, every grocery trip carries hidden risks: a mislabeled ingredient, an overlooked sugar level, or an unfamiliar additive can have serious health consequences.

For diabetics, consuming high-sugar or carbohydrate-rich foods can cause dangerous spikes in blood glucose.
For celiac patients, even trace amounts of gluten may trigger severe digestive issues and long-term intestinal damage.
For those with lactose intolerance or nut allergies, hidden ingredients can result in discomfort, allergic reactions, or even life-threatening emergencies.
Despite these high stakes, the current process of reading nutritional labels is slow, stressful, and prone to error. Labels are often filled with complex terminologies, varying formats, and in some cases, incomplete or misleading information. Moreover, existing applications that attempt to assist are largely generic—they focus on single conditions or provide broad dietary advice, failing to offer the level of personalization needed by individuals with multiple overlapping conditions.

Scan&Safe directly solves this problem by introducing a personalized, instant, and reliable food safety assistant:

With a single barcode scan, users can instantly know whether a product is safe or unsafe based on their unique health profile.
The system consolidates all declared conditions and allergies, intelligently cross-checks them against reliable open data sources like OpenFoodFacts, and provides a verdict in under few seconds.
Unlike traditional methods, the application delivers not only a simple “Safe” or “Unsafe” label but also a clear explanation of the reason (e.g., “⚠ High Sugar: 22g per serving” or “⚠ Contains Gluten”).
Additionally, the app enhances the decision-making process by suggesting healthier alternatives, turning a stressful choice into a guided, informed decision.
By automating the complex and error-prone task of label analysis, Scan&Safe reduces anxiety, prevents harmful food choices, and empowers users to shop with confidence. It transforms food selection from a potential health hazard into a safe, personalized, and stress-free experience.

Challenges we ran into
Challenges Faced During Development

Developing Scan&Safe involved several technical and operational challenges:

1.. Data Integration and Accuracy
Integrating with the OpenFoodFacts API required handling inconsistencies in product data, missing entries, and diverse regional product variations. Ensuring accurate mapping of food ingredients to health conditions was a significant challenge.

Personalization Complexity
Designing a system that accommodates multiple conditions simultaneously (e.g., diabetes + lactose intolerance + peanut allergy) requires careful database structuring and logical checks to avoid false positives or negatives.

Real-time Performance
Implementing barcode scanning with QuaggaJS and providing results in under two seconds demanded efficient optimization of both the frontend and backend pipelines. Latency issues during API calls and user token validation (via Clerk middleware) were key hurdles.

User Experience
Communicating results in a way that is clear, concise, and non-technical was challenging. Leveraging Gemini LLM API to generate human-friendly explanations solved this but required tuning to balance technical accuracy with user readability.

Security & Privacy
Since users share sensitive health profiles, ensuring secure storage in MongoDB and implementing robust authentication/authorization workflows was critical to maintain trust.


# Links
http://65.20.74.168:3000/
https://scan-safe-three.vercel.app/
