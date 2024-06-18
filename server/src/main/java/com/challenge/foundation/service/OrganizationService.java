package com.challenge.foundation.service;

import com.challenge.foundation.dto.OrganizationDetailDto;
import com.challenge.foundation.dto.OrganizationDto;
import com.challenge.foundation.dto.OrganizationsDto;
import com.challenge.foundation.dto.TagDto;
import com.challenge.foundation.entity.Organization;
import com.challenge.foundation.entity.OrganizationDetail;
import com.challenge.foundation.exception.AlreadyExistsException;
import com.challenge.foundation.repository.OrganizationDetailRepository;
import com.challenge.foundation.repository.OrganizationRepository;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class OrganizationService {

    private final ModelMapper modelMapper;
    private final OrganizationRepository organizationRepository;
    private final OrganizationDetailRepository organizationDetailRepository;
    private final TagService tagService;

    public OrganizationDto createOrganization(OrganizationDto organization) throws AlreadyExistsException {
        organizationRepository.findByEmail(organization.getEmail()).ifPresent(o -> { throw new AlreadyExistsException("Organization already registered."); });
        Organization savedOrganization = organizationRepository.save(modelMapper.map(organization, Organization.class));
        return modelMapper.map(savedOrganization, OrganizationDto.class);
    }

    public List<OrganizationDto> getAllOrganizations() {
        return organizationRepository.findAll().stream().map(organization -> modelMapper.map(organization, OrganizationDto.class)).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrganizationsDto getAllOrganizations(int page) {

        Page<Organization> allOrganizations = organizationRepository.findAll(PageRequest.of(page - 1, 5));
        List<OrganizationDto> organizations = allOrganizations.stream()
                .map(organization -> modelMapper.map(organization, OrganizationDto.class))
                .collect(Collectors.toList());

        return OrganizationsDto.builder()
                .organizations(organizations)
                .count(organizationRepository.findAll().size())
                .build();
    }


    public List<OrganizationDto> importOrganizations(List<OrganizationDto> organizationsDto) throws AlreadyExistsException {
        List<OrganizationDto> organizations = new ArrayList<>();

        organizationsDto.forEach(organizationDto -> {
            Organization storedOrganization = organizationRepository.findByName(organizationDto.getName()).orElse(null);
            if (storedOrganization == null) {
                storedOrganization = organizationRepository.save(modelMapper.map(organizationDto, Organization.class));
            }

            Organization finalStoredOrganization = storedOrganization;
            storeOrganizationDetails(organizationDto.getOrganizationDetails(), finalStoredOrganization);
            organizations.add(organizationDto);
        });
        return organizations;
    }

    private void storeOrganizationDetails(List<OrganizationDetailDto> organizationDetails, Organization finalStoredOrganization) {
        organizationDetails.forEach(organizationDetail -> {
            List<TagDto> tags = new ArrayList<>();
            organizationDetail.getTags().forEach(tag -> {
                TagDto newTag = tagService.getTagByName(tag);
                if (newTag == null) {
                    newTag = tagService.createTag(tag);
                }
                tags.add(newTag);
            });
            organizationDetail.setTags(tags);

            OrganizationDetail newOrganizationDetail = modelMapper.map(organizationDetail, OrganizationDetail.class);
            newOrganizationDetail.setOrganization(finalStoredOrganization);

            organizationDetailRepository.save(newOrganizationDetail);
        });
    }
}
