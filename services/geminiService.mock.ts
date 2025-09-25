/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// This is a mock service that simulates responses from the Gemini API.
// It returns placeholder images and is useful for development when API quotas are a concern.

const MOCK_DELAY = 1500; // Simulate network latency

// Placeholder images to return for various operations.
const MOCK_MODEL_URL = 'https://storage.googleapis.com/gemini-95-icons/asr-tryon-model.png';
const MOCK_POSE_URL = 'https://storage.googleapis.com/gemini-95-icons/vto-app/denim-jacket.png';
const MOCK_OCCASION_URL = 'https://storage.googleapis.com/gemini-95-icons/vto-app/evening-dress.png';
const MOCK_EDIT_URL = 'https://storage.googleapis.com/gemini-95-icons/vto-app/blazer.png';

const simulateApiCall = <T>(result: T): Promise<T> => {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(" MOCK API CALL SUCCEEDED ");
            resolve(result);
        }, MOCK_DELAY);
    });
};

export const generateModelImage = async (userImage: File): Promise<string> => {
    console.log(" MOCK generateModelImage called with:", userImage.name);
    return simulateApiCall(MOCK_MODEL_URL);
};

export const generateVirtualTryOnImage = async (modelImageUrl: string, garmentImage: File): Promise<string> => {
    console.log(" MOCK generateVirtualTryOnImage called with garment:", garmentImage.name);
    // Return a consistent placeholder image that looks like a person wearing a new outfit.
    // This provides a more realistic simulation than just showing the garment image.
    return simulateApiCall(MOCK_EDIT_URL);
};

export const generatePoseVariation = async (tryOnImageUrl: string, poseInstruction: string): Promise<string> => {
    console.log(" MOCK generatePoseVariation called with instruction:", poseInstruction);
    return simulateApiCall(MOCK_POSE_URL);
};

export const generateOutfitForOccasion = async (baseModelImageUrl: string, occasion: string): Promise<string> => {
    console.log(" MOCK generateOutfitForOccasion called for:", occasion);
    return simulateApiCall(MOCK_OCCASION_URL);
};

export const editImageWithText = async (baseImageUrl: string, prompt: string): Promise<string> => {
    console.log(" MOCK editImageWithText called with prompt:", prompt);
    return simulateApiCall(MOCK_EDIT_URL);
};