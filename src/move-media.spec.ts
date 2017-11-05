import {mkdirSync} from "fs";
import {negate} from "lodash";
import {outputFileSync} from "fs-extra";
import {sync as rimraf} from "rimraf";
import {sync as glob} from "glob";
import {expect} from "chai";
import moveMedia from "./move-media";
import {isDirectory} from "./modules/files";

describe("MoveMedia Module", () => {
    beforeEach(() => rimraf("tmp/"));
    beforeEach(() => mkdirSync("tmp/"));
    afterEach(() => rimraf("tmp/"));

    describe("modeMedia()", () => {

        it("lists the video files in the provided folder", () => {
            outputFileSync("tmp/source/sub/Harmon Quest.S2E5.mp4", "");
            outputFileSync("tmp/source/Travel.Man.S03E11.mp4", "");
            outputFileSync("tmp/destination/HarmonQuest/Season 01/HarmonQuest S01E01.mp4", "");
            outputFileSync("tmp/destination/Travel Man/Season 01/Travel Man S01E01.mp4", "");

            moveMedia("tmp/source", "tmp/destination");

            const isFile = negate(isDirectory);
            const sourceContents = glob("tmp/source/**/*").filter(isFile);
            const destinationContents = glob("tmp/destination/**/*").filter(isFile);

            expect(sourceContents).to.be.empty;
            expect(destinationContents).to.have.length(4);
            expect(destinationContents).to.contain("tmp/destination/HarmonQuest/Season 02/HarmonQuest S02E05.mp4");
            expect(destinationContents).to.contain("tmp/destination/Travel Man/Season 03/Travel Man S03E11.mp4");
        });

        it("returns files that could not be moved", () => {
            outputFileSync("tmp/source/sub/Harmon Quest.S2E5.mp4", "");
            outputFileSync("tmp/source/Travel.Man.S03E11.mp4", "");
            mkdirSync("tmp/destination");

            const actual = moveMedia("tmp/source", "tmp/destination");

            const isFile = negate(isDirectory);
            const sourceContents = glob("tmp/source/**/*").filter(isFile);
            const destinationContents = glob("tmp/destination/**/*").filter(isFile);

            expect(destinationContents).to.be.empty;
            expect(sourceContents).to.have.length(2);
            expect(sourceContents).to.contain("tmp/source/sub/Harmon Quest.S2E5.mp4");
            expect(sourceContents).to.contain("tmp/source/Travel.Man.S03E11.mp4");

            expect(actual[0].path).to.equal("tmp/source/sub/Harmon Quest.S2E5.mp4");
            expect(actual[1].path).to.equal("tmp/source/Travel.Man.S03E11.mp4");
        });

    });

});