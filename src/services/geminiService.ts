/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  GoogleGenAI,
  GenerateContentResponse,
  Modality,
  BlockedReason,
  HarmCategory,
  HarmProbability,
  FinishReason,
} from "@google/genai";

const fileToPart = async (file: File) => {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
  const { mimeType, data } = dataUrlToParts(dataUrl);
  return { inlineData: { mimeType, data } };
};

const dataUrlToParts = (dataUrl: string) => {
  const arr = dataUrl.split(",");
  if (arr.length < 2) throw new Error("errorInvalidDataURL");
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch || !mimeMatch[1]) throw new Error("errorMimeParse");
  return { mimeType: mimeMatch[1], data: arr[1] };
};

const dataUrlToPart = (dataUrl: string) => {
  const { mimeType, data } = dataUrlToParts(dataUrl);
  return { inlineData: { mimeType, data } };
};

const handleApiResponse = (response: GenerateContentResponse): string | null => {
  if (response.promptFeedback?.blockReason) {
    const { blockReason, blockReasonMessage, safetyRatings } =
      response.promptFeedback;

    let shouldThrow = true;

    if (blockReason === BlockedReason.BLOCKED_REASON_UNSPECIFIED) {
      shouldThrow = false;
    } else if (blockReason === BlockedReason.SAFETY) {
      const hasSevereBlock = safetyRatings?.some(
        (rating) =>
          (rating.category === HarmCategory.HARM_CATEGORY_HATE_SPEECH ||
            rating.category === HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT ||
            rating.category === HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT) &&
          (rating.probability === HarmProbability.MEDIUM ||
            rating.probability === HarmProbability.HIGH)
      );

      if (!hasSevereBlock) {
        shouldThrow = false;
      }
    }

    if (shouldThrow) {
      const errorMessage = `errorApiBlocked:{blockReason:"${blockReason}",blockReasonMessage:"${
        blockReasonMessage || ""
      }"}`;
      throw new Error(errorMessage);
    }
  }

  for (const candidate of response.candidates ?? []) {
    const imagePart = candidate.content?.parts?.find((part) =>
