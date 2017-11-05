import {isNull, replace, negate, every} from "lodash";
import {extractNumber, extractString, whenPresent} from "./util";
import {ParsedSeries, CompleteSeries} from "./series";
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

function parseSeriesName(path: string): string | null {
    const filename = basename(path);
    const extracted = extractString(filename, /(.*?)[.\W-][Ss]\d{1,2}/);

    return whenPresent(extracted,name => replace(name, /[.-]/, " "));
}

function parseFileExtension(filename: string): string | null {
    const extracted = extractString(filename, /\.([a-zA-Z0-9]*)$/);
    return whenPresent(extracted, extension => extension.toLowerCase());
}

export function parseEpisode(filename: string): ParsedEpisode {
    return {
        path: filename,
        extension: parseFileExtension(filename),
        series: { name: parseSeriesName(filename) },
        season: extractNumber(filename, /[Ss](\d{1,2})/),
        episode: extractNumber(filename, /[Ee](\d{1,2})/)
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