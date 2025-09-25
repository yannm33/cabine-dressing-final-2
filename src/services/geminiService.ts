/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// FIX: Import enums for type-safe comparisons.
import { GoogleGenAI, GenerateContentResponse, Modality, BlockedReason, HarmCategory, HarmProbability, FinishReason } from "@google/genai";

const fileToPart = async (file: File) => {
    const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
    const { mimeType, data } = dataUrlToParts(dataUrl);
    return { inlineData: { mimeType, data } };
};

const dataUrlToParts = (dataUrl: string) => {
    const arr = dataUrl.split(',');
    if (arr.length < 2) throw new Error("errorInvalidDataURL");
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch || !mimeMatch[1]) throw new Error("errorMimeParse");
    return { mimeType: mimeMatch[1], data: arr[1] };
}

const dataUrlToPart = (dataUrl: string) => {
    const { mimeType, data } = dataUrlToParts(dataUrl);
    return { inlineData: { mimeType, data } };
}

const handleApiResponse = (response: GenerateContentResponse): string | null => {
    if (response.promptFeedback?.blockReason) {
        const { blockReason, blockReasonMessage, safetyRatings } = response.promptFeedback;

        let shouldThrow = true;

        // FIX: Use BlockedReason enum for comparison.
        if (blockReason === BlockedReason.BLOCKED_REASON_UNSPECIFIED) {
            shouldThrow = false;
        // FIX: Use BlockedReason enum for comparison.
        } else if (blockReason === BlockedReason.SAFETY) {
            // Permissive check: allow blocks for HARASSMENT, but not for other severe categories.
            const hasSevereBlock = safetyRatings?.some(rating =>
                // FIX: Use HarmCategory enum for comparison.
                (rating.category === HarmCategory.HARM_CATEGORY_HATE_SPEECH ||
                 rating.category === HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT ||
                 rating.category === HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT) &&
                // FIX: Use HarmProbability enum for comparison.
                (rating.probability === HarmProbability.MEDIUM || rating.probability === HarmProbability.HIGH)
            );

            if (!hasSevereBlock) {
                shouldThrow = false;
            }
        }

        if (shouldThrow) {
            const errorMessage = `errorApiBlocked:{blockReason:"${blockReason}",blockReasonMessage:"${blockReasonMessage || ''}"}`;
            throw new Error(errorMessage);
        }
    }

    // Find the first image part in any candidate
    for (const candidate of response.candidates ?? []) {
        const imagePart = candidate.content?.parts?.find(part => part.inlineData);
        if (imagePart?.inlineData) {
            const { mimeType, data } = imagePart.inlineData;
            return `data:${mimeType};base64,${data}`;
        }
    }
    
    // Return null to indicate no image was found, allowing for a retry.
    return null;
};

const callApiWithRetry = async (apiCall: () => Promise<GenerateContentResponse>): Promise<string> => {
    let response = await apiCall();
    let result = handleApiResponse(response);

    if (result) {
        return result;
    }

    // Retry once if the first attempt didn't produce an image (or was permissively blocked)
    response = await apiCall();
    result = handleApiResponse(response);
    
    if (result) {
        return result;
    }

    // If still no image after retry, throw a detailed error.
    const finishReason = response.candidates?.[0]?.finishReason;
    // FIX: Use FinishReason enum for comparison.
    if (finishReason && finishReason !== FinishReason.STOP) {
        const errorMessage = `errorApiFinishUnexpected:{finishReason:"${finishReason}"}`;
        throw new Error(errorMessage);
    }
    const textFeedback = response.text?.trim();
    if (textFeedback) {
        throw new Error(`errorApiNoImage:{textFeedback:"${textFeedback}"}`);
    } else {
        throw new Error('errorApiNoImageFallback');
    }
};

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
const model = 'gemini-2.5-flash-image-preview';

