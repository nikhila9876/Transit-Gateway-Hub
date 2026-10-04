package com.cloudnexus.model;

public class RouteEntry {
    private String destination;
    private String target;
    private String status;
    private String propagated;

    public RouteEntry() {}

    public RouteEntry(String destination, String target, String status, String propagated) {
        this.destination = destination;
        this.target = target;
        this.status = status;
        this.propagated = propagated;
    }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public String getTarget() { return target; }
    public void setTarget(String target) { this.target = target; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPropagated() { return propagated; }
    public void setPropagated(String propagated) { this.propagated = propagated; }
}
