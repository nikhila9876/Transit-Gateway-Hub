package com.cloudnexus.connectivity;

import java.util.List;

/**
 * Domain result representing cross-VPC network reachability probe analysis.
 */
public class ConnectivityProbeResult {
    private final String source;
    private final String destination;
    private final boolean reachable;
    private final double latencyMs;
    private final List<String> hops;
    private final String diagnosticNote;

    public ConnectivityProbeResult(String source, String destination, boolean reachable,
                                   double latencyMs, List<String> hops, String diagnosticNote) {
        this.source = source;
        this.destination = destination;
        this.reachable = reachable;
        this.latencyMs = latencyMs;
        this.hops = hops;
        this.diagnosticNote = diagnosticNote;
    }

    public String getSource() { return source; }
    public String getDestination() { return destination; }
    public boolean isReachable() { return reachable; }
    public double getLatencyMs() { return latencyMs; }
    public List<String> getHops() { return hops; }
    public String getDiagnosticNote() { return diagnosticNote; }
}
