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
          var amin = Number(document.getElementById("kuwahara-amin").value);
          var amax = Number(document.getElementById("kuwahara-amax").value);
          for (var i = amin; i < amax; i++){
            data.push(regionStat2(x, y, q, i));
          }
          var minV = data[0].variance;
          data.forEach((e) => {
            minV = e.variance < minV ? e.variance : minV;
          })
          return data.filter(e => e.variance == minV)[0];
        }

        var sectorSize = Number($("#kuwahara-sector-size").val());

        function checkPointSector(x, y, cx, cy, sectorAngle) {
            var location = 1;
            var locationArray = [];
            var angle = (Math.atan2(y - cy, x - cx) * (180.0 / Math.PI) + 360) % 360;

            for (var i = 0; i <= 360 - sectorAngle; i += sectorAngle) {
                if (angle >= i && angle <= i + sectorAngle) {
                    locationArray.push(location);
                }

                location++;
            }

            return locationArray;
        }

        function circleFilterRegionStat(x, y) {
            var sSize = parseInt(sectorSize);
            var boundary = Math.trunc(size / 2);
            var sectorArray = [];
            var result = [];
            for (var i = 0; i < sSize; i++) {
                sectorArray[i] = [];
            }

            // Loop through each point and check if it is valid and which sector is it
            for (var i = x - boundary; i <= x + boundary; i++) {
                for (var j = y - boundary; j <= y + boundary; j++) {
                    var distance = Math.hypot(i - x, j - y);

                    if (distance > size / 2) {
                        continue;
                    }

                    var pixel = imageproc.getPixel(inputData, i, j);
                    var locationArray = checkPointSector(i, j, x, y, 360 / sSize);
                    for (var k = 0; k < locationArray.length; k++) {
                        sectorArray[locationArray[k] - 1].push(pixel);
                    }
                }
            }

            for (var i = 0; i < sSize; i++) {
                var meanR = 0, meanG = 0, meanB = 0;
                var divisor = sectorArray[i].length;
                var meanValue = 0;
                var variance = 0;

                for (var j = 0; j < sectorArray[i].length; j++) {
                    /* For the mean colour */
                    var pixel = sectorArray[i][j];
                    meanR += pixel.r;
                    meanG += pixel.g;
                    meanB += pixel.b;

                    /* For the mean brightness */
                    meanValue += (pixel.r + pixel.g + pixel.b) / 3;
                }

                meanR /= divisor;
                meanG /= divisor;
                meanB /= divisor;
                meanValue /= divisor;

                for (var j = 0; j < sectorArray[i].length; j++) {
                    var pixel = sectorArray[i][j];
                    var value = (pixel.r + pixel.g + pixel.b) / 3;

                    variance += Math.pow(value - meanValue, 2);

                    variance /= divisor;
                }

                result[result.length] = {
                    mean: {r: meanR, g: meanG, b: meanB},
                    variance: variance
                };
            }

            return result;
        }

        var hexWidth = Number(document.getElementById("kuwahara-hexl").value) * 2;

        function hexRegionStat1(x, y) {
          var meanR = 0, meanG = 0, meanB = 0;
          var meanValue = 0;

          let count = 0;

          for (var j = 0; j > -hexWidth; j--) {
              for (var i = 0; i < hexWidth; i++) {
                  if(i >= hexWidth / 2 && -j < hexWidth / 2 && -j <= i - hexWidth / 2){
                    break
                  }
                  if(i < hexWidth / 2 && -j >= hexWidth / 2 && -j >= i + hexWidth / 2){
                    continue
                  }
                  ++count

                  var pixel = imageproc.getPixel(inputData, x + i, y + j);
                  /* For the mean colour */
                  meanR += pixel.r;
                  meanG += pixel.g;
                  meanB += pixel.b;

                  /* For the mean brightness */
                  meanValue += (pixel.r + pixel.g + pixel.b) / 3;
              }
          }
          meanR /= count;
          meanG /= count;
          meanB /= count;
          meanValue /= count;

          /* Find the variance */
          var variance = 0;
          for (var j = 0; j > -hexWidth; j--) {
              for (var i = 0; i < hexWidth; i++) {
                  if(i >= hexWidth / 2 && -j < hexWidth / 2 && -j <= i - hexWidth / 2){
                    break
                  }
                  if(i < hexWidth / 2 && -j >= hexWidth / 2 && -j >= i + hexWidth / 2){
                    continue
                  }

                  var pixel = imageproc.getPixel(inputData, x + i, y + j);
                  var value = (pixel.r + pixel.g + pixel.b) / 3;

                  variance += Math.pow(value - meanValue, 2);
              }
          }

          variance /= count;
          /* Return the mean and variance as an object */
          return {
              mean: {r: meanR, g: meanG, b: meanB},
              variance: variance
          };
        }

        function hexRegionStat3(x, y) {
          var meanR = 0, meanG = 0, meanB = 0;
          var meanValue = 0;

          let count = 0;

          for (var j = 0; j > -hexWidth; j--) {
              for (var i = 0; i > -hexWidth; i--) {
                if(-i < hexWidth / 2 && -j >= hexWidth / 2 && -j >= -i + hexWidth / 2){
                  continue
                }
                if(-i >= hexWidth / 2 && -j < hexWidth / 2 && -j <= -i - hexWidth / 2){
                  break;
                }
                ++count
                  var pixel = imageproc.getPixel(inputData, x + i, y + j);

                  /* For the mean colour */
                  meanR += pixel.r;
                  meanG += pixel.g;
                  meanB += pixel.b;

                  /* For the mean brightness */
                  meanValue += (pixel.r + pixel.g + pixel.b) / 3;
              }
          }
          meanR /= count;
          meanG /= count;
          meanB /= count;
          meanValue /= count;
          /* Find the variance */
          var variance = 0;
          for (var j = 0; j > -hexWidth; j--) {
              for (var i = 0; i > -hexWidth; i--) {
                if(-i < hexWidth / 2 && -j >= hexWidth / 2 && -j >= -i + hexWidth / 2){
                  continue
                }
                if(-i >= hexWidth / 2 && -j < hexWidth / 2 && -j <= -i - hexWidth / 2){
                  break;
                }
                var pixel = imageproc.getPixel(inputData, x + i, y + j);
                var value = (pixel.r + pixel.g + pixel.b) / 3;

                variance += Math.pow(value - meanValue, 2);
              }
          }


          variance /= count;
          /* Return the mean and variance as an object */
          return {
              mean: {r: meanR, g: meanG, b: meanB},
              variance: variance
          };
        }
