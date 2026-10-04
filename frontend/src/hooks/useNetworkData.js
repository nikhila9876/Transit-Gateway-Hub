import { useState, useEffect } from 'react';
import { vpcService } from '../services/vpcService';
import { transitGatewayService } from '../services/transitGatewayService';
import { ec2Service } from '../services/ec2Service';
import { dashboardService } from '../services/dashboardService';

export const useNetworkData = () => {
  const [vpcs, setVpcs] = useState([]);
  const [tgw, setTgw] = useState(null);
  const [instances, setInstances] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [vpcsData, tgwData, ec2Data, summaryData] = await Promise.all([
        vpcService.getVpcs(),
        transitGatewayService.getTransitGateway(),
        ec2Service.getInstances(),
        dashboardService.getSummary()
      ]);
      setVpcs(vpcsData);
      setTgw(tgwData);
      setInstances(ec2Data);
      setSummary(summaryData);
    } catch (err) {
      setError(err.message || 'Failed to load network infrastructure data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { vpcs, tgw, instances, summary, loading, error, refresh: fetchData };
};
