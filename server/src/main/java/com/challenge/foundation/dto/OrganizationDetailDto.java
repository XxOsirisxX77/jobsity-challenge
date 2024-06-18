package com.challenge.foundation.dto;
import com.challenge.foundation.entity.type.EGrantType;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class OrganizationDetailDto {

    private Integer id;
    private Double awardedAmount;
    private Date durationEnd;
    private Date durationStart;
    private String grantSubmissionName;
    private EGrantType grantType;
    private Double requestedAmount;
    private String stage;
    private List<TagDto> tags;

}
