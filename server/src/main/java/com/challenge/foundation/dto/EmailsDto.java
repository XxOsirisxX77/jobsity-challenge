package com.challenge.foundation.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Builder
@Data
public class EmailsDto {
    private List<EmailDto> emails;
    private Integer count;
}
