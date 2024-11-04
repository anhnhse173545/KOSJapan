package com.swp391.koi_ordering_system.service;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.swp391.koi_ordering_system.model.*;
import com.swp391.koi_ordering_system.repository.*;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

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

    @Value("${aws.access-key}")
    private String awsAccessKey;

    @Value("${aws.secret-key}")
    private String awsSecretKey;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.s3.region}")
    private String region;

    private AmazonS3 s3Client;

    @PostConstruct
    private void initializeAmazon() {
        BasicAWSCredentials awsCredentials = new BasicAWSCredentials(awsAccessKey, awsSecretKey);
        this.s3Client = AmazonS3ClientBuilder.standard()
                .withRegion(region)
                .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
                .build();
    }

    public Media uploadMedia(MultipartFile file, String entity) throws IOException {
        String fileName = generateFileName(file);

        String key = entity + "/" + fileName;

        InputStream inputStream = file.getInputStream();
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());
        metadata.setContentType(file.getContentType());

        s3Client.putObject(bucketName, key, inputStream, metadata);

        Media media = new Media();
        media.setId(generateMediaId());
        media.setName(fileName);
        media.setType(file.getContentType());

        String publicUrl = s3Client.getUrl(bucketName, key).toString();
        media.setUrl(publicUrl);

        return mediaRepository.save(media);
    }


    private String generateFileName(MultipartFile file) {
        return System.currentTimeMillis() + "_" + file.getOriginalFilename().replace(" ", "_");
    }

    public Object uploadEntityImage(String entityId, String entity, MultipartFile file) throws IOException {
        Media media;
        if ("farm".equalsIgnoreCase(entity)) {
            Farm farm = farmRepository.findById(entityId)
                    .orElseThrow(() -> new EntityNotFoundException("Farm not found"));
            if (farm.getImage() != null) {
                deleteEntityImage(entityId, entity, farm.getImage().getUrl());
            }
            media = uploadMedia(file, entity);
            farm.setImage(media);
            return farmRepository.save(farm);
        } else if ("account".equalsIgnoreCase(entity)) {
            Account account = accountRepository.findById(entityId)
                    .orElseThrow(() -> new EntityNotFoundException("Account not found"));
            if (account.getProfileImg() != null) {
                deleteEntityImage(entityId, entity, account.getProfileImg().getUrl());
            }
            media = uploadMedia(file, entity);
            account.setProfileImg(media);
            return accountRepository.save(account);
        } else if ("fish".equals(entity)) {
            Fish fish = fishRepository.findById(entityId)
                    .orElseThrow(() -> new EntityNotFoundException("Fish not found"));
            if (fish.getImage() != null) {
                deleteEntityImage(entityId, entity, fish.getImage().getUrl());
            }
            media = uploadMedia(file, entity);
            fish.setImage(media);
            return fishRepository.save(fish);
        } else if ("fish_pack".equals(entity)) {
            FishPack fishPack = fishPackRepository.findById(entityId)
                    .orElseThrow(() -> new EntityNotFoundException("Fish Pack not found"));
            if (fishPack.getImage() != null) {
                deleteEntityImage(entityId, entity, fishPack.getImage().getUrl());
            }
            media = uploadMedia(file, entity);
            fishPack.setImage(media);
            return fishPackRepository.save(fishPack);
        } else {
            throw new IllegalArgumentException("Unsupported entity type: " + entity);
        }
    }

    public void deleteEntityImage(String entityId, String entity, String mediaUrl) {
        Media media;
        if ("farm".equals(entity)) {
            Farm farm = farmRepository.findById(entityId)
                    .orElseThrow(() -> new EntityNotFoundException("Farm not found"));
            media = mediaRepository.findByUrl(mediaUrl)
                    .orElseThrow(() -> new EntityNotFoundException("Media not found"));
            farm.setImage(null);
            farmRepository.save(farm);
        } else if ("account".equals(entity)) {
            Account account = accountRepository.findById(entityId)
                    .orElseThrow(() -> new EntityNotFoundException("Account not found"));
            media = mediaRepository.findByUrl(mediaUrl)
                    .orElseThrow(() -> new EntityNotFoundException("Media not found"));
            account.setProfileImg(null);
            accountRepository.save(account);
        } else if ("fish".equals(entity)) {
            Fish fish = fishRepository.findById(entityId)
                    .orElseThrow(() -> new EntityNotFoundException("Fish not found"));
            media = mediaRepository.findByUrl(mediaUrl)
                    .orElseThrow(() -> new EntityNotFoundException("Media not found"));
            fish.setImage(null);
            fishRepository.save(fish);
        } else if ("fish_pack".equals(entity)) {
            FishPack fishPack = fishPackRepository.findById(entityId)
                    .orElseThrow(() -> new EntityNotFoundException("Fish Pack not found"));
            media = mediaRepository.findByUrl(mediaUrl)
                    .orElseThrow(() -> new EntityNotFoundException("Media not found"));
            fishPack.setImage(null);
            fishPackRepository.save(fishPack);
        } else {
            throw new IllegalArgumentException("Unsupported entity type");
        }
        mediaRepository.delete(media);
        s3Client.deleteObject(bucketName, entity + "/" + media.getName());
    }

