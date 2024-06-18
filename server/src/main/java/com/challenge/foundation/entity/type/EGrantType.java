package com.challenge.foundation.entity.type;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum EGrantType {
    OPERATING_GRANT("OPERATING_GRANT"),
    PROJECT_GRANT("PROJECT_GRANT");

    private final String value;
}