var b = false
        function hexRegionStat5(x, y) {
          var meanR = 0, meanG = 0, meanB = 0;
          var meanValue = 0;

          let count = 0;

          for (var j = 0; j < hexWidth; j++) {
              for (var i = 0; i > -hexWidth; i--) {
                if(-i < hexWidth / 2 && j >= hexWidth / 2 && j >= -i + hexWidth / 2){
                  continue
                }
                if(-i >= hexWidth / 2 && j < hexWidth / 2 && j <= -i - hexWidth / 2){
                  break
                }
                ++count
                  var pixel = imageproc.getPixel(inputData, x + i, y + j);

                  /* For the mean colour */
                  meanR += pixel.r;
                  meanG += pixel.g;
                  meanB += pixel.b;

                  /* For the mean brightness */
                  meanValue += (pixel.r + pixel.g + pixel.b) / 3;
              }
          }
          meanR /= count;
          meanG /= count;
          meanB /= count;
          meanValue /= count;

          /* Find the variance */
          var variance = 0;
          for (var j = 0; j < hexWidth; j++) {
              for (var i = 0; i > -hexWidth; i--) {
                if(-i < hexWidth / 2 && j >= hexWidth / 2 && j >= -i + hexWidth / 2){
                  continue
                }
                if(-i >= hexWidth / 2 && j < hexWidth / 2 && j <= -i - hexWidth / 2){
                  break
                }
                var pixel = imageproc.getPixel(inputData, x + i, y + j);
                var value = (pixel.r + pixel.g + pixel.b) / 3;

                variance += Math.pow(value - meanValue, 2);
              }
          }


          variance /= count;
          /* Return the mean and variance as an object */
          return {
              mean: {r: meanR, g: meanG, b: meanB},
              variance: variance
          };
        }

        function hexRegionStat7(x, y) {
          var meanR = 0, meanG = 0, meanB = 0;
          var meanValue = 0;

          let count = 0;

          for (var j = 0; j < hexWidth; j++) {
              for (var i = 0; i < hexWidth; i++) {
                if(i >= hexWidth / 2 && j < hexWidth / 2 && j <= i - hexWidth / 2){
                  break
                }
                if(i < hexWidth / 2 && j >= hexWidth / 2 && j >= i + hexWidth / 2){
                  continue
                }
                ++count
                  var pixel = imageproc.getPixel(inputData, x + i, y + j);

                  /* For the mean colour */
                  meanR += pixel.r;
                  meanG += pixel.g;
                  meanB += pixel.b;

                  /* For the mean brightness */
                  meanValue += (pixel.r + pixel.g + pixel.b) / 3;
              }
          }

          meanR /= count;
          meanG /= count;
          meanB /= count;
          meanValue /= count;

          /* Find the variance */
          var variance = 0;
          for (var j = 0; j < hexWidth; j++) {
              for (var i = 0; i < hexWidth; i++) {
                if(i >= hexWidth / 2 && j < hexWidth / 2 && j <= i - hexWidth / 2){
                  break
                }
                if(i < hexWidth / 2 && j >= hexWidth / 2 && j >= i + hexWidth / 2){
                  continue
                }
                var pixel = imageproc.getPixel(inputData, x + i, y + j);
                var value = (pixel.r + pixel.g + pixel.b) / 3;

                variance += Math.pow(value - meanValue, 2);
              }
          }


          variance /= count;
          /* Return the mean and variance as an object */
          return {
              mean: {r: meanR, g: meanG, b: meanB},
              variance: variance
          };
        }

        function hexRegionStat(x, y, q){
          switch(q){
            case 1:
              return hexRegionStat1(x, y)
            case 1.5:
              return hexRegionStat2(x, y)
            case 2:
              return hexRegionStat3(x, y)
            case 2.5:
              return hexRegionStat4(x, y)
            case 3:
              return hexRegionStat5(x, y)
            case 3.5:
              return hexRegionStat6(x, y)
            case 4:
              return hexRegionStat7(x, y)
            case 4.5:
              return hexRegionStat8(x, y)
          }
        }

        for (var y = 0; y < inputData.height; y++) {
            for (var x = 0; x < inputData.width; x++) {
                /* Find the statistics of the four sub-regions */
                var regionA, regionB, regionC, regionD;
                var sectorArray;
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
                  regionA = hexRegionStat(x, y, 2);
                  regionB = hexRegionStat(x, y, 1);
                  regionC = hexRegionStat(x, y, 3);
                  regionD = hexRegionStat(x, y, 4);
                } else if(type == "circle"){
                  sectorArray = circleFilterRegionStat(x, y);
                } else if(type == "sector"){

                }

                var minV;
                /* Put the mean colour of the region with the minimum
                   variance in the pixel */
                if(type == "circle"){
                  minV = Math.min.apply(null, sectorArray.map(function(a){ return a.variance; }));

                  var i = (x + y * inputData.width) * 4;

                  var targetMean;

                  sectorArray.forEach(function(a){if (a.variance == minV) targetMean = a;});

                  outputData.data[i]     = targetMean.mean.r;
                  outputData.data[i + 1] = targetMean.mean.g;
                  outputData.data[i + 2] = targetMean.mean.b;
                } else{
                  /* Get the minimum variance value */
                  minV = Math.min(regionA.variance, regionB.variance,
                                      regionC.variance, regionD.variance);

                  var i = (x + y * inputData.width) * 4;
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
    }

}(window.imageproc = window.imageproc || {}));
