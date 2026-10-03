package com.cloudnexus.security;

import com.cloudnexus.dto.LoginRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthSecurityTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtService jwtService;

    @Test
    @DisplayName("1. Valid Login - Admin receives JWT and ADMIN role")
    void testValidAdminLogin() throws Exception {
        LoginRequest request = new LoginRequest("admin", "Admin@123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").isNotEmpty())
                .andExpect(jsonPath("$.data.username").value("admin"))
                .andExpect(jsonPath("$.data.role").value("ADMIN"));
    }

    @Test
    @DisplayName("2. Valid Login - Viewer receives JWT and VIEWER role")
    void testValidViewerLogin() throws Exception {
        LoginRequest request = new LoginRequest("viewer", "Viewer@123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").isNotEmpty())
                .andExpect(jsonPath("$.data.username").value("viewer"))
                .andExpect(jsonPath("$.data.role").value("VIEWER"));
    }

    @Test
    @DisplayName("3. Invalid Login - Bad credentials returns 401 Unauthorized")
    void testInvalidLogin() throws Exception {
        LoginRequest request = new LoginRequest("admin", "WrongPassword999");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("4. Missing Token - Protected endpoint rejects with 401")
    void testMissingTokenProtectedEndpoint() throws Exception {
        mockMvc.perform(get("/api/vpcs"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message", containsString("Unauthorized")));
    }

    @Test
    @DisplayName("5. Invalid Token - Bogus token string rejects with 401")
    void testInvalidTokenProtectedEndpoint() throws Exception {
        mockMvc.perform(get("/api/vpcs")
                        .header("Authorization", "Bearer this.is.an.invalid.jwt.token"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("6. Expired or Malformed Token - Rejects with 401")
    void testMalformedTokenProtectedEndpoint() throws Exception {
        mockMvc.perform(get("/api/dashboard/summary")
                        .header("Authorization", "Bearer not-a-valid-jwt"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("7. ADMIN Access - Valid Admin JWT allows access to protected GET endpoints")
    void testAdminAccessToProtectedGetEndpoint() throws Exception {
        String token = jwtService.generateToken("admin", "ROLE_ADMIN");

        mockMvc.perform(get("/api/vpcs")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("8. VIEWER Access - Valid Viewer JWT allows read-only access")
    void testViewerAccessToProtectedGetEndpoint() throws Exception {
        String token = jwtService.generateToken("viewer", "ROLE_VIEWER");

        mockMvc.perform(get("/api/vpcs")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("9. Forbidden Access - VIEWER attempting restricted mutation endpoint gets 403")
    void testViewerForbiddenOnMutationEndpoint() throws Exception {
        String viewerToken = jwtService.generateToken("viewer", "ROLE_VIEWER");

        mockMvc.perform(post("/api/vpcs")
                        .header("Authorization", "Bearer " + viewerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success").value(false));
    }
}
