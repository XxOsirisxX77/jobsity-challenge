package com.challenge.foundation.mail;

import com.challenge.foundation.entity.Email;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

@PropertySource("classpath:mail.properties")
@NoArgsConstructor
@Data
@Component
public class MailClient {

    @Value("${mail.sender}")
    private String sender;

    public void send (Email email) {
        email.setSender(sender);
    }
}
