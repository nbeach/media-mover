import {every, isNull, negate} from "lodash";
import {extractNumber, extractString, whenPresent} from "./util";
import {CompleteSeries, ParsedSeries} from "./series";
import {isUndefined} from "util";
import {basename} from "path";

export interface ParsedEpisode {
    path: string,
    extension: string | null,
    series: ParsedSeries,
    season: number | null,
    episode: number | null
}

export interface CompleteEpisode {
    path: string,
    extension: string,
    series: CompleteSeries,
    season: number,
    episode: number
}

function extractSeriesName(path: string): string | null {
    const filename = basename(path).toLowerCase();
    let extracted = extractString(filename, /(.*?)[.\W-]s\d{1,2}/)
                 || extractString(filename, /(.*?)[.\W-]series[.\W-]\d{1,2}/);

    return whenPresent(extracted,name => name.replace(new RegExp('[.-]', 'g'), " "));
}

function extractEpisodeNumber(path: string): number | null {
    const lowercaseFilename = path.toLowerCase();
    return extractNumber(lowercaseFilename, /e(\d{1,2})/)
        || extractNumber(lowercaseFilename, /series[.\W-]\d{1,2}[.\W-](\d{1,2})of\d{1,2}/);
}

function extractSeasonNumber(path: string): number | null {
    const lowercaseFilename = path.toLowerCase();

    return extractNumber(lowercaseFilename, /s(\d{1,2})/)
        || extractNumber(lowercaseFilename, /series[.\W-](\d{1,2})/);
}

function extractFileExtension(filename: string): string | null {
    return extractString(filename.toLowerCase(), /\.([a-z0-9]*)$/);
}

export function parseEpisode(filename: string): ParsedEpisode {
    const pattern1 = /(.*?)[.\W-]s(\d{1,2})e(\d{1,2}).*\.([a-z0-9]*)$/;
    const pattern2 = /(.*?)[.\W-]series(\d{1,2})[.\W-](\d{1,2})of(\d{1,2}).*\.([a-z0-9]*)$/;
    const matches = filename.toLowerCase().match(pattern1);
    return {
        path: filename,
        extension: extractFileExtension(filename),
        series: { name: extractSeriesName(filename) },
        season: extractSeasonNumber(filename),
        episode: extractEpisodeNumber(filename)
    }
}

export function isCompleteEpisode(episode: ParsedEpisode | CompleteEpisode): episode is CompleteEpisode {
    const required = [
        episode.season,
        episode.episode,
        episode.extension,
        episode.series.name,
    ];

    const hasSeriesFolder = !isUndefined((episode.series as CompleteSeries).folder);
    return hasSeriesFolder && every(required, negate(isNull));
}