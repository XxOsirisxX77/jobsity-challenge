package com.challenge.foundation.repository;

import com.challenge.foundation.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrganizationRepository extends PagingAndSortingRepository<Organization, Integer>, JpaRepository<Organization, Integer> {

    Optional<Organization> findByEmail(String email);
    Optional<Organization> findByName(String name);
}
