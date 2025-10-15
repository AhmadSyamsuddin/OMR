const { generateGeminiContent } = require('../helpers/geminiai');

class GeminiController {
    static async generateWorkoutPlan(req, res, next) {
        try {
            const { programName } = req.body;

            if (!programName) {
                return res.status(400).json({ error: "Program name is required" });
            }

            const prompt = `Generate a detailed 7-day workout plan for ${programName}.
            The plan should help improve performance in ${programName}.

            Format the response as a JSON array with 7 objects, each representing a day with the following structure:
            {
                "day": number (1-7),
                "title": "Day X: Focus Area",
                "exercises": [
                    {
                        "name": "Exercise name",
                        "sets": "number of sets",
                        "reps": "number of reps or duration",
                        "rest": "rest time",
                        "notes": "any important notes or tips"
                    }
                ],
                "cooldown": "cooldown recommendations",
                "tips": "daily training tips"
            }

            Make it realistic, progressive, and suitable for beginner level athletes.
            Return ONLY the JSON array, no additional text.`;

            const text = await generateGeminiContent(prompt);

            // Clean the response to extract JSON
            const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

            let workoutPlan;
            try {
                workoutPlan = JSON.parse(cleanedText);
            } catch (parseError) {
                console.error("Failed to parse Gemini response:", cleanedText);
                return res.status(500).json({
                    error: "Failed to generate proper workout plan format",
                    rawResponse: cleanedText
                });
            }

            res.status(200).json({
                programName,
                workoutPlan
            });

        } catch (error) {
            console.error("Gemini API Error:", error);
            next(error);
        }
    }
}

module.exports = GeminiController;
