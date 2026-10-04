package com.cloudnexus.dto;

public class ConnectivityTestRequest {
    private String source;
    private String sourceVpc;
    private String destination;
    private String destinationVpc;
    private String protocol = "TCP";
    private int port = 8080;
    private String sourceInstanceId;

    public ConnectivityTestRequest() {}

    public ConnectivityTestRequest(String source, String destination, String protocol, int port) {
        this.source = source;
        this.sourceVpc = source;
        this.destination = destination;
        this.destinationVpc = destination;
        this.protocol = protocol != null ? protocol : "TCP";
        this.port = port > 0 ? port : 8080;
    }

    public String getSource() {
        return source != null ? source : sourceVpc;
    }

    public void setSource(String source) {
        this.source = source;
        if (this.sourceVpc == null) this.sourceVpc = source;
    }

    public String getSourceVpc() {
        return sourceVpc != null ? sourceVpc : source;
    }

    public void setSourceVpc(String sourceVpc) {
        this.sourceVpc = sourceVpc;
        if (this.source == null) this.source = sourceVpc;
    }

    public String getDestination() {
        return destination != null ? destination : destinationVpc;
    }

    public void setDestination(String destination) {
        this.destination = destination;
        if (this.destinationVpc == null) this.destinationVpc = destination;
    }

    public String getDestinationVpc() {
        return destinationVpc != null ? destinationVpc : destination;
    }

    public void setDestinationVpc(String destinationVpc) {
        this.destinationVpc = destinationVpc;
        if (this.destination == null) this.destination = destinationVpc;
    }

    public String getProtocol() { return protocol; }
    public void setProtocol(String protocol) { this.protocol = protocol; }

    public int getPort() { return port; }
    public void setPort(int port) { this.port = port; }

    public String getSourceInstanceId() { return sourceInstanceId; }
    public void setSourceInstanceId(String sourceInstanceId) { this.sourceInstanceId = sourceInstanceId; }
}
