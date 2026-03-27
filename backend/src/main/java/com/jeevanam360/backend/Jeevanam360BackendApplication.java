package com.jeevanam360.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableAsync
@EnableScheduling
public class Jeevanam360BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(Jeevanam360BackendApplication.class, args);
    }
}
