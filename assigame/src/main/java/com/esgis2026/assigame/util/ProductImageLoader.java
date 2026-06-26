package com.esgis2026.assigame.util;

import com.esgis2026.assigame.entity.CategorieProduit;
import com.esgis2026.assigame.entity.Produit;

import java.io.IOException;
import java.io.InputStream;
import java.net.InetAddress;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLConnection;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Set;

public final class ProductImageLoader {

    private static final int MAX_IMAGE_BYTES = 10 * 1024 * 1024;
    private static final int CONNECT_TIMEOUT_MS = 8000;
    private static final int READ_TIMEOUT_MS = 15000;
    private static final Set<String> ALLOWED_HOST_SUFFIXES = Set.of(
            "unsplash.com",
            "images.unsplash.com",
            "plus.unsplash.com"
    );

    private ProductImageLoader() {
    }

    public static void applyFromUrl(Produit produit, String imageUrl) throws IOException {
        LoadedImage loaded = loadFromUrl(imageUrl);
        produit.setImage(loaded.bytes());
        produit.setImage_type(loaded.contentType());
    }

    public static void applyFromUrl(CategorieProduit categorie, String imageUrl) throws IOException {
        LoadedImage loaded = loadFromUrl(imageUrl);
        categorie.setImage(loaded.bytes());
        categorie.setImage_type(loaded.contentType());
    }

    public static void applyFromFile(Produit produit, Path imagePath) throws IOException {
        produit.setImage(Files.readAllBytes(imagePath));
        produit.setImage_type(guessContentType(imagePath.getFileName().toString()));
    }

    private static LoadedImage loadFromUrl(String imageUrl) throws IOException {
        if (imageUrl == null || imageUrl.isBlank()) {
            throw new IOException("URL d'image vide");
        }

        URI uri = validateRemoteImageUrl(imageUrl.trim());
        URLConnection connection = uri.toURL().openConnection();
        connection.setConnectTimeout(CONNECT_TIMEOUT_MS);
        connection.setReadTimeout(READ_TIMEOUT_MS);
        connection.setRequestProperty("User-Agent", "AssigameImageFetcher/1.0");

        try (InputStream input = connection.getInputStream()) {
            byte[] imageBytes = input.readNBytes(MAX_IMAGE_BYTES + 1);
            if (imageBytes.length == 0) {
                throw new IOException("Image vide");
            }
            if (imageBytes.length > MAX_IMAGE_BYTES) {
                throw new IOException("Image trop volumineuse");
            }
            return new LoadedImage(imageBytes, guessContentType(imageUrl));
        }
    }

    static URI validateRemoteImageUrl(String imageUrl) throws IOException {
        URI uri;
        try {
            uri = new URI(imageUrl);
        } catch (URISyntaxException e) {
            throw new IOException("URL d'image invalide");
        }

        String scheme = uri.getScheme();
        if (scheme == null || !scheme.equalsIgnoreCase("https")) {
            throw new IOException("Seules les URLs HTTPS sont autorisées");
        }

        String host = uri.getHost();
        if (host == null || host.isBlank()) {
            throw new IOException("Hôte d'image invalide");
        }

        String lowerHost = host.toLowerCase();
        if (lowerHost.equals("localhost") || lowerHost.endsWith(".local")) {
            throw new IOException("Hôte d'image non autorisé");
        }

        if (!isAllowedHost(lowerHost)) {
            throw new IOException("Hôte d'image non autorisé");
        }

        try {
            for (InetAddress address : InetAddress.getAllByName(host)) {
                if (address.isAnyLocalAddress()
                        || address.isLoopbackAddress()
                        || address.isLinkLocalAddress()
                        || address.isSiteLocalAddress()) {
                    throw new IOException("Adresse réseau privée non autorisée");
                }
            }
        } catch (IOException e) {
            throw e;
        } catch (Exception e) {
            throw new IOException("Impossible de résoudre l'hôte d'image");
        }

        return uri;
    }

    private static boolean isAllowedHost(String host) {
        for (String suffix : ALLOWED_HOST_SUFFIXES) {
            if (host.equals(suffix) || host.endsWith("." + suffix)) {
                return true;
            }
        }
        return false;
    }

    private static String guessContentType(String nameOrUrl) {
        String lower = nameOrUrl.toLowerCase();
        if (lower.contains(".png")) return "image/png";
        if (lower.contains(".webp")) return "image/webp";
        if (lower.contains(".gif")) return "image/gif";
        return "image/jpeg";
    }

    private record LoadedImage(byte[] bytes, String contentType) {
    }
}
