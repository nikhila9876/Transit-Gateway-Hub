package com.cloudnexus.dto;

public class Ec2InstanceDto {
    private String id;
    private String name;
    private String state;
    private String privateIp;
    private String publicIp;
    private String vpc;
    private String vpcId;
    private String subnet;
    private String subnetId;
    private String instanceType;
    private String health;
    private String securityGroupId;
    private String securityGroupName;
    private String iamRole;
    private int appPort;
    private boolean sessionManagerEnabled;

    public Ec2InstanceDto() {}

    public Ec2InstanceDto(String id, String name, String state, String privateIp, String publicIp,
                          String vpc, String vpcId, String subnet, String subnetId,
                          String instanceType, String health, String securityGroupId,
                          String securityGroupName, String iamRole, int appPort, boolean sessionManagerEnabled) {
        this.id = id;
        this.name = name;
        this.state = state;
        this.privateIp = privateIp;
        this.publicIp = publicIp;
        this.vpc = vpc;
        this.vpcId = vpcId;
        this.subnet = subnet;
        this.subnetId = subnetId;
        this.instanceType = instanceType;
        this.health = health;
        this.securityGroupId = securityGroupId;
        this.securityGroupName = securityGroupName;
        this.iamRole = iamRole;
        this.appPort = appPort;
        this.sessionManagerEnabled = sessionManagerEnabled;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPrivateIp() { return privateIp; }
    public void setPrivateIp(String privateIp) { this.privateIp = privateIp; }

    public String getPublicIp() { return publicIp; }
    public void setPublicIp(String publicIp) { this.publicIp = publicIp; }

    public String getVpc() { return vpc; }
    public void setVpc(String vpc) { this.vpc = vpc; }

    public String getVpcId() { return vpcId; }
    public void setVpcId(String vpcId) { this.vpcId = vpcId; }

    public String getSubnet() { return subnet; }
    public void setSubnet(String subnet) { this.subnet = subnet; }

    public String getSubnetId() { return subnetId; }
    public void setSubnetId(String subnetId) { this.subnetId = subnetId; }

    public String getInstanceType() { return instanceType; }
    public void setInstanceType(String instanceType) { this.instanceType = instanceType; }

    public String getHealth() { return health; }
    public void setHealth(String health) { this.health = health; }

    public String getSecurityGroupId() { return securityGroupId; }
    public void setSecurityGroupId(String securityGroupId) { this.securityGroupId = securityGroupId; }

    public String getSecurityGroupName() { return securityGroupName; }
    public void setSecurityGroupName(String securityGroupName) { this.securityGroupName = securityGroupName; }

    public String getIamRole() { return iamRole; }
    public void setIamRole(String iamRole) { this.iamRole = iamRole; }

    public int getAppPort() { return appPort; }
    public void setAppPort(int appPort) { this.appPort = appPort; }

    public boolean isSessionManagerEnabled() { return sessionManagerEnabled; }
    public void setSessionManagerEnabled(boolean sessionManagerEnabled) { this.sessionManagerEnabled = sessionManagerEnabled; }
}
