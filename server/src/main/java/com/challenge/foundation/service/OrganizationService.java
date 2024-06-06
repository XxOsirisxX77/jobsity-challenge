package com.challenge.foundation.service;

import com.challenge.foundation.dto.OrganizationDto;
import com.challenge.foundation.dto.OrganizationsDto;
import com.challenge.foundation.entity.Organization;
import com.challenge.foundation.exception.AlreadyExistsException;
import com.challenge.foundation.repository.OrganizationRepository;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class OrganizationService {

    private final ModelMapper modelMapper;
    private final OrganizationRepository organizationRepository;

    public OrganizationDto createOrganization(Organization organization) throws AlreadyExistsException {
        organizationRepository.findByEmail(organization.getEmail()).ifPresent(o -> { throw new AlreadyExistsException("Organization already registered."); });
        Organization savedOrganization =  organizationRepository.save(organization);
        return modelMapper.map(savedOrganization, OrganizationDto.class);
    }

    public List<OrganizationDto> getAllOrganizations() {
        return organizationRepository.findAll().stream().map(organization -> modelMapper.map(organization, OrganizationDto.class)).collect(Collectors.toList());
    }

    public OrganizationsDto getAllOrganizations(int page) {
        Page<Organization> allOrganizations = organizationRepository.findAll(PageRequest.of(page - 1, 5));
        List<OrganizationDto> organizations = allOrganizations.stream().map(organization -> modelMapper.map(organization, OrganizationDto.class)).collect(Collectors.toList());
        return OrganizationsDto.builder()
                .organizations(organizations)
                .count(organizationRepository.findAll().size())
                .build();
    }
}
