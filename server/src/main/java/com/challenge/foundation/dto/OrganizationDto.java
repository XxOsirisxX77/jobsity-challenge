package com.challenge.foundation.dto;

import lombok.Data;
import lombok.ToString;

import java.util.List;

@ToString(exclude = {"organizationDetails"})
@Data
public class OrganizationDto {

    private Integer id;
    private String name;
    private String address;
    private String email;
    private List<OrganizationDetailDto> organizationDetails;

}
