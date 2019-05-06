(function(imageproc) {
    "use strict";

    /*
     * Convert the input data to grayscale
     */
    imageproc.grayscale = function(inputData, outputData) {
        for (var i = 0; i < inputData.data.length; i += 4) {
            var value = inputData.data[i] +
                        inputData.data[i + 1] +
                        inputData.data[i + 2];
            value /= 3;

            outputData.data[i]     =
            outputData.data[i + 1] =
            outputData.data[i + 2] = value;
        }
    }

    /*
     * Make a bit mask based on the number of MSB required
     */
    function makeBitMask(bits) {
        var mask = 0;
        for (var i = 0; i < bits; i++) {
            mask >>= 1;
            mask |= 128;
        }
        return mask;
    }

    /*
     * Apply posterization to the input data
     */
    imageproc.posterization = function(inputData, outputData,
                                       redBits, greenBits, blueBits) {
        /**
         * TODO: You need to create the posterization effect here
         */

        // Create the red, green and blue masks
        // A function makeBitMask() is already given
        var rMask = makeBitMask(redBits);
        var gMask = makeBitMask(greenBits);
        var bMask = makeBitMask(blueBits);


        // Apply the bitmasks onto the colour channels

        for (var i = 0; i < inputData.data.length; i += 4) {
            outputData.data[i]     = inputData.data[i] & rMask;
            outputData.data[i + 1] = inputData.data[i + 1] & gMask;
            outputData.data[i + 2] = inputData.data[i + 2] & bMask;
        }
    }

    /*
     * Apply threshold to the input data
     */
    imageproc.threshold = function(inputData, outputData, thresholdValue) {
        /**
         * TODO: You need to create the thresholding effect here
         */

        for (var i = 0; i < inputData.data.length; i += 4) {
            // Find the grayscale value
            // You will apply thresholding on the grayscale value
            var grey = (inputData.data[i] + inputData.data[i + 1] + inputData.data[i + 2]) / 3;
            
            inputData.data[i] = grey < thresholdValue ? 0 : 255;
            inputData.data[i + 1] = inputData.data[i];
            inputData.data[i + 2] = inputData.data[i];

            // Change the colour to black or white based on the given threshold

            outputData.data[i]     = inputData.data[i];
            outputData.data[i + 1] = inputData.data[i + 1];
            outputData.data[i + 2] = inputData.data[i + 2];
        }
    }

    /*
     * Apply blur to the input data
     */
    imageproc.blur = function(inputData, outputData, kernelSize) {
        /**
         * TODO: You need to extend the blur effect to include different
         * kernel sizes
         */

        // You are given a 3x3 kernel but you need to create a proper kernel
        // using the given kernel size
        var kernel = [];
        var subArr = [];
        for(var i = 0; i < kernelSize; i++){
          subArr.push(1);
        }
        for(var i = 0; i < kernelSize; i++){
          kernel.push(subArr);
        }

        // The following code applies the 3x3 kernel to the image but the code
        // has hardcoded the size so you need to make changes to allow for
        // different kernel sizes

        for (var y = 0; y < inputData.height; y++) {
            for (var x = 0; x < inputData.width; x++) {
                var sumR = 0, sumG = 0, sumB = 0;

                var order = Math.floor(kernelSize / 2) - 1;

                /* Sum the product of the kernel on the pixels */
                for (var j = -1 - order; j <= 1 + order; j++) {
                    for (var i = -1 - order; i <= 1 + order; i++) {
                        var pixel =
                            imageproc.getPixel(inputData, x + i, y + j);
                        var coeff = kernel[j + 1 + order][i + 1 + order];

                        sumR += pixel.r * coeff;
                        sumG += pixel.g * coeff;
                        sumB += pixel.b * coeff;
                    }
                }

                /* Set the averaged pixel to the output data */
                var i = (x + y * outputData.width) * 4;
                var divisor = kernelSize * kernelSize;
                outputData.data[i]     = sumR / divisor;
                outputData.data[i + 1] = sumG / divisor;
                outputData.data[i + 2] = sumB / divisor;
            }
        }
    }

}(window.imageproc = window.imageproc || {}));
