package com.cloudnexus;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Spring Boot application context integration test.
 *
 * <p>Verifies that the entire Spring application context loads successfully,
 * all beans are wired correctly, and the security configuration initialises
 * without errors. This is the baseline sanity-check that must pass before
 * every commit.</p>
 */
@SpringBootTest
@ActiveProfiles("test")
class CloudNexusApplicationTests {

    /**
     * Validates that the Spring application context loads without any errors.
     * If any required bean is missing, misconfigured, or the JWT config is
     * broken, this test will fail with a meaningful error.
     */
    @Test
    void contextLoads() {
        // If the context fails to load this test will throw an exception automatically.
    }
}
