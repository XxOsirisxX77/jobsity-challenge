package com.challenge.foundation.service;

import com.challenge.foundation.dto.EmailDto;
import com.challenge.foundation.dto.EmailsDto;
import com.challenge.foundation.entity.Email;
import com.challenge.foundation.mail.MailClient;
import com.challenge.foundation.repository.EmailRepository;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class EmailService {

    private final ModelMapper modelMapper;
    private final EmailRepository emailRepository;
    private final OrganizationService organizationService;
    private final MailClient mailClient;

    public void sendEmail(Email email) {
        organizationService.getAllOrganizations().forEach(organization -> {
            Email emailToSend = new Email();
            modelMapper.map(email, emailToSend);

            String body = emailToSend.getBody();
            body = body.replaceAll("\\{ name }", organization.getName());
            body = body.replaceAll("\\{ address }", organization.getAddress());
            emailToSend.setBody(body);
            emailToSend.setRecipient(organization.getEmail());

            mailClient.send(emailToSend);
            emailRepository.save(emailToSend);
        });
    }

    public EmailsDto viewAllEmails(int page) {
        Page<Email> allEmails = emailRepository.findAll(PageRequest.of(page - 1, 10));
        List<EmailDto> emails = allEmails.stream().map(email -> modelMapper.map(email, EmailDto.class)).collect(Collectors.toList());
        return EmailsDto.builder()
                        .emails(emails)
                        .count(emailRepository.findAll().size())
                        .build();
    }

}
