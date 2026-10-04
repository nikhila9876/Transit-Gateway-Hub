/**
 * Realistic CloudWatch & Network Health Monitoring Telemetry
 * Provides time-series telemetry across 1H, 6H, 24H, and 7D intervals.
 */

export const MOCK_MONITORING = {
  healthScore: 94,
  status: "Optimal",
  resourceHealth: {
    healthy: 8,
    warning: 1,
    critical: 0,
    total: 9,
    breakdown: [
      { name: "Dev-VPC (10.10.0.0/16)", status: "Healthy", type: "VPC" },
      { name: "Test-VPC (10.20.0.0/16)", status: "Healthy", type: "VPC" },
      { name: "Prod-VPC (10.30.0.0/16)", status: "Warning", type: "VPC", reason: "Workload in public subnet" },
      { name: "Enterprise-TGW", status: "Healthy", type: "TGW" },
      { name: "Dev-TGW-Attachment", status: "Healthy", type: "Attachment" },
      { name: "Test-TGW-Attachment", status: "Healthy", type: "Attachment" },
      { name: "Prod-TGW-Attachment", status: "Healthy", type: "Attachment" },
      { name: "Dev-App-Server", status: "Healthy", type: "EC2" },
      { name: "Test-App-Server", status: "Healthy", type: "EC2" }
    ]
  },
  kpis: {
    cpu: {
      value: "14.2%",
      subvalue: "Nominal load across 3 instances",
      status: "Healthy",
      color: "cyan"
    },
    network: {
      value: "7.3 MB/s",
      subvalue: "Aggregate Transit Hub traffic",
      status: "Optimal",
      color: "blue"
    },
    latency: {
      value: "1.2 ms",
      subvalue: "Cross-VPC roundtrip latency",
      status: "Optimal",
      color: "blue"
    },
    packetLoss: {
      value: "0.01%",
      subvalue: "Zero dropped frames across TGW",
      status: "Optimal",
      color: "green"
    },
    ec2Health: {
      value: "100%",
      subvalue: "3/3 instances reporting healthy",
      status: "Healthy",
      color: "green"
    },
    availability: {
      value: "99.98%",
      subvalue: "Zero downtime in us-east-1",
      status: "Healthy",
      color: "green"
    },
    requestCount: {
      value: "142.8K req/s",
      subvalue: "Peak volume sustained",
      status: "Optimal",
      color: "indigo"
    },
    errorRate: {
      value: "0.02%",
      subvalue: "Well within 0.1% SLA threshold",
      status: "Optimal",
      color: "green"
    }
  },
  ranges: {
    "1H": {
      cpu: [
        { time: "00:00", dev: 12, test: 15, prod: 20 },
        { time: "00:15", dev: 14, test: 16, prod: 24 },
        { time: "00:30", dev: 11, test: 14, prod: 19 },
        { time: "00:45", dev: 13, test: 17, prod: 22 },
        { time: "01:00", dev: 15, test: 18, prod: 25 }
      ],
      network: [
        { time: "00:00", bytesIn: 35, bytesOut: 32 },
        { time: "00:15", bytesIn: 48, bytesOut: 44 },
        { time: "00:30", bytesIn: 55, bytesOut: 51 },
        { time: "00:45", bytesIn: 62, bytesOut: 58 },
        { time: "01:00", bytesIn: 50, bytesOut: 46 }
      ],
      requests: [
        { time: "00:00", requests: 120, connections: 45, errorRate: 0.01 },
        { time: "00:15", requests: 135, connections: 48, errorRate: 0.02 },
        { time: "00:30", requests: 150, connections: 52, errorRate: 0.01 },
        { time: "00:45", requests: 162, connections: 55, errorRate: 0.02 },
        { time: "01:00", requests: 145, connections: 49, errorRate: 0.01 }
      ],
      latency: [
        { time: "00:00", devToTest: 1.2, testToProd: 1.4 },
        { time: "00:15", devToTest: 1.1, testToProd: 1.3 },
        { time: "00:30", devToTest: 1.3, testToProd: 1.5 },
        { time: "00:45", devToTest: 1.2, testToProd: 1.4 },
        { time: "01:00", devToTest: 1.2, testToProd: 1.4 }
      ],
      instanceHealth: [
        { time: "00:00", healthy: 3, degraded: 0 },
        { time: "00:15", healthy: 3, degraded: 0 },
        { time: "00:30", healthy: 3, degraded: 0 },
        { time: "00:45", healthy: 3, degraded: 0 },
        { time: "01:00", healthy: 3, degraded: 0 }
      ],
      healthScore: [
        { time: "00:00", score: 92 },
        { time: "00:15", score: 93 },
        { time: "00:30", score: 94 },
        { time: "00:45", score: 94 },
        { time: "01:00", score: 95 }
      ]
    },
    "6H": {
      cpu: [
        { time: "18:00", dev: 10, test: 12, prod: 18 },
        { time: "19:00", dev: 16, test: 19, prod: 28 },
        { time: "20:00", dev: 22, test: 24, prod: 35 },
        { time: "21:00", dev: 18, test: 20, prod: 30 },
        { time: "22:00", dev: 14, test: 16, prod: 22 },
        { time: "23:00", dev: 12, test: 14, prod: 19 }
      ],
      network: [
        { time: "18:00", bytesIn: 45, bytesOut: 42 },
        { time: "19:00", bytesIn: 58, bytesOut: 53 },
        { time: "20:00", bytesIn: 72, bytesOut: 68 },
        { time: "21:00", bytesIn: 85, bytesOut: 80 },
        { time: "22:00", bytesIn: 64, bytesOut: 61 },
        { time: "23:00", bytesIn: 52, bytesOut: 49 }
      ],
      requests: [
        { time: "18:00", requests: 110, connections: 40, errorRate: 0.01 },
        { time: "19:00", requests: 142, connections: 50, errorRate: 0.02 },
        { time: "20:00", requests: 185, connections: 68, errorRate: 0.03 },
        { time: "21:00", requests: 195, connections: 72, errorRate: 0.02 },
        { time: "22:00", requests: 160, connections: 56, errorRate: 0.01 },
        { time: "23:00", requests: 130, connections: 44, errorRate: 0.01 }
      ],
      latency: [
        { time: "18:00", devToTest: 1.2, testToProd: 1.4 },
        { time: "19:00", devToTest: 1.1, testToProd: 1.3 },
        { time: "20:00", devToTest: 1.3, testToProd: 1.5 },
        { time: "21:00", devToTest: 1.2, testToProd: 1.4 },
        { time: "22:00", devToTest: 1.4, testToProd: 1.6 },
        { time: "23:00", devToTest: 1.2, testToProd: 1.4 }
      ],
      instanceHealth: [
        { time: "18:00", healthy: 3, degraded: 0 },
        { time: "19:00", healthy: 3, degraded: 0 },
        { time: "20:00", healthy: 3, degraded: 0 },
        { time: "21:00", healthy: 3, degraded: 0 },
        { time: "22:00", healthy: 3, degraded: 0 },
        { time: "23:00", healthy: 3, degraded: 0 }
      ],
      healthScore: [
        { time: "18:00", score: 90 },
        { time: "19:00", score: 92 },
        { time: "20:00", score: 91 },
        { time: "21:00", score: 94 },
        { time: "22:00", score: 94 },
        { time: "23:00", score: 94 }
      ]
    },
    "24H": {
      cpu: [
        { time: "00:00", dev: 8, test: 10, prod: 14 },
        { time: "04:00", dev: 7, test: 9, prod: 12 },
        { time: "08:00", dev: 15, test: 18, prod: 26 },
        { time: "12:00", dev: 25, test: 28, prod: 42 },
        { time: "16:00", dev: 28, test: 30, prod: 45 },
        { time: "20:00", dev: 18, test: 22, prod: 32 }
      ],
      network: [
        { time: "00:00", bytesIn: 22, bytesOut: 20 },
        { time: "04:00", bytesIn: 18, bytesOut: 16 },
        { time: "08:00", bytesIn: 65, bytesOut: 60 },
        { time: "12:00", bytesIn: 98, bytesOut: 92 },
        { time: "16:00", bytesIn: 110, bytesOut: 105 },
        { time: "20:00", bytesIn: 70, bytesOut: 66 }
      ],
      requests: [
        { time: "00:00", requests: 60, connections: 22, errorRate: 0.01 },
        { time: "04:00", requests: 45, connections: 18, errorRate: 0.00 },
        { time: "08:00", requests: 140, connections: 52, errorRate: 0.01 },
        { time: "12:00", requests: 220, connections: 84, errorRate: 0.02 },
        { time: "16:00", requests: 240, connections: 92, errorRate: 0.02 },
        { time: "20:00", requests: 150, connections: 60, errorRate: 0.01 }
      ],
      latency: [
        { time: "00:00", devToTest: 1.1, testToProd: 1.3 },
        { time: "04:00", devToTest: 1.0, testToProd: 1.2 },
        { time: "08:00", devToTest: 1.2, testToProd: 1.4 },
        { time: "12:00", devToTest: 1.4, testToProd: 1.6 },
        { time: "16:00", devToTest: 1.5, testToProd: 1.7 },
        { time: "20:00", devToTest: 1.3, testToProd: 1.4 }
      ],
      instanceHealth: [
        { time: "00:00", healthy: 3, degraded: 0 },
        { time: "04:00", healthy: 3, degraded: 0 },
        { time: "08:00", healthy: 3, degraded: 0 },
        { time: "12:00", healthy: 3, degraded: 0 },
        { time: "16:00", healthy: 3, degraded: 0 },
        { time: "20:00", healthy: 3, degraded: 0 }
      ],
      healthScore: [
        { time: "00:00", score: 95 },
        { time: "04:00", score: 95 },
        { time: "08:00", score: 93 },
        { time: "12:00", score: 91 },
        { time: "16:00", score: 92 },
        { time: "20:00", score: 94 }
      ]
    },
    "7D": {
      cpu: [
        { time: "Mon", dev: 14, test: 17, prod: 26 },
        { time: "Tue", dev: 16, test: 19, prod: 30 },
        { time: "Wed", dev: 19, test: 22, prod: 34 },
        { time: "Thu", dev: 18, test: 21, prod: 32 },
        { time: "Fri", dev: 22, test: 25, prod: 38 },
        { time: "Sat", dev: 10, test: 12, prod: 18 },
        { time: "Sun", dev: 9, test: 11, prod: 16 }
      ],
      network: [
        { time: "Mon", bytesIn: 65, bytesOut: 60 },
        { time: "Tue", bytesIn: 72, bytesOut: 68 },
        { time: "Wed", bytesIn: 88, bytesOut: 82 },
        { time: "Thu", bytesIn: 80, bytesOut: 75 },
        { time: "Fri", bytesIn: 95, bytesOut: 90 },
        { time: "Sat", bytesIn: 40, bytesOut: 36 },
        { time: "Sun", bytesIn: 35, bytesOut: 32 }
      ],
      requests: [
        { time: "Mon", requests: 160, connections: 60, errorRate: 0.01 },
        { time: "Tue", requests: 175, connections: 65, errorRate: 0.01 },
        { time: "Wed", requests: 210, connections: 80, errorRate: 0.02 },
        { time: "Thu", requests: 190, connections: 72, errorRate: 0.01 },
        { time: "Fri", requests: 230, connections: 88, errorRate: 0.02 },
        { time: "Sat", requests: 90, connections: 34, errorRate: 0.01 },
        { time: "Sun", requests: 80, connections: 30, errorRate: 0.00 }
      ],
      latency: [
        { time: "Mon", devToTest: 1.2, testToProd: 1.4 },
        { time: "Tue", devToTest: 1.3, testToProd: 1.5 },
        { time: "Wed", devToTest: 1.4, testToProd: 1.6 },
        { time: "Thu", devToTest: 1.3, testToProd: 1.5 },
        { time: "Fri", devToTest: 1.5, testToProd: 1.7 },
        { time: "Sat", devToTest: 1.1, testToProd: 1.3 },
        { time: "Sun", devToTest: 1.1, testToProd: 1.2 }
      ],
      instanceHealth: [
        { time: "Mon", healthy: 3, degraded: 0 },
        { time: "Tue", healthy: 3, degraded: 0 },
        { time: "Wed", healthy: 3, degraded: 0 },
        { time: "Thu", healthy: 3, degraded: 0 },
        { time: "Fri", healthy: 3, degraded: 0 },
        { time: "Sat", healthy: 3, degraded: 0 },
        { time: "Sun", healthy: 3, degraded: 0 }
      ],
      healthScore: [
        { time: "Mon", score: 93 },
        { time: "Tue", score: 94 },
        { time: "Wed", score: 92 },
        { time: "Thu", score: 93 },
        { time: "Fri", score: 91 },
        { time: "Sat", score: 95 },
        { time: "Sun", score: 96 }
      ]
    }
  },
  latencyHistory: [
    { time: "18:00", devToTest: 1.2, testToProd: 1.4, devToProd: 0 },
    { time: "19:00", devToTest: 1.1, testToProd: 1.3, devToProd: 0 },
    { time: "20:00", devToTest: 1.3, testToProd: 1.5, devToProd: 0 },
    { time: "21:00", devToTest: 1.2, testToProd: 1.4, devToProd: 0 },
    { time: "22:00", devToTest: 1.4, testToProd: 1.6, devToProd: 0 },
    { time: "23:00", devToTest: 1.2, testToProd: 1.4, devToProd: 0 }
  ],
  throughput: [
    { time: "18:00", bytesIn: 45, bytesOut: 42 },
    { time: "19:00", bytesIn: 58, bytesOut: 53 },
    { time: "20:00", bytesIn: 72, bytesOut: 68 },
    { time: "21:00", bytesIn: 85, bytesOut: 80 },
    { time: "22:00", bytesIn: 64, bytesOut: 61 },
    { time: "23:00", bytesIn: 52, bytesOut: 49 }
  ],
  vpcMetrics: [
    { vpc: "DEV VPC", latencyMs: 1.2, throughputMbps: 4.8 },
    { vpc: "TEST VPC", latencyMs: 1.3, throughputMbps: 5.2 },
    { vpc: "PROD VPC", latencyMs: 1.4, throughputMbps: 6.9 }
  ]
};

export default MOCK_MONITORING;
