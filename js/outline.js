(function(imageproc) {
    "use strict";

    /*
     * Apply sobel edge to the input data
     */
    imageproc.sobelEdge = function(inputData, outputData, threshold) {
        /* Initialize the two edge kernel Gx and Gy */
        var Gx = [
            [-1, 0, 1],
            [-2, 0, 2],
            [-1, 0, 1]
        ];
        var Gy = [
            [-1,-2,-1],
            [ 0, 0, 0],
            [ 1, 2, 1]
        ];

        /**
         * TODO: You need to write the code to apply
         * the two edge kernels appropriately
         */
         for (var y = 0; y < inputData.height; y++) {
             for (var x = 0; x < inputData.width; x++) {
                 var sumRx = 0, sumGx = 0, sumBx = 0;
                 var sumRy = 0, sumGy = 0, sumBy = 0;

                 /* Sum the product of the kernel on the pixels */
                 for (var j = -1; j <= 1; j++) {
                     for (var i = -1; i <= 1; i++) {
                         var pixel =
                             imageproc.getPixel(inputData, x + i, y + j);
                         var xcoeff = Gx[j + 1][i + 1];
                         var ycoeff = Gy[j + 1][i + 1];

                         sumRx += pixel.r * xcoeff;
                         sumGx += pixel.g * xcoeff;
                         sumBx += pixel.b * xcoeff;

                         sumRy += pixel.r * ycoeff;
                         sumGy += pixel.g * ycoeff;
                         sumBy += pixel.b * ycoeff;
                     }
                 }

                 /* Set the averaged pixel to the output data */
                 var i = (x + y * outputData.width) * 4;
                 outputData.data[i]     = Math.hypot(sumRx, sumRy);
                 outputData.data[i + 1] = Math.hypot(sumGx, sumGy);
                 outputData.data[i + 2] = Math.hypot(sumBx, sumBy);
             }
         }
         for (var i = 0; i < outputData.data.length; i += 4) {
             var grey = (outputData.data[i] + outputData.data[i + 1] + outputData.data[i + 2]) / 3;
             outputData.data[i] = grey < threshold ? 0 : 255;
             outputData.data[i + 1] = outputData.data[i];
             outputData.data[i + 2] = outputData.data[i];
         }
    }

}(window.imageproc = window.imageproc || {}));
