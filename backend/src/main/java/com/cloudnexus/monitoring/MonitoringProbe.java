package com.cloudnexus.monitoring;

/**
 * Domain contract for CloudNexus network health and CloudWatch telemetry probes.
 */
public interface MonitoringProbe {
    double calculateNetworkHealth();
    double measureAverageLatency();
    double measurePacketLoss();
}
