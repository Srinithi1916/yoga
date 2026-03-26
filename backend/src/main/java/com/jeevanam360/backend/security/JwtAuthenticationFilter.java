package com.jeevanam360.backend.security;

import java.io.IOException;
import java.util.List;

import com.jeevanam360.backend.auth.JwtService;
import com.jeevanam360.backend.auth.UserAccount;
import com.jeevanam360.backend.auth.UserAccountRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserAccountRepository userAccountRepository;

    public JwtAuthenticationFilter(JwtService jwtService, UserAccountRepository userAccountRepository) {
        this.jwtService = jwtService;
        this.userAccountRepository = userAccountRepository;
    }

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {
        String authorizationHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authorizationHeader.substring(7);
        if (!jwtService.isValid(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        String userId = jwtService.extractUserId(token);
        UserAccount user = userAccountRepository.findById(userId).orElse(null);

        if (user == null || !user.isActive()) {
            filterChain.doFilter(request, response);
            return;
        }

        AuthenticatedUser principal = new AuthenticatedUser(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getPhone(),
            user.getRole()
        );

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
            principal,
            null,
            List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
        );
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }
}
