package com.cloudnexus.service;

import com.cloudnexus.dto.AuditLogDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class InMemoryAuditServiceTests {

    private InMemoryAuditService auditService;

    @BeforeEach
    void setUp() {
        auditService = new InMemoryAuditService();
        auditService.init();
    }

    @Test
    @DisplayName("InMemoryAuditService initializes with baseline compliance records")
    void testInitPopulatesBaseline() {
        List<AuditLogDto> logs = auditService.getAllLogs();
        assertNotNull(logs);
        assertTrue(logs.size() >= 5);
        assertTrue(logs.stream().anyMatch(l -> "SYSTEM_BOOTSTRAP".equals(l.getAction())));
        assertTrue(logs.stream().anyMatch(l -> "IAM_SESSION_VERIFIED".equals(l.getAction())));
    }

    @Test
    @DisplayName("recordLog prepends newest log to the front")
    void testRecordLogPrepends() {
        AuditLogDto newLog = new AuditLogDto();
        newLog.setUser("admin@cloudnexus.io");
        newLog.setAction("TEST_ACTION");
        newLog.setResource("vpc-test-1");
        newLog.setStatus("SUCCESS");
        newLog.setDetails("Test event details");

        auditService.recordLog(newLog);

        List<AuditLogDto> logs = auditService.getAllLogs();
        assertEquals("TEST_ACTION", logs.get(0).getAction());
        assertEquals("admin@cloudnexus.io", logs.get(0).getUser());
        assertNotNull(logs.get(0).getId());
        assertNotNull(logs.get(0).getTimestamp());
    }

    @Test
    @DisplayName("recordLog enforces MAX_LOGS bound of 200")
    void testCapacityCap() {
        for (int i = 0; i < 250; i++) {
            AuditLogDto log = new AuditLogDto();
            log.setUser("user-" + i);
            log.setAction("BURST_ACTION_" + i);
            log.setStatus("SUCCESS");
            auditService.recordLog(log);
        }

        List<AuditLogDto> logs = auditService.getAllLogs();
        assertEquals(200, logs.size());
        assertEquals("BURST_ACTION_249", logs.get(0).getAction());
    }

    @Test
    @DisplayName("recordEvent helper correctly structures AuditLogDto")
    void testRecordEventHelper() {
        auditService.recordEvent("security-ops", "PORT_SCAN", "0.0.0.0/0", "WARNING", "Port 22 exposed");
        AuditLogDto top = auditService.getAllLogs().get(0);

        assertEquals("security-ops", top.getUser());
        assertEquals("PORT_SCAN", top.getAction());
        assertEquals("0.0.0.0/0", top.getResource());
        assertEquals("WARNING", top.getStatus());
        assertEquals("Port 22 exposed", top.getDetails());
    }
}
