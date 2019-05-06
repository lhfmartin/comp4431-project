(function(imageproc) {
    "use strict";

    /*
     * Apply Kuwahara filter to the input data
     */
    imageproc.kuwahara = function(inputData, outputData, size, type) {
        /*
         * TODO: You need to extend the kuwahara function to include different
         * sizes of the filter
         *
         * You need to clearly understand the following code to make
         * appropriate changes
         */

        var order = 0;

        if(size == 9){
          order = 1;
        } else if(size == 13){
          order = 2;
        }


        /* An internal function to find the regional stat centred at (x, y) */
        function regionStat(x, y) {
            /* Find the mean colour and brightness */
            var meanR = 0, meanG = 0, meanB = 0;
            var meanValue = 0;
            for (var j = -1 - order; j <= 1 + order; j++) {
                for (var i = -1 - order; i <= 1 + order; i++) {
                    var pixel = imageproc.getPixel(inputData, x + i, y + j);

                    /* For the mean colour */
                    meanR += pixel.r;
                    meanG += pixel.g;
                    meanB += pixel.b;

                    /* For the mean brightness */
                    meanValue += (pixel.r + pixel.g + pixel.b) / 3;
                }
            }
            meanR /= (3 + order * 2) * (3 + order * 2);
            meanG /= (3 + order * 2) * (3 + order * 2);
            meanB /= (3 + order * 2) * (3 + order * 2);
            meanValue /= (3 + order * 2) * (3 + order * 2);

            /* Find the variance */
            var variance = 0;
            for (var j = -1 - order; j <= 1 + order; j++) {
                for (var i = -1 - order; i <= 1 + order; i++) {
                    var pixel = imageproc.getPixel(inputData, x + i, y + j);
                    var value = (pixel.r + pixel.g + pixel.b) / 3;

                    variance += Math.pow(value - meanValue, 2);
                }
            }
            variance /= (3 + order * 2) * (3 + order * 2);
            /* Return the mean and variance as an object */
            return {
                mean: {r: meanR, g: meanG, b: meanB},
                variance: variance
            };
        }

        function regionStat2(x, y, q, width) {
            /* Find the mean colour and brightness */
            var meanR = 0, meanG = 0, meanB = 0;
            var meanValue = 0;

            if(q == 1){
              for (var j = 0; j > -width; j--) {
                  for (var i = 0; i < width; i++) {
                      var pixel = imageproc.getPixel(inputData, x + i, y + j);

                      /* For the mean colour */
                      meanR += pixel.r;
                      meanG += pixel.g;
                      meanB += pixel.b;

                      /* For the mean brightness */
                      meanValue += (pixel.r + pixel.g + pixel.b) / 3;
                  }
              }
            } else if(q == 2){
              for (var j = 0; j > -width; j--) {
                  for (var i = 0; i > -width; i--) {
                      var pixel = imageproc.getPixel(inputData, x + i, y + j);

                      /* For the mean colour */
                      meanR += pixel.r;
                      meanG += pixel.g;
                      meanB += pixel.b;

                      /* For the mean brightness */
                      meanValue += (pixel.r + pixel.g + pixel.b) / 3;
                  }
              }
            } else if(q == 3){
              for (var j = 0; j < width; j++) {
                  for (var i = 0; i > -width; i--) {
                      var pixel = imageproc.getPixel(inputData, x + i, y + j);

                      /* For the mean colour */
                      meanR += pixel.r;
                      meanG += pixel.g;
                      meanB += pixel.b;

                      /* For the mean brightness */
                      meanValue += (pixel.r + pixel.g + pixel.b) / 3;
                  }
              }
            } else if(q == 4){
              for (var j = 0; j < width; j++) {
                  for (var i = 0; i < width; i++) {
                      var pixel = imageproc.getPixel(inputData, x + i, y + j);

                      /* For the mean colour */
                      meanR += pixel.r;
                      meanG += pixel.g;
                      meanB += pixel.b;

                      /* For the mean brightness */
                      meanValue += (pixel.r + pixel.g + pixel.b) / 3;
                  }
              }
            }

            meanR /= width * width;
            meanG /= width * width;
            meanB /= width * width;
            meanValue /= width * width;

            /* Find the variance */
            var variance = 0;
            if(q == 1){
              for (var j = 0; j > -width; j--) {
                  for (var i = 0; i < width; i++) {
                    var pixel = imageproc.getPixel(inputData, x + i, y + j);
                    var value = (pixel.r + pixel.g + pixel.b) / 3;

                    variance += Math.pow(value - meanValue, 2);
                  }
              }
            } else if(q == 2){
              for (var j = 0; j > -width; j--) {
                  for (var i = 0; i > -width; i--) {
                    var pixel = imageproc.getPixel(inputData, x + i, y + j);
                    var value = (pixel.r + pixel.g + pixel.b) / 3;

                    variance += Math.pow(value - meanValue, 2);
                  }
              }
            } else if(q == 3){
              for (var j = 0; j < width; j++) {
                  for (var i = 0; i > -width; i--) {
                    var pixel = imageproc.getPixel(inputData, x + i, y + j);
                    var value = (pixel.r + pixel.g + pixel.b) / 3;

                    variance += Math.pow(value - meanValue, 2);
                  }
              }
            } else if(q == 4){
              for (var j = 0; j < width; j++) {
                  for (var i = 0; i < width; i++) {
                    var pixel = imageproc.getPixel(inputData, x + i, y + j);
                    var value = (pixel.r + pixel.g + pixel.b) / 3;

                    variance += Math.pow(value - meanValue, 2);
                  }
              }
            }
            variance /= width * width;
            /* Return the mean and variance as an object */
            return {
                mean: {r: meanR, g: meanG, b: meanB},
                variance: variance
            };
        }

        function adaptiveRegionStat(x, y, q){
          var data = [];
          for (var i = 2; i < 8; i++){
            data.push(regionStat2(x, y, q, i));
          }
          var minV = data[0].variance;
          data.forEach((e) => {
            minV = e.variance < minV ? e.variance : minV;
          })
          return data.filter(e => e.variance == minV)[0];
        }

        function circleRegionStat(x, y, q){
          /* Find the mean colour and brightness */
          var meanR = 0, meanG = 0, meanB = 0;
          var meanValue = 0;
          var count = 0;
          switch (q){
          case 1:
            for (var j = -1 - order; j <= 1 + order; j++) {
                for (var i = -1 - order; i <= 1 + order; i++) {
                  var pixel = imageproc.getPixel(inputData, x + i, y + j);

                  /* For the mean colour */
                  meanR += pixel.r;
                  meanG += pixel.g;
                  meanB += pixel.b;

                  /* For the mean brightness */
                  meanValue += (pixel.r + pixel.g + pixel.b) / 3;
                  count++;
                  if(i == j){
                    break;
                  }
                }
            }
            break;
          case 2:
            for (var j = -1 - order; j <= 1 + order; j++) {
              var start = false;
                for (var i = -1 - order; i <= 1 + order; i++) {
                  if(i == -j){
                    start = true;
                  }
                  if(start){
                    var pixel = imageproc.getPixel(inputData, x + i, y + j);

                    /* For the mean colour */
                    meanR += pixel.r;
                    meanG += pixel.g;
                    meanB += pixel.b;

                    /* For the mean brightness */
                    meanValue += (pixel.r + pixel.g + pixel.b) / 3;
                    count++;
                  }
                }
            }
            break;
          case 3:
            for (var j = -1 - order; j <= 1 + order; j++) {
              var start = false;
                for (var i = -1 - order; i <= 1 + order; i++) {
                  if(i == j){
                    start = true;
                  }
                  if(start){
                    var pixel = imageproc.getPixel(inputData, x + i, y + j);

                    /* For the mean colour */
                    meanR += pixel.r;
                    meanG += pixel.g;
                    meanB += pixel.b;

                    /* For the mean brightness */
                    meanValue += (pixel.r + pixel.g + pixel.b) / 3;
                    count++;
                  }
                }
            }
            break;
          case 4:
            for (var j = -1 - order; j <= 1 + order; j++) {
                for (var i = -1 - order; i <= 1 + order; i++) {
                    var pixel = imageproc.getPixel(inputData, x + i, y + j);

                    /* For the mean colour */
                    meanR += pixel.r;
                    meanG += pixel.g;
                    meanB += pixel.b;

                    /* For the mean brightness */
                    meanValue += (pixel.r + pixel.g + pixel.b) / 3;
                    count++;
                    if(i == -j){
                      break;
                    }
                }
            }
            break;
          }
          meanR /= count;
          meanG /= count;
          meanB /= count;
          meanValue /= count;

          /* Find the variance */
          var variance = 0;

          switch (q){
          case 1:
            for (var j = -1 - order; j <= 1 + order; j++) {
              var end = false;
                for (var i = -1 - order; i <= 1 + order; i++) {
                  var pixel = imageproc.getPixel(inputData, x + i, y + j);
                  var value = (pixel.r + pixel.g + pixel.b) / 3;

                  variance += Math.pow(value - meanValue, 2);

                  if(i == j){
                    break;
                  }
                }
            }
            break;
          case 2:
            for (var j = -1 - order; j <= 1 + order; j++) {
              var start = false;
                for (var i = -1 - order; i <= 1 + order; i++) {
                  if(i == -j){
                    start = true;
                  }
                  if(start){
                    var pixel = imageproc.getPixel(inputData, x + i, y + j);

                    var value = (pixel.r + pixel.g + pixel.b) / 3;

                    variance += Math.pow(value - meanValue, 2);

                  }
                }
            }
            break;
          case 3:
            for (var j = -1 - order; j <= 1 + order; j++) {
              var start = false;
                for (var i = -1 - order; i <= 1 + order; i++) {
                  if(i == j){
                    start = true;
                  }
                  if(start){
                    var pixel = imageproc.getPixel(inputData, x + i, y + j);

                    var value = (pixel.r + pixel.g + pixel.b) / 3;

                    variance += Math.pow(value - meanValue, 2);

                  }
                }
            }
            break;
          case 4:
            for (var j = -1 - order; j <= 1 + order; j++) {
                for (var i = -1 - order; i <= 1 + order; i++) {
                    var pixel = imageproc.getPixel(inputData, x + i, y + j);

                    var value = (pixel.r + pixel.g + pixel.b) / 3;

                    variance += Math.pow(value - meanValue, 2);


                    if(i == -j){
                      break;
                    }
                }
            }
            break;
          }
          variance /= count;
          /* Return the mean and variance as an object */
          return {
              mean: {r: meanR, g: meanG, b: meanB},
              variance: variance,
              count: count
          };
        }

        for (var y = 0; y < inputData.height; y++) {
            for (var x = 0; x < inputData.width; x++) {
                /* Find the statistics of the four sub-regions */
                var regionA, regionB, regionC, regionD;
                if(type == "original"){
                  regionA = regionStat(x - 1 - order, y - 1 - order);
                  regionB = regionStat(x + 1 + order, y - 1 - order);
                  regionC = regionStat(x - 1 - order, y + 1 + order);
                  regionD = regionStat(x + 1 + order, y + 1 + order);
                } else if(type == "adaptive"){
                  regionA = adaptiveRegionStat(x, y, 2);
                  regionB = adaptiveRegionStat(x, y, 1);
                  regionC = adaptiveRegionStat(x, y, 3);
                  regionD = adaptiveRegionStat(x, y, 4);
                } else if(type == "hexagon"){

                } else if(type == "circle"){
                  regionA = circleRegionStat(x - 1 - order, y - 1 - order, 2);
                  regionB = circleRegionStat(x + 1 + order, y - 1 - order, 1);
                  regionC = circleRegionStat(x - 1 - order, y + 1 + order, 3);
                  regionD = circleRegionStat(x + 1 + order, y + 1 + order, 4);
                } else if(type == "sector"){
                  
                }

                /* Get the minimum variance value */
                var minV = Math.min(regionA.variance, regionB.variance,
                                    regionC.variance, regionD.variance);

                var i = (x + y * inputData.width) * 4;

                /* Put the mean colour of the region with the minimum
                   variance in the pixel */
                switch (minV) {
                case regionA.variance:
                    outputData.data[i]     = regionA.mean.r;
                    outputData.data[i + 1] = regionA.mean.g;
                    outputData.data[i + 2] = regionA.mean.b;
                    break;
                case regionB.variance:
                    outputData.data[i]     = regionB.mean.r;
                    outputData.data[i + 1] = regionB.mean.g;
                    outputData.data[i + 2] = regionB.mean.b;
                    break;
                case regionC.variance:
                    outputData.data[i]     = regionC.mean.r;
                    outputData.data[i + 1] = regionC.mean.g;
                    outputData.data[i + 2] = regionC.mean.b;
                    break;
                case regionD.variance:
                    outputData.data[i]     = regionD.mean.r;
                    outputData.data[i + 1] = regionD.mean.g;
                    outputData.data[i + 2] = regionD.mean.b;
                }
            }
        }
    }

}(window.imageproc = window.imageproc || {}));
