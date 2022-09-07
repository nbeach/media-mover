import {isEmpty} from "lodash";
import moveMedia from "./move-media";

const downloadFolder = '/volume1/Scratch/Torrents/Complete';
const seriesRootFolder = '/volume1/Television';

const failures = moveMedia(downloadFolder, seriesRootFolder);

if(!isEmpty(failures)) {
    console.log(`Failures:\n ${JSON.stringify(failures, null, 2)}`);
}
