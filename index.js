// Setup Logging
const logger = require("log4js").getLogger("BLCResizer");
logger.level = "debug";
logger.info("Loading libraries...")

// Load Libraries
const axios = require('axios');
const cliProgress = require('cli-progress');
const fs = require('fs');
const path = require('path');

//CHANGE THIS
const ASSET_URL = "https://client-jars.badlion.net/common-assets/PRODUCTION3/v3.8.1-9b55b70-PRODUCTION3-assets.json";
// const ASSET_URL = "https://client-jars.badlion.net/common-assets/INSIDER3/v3.4.1-0a703e6-INSIDER3-assets.json";

//Don't change me
const base_url = "https://client-jars.badlion.net/common-assets/PRODUCTION3/assets";
// const base_url = "https://client-jars.badlion.net/common-assets/INSIDER3/assets";

/**
 * Start all requires functions
 */
 async function start() {
    logger.info("Request endpoints...")
    await axios.get(ASSET_URL).then((response) => {
        logger.info("Obtained endpoints.");
        Object.entries(response.data).forEach(([key, _value]) => {
            if(key.includes("assets/minecraft/blc/textures/cosmetics/cloak")) {
                let fileName = path.basename(key);
                let fileLocation = `images/${key.replace("assets/minecraft/blc/textures/cosmetics/cloak/", "").replace(fileName, "")}`;

                //We only really want png files
                if(!fileName.endsWith(".png")) {
                    return;
                }

                //Lets not redownload the same stuff
                if(fs.existsSync(`${fileLocation}${fileName}`)) {
                    return;
                }

                //Lets make the folder for the cape
                if(!fs.existsSync(fileLocation)) {
                    fs.mkdir(fileLocation);
                }

                //Download the png file
                // try {
                //     Image::make("$base_url/$asset->name")->crop(704, 544, 0, 0)->resizeCanvas(2048, 1024, 'top-left')->save("$fileLocation/$fileName");
                //     echo "Completed Conversion - $fileName\n";
                // } catch(\Intervention\Image\Exception\NotReadableException $exception) {
                //     echo "FAILED - $fileName\n";
                //     echo "Dumping Variables:\n";
                //     echo "$base_url/$asset->name\n\n";
                // }
            }
        })
    }).catch((error) => {
        logger.error("Obtaining endpoints failed.")
        logger.error(error);
    })
}

start()