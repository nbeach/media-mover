import {existsSync, lstatSync, mkdirSync, renameSync, statSync} from "fs";
import {join, join as joinPaths} from "path";
import {sync as glob} from "glob";
import {padStart} from "lodash";
import {CompleteEpisode} from "./episode";
const moveFile = require('@npmcli/move-file')

function formatFilename(episode: CompleteEpisode): string {
    const seasonNumber = padStart(episode.season.toString(), 2, '0');
    const episodeNumber = padStart(episode.episode.toString(), 2, '0');

    return `${episode.series.name} S${seasonNumber}E${episodeNumber}.${episode.extension}`;
}

function createDirIfNotExists(path: string): void {
    try {
        statSync(path);
    } catch(exception) {
        mkdirSync(path);
    }
}

export function moveToSeriesFolder(episode: CompleteEpisode): CompleteEpisode | null {
    const seasonFolder = `Season ${padStart(episode.season.toString(), 2, '0')}`;
    createDirIfNotExists(join(episode.series.folder, seasonFolder));

    const newPath = `${episode.series.folder}/${seasonFolder}/${formatFilename(episode)}`;
    if(!existsSync(newPath)) {
        moveFile.sync(episode.path, newPath);
        return null;
    } else {
        return episode;
    }
}

export function readVideoFiles(path: string): string[] {
   return glob(joinPaths(path, "/**"))
       .filter(file => !!file.match(/\.(mp4|mkv|avi)$/));
}

export function isDirectory(path: string) {
    return lstatSync(path).isDirectory();
}