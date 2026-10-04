package com.cloudnexus.service;

import com.cloudnexus.dto.Ec2InstanceDto;
import java.util.List;
import java.util.Optional;

/**
 * Service contract for EC2 instance status and cross-VPC application reachability.
 */
public interface Ec2Service {
    List<Ec2InstanceDto> getAllEc2Instances();
    Optional<Ec2InstanceDto> getInstanceById(String id);
}
