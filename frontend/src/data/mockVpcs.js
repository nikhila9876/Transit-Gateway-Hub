export const MOCK_VPCS = [
  {
    id: "vpc-0dev1010001",
    name: "DEV",
    displayName: "Dev-VPC",
    cidr: "10.10.0.0/16",
    region: "us-east-1",
    state: "available",
    status: "Healthy",
    subnetCount: 2,
    ec2Count: 1,
    attachmentStatus: "Attached",
    subnets: [
      { id: "subnet-0dev-pub", name: "Dev-Public-Subnet", cidr: "10.10.1.0/24", type: "Public", az: "us-east-1a" },
      { id: "subnet-0dev-priv", name: "Dev-Private-Subnet", cidr: "10.10.2.0/24", type: "Private", az: "us-east-1b" }
    ],
    routeTables: ["rtb-0dev-public"],
    igwId: "igw-0dev9988",
    securityGroup: "Dev-App-SG",
    color: "#3b82f6"
  },
  {
    id: "vpc-0test1020002",
    name: "TEST",
    displayName: "Test-VPC",
    cidr: "10.20.0.0/16",
    region: "us-east-1",
    state: "available",
    status: "Healthy",
    subnetCount: 2,
    ec2Count: 1,
    attachmentStatus: "Attached",
    subnets: [
      { id: "subnet-0test-pub", name: "Test-Public-Subnet", cidr: "10.20.1.0/24", type: "Public", az: "us-east-1a" },
      { id: "subnet-0test-priv", name: "Test-Private-Subnet", cidr: "10.20.2.0/24", type: "Private", az: "us-east-1b" }
    ],
    routeTables: ["rtb-0test-public"],
    igwId: "igw-0test9988",
    securityGroup: "Test-App-SG",
    color: "#06b6d4"
  },
  {
    id: "vpc-0prod1030003",
    name: "PROD",
    displayName: "Prod-VPC",
    cidr: "10.30.0.0/16",
    region: "us-east-1",
    state: "available",
    status: "Warning",
    subnetCount: 2,
    ec2Count: 1,
    attachmentStatus: "Attached",
    subnets: [
      { id: "subnet-0prod-pub", name: "Prod-Public-Subnet", cidr: "10.30.1.0/24", type: "Public", az: "us-east-1a" },
      { id: "subnet-0prod-priv", name: "Prod-Private-Subnet", cidr: "10.30.2.0/24", type: "Private", az: "us-east-1b" }
    ],
    routeTables: ["rtb-0prod-public"],
    igwId: "igw-0prod9988",
    securityGroup: "Prod-App-SG",
    color: "#6366f1"
  }
];

export default MOCK_VPCS;
