# kafka-benchmarking

Benchmarking Kafka with different configurations
100,000 messages

```sh 
produce - send - single producer - (189)s
produce - send - 4 worker threads producer - (71)s
produce - batch (1000) 41KB - single producer - (3.4)s
produce - batch (1000) 41KB - 4 worker threads producer - (2.84)s
produce - batch (1000) 41KB - 4 worker threads producer - (2.84)s
produce - batch (10000) 410KB - 4 worker threads producer - (6.88)s
```
larger batch gets slower 