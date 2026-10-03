package com.cloudnexus.model;

public class Subnet {
    private String id;
    private String name;
    private String cidr;
    private String type; // Public, Private
    private String az;

    public Subnet() {}

    public Subnet(String id, String name, String cidr, String type, String az) {
        this.id = id;
        this.name = name;
        this.cidr = cidr;
        this.type = type;
        this.az = az;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCidr() { return cidr; }
    public void setCidr(String cidr) { this.cidr = cidr; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getAz() { return az; }
    public void setAz(String az) { this.az = az; }
}
