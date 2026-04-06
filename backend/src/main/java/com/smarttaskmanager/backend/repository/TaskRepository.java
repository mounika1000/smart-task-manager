package com.smarttaskmanager.backend.repository;

import com.smarttaskmanager.backend.entity.Task;
import com.smarttaskmanager.backend.entity.TaskStatus;
import com.smarttaskmanager.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUser(User user);
    Page<Task> findByUser(User user, Pageable pageable);
    Page<Task> findByUserAndStatus(User user, TaskStatus status, Pageable pageable);
    List<Task> findByUserAndStatus(User user, TaskStatus status);
    List<Task> findByUserAndTitleContainingIgnoreCase(User user, String keyword);
    long countByUser(User user);
    long countByUserAndStatus(User user, TaskStatus status);

    Optional<Task> findByIdAndUser(Long id, User user);
}
