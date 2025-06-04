package com.Ecommerce.controller;

import com.Ecommerce.service.Impl.FileServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("file/")
public class FileController {
    @Autowired
    FileServiceImpl fileService;

    @GetMapping("avatar/{filename}")
    public ResponseEntity<Resource> getAvatar(@PathVariable String filename) {
        Resource file = fileService.loadAvatarAsResource(filename);
        if (file != null) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                    .body(file);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("images-product/{filename}")
    public ResponseEntity<Resource> getImageProduct(@PathVariable String filename) {
        Resource file = fileService.loadImageProduct(filename);
        if (file != null) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                    .body(file);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{filename}")
    public ResponseEntity<Resource> getProductImage(@PathVariable String filename) {
        Resource resource = fileService.loadImageProduct(filename);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(resource);
    }
}
