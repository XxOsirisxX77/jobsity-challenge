package com.challenge.foundation.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ErrorDto {
    private String message;
}
