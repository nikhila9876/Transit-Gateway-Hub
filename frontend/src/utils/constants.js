export const APP_NAME = "CloudNexus";
export const APP_TAGLINE = "Enterprise Multi-VPC Network Management & Intelligence Platform";
export const AWS_REGION = "us-east-1";
export const TRANSIT_GATEWAY_NAME = "Enterprise-TGW";

export const USER_ROLES = {
  ADMIN: "ROLE_ADMIN",
  VIEWER: "ROLE_VIEWER"
};

export const NAVIGATION_ITEMS = [
  {
    category: "Overview",
    items: [
      { name: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" }
    ]
  },
  {
    category: "Network",
    items: [
      { name: "Network Topology", path: "/network-topology", icon: "Network" },
      { name: "VPC Explorer", path: "/vpcs", icon: "Layers" },
      { name: "Transit Gateway", path: "/transit-gateway", icon: "Share2" },
      { name: "Route Tables", path: "/route-tables", icon: "GitFork" }
    ]
  },
  {
    category: "Compute",
    items: [
      { name: "EC2 Instances", path: "/ec2", icon: "Server" }
    ]
  },
  {
    category: "Operations",
    items: [
      { name: "Connectivity", path: "/connectivity", icon: "Activity" },
      { name: "Monitoring", path: "/monitoring", icon: "LineChart" }
    ]
  },
  {
    category: "Security",
    items: [
      { name: "Security Center", path: "/security", icon: "ShieldCheck" }
    ]
  },
  {
    category: "Intelligence",
    items: [
      { name: "AI Assistant", path: "/ai-assistant", icon: "Sparkles" }
    ]
  },
  {
    category: "Administration",
    items: [
      { name: "Audit Logs", path: "/audit-logs", icon: "FileText" }
    ]
  }
];
