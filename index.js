// Setup Logging
const logger = require("log4js").getLogger("BLCResizer");
logger.level = "debug";
logger.info("Loading libraries...")

// Load Libraries
const axios = require('axios');
const cliProgress = require('cli-progress');
const fs = require('fs');
const path = require('path');
const { exit } = require("process");
const sharp = require('sharp');

//CHANGE THIS
const ASSET_URL = "https://client-jars.badlion.net/common-assets/PRODUCTION3/v3.9.0.1-4a32816-PRODUCTION3-assets.json";
// const ASSET_URL = "https://client-jars.badlion.net/common-assets/INSIDER3/v3.4.1-0a703e6-INSIDER3-assets.json";

//Don't change me
const base_url = "https://client-jars.badlion.net/common-assets/PRODUCTION3/assets/";
// const base_url = "https://client-jars.badlion.net/common-assets/INSIDER3/assets/";

/**
 * Start all requires functions
 */
async function start() {
    //Create a progress bar
    const progressBar = new cliProgress.SingleBar({
        stopOnComplete: true
    }, cliProgress.Presets.shades_classic);
    progressBar.on('stop', () => {
        logger.info("Downloaded Capes")
        return;
    })

    logger.info("Requesting assets...")
    let assetData = await axios.get(ASSET_URL).then((response) => {
        logger.info("Obtained assets.");
        return response.data;
    }).catch((error) => {
        progressBar.stop();
        logger.error("Obtaining assets failed.")
        logger.error(error.message);
    })

    //Lets die if no data
    if(assetData == null) return;

    //Filted used items
    logger.info("Filtering api response...")
    let allCapes = Object.entries(assetData).filter(([key, _value]) => key.includes("assets/minecraft/blc/textures/cosmetics/cloak"))
    logger.info("Filtering complete!")

    //Start a progress bar
    logger.info("Downloading capes, this can take a long time...")
    progressBar.start(allCapes.length, 0);

    //Loop through capes
    allCapes.forEach(([key, asset]) => {
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
            fs.mkdirSync(fileLocation, { recursive: true });
        }

        //Download and convert images
        let textureUrl = `${base_url}${asset.name}`
        axios.get(textureUrl, { responseType: 'arraybuffer' }).then((res) => {
            let image = sharp(res.data)
            image.metadata().then((metadata) => {
                image.extract({ left: 0, top: 0, width: metadata.width, height: Math.round(metadata.width * (17 / 22)) })
                .resize(352, 272, {
                    fith: 'fill',
                    position: 'left top'
                })
                .extend({ top: 0, left: 0, bottom: 512 - 272, right: 1024 - 352 })
                .toFile(`${fileLocation}${fileName}`)
                .catch(err => {
                    logger.error(`${err} - ${textureUrl}`);
                })
                .finally(() => {
                    progressBar.increment();
                })
            })
        }).catch((error) => {
            progressBar.increment();
            logger.error(`Failed to download texture - ${textureUrl}`)
            logger.error(error.message);
        });
    })
}

start()