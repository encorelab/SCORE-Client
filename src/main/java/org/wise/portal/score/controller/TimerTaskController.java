package org.wise.portal.score.controller;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.wise.portal.score.domain.Task;
import org.wise.portal.score.repository.TaskRepository;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "/api", produces = "application/json;charset=UTF-8")
public class TimerTaskController {

  @Autowired
  private TaskRepository taskRepository;

  public TimerTaskController() {
  }

  @GetMapping("/tasks")
  public List<Task> tasks() {
    return this.taskRepository.findAll();
  }

  /**
   * Creates tasks for a project in batch
   */
  @PostMapping(value = {"/task"})
  protected List<Task> createTasksBatch(HttpServletRequest request, HttpServletResponse response) throws JSONException {
    String runIdString = request.getParameter("runId");
    String periodIdString = request.getParameter("periodId");
    String periodName = request.getParameter("periodName");
    String projectIdString = request.getParameter("projectId");
    String workgroupIdString = request.getParameter("workgroupId");
    String tasksString = request.getParameter("tasks");

    if (tasksString != null && runIdString != null && periodIdString != null && workgroupIdString != null && projectIdString != null) {
      JSONObject nodeVisitJSON = new JSONObject(tasksString);
      JSONArray nodes = nodeVisitJSON.getJSONArray("nodes");
      for (int i = 0; i < nodes.length(); i++) {
        JSONObject n = nodes.getJSONObject(i);
        System.out.println("NODE " + n);
        String activityId = n.getString("id");
        String activityName = n.getString("title");
        Integer duration = n.getInt("duration");
        this.createTask(Long.parseLong(runIdString),
          Long.parseLong(periodIdString),
          periodName,
          Long.parseLong(projectIdString),
          Long.parseLong(workgroupIdString),
          activityId,
          activityName,
          duration);
      }
    }

    return null;
  }

  /**
   * Creates a task
   *
   * @param runId
   * @param periodId
   * @param projectId
   * @param workgroupId
   * @param activityId
   * @param activityName
   * @param duration
   */
  public void createTask(Long runId,
                         Long periodId,
                         String periodName,
                         Long projectId,
                         Long workgroupId,
                         String activityId,
                         String activityName,
                         Integer duration) {
    Optional<Task> found = this.taskRepository.findByRunIdAndPeriodIdAndWorkgroupIdAndActivityId(runId, periodId, workgroupId, activityId);
    if (!found.isPresent()) {
      Task task = Task.builder().runId(runId)
        .complete(false)
        .workgroupId(workgroupId)
        .projectId(projectId)
        .periodName(periodName)
        .periodId(periodId)
        .duration(duration)
        .name(activityName)
        .activityId(activityId).build();
      this.taskRepository.save(task);
    }
  }

  /**
   * Invokes the SCORE Teaching Assistant Tool based on the specified run
   *
   * @param periodName periodName
   * @param runId      ID of the run
   */
  @GetMapping(value = {"/tasks/name/{runId}/{periodName}"})
  protected List<Task> findAllTasksByRunIdAndPeriodName(@PathVariable Long runId,
                                                        @PathVariable String periodName
  ) {
    System.out.println("RunId: " + runId);
    System.out.println("PeriodName: " + periodName);
    if (periodName != null && runId != null) {
      return this.taskRepository.findAllByRunIdAndPeriodName(runId, periodName);
    }
    return null;
  }

  /**
   * Invokes the SCORE Teaching Assistant Tool based on the specified run
   *
   * @param periodId periodId
   * @param runId    ID of the run
   */
  @GetMapping(value = {"/tasks/id/{runId}/{periodId}"})
  protected List<Task> findAllTasksByRunIdAndPeriodId(@PathVariable Long runId,
                                                      @PathVariable Long periodId
  ) {
    System.out.println("RunId: " + runId);
    System.out.println("PeriodId: " + periodId);
    if (periodId != null && runId != null) {
      return this.taskRepository.findAllByRunIdAndPeriodId(runId, periodId);
    }
    return null;
  }

  /**
   *  starts the timer for a task
   *
   * @param workgroupId the group associated with the task
   * @param activityId node
   * @param runId    ID of the run
   *
   */
  @GetMapping(value = {"/tasks/start/{runId}/{workgroupId}/{activityId}"})
  protected List<Task> startTaskTimer(
    @PathVariable String runId,
    @PathVariable String workgroupId,
    @PathVariable String activityId
  ) {
    System.out.println("RunId: " + runId);
    System.out.println("workgroupId: " + workgroupId);
    System.out.println("activityId: " + activityId);

    return null;
  }

  /**
   *  stops the timer for a task
   *
   * @param workgroupId the group associated with the task
   * @param activityId node
   * @param runId    ID of the run
   *
   */
  @GetMapping(value = {"/tasks/stop/{runId}/{workgroupId}/{activityId}"})
  protected List<Task> stopTaskTimer(
    @PathVariable String runId,
    @PathVariable String workgroupId,
    @PathVariable String activityId
  ) {
    System.out.println("RunId: " + runId);
    System.out.println("workgroupId: " + workgroupId);
    System.out.println("activityId: " + activityId);

    return null;
  }
}
