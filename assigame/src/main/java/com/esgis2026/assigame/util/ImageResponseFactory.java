package com.esgis2026.assigame.util;

import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

public final class ImageResponseFactory {

    private static final int THUMB_MAX_SIZE = 480;
    private static final CacheControl IMAGE_CACHE = CacheControl.maxAge(7, TimeUnit.DAYS).cachePublic();

    private ImageResponseFactory() {
    }

    public static ResponseEntity<byte[]> build(Long id, byte[] image, String imageType, boolean thumb)
            throws IOException {
        if (image == null || image.length == 0) {
            return ResponseEntity.notFound().build();
        }

        byte[] payload = thumb ? ImageScaler.toThumbnail(image, THUMB_MAX_SIZE) : image;
        String contentType = thumb ? MediaType.IMAGE_JPEG_VALUE : resolveContentType(imageType);

        return ResponseEntity.ok()
                .cacheControl(IMAGE_CACHE)
                .eTag("\"" + id + "-" + image.length + (thumb ? "-thumb" : "") + "\"")
                .header(HttpHeaders.CONTENT_TYPE, contentType)
                .body(payload);
    }

    private static String resolveContentType(String imageType) {
        return imageType != null && !imageType.isBlank() ? imageType : MediaType.APPLICATION_OCTET_STREAM_VALUE;
    }
}
