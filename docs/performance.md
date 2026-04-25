# Performance & Load Testing Report

This document records the results of the `k6` load test run and provides analysis of performance metrics.

## Test scenario

- Script: `load-tests/comprehensive-test.js`
- Execution type: local
- Maximum VUs: 50
- Total duration: 10 minutes
- Stages: 4 stages with graceful ramp down and graceful stop

## Key Metrics

- Total requests: 62,475
- Total checks executed: 62,474
- Checks succeeded: 100.00%
- Checks failed: 0.00%

- Average response time: 237.23 ms
- Median response time: 99.05 ms
- P90 response time: 711.44 ms
- P95 response time: 966.92 ms
- Maximum response time: 2,746.85 ms

- Throughput: 103.87 requests/sec
- Failed HTTP requests: 5.89% (3,686 / 62,475)

- Network data received: 2.2 GB
- Network data sent: 23 MB

## Observations

- Application-level checks all passed, meaning functional validation succeeded for every monitored endpoint.
- The 95th percentile latency is below 1,000 ms, meeting the threshold specified in the load report.
- Maximum response time reached 2.74 seconds, indicating occasional slow paths under peak load.
- The HTTP failure rate of 5.89% should be investigated; possible causes include rate limiting, intermittent network issues, or backend timeouts.

## Successful Workflows

All of the following scenario checks passed during the load test:

- User registration and login
- Root endpoint availability
- Incident, report, checkpoint, and weather retrieval
- External weather and routing calls
- Profile retrieval
- Report creation, incident creation, checkpoint creation
- Alert subscription and retrieval
- Route estimation and external routing calls
- Report detail retrieval and voting operations
- Report votes retrieval and logs retrieval
- Incident and checkpoint updates

## Performance Analysis

### Strengths

- Good average latency for a mixed workload: ~237 ms.
- Stable p95 latency under 1 second for the majority of requests.
- Solid coverage of read and write endpoints in one comprehensive scenario.

### Areas for improvement

- Investigate the 5.89% failed HTTP request rate and identify whether failures are due to `429`, backend timeouts, or service dependencies.
- Reduce the maximum response time by optimizing the slowest request paths, especially any calls involving external dependencies.
- Add targeted spike and soak tests alongside the comprehensive scenario to capture sustained behavior over longer windows.

## Recommendations

1. Add request-level instrumentation and logging for failed requests.
2. Review external API call timeouts and retry policies.
3. Enable database connection pooling and query profiling for high concurrency.
4. Use caching for frequently requested external weather/routing results.
5. Run dedicated spike tests for burst traffic and soak tests for longer duration.

## Summary

The system is functionally correct under load and demonstrates acceptable average and P95 latency for the tested scenario. The primary documentation and load test assets are stored in the repository under `docs/` and `load-tests/`.