export const generateModelImage = async (userImage: File): Promise<string> => {
    const userImagePart = await fileToPart(userImage);
    const prompt = `You are an expert fashion photographer AI specializing in creating hyperrealistic, full-body digital models for a virtual dressing room.

**CRITICAL REQUIREMENT:** The final output image MUST be a **full-body photograph**, showing the person from head to toe, even if the input image is only a portrait or headshot. You must realistically generate the lower body and legs to create a complete, standing figure.

**Key Directives:**
1.  **Full-Body Transformation:** Transform the person into a full-body model in a standard, relaxed standing pose.
2.  **Facial Fidelity:** You MUST preserve the person's identity with extreme accuracy. The facial features from the original photo must be maintained with a photorealistic likeness.
3.  **Studio Aesthetic (1:1 Aspect Ratio):**
    *   The image must be a perfect square (1:1 aspect ratio).
    *   The background MUST be a neutral, uniform studio gray with a very subtle vignette (darker at the edges). Do NOT add any halos or bright glows.
    *   The lighting must be soft and professional, clearly illuminating the entire figure.
4.  **Framing:** The model must occupy the full height of the square frame, with minimal margin at the top and bottom, ensuring shoes are visible.
5.  **Body Type:** Preserve the person's natural body type.

**Output:** Return ONLY the final, photorealistic, full-body square image. Do not add any text.`;
    
    const apiCall = () => ai.models.generateContent({
        model,
        contents: { parts: [userImagePart, { text: prompt }] },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    return callApiWithRetry(apiCall);
};

export const generateVirtualTryOnImage = async (modelImageUrl: string, garmentImage: File): Promise<string> => {
    const modelImagePart = dataUrlToPart(modelImageUrl);
    const garmentImagePart = await fileToPart(garmentImage);
    const prompt = `You are an expert virtual try-on AI. You will be given a 'model image' and a 'garment/accessory image'. Your task is to create a new, photorealistic image where the person from the 'model image' is wearing the item from the 'garment/accessory image'.

**CRITICAL RULES:**
1.  **Item Identification:** First, identify the item in the 'garment/accessory image'. It could be a shirt, pants, a hat, sunglasses, a watch, shoes, etc.
2.  **Realistic Application:** Apply the item to the model in the correct and most natural way. If it's a shirt, it replaces the existing shirt. If it's a hat, it goes on the head. If it's sunglasses, they go on the face. If it's shoes, they replace the existing shoes. The original clothing should be replaced ONLY IF the new item is of the same type (e.g., a new shirt replaces an old shirt, but adding a hat doesn't remove the shirt).
3.  **Preserve the Model:** The person's face, hair, body shape, and pose from the 'model image' MUST remain unchanged.
4.  **Preserve the Background:** The entire background from the 'model image' MUST be preserved perfectly.
5.  **Extreme Realism:** The item must be applied with extreme realism.
    *   **Draping and Folds:** The item must drape and fold naturally according to the model's pose.
    *   **Lighting and Shadows:** The lighting on the new item must perfectly match the lighting in the 'model image'. Shadows cast by the body onto the item, and by the item onto the body, must be soft and accurate.
6.  **Output:** Return ONLY the final, edited image, indistinguishable from a real photograph. Do not include any text.`;

    const apiCall = () => ai.models.generateContent({
        model,
        contents: { parts: [modelImagePart, garmentImagePart, { text: prompt }] },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    return callApiWithRetry(apiCall);
};

export const generatePoseVariation = async (tryOnImageUrl: string, poseInstruction: string): Promise<string> => {
    const tryOnImagePart = dataUrlToPart(tryOnImageUrl);
    const prompt = `You are an expert fashion photographer AI specializing in motion and posing. Take the provided image and regenerate it from a different perspective, maintaining the highest level of photorealism.

**Crucial Rules:**
1.  **Maintain Identity:** The person, all clothing items, accessories, and the background style must remain absolutely identical.
2.  **New Perspective:** The new pose and camera angle must be: "${poseInstruction}".
3.  **Realism is Key:** The fabric of the clothing must drape and fold realistically for the new pose. The lighting and shadows must be recalculated accurately to match the new position of the body and limbs.
4.  **Framing:** Maintain the original 1:1 square aspect ratio. Ensure the model remains correctly framed. If the pose is a close-up, frame it appropriately. If it is a full-body pose, ensure the entire body is visible.
5.  **Output:** Return ONLY the final image.`;

    const apiCall = () => ai.models.generateContent({
        model,
        contents: { parts: [tryOnImagePart, { text: prompt }] },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    return callApiWithRetry(apiCall);
};

export const generateOutfitForOccasion = async (baseModelImageUrl: string, occasion: string): Promise<string> => {
    const modelImagePart = dataUrlToPart(baseModelImageUrl);
    const prompt = `You are an expert AI fashion stylist with a keen eye for detail and realism. You will be given a 'model image' and a specific 'occasion'. Your task is to design and generate a complete, photorealistic, and appropriate outfit for that person for that occasion.

**Crucial Rules:**
1.  **Context is Key:** The generated outfit must be perfectly suited for the occasion described: "${occasion}".
2.  **Preserve the Model:** The person's face, hair, body shape, and pose from the 'model image' MUST remain identical and unchanged.
3.  **Preserve the Background:** The entire background from the 'model image' MUST be preserved perfectly.
4.  **Full Outfit:** Generate a complete head-to-toe look, including appropriate clothing, and footwear if visible.
5.  **Extreme Photorealism:** The final image must be indistinguishable from a high-resolution photograph.
    *   **Fabric Detail:** Render fabrics with intricate detail. A silk shirt should have a subtle sheen, a wool coat should show texture, and denim should have a visible weave.
    *   **Lighting Consistency:** The lighting on the new outfit must perfectly match the existing light source in the 'model image', including direction, softness, and color temperature.
    *   **Accurate Shadows:** Shadows cast by the new clothing on the model's body (e.g., a collar on the neck) and by the model on the clothing must be physically accurate and soft.
6.  **Output:** Return ONLY the final, edited image. Do not include any text.`;
    
    const apiCall = () => ai.models.generateContent({
        model,
        contents: { parts: [modelImagePart, { text: prompt }] },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    return callApiWithRetry(apiCall);
};

export const editImageWithText = async (baseImageUrl: string, prompt: string): Promise<string> => {
    const baseImagePart = dataUrlToPart(baseImageUrl);
    const fullPrompt = `You are an expert photo editing AI specializing in seamless, photorealistic modifications. You will be given an image and a text instruction. Your task is to edit the image according to the instruction while achieving the highest level of realism.

**Crucial Rules:**
1.  **Follow Instruction:** Precisely follow the user's text prompt: "${prompt}".
2.  **Preserve Identity & Pose:** The person's identity, face, body shape, and pose from the original image MUST remain unchanged unless the prompt explicitly asks to change them.
3.  **Preserve Background:** The entire background from the original image must be preserved unless the prompt specifies a change.
4.  **Uncompromising Realism:** The final image must be photorealistic and the edit perfectly seamless.
    *   **Texture Integrity:** If a texture is changed (e.g., "change the cotton shirt to silk"), the new texture must be rendered with extreme detail and accuracy, including its sheen, folds, and interaction with light.
    *   **Lighting and Shadow Consistency:** All modifications must perfectly integrate with the existing lighting of the scene. New shadows must be cast correctly, and highlights must appear on new elements in a physically accurate way.
5.  **Output:** Return ONLY the final, edited image. Do not include any text.`;

    const apiCall = () => ai.models.generateContent({
        model,
        contents: { parts: [baseImagePart, { text: fullPrompt }] },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    return callApiWithRetry(apiCall);
};