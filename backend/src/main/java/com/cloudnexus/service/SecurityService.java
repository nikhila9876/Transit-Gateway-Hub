package com.cloudnexus.service;

import com.cloudnexus.dto.SecurityFindingDto;
import java.util.List;

/**
 * Service contract for CloudNexus network security posture and compliance inspection.
 */
public interface SecurityService {
    List<SecurityFindingDto> getAllFindings();
}
