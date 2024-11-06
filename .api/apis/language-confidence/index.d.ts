import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core';
import Oas from 'oas';
import APICore from 'api/dist/core';
declare class SDK {
    spec: Oas;
    core: APICore;
    constructor();
    /**
     * Optionally configure various options that the SDK allows.
     *
     * @param config Object of supported SDK options and toggles.
     * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
     * should be represented in milliseconds.
     */
    config(config: ConfigOptions): void;
    /**
     * If the API you're using requires authentication you can supply the required credentials
     * through this method and the library will magically determine how they should be used
     * within your API request.
     *
     * With the exception of OpenID and MutualTLS, it supports all forms of authentication
     * supported by the OpenAPI specification.
     *
     * @example <caption>HTTP Basic auth</caption>
     * sdk.auth('username', 'password');
     *
     * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
     * sdk.auth('myBearerToken');
     *
     * @example <caption>API Keys</caption>
     * sdk.auth('myApiKey');
     *
     * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
     * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
     * @param values Your auth credentials for the API; can specify up to two strings or numbers.
     */
    auth(...values: string[] | number[]): this;
    /**
     * If the API you're using offers alternate server URLs, and server variables, you can tell
     * the SDK which one to use with this method. To use it you can supply either one of the
     * server URLs that are contained within the OpenAPI definition (along with any server
     * variables), or you can pass it a fully qualified URL to use (that may or may not exist
     * within the OpenAPI definition).
     *
     * @example <caption>Server URL with server variables</caption>
     * sdk.server('https://{region}.api.example.com/{basePath}', {
     *   name: 'eu',
     *   basePath: 'v14',
     * });
     *
     * @example <caption>Fully qualified server URL</caption>
     * sdk.server('https://eu.api.example.com/v14');
     *
     * @param url Server URL
     * @param variables An object of variables to replace into the server URL.
     */
    server(url: string, variables?: {}): void;
    /**
     * Speech Assessment Report Scripted
     *
     * @throws FetchError<422, types.SpeechAssessmentReportScriptedSpeechAssessmentScriptedAccentPostResponse422> Validation Error
     */
    speech_assessment_report_scripted_speech_assessment_scripted__accent__post(body: types.SpeechAssessmentReportScriptedSpeechAssessmentScriptedAccentPostBodyParam, metadata: types.SpeechAssessmentReportScriptedSpeechAssessmentScriptedAccentPostMetadataParam): Promise<FetchResponse<200, types.SpeechAssessmentReportScriptedSpeechAssessmentScriptedAccentPostResponse200>>;
    /**
     * Speech Assessment Report Unscripted
     *
     * @throws FetchError<422, types.SpeechAssessmentReportUnscriptedSpeechAssessmentUnscriptedAccentPostResponse422> Validation Error
     */
    speech_assessment_report_unscripted_speech_assessment_unscripted__accent__post(body: types.SpeechAssessmentReportUnscriptedSpeechAssessmentUnscriptedAccentPostBodyParam, metadata: types.SpeechAssessmentReportUnscriptedSpeechAssessmentUnscriptedAccentPostMetadataParam): Promise<FetchResponse<200, types.SpeechAssessmentReportUnscriptedSpeechAssessmentUnscriptedAccentPostResponse200>>;
    /**
     * Pronunciation Report
     *
     * @throws FetchError<422, types.PronunciationReportPronunciationAccentPostResponse422> Validation Error
     */
    pronunciation_report_pronunciation__accent__post(body: types.PronunciationReportPronunciationAccentPostBodyParam, metadata: types.PronunciationReportPronunciationAccentPostMetadataParam): Promise<FetchResponse<200, types.PronunciationReportPronunciationAccentPostResponse200>>;
    /**
     * Writing Assessment Report
     *
     * @throws FetchError<422, types.WritingAssessmentReportWritingAssessmentAlphaPostResponse422> Validation Error
     */
    writing_assessment_report_writing_assessment_alpha_post(body: types.WritingAssessmentReportWritingAssessmentAlphaPostBodyParam, metadata?: types.WritingAssessmentReportWritingAssessmentAlphaPostMetadataParam): Promise<FetchResponse<200, types.WritingAssessmentReportWritingAssessmentAlphaPostResponse200>>;
}
declare const createSDK: SDK;
export = createSDK;
