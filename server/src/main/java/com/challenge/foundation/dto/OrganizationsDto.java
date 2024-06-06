package com.challenge.foundation.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Builder
@Data
public class OrganizationsDto {

    private List<OrganizationDto> organizations;
    private int count;

}
