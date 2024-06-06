package com.challenge.foundation.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class EmailDto {
    private String sender;
    private String recipient;
    private String subject;
    private String body;
}
