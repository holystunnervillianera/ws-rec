    }
  }

  /**
   * Wait for task completion
   */
  private waitForTaskCompletion(taskId: string): Promise<void> {
    return new Promise((resolve) => {
      const checkCompletion = () => {
        const task = this.taskQueue.find((t) => t.id === taskId);
        if (task && (task.status === "completed" || task.status === "failed")) {
          resolve();
        } else {
          setTimeout(checkCompletion, 100);
        }
      };
      checkCompletion();
    });
  }

  /**
   * Get all agents
   */
  getAgents(): BaseAgent[] {
    return Array.from(this.agents.values());
  }

  /**
   * Get agent by role
   */
  getAgent(role: AgentRole): BaseAgent | undefined {
    return this.agents.get(role);
  }

  /**
   * Get all agent states
   */
  getAllAgentStates() {
    const states: Record<AgentRole, any> = {} as any;
    this.agents.forEach((agent, role) => {
      states[role] = agent.getState();
    });
    return states;
  }

  /**
   * Get all agent reports
   */
  getAllAgentReports() {
    const reports: any[] = [];
    this.agents.forEach((agent) => {
      reports.push(agent.generateReport());
    });
    return reports;
  }

  /**
   * Get message history
   */
  getMessageHistory(limit: number = 100): AgentMessage[] {
    return this.messageQueue.slice(-limit);
  }

  /**
   * Get user messages
   */
  getUserMessages(limit: number = 100): AgentMessage[] {
    return this.userMessages.slice(-limit);
  }

  /**
   * Get task queue
   */
  getTaskQueue(): AgentTask[] {
    return [...this.taskQueue];
  }

  /**
   * Get workflow
   */
  getWorkflow(workflowId: string): Workflow | undefined {
    return this.workflows.get(workflowId);
  }

  /**
   * Get all workflows
   */
  getAllWorkflows(): Workflow[] {
    return Array.from(this.workflows.values());
  }

  /**
   * Update task status
   */
  updateTaskStatus(taskId: string, status: TaskStatus): void {
    const task = this.taskQueue.find((t) => t.id === taskId);
    if (task) {
      task.status = status;
      this.emit("task-status-updated", { taskId, status });
    }