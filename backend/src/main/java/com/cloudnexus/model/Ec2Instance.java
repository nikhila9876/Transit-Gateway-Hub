package com.cloudnexus.model;

public class Ec2Instance {
    private String id;
    private String name;
    private String environment;
    private String vpcId;
    private String subnetId;
    private String privateIp;
    private String publicIp;
    private String instanceType;
    private String state;
    private String securityGroupId;
    private String securityGroupName;
    private String iamRole;
    private int appPort;
    private String serviceResponse;
    private boolean sessionManagerEnabled;

    public Ec2Instance() {}

    public Ec2Instance(String id, String name, String environment, String vpcId, String subnetId,
                       String privateIp, String publicIp, String instanceType, String state,
                       String securityGroupId, String securityGroupName, String iamRole,
                       int appPort, String serviceResponse, boolean sessionManagerEnabled) {
        this.id = id;
        this.name = name;
        this.environment = environment;
        this.vpcId = vpcId;
        this.subnetId = subnetId;
        this.privateIp = privateIp;
        this.publicIp = publicIp;
        this.instanceType = instanceType;
        this.state = state;
        this.securityGroupId = securityGroupId;
        this.securityGroupName = securityGroupName;
        this.iamRole = iamRole;
        this.appPort = appPort;
        this.serviceResponse = serviceResponse;
        this.sessionManagerEnabled = sessionManagerEnabled;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEnvironment() { return environment; }
    public void setEnvironment(String environment) { this.environment = environment; }

    public String getVpcId() { return vpcId; }
    public void setVpcId(String vpcId) { this.vpcId = vpcId; }

    public String getSubnetId() { return subnetId; }
    public void setSubnetId(String subnetId) { this.subnetId = subnetId; }

    public String getPrivateIp() { return privateIp; }
    public void setPrivateIp(String privateIp) { this.privateIp = privateIp; }

    public String getPublicIp() { return publicIp; }
    public void setPublicIp(String publicIp) { this.publicIp = publicIp; }

    public String getInstanceType() { return instanceType; }
    public void setInstanceType(String instanceType) { this.instanceType = instanceType; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getSecurityGroupId() { return securityGroupId; }
    public void setSecurityGroupId(String securityGroupId) { this.securityGroupId = securityGroupId; }

    public String getSecurityGroupName() { return securityGroupName; }
    public void setSecurityGroupName(String securityGroupName) { this.securityGroupName = securityGroupName; }

    public String getIamRole() { return iamRole; }
    public void setIamRole(String iamRole) { this.iamRole = iamRole; }

    public int getAppPort() { return appPort; }
    public void setAppPort(int appPort) { this.appPort = appPort; }

    public String getServiceResponse() { return serviceResponse; }
    public void setServiceResponse(String serviceResponse) { this.serviceResponse = serviceResponse; }

    public boolean isSessionManagerEnabled() { return sessionManagerEnabled; }
    public void setSessionManagerEnabled(boolean sessionManagerEnabled) { this.sessionManagerEnabled = sessionManagerEnabled; }
}
