import {curry, defaultTo, reduce} from "lodash";
import {lstatSync, readdirSync} from "fs";
import {join} from "path";
import {ParsedEpisode, CompleteEpisode} from "./episode";

export interface ParsedSeries { name: string | null }
export interface CompleteSeries { name: string, folder: string }

function normalizeName(name: string | null): string {
    const lowercaseName: string = defaultTo(name, "").toLowerCase();
    return reduce([/^(the)/, '(', ')', '-', '.', ' '],
        (acc, pattern) => acc.replace(pattern, ""), lowercaseName);
}

function episodeIsPartOfSeries(episode: ParsedEpisode, series: ParsedSeries) {
    return  normalizeName(episode.series.name).indexOf(normalizeName(series.name)) >= 0;
}

export function resolveSeries(series: ParsedSeries[], episode: ParsedEpisode): ParsedEpisode | CompleteEpisode {
    const [match] = series.filter(curry(episodeIsPartOfSeries)(episode));
    episode.series = defaultTo(match, episode.series);
    return episode;
}

export function readSeries(path: string): any {
    return readdirSync(path)
        .filter(name => lstatSync(join(path, name)).isDirectory())
        .map(name => { return { name: name, folder: join(path, name)}; });
}