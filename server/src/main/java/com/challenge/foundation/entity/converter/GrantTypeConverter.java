package com.challenge.foundation.entity.converter;

import com.challenge.foundation.entity.type.EGrantType;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.stream.Stream;

@Converter(autoApply = true)
public class GrantTypeConverter implements AttributeConverter<EGrantType, String> {

    @Override
    public String convertToDatabaseColumn(EGrantType grantType) {
        if (grantType == null) {
            return null;
        }
        return grantType.getValue();
    }

    @Override
    public EGrantType convertToEntityAttribute(String value) {
        if (value == null) {
            return null;
        }

        return Stream.of(EGrantType.values())
                .filter(c -> c.getValue().equals(value))
                .findFirst()
                .orElseThrow(IllegalArgumentException::new);
    }
}
