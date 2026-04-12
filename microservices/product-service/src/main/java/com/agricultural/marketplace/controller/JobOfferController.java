package com.agricultural.marketplace.controller;

import com.agricultural.marketplace.model.JobOffer;
import com.agricultural.marketplace.model.User;
import com.agricultural.marketplace.repository.JobOfferRepository;
import com.agricultural.marketplace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobOfferController {
    
    @Autowired
    private JobOfferRepository jobOfferRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Get all active job offers (public)
    @GetMapping
    public ResponseEntity<?> getAllActiveJobs() {
        try {
            List<JobOffer> jobs = jobOfferRepository.findByStatusAndApplicationDeadlineAfter(
                JobOffer.JobStatus.OPEN, 
                LocalDateTime.now()
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("jobs", jobs);
            response.put("count", jobs.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error fetching jobs: " + e.getMessage()));
        }
    }
    
    // Get job by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getJobById(@PathVariable String id) {
        try {
            Optional<JobOffer> job = jobOfferRepository.findById(id);
            
            if (job.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "Job not found"));
            }
            
            return ResponseEntity.ok(Map.of("success", true, "job", job.get()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error fetching job: " + e.getMessage()));
        }
    }
    
    // Get farmer's job offers
    @GetMapping("/my-offers")
    public ResponseEntity<?> getMyJobOffers(Authentication authentication) {
        try {
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "User not found"));
            }
            
            User user = userOpt.get();
            List<JobOffer> jobs = jobOfferRepository.findByFarmerId(user.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("jobs", jobs);
            response.put("count", jobs.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error fetching offers: " + e.getMessage()));
        }
    }
    
    // Create new job offer (farmer only)
    @PostMapping
    public ResponseEntity<?> createJobOffer(@RequestBody JobOffer jobOffer,Authentication authentication) {
        try {
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "User not found"));
            }
            
            User user = userOpt.get();
            
            if (user.getRole() != User.UserRole.FARMER) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("success", false, "message", "Only farmers can create job offers"));
            }
            
            jobOffer.setFarmerId(user.getId());
            jobOffer.setFarmerName(user.getFirstName() + " " + user.getLastName());
            jobOffer.setStatus(JobOffer.JobStatus.OPEN);
            jobOffer.setCreatedAt(LocalDateTime.now());
            jobOffer.setUpdatedAt(LocalDateTime.now());
            
            JobOffer savedJob = jobOfferRepository.save(jobOffer);
            
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("success", true, "message", "Job offer created successfully", "job", savedJob));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error creating job offer: " + e.getMessage()));
        }
    }
    
    // Update job offer
    @PutMapping("/{id}")
    public ResponseEntity<?> updateJobOffer(@PathVariable String id, @RequestBody JobOffer jobOffer, Authentication authentication) {
        try {
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            Optional<JobOffer> existingJobOpt = jobOfferRepository.findById(id);
            
            if (userOpt.isEmpty() || existingJobOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "User or job not found"));
            }
            
            User user = userOpt.get();
            JobOffer existingJob = existingJobOpt.get();
            
            if (!existingJob.getFarmerId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("success", false, "message", "You can only update your own job offers"));
            }
            
            existingJob.setTitle(jobOffer.getTitle());
            existingJob.setDescription(jobOffer.getDescription());
            existingJob.setJobType(jobOffer.getJobType());
            existingJob.setContractType(jobOffer.getContractType());
            existingJob.setLocation(jobOffer.getLocation());
            existingJob.setSalaryMin(jobOffer.getSalaryMin());
            existingJob.setSalaryMax(jobOffer.getSalaryMax());
            existingJob.setRequirements(jobOffer.getRequirements());
            existingJob.setBenefits(jobOffer.getBenefits());
            existingJob.setPositions(jobOffer.getPositions());
            existingJob.setApplicationDeadline(jobOffer.getApplicationDeadline());
            existingJob.setUpdatedAt(LocalDateTime.now());
            
            if (jobOffer.getStatus() != null) {
                existingJob.setStatus(jobOffer.getStatus());
            }
            
            JobOffer updatedJob = jobOfferRepository.save(existingJob);
            
            return ResponseEntity.ok(Map.of("success", true, "message", "Job offer updated successfully", "job", updatedJob));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error updating job offer: " + e.getMessage()));
        }
    }
    
    // Delete job offer
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJobOffer(@PathVariable String id, Authentication authentication) {
        try {
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            Optional<JobOffer> jobOpt = jobOfferRepository.findById(id);
            
            if (userOpt.isEmpty() || jobOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "User or job not found"));
            }
            
            User user = userOpt.get();
            JobOffer job = jobOpt.get();
            
            if (!job.getFarmerId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("success", false, "message", "You can only delete your own job offers"));
            }
            
            jobOfferRepository.deleteById(id);
            
            return ResponseEntity.ok(Map.of("success", true, "message", "Job offer deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error deleting job offer: " + e.getMessage()));
        }
    }
    
    // Apply to job
    @PostMapping("/{id}/apply")
    public ResponseEntity<?> applyToJob(@PathVariable String id, @RequestBody JobOffer.JobApplication application, Authentication authentication) {
        try {
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            Optional<JobOffer> jobOpt = jobOfferRepository.findById(id);
            
            if (userOpt.isEmpty() || jobOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "User or job not found"));
            }
            
            User user = userOpt.get();
            JobOffer job = jobOpt.get();
            
            if (job.getStatus() != JobOffer.JobStatus.OPEN) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", "This job is no longer accepting applications"));
            }
            
            application.setApplicantId(user.getId());
            application.setApplicantName(user.getFirstName() + " " + user.getLastName());
            application.setApplicantEmail(user.getEmail());
            application.setStatus(JobOffer.JobApplication.ApplicationStatus.PENDING);
            application.setAppliedAt(LocalDateTime.now());
            
            job.getApplications().add(application);
            job.setUpdatedAt(LocalDateTime.now());
            
            jobOfferRepository.save(job);
            
            return ResponseEntity.ok(Map.of("success", true, "message", "Application submitted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error submitting application: " + e.getMessage()));
        }
    }
    
    // Update application status (farmer only)
    @PutMapping("/{jobId}/applications/{applicationIndex}")
    public ResponseEntity<?> updateApplicationStatus(
        @PathVariable String jobId, 
        @PathVariable int applicationIndex,
        @RequestBody Map<String, String> statusUpdate,
        Authentication authentication
    ) {
        try {
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            Optional<JobOffer> jobOpt = jobOfferRepository.findById(jobId);
            
            if (userOpt.isEmpty() || jobOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "User or job not found"));
            }
            
            User user = userOpt.get();
            JobOffer job = jobOpt.get();
            
            if (!job.getFarmerId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("success", false, "message", "You can only manage applications for your own jobs"));
            }
            
            if (applicationIndex < 0 || applicationIndex >= job.getApplications().size()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", "Invalid application index"));
            }
            
            JobOffer.JobApplication application = job.getApplications().get(applicationIndex);
            String newStatus = statusUpdate.get("status");
            
            if (newStatus != null) {
                application.setStatus(JobOffer.JobApplication.ApplicationStatus.valueOf(newStatus));
            }
            
            if (statusUpdate.containsKey("notes")) {
                application.setNotes(statusUpdate.get("notes"));
            }
            
            job.setUpdatedAt(LocalDateTime.now());
            jobOfferRepository.save(job);
            
            return ResponseEntity.ok(Map.of("success", true, "message", "Application status updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error updating application: " + e.getMessage()));
        }
    }
}
