package com.Ecommerce.dto.request;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.experimental.FieldDefaults;


@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class ExchangeTokenRequest {
    String code;
    String clientId;
    String clientSecret;
    String redirectUri;
    String grantType;
    public  ExchangeTokenRequest(){}

    public ExchangeTokenRequest(String grantType, String redirectUri, String clientSecret, String clientId, String code) {
        this.grantType = grantType;
        this.redirectUri = redirectUri;
        this.clientSecret = clientSecret;
        this.clientId = clientId;
        this.code = code;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getClientSecret() {
        return clientSecret;
    }

    public void setClientSecret(String clientSecret) {
        this.clientSecret = clientSecret;
    }

    public String getRedirectUri() {
        return redirectUri;
    }

    public void setRedirectUri(String redirectUri) {
        this.redirectUri = redirectUri;
    }

    public String getGrantType() {
        return grantType;
    }

    public void setGrantType(String grantType) {
        this.grantType = grantType;
    }
}