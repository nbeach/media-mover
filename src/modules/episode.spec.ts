import {where} from "mocha-where";
import {isCompleteEpisode, parseEpisode, ParsedEpisode, CompleteEpisode} from "./episode";
import {expect} from "chai";

describe("Episode Module", () => {

    describe("parseEpisode()", () => {

        where([
            ['path',                                                                 'season', 'episode', 'series',                  'extension'],
            ['some/folder/Travel Man S02E05.mp4',                                     2,        5,         'travel man',              'mp4'      ],
            ['source/Travel.Man.S7E3.xvid.mkv',                                       7,        3,         'travel man',              'mkv'      ],
            ['Travel-Man-S14E22-super-rip.avi',                                      14,       22,         'travel man',              'avi'      ],
            ['Travel.Man.48.Hours.In.Series.5.2of4.Budapest.720p.HDTV.mp4',           5,        2,         'travel man 48 hours in',  'mp4'      ],
            ['/volume1/Travel.Man.48.Hours.In.S11E02.Split.1080p.WEB.h264-WEBTUBE.mkv',  11,        2,         'travel man 48 hours in',              'mkv'      ],
            
        ])
        .it('parses episodes in the format "#path"', (scenario: any) => {
            const parsed = parseEpisode(scenario.path);

            expect(parsed.path).to.equal(scenario.path);
            expect(parsed.season).to.equal(scenario.season);
            expect(parsed.series.name).to.equal(scenario.series);
            expect(parsed.episode).to.equal(scenario.episode);
            expect(parsed.extension).to.equal(scenario.extension);
        });

    });

    describe("isCompleteEpisode()", () => {

        where([
            ['scenario',                  'season', 'episode', 'series',     'seriesFolder', 'extension', 'expected'],
            ['all fields populated',      2,        5,         'Travel Man', 'folder/',      'mp4',       true      ],
            ['season missing',            null,     5,         'Travel Man', 'folder/',      'mp4',       false     ],
            ['episode missing',           2,        null,      'Travel Man', 'folder/',      'mp4',       false     ],
            ['series name missing',       2,        5,          null,        'folder/',      'mp4',       false     ],
            ['series folder missing',     2,        5,         'Travel Man', undefined,      'mp4',       false     ],
            ['extension missing',         2,        5,         'Travel Man', 'folder/',      null,        false     ],
        ])
        .it('returns #expected when #scenario', (scenario: any) => {
            const episode: ParsedEpisode | CompleteEpisode = {
                path: "filename.mp4",
                season: scenario.season,
                episode: scenario.episode,
                series: { name: scenario.series, folder: scenario.seriesFolder },
                extension: scenario.extension
            };

            expect(isCompleteEpisode(episode)).to.equal(scenario.expected);
        });

    });
});