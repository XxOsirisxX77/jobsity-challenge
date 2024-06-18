package com.challenge.foundation.entity;

import com.challenge.foundation.entity.type.EGrantType;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@ToString(exclude = {"organization"})
@Entity
public class OrganizationDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonManagedReference
    private Organization organization;
    @Column(nullable = false)
    private Double awardedAmount;
    @Column(nullable = false)
    private Date durationEnd;
    @Column(nullable = false)
    private Date durationStart;
    @Column(nullable = false)
    private String grantSubmissionName;
    @Column(nullable = false)
    private EGrantType grantType;
    @Column(nullable = false)
    private Double requestedAmount;
    @Column(nullable = false)
    private String stage;
    @ManyToMany(fetch = FetchType.LAZY)
    private List<Tag> tags;

}