//    private static final String MEDIA_FOLDER = "D:\\Upload\\medias\\";

//    private String getFolderPathForEntity(String entity) {
//        switch (entity) {
//            case "farm":
//                return MEDIA_FOLDER + "farm\\";
//            case "account":
//                return MEDIA_FOLDER + "account\\";
//            case "fish":
//                return MEDIA_FOLDER + "fish\\";
//            case "fish_pack":
//                return MEDIA_FOLDER + "fish_pack\\";
//            default:
//                throw new RuntimeException("Unknown entity type");
//        }
//    }
//
//    public Media uploadMedia(MultipartFile file, String entity) throws IOException {
//        String folderPath = getFolderPathForEntity(entity);
//        File uploadFolder = new File(folderPath);
//        if (!uploadFolder.exists()) {
//            uploadFolder.mkdirs();
//        }
//
//        String originalFileName = file.getOriginalFilename();
//        if (originalFileName == null || originalFileName.isEmpty()) {
//            throw new IOException("File name is missing");
//        }
//        Path filePath = Paths.get(folderPath + originalFileName);
//        int count = 1;
//        while (Files.exists(filePath)) {
//            String newFileName = originalFileName.substring(0, originalFileName.lastIndexOf('.')) +
//                    "_" + count++ + originalFileName.substring(originalFileName.lastIndexOf('.'));
//            filePath = Paths.get(folderPath + newFileName);
//        }
//        Files.write(filePath, file.getBytes());
//
//        Media media = new Media();
//        media.setId(generateMediaId());
//        media.setName(filePath.getFileName().toString()); // Save the new file name
//        media.setType(file.getContentType());
//        String publicUrl = "http://localhost:8080/media/" + entity + "/" + filePath.getFileName().toString();
//        media.setUrl(publicUrl);
//
//        return mediaRepository.save(media);
//    }

//    public Farm uploadFarmImage(String farmId, MultipartFile file) throws IOException {
//        Farm farm = farmRepository.findById(farmId).orElseThrow(() -> new RuntimeException("Farm not found"));
//        Media media = uploadMedia(file, "farm");
//        farm.setImage(media);
//        return farmRepository.save(farm);
//    }
//
//    public Account uploadAccountImage(String accountId, MultipartFile file) throws IOException {
//        Account account = accountRepository.findById(accountId).orElseThrow(() -> new RuntimeException("Account not found"));
//        Media media = uploadMedia(file, "account");
//        account.setProfileImg(media);
//        return accountRepository.save(account);
//    }
//
//    public Fish uploadFishImage(String fishId, MultipartFile file) throws IOException {
//        Fish fish = fishRepository.findById(fishId)
//                .orElseThrow(() -> new RuntimeException("Fish not found"));
//        Media media = uploadMedia(file, "fish");
//        fish.getMedias().add(media);
//        return fishRepository.save(fish);
//    }
//
//    public FishPack uploadFishPackImage(String fishPackId, MultipartFile file) throws IOException {
//        FishPack fishPack = fishPackRepository.findById(fishPackId)
//                .orElseThrow(() -> new EntityNotFoundException("Fish Pack not found"));
//        Media media = uploadMedia(file, "fish_pack");
//        fishPack.getMedias().add(media);
//        return fishPackRepository.save(fishPack);
//    }

//    public ResponseEntity<Resource> getMedia(String entity, String filename) {
//        try {
//            String folderPath = getFolderPathForEntity(entity);
//            Media media = mediaRepository.findByUrl("http://localhost:8080/media/" + entity + "/" + filename)
//                    .orElseThrow(() -> new EntityNotFoundException("Media not found"));
//
//            Path filePath = Paths.get(folderPath + filename);
//            Resource resource = new UrlResource(filePath.toUri());
//
//            if (resource.exists() || resource.isReadable()) {
//                return ResponseEntity.ok()
//                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
//                        .contentType(MediaType.parseMediaType(media.getType()))
//                        .body(resource);
//            } else {
//                throw new RuntimeException("Could not read the file!");
//            }
//        } catch (MalformedURLException e) {
//            throw new RuntimeException("Error: " + e.getMessage());
//        }
//    }

    private String generateMediaId() {
        String lastMediaId = mediaRepository.findTopByOrderByIdDesc()
                .map(Media::getId)
                .orElse("ME0000");
        int nextId = Integer.parseInt(lastMediaId.substring(2)) + 1;
        return String.format("ME%04d", nextId);
    }
}

