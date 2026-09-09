package com.example.demo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication implements CommandLineRunner {


    private DemoApplication() {
    }

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
    private RazorpayPaymentService paymentService= new RazorpayPaymentService();

    public DemoApplication(RazorpayPaymentService paymentService) {
        this.paymentService = paymentService;
    }



    @Override
    public void run(String... args) throws Exception{
        String payment = paymentService.pay();
        System.out.println("Payment done:"+payment );

    }

}
