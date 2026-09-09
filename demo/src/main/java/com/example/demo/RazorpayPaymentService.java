package com.example.demo;

import org.springframework.stereotype.Component;

@Component
public class RazorpayPaymentService {
    public String pay(){
        String payment = "Razorpay Payment";
        System.out.println("Payment from:" +payment);
        return payment;
}}
