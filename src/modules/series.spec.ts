import {mkdirSync} from "fs";
import {outputFileSync} from "fs-extra";
import {sync as rimraf} from "rimraf";
import {expect} from "chai";
import {resolveSeries, readSeries} from "./series";
import {where} from "mocha-where/src/where";
import {CompleteEpisode} from "./episode";

describe("Series Module", () => {

    describe("readSeries()", () => {
        beforeEach(() => rimraf("tmp/"));
        beforeEach(() => mkdirSync("tmp/"));
        afterEach(() => rimraf("tmp/"));


        it("lists the video files in the provided folder", () => {
            outputFileSync("tmp/not-a-series.mp4", "");
            outputFileSync("tmp/HarmonQuest/Season 01/HarmonQuest S01E01.mp4", "");
            outputFileSync("tmp/Travel Man/Season 02/Travel Man S02E01.mp4", "");

            const actual = readSeries("tmp/");

            expect(actual).to.have.length(2);
            expect(actual).to.include({ name: "Travel Man", folder: "tmp/Travel Man"});
            expect(actual).to.include({ name: "HarmonQuest", folder: "tmp/HarmonQuest"});
        });

    });

    describe("resolveSeries()", () => {

        where([
            ['seriesName',      'episodeName' ],
            ['Harmon Quest',    'harmonquest' ],
            ['harmonquest',     'Harmon Quest'],
            ['Harmon-Quest',    'harmon.quest'],
            ['harmon.quest',    'Harmon-Quest'],
            ['The HarmonQuest', 'Harmon-Quest'],
            ['Harmon-Quest',    'the HarmonQuest'],
        ])
        .it('matches series "#seriesName" to episode "#episodeName"', (scenario: any) => {
            const matchingSeries =   { name: scenario.seriesName, folder: "matching/folder/" };

            const series = [
                { name: "Non Existent", folder: "" },
                matchingSeries,
                { name: "Nothingland", folder: "" },
            ];
            const episode = {
                path: "",
                extension: "",
                series: {
                    name: scenario.episodeName,
                    folder: ""
                },
                season: 1,
                episode: 1
            };

            const actual = resolveSeries(series, episode) as CompleteEpisode;

            expect(actual.series.name).to.equal(matchingSeries.name);
            expect(actual.series.folder).to.equal(matchingSeries.folder);
        });

        it("leaves the existing series when a match can't be found", () => {
            const series = [
                { name: "Non Existent", folder: "" },
                { name: "Nothingland", folder: "" },
            ];
            const episode = {
                path: "",
                extension: "",
                series: {
                    name: "SomeSeries",
                    folder: ""
                },
                season: 1,
                episode: 1
            };

            const actual = resolveSeries(series, episode);

            expect(actual.series.name).to.equal("SomeSeries");
        });

    });

});