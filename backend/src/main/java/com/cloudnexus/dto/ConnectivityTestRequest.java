package com.cloudnexus.dto;

import jakarta.validation.constraints.NotBlank;

public class ConnectivityTestRequest {
    @NotBlank(message = "Source VPC is required")
    private String sourceVpc;

    @NotBlank(message = "Destination VPC is required")
    private String destinationVpc;

    private int port = 8080;

    public ConnectivityTestRequest() {}

    public ConnectivityTestRequest(String sourceVpc, String destinationVpc, int port) {
        this.sourceVpc = sourceVpc;
        this.destinationVpc = destinationVpc;
        this.port = port;
    }

    public String getSourceVpc() { return sourceVpc; }
    public void setSourceVpc(String sourceVpc) { this.sourceVpc = sourceVpc; }

    public String getDestinationVpc() { return destinationVpc; }
    public void setDestinationVpc(String destinationVpc) { this.destinationVpc = destinationVpc; }

    public int getPort() { return port; }
    public void setPort(int port) { this.port = port; }
}
