package com.swp391.koi_ordering_system.service;

import com.swp391.koi_ordering_system.model.*;
import com.swp391.koi_ordering_system.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class MediaService {

    @Autowired
    private MediaRepository mediaRepository;

    @Autowired
    private FarmRepository farmRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private FishRepository fishRepository;

    @Autowired
    private FishPackRepository fishPackRepository;

    private static final String MEDIA_FOLDER = "D:\\Upload\\medias\\";

    public Media uploadMedia(MultipartFile file) throws IOException {
        File uploadFolder = new File(MEDIA_FOLDER);
        if (!uploadFolder.exists()) {
            uploadFolder.mkdirs();
        }

        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null || originalFileName.isEmpty()) {
            throw new IOException("File name is missing");
        }
        Path filePath = Paths.get(MEDIA_FOLDER + originalFileName);
        int count = 1;
        while (Files.exists(filePath)) {
            String newFileName = originalFileName.substring(0, originalFileName.lastIndexOf('.')) +
                    "_" + count++ + originalFileName.substring(originalFileName.lastIndexOf('.'));
            filePath = Paths.get(MEDIA_FOLDER + newFileName);
        }
        Files.write(filePath, file.getBytes());

        Media media = new Media();
        media.setId(generateMediaId());
        media.setName(filePath.getFileName().toString()); // Save the new file name
        media.setType(file.getContentType());
        String publicUrl = "http://localhost:8080/media/" + filePath.getFileName().toString();
        media.setUrl(publicUrl);

        return mediaRepository.save(media);
    }

    public Farm uploadFarmImage(String farmId, MultipartFile file) throws IOException {
        Farm farm = farmRepository.findById(farmId).orElseThrow(() -> new RuntimeException("Farm not found"));
        Media media = uploadMedia(file);
        farm.setImage(media);
        return farmRepository.save(farm);
    }

    public Account uploadAccountImage(String accountId, MultipartFile file) throws IOException {
        Account account = accountRepository.findById(accountId).orElseThrow(() -> new RuntimeException("Account not found"));
        Media media = uploadMedia(file);
        account.setProfileImg(media);
        return accountRepository.save(account);
    }

    public Fish uploadFishImage(String fishId, MultipartFile file) throws IOException {
        Fish fish = fishRepository.findById(fishId)
                .orElseThrow(() -> new RuntimeException("Fish not found"));
        Media media = uploadMedia(file);
        fish.getMedias().add(media);
        return fishRepository.save(fish);
    }

    public FishPack uploadFishPackImage(String fishPackId, MultipartFile file) throws IOException {
        FishPack fishPack = fishPackRepository.findById(fishPackId)
                .orElseThrow(() -> new RuntimeException("Fish Pack not found"));
        Media media = uploadMedia(file);
        fishPack.getMedias().add(media);
        return fishPackRepository.save(fishPack);
    }

    public ResponseEntity<Resource> getMedia(String filename) {
        try {
            Media media = mediaRepository.findByUrl("http://localhost:8080/media/" + filename)
                    .orElseThrow(() -> new RuntimeException("Media not found"));

            Path filePath = Paths.get(MEDIA_FOLDER + filename);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .contentType(MediaType.parseMediaType(media.getType()))
                        .body(resource);
            } else {
                throw new RuntimeException("Could not read the file!");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }

    public Media getMediaById(String mediaId) {
        return mediaRepository.findById(mediaId)
                .orElseThrow(() -> new RuntimeException("Media not found"));
    }

    private String generateMediaId() {
        String lastMediaId = mediaRepository.findTopByOrderByIdDesc()
                .map(Media::getId)
                .orElse("ME0000");
        int nextId = Integer.parseInt(lastMediaId.substring(2)) + 1;
        return String.format("ME%04d", nextId);
    }
}
