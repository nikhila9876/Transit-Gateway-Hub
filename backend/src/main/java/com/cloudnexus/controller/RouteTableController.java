package com.cloudnexus.controller;

import com.cloudnexus.dto.ApiResponse;
import com.cloudnexus.dto.RouteTableDto;
import com.cloudnexus.service.RouteTableService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/route-tables")
public class RouteTableController {

    private final RouteTableService routeTableService;

    public RouteTableController(RouteTableService routeTableService) {
        this.routeTableService = routeTableService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RouteTableDto>>> getAllRouteTables() {
        return ResponseEntity.ok(ApiResponse.ok("Route tables fetched successfully", routeTableService.getAllRouteTables()));
    }
}
