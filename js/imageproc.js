(function(imageproc) {
    "use strict";

    var input, output;
    var imageSelector;

    imageproc.operation = null;

    /*
     * Init the module and update the input image
     */
    imageproc.init = function(inputCanvasId,
                              outputCanvasId,
                              inputImageId) {
        input  = $("#" + inputCanvasId).get(0).getContext("2d");
        output = $("#" + outputCanvasId).get(0).getContext("2d");

        imageSelector = $("#" + inputImageId);
        imageproc.updateInputImage();
    }

    /*
     * Update the input image canvas
     */
    imageproc.updateInputImage = function() {
        var image = new Image();
        image.onload = function () {
            input.drawImage(image, 0, 0);
        }
        image.src = "images/" + imageSelector.val();
    }

    /*
     * Apply an image processing operation to an input image and
     * then put the output image in the output canvas
     */
    imageproc.apply = function() {
        /* Get the input image and create the output image buffer */
        var inputImage = input.getImageData(0, 0,
                         input.canvas.clientWidth, input.canvas.clientHeight);
        var outputImage = output.createImageData(input.canvas.clientWidth,
                                                 input.canvas.clientHeight);

        /* Update the alpha values of the newly created image */
        for (var i = 0; i < outputImage.data.length; i+=4)
            outputImage.data[i + 3] = 255;

        if (imageproc.operation) {
            /* Apply the operation */
            imageproc.operation(inputImage, outputImage);
        }

        /* Put the output image in the canvas */
        output.putImageData(outputImage, 0, 0);
    }

    /*
     * Convert RGB to HSL
     */
    imageproc.fromRGBToHSL = function(r, g, b) {
        r = r / 255.0; g = g / 255.0; b = b / 255.0;
        var m1 = Math.min(r, g, b);
        var m2 = Math.max(r, g, b);
        var h, s, l;
        l = m2 + m1;
        if (m1 == m2) h = s = 0;
        else {
            var d = m2 - m1;
            switch (m2) {
            case r: h = (g - b) / d; break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4;
            }
            if (h < 0) h = h + 6;
            if (h >= 6) h = h - 6;
            h = h * 60;
            if (l <= 1) s = d / l;
            else s = d / (2 - l);
        }
        l = l / 2;
        return {"h": h, "s": s, "l": l};
    }

    /*
     * Convert HSL to RGB
     */
    imageproc.fromHSLToRGB = function(h, s, l) {
        /*
         * Internal function to get RGB from hue
         */
        function fromHueToRGB(m1, m2, h) {
            if (h < 0) h = h + 1;
            if (h > 1) h = h - 1;
            if (h * 6 < 1) return m1 + (m2 - m1) * h * 6;
            if (h * 2 < 1) return m2;
            if (h * 3 < 2) return m1 + (m2 - m1) * (2/3 - h) * 6;
            return m1;
        }

        h = h / 360.0;
        var m1, m2;
        if (l <= 0.5) m2 = l * (s + 1);
        else m2 = l + s - l * s;
        m1 = l * 2 - m2;
        var r = fromHueToRGB(m1, m2, h + 1/3)
        var g = fromHueToRGB(m1, m2, h)
        var b = fromHueToRGB(m1, m2, h - 1/3)
        return {"r": Math.round(r * 255),
                "g": Math.round(g * 255),
                "b": Math.round(b * 255)};
    }

    /*
     * Get a pixel colour from an ImageData object
     * 
     * The parameter border can be either "extend" (default) and "wrap"
     */
    imageproc.getPixel = function(imageData, x, y, border) {
        // Handle the boundary cases
        if (x < 0)
            x = (border=="wrap")? imageData.width + (x % imageData.width) : 0;
        if (x >= imageData.width)
            x = (border=="wrap")? x % imageData.width : imageData.width - 1;
        if (y < 0)
            y = (border=="wrap")? imageData.height + (y % imageData.height) : 0;
        if (y >= imageData.height)
            y = (border=="wrap")? y % imageData.height : imageData.height - 1;

        var i = (x + y * imageData.width) * 4;
        return {
            r: imageData.data[i],
            g: imageData.data[i + 1],
            b: imageData.data[i + 2],
            a: imageData.data[i + 3]
        };
    }

    /*
     * Get an empty buffer of the same size as the image dat
     */
    imageproc.createBuffer = function(imageData) {
        /* Create the buffer */
        var buffer = {
            width: imageData.width,
            height: imageData.height,
            data: []
        };

        /* Initialize the buffer */
        for (var i = 0; i < imageData.data.length; i+=4) {
            buffer.data[i]     = 0;
            buffer.data[i + 1] = 0;
            buffer.data[i + 2] = 0;
            buffer.data[i + 3] = 255;
        }

        return buffer;
    }

    /*
     * Copy a source data to an destination data
     */
    imageproc.copyImageData = function(src, dest) {
        if (src.data.length != dest.data.length)
            return;

        /* Copy the data */
        for (var i = 0; i < src.data.length; i+=4) {
            dest.data[i]     = src.data[i];
            dest.data[i + 1] = src.data[i + 1];
            dest.data[i + 2] = src.data[i + 2];
            dest.data[i + 3] = src.data[i + 3];
        }
    }
 
}(window.imageproc = window.imageproc || {}));
