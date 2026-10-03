export const MOCK_MONITORING = {
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
        { time: "00:15", dev: 42, test: 40, bytesIn: 48, bytesOut: 44 },
        { time: "00:30", bytesIn: 55, bytesOut: 51 },
        { time: "00:45", bytesIn: 62, bytesOut: 58 },
        { time: "01:00", bytesIn: 50, bytesOut: 46 }
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
  healthScore: 94
};

export default MOCK_MONITORING;
