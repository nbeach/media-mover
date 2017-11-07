import {mkdirSync, readFileSync} from "fs";
import {outputFileSync} from "fs-extra";
import {sync as rimraf} from "rimraf";
import {negate} from "lodash";
import {sync as glob} from "glob";
import {isDirectory, moveToSeriesFolder, readVideoFiles} from "./files";
import {expect} from "chai";
import {CompleteEpisode} from "./episode";

const isFile = negate(isDirectory);

describe("Files Module", () => {
    beforeEach(() => rimraf("tmp/"));
    beforeEach(() => mkdirSync("tmp/"));
    afterEach(() => rimraf("tmp/"));

    describe("readVideoFiles()", () => {

        it("lists the video files in the provided folder", () => {
            outputFileSync("tmp/video1.mp4", "");
            outputFileSync("tmp/sub/video2.mp4", "");

            const actual = readVideoFiles("tmp/");

            expect(actual).to.have.length(2);
            expect(actual).to.include("tmp/video1.mp4");
            expect(actual).to.include("tmp/sub/video2.mp4");
        });

    });

    describe("moveToSeriesFolder()", () => {

        it("move files to folders", () => {
            outputFileSync("tmp/destination/HarmonQuest/Season 01/HarmonQuest S01E01.mp4", "");
            const episode: CompleteEpisode = {
                path: "tmp/source/sub/Harmon-Quest.S2E5.mp4",
                extension: "mp4",
                episode: 5,
                season: 2,
                series: {
                    name: "HarmonQuest",
                    folder: "tmp/destination/HarmonQuest"
                }

            };
            outputFileSync(episode.path, "");

            const actual = moveToSeriesFolder(episode);

            const sourceContents = glob("tmp/source/**/*").filter(isFile);
            const destinationContents = glob("tmp/destination/**/*").filter(isFile);
            expect(sourceContents).to.be.empty;
            expect(destinationContents).to.have.length(2);
            expect(destinationContents).to.contain("tmp/destination/HarmonQuest/Season 02/HarmonQuest S02E05.mp4");
            expect(actual).to.be.null;
        });

        it("does not overwrite existing files", () => {
            outputFileSync("tmp/destination/HarmonQuest/Season 01/HarmonQuest S01E01.mp4", "original");
            const episode: CompleteEpisode = {
                path: "tmp/source/sub/Harmon-Quest.S01E01.mp4",
                extension: "mp4",
                episode: 1,
                season: 1,
                series: {
                    name: "HarmonQuest",
                    folder: "tmp/destination/HarmonQuest"
                }

            };
            outputFileSync(episode.path, "new");

            const actual = moveToSeriesFolder(episode);

            const sourceContents = glob("tmp/source/**/*").filter(isFile);
            const destinationContents = glob("tmp/destination/**/*").filter(isFile);
            expect(sourceContents).to.have.length(1);
            expect(sourceContents).to.contain("tmp/source/sub/Harmon-Quest.S01E01.mp4");
            expect(destinationContents).to.have.length(1);
            expect(destinationContents).to.contain("tmp/destination/HarmonQuest/Season 01/HarmonQuest S01E01.mp4");
            const contents = readFileSync("tmp/destination/HarmonQuest/Season 01/HarmonQuest S01E01.mp4").toString();
            expect(contents).to.equal("original");
            expect(actual).to.deep.equal(episode);
        });

    });

    describe("isDirectory()", () => {

        beforeEach(() => {
            outputFileSync("tmp/sub/video1.mp4", "");
        });

        it("returns true when the path is a directory", () => {
            expect(isDirectory("tmp/sub")).to.be.true;
        });

        it("returns false when the path is a file", () => {
            expect(isDirectory("tmp/sub/video1.mp4")).to.be.false;
        });
    });

});