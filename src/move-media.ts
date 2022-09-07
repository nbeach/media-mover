import {curry, negate} from "lodash"
import {resolveSeries, readSeries} from "./modules/series";
import {moveToSeriesFolder, readVideoFiles} from "./modules/files";
import {isCompleteEpisode, ParsedEpisode, parseEpisode} from "./modules/episode";
import {isNull} from "util";

export default async function moveMedia(sourceFolder: string, destinationFolder: string): Promise<ParsedEpisode[]> {
    const series = readSeries(destinationFolder);
    const episodes = readVideoFiles(sourceFolder)
        .map(parseEpisode)
        .map(curry(resolveSeries)(series));

    const moves = episodes
        .filter(isCompleteEpisode)
        .map(moveToSeriesFolder)

    const movingFailures = (await Promise.all(moves)).filter(negate(isNull));

    return episodes.filter(negate(isCompleteEpisode));
}

