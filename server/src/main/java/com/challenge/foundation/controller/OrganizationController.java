package com.challenge.foundation.controller;

import com.challenge.foundation.dto.ErrorDto;
import com.challenge.foundation.dto.OrganizationDto;
import com.challenge.foundation.dto.OrganizationsDto;
import com.challenge.foundation.service.OrganizationService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/v1/organization")
public class OrganizationController {

    private final OrganizationService organizationService;

    @PostMapping
    public ResponseEntity<?> createOrganization(@RequestBody OrganizationDto organization) {
        try {
            OrganizationDto organizationDto = organizationService.createOrganization(organization);
            return ResponseEntity.ok().body(organizationDto);
        } catch (Exception e) {
            return new ResponseEntity<>(ErrorDto.builder().message(e.getMessage()).build(), HttpStatus.CONFLICT);
        }
    }

    @PostMapping("/import")
    public ResponseEntity<?> importOrganizations(@RequestBody List<OrganizationDto> organizationsDto) {
        try {
            List<OrganizationDto> importedOrganizations = organizationService.importOrganizations(organizationsDto);
            return ResponseEntity.ok().body(importedOrganizations);
        } catch (Exception e) {
            return new ResponseEntity<>(ErrorDto.builder().message(e.getMessage()).build(), HttpStatus.CONFLICT);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<OrganizationsDto> getOrganizations(@RequestParam Optional<Integer> page) {
        int currentPage = page.orElse(1);
        return ResponseEntity.ok().body(organizationService.getAllOrganizations(currentPage));
    }
}
