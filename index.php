<?php

    //CHANGE THIS
    $ASSET_URL = "https://client-jars.badlion.net/common-assets/PRODUCTION3/v3.6.1-5fb8ab6-PRODUCTION3-assets.json";
    // $ASSET_URL = "https://client-jars.badlion.net/common-assets/INSIDER3/v3.4.1-0a703e6-INSIDER3-assets.json";

    //Don't change me
    $base_url = "https://client-jars.badlion.net/common-assets/PRODUCTION3/assets";
    // $base_url = "https://client-jars.badlion.net/common-assets/INSIDER3/assets";

    // Include composer autoload
    require 'vendor/autoload.php';

    // Import classes
    use Intervention\Image\ImageManagerStatic as Image;

    /**
     * Download and convert the capes
     */
    echo "Downloading capes...\n";
    $blcAssets = json_decode(file_get_contents($ASSET_URL));
    foreach($blcAssets as $key => $asset) {
        if(str_contains($key, "assets/minecraft/blc/textures/cosmetics/cloak")) {
            $fileName = basename($key);
            $fileLocation = "images/" . str_replace("assets/minecraft/blc/textures/cosmetics/cloak/", "", str_replace($fileName, "", $key));

            //We only really want png files
            if(pathinfo($fileName)['extension'] != "png") {
                continue;
            }

            //Lets not redownload the same stuff
            if(file_exists("$fileLocation/$fileName")) {
                continue;
            }

            //Lets make the folder for the cape
            if(!file_exists($fileLocation)) {
                mkdir($fileLocation);
            }

            //Lets try download and convert it
            try {
                Image::make("$base_url/$asset->name")->crop(704, 544, 0, 0)->resizeCanvas(2048, 1024, 'top-left')->save("$fileLocation/$fileName");
                echo "Completed Conversion - $fileName\n";
            } catch(\Intervention\Image\Exception\NotReadableException $exception) {
                echo "FAILED - $fileName\n";
                echo "Dumping Variables:\n";
                echo "$base_url/$asset->name\n\n";
            }
        }
    }
    echo "\n\nFinished!\n";