package com.cloudnexus.dto;

import java.util.List;
import java.util.Map;

public class MonitoringDto {
    private double cpuUtilization;
    private double networkHealthPercent;
    private double avgLatencyMs;
    private double packetLossPercent;
    private int instanceHealth;
    private String availability;
    private int activeAlerts;
    private String overallStatus;
    private List<Map<String, Object>> vpcMetrics;
    private List<Map<String, Object>> tgwMetrics;
    private List<Map<String, Object>> recentEvents;
    private String timestamp;

    public MonitoringDto() {}

    public MonitoringDto(double cpuUtilization, double networkHealthPercent, double avgLatencyMs,
                         double packetLossPercent, int instanceHealth, String availability,
                         int activeAlerts, String overallStatus, List<Map<String, Object>> vpcMetrics,
                         List<Map<String, Object>> tgwMetrics, List<Map<String, Object>> recentEvents,
                         String timestamp) {
        this.cpuUtilization = cpuUtilization;
        this.networkHealthPercent = networkHealthPercent;
        this.avgLatencyMs = avgLatencyMs;
        this.packetLossPercent = packetLossPercent;
        this.instanceHealth = instanceHealth;
        this.availability = availability;
        this.activeAlerts = activeAlerts;
        this.overallStatus = overallStatus;
        this.vpcMetrics = vpcMetrics;
        this.tgwMetrics = tgwMetrics;
        this.recentEvents = recentEvents;
        this.timestamp = timestamp;
    }

    public double getCpuUtilization() { return cpuUtilization; }
    public void setCpuUtilization(double cpuUtilization) { this.cpuUtilization = cpuUtilization; }

    public double getNetworkHealthPercent() { return networkHealthPercent; }
    public void setNetworkHealthPercent(double networkHealthPercent) { this.networkHealthPercent = networkHealthPercent; }

    public double getAvgLatencyMs() { return avgLatencyMs; }
    public void setAvgLatencyMs(double avgLatencyMs) { this.avgLatencyMs = avgLatencyMs; }

    public double getPacketLossPercent() { return packetLossPercent; }
    public void setPacketLossPercent(double packetLossPercent) { this.packetLossPercent = packetLossPercent; }

    public int getInstanceHealth() { return instanceHealth; }
    public void setInstanceHealth(int instanceHealth) { this.instanceHealth = instanceHealth; }

    public String getAvailability() { return availability; }
    public void setAvailability(String availability) { this.availability = availability; }

    public int getActiveAlerts() { return activeAlerts; }
    public void setActiveAlerts(int activeAlerts) { this.activeAlerts = activeAlerts; }

    public String getOverallStatus() { return overallStatus; }
    public void setOverallStatus(String overallStatus) { this.overallStatus = overallStatus; }

    public List<Map<String, Object>> getVpcMetrics() { return vpcMetrics; }
    public void setVpcMetrics(List<Map<String, Object>> vpcMetrics) { this.vpcMetrics = vpcMetrics; }

    public List<Map<String, Object>> getTgwMetrics() { return tgwMetrics; }
    public void setTgwMetrics(List<Map<String, Object>> tgwMetrics) { this.tgwMetrics = tgwMetrics; }

    public List<Map<String, Object>> getRecentEvents() { return recentEvents; }
    public void setRecentEvents(List<Map<String, Object>> recentEvents) { this.recentEvents = recentEvents; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
}
