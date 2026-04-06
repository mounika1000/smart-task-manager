package com.smarttaskmanager.backend.service;

import com.smarttaskmanager.backend.dto.PaginatedTaskResponse;
import com.smarttaskmanager.backend.dto.TaskRequest;
import com.smarttaskmanager.backend.dto.TaskResponse;
import com.smarttaskmanager.backend.dto.TaskStatsResponse;
import com.smarttaskmanager.backend.entity.Priority;
import com.smarttaskmanager.backend.entity.Task;
import com.smarttaskmanager.backend.entity.TaskStatus;
import com.smarttaskmanager.backend.entity.User;
import com.smarttaskmanager.backend.repository.TaskRepository;
import com.smarttaskmanager.backend.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public TaskResponse createTask(TaskRequest request, String email) {
        User user = getUserByEmail(email);

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus() == null ? TaskStatus.PENDING : request.getStatus());
        task.setPriority(request.getPriority() == null ? Priority.MEDIUM : request.getPriority());
        task.setDueDate(request.getDueDate());
        task.setUser(user);

        Task savedTask = taskRepository.save(task);
        return toResponse(savedTask);
    }

    public PaginatedTaskResponse getAllTasks(String email, TaskStatus status, Pageable pageable) {
        User user = getUserByEmail(email);
        Page<Task> taskPage;
        // If a status is passed, filter in DB itself.
        if (status == null) {
            taskPage = taskRepository.findByUser(user, pageable);
        } else {
            taskPage = taskRepository.findByUserAndStatus(user, status, pageable);
        }

        List<TaskResponse> content = taskPage.getContent().stream()
                .map(this::toResponse)
                .toList();

        return new PaginatedTaskResponse(content, taskPage.getTotalPages(), taskPage.getTotalElements());
    }

    public List<TaskResponse> searchTasksByTitle(String email, String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            throw new IllegalArgumentException("Keyword is required");
        }
        User user = getUserByEmail(email);
        return taskRepository.findByUserAndTitleContainingIgnoreCase(user, keyword.trim()).stream()
                .map(this::toResponse)
                .toList();
    }

    public TaskResponse updateTask(Long taskId, TaskRequest request, String email) {
        User user = getUserByEmail(email);
        Task task = taskRepository.findByIdAndUser(taskId, user)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus() == null ? TaskStatus.PENDING : request.getStatus());
        task.setPriority(request.getPriority() == null ? Priority.MEDIUM : request.getPriority());
        task.setDueDate(request.getDueDate());

        Task updatedTask = taskRepository.save(task);
        return toResponse(updatedTask);
    }

    public void deleteTask(Long taskId, String email) {
        User user = getUserByEmail(email);
        Task task = taskRepository.findByIdAndUser(taskId, user)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        taskRepository.delete(task);
    }

    public TaskStatsResponse getTaskStats(String email) {
        User user = getUserByEmail(email);
        long totalTasks = taskRepository.countByUser(user);
        long completedTasks = taskRepository.countByUserAndStatus(user, TaskStatus.COMPLETED);
        long pendingTasks = taskRepository.countByUserAndStatus(user, TaskStatus.PENDING);
        return new TaskStatsResponse(totalTasks, completedTasks, pendingTasks);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private TaskResponse toResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getPriority(),
                task.getDueDate()
        );
    }
}
