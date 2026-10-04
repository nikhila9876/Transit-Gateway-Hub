package com.cloudnexus.service;

import com.cloudnexus.dto.RouteTableDto;
import java.util.List;

/**
 * Service contract for route table inspection and validation.
 */
public interface RouteTableService {
    List<RouteTableDto> getAllRouteTables();
}
