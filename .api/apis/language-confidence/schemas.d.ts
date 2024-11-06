declare const PronunciationReportPronunciationAccentPost: {
    readonly body: {
        readonly properties: {
            readonly audio_base64: {
                readonly type: "string";
                readonly title: "Audio Base64";
                readonly description: "Base64 encoded string of the audio recording";
            };
            readonly audio_format: {
                readonly description: "An enumeration.";
                readonly type: "string";
                readonly enum: readonly ["wav", "mp3", "ogg", "m4a", "webm", "mp4", "aac"];
                readonly title: "AudioFormat";
            };
            readonly expected_text: {
                readonly type: "string";
                readonly title: "Expected Text";
                readonly description: "The text the user is expected to be speaking";
            };
            readonly user_metadata: {
                readonly properties: {
                    readonly speaker_gender: {
                        readonly enum: readonly ["male", "female"];
                        readonly title: "SpeakerGender";
                        readonly description: "An enumeration.";
                    };
                    readonly speaker_age: {
                        readonly enum: readonly ["child", "adolescent", "adult"];
                        readonly title: "SpeakerAge";
                        readonly description: "An enumeration.";
                    };
                    readonly speaker_english_level: {
                        readonly enum: readonly ["beginner", "intermediate", "advanced", "native"];
                        readonly title: "SpeakerEnglishLevel";
                        readonly description: "An enumeration.";
                    };
                };
                readonly type: "object";
                readonly required: readonly ["speaker_gender", "speaker_age"];
                readonly title: "UserMetadata";
            };
        };
        readonly additionalProperties: false;
        readonly type: "object";
        readonly required: readonly ["audio_base64", "audio_format", "expected_text"];
        readonly title: "PronunciationRequest";
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly accent: {
                    readonly enum: readonly ["us", "uk"];
                    readonly title: "Accent";
                    readonly description: "An enumeration.";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                };
            };
            readonly required: readonly ["accent"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly "x-user-id": {
                    readonly type: "string";
                    readonly title: "X-User-Id";
                    readonly description: "Unique userID, used for user tracking.";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly properties: {
                readonly words: {
                    readonly items: {
                        readonly properties: {
                            readonly word_text: {
                                readonly type: "string";
                                readonly title: "Word Text";
                                readonly description: "The label for the given word. e.g: apple";
                            };
                            readonly phonemes: {
                                readonly items: {
                                    readonly properties: {
                                        readonly ipa_label: {
                                            readonly type: "string";
                                            readonly title: "Ipa Label";
                                            readonly description: "The IPA (International Phonetic Alphabet) label for the phoneme";
                                        };
                                        readonly phoneme_score: {
                                            readonly type: "integer";
                                            readonly title: "Phoneme Score";
                                            readonly description: "Numeric pronunciation score out of 100 for the phoneme.\n         You can interpret this as a nativness score 'How close was this phoneme to sounding like a native speaker ?'.\n         A score above 70% usually represents a good phoneme pronunciation.";
                                        };
                                    };
                                    readonly type: "object";
                                    readonly required: readonly ["ipa_label", "phoneme_score"];
                                    readonly title: "PhoneReport";
                                };
                                readonly type: "array";
                                readonly title: "Phonemes";
                                readonly description: "Detailed list of phonemes for the given word";
                            };
                            readonly word_score: {
                                readonly type: "integer";
                                readonly title: "Word Score";
                                readonly description: "Pronunciation score at the word level, on a scale of 0 - 100";
                            };
                        };
                        readonly type: "object";
                        readonly required: readonly ["word_text", "phonemes", "word_score"];
                        readonly title: "WordReport";
                    };
                    readonly type: "array";
                    readonly title: "Words";
                    readonly description: "Detailed list of words for the given content";
                };
                readonly overall_score: {
                    readonly type: "number";
                    readonly title: "Overall Score";
                    readonly description: "Overall pronunciation score, on a scale of 0 - 100";
                };
                readonly expected_text: {
                    readonly type: "string";
                    readonly title: "Expected Text";
                    readonly description: "The text the user was expected to speak";
                };
                readonly english_proficiency_scores: {
                    readonly title: "English Proficiency Scores";
                    readonly description: "Estimated score predictions for english tests";
                    readonly type: "object";
                    readonly required: readonly ["mock_ielts", "mock_cefr", "mock_pte"];
                    readonly properties: {
                        readonly mock_ielts: {
                            readonly title: "Mock Ielts";
                            readonly description: "Mock estimated IELTS speaking score prediction";
                            readonly type: "object";
                            readonly required: readonly ["prediction"];
                            readonly properties: {
                                readonly prediction: {
                                    readonly type: "number";
                                    readonly title: "Prediction";
                                };
                            };
                        };
                        readonly mock_cefr: {
                            readonly title: "Mock Cefr";
                            readonly description: "Mock estimated CEFR speaking score prediction";
                            readonly type: "object";
                            readonly required: readonly ["prediction"];
                            readonly properties: {
                                readonly prediction: {
                                    readonly type: "string";
                                    readonly title: "Prediction";
                                };
                            };
                        };
                        readonly mock_pte: {
                            readonly title: "Mock Pte";
                            readonly description: "Mock estimated PTE speaking score prediction";
                            readonly type: "object";
                            readonly required: readonly ["prediction"];
                            readonly properties: {
                                readonly prediction: {
                                    readonly type: "string";
                                    readonly title: "Prediction";
                                };
                            };
                        };
                    };
                };
                readonly warnings: {
                    readonly additionalProperties: {
                        readonly type: "string";
                    };
                    readonly type: "object";
                    readonly title: "Warnings";
                    readonly description: "An object potentially containing warnings about the content submitted";
                };
                readonly lowest_scoring_phonemes: {
                    readonly items: {
                        readonly properties: {
                            readonly ipa_label: {
                                readonly type: "string";
                                readonly title: "Ipa Label";
                                readonly description: "The IPA (International Phonetic Alphabet) label for the phoneme";
                            };
                            readonly phoneme_score: {
                                readonly type: "integer";
                                readonly title: "Phoneme Score";
                                readonly description: "Numeric pronunciation score out of 100 for the phoneme.\n         You can interpret this as a nativness score 'How close was this phoneme to sounding like a native speaker ?'.\n         A score above 70% usually represents a good phoneme pronunciation.";
                            };
                        };
                        readonly type: "object";
                        readonly required: readonly ["ipa_label", "phoneme_score"];
                        readonly title: "PhoneReport";
                    };
                    readonly type: "array";
                    readonly title: "Lowest Scoring Phonemes";
                    readonly description: "A list of the 3 lowest scoring phonemes,\n         the first item in the list being the phoneme scoring the lowest";
                };
            };
            readonly type: "object";
            readonly required: readonly ["words", "overall_score", "expected_text", "english_proficiency_scores", "lowest_scoring_phonemes"];
            readonly title: "PronunciationReport";
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "422": {
            readonly properties: {
                readonly detail: {
                    readonly items: {
                        readonly properties: {
                            readonly loc: {
                                readonly items: {
                                    readonly anyOf: readonly [{
                                        readonly type: "string";
                                    }, {
                                        readonly type: "integer";
                                    }];
                                };
                                readonly type: "array";
                                readonly title: "Location";
                            };
                            readonly msg: {
                                readonly type: "string";
                                readonly title: "Message";
                            };
                            readonly type: {
                                readonly type: "string";
                                readonly title: "Error Type";
                            };
                        };
                        readonly type: "object";
                        readonly required: readonly ["loc", "msg", "type"];
                        readonly title: "ValidationError";
                    };
                    readonly type: "array";
                    readonly title: "Detail";
                };
            };
            readonly type: "object";
            readonly title: "HTTPValidationError";
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const SpeechAssessmentReportScriptedSpeechAssessmentScriptedAccentPost: {
    readonly body: {
        readonly properties: {
            readonly audio_base64: {
                readonly type: "string";
                readonly title: "Audio Base64";
                readonly description: "Base64 encoded string of the audio recording";
            };
            readonly audio_format: {
                readonly description: "An enumeration.";
                readonly type: "string";
                readonly enum: readonly ["wav", "mp3", "ogg", "m4a", "webm", "mp4", "aac"];
                readonly title: "AudioFormat";
            };
            readonly user_metadata: {
                readonly properties: {
                    readonly speaker_gender: {
                        readonly enum: readonly ["male", "female"];
                        readonly title: "SpeakerGender";
                        readonly description: "An enumeration.";
                    };
                    readonly speaker_age: {
                        readonly enum: readonly ["child", "adolescent", "adult"];
                        readonly title: "SpeakerAge";
                        readonly description: "An enumeration.";
                    };
                    readonly speaker_english_level: {
                        readonly enum: readonly ["beginner", "intermediate", "advanced", "native"];
                        readonly title: "SpeakerEnglishLevel";
                        readonly description: "An enumeration.";
                    };
                };
                readonly type: "object";
                readonly required: readonly ["speaker_gender", "speaker_age"];
                readonly title: "UserMetadata";
            };
            readonly expected_text: {
                readonly type: "string";
                readonly title: "Expected Text";
                readonly description: "The text the user is expected to be speaking";
            };
        };
        readonly additionalProperties: false;
        readonly type: "object";
        readonly required: readonly ["audio_base64", "audio_format", "expected_text"];
        readonly title: "SaapiRequestScripted";
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly accent: {
                    readonly enum: readonly ["us", "uk"];
                    readonly title: "Accent";
                    readonly description: "An enumeration.";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                };
            };
            readonly required: readonly ["accent"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly "x-user-id": {
                    readonly type: "string";
                    readonly title: "X-User-Id";
                    readonly description: "Unique userID, used for user tracking.";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly properties: {
                readonly pronunciation: {
                    readonly title: "PronunciationReport";
                    readonly description: "Detailed pronunciation report";
                    readonly type: "object";
                    readonly required: readonly ["words", "overall_score", "expected_text", "english_proficiency_scores", "lowest_scoring_phonemes"];
                    readonly properties: {
                        readonly words: {
                            readonly type: "array";
                            readonly title: "Words";
                            readonly description: "Detailed list of words for the given content";
                            readonly items: {
                                readonly type: "object";
                                readonly required: readonly ["word_text", "phonemes", "word_score"];
                                readonly title: "WordReport";
                                readonly properties: {
                                    readonly word_text: {
                                        readonly type: "string";
                                        readonly title: "Word Text";
                                        readonly description: "The label for the given word. e.g: apple";
                                    };
                                    readonly phonemes: {
                                        readonly type: "array";
                                        readonly title: "Phonemes";
                                        readonly description: "Detailed list of phonemes for the given word";
                                        readonly items: {
                                            readonly type: "object";
                                            readonly required: readonly ["ipa_label", "phoneme_score"];
                                            readonly title: "PhoneReport";
                                            readonly properties: {
                                                readonly ipa_label: {
                                                    readonly type: "string";
                                                    readonly title: "Ipa Label";
                                                    readonly description: "The IPA (International Phonetic Alphabet) label for the phoneme";
                                                };
                                                readonly phoneme_score: {
                                                    readonly type: "integer";
                                                    readonly title: "Phoneme Score";
                                                    readonly description: "Numeric pronunciation score out of 100 for the phoneme.\n         You can interpret this as a nativness score 'How close was this phoneme to sounding like a native speaker ?'.\n         A score above 70% usually represents a good phoneme pronunciation.";
                                                };
                                            };
                                        };
                                    };
                                    readonly word_score: {
                                        readonly type: "integer";
                                        readonly title: "Word Score";
                                        readonly description: "Pronunciation score at the word level, on a scale of 0 - 100";
                                    };
                                };
                            };
                        };
                        readonly overall_score: {
                            readonly type: "number";
                            readonly title: "Overall Score";
                            readonly description: "Overall pronunciation score, on a scale of 0 - 100";
                        };
                        readonly expected_text: {
                            readonly type: "string";
                            readonly title: "Expected Text";
                            readonly description: "The text the user was expected to speak";
                        };
                        readonly english_proficiency_scores: {
                            readonly title: "English Proficiency Scores";
                            readonly description: "Estimated score predictions for english tests";
                            readonly type: "object";
                            readonly required: readonly ["mock_ielts", "mock_cefr", "mock_pte"];
                            readonly properties: {
                                readonly mock_ielts: {
                                    readonly title: "Mock Ielts";
                                    readonly description: "Mock estimated IELTS speaking score prediction";
                                    readonly type: "object";
                                    readonly required: readonly ["prediction"];
                                    readonly properties: {
                                        readonly prediction: {
                                            readonly type: "number";
                                            readonly title: "Prediction";
                                        };
                                    };
                                };
                                readonly mock_cefr: {
                                    readonly title: "Mock Cefr";
                                    readonly description: "Mock estimated CEFR speaking score prediction";
                                    readonly type: "object";
                                    readonly required: readonly ["prediction"];
                                    readonly properties: {
                                        readonly prediction: {
                                            readonly type: "string";
                                            readonly title: "Prediction";
                                        };
                                    };
                                };
                                readonly mock_pte: {
                                    readonly title: "Mock Pte";
                                    readonly description: "Mock estimated PTE speaking score prediction";
                                    readonly type: "object";
                                    readonly required: readonly ["prediction"];
                                    readonly properties: {
                                        readonly prediction: {
                                            readonly type: "string";
                                            readonly title: "Prediction";
                                        };
                                    };
                                };
                            };
                        };
                        readonly warnings: {
                            readonly type: "object";
                            readonly title: "Warnings";
                            readonly description: "An object potentially containing warnings about the content submitted";
                            readonly additionalProperties: {
                                readonly type: "string";
                            };
                        };
                        readonly lowest_scoring_phonemes: {
                            readonly type: "array";
                            readonly title: "Lowest Scoring Phonemes";
                            readonly description: "A list of the 3 lowest scoring phonemes,\n         the first item in the list being the phoneme scoring the lowest";
                            readonly items: {
                                readonly type: "object";
                                readonly required: readonly ["ipa_label", "phoneme_score"];
                                readonly title: "PhoneReport";
                                readonly properties: {
                                    readonly ipa_label: {
                                        readonly type: "string";
                                        readonly title: "Ipa Label";
                                        readonly description: "The IPA (International Phonetic Alphabet) label for the phoneme";
                                    };
                                    readonly phoneme_score: {
                                        readonly type: "integer";
                                        readonly title: "Phoneme Score";
                                        readonly description: "Numeric pronunciation score out of 100 for the phoneme.\n         You can interpret this as a nativness score 'How close was this phoneme to sounding like a native speaker ?'.\n         A score above 70% usually represents a good phoneme pronunciation.";
                                    };
                                };
                            };
                        };
                    };
                };
                readonly fluency: {
                    readonly title: "FluencyReport";
                    readonly description: "Detailed fluency report";
                    readonly type: "object";
                    readonly required: readonly ["english_proficiency_scores"];
                    readonly properties: {
                        readonly overall_score: {
                            readonly type: "integer";
                            readonly title: "Overall Score";
                            readonly description: "Overall fluency score, on a scale of 0 - 100";
                        };
                        readonly metrics: {
                            readonly title: "Metrics";
                            readonly description: "Fluency metrics report";
                            readonly type: "object";
                            readonly required: readonly ["speech_rate", "speech_rate_over_time", "pauses", "filler_words", "discourse_markers", "filler_words_per_min", "pause_details", "repetitions", "filler_words_details"];
                            readonly properties: {
                                readonly speech_rate: {
                                    readonly type: "integer";
                                    readonly title: "Speech Rate";
                                    readonly description: "The average speech rate in words per minute (WPM) of the speaker";
                                };
                                readonly speech_rate_over_time: {
                                    readonly type: "array";
                                    readonly title: "Speech Rate Over Time";
                                    readonly description: "The speech rate in words per minute (WPM) of the speaker sampled every 3 seconds.\n         Can be used to build a graph of the speech rate.";
                                    readonly items: {
                                        readonly type: "integer";
                                    };
                                };
                                readonly pauses: {
                                    readonly type: "integer";
                                    readonly title: "Pauses";
                                    readonly description: "Number of long speech pauses";
                                };
                                readonly filler_words: {
                                    readonly type: "integer";
                                    readonly title: "Filler Words";
                                    readonly description: "Number of filler words";
                                };
                                readonly discourse_markers: {
                                    readonly type: "array";
                                    readonly title: "Discourse Markers";
                                    readonly description: "List of discourse markers used";
                                    readonly items: {
                                        readonly type: "object";
                                        readonly required: readonly ["text", "start_index", "end_index", "description"];
                                        readonly title: "DiscourseMarker";
                                        readonly properties: {
                                            readonly text: {
                                                readonly type: "string";
                                                readonly title: "Text";
                                                readonly description: "Part of the text concerned for this metric";
                                            };
                                            readonly start_index: {
                                                readonly type: "integer";
                                                readonly title: "Start Index";
                                                readonly description: "Start character position in the transcript";
                                            };
                                            readonly end_index: {
                                                readonly type: "integer";
                                                readonly title: "End Index";
                                                readonly description: "End character position in the transcript";
                                            };
                                            readonly description: {
                                                readonly type: "string";
                                                readonly title: "Description";
                                                readonly description: "Description of the discourse marker and it's use";
                                            };
                                        };
                                    };
                                };
                                readonly filler_words_per_min: {
                                    readonly type: "integer";
                                    readonly title: "Filler Words Per Min";
                                    readonly description: "Average filler words per minute";
                                };
                                readonly pause_details: {
                                    readonly type: "array";
                                    readonly title: "Pause Details";
                                    readonly description: "Detailed list of pauses";
                                    readonly items: {
                                        readonly type: "object";
                                        readonly required: readonly ["start_index", "end_index", "duration"];
                                        readonly title: "PauseDetails";
                                        readonly properties: {
                                            readonly start_index: {
                                                readonly type: "integer";
                                                readonly title: "Start Index";
                                                readonly description: "Start character position in the transcript of the pause";
                                            };
                                            readonly end_index: {
                                                readonly type: "integer";
                                                readonly title: "End Index";
                                                readonly description: "End character position in the transcript of the pause";
                                            };
                                            readonly duration: {
                                                readonly type: "number";
                                                readonly title: "Duration";
                                                readonly description: "Duration in seconds of the pause";
                                            };
                                        };
                                    };
                                };
                                readonly repetitions: {
                                    readonly type: "array";
                                    readonly title: "Repetitions";
                                    readonly description: "Detailed list of repetitions";
                                    readonly items: {
                                        readonly type: "object";
                                        readonly required: readonly ["text", "start_index", "end_index"];
                                        readonly title: "MetricDetails";
                                        readonly properties: {
                                            readonly text: {
                                                readonly type: "string";
                                                readonly title: "Text";
                                                readonly description: "Part of the text concerned for this metric";
                                            };
                                            readonly start_index: {
                                                readonly type: "integer";
                                                readonly title: "Start Index";
                                                readonly description: "Start character position in the transcript";
                                            };
                                            readonly end_index: {
                                                readonly type: "integer";
                                                readonly title: "End Index";
                                                readonly description: "End character position in the transcript";
                                            };
                                        };
                                    };
                                };
                                readonly filler_words_details: {
                                    readonly type: "array";
                                    readonly title: "Filler Words Details";
                                    readonly description: "Detailed list of filler words";
                                    readonly items: {
                                        readonly type: "object";
                                        readonly required: readonly ["text", "start_index", "end_index"];
                                        readonly title: "MetricDetails";
                                        readonly properties: {
                                            readonly text: {
                                                readonly type: "string";
                                                readonly title: "Text";
                                                readonly description: "Part of the text concerned for this metric";
                                            };
                                            readonly start_index: {
                                                readonly type: "integer";
                                                readonly title: "Start Index";
                                                readonly description: "Start character position in the transcript";
                                            };
                                            readonly end_index: {
                                                readonly type: "integer";
                                                readonly title: "End Index";
                                                readonly description: "End character position in the transcript";
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        readonly english_proficiency_scores: {
                            readonly title: "English Proficiency Scores";
                            readonly description: "Estimated score predictions for english tests";
                            readonly type: "object";
                            readonly required: readonly ["mock_ielts", "mock_cefr", "mock_pte"];
                            readonly properties: {
                                readonly mock_ielts: {
                                    readonly title: "Mock Ielts";
                                    readonly description: "Mock estimated IELTS speaking score prediction";
                                    readonly type: "object";
                                    readonly required: readonly ["prediction"];
                                    readonly properties: {
                                        readonly prediction: {
                                            readonly type: "number";
                                            readonly title: "Prediction";
                                        };
                                    };
                                };
                                readonly mock_cefr: {
                                    readonly title: "Mock Cefr";
                                    readonly description: "Mock estimated CEFR speaking score prediction";
                                    readonly type: "object";
                                    readonly required: readonly ["prediction"];
                                    readonly properties: {
                                        readonly prediction: {
                                            readonly type: "string";
                                            readonly title: "Prediction";
                                        };
                                    };
                                };
                                readonly mock_pte: {
                                    readonly title: "Mock Pte";
                                    readonly description: "Mock estimated PTE speaking score prediction";
                                    readonly type: "object";
                                    readonly required: readonly ["prediction"];
                                    readonly properties: {
                                        readonly prediction: {
                                            readonly type: "string";
                                            readonly title: "Prediction";
                                        };
                                    };
                                };
                            };
                        };
                        readonly warnings: {
                            readonly type: "object";
                            readonly title: "Warnings";
                            readonly description: "An object potentially containing warnings about the content submitted";
                            readonly additionalProperties: {
                                readonly type: "string";
                            };
                        };
                        readonly feedback: {
                            readonly title: "Feedback";
                            readonly description: "Fluency feedback report";
                            readonly type: "object";
                            readonly required: readonly ["speech_rate", "pauses", "filler_words"];
                            readonly properties: {
                                readonly speech_rate: {
                                    readonly title: "Speech Rate";
                                    readonly description: "Feedback text about the rate of speech";
                                    readonly type: "object";
                                    readonly required: readonly ["feedback_code", "feedback_text"];
                                    readonly properties: {
                                        readonly feedback_code: {
                                            readonly description: "An enumeration.\n\n`TOO_SLOW` `NORMAL` `TOO_FAST`";
                                            readonly type: "string";
                                            readonly enum: readonly ["TOO_SLOW", "NORMAL", "TOO_FAST"];
                                            readonly title: "SpeechRateFeedbackCode";
                                        };
                                        readonly feedback_text: {
                                            readonly description: "An enumeration.\n\n`You are speaking too slow.` `You are speaking at a normal pace.` `You are speaking too fast.`";
                                            readonly type: "string";
                                            readonly enum: readonly ["You are speaking too slow.", "You are speaking at a normal pace.", "You are speaking too fast."];
                                            readonly title: "SpeechRateFeedbackMessage";
                                        };
                                    };
                                };
                                readonly pauses: {
                                    readonly title: "Pauses";
                                    readonly description: "Feedback text about the number of speech pauses";
                                    readonly type: "object";
                                    readonly required: readonly ["feedback_code", "feedback_text"];
                                    readonly properties: {
                                        readonly feedback_code: {
                                            readonly description: "An enumeration.\n\n`NORMAL` `SOME_PAUSES` `TOO_MANY_PAUSES`";
                                            readonly type: "string";
                                            readonly enum: readonly ["NORMAL", "SOME_PAUSES", "TOO_MANY_PAUSES"];
                                            readonly title: "PausesFeedbackCode";
                                        };
                                        readonly feedback_text: {
                                            readonly description: "An enumeration.\n\n`You are speaking without making any long pauses.` `You are making some long pauses when you speak. Try to make shorter pauses in between your sentences.` `You are making too many long pauses when you speak. Try to make shorter pauses in between your sentences.`";
                                            readonly type: "string";
                                            readonly enum: readonly ["You are speaking without making any long pauses.", "You are making some long pauses when you speak. Try to make shorter pauses in between your sentences.", "You are making too many long pauses when you speak. Try to make shorter pauses in between your sentences."];
                                            readonly title: "PausesFeedbackMessage";
                                        };
                                    };
                                };
                                readonly filler_words: {
                                    readonly title: "Filler Words";
                                    readonly description: "Feedback text about the number of filler words";
                                    readonly type: "object";
                                    readonly required: readonly ["feedback_code", "feedback_text"];
                                    readonly properties: {
                                        readonly feedback_code: {
                                            readonly description: "An enumeration.\n\n`NORMAL` `SOME_FILLER_WORDS` `TOO_MANY_FILLER_WORDS`";
                                            readonly type: "string";
                                            readonly enum: readonly ["NORMAL", "SOME_FILLER_WORDS", "TOO_MANY_FILLER_WORDS"];
                                            readonly title: "FillerWordsFeedbackCode";
                                        };
                                        readonly feedback_text: {
                                            readonly description: "An enumeration.\n\n`You are speaking without using any filler words.` `You are using some filler words when you speak. Try to avoid using filler words.` `You are using too many filler words when you speak. Try to avoid using filler words.`";
                                            readonly type: "string";
                                            readonly enum: readonly ["You are speaking without using any filler words.", "You are using some filler words when you speak. Try to avoid using filler words.", "You are using too many filler words when you speak. Try to avoid using filler words."];
                                            readonly title: "FillerWordsFeedbackMessage";
                                        };
                                    };
                                };
                                readonly tagged_transcript: {
                                    readonly type: "string";
                                    readonly title: "Tagged Transcript";
                                    readonly description: "A version of the transcript containing custom HTML tags indicating\n         the position of fluency metrics. Can be used to build a front-end visual UI";
                                };
                            };
                        };
                    };
                };
                readonly overall: {
                    readonly title: "OverallReport";
                    readonly description: "Overall speaking report";
                    readonly type: "object";
                    readonly required: readonly ["english_proficiency_scores"];
                    readonly properties: {
                        readonly english_proficiency_scores: {
                            readonly title: "English Proficiency Scores";
                            readonly description: "Estimated score predictions for english tests";
                            readonly type: "object";
                            readonly required: readonly ["mock_ielts", "mock_cefr", "mock_pte"];
                            readonly properties: {
                                readonly mock_ielts: {
                                    readonly title: "Mock Ielts";
                                    readonly description: "Mock estimated IELTS speaking score prediction";
                                    readonly type: "object";
                                    readonly required: readonly ["prediction"];
                                    readonly properties: {
                                        readonly prediction: {
                                            readonly type: "number";
                                            readonly title: "Prediction";
                                        };
                                    };
                                };
                                readonly mock_cefr: {
                                    readonly title: "Mock Cefr";
                                    readonly description: "Mock estimated CEFR speaking score prediction";
                                    readonly type: "object";
                                    readonly required: readonly ["prediction"];
                                    readonly properties: {
                                        readonly prediction: {
                                            readonly type: "string";
                                            readonly title: "Prediction";
                                        };
                                    };
                                };
                                readonly mock_pte: {
                                    readonly title: "Mock Pte";
                                    readonly description: "Mock estimated PTE speaking score prediction";
                                    readonly type: "object";
                                    readonly required: readonly ["prediction"];
                                    readonly properties: {
                                        readonly prediction: {
                                            readonly type: "string";
                                            readonly title: "Prediction";
                                        };
                                    };
                                };
                            };
                        };
                        readonly overall_score: {
                            readonly type: "number";
                            readonly title: "Overall Score";
                            readonly description: "Overall speaking score, on a scale of 0 - 100";
                        };
                    };
                };
                readonly warnings: {
                    readonly additionalProperties: {
                        readonly type: "string";
                    };
                    readonly type: "object";
                    readonly title: "Warnings";
                    readonly description: "API response warnings";
                };
                readonly metadata: {
                    readonly title: "SciptedMetadataReport";
                    readonly description: "Additional speaking report details";
                    readonly type: "object";
                    readonly required: readonly ["predicted_text", "content_relevance"];
                    readonly properties: {
                        readonly predicted_text: {
                            readonly type: "string";
                            readonly title: "Predicted Text";
                            readonly description: "The text the user spoke, predicted by our ASR";
                        };
                        readonly content_relevance: {
                            readonly type: "integer";
                            readonly title: "Content Relevance";
                            readonly description: "A score from 0 - 100 of how close to the expected text the user's speech transcript was";
                        };
                    };
                };
            };
            readonly type: "object";
            readonly required: readonly ["pronunciation", "fluency", "overall", "metadata"];
            readonly title: "SaapiScriptedResponse";
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "422": {
            readonly properties: {
                readonly detail: {
                    readonly items: {
                        readonly properties: {
                            readonly loc: {
                                readonly items: {
                                    readonly anyOf: readonly [{
                                        readonly type: "string";
                                    }, {
                                        readonly type: "integer";
                                    }];
                                };
                                readonly type: "array";
                                readonly title: "Location";
                            };
                            readonly msg: {
                                readonly type: "string";
                                readonly title: "Message";
                            };
                            readonly type: {
                                readonly type: "string";
                                readonly title: "Error Type";
                            };
                        };
                        readonly type: "object";
                        readonly required: readonly ["loc", "msg", "type"];
                        readonly title: "ValidationError";
                    };
                    readonly type: "array";
                    readonly title: "Detail";
                };
            };
            readonly type: "object";
            readonly title: "HTTPValidationError";
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const SpeechAssessmentReportUnscriptedSpeechAssessmentUnscriptedAccentPost: {
    readonly body: {
        readonly properties: {
            readonly audio_base64: {
                readonly type: "string";
                readonly title: "Audio Base64";
                readonly description: "Base64 encoded string of the audio recording";
            };
            readonly audio_format: {
                readonly description: "An enumeration.";
                readonly type: "string";
                readonly enum: readonly ["wav", "mp3", "ogg", "m4a", "webm", "mp4", "aac"];
                readonly title: "AudioFormat";
            };
            readonly user_metadata: {
                readonly properties: {
                    readonly speaker_gender: {
                        readonly enum: readonly ["male", "female"];
                        readonly title: "SpeakerGender";
                        readonly description: "An enumeration.";
                    };
                    readonly speaker_age: {
                        readonly enum: readonly ["child", "adolescent", "adult"];
                        readonly title: "SpeakerAge";
                        readonly description: "An enumeration.";
                    };
                    readonly speaker_english_level: {
                        readonly enum: readonly ["beginner", "intermediate", "advanced", "native"];
                        readonly title: "SpeakerEnglishLevel";
                        readonly description: "An enumeration.";
                    };
                };
                readonly type: "object";
                readonly required: readonly ["speaker_gender", "speaker_age"];
                readonly title: "UserMetadata";
            };
            readonly context: {
                readonly title: "Context";
                readonly description: "Context details for unscripted content relevance. Each key is optional";
                readonly type: "object";
                readonly properties: {
                    readonly question: {
                        readonly type: "string";
                        readonly title: "Question";
                        readonly description: "The question the user should be answering";
                    };
                    readonly context_description: {
                        readonly type: "string";
                        readonly title: "Context Description";
                        readonly description: "A short description of the context the user is expected to answer within";
                    };
                    readonly valid_answer_description: {
                        readonly type: "string";
                        readonly title: "Valid Answer Description";
                        readonly description: "A short description of the valid answer the user is expected to give";
                    };
                };
            };
        };
        readonly additionalProperties: false;
        readonly type: "object";
        readonly required: readonly ["audio_base64", "audio_format"];
        readonly title: "SaapiRequestUnscripted";
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly accent: {
                    readonly enum: readonly ["us", "uk"];
                    readonly title: "Accent";
                    readonly description: "An enumeration.";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                };
            };
            readonly required: readonly ["accent"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly "x-user-id": {
                    readonly type: "string";
                    readonly title: "X-User-Id";
                    readonly description: "Unique userID, used for user tracking.";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly properties: {
                readonly pronunciation: {
                    readonly title: "PronunciationReport";
                    readonly description: "Detailed pronunciation report";
                    readonly type: "object";
                    readonly required: readonly ["words", "overall_score", "expected_text", "english_proficiency_scores", "lowest_scoring_phonemes"];
                    readonly properties: {
                        readonly words: {
                            readonly type: "array";
                            readonly title: "Words";
                            readonly description: "Detailed list of words for the given content";
                            readonly items: {
                                readonly type: "object";
                                readonly required: readonly ["word_text", "phonemes", "word_score"];
                                readonly title: "WordReport";
                                readonly properties: {
                                    readonly word_text: {
                                        readonly type: "string";
                                        readonly title: "Word Text";
                                        readonly description: "The label for the given word. e.g: apple";
                                    };
                                    readonly phonemes: {
                                        readonly type: "array";
                                        readonly title: "Phonemes";
                                        readonly description: "Detailed list of phonemes for the given word";
                                        readonly items: {
                                            readonly type: "object";
                                            readonly required: readonly ["ipa_label", "phoneme_score"];
                                            readonly title: "PhoneReport";
                                            readonly properties: {
                                                readonly ipa_label: {
                                                    readonly type: "string";
                                                    readonly title: "Ipa Label";
                                                    readonly description: "The IPA (International Phonetic Alphabet) label for the phoneme";
                                                };
                                                readonly phoneme_score: {
                                                    readonly type: "integer";
                                                    readonly title: "Phoneme Score";
                                                    readonly description: "Numeric pronunciation score out of 100 for the phoneme.\n         You can interpret this as a nativness score 'How close was this phoneme to sounding like a native speaker ?'.\n         A score above 70% usually represents a good phoneme pronunciation.";
                                                };
                                            };
                                        };
                                    };
                                    readonly word_score: {
                                        readonly type: "integer";
                                        readonly title: "Word Score";
                                        readonly description: "Pronunciation score at the word level, on a scale of 0 - 100";
                                    };
                                };
                            };
                        };
                        readonly overall_score: {
                            readonly type: "number";
                            readonly title: "Overall Score";
                            readonly description: "Overall pronunciation score, on a scale of 0 - 100";
                        };
                        readonly expected_text: {
                            readonly type: "string";
                            readonly title: "Expected Text";
                            readonly description: "The text the user was expected to speak";
                        };
                        readonly english_proficiency_scores: {
                            readonly title: "English Proficiency Scores";
                            readonly description: "Estimated score predictions for english tests";
                            readonly type: "object";
                            readonly required: readonly ["mock_ielts", "mock_cefr", "mock_pte"];
                            readonly properties: {
                                readonly mock_ielts: {
                                    readonly title: "Mock Ielts";
                                    readonly description: "Mock estimated IELTS speaking score prediction";
                                    readonly type: "object";
                                    readonly required: readonly ["prediction"];
                                    readonly properties: {
                                        readonly prediction: {
                                            readonly type: "number";
                                            readonly title: "Prediction";
                                        };
                                    };
                                };
                                readonly mock_cefr: {
                                    readonly title: "Mock Cefr";
                                    readonly description: "Mock estimated CEFR speaking score prediction";
                                    readonly type: "object";
                                    readonly required: readonly ["prediction"];
                                    readonly properties: {
                                        readonly prediction: {
                                            readonly type: "string";
                                            readonly title: "Prediction";
                                        };
                                    };
                                };
                                readonly mock_pte: {
                                    readonly title: "Mock Pte";
                                    readonly description: "Mock estimated PTE speaking score prediction";
                                    readonly type: "object";
                                    readonly required: readonly ["prediction"];
                                    readonly properties: {
                                        readonly prediction: {
                                            readonly type: "string";
                                            readonly title: "Prediction";
                                        };
                                    };
                                };
                            };
                        };
                        readonly warnings: {
                            readonly type: "object";
                            readonly title: "Warnings";
                            readonly description: "An object potentially containing warnings about the content submitted";
                            readonly additionalProperties: {
                                readonly type: "string";
                            };
                        };
                        readonly lowest_scoring_phonemes: {
                            readonly type: "array";
                            readonly title: "Lowest Scoring Phonemes";
                            readonly description: "A list of the 3 lowest scoring phonemes,\n         the first item in the list being the phoneme scoring the lowest";
                            readonly items: {
                                readonly type: "object";
                                readonly required: readonly ["ipa_label", "phoneme_score"];
                                readonly title: "PhoneReport";
                                readonly properties: {
                                    readonly ipa_label: {
                                        readonly type: "string";
                                        readonly title: "Ipa Label";
                                        readonly description: "The IPA (International Phonetic Alphabet) label for the phoneme";
                                    };
                                    readonly phoneme_score: {
                                        readonly type: "integer";
                                        readonly title: "Phoneme Score";
                                        readonly description: "Numeric pronunciation score out of 100 for the phoneme.\n         You can interpret this as a nativness score 'How close was this phoneme to sounding like a native speaker ?'.\n         A score above 70% usually represents a good phoneme pronunciation.";
                                    };
                                };
                            };
                        };
                    };
                };
                readonly fluency: {
                    readonly title: "FluencyReport";
                    readonly description: "Detailed fluency report";
                    readonly type: "object";
                    readonly required: readonly ["english_proficiency_scores"];
                    readonly properties: {
                        readonly overall_score: {
                            readonly type: "integer";
                            readonly title: "Overall Score";
                            readonly description: "Overall fluency score, on a scale of 0 - 100";
                        };
                        readonly metrics: {
                            readonly title: "Metrics";
                            readonly description: "Fluency metrics report";
                            readonly type: "object";
                            readonly required: readonly ["speech_rate", "speech_rate_over_time", "pauses", "filler_words", "discourse_markers", "filler_words_per_min", "pause_details", "repetitions", "filler_words_details"];
                            readonly properties: {
                                readonly speech_rate: {
                                    readonly type: "integer";
                                    readonly title: "Speech Rate";
                                    readonly description: "The average speech rate in words per minute (WPM) of the speaker";
                                };
                                readonly speech_rate_over_time: {
                                    readonly type: "array";
                                    readonly title: "Speech Rate Over Time";
                                    readonly description: "The speech rate in words per minute (WPM) of the speaker sampled every 3 seconds.\n         Can be used to build a graph of the speech rate.";
                                    readonly items: {
                                        readonly type: "integer";
                                    };
                                };
                                readonly pauses: {
                                    readonly type: "integer";
                                    readonly title: "Pauses";
                                    readonly description: "Number of long speech pauses";
                                };
                                readonly filler_words: {
                                    readonly type: "integer";
                                    readonly title: "Filler Words";
                                    readonly description: "Number of filler words";
                                };
                                readonly discourse_markers: {
                                    readonly type: "array";
                                    readonly title: "Discourse Markers";
                                    readonly description: "List of discourse markers used";
                                    readonly items: {
                                        readonly type: "object";
                                        readonly required: readonly ["text", "start_index", "end_index", "description"];
                                        readonly title: "DiscourseMarker";
                                        readonly properties: {
                                            readonly text: {
                                                readonly type: "string";
                                                readonly title: "Text";
                                                readonly description: "Part of the text concerned for this metric";
                                            };
                                            readonly start_index: {
                                                readonly type: "integer";
                                                readonly title: "Start Index";
                                                readonly description: "Start character position in the transcript";
                                            };
                                            readonly end_index: {
                                                readonly type: "integer";
                                                readonly title: "End Index";
                                                readonly description: "End character position in the transcript";
                                            };
                                            readonly description: {
                                                readonly type: "string";
                                                readonly title: "Description";
                                                readonly description: "Description of the discourse marker and it's use";
                                            };
                                        };
                                    };
                                };
                                readonly filler_words_per_min: {
                                    readonly type: "integer";
                                    readonly title: "Filler Words Per Min";
                                    readonly description: "Average filler words per minute";
                                };
                                readonly pause_details: {
                                    readonly type: "array";
                                    readonly title: "Pause Details";
                                    readonly description: "Detailed list of pauses";
                                    readonly items: {
                                        readonly type: "object";
                                        readonly required: readonly ["start_index", "end_index", "duration"];
                                        readonly title: "PauseDetails";
                                        readonly properties: {
                                            readonly start_index: {
                                                readonly type: "integer";
                                                readonly title: "Start Index";
                                                readonly description: "Start character position in the transcript of the pause";
                                            };
                                            readonly end_index: {
                                                readonly type: "integer";
                                                readonly title: "End Index";
                                                readonly description: "End character position in the transcript of the pause";
                                            };
                                            readonly duration: {
                                                readonly type: "number";
                                                readonly title: "Duration";
                                                readonly description: "Duration in seconds of the pause";
                                            };
                                        };
                                    };
                                };
                                readonly repetitions: {
                                    readonly type: "array";
                                    readonly title: "Repetitions";
                                    readonly description: "Detailed list of repetitions";
                                    readonly items: {
                                        readonly type: "object";
                                        readonly required: readonly ["text", "start_index", "end_index"];
                                        readonly title: "MetricDetails";
                                        readonly properties: {
                                            readonly text: {
                                                readonly type: "string";
                                                readonly title: "Text";
                                                readonly description: "Part of the text concerned for this metric";
                                            };
                                            readonly start_index: {
                                                readonly type: "integer";
                                                readonly title: "Start Index";
                                                readonly description: "Start character position in the transcript";
                                            };
                                            readonly end_index: {
                                                readonly type: "integer";
                                                readonly title: "End Index";
                                                readonly description: "End character position in the transcript";
                                            };
                                        };
                                    };
                                };
                                readonly filler_words_details: {
                                    readonly type: "array";
                                    readonly title: "Filler Words Details";
                                    readonly description: "Detailed list of filler words";
                                    readonly items: {
                                        readonly type: "object";
                                        readonly required: readonly ["text", "start_index", "end_index"];
                                        readonly title: "MetricDetails";
                                        readonly properties: {
                                            readonly text: {
                                                readonly type: "string";
                                                readonly title: "Text";
                                                readonly description: "Part of the text concerned for this metric";
                                            };
                                            readonly start_index: {
                                                readonly type: "integer";
                                                readonly title: "Start Index";
                                                readonly description: "Start character position in the transcript";
                                            };
                                            readonly end_index: {
                                                readonly type: "integer";
                                                readonly title: "End Index";
                                                readonly description: "End character position in the transcript";
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        readonly english_proficiency_scores: {
                            readonly title: "English Proficiency Scores";
                            readonly description: "Estimated score predictions for english tests";
                            readonly type: "object";
                            readonly required: readonly ["mock_ielts", "mock_cefr", "mock_pte"];
                            readonly properties: {
                                readonly mock_ielts: {
                                    readonly title: "Mock Ielts";
                                    readonly description: "Mock estimated IELTS speaking score prediction";
                                    readonly type: "object";
                                    readonly required: readonly ["prediction"];
                                    readonly properties: {
                                        readonly prediction: {
                                            readonly type: "number";
                                            readonly title: "Prediction";
                                        };
                                    };
                                };
                                readonly mock_cefr: {
                                    readonly title: "Mock Cefr";
                                    readonly description: "Mock estimated CEFR speaking score prediction";
                                    readonly type: "object";
                                    readonly required: readonly ["prediction"];
                                    readonly properties: {
                                        readonly prediction: {
                                            readonly type: "string";
                                            readonly title: "Prediction";
                                        };
                                    };
                                };
                                readonly mock_pte: {
                                    readonly title: "Mock Pte";
                                    readonly description: "Mock estimated PTE speaking score prediction";
                                    readonly type: "object";
                                    readonly required: readonly ["prediction"];
                                    readonly properties: {
                                        readonly prediction: {
                                            readonly type: "string";
                                            readonly title: "Prediction";
                                        };
                                    };
                                };
                            };
                        };
                        readonly warnings: {
                            readonly type: "object";
                            readonly title: "Warnings";
                            readonly description: "An object potentially containing warnings about the content submitted";
                            readonly additionalProperties: {
                                readonly type: "string";
                            };
                        };
                        readonly feedback: {
                            readonly title: "Feedback";
                            readonly description: "Fluency feedback report";
                            readonly type: "object";
                            readonly required: readonly ["speech_rate", "pauses", "filler_words"];
                            readonly properties: {
                                readonly speech_rate: {
                                    readonly title: "Speech Rate";
                                    readonly description: "Feedback text about the rate of speech";
                                    readonly type: "object";
                                    readonly required: readonly ["feedback_code", "feedback_text"];
                                    readonly properties: {
                                        readonly feedback_code: {
                                            readonly description: "An enumeration.\n\n`TOO_SLOW` `NORMAL` `TOO_FAST`";
                                            readonly type: "string";
                                            readonly enum: readonly ["TOO_SLOW", "NORMAL", "TOO_FAST"];
                                            readonly title: "SpeechRateFeedbackCode";
                                        };
                                        readonly feedback_text: {
                                            readonly description: "An enumeration.\n\n`You are speaking too slow.` `You are speaking at a normal pace.` `You are speaking too fast.`";
                                            readonly type: "string";
                                            readonly enum: readonly ["You are speaking too slow.", "You are speaking at a normal pace.", "You are speaking too fast."];
                                            readonly title: "SpeechRateFeedbackMessage";
                                        };
                                    };
                                };
                                readonly pauses: {
                                    readonly title: "Pauses";
                                    readonly description: "Feedback text about the number of speech pauses";
                                    readonly type: "object";
                                    readonly required: readonly ["feedback_code", "feedback_text"];
                                    readonly properties: {
                                        readonly feedback_code: {
                                            readonly description: "An enumeration.\n\n`NORMAL` `SOME_PAUSES` `TOO_MANY_PAUSES`";
                                            readonly type: "string";
                                            readonly enum: readonly ["NORMAL", "SOME_PAUSES", "TOO_MANY_PAUSES"];
                                            readonly title: "PausesFeedbackCode";
                                        };
                                        readonly feedback_text: {
                                            readonly description: "An enumeration.\n\n`You are speaking without making any long pauses.` `You are making some long pauses when you speak. Try to make shorter pauses in between your sentences.` `You are making too many long pauses when you speak. Try to make shorter pauses in between your sentences.`";
                                            readonly type: "string";
                                            readonly enum: readonly ["You are speaking without making any long pauses.", "You are making some long pauses when you speak. Try to make shorter pauses in between your sentences.", "You are making too many long pauses when you speak. Try to make shorter pauses in between your sentences."];
                                            readonly title: "PausesFeedbackMessage";
                                        };
                                    };
                                };
                                readonly filler_words: {
                                    readonly title: "Filler Words";
                                    readonly description: "Feedback text about the number of filler words";
                                    readonly type: "object";
                                    readonly required: readonly ["feedback_code", "feedback_text"];
                                    readonly properties: {
                                        readonly feedback_code: {
                                            readonly description: "An enumeration.\n\n`NORMAL` `SOME_FILLER_WORDS` `TOO_MANY_FILLER_WORDS`";
                                            readonly type: "string";
                                            readonly enum: readonly ["NORMAL", "SOME_FILLER_WORDS", "TOO_MANY_FILLER_WORDS"];
                                            readonly title: "FillerWordsFeedbackCode";
                                        };
                                        readonly feedback_text: {
                                            readonly description: "An enumeration.\n\n`You are speaking without using any filler words.` `You are using some filler words when you speak. Try to avoid using filler words.` `You are using too many filler words when you speak. Try to avoid using filler words.`";
                                            readonly type: "string";
                                            readonly enum: readonly ["You are speaking without using any filler words.", "You are using some filler words when you speak. Try to avoid using filler words.", "You are using too many filler words when you speak. Try to avoid using filler words."];
                                            readonly title: "FillerWordsFeedbackMessage";
                                        };
                                    };
                                };
                                readonly tagged_transcript: {
                                    readonly type: "string";
                                    readonly title: "Tagged Transcript";
                                    readonly description: "A version of the transcript containing custom HTML tags indicating\n         the position of fluency metrics. Can be used to build a front-end visual UI";
                                };
                            };
                        };
                    };
                };
                readonly overall: {
                    readonly title: "OverallReport";
                    readonly description: "Overall speaking report";
                    readonly type: "object";
                    readonly required: readonly ["english_proficiency_scores"];
                    readonly properties: {
                        readonly english_proficiency_scores: {
                            readonly title: "English Proficiency Scores";
                            readonly description: "Estimated score predictions for english tests";
                            readonly type: "object";
                            readonly required: readonly ["mock_ielts", "mock_cefr", "mock_pte"];
                            readonly properties: {
                                readonly mock_ielts: {
                                    readonly title: "Mock Ielts";
                                    readonly description: "Mock estimated IELTS speaking score prediction";
                                    readonly type: "object";
                                    readonly required: readonly ["prediction"];
                                    readonly properties: {
                                        readonly prediction: {
                                            readonly type: "number";
                                            readonly title: "Prediction";
                                        };
                                    };
                                };
                                readonly mock_cefr: {
                                    readonly title: "Mock Cefr";
                                    readonly description: "Mock estimated CEFR speaking score prediction";
                                    readonly type: "object";
                                    readonly required: readonly ["prediction"];
                                    readonly properties: {
                                        readonly prediction: {
                                            readonly type: "string";
                                            readonly title: "Prediction";
                                        };
                                    };
                                };
                                readonly mock_pte: {
                                    readonly title: "Mock Pte";
                                    readonly description: "Mock estimated PTE speaking score prediction";
                                    readonly type: "object";
                                    readonly required: readonly ["prediction"];
                                    readonly properties: {
                                        readonly prediction: {
                                            readonly type: "string";
                                            readonly title: "Prediction";
                                        };
                                    };
                                };
                            };
                        };
                        readonly overall_score: {
                            readonly type: "number";
                            readonly title: "Overall Score";
                            readonly description: "Overall speaking score, on a scale of 0 - 100";
                        };
                    };
                };
                readonly warnings: {
                    readonly additionalProperties: {
                        readonly type: "string";
                    };
                    readonly type: "object";
                    readonly title: "Warnings";
                    readonly description: "API response warnings";
                };
                readonly vocabulary: {
                    readonly title: "VocabularyReport";
                    readonly description: "Detailed vocabulary report";
                    readonly type: "object";
                    readonly required: readonly ["overall_score", "metrics", "english_proficiency_scores"];
                    readonly properties: {
                        readonly overall_score: {
                            readonly type: "integer";
                            readonly title: "Overall Score";
                            readonly description: "Overall vocabulary score, on a scale of 0 - 100";
                        };
                        readonly metrics: {
                            readonly title: "Metrics";
                            readonly description: "Vocabulary metrics report";
                            readonly type: "object";
                            readonly required: readonly ["vocabulary_complexity"];
                            readonly properties: {
                                readonly vocabulary_complexity: {
                                    readonly description: "An enumeration.\n\n`SIMPLE` `AVERAGE` `COMPLEX`";
                                    readonly type: "string";
                                    readonly enum: readonly ["SIMPLE", "AVERAGE", "COMPLEX"];
                                    readonly title: "VocabularyComplexity";
                                };
                                readonly idiom_details: {
                                    readonly type: "array";
                                    readonly title: "Idiom Details";
                                    readonly description: "Detailed list of idioms detected";
                                    readonly items: {
                                        readonly type: "object";
                                        readonly required: readonly ["start_index", "end_index"];
                                        readonly title: "IdiomDetails";
                                        readonly properties: {
                                            readonly start_index: {
                                                readonly type: "integer";
                                                readonly title: "Start Index";
                                                readonly description: "Start character position in the transcript";
                                            };
                                            readonly end_index: {
                                                readonly type: "integer";
                                                readonly title: "End Index";
                                                readonly description: "End character position in the transcript";
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        readonly english_proficiency_scores: {
                            readonly type: "object";
                            readonly required: readonly ["mock_ielts", "mock_cefr", "mock_pte"];
                            readonly title: "EnglishProficiencyScores";
                            readonly properties: {
                                readonly mock_ielts: {
                                    readonly title: "Mock Ielts";
                                    readonly description: "Mock estimated IELTS speaking score prediction";
                                    readonly type: "object";
                                    readonly required: readonly ["prediction"];
                                    readonly properties: {
                                        readonly prediction: {
                                            readonly type: "number";
                                            readonly title: "Prediction";
                                        };
                                    };
                                };
                                readonly mock_cefr: {
                                    readonly title: "Mock Cefr";
                                    readonly description: "Mock estimated CEFR speaking score prediction";
                                    readonly type: "object";
                                    readonly required: readonly ["prediction"];
                                    readonly properties: {
                                        readonly prediction: {
                                            readonly type: "string";
                                            readonly title: "Prediction";
                                        };
                                    };
                                };
                                readonly mock_pte: {
                                    readonly title: "Mock Pte";
                                    readonly description: "Mock estimated PTE speaking score prediction";
                                    readonly type: "object";
                                    readonly required: readonly ["prediction"];
                                    readonly properties: {
                                        readonly prediction: {
                                            readonly type: "string";
                                            readonly title: "Prediction";
                                        };
                                    };
                                };
                            };
                        };
                        readonly warnings: {
                            readonly type: "object";
                            readonly title: "Warnings";
                            readonly description: "An object potentially containing warnings about the content submitted";
                            readonly additionalProperties: {
                                readonly type: "string";
                            };
                        };
                        readonly feedback: {
                            readonly title: "Feedback";
                            readonly description: "Vocabulary feedback report";
                            readonly type: "object";
                            readonly properties: {
                                readonly tagged_transcript: {
                                    readonly type: "string";
                                    readonly title: "Tagged Transcript";
                                    readonly description: "A version of the transcript containing custom HTML tags\n         indicating the position of metrics. Can be used to build a front-end visual UI";
                                };
                            };
                        };
                    };
                };
                readonly grammar: {
                    readonly title: "GrammarReport";
                    readonly description: "Detailed grammar report";
                    readonly type: "object";
                    readonly required: readonly ["english_proficiency_scores"];
                    readonly properties: {
                        readonly overall_score: {
                            readonly type: "integer";
                            readonly title: "Overall Score";
                            readonly description: "Overall grammar score, on a scale of 0 - 100";
                        };
                        readonly metrics: {
                            readonly title: "Metrics";
                            readonly description: "Grammar metrics report";
                            readonly type: "object";
                            readonly required: readonly ["mistake_count"];
                            readonly properties: {
                                readonly mistake_count: {
                                    readonly type: "integer";
                                    readonly title: "Mistake Count";
                                    readonly description: "List of grammar mistakes";
                                };
                                readonly grammatical_complexity: {
                                    readonly description: "An enumeration.\n\n`SIMPLE` `AVERAGE` `COMPLEX` `NO_STRUCTURE`";
                                    readonly type: "string";
                                    readonly enum: readonly ["SIMPLE", "AVERAGE", "COMPLEX", "NO_STRUCTURE"];
                                    readonly title: "GrammaticalComplexity";
                                };
                                readonly grammar_errors: {
                                    readonly type: "array";
                                    readonly title: "Grammar Errors";
                                    readonly description: "Detailed list of grammar errors";
                                    readonly items: {
                                        readonly type: "object";
                                        readonly required: readonly ["mistake", "correction", "start_index", "end_index"];
                                        readonly title: "GrammarError";
                                        readonly properties: {
                                            readonly mistake: {
                                                readonly type: "string";
                                                readonly title: "Mistake";
                                                readonly description: "Text of the grammar mistake";
                                            };
                                            readonly correction: {
                                                readonly type: "string";
                                                readonly title: "Correction";
                                                readonly description: "Suggested correction for the grammar mistake";
                                            };
                                            readonly start_index: {
                                                readonly type: "integer";
                                                readonly title: "Start Index";
                                                readonly description: "Start character position in the transcript";
                                            };
                                            readonly end_index: {
                                                readonly type: "integer";
                                                readonly title: "End Index";
                                                readonly description: "End character position in the transcript";
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        readonly english_proficiency_scores: {
                            readonly title: "English Proficiency Scores";
                            readonly description: "Estimated score predictions for english tests";
                            readonly type: "object";
                            readonly required: readonly ["mock_ielts", "mock_cefr", "mock_pte"];
                            readonly properties: {
                                readonly mock_ielts: {
                                    readonly title: "Mock Ielts";
                                    readonly description: "Mock estimated IELTS speaking score prediction";
                                    readonly type: "object";
                                    readonly required: readonly ["prediction"];
                                    readonly properties: {
                                        readonly prediction: {
                                            readonly type: "number";
                                            readonly title: "Prediction";
                                        };
                                    };
                                };
                                readonly mock_cefr: {
                                    readonly title: "Mock Cefr";
                                    readonly description: "Mock estimated CEFR speaking score prediction";
                                    readonly type: "object";
                                    readonly required: readonly ["prediction"];
                                    readonly properties: {
                                        readonly prediction: {
                                            readonly type: "string";
                                            readonly title: "Prediction";
                                        };
                                    };
                                };
                                readonly mock_pte: {
                                    readonly title: "Mock Pte";
                                    readonly description: "Mock estimated PTE speaking score prediction";
                                    readonly type: "object";
                                    readonly required: readonly ["prediction"];
                                    readonly properties: {
                                        readonly prediction: {
                                            readonly type: "string";
                                            readonly title: "Prediction";
                                        };
                                    };
                                };
                            };
                        };
                        readonly feedback: {
                            readonly title: "Feedback";
                            readonly description: "Grammar feedback report";
                            readonly type: "object";
                            readonly properties: {
                                readonly grammar_errors: {
                                    readonly type: "array";
                                    readonly title: "Grammar Errors";
                                    readonly description: "Detailed list of grammar errors";
                                    readonly items: {
                                        readonly type: "object";
                                        readonly required: readonly ["mistake", "correction", "start_index", "end_index"];
                                        readonly title: "GrammarError";
                                        readonly properties: {
                                            readonly mistake: {
                                                readonly type: "string";
                                                readonly title: "Mistake";
                                                readonly description: "Text of the grammar mistake";
                                            };
                                            readonly correction: {
                                                readonly type: "string";
                                                readonly title: "Correction";
                                                readonly description: "Suggested correction for the grammar mistake";
                                            };
                                            readonly start_index: {
                                                readonly type: "integer";
                                                readonly title: "Start Index";
                                                readonly description: "Start character position in the transcript";
                                            };
                                            readonly end_index: {
                                                readonly type: "integer";
                                                readonly title: "End Index";
                                                readonly description: "End character position in the transcript";
                                            };
                                        };
                                    };
                                };
                                readonly corrected_text: {
                                    readonly type: "string";
                                    readonly title: "Corrected Text";
                                    readonly description: "Version of the transcript with the detected grammar errors corrected";
                                };
                                readonly tagged_transcript: {
                                    readonly type: "string";
                                    readonly title: "Tagged Transcript";
                                    readonly description: "A version of the transcript containing custom HTML tags indicating the position of metrics.\n         Can be used to build a front-end visual UI";
                                };
                                readonly grammar_feedback: {
                                    readonly type: "string";
                                    readonly title: "Grammar Feedback";
                                    readonly description: "Short text feedback on the user's grammar";
                                };
                            };
                        };
                    };
                };
                readonly metadata: {
                    readonly title: "UnscriptedMetadataReport";
                    readonly description: "Additional speaking report details";
                    readonly type: "object";
                    readonly required: readonly ["predicted_text"];
                    readonly properties: {
                        readonly predicted_text: {
                            readonly type: "string";
                            readonly title: "Predicted Text";
                            readonly description: "The text the user spoke, predicted by our ASR";
                        };
                        readonly content_relevance: {
                            readonly description: "An enumeration.\n\n`RELEVANT` `NOT_RELEVANT` `PARTIALLY_RELEVANT`";
                            readonly type: "string";
                            readonly enum: readonly ["RELEVANT", "NOT_RELEVANT", "PARTIALLY_RELEVANT"];
                            readonly title: "ContentRelevance";
                        };
                        readonly content_relevance_feedback: {
                            readonly type: "string";
                            readonly title: "Content Relevance Feedback";
                            readonly description: "Text explanation of the content relevance";
                        };
                        readonly valid_answer: {
                            readonly description: "An enumeration.\n\n`CORRECT` `PARTIALLY_CORRECT` `INCORRECT`";
                            readonly type: "string";
                            readonly enum: readonly ["CORRECT", "PARTIALLY_CORRECT", "INCORRECT"];
                            readonly title: "ValidAnswer";
                        };
                    };
                };
            };
            readonly type: "object";
            readonly required: readonly ["pronunciation", "fluency", "overall", "vocabulary", "grammar", "metadata"];
            readonly title: "SaapiUnscriptedResponse";
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "422": {
            readonly properties: {
                readonly detail: {
                    readonly items: {
                        readonly properties: {
                            readonly loc: {
                                readonly items: {
                                    readonly anyOf: readonly [{
                                        readonly type: "string";
                                    }, {
                                        readonly type: "integer";
                                    }];
                                };
                                readonly type: "array";
                                readonly title: "Location";
                            };
                            readonly msg: {
                                readonly type: "string";
                                readonly title: "Message";
                            };
                            readonly type: {
                                readonly type: "string";
                                readonly title: "Error Type";
                            };
                        };
                        readonly type: "object";
                        readonly required: readonly ["loc", "msg", "type"];
                        readonly title: "ValidationError";
                    };
                    readonly type: "array";
                    readonly title: "Detail";
                };
            };
            readonly type: "object";
            readonly title: "HTTPValidationError";
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const WritingAssessmentReportWritingAssessmentAlphaPost: {
    readonly body: {
        readonly properties: {
            readonly text: {
                readonly type: "string";
                readonly title: "Text";
            };
            readonly context: {
                readonly properties: {
                    readonly question: {
                        readonly type: "string";
                        readonly title: "Question";
                        readonly description: "The question the user should be answering";
                    };
                    readonly context_description: {
                        readonly type: "string";
                        readonly title: "Context Description";
                        readonly description: "A short description of the context the user is expected to answer within";
                    };
                    readonly valid_answer_description: {
                        readonly type: "string";
                        readonly title: "Valid Answer Description";
                        readonly description: "A short description of the valid answer the user is expected to give";
                    };
                };
                readonly type: "object";
                readonly title: "UnscriptedContext";
            };
        };
        readonly additionalProperties: false;
        readonly type: "object";
        readonly required: readonly ["text"];
        readonly title: "WritingAssessmentRequest";
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly "x-user-id": {
                    readonly type: "string";
                    readonly title: "X-User-Id";
                    readonly description: "Unique userID, used for user tracking.";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly properties: {
                readonly text: {
                    readonly type: "string";
                    readonly title: "Text";
                    readonly description: "Text of the answer";
                };
                readonly vocabulary: {
                    readonly title: "Vocabulary";
                    readonly description: "Vocabulary report";
                    readonly type: "object";
                    readonly required: readonly ["overall_score", "metrics", "english_proficiency_scores"];
                    readonly properties: {
                        readonly overall_score: {
                            readonly type: "integer";
                            readonly title: "Overall Score";
                            readonly description: "Overall vocabulary score, on a scale of 0 - 100";
                        };
                        readonly metrics: {
                            readonly title: "Metrics";
                            readonly description: "Vocabulary metrics report";
                            readonly type: "object";
                            readonly required: readonly ["vocabulary_complexity"];
                            readonly properties: {
                                readonly vocabulary_complexity: {
                                    readonly description: "An enumeration.\n\n`SIMPLE` `AVERAGE` `COMPLEX`";
                                    readonly type: "string";
                                    readonly enum: readonly ["SIMPLE", "AVERAGE", "COMPLEX"];
                                    readonly title: "VocabularyComplexity";
                                };
                                readonly idiom_details: {
                                    readonly type: "array";
                                    readonly title: "Idiom Details";
                                    readonly description: "Detailed list of idioms detected";
                                    readonly items: {
                                        readonly type: "object";
                                        readonly required: readonly ["start_index", "end_index"];
                                        readonly title: "IdiomDetails";
                                        readonly properties: {
                                            readonly start_index: {
                                                readonly type: "integer";
                                                readonly title: "Start Index";
                                                readonly description: "Start character position in the transcript";
                                            };
                                            readonly end_index: {
                                                readonly type: "integer";
                                                readonly title: "End Index";
                                                readonly description: "End character position in the transcript";
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        readonly english_proficiency_scores: {
                            readonly type: "object";
                            readonly required: readonly ["mock_ielts", "mock_cefr", "mock_pte"];
                            readonly title: "EnglishProficiencyScores";
                            readonly properties: {
                                readonly mock_ielts: {
                                    readonly title: "Mock Ielts";
                                    readonly description: "Mock estimated IELTS speaking score prediction";
                                    readonly type: "object";
                                    readonly required: readonly ["prediction"];
                                    readonly properties: {
                                        readonly prediction: {
                                            readonly type: "number";
                                            readonly title: "Prediction";
                                        };
                                    };
                                };
                                readonly mock_cefr: {
                                    readonly title: "Mock Cefr";
                                    readonly description: "Mock estimated CEFR speaking score prediction";
                                    readonly type: "object";
                                    readonly required: readonly ["prediction"];
                                    readonly properties: {
                                        readonly prediction: {
                                            readonly type: "string";
                                            readonly title: "Prediction";
                                        };
                                    };
                                };
                                readonly mock_pte: {
                                    readonly title: "Mock Pte";
                                    readonly description: "Mock estimated PTE speaking score prediction";
                                    readonly type: "object";
                                    readonly required: readonly ["prediction"];
                                    readonly properties: {
                                        readonly prediction: {
                                            readonly type: "string";
                                            readonly title: "Prediction";
                                        };
                                    };
                                };
                            };
                        };
                        readonly warnings: {
                            readonly type: "object";
                            readonly title: "Warnings";
                            readonly description: "An object potentially containing warnings about the content submitted";
                            readonly additionalProperties: {
                                readonly type: "string";
                            };
                        };
                        readonly feedback: {
                            readonly title: "Feedback";
                            readonly description: "Vocabulary feedback report";
                            readonly type: "object";
                            readonly properties: {
                                readonly tagged_transcript: {
                                    readonly type: "string";
                                    readonly title: "Tagged Transcript";
                                    readonly description: "A version of the transcript containing custom HTML tags\n         indicating the position of metrics. Can be used to build a front-end visual UI";
                                };
                            };
                        };
                    };
                };
                readonly grammar: {
                    readonly title: "Grammar";
                    readonly description: "Grammar report";
                    readonly type: "object";
                    readonly required: readonly ["english_proficiency_scores"];
                    readonly properties: {
                        readonly overall_score: {
                            readonly type: "integer";
                            readonly title: "Overall Score";
                            readonly description: "Overall grammar score, on a scale of 0 - 100";
                        };
                        readonly metrics: {
                            readonly title: "Metrics";
                            readonly description: "Grammar metrics report";
                            readonly type: "object";
                            readonly required: readonly ["mistake_count"];
                            readonly properties: {
                                readonly mistake_count: {
                                    readonly type: "integer";
                                    readonly title: "Mistake Count";
                                    readonly description: "List of grammar mistakes";
                                };
                                readonly grammatical_complexity: {
                                    readonly description: "An enumeration.\n\n`SIMPLE` `AVERAGE` `COMPLEX` `NO_STRUCTURE`";
                                    readonly type: "string";
                                    readonly enum: readonly ["SIMPLE", "AVERAGE", "COMPLEX", "NO_STRUCTURE"];
                                    readonly title: "GrammaticalComplexity";
                                };
                                readonly grammar_errors: {
                                    readonly type: "array";
                                    readonly title: "Grammar Errors";
                                    readonly description: "Detailed list of grammar errors";
                                    readonly items: {
                                        readonly type: "object";
                                        readonly required: readonly ["mistake", "correction", "start_index", "end_index"];
                                        readonly title: "GrammarError";
                                        readonly properties: {
                                            readonly mistake: {
                                                readonly type: "string";
                                                readonly title: "Mistake";
                                                readonly description: "Text of the grammar mistake";
                                            };
                                            readonly correction: {
                                                readonly type: "string";
                                                readonly title: "Correction";
                                                readonly description: "Suggested correction for the grammar mistake";
                                            };
                                            readonly start_index: {
                                                readonly type: "integer";
                                                readonly title: "Start Index";
                                                readonly description: "Start character position in the transcript";
                                            };
                                            readonly end_index: {
                                                readonly type: "integer";
                                                readonly title: "End Index";
                                                readonly description: "End character position in the transcript";
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        readonly english_proficiency_scores: {
                            readonly title: "English Proficiency Scores";
                            readonly description: "Estimated score predictions for english tests";
                            readonly type: "object";
                            readonly required: readonly ["mock_ielts", "mock_cefr", "mock_pte"];
                            readonly properties: {
                                readonly mock_ielts: {
                                    readonly title: "Mock Ielts";
                                    readonly description: "Mock estimated IELTS speaking score prediction";
                                    readonly type: "object";
                                    readonly required: readonly ["prediction"];
                                    readonly properties: {
                                        readonly prediction: {
                                            readonly type: "number";
                                            readonly title: "Prediction";
                                        };
                                    };
                                };
                                readonly mock_cefr: {
                                    readonly title: "Mock Cefr";
                                    readonly description: "Mock estimated CEFR speaking score prediction";
                                    readonly type: "object";
                                    readonly required: readonly ["prediction"];
                                    readonly properties: {
                                        readonly prediction: {
                                            readonly type: "string";
                                            readonly title: "Prediction";
                                        };
                                    };
                                };
                                readonly mock_pte: {
                                    readonly title: "Mock Pte";
                                    readonly description: "Mock estimated PTE speaking score prediction";
                                    readonly type: "object";
                                    readonly required: readonly ["prediction"];
                                    readonly properties: {
                                        readonly prediction: {
                                            readonly type: "string";
                                            readonly title: "Prediction";
                                        };
                                    };
                                };
                            };
                        };
                        readonly feedback: {
                            readonly title: "Feedback";
                            readonly description: "Grammar feedback report";
                            readonly type: "object";
                            readonly properties: {
                                readonly grammar_errors: {
                                    readonly type: "array";
                                    readonly title: "Grammar Errors";
                                    readonly description: "Detailed list of grammar errors";
                                    readonly items: {
                                        readonly type: "object";
                                        readonly required: readonly ["mistake", "correction", "start_index", "end_index"];
                                        readonly title: "GrammarError";
                                        readonly properties: {
                                            readonly mistake: {
                                                readonly type: "string";
                                                readonly title: "Mistake";
                                                readonly description: "Text of the grammar mistake";
                                            };
                                            readonly correction: {
                                                readonly type: "string";
                                                readonly title: "Correction";
                                                readonly description: "Suggested correction for the grammar mistake";
                                            };
                                            readonly start_index: {
                                                readonly type: "integer";
                                                readonly title: "Start Index";
                                                readonly description: "Start character position in the transcript";
                                            };
                                            readonly end_index: {
                                                readonly type: "integer";
                                                readonly title: "End Index";
                                                readonly description: "End character position in the transcript";
                                            };
                                        };
                                    };
                                };
                                readonly corrected_text: {
                                    readonly type: "string";
                                    readonly title: "Corrected Text";
                                    readonly description: "Version of the transcript with the detected grammar errors corrected";
                                };
                                readonly tagged_transcript: {
                                    readonly type: "string";
                                    readonly title: "Tagged Transcript";
                                    readonly description: "A version of the transcript containing custom HTML tags indicating the position of metrics.\n         Can be used to build a front-end visual UI";
                                };
                                readonly grammar_feedback: {
                                    readonly type: "string";
                                    readonly title: "Grammar Feedback";
                                    readonly description: "Short text feedback on the user's grammar";
                                };
                            };
                        };
                    };
                };
                readonly writing: {
                    readonly title: "Writing";
                    readonly description: "Writing report";
                    readonly type: "object";
                    readonly required: readonly ["metrics", "feedback"];
                    readonly properties: {
                        readonly metrics: {
                            readonly title: "Metrics";
                            readonly description: "Writing metrics";
                            readonly type: "object";
                            readonly required: readonly ["grammar_errors", "spelling_errors", "punctuation_errors", "missing_word_errors", "word_choice_errors", "word_repetition_errors"];
                            readonly properties: {
                                readonly grammar_errors: {
                                    readonly type: "array";
                                    readonly title: "Grammar Errors";
                                    readonly description: "List of grammar errors";
                                    readonly items: {
                                        readonly type: "object";
                                        readonly required: readonly ["mistake", "correction", "start_index", "end_index"];
                                        readonly title: "GrammarError";
                                        readonly properties: {
                                            readonly mistake: {
                                                readonly type: "string";
                                                readonly title: "Mistake";
                                                readonly description: "Text of the grammar mistake";
                                            };
                                            readonly correction: {
                                                readonly type: "string";
                                                readonly title: "Correction";
                                                readonly description: "Suggested correction for the grammar mistake";
                                            };
                                            readonly start_index: {
                                                readonly type: "integer";
                                                readonly title: "Start Index";
                                                readonly description: "Start character position in the transcript";
                                            };
                                            readonly end_index: {
                                                readonly type: "integer";
                                                readonly title: "End Index";
                                                readonly description: "End character position in the transcript";
                                            };
                                        };
                                    };
                                };
                                readonly spelling_errors: {
                                    readonly type: "array";
                                    readonly title: "Spelling Errors";
                                    readonly description: "List of spelling errors";
                                    readonly items: {
                                        readonly type: "object";
                                        readonly required: readonly ["mistake", "correction", "start_index", "end_index"];
                                        readonly title: "WritingError";
                                        readonly properties: {
                                            readonly mistake: {
                                                readonly type: "string";
                                                readonly title: "Mistake";
                                                readonly description: "Text of the mistake";
                                            };
                                            readonly correction: {
                                                readonly type: "string";
                                                readonly title: "Correction";
                                                readonly description: "Suggested correction for the mistake";
                                            };
                                            readonly start_index: {
                                                readonly type: "integer";
                                                readonly title: "Start Index";
                                                readonly description: "Start character position in the transcript";
                                            };
                                            readonly end_index: {
                                                readonly type: "integer";
                                                readonly title: "End Index";
                                                readonly description: "End character position in the transcript";
                                            };
                                        };
                                    };
                                };
                                readonly punctuation_errors: {
                                    readonly type: "array";
                                    readonly title: "Punctuation Errors";
                                    readonly description: "List of punctuation errors";
                                    readonly items: {
                                        readonly type: "object";
                                        readonly required: readonly ["mistake", "correction", "start_index", "end_index"];
                                        readonly title: "WritingError";
                                        readonly properties: {
                                            readonly mistake: {
                                                readonly type: "string";
                                                readonly title: "Mistake";
                                                readonly description: "Text of the mistake";
                                            };
                                            readonly correction: {
                                                readonly type: "string";
                                                readonly title: "Correction";
                                                readonly description: "Suggested correction for the mistake";
                                            };
                                            readonly start_index: {
                                                readonly type: "integer";
                                                readonly title: "Start Index";
                                                readonly description: "Start character position in the transcript";
                                            };
                                            readonly end_index: {
                                                readonly type: "integer";
                                                readonly title: "End Index";
                                                readonly description: "End character position in the transcript";
                                            };
                                        };
                                    };
                                };
                                readonly missing_word_errors: {
                                    readonly type: "array";
                                    readonly title: "Missing Word Errors";
                                    readonly description: "List of missing word errors";
                                    readonly items: {
                                        readonly type: "object";
                                        readonly required: readonly ["mistake", "correction", "start_index", "end_index"];
                                        readonly title: "WritingError";
                                        readonly properties: {
                                            readonly mistake: {
                                                readonly type: "string";
                                                readonly title: "Mistake";
                                                readonly description: "Text of the mistake";
                                            };
                                            readonly correction: {
                                                readonly type: "string";
                                                readonly title: "Correction";
                                                readonly description: "Suggested correction for the mistake";
                                            };
                                            readonly start_index: {
                                                readonly type: "integer";
                                                readonly title: "Start Index";
                                                readonly description: "Start character position in the transcript";
                                            };
                                            readonly end_index: {
                                                readonly type: "integer";
                                                readonly title: "End Index";
                                                readonly description: "End character position in the transcript";
                                            };
                                        };
                                    };
                                };
                                readonly word_choice_errors: {
                                    readonly type: "array";
                                    readonly title: "Word Choice Errors";
                                    readonly description: "List of word choice errors";
                                    readonly items: {
                                        readonly type: "object";
                                        readonly required: readonly ["mistake", "correction", "start_index", "end_index"];
                                        readonly title: "WritingError";
                                        readonly properties: {
                                            readonly mistake: {
                                                readonly type: "string";
                                                readonly title: "Mistake";
                                                readonly description: "Text of the mistake";
                                            };
                                            readonly correction: {
                                                readonly type: "string";
                                                readonly title: "Correction";
                                                readonly description: "Suggested correction for the mistake";
                                            };
                                            readonly start_index: {
                                                readonly type: "integer";
                                                readonly title: "Start Index";
                                                readonly description: "Start character position in the transcript";
                                            };
                                            readonly end_index: {
                                                readonly type: "integer";
                                                readonly title: "End Index";
                                                readonly description: "End character position in the transcript";
                                            };
                                        };
                                    };
                                };
                                readonly word_repetition_errors: {
                                    readonly type: "array";
                                    readonly title: "Word Repetition Errors";
                                    readonly description: "List of word repetition errors";
                                    readonly items: {
                                        readonly type: "object";
                                        readonly required: readonly ["mistake", "correction", "start_index", "end_index"];
                                        readonly title: "WritingError";
                                        readonly properties: {
                                            readonly mistake: {
                                                readonly type: "string";
                                                readonly title: "Mistake";
                                                readonly description: "Text of the mistake";
                                            };
                                            readonly correction: {
                                                readonly type: "string";
                                                readonly title: "Correction";
                                                readonly description: "Suggested correction for the mistake";
                                            };
                                            readonly start_index: {
                                                readonly type: "integer";
                                                readonly title: "Start Index";
                                                readonly description: "Start character position in the transcript";
                                            };
                                            readonly end_index: {
                                                readonly type: "integer";
                                                readonly title: "End Index";
                                                readonly description: "End character position in the transcript";
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        readonly feedback: {
                            readonly title: "Feedback";
                            readonly description: "Writing feedback";
                            readonly type: "object";
                            readonly properties: {
                                readonly tagged_transcript: {
                                    readonly type: "string";
                                    readonly title: "Tagged Transcript";
                                    readonly description: "A version of the transcript containing custom HTML tags indicating the position of metrics.\n         Can be used to build a front-end visual UI";
                                };
                            };
                        };
                    };
                };
                readonly relevance: {
                    readonly title: "Relevance";
                    readonly description: "Content Relevance report";
                    readonly type: "object";
                    readonly properties: {
                        readonly relevance: {
                            readonly description: "An enumeration.\n\n`RELEVANT` `NOT_RELEVANT` `PARTIALLY_RELEVANT`";
                            readonly type: "string";
                            readonly enum: readonly ["RELEVANT", "NOT_RELEVANT", "PARTIALLY_RELEVANT"];
                            readonly title: "ContentRelevance";
                        };
                        readonly feedback: {
                            readonly type: "string";
                            readonly title: "Feedback";
                            readonly description: "Text explanation of the content relevance";
                        };
                    };
                };
                readonly overall: {
                    readonly title: "Overall";
                    readonly description: "Overall writing report";
                    readonly type: "object";
                    readonly required: readonly ["english_proficiency_scores"];
                    readonly properties: {
                        readonly english_proficiency_scores: {
                            readonly title: "English Proficiency Scores";
                            readonly description: "Estimated score predictions for english tests";
                            readonly type: "object";
                            readonly required: readonly ["mock_ielts", "mock_cefr", "mock_pte"];
                            readonly properties: {
                                readonly mock_ielts: {
                                    readonly title: "Mock Ielts";
                                    readonly description: "Mock estimated IELTS speaking score prediction";
                                    readonly type: "object";
                                    readonly required: readonly ["prediction"];
                                    readonly properties: {
                                        readonly prediction: {
                                            readonly type: "number";
                                            readonly title: "Prediction";
                                        };
                                    };
                                };
                                readonly mock_cefr: {
                                    readonly title: "Mock Cefr";
                                    readonly description: "Mock estimated CEFR speaking score prediction";
                                    readonly type: "object";
                                    readonly required: readonly ["prediction"];
                                    readonly properties: {
                                        readonly prediction: {
                                            readonly type: "string";
                                            readonly title: "Prediction";
                                        };
                                    };
                                };
                                readonly mock_pte: {
                                    readonly title: "Mock Pte";
                                    readonly description: "Mock estimated PTE speaking score prediction";
                                    readonly type: "object";
                                    readonly required: readonly ["prediction"];
                                    readonly properties: {
                                        readonly prediction: {
                                            readonly type: "string";
                                            readonly title: "Prediction";
                                        };
                                    };
                                };
                            };
                        };
                        readonly overall_score: {
                            readonly type: "number";
                            readonly title: "Overall Score";
                            readonly description: "Overall speaking score, on a scale of 0 - 100";
                        };
                    };
                };
                readonly warnings: {
                    readonly additionalProperties: {
                        readonly type: "string";
                    };
                    readonly type: "object";
                    readonly title: "Warnings";
                };
            };
            readonly type: "object";
            readonly required: readonly ["text", "vocabulary", "grammar", "writing", "overall"];
            readonly title: "WritingAssessmentResponse";
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "422": {
            readonly properties: {
                readonly detail: {
                    readonly items: {
                        readonly properties: {
                            readonly loc: {
                                readonly items: {
                                    readonly anyOf: readonly [{
                                        readonly type: "string";
                                    }, {
                                        readonly type: "integer";
                                    }];
                                };
                                readonly type: "array";
                                readonly title: "Location";
                            };
                            readonly msg: {
                                readonly type: "string";
                                readonly title: "Message";
                            };
                            readonly type: {
                                readonly type: "string";
                                readonly title: "Error Type";
                            };
                        };
                        readonly type: "object";
                        readonly required: readonly ["loc", "msg", "type"];
                        readonly title: "ValidationError";
                    };
                    readonly type: "array";
                    readonly title: "Detail";
                };
            };
            readonly type: "object";
            readonly title: "HTTPValidationError";
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
export { PronunciationReportPronunciationAccentPost, SpeechAssessmentReportScriptedSpeechAssessmentScriptedAccentPost, SpeechAssessmentReportUnscriptedSpeechAssessmentUnscriptedAccentPost, WritingAssessmentReportWritingAssessmentAlphaPost };
