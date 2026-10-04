package com.cloudnexus.service;

import com.cloudnexus.audit.AuditEventPublisher;
import com.cloudnexus.dto.AuditLogDto;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Thread-safe in-memory enterprise audit service for recording security, compliance,
 * and infrastructure operations in AWS mode.
 */
@Service
@ConditionalOnProperty(name = "cloudnexus.data-source", havingValue = "aws", matchIfMissing = true)
public class InMemoryAuditService implements AuditService, AuditEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(InMemoryAuditService.class);
    private static final int MAX_LOGS = 200;

    private final List<AuditLogDto> auditStore = new CopyOnWriteArrayList<>();

    @PostConstruct
    public void init() {
        log.info("Initializing Enterprise InMemoryAuditService with baseline compliance records");
        Instant now = Instant.now();

        recordLogInternal(new AuditLogDto(
                "aud-init-001",
                now.minusSeconds(120).toString(),
                "system",
                "ROLE_SYSTEM",
                "SYSTEM_BOOTSTRAP",
                "Transit-Gateway-Hub",
                "tgw-09a8b7c6d5e4f3a21",
                "SUCCESS",
                "CloudNexus platform runtime initialized with AWS multi-VPC provider."
        ));

        recordLogInternal(new AuditLogDto(
                "aud-init-002",
                now.minusSeconds(90).toString(),
                "admin@cloudnexus.io",
                "ROLE_ADMIN",
                "IAM_SESSION_VERIFIED",
                "sts:GetCallerIdentity",
                "arn:aws:iam::123456789012:role/CloudNexusReadOnlyRole",
                "SUCCESS",
                "Read-only IAM execution session verified with least-privilege policies."
        ));

        recordLogInternal(new AuditLogDto(
                "aud-init-003",
                now.minusSeconds(60).toString(),
                "aws-sync-daemon",
                "ROLE_SYSTEM",
                "TOPOLOGY_DISCOVERY",
                "Transit Gateway",
                "tgw-09a8b7c6d5e4f3a21",
                "SUCCESS",
                "Discovered 3 VPC attachments: DEV (10.0.0.0/16), TEST (10.1.0.0/16), PROD (10.2.0.0/16)."
        ));

        recordLogInternal(new AuditLogDto(
                "aud-init-004",
                now.minusSeconds(30).toString(),
                "security-scanner",
                "ROLE_SYSTEM",
                "SECURITY_GROUP_AUDIT",
                "SecurityGroup",
                "sg-0abc1234def56789a",
                "WARNING",
                "Detected open SSH rule 0.0.0.0/0 exposed to public CIDR range."
        ));

        recordLogInternal(new AuditLogDto(
                "aud-init-005",
                now.minusSeconds(10).toString(),
                "network-engine",
                "ROLE_SYSTEM",
                "ROUTE_TABLE_VERIFY",
                "RouteTable",
                "rtb-0123456789abcdef0",
                "SUCCESS",
                "Verified multi-VPC route propagation across hub and spoke attachments."
        ));
    }

    @Override
    public List<AuditLogDto> getAllLogs() {
        return Collections.unmodifiableList(new ArrayList<>(auditStore));
    }

    @Override
    public void recordLog(AuditLogDto auditLog) {
        if (auditLog == null) {
            return;
        }
        if (auditLog.getId() == null || auditLog.getId().isBlank()) {
            auditLog.setId("aud-" + UUID.randomUUID().toString().substring(0, 8));
        }
        if (auditLog.getTimestamp() == null || auditLog.getTimestamp().isBlank()) {
            auditLog.setTimestamp(Instant.now().toString());
        }
        recordLogInternal(auditLog);
        log.info("Audit event recorded: action={} user={} resource={} status={}",
                auditLog.getAction(), auditLog.getUser(), auditLog.getResource(), auditLog.getStatus());
    }

    @Override
    public void recordEvent(String user, String action, String resource, String status, String details) {
        AuditLogDto dto = new AuditLogDto();
        dto.setUser(user);
        dto.setUsername(user);
        dto.setAction(action);
        dto.setResource(resource);
        dto.setStatus(status);
        dto.setDetails(details);
        dto.setMessage(details);
        recordLog(dto);
    }

    private synchronized void recordLogInternal(AuditLogDto auditLog) {
        auditStore.add(0, auditLog);
        while (auditStore.size() > MAX_LOGS) {
            auditStore.remove(auditStore.size() - 1);
        }
    }
}
