package com.esgis2026.assigame.util;

import javax.imageio.ImageIO;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

public final class ImageScaler {

    private ImageScaler() {
    }

    public static byte[] toThumbnail(byte[] source, int maxSize) throws IOException {
        if (source == null || source.length == 0) {
            return source;
        }

        BufferedImage original = ImageIO.read(new ByteArrayInputStream(source));
        if (original == null) {
            return source;
        }

        int width = original.getWidth();
        int height = original.getHeight();
        if (width <= maxSize && height <= maxSize) {
            return source;
        }

        double scale = Math.min((double) maxSize / width, (double) maxSize / height);
        int targetWidth = Math.max(1, (int) Math.round(width * scale));
        int targetHeight = Math.max(1, (int) Math.round(height * scale));

        BufferedImage resized = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics = resized.createGraphics();
        graphics.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        graphics.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        graphics.setColor(Color.WHITE);
        graphics.fillRect(0, 0, targetWidth, targetHeight);
        graphics.drawImage(original, 0, 0, targetWidth, targetHeight, null);
        graphics.dispose();

        ByteArrayOutputStream output = new ByteArrayOutputStream();
        ImageIO.write(resized, "jpeg", output);
        return output.toByteArray();
    }
}
