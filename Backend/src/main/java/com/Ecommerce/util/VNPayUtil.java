package com.Ecommerce.util;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

public class VNPayUtil {

    public static String hmacSHA512(String key, String data) {
        try {
            Mac hmac512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac512.init(secretKey);
            byte[] bytes = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : bytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("Cannot create HMAC hash", e);
        }
    }

    public static String hashAllFields(Map<String, String> fields) {
        List<String> sortedKeys = new ArrayList<>(fields.keySet());
        Collections.sort(sortedKeys);
        StringBuilder sb = new StringBuilder();
        for (String key : sortedKeys) {
            String value = fields.get(key);
            if (value != null && value.length() > 0) {
                sb.append(key).append("=").append(value);
                sb.append("&");
            }
        }
        if (sb.length() > 0) sb.deleteCharAt(sb.length() - 1); // remove last '&'
        return sb.toString();
    }
}
