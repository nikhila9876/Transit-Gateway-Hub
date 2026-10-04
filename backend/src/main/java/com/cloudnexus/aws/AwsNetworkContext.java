package com.cloudnexus.aws;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Enterprise AWS context configuration abstraction.
 * Prepares the platform for AWS SDK v2 integration in Phase 2.
 */
@Component
public class AwsNetworkContext {

    @Value("${cloudnexus.aws.region:us-east-1}")
    private String region;

    @Value("${cloudnexus.aws.transit-gateway-name:Enterprise-TGW}")
    private String transitGatewayName;

    @Value("${cloudnexus.aws.dev-vpc-cidr:10.10.0.0/16}")
    private String devVpcCidr;

    @Value("${cloudnexus.aws.test-vpc-cidr:10.20.0.0/16}")
    private String testVpcCidr;

    @Value("${cloudnexus.aws.prod-vpc-cidr:10.30.0.0/16}")
    private String prodVpcCidr;

    public String getRegion() { return region; }
    public String getTransitGatewayName() { return transitGatewayName; }
    public String getDevVpcCidr() { return devVpcCidr; }
    public String getTestVpcCidr() { return testVpcCidr; }
    public String getProdVpcCidr() { return prodVpcCidr; }
}
