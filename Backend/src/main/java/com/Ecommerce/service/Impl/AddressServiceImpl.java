package com.Ecommerce.service.Impl;


import com.Ecommerce.dto.request.Address.AddressCreateRequest;
import com.Ecommerce.dto.request.Address.AddressUpdateRequest;
import com.Ecommerce.dto.response.Address.AddressResponse;
import com.Ecommerce.entity.Address;
import com.Ecommerce.entity.User;
import com.Ecommerce.exception.ResourceNotFoundException;
import com.Ecommerce.repository.AddressRepository;
import com.Ecommerce.repository.UserRepository;
import com.Ecommerce.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressServiceImpl(AddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<AddressResponse> getAddressesByUser(String username) {
        // Lấy người dùng từ username (có thể thay bằng tìm từ UserDetails nếu muốn)
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Lấy tất cả địa chỉ của người dùng đó
        List<Address> addresses = addressRepository.findByUser(user);

        // Convert thành response
        return addresses.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public AddressResponse updateAddress(Long addressId, AddressUpdateRequest request, String username) {
        // Lấy người dùng từ username (hoặc có thể từ userDetails)
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        // Kiểm tra xem địa chỉ có thuộc về người dùng không
        if (!address.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Address does not belong to the current user");
        }

        // Cập nhật các trường
        if (request.getFullName() != null) address.setFullName(request.getFullName());
        if (request.getPhoneNumber() != null) address.setPhoneNumber(request.getPhoneNumber());
        if (request.getAddressLine() != null) address.setAddressLine(request.getAddressLine());
        if (request.getWard() != null) address.setWard(request.getWard());
        if (request.getDistrict() != null) address.setDistrict(request.getDistrict());
        if (request.getProvince() != null) address.setProvince(request.getProvince());
        if (request.getCountry() != null) address.setCountry(request.getCountry());
        if (request.getPostalCode() != null) address.setPostalCode(request.getPostalCode());
        if (request.getDefault() != null) address.setDefault(request.getDefault());
        if (request.getType() != null) address.setType(request.getType());

        // Lưu địa chỉ đã cập nhật
        addressRepository.save(address);

        // Return the updated address as a response
        return mapToResponse(address);
    }

    @Override
    public AddressResponse createAddress(AddressCreateRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Address address = new Address();
        // Map fields from request to entity
        address.setFullName(request.getFullName());
        address.setPhoneNumber(request.getPhoneNumber());
        address.setAddressLine(request.getAddressLine());
        address.setWard(request.getWard());
        address.setDistrict(request.getDistrict());
        address.setProvince(request.getProvince());
        address.setCountry(request.getCountry());
        address.setPostalCode(request.getPostalCode());
        address.setDefault(request.getDefault() != null ? request.getDefault() : false);
        address.setType(request.getType() != null ? request.getType() : Address.AddressType.HOME); // Default to HOME if not provided
        address.setUser(user);

        Address savedAddress = addressRepository.save(address);

        return mapToResponse(savedAddress);
    }

    @Override
    public void deleteAddress(Long addressId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        // Kiểm tra xem địa chỉ có thuộc về người dùng không
        if (!address.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Address does not belong to the current user");
        }

        addressRepository.delete(address);
    }

    // Map Address entity to AddressResponse DTO
    private AddressResponse mapToResponse(Address address) {
        AddressResponse response = new AddressResponse();
        response.setId(address.getId());
        response.setAddressLine(address.getAddressLine());
        response.setWard(address.getWard());
        response.setDistrict(address.getDistrict());
        response.setProvince(address.getProvince());
        response.setCountry(address.getCountry());
        response.setPostalCode(address.getPostalCode());
        response.setDefault(address.getDefault());
        response.setType(address.getType().name());
        return response;
    }
}
