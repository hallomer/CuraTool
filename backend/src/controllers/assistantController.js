const AssistantQuery = require('../models/AssistantQuery');
const Guide = require('../models/Guide');
const { queryAssistantAPI } = require('../services/apiClient');

// Find relevant guides based on user's query
const findRelevantGuides = async (query) => {
    const filteredQuery = query.replace(/\b(guide|guides)\b/gi, '').trim();
    const keywords = filteredQuery.split(' ').map(keyword => keyword.trim()).filter(keyword => keyword);
    const primaryFilters = {
        $or: [
            { title: { $regex: filteredQuery, $options: 'i' } },
            { category: { $regex: filteredQuery, $options: 'i' } },
            { 'materials.name': { $regex: filteredQuery, $options: 'i' } },
            { 'steps.description': { $regex: filteredQuery, $options: 'i' } }
        ]
    };
    const keywordFilters = keywords.map(keyword => ({
        $or: [
            { title: { $regex: keyword, $options: 'i' } },
            { category: { $regex: keyword, $options: 'i' } },
            { 'materials.name': { $regex: keyword, $options: 'i' } },
            { 'steps.description': { $regex: keyword, $options: 'i' } }
        ]
    }));
    const combinedFilters = { $text: { $search: query } };
    return await Guide.find(combinedFilters)
    .sort({ score: { $meta: "textScore" } })
    .limit(2);

};


// Handle assistant query endpoint
exports.handleAssistantQuery = async (req, res) => {
    const { query } = req.body;
    if (!query) {
        return res.status(400).json({ error: 'Query is required.' });
    }
    try {
        const platformDescription = `
            CuraTool is a collaborative platform providing step-by-step guides, community support, and AI assistance 
            for creating essential medical equipment from accessible, local materials.
            CuraTool is designed for low-resource and emergency settings where it empowers 
            healthcare proftionals and communities to deliver care when resources are scarce.
        `;

        const creatorDescription = `
            CuraTool is the vision and creation of Hiba 🇸🇩, she is Sudanese doctor and software engineer.
        `;

        const relevantGuides = await findRelevantGuides(query);
        const guidesContext = relevantGuides.length > 0
            ? relevantGuides.map(guide => {
                return `Guide Title: ${guide.title}\nIntro: ${guide.intro}\nSteps: ${guide.steps.map(step => `- ${step.description}`).join('\n')}\nMaterials: ${guide.materials.map(material => material.name).join(', ')}\n`.trim();
              }).join('\n\n')
            : '';

        const context = `
            You are CuraBot, an integral part of CuraTool, 
            serving as a knowledgeable medical assistant.

            ${platformDescription}

            ${creatorDescription}

            Your role is to support healthcare professionals with clear, practical guidance on building essential medical tools using limited resources. 
            Focus on delivering straightforward, actionable answers that work effectively in low-resource and emergency settings. 
            Keep responses helpful and as concise and as possible, encouraging users to request more details if they need further information or clarification.
            ${guidesContext ? 'Here are the relevant guides from the website:\n\n' + guidesContext : ''}
        `.trim();

        const fullMessage = `Context: ${context}. Query: ${query}`;
        console.log("Message sent to Assistant API:", fullMessage);
        const responseText = await queryAssistantAPI(fullMessage);

        const assistantQuery = new AssistantQuery({
            query,
            response: responseText,
        });
        await assistantQuery.save();
        res.json({ response: responseText });
    } catch (error) {
        console.error('Error in handleAssistantQuery:', error);
        res.status(500).json({ error: 'Failed to process your request. Please try again later.' });
    }
};
