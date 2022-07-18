export interface ServiceHealth {
  endpoint: string;
  timeoutSeconds?: number;
  intervalSeconds?: number;
}

export interface RegisterServicePayload {
  name: string;
  address: string;
  port: number;
  health?: ServiceHealth | null;
}

export interface ServiceDiscovery {
  registerService(payload: RegisterServicePayload): Promise<void>;

  deregisterService(serviceId: string): Promise<void>;
}
