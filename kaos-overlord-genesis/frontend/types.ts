export type ViewState = 'TERMINAL' | 'SWARM' | 'AEGIS' | 'VAULT';

export interface Message {
  id: string;
  role: 'user' | 'system' | 'model';
  content: string;
  timestamp: Date;
}

export interface SwarmTask {
  id: string;
  task: string;
  status: 'Executing' | 'Completed';
  workers: number;
  env: string;
}

export interface SwarmProject {
  id: string;
  name: string;
  managers: Record<string, SwarmTask>;
}

export interface AegisIntercept {
  id: string;
  command: string;
  timestamp: Date;
}

export interface VaultConfig {
  gcp_service_account?: string;
  smtp_user?: string;
  smtp_pass?: string;
  [key: string]: any;
}
