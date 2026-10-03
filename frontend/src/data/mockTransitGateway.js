export const MOCK_TRANSIT_GATEWAY = {
  id: "tgw-09e8712a34bc56df0",
  name: "Enterprise-TGW",
  state: "Available",
  region: "us-east-1",
  asn: 64512,
  description: "Central Enterprise Transit Gateway Hub interconnecting DEV, TEST, and PROD VPCs",
  autoAcceptSharedAttachments: "enable",
  defaultRouteTableAssociation: "enable",
  defaultRouteTablePropagation: "enable",
  dnsSupport: "enable",
  vpnEcmpSupport: "enable",
  multicastSupport: "disable",
  connectedVpcsCount: 3,
  attachmentsCount: 3,
  routeTablesCount: 3,
  routesCount: 3,
  attachments: [
    {
      id: "tgw-attach-0dev0123",
      name: "Dev-TGW-Attachment",
      vpcId: "vpc-0dev1010001",
      vpcName: "DEV",
      resourceType: "VPC",
      state: "available",
      associationState: "associated",
      subnetIds: ["subnet-0dev-pub"]
    },
    {
      id: "tgw-attach-0test0456",
      name: "Test-TGW-Attachment",
      vpcId: "vpc-0test1020002",
      vpcName: "TEST",
      resourceType: "VPC",
      state: "available",
      associationState: "associated",
      subnetIds: ["subnet-0test-pub"]
    },
    {
      id: "tgw-attach-0prod0789",
      name: "Prod-TGW-Attachment",
      vpcId: "vpc-0prod1030003",
      vpcName: "PROD",
      resourceType: "VPC",
      state: "available",
      associationState: "associated",
      subnetIds: ["subnet-0prod-pub"]
    }
  ],
  routes: [
    { destinationCidr: "10.10.0.0/16", targetAttachmentId: "tgw-attach-0dev0123", targetName: "Dev-TGW-Attachment", state: "active", type: "propagated" },
    { destinationCidr: "10.20.0.0/16", targetAttachmentId: "tgw-attach-0test0456", targetName: "Test-TGW-Attachment", state: "active", type: "propagated" },
    { destinationCidr: "10.30.0.0/16", targetAttachmentId: "tgw-attach-0prod0789", targetName: "Prod-TGW-Attachment", state: "active", type: "propagated" }
  ]
};

export const MOCK_ROUTE_TABLES = [
  {
    id: "rtb-0dev-public",
    name: "Dev-Public-RT",
    vpcId: "vpc-0dev1010001",
    vpcName: "DEV",
    status: "Active",
    routes: [
      { destination: "10.10.0.0/16", target: "local", type: "Local", status: "Active", propagated: "No" },
      { destination: "0.0.0.0/0", target: "igw-0dev9988 (Dev-IGW)", type: "Internet Gateway", status: "Active", propagated: "No" },
      { destination: "10.20.0.0/16", target: "tgw-09e8712a34bc56df0 (Enterprise-TGW)", type: "Transit Gateway", status: "Active", propagated: "No" },
      { destination: "10.30.0.0/16", target: "tgw-09e8712a34bc56df0 (Enterprise-TGW)", type: "Transit Gateway", status: "Active", propagated: "No" }
    ],
    associations: ["subnet-0dev-pub", "subnet-0dev-priv"]
  },
  {
    id: "rtb-0test-public",
    name: "Test-Public-RT",
    vpcId: "vpc-0test1020002",
    vpcName: "TEST",
    status: "Active",
    routes: [
      { destination: "10.20.0.0/16", target: "local", type: "Local", status: "Active", propagated: "No" },
      { destination: "0.0.0.0/0", target: "igw-0test9988 (Test-IGW)", type: "Internet Gateway", status: "Active", propagated: "No" },
      { destination: "10.10.0.0/16", target: "tgw-09e8712a34bc56df0 (Enterprise-TGW)", type: "Transit Gateway", status: "Active", propagated: "No" },
      { destination: "10.30.0.0/16", target: "tgw-09e8712a34bc56df0 (Enterprise-TGW)", type: "Transit Gateway", status: "Active", propagated: "No" }
    ],
    associations: ["subnet-0test-pub", "subnet-0test-priv"]
  },
  {
    id: "rtb-0prod-public",
    name: "Prod-Public-RT",
    vpcId: "vpc-0prod1030003",
    vpcName: "PROD",
    status: "Active",
    routes: [
      { destination: "10.30.0.0/16", target: "local", type: "Local", status: "Active", propagated: "No" },
      { destination: "0.0.0.0/0", target: "igw-0prod9988 (Prod-IGW)", type: "Internet Gateway", status: "Active", propagated: "No" },
      { destination: "10.10.0.0/16", target: "tgw-09e8712a34bc56df0 (Enterprise-TGW)", type: "Transit Gateway", status: "Active", propagated: "No" },
      { destination: "10.20.0.0/16", target: "tgw-09e8712a34bc56df0 (Enterprise-TGW)", type: "Transit Gateway", status: "Active", propagated: "No" }
    ],
    associations: ["subnet-0prod-pub", "subnet-0prod-priv"]
  }
];

export default MOCK_TRANSIT_GATEWAY;
