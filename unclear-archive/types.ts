export interface AgentState {
  role: AgentRole;
  status: AgentStatus;
  lastActive: Date;
  tasksCompleted: number;
  tasksFailed: number;
  currentTask?: string;
  capabilities: string[];
  integrations: string[];
  configuration: Record<string, any>;
}

/**
 * Agent report - periodic status update
 */
export interface AgentReport {
  id: string;
  agentRole: AgentRole;
  timestamp: Date;
  status: AgentStatus;
  tasksCompleted: number;
  tasksFailed: number;
  metrics: Record<string, number>;
  insights: string[];
  recommendations: string[];
  alerts: string[];
}

/**
 * Workflow - sequence of tasks across agents
 */
export interface Workflow {
  id: string;
  name: string;
  description: string;
  tasks: AgentTask[];
  status: TaskStatus;
  createdAt: Date;
  completedAt?: Date;
  createdBy: AgentRole | "user";
  triggerCondition?: string;
  automationLevel: "manual" | "semi-auto" | "fully-auto";
}

/**
 * Integration configuration
 */
export interface Integration {
  id: string;
  name: string;
  type: string; // e.g., "social-media", "email", "analytics"
  provider: string; // e.g., "twitter", "sendgrid", "mixpanel"
  credentials: Record<string, string>; // Encrypted
  config: Record<string, any>;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  agentsUsing: AgentRole[];
}

/**
 * Command center configuration
 */
export interface CommandCenterConfig {
  id: string;
  userId: number;
  layout: "dashboard" | "kanban" | "timeline" | "custom";
  widgets: DashboardWidget[];
  theme: "light" | "dark" | "auto";
  autoRefreshInterval: number; // milliseconds