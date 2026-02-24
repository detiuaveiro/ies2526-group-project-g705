package com.example.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/")
    public String hello() {
        return "Hello world!";
    }

    @GetMapping("/hello")
    public String helloAlternative() {
        return "Hello world!";
    }
}
