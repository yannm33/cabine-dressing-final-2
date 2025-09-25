/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useRef } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import Spinner from './Spinner';
import { cn, triggerHapticFeedback } from '../lib/utils';

// Add type definitions for the Web Speech API to resolve the 'Cannot find name' error.
interface SpeechRecognitionError extends Event {
    error: string;
}
interface SpeechRecognitionEvent extends Event {
    resultIndex: number;
    results: {
        isFinal: boolean;
        [key: number]: {
            transcript: string;
        };
    }[];
}

interface SpeechRecognition {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionError) => void) | null;
    onend: (() => void) | null;
}

const MicIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="23"></line>
        <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>
);


interface ImageModificationPanelProps {
  onApplyModification: (prompt: string) => void;
  isLoading: boolean;
  numImagesToGenerate: number;
  onNumImagesChange: (num: number) => void;
}

const ImageModificationPanel: React.FC<ImageModificationPanelProps> = ({ onApplyModification, isLoading, numImagesToGenerate, onNumImagesChange }) => {
    const { t, language } = useLocalization();
    const [prompt, setPrompt] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [speechError, setSpeechError] = useState<string | null>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const finalTranscriptRef = useRef("");

    useEffect(() => {
        const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognitionAPI) {
            setSpeechError(t('speechNotSupported'));
            return;
        }

        const recognition = new SpeechRecognitionAPI();
        recognitionRef.current = recognition;
        
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language === 'fr' ? 'fr-FR' : 'en-US';

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let interimTranscript = '';
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript.trim() + ' ';
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            finalTranscriptRef.current += finalTranscript;
            setPrompt(finalTranscriptRef.current + interimTranscript);
        };

        recognition.onerror = (event: SpeechRecognitionError) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'no-speech' || event.error === 'aborted' || event.error === 'network') {
                return; // Ignore these non-fatal errors
            }

            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                setSpeechError(t('errorSpeechNotAllowed'));
            } else {
                setSpeechError(t('errorSpeechGeneric'));
            }
            setIsListening(false);
        };

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.onresult = null;
                recognitionRef.current.onerror = null;
                recognitionRef.current.onend = null;
                recognitionRef.current.stop();
            }
        };
    }, [language, t]);

    const handlePointerDown = () => {
        if (isLoading || !recognitionRef.current || isListening) return;
        triggerHapticFeedback();
        setSpeechError(null);
        setPrompt("");
        finalTranscriptRef.current = "";
        
        try {
            recognitionRef.current.start();
            setIsListening(true);
        } catch (e) {
            console.error("Could not start speech recognition", e);
            setIsListening(false);
        }
    };

    const handlePointerUp = () => {
        if (!isListening || !recognitionRef.current) return;
        triggerHapticFeedback();
        
        recognitionRef.current.stop();
        setIsListening(false);
        
        const finalPrompt = finalTranscriptRef.current.trim();
        if (finalPrompt) {
            onApplyModification(finalPrompt);
            setPrompt("");
            finalTranscriptRef.current = "";
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim() && !isLoading) {
            onApplyModification(prompt.trim());
            setPrompt("");
            finalTranscriptRef.current = "";
        }
    };

    return (
        <div className="pt-4 mt-4 border-t border-gray-400/50">
            <h3 className="text-md font-semibold text-gray-800 mb-2">{t('editYourLook')}</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <div className="relative">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={t('editPlaceholder')}
                        rows={3}
                        className="w-full p-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all bg-white text-gray-900 disabled:bg-gray-100"
                        disabled={isLoading}
                    />
                    <button
                        type="button"
                        onPointerDown={handlePointerDown}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerUp} // End recording if finger slides off
                        disabled={!recognitionRef.current || isLoading}
                        className={cn(
                            'absolute top-2 right-2 p-3 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-90',
                            isListening
                                ? 'bg-green-500 text-white animate-pulse'
                                : 'bg-red-500 hover:bg-red-600 text-white'
                        )}
                        aria-label={t('useVoice')}
                    >
                        <MicIcon className="w-6 h-6" />
                    </button>
                </div>
                {speechError && <p className="text-xs text-red-500 mt-1">{speechError}</p>}
                <div className="my-2">
                    <label htmlFor="num-images-select-modifier" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('numImagesToGenerate')}
                    </label>
                    <select
                        id="num-images-select-modifier"
                        value={numImagesToGenerate}
                        onChange={(e) => onNumImagesChange(Number(e.target.value))}
                        disabled={isLoading}
                        className="block w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        {Array.from({ length: 7 }, (_, i) => i + 1).map(n => (
                            <option key={n} value={n}>{n} {n > 1 ? t('image_plural') : t('image_singular')}</option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={isLoading || !prompt.trim() || isListening}
                    className="w-full flex items-center justify-center text-center bg-gray-900 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 ease-in-out hover:bg-gray-700 active:scale-95 text-base disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <Spinner className="h-5 w-5 mr-2" />
                            <span>{t('modifyingLook')}</span>
                        </>
                    ) : (
                       t('applyModification')
                    )}
                </button>
            </form>
        </div>
    );
};

export default ImageModificationPanel;