import {curry, negate} from "lodash"
import {resolveSeries, readSeries} from "./modules/series";
import {moveToSeriesFolder, readVideoFiles} from "./modules/files";
import {isCompleteEpisode, ParsedEpisode, parseEpisode} from "./modules/episode";

export default function moveMedia(sourceFolder: string, destinationFolder: string): ParsedEpisode[] {
    const series = readSeries(destinationFolder);
    const episodes = readVideoFiles(sourceFolder)
        .map(parseEpisode)
        .map(curry(resolveSeries)(series));

    episodes
        .filter(isCompleteEpisode)
        .map(moveToSeriesFolder);

    return episodes.filter(negate(isCompleteEpisode));
}

