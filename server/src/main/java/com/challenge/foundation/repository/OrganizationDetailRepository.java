package com.challenge.foundation.repository;

import com.challenge.foundation.entity.OrganizationDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrganizationDetailRepository extends PagingAndSortingRepository<OrganizationDetail, Integer>, JpaRepository<OrganizationDetail, Integer> {

    List<OrganizationDetail> findByOrganizationId(Integer organizationId);
}
