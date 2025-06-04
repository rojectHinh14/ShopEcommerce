package com.Ecommerce.service;

import com.Ecommerce.dto.request.Address.AddressUpdateRequest;
import com.Ecommerce.dto.response.Address.AddressResponse;

import java.util.List;
import com.Ecommerce.dto.request.Address.AddressCreateRequest;

public interface AddressService {
    public List<AddressResponse> getAddressesByUser(String username);
    public AddressResponse updateAddress(Long addressId, AddressUpdateRequest request, String username);
    public AddressResponse createAddress(AddressCreateRequest request, String username);
    public void deleteAddress(Long addressId, String username);
}
