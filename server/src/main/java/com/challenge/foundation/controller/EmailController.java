package com.challenge.foundation.controller;

import com.challenge.foundation.dto.EmailsDto;
import com.challenge.foundation.entity.Email;
import com.challenge.foundation.service.EmailService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/v1/email")
public class EmailController {

    private final EmailService emailService;

    @PostMapping
    public ResponseEntity<Void> sendEmail(@RequestBody Email email) {
        emailService.sendEmail(email);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<EmailsDto> viewAllEmail(@RequestParam Optional<Integer> page) {
        int currentPage = page.orElse(1);
        return new ResponseEntity<>(emailService.viewAllEmails(currentPage), HttpStatus.OK);
    }

}
