package com.Ecommerce.service;

import org.springframework.core.io.Resource;

public interface FileService {
     Resource loadAvatarAsResource(String filename);

    Resource loadImageProduct(String fileName);
}
