package com.agricultural.marketplace.repository;

import com.agricultural.marketplace.model.JobOffer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface JobOfferRepository extends MongoRepository<JobOffer, String> {
    
    List<JobOffer> findByFarmerId(String farmerId);
    
    List<JobOffer> findByStatus(JobOffer.JobStatus status);
    
    List<JobOffer> findByStatusAndApplicationDeadlineAfter(JobOffer.JobStatus status, LocalDateTime date);
    
    List<JobOffer> findByJobTypeAndStatus(JobOffer.JobType jobType, JobOffer.JobStatus status);
    
    List<JobOffer> findByLocationContainingIgnoreCaseAndStatus(String location, JobOffer.JobStatus status);
}
