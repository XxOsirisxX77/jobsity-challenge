package com.challenge.foundation.repository;

import com.challenge.foundation.entity.Email;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailRepository extends PagingAndSortingRepository<Email, Integer>, JpaRepository<Email, Integer> {

}
