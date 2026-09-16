package com.payroll.platform.security;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class LoginAttemptService {

    private static final int MAX_ATTEMPTS = 5;
    private static final long LOCKOUT_DURATION_MILLIS = 15 * 60 * 1000; // 15 minutes

    private static class Attempt {
        int failedCount;
        Instant lockedUntil;
    }

    private final ConcurrentHashMap<String, Attempt> attempts = new ConcurrentHashMap<>();

    public boolean isLocked(String email) {
        Attempt attempt = attempts.get(normalize(email));
        if (attempt == null || attempt.lockedUntil == null) {
            return false;
        }
        if (Instant.now().isAfter(attempt.lockedUntil)) {
            attempts.remove(normalize(email));
            return false;
        }
        return true;
    }

    public long secondsUntilUnlock(String email) {
        Attempt attempt = attempts.get(normalize(email));
        if (attempt == null || attempt.lockedUntil == null) {
            return 0;
        }
        return Math.max(0, Instant.now().until(attempt.lockedUntil, ChronoUnit.SECONDS));
    }

    public void recordFailure(String email) {
        Attempt attempt = attempts.computeIfAbsent(normalize(email), k -> new Attempt());
        attempt.failedCount++;
        if (attempt.failedCount >= MAX_ATTEMPTS) {
            attempt.lockedUntil = Instant.now().plusMillis(LOCKOUT_DURATION_MILLIS);
        }
    }

    public void recordSuccess(String email) {
        attempts.remove(normalize(email));
    }

    private String normalize(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }
}