<?php

    //CHANGE THIS
    $ASSET_URL = "https://client-jars.badlion.net/common-assets/PRODUCTION3/v3.3.1-9c7b4b4-PRODUCTION3-assets.json";

    //Don't change me
    $base_url = "https://client-jars.badlion.net/common-assets/PRODUCTION3/assets";

    // Include composer autoload
    require 'vendor/autoload.php';

    // Import classes
    use Intervention\Image\ImageManagerStatic as Image;
    use Grinderspro\DirectoryManipulator\DirectoryManipulator;

    /**
     * Delete the out dir and copy in to new out (avoid subfolder complications)
     */
    echo "Emptying directory!\n";
    (new DirectoryManipulator())->location('./images')->clear();
    echo "Done!\n\n";

    /**
     * Download and convert the capes
     */
    echo "Downloading capes...\n";
    $blcAssets = json_decode(file_get_contents($ASSET_URL));
    foreach($blcAssets as $key => $asset) {
        if(strpos($key, "assets/minecraft/blc/textures/cosmetics/cloak") !== false) {
            $fileName = basename($key);
            $fileLocation = "images/" . str_replace("assets/minecraft/blc/textures/cosmetics/cloak/", "", str_replace($fileName, "", $key));
            if(!file_exists($fileLocation)) {
                mkdir($fileLocation);
            }
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
    echo "\n\nFinished!";