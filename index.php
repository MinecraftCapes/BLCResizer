<?php
    // Include composer autoload
    require 'vendor/autoload.php';

    // Import classes
    use Intervention\Image\ImageManagerStatic as Image;
    use Grinderspro\DirectoryManipulator\DirectoryManipulator;

    /**
     * Delete the out dir and copy in to new out (avoid subfolder complications)
     */
    echo "Emptying output directory!\n";
    (new DirectoryManipulator())->location('./images/out')->clear();
    echo "Done!\n\n";

    echo "Starting conversion...\n\n";
    $files = glob('images/in/{,*/}*.png', GLOB_BRACE);
    foreach($files as $file) {
        $fileName = basename($file);
        $folder = str_replace($fileName, "", str_replace("images/in", "images/out", $file));
        if(!file_exists($folder)) {
            mkdir($folder);
        }

        echo "Converting " . basename($file) . "...\n";
        Image::make($file)->crop(704, 544, 0, 0)->resizeCanvas(2048, 1024, 'top-left')->save("$folder/$fileName");
        echo "Done " . basename($file) . "\n\n";
    }

    echo "\n\nFinished!";