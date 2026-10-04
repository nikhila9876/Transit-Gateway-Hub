package com.cloudnexus.service;

import com.cloudnexus.dto.VpcDetailsDto;
import com.cloudnexus.dto.VpcDto;
import java.util.List;
import java.util.Optional;

/**
 * Service contract for VPC management and topology inspection.
 * Decouples controllers from data providers (Mock in Phase 1, AWS SDK in Phase 2).
 */
public interface VpcService {
    List<VpcDto> getAllVpcs();
    Optional<VpcDetailsDto> getVpcById(String id);
}
