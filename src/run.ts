import {isEmpty} from "lodash";
import moveMedia from "./move-media";

const downloadFolder = 'D:/Torrents/Complete';
const seriesRootFolder = 'D:/TV';


(async () => {
    const failures = moveMedia(downloadFolder, seriesRootFolder);

    if(!isEmpty(failures)) {
        console.log(`Failures:\n ${JSON.stringify(failures, null, 2)}`);
    }
})().catch(console.log).then(() => {})