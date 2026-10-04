package com.cloudnexus.security;

import com.cloudnexus.model.User;
import com.cloudnexus.repository.MockDataStore;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final MockDataStore mockDataStore;

    public CustomUserDetailsService(MockDataStore mockDataStore) {
        this.mockDataStore = mockDataStore;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = mockDataStore.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return new CustomUserDetails(user);
    }
}
