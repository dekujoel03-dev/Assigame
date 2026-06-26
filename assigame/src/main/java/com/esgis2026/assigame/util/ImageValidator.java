package com.esgis2026.assigame.util;

import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Iterator;
import java.util.Map;

public final class ImageValidator {

    private static final int MAX_IMAGE_BYTES = 10 * 1024 * 1024;
    private static final Map<String, String> FORMAT_TO_MIME = Map.of(
            "jpeg", "image/jpeg",
            "jpg", "image/jpeg",
            "png", "image/png",
            "gif", "image/gif",
            "webp", "image/webp"
    );

    private ImageValidator() {
    }

    public static ValidatedImage validate(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IOException("Fichier image vide");
        }

        byte[] bytes = file.getBytes();
        if (bytes.length == 0) {
            throw new IOException("Fichier image vide");
        }
        if (bytes.length > MAX_IMAGE_BYTES) {
            throw new IOException("Image trop volumineuse");
        }

        String contentType = detectContentType(bytes);
        if (contentType == null) {
            throw new IOException("Format d'image non supporté");
        }

        try (var input = new ByteArrayInputStream(bytes)) {
            if (ImageIO.read(input) == null) {
                throw new IOException("Contenu image invalide");
            }
        }

        return new ValidatedImage(bytes, contentType);
    }

    private static String detectContentType(byte[] bytes) throws IOException {
        try (ImageInputStream stream = ImageIO.createImageInputStream(new ByteArrayInputStream(bytes))) {
            Iterator<ImageReader> readers = ImageIO.getImageReaders(stream);
            if (!readers.hasNext()) {
                return null;
            }
            ImageReader reader = readers.next();
            try {
                String format = reader.getFormatName().toLowerCase();
                return FORMAT_TO_MIME.get(format);
            } finally {
                reader.dispose();
            }
        }
    }

    public record ValidatedImage(byte[] bytes, String contentType) {
    }
}
