package com.cloudnexus.repository;

import com.cloudnexus.model.*;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class MockDataStore {

    private final Map<String, Vpc> vpcMap = new ConcurrentHashMap<>();
    private final Map<String, Ec2Instance> ec2Map = new ConcurrentHashMap<>();
    private final Map<String, VpcRouteTable> routeTableMap = new ConcurrentHashMap<>();
    private final List<SecurityFinding> securityFindings = new ArrayList<>();
    private final List<AuditLog> auditLogs = new ArrayList<>();
    private final Map<String, User> userMap = new ConcurrentHashMap<>();
    private TransitGateway transitGateway;

    public MockDataStore() {
        initUsers();
        initVpcs();
        initTransitGateway();
        initRouteTables();
        initEc2Instances();
        initSecurityFindings();
        initAuditLogs();
    }

    private void initUsers() {
        userMap.put("admin", new User("usr-1", "admin", "Admin@123", Set.of(Role.ROLE_ADMIN, Role.ROLE_VIEWER)));
        userMap.put("viewer", new User("usr-2", "viewer", "Viewer@123", Set.of(Role.ROLE_VIEWER)));
    }

    private void initVpcs() {
        List<Subnet> devSubnets = List.of(
                new Subnet("subnet-0dev-pub", "Dev-Public-Subnet", "10.10.1.0/24", "Public", "us-east-1a"),
                new Subnet("subnet-0dev-priv", "Dev-Private-Subnet", "10.10.2.0/24", "Private", "us-east-1b")
        );
        Vpc devVpc = new Vpc(
                "vpc-0dev1010001", "DEV", "Dev-VPC", "10.10.0.0/16", "us-east-1",
                "available", 2, 1, "Attached", devSubnets, "igw-0dev9988", "Dev-App-SG", "#3b82f6"
        );
        vpcMap.put(devVpc.getId(), devVpc);

        List<Subnet> testSubnets = List.of(
                new Subnet("subnet-0test-pub", "Test-Public-Subnet", "10.20.1.0/24", "Public", "us-east-1a"),
                new Subnet("subnet-0test-priv", "Test-Private-Subnet", "10.20.2.0/24", "Private", "us-east-1b")
        );
        Vpc testVpc = new Vpc(
                "vpc-0test1020002", "TEST", "Test-VPC", "10.20.0.0/16", "us-east-1",
                "available", 2, 1, "Attached", testSubnets, "igw-0test9988", "Test-App-SG", "#06b6d4"
        );
        vpcMap.put(testVpc.getId(), testVpc);

        List<Subnet> prodSubnets = List.of(
                new Subnet("subnet-0prod-pub", "Prod-Public-Subnet", "10.30.1.0/24", "Public", "us-east-1a"),
                new Subnet("subnet-0prod-priv", "Prod-Private-Subnet", "10.30.2.0/24", "Private", "us-east-1b")
        );
        Vpc prodVpc = new Vpc(
                "vpc-0prod1030003", "PROD", "Prod-VPC", "10.30.0.0/16", "us-east-1",
                "available", 2, 1, "Attached", prodSubnets, "igw-0prod9988", "Prod-App-SG", "#6366f1"
        );
        vpcMap.put(prodVpc.getId(), prodVpc);
    }

    private void initTransitGateway() {
        List<TgwAttachment> attachments = List.of(
                new TgwAttachment("tgw-attach-0dev0123", "Dev-TGW-Attachment", "vpc-0dev1010001", "DEV", "VPC", "available", "associated", List.of("subnet-0dev-pub")),
                new TgwAttachment("tgw-attach-0test0456", "Test-TGW-Attachment", "vpc-0test1020002", "TEST", "VPC", "available", "associated", List.of("subnet-0test-pub")),
                new TgwAttachment("tgw-attach-0prod0789", "Prod-TGW-Attachment", "vpc-0prod1030003", "PROD", "VPC", "available", "associated", List.of("subnet-0prod-pub"))
        );

        List<TgwRoute> routes = List.of(
                new TgwRoute("10.10.0.0/16", "tgw-attach-0dev0123", "Dev-TGW-Attachment", "active", "propagated"),
                new TgwRoute("10.20.0.0/16", "tgw-attach-0test0456", "Test-TGW-Attachment", "active", "propagated"),
                new TgwRoute("10.30.0.0/16", "tgw-attach-0prod0789", "Prod-TGW-Attachment", "active", "propagated")
        );

        this.transitGateway = new TransitGateway(
                "tgw-09e8712a34bc56df0", "Enterprise-TGW", "Available", "us-east-1", 64512,
                "Central Enterprise Transit Gateway Hub interconnecting DEV, TEST, and PROD VPCs",
                "enable", "enable", "enable", "enable", "enable", "disable",
                attachments, routes
        );
    }

    private void initRouteTables() {
        VpcRouteTable devRt = new VpcRouteTable(
                "rtb-0dev-public", "Dev-Public-RT", "vpc-0dev1010001", "DEV",
                List.of(
                        new RouteEntry("10.10.0.0/16", "local", "Active", "No"),
                        new RouteEntry("0.0.0.0/0", "igw-0dev9988 (Dev-IGW)", "Active", "No"),
                        new RouteEntry("10.20.0.0/16", "tgw-09e8712a34bc56df0 (Enterprise-TGW)", "Active", "No"),
                        new RouteEntry("10.30.0.0/16", "tgw-09e8712a34bc56df0 (Enterprise-TGW)", "Active", "No")
                ),
                List.of("subnet-0dev-pub", "subnet-0dev-priv")
        );
        routeTableMap.put(devRt.getId(), devRt);

        VpcRouteTable testRt = new VpcRouteTable(
                "rtb-0test-public", "Test-Public-RT", "vpc-0test1020002", "TEST",
                List.of(
                        new RouteEntry("10.20.0.0/16", "local", "Active", "No"),
                        new RouteEntry("0.0.0.0/0", "igw-0test9988 (Test-IGW)", "Active", "No"),
                        new RouteEntry("10.10.0.0/16", "tgw-09e8712a34bc56df0 (Enterprise-TGW)", "Active", "No"),
                        new RouteEntry("10.30.0.0/16", "tgw-09e8712a34bc56df0 (Enterprise-TGW)", "Active", "No")
                ),
                List.of("subnet-0test-pub", "subnet-0test-priv")
        );
        routeTableMap.put(testRt.getId(), testRt);

        VpcRouteTable prodRt = new VpcRouteTable(
                "rtb-0prod-public", "Prod-Public-RT", "vpc-0prod1030003", "PROD",
                List.of(
                        new RouteEntry("10.30.0.0/16", "local", "Active", "No"),
                        new RouteEntry("0.0.0.0/0", "igw-0prod9988 (Prod-IGW)", "Active", "No"),
                        new RouteEntry("10.10.0.0/16", "tgw-09e8712a34bc56df0 (Enterprise-TGW)", "Active", "No"),
                        new RouteEntry("10.20.0.0/16", "tgw-09e8712a34bc56df0 (Enterprise-TGW)", "Active", "No")
                ),
                List.of("subnet-0prod-pub", "subnet-0prod-priv")
        );
        routeTableMap.put(prodRt.getId(), prodRt);
    }

    private void initEc2Instances() {
        Ec2Instance devEc2 = new Ec2Instance(
                "i-0dev123456789abcd", "Dev-App-Server", "DEV", "vpc-0dev1010001", "subnet-0dev-pub",
                "10.10.1.45", "34.200.12.80", "t3.micro", "running",
                "sg-0dev887766", "Dev-App-SG", "LabInstanceProfile",
                8080, "HELLO FROM DEV VPC", true
        );
        ec2Map.put(devEc2.getId(), devEc2);

        Ec2Instance testEc2 = new Ec2Instance(
                "i-0test123456789abcd", "Test-App-Server", "TEST", "vpc-0test1020002", "subnet-0test-pub",
                "10.20.1.88", "54.210.45.19", "t3.micro", "running",
                "sg-0test887766", "Test-App-SG", "LabInstanceProfile",
                8080, "HELLO FROM TEST VPC", true
        );
        ec2Map.put(testEc2.getId(), testEc2);

        Ec2Instance prodEc2 = new Ec2Instance(
                "i-0prod123456789abcd", "Prod-App-Server", "PROD", "vpc-0prod1030003", "subnet-0prod-pub",
                "10.30.1.112", "52.90.87.64", "t3.micro", "running",
                "sg-0prod887766", "Prod-App-SG", "LabInstanceProfile",
                8080, "HELLO FROM PROD VPC", true
        );
        ec2Map.put(prodEc2.getId(), prodEc2);
    }

    private void initSecurityFindings() {
        securityFindings.add(new SecurityFinding(
                "SEC-001", "Dev to Prod Direct Traffic Policy", "low", "Policy Enforcement",
                "sg-0prod887766", "Prod-App-SG", "Enforced",
                "Inbound traffic from DEV VPC (10.10.0.0/16) to PROD VPC on port 8080 is blocked by security group isolation rules.",
                "Maintain isolation; DEV should only communicate with TEST, and TEST with PROD."
        ));
        securityFindings.add(new SecurityFinding(
                "SEC-002", "SSH Port 22 Ingress Hardening", "info", "Network Hygiene",
                "sg-all", "Dev/Test/Prod-SG", "Healthy",
                "Inbound TCP Port 22 is closed across all VPC security groups. Remote administration uses AWS Systems Manager Session Manager.",
                "Ensure IAM least privilege policies are applied to Systems Manager access."
        ));
        securityFindings.add(new SecurityFinding(
                "SEC-003", "Public Subnet Exposure Limitation", "medium", "Architecture",
                "vpc-0prod1030003", "Prod-VPC", "Review",
                "Workload servers currently reside in public subnets with IGW attachments for learner lab accessibility.",
                "Migrate backend database and processing workloads to private application subnets with NAT Gateways for production compliance."
        ));
        securityFindings.add(new SecurityFinding(
                "SEC-004", "VPC Flow Logs & TGW Flow Logs Recommendation", "medium", "Observability",
                "tgw-09e8712a34bc56df0", "Enterprise-TGW", "Recommended",
                "Transit Gateway flow logs should be published to CloudWatch Log Groups for real-time threat intelligence and traffic analysis.",
                "Enable TGW flow logging to Amazon S3 or CloudWatch Logs with Athena query integration."
        ));
    }

    private void initAuditLogs() {
        auditLogs.add(new AuditLog(
                "aud-001", "2026-10-03 22:45:10", "admin@cloudnexus.io",
                "TRANSIT_GATEWAY_ROUTE_PROPAGATION_VERIFIED", "Enterprise-TGW", "SUCCESS",
                "Verified route propagation for DEV (10.10.0.0/16), TEST (10.20.0.0/16), and PROD (10.30.0.0/16)."
        ));
        auditLogs.add(new AuditLog(
                "aud-002", "2026-10-03 21:12:04", "system-scheduler",
                "CONNECTIVITY_SYNTHETIC_PROBE", "Dev -> Test HTTP:8080", "SUCCESS",
                "Cross-VPC HTTP handshake latency: 1.2ms. Response 'HELLO FROM TEST VPC'."
        ));
        auditLogs.add(new AuditLog(
                "aud-003", "2026-10-03 20:30:19", "admin@cloudnexus.io",
                "SECURITY_GROUP_RULE_AUDIT", "Prod-App-SG", "SUCCESS",
                "Confirmed strict denial of DEV VPC traffic direct to PROD. Whitelisted TEST VPC (10.20.0.0/16:8080)."
        ));
        auditLogs.add(new AuditLog(
                "aud-004", "2026-10-03 19:15:42", "session-manager",
                "SSM_SESSION_STARTED", "i-0dev123456789abcd", "SUCCESS",
                "Engineer logged in via AWS SSM Session Manager for connectivity verification."
        ));
    }

    // Accessors
    public List<Vpc> getAllVpcs() { return new ArrayList<>(vpcMap.values()); }
    public Optional<Vpc> getVpcById(String id) {
        if (vpcMap.containsKey(id)) return Optional.of(vpcMap.get(id));
        return vpcMap.values().stream()
                .filter(v -> v.getName().equalsIgnoreCase(id) || v.getDisplayName().equalsIgnoreCase(id))
                .findFirst();
    }

    public TransitGateway getTransitGateway() { return transitGateway; }
    public List<TgwAttachment> getTgwAttachments() { return transitGateway.getAttachments(); }
    public List<TgwRoute> getTgwRoutes() { return transitGateway.getRoutes(); }

    public List<VpcRouteTable> getAllRouteTables() { return new ArrayList<>(routeTableMap.values()); }
    public List<Ec2Instance> getAllEc2Instances() { return new ArrayList<>(ec2Map.values()); }
    public List<SecurityFinding> getSecurityFindings() { return new ArrayList<>(securityFindings); }
    public List<AuditLog> getAuditLogs() { return new ArrayList<>(auditLogs); }
    public Optional<User> findByUsername(String username) { return Optional.ofNullable(userMap.get(username)); }
}
