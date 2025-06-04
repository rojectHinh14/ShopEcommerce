package com.Ecommerce.service.Impl;

import com.Ecommerce.service.FileService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileNotFoundException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileServiceImpl implements FileService {
    @Value("${storage.root.folder.avatar}")
    private String ROOT_UPLOAD_DIR_AVATAR;
    public static final String DEFAULT_FILE_NAME="default.png";

    @Value("${storage.root.folder.product}")
    private String rootFolderProduct;

    public Resource loadAvatarAsResource(String filename) {
        try {
            Path path = Paths.get(ROOT_UPLOAD_DIR_AVATAR, filename);
            System.out.println("🔍 Avatar path: " + path.toAbsolutePath());

            File file = path.toFile();
            if (file.exists()) {
                return new FileSystemResource(file);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        Path fallbackPath = Paths.get(ROOT_UPLOAD_DIR_AVATAR, DEFAULT_FILE_NAME);
        System.out.println("⚠️ Fallback avatar: " + fallbackPath.toAbsolutePath());

        return new FileSystemResource(fallbackPath.toFile());
    }


    @Override
    public Resource loadImageProduct(String fileName) {
        try {
            Path file = Paths.get(rootFolderProduct).resolve(fileName);
            Resource resource = new UrlResource(file.toUri());
            System.out.println("🔍 Đang tìm file tại: " + file.toAbsolutePath());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new FileNotFoundException("File không tồn tại hoặc không thể đọc: " + fileName);
            }
        } catch (MalformedURLException | FileNotFoundException e) {
            e.printStackTrace();
            // Trả về ảnh mặc định nếu không tìm thấy
            Path defaultFile = Paths.get(rootFolderProduct).resolve("default.jpg");
            System.out.println("⚠️ Fallback sang ảnh mặc định: " + defaultFile.toAbsolutePath());
            return new FileSystemResource(defaultFile.toFile());
        }
    }
}
