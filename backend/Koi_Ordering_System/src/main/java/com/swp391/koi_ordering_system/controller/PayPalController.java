package com.swp391.koi_ordering_system.controller;

import com.paypal.api.payments.DetailedRefund;
import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import com.swp391.koi_ordering_system.model.FishPayment;
import com.swp391.koi_ordering_system.model.TripPayment;
import com.swp391.koi_ordering_system.repository.FishPaymentRepository;
import com.swp391.koi_ordering_system.repository.TripPaymentRepository;
import com.swp391.koi_ordering_system.service.FishPaymentService;
import com.swp391.koi_ordering_system.service.PayPalService;
import com.swp391.koi_ordering_system.service.TripPaymentService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Collections;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class PayPalController {

    @Autowired
    private TripPaymentService tripPaymentService;

    @Autowired
    private TripPaymentRepository tripPaymentRepository;

    @Autowired
    private FishPaymentService fishPaymentService;

    @Autowired
    private FishPaymentRepository fishPaymentRepository;

    private static final Logger log = LoggerFactory.getLogger(PayPalController.class);
    private final PayPalService payPalService;
    
//    @PostMapping("/payment/create")
//    public RedirectView createPayment(@RequestParam("method") String method ,
//                                      @RequestParam("currency") String currency,
//                                      @RequestParam("amount") String amount,
//                                      @RequestParam("description") String description){
//        try {
//            String cancelURl = "http://localhost:8080/payment/cancel";
//            String successURL = "http://localhost:8080/payment/success";
//
//            Payment payment = payPalService.createPayment(
//                    Double.valueOf(amount), currency,
//                    method, "Sale", description,
//                    cancelURl, successURL);
//
//            for(Links link : payment.getLinks()){
//                if(link.getRel().equals("approval_url")){
//                    return new RedirectView(link.getHref());
//                }
//            }
//
//        }
//        catch (PayPalRESTException e) {
//            log.error("Error Occurred: ", e);
//        }
//
//        return new RedirectView("/payment/error");
//    }
//
//    @GetMapping("/payment/success")
//    public String paymentSuccess(@RequestParam("paymentId") String paymentId,
//                                 @RequestParam("PayerID") String PayerID) {
//        try {
//            Payment payment = payPalService.executePayment(paymentId, PayerID);
//            if(payment.getState().equals("approved")){
//                return "paymentSuccess";
//            }
//        }
//        catch (PayPalRESTException e) {
//            log.error("Error Occurred: ", e);
//        }
//        return "paymentSuccess";
//    }
    
    @PostMapping("{booking_id}/payment/api/create-trippayment")
    public ResponseEntity<?> createAPITripPayment(@PathVariable String booking_id) {
        TripPayment tripPayment = tripPaymentService.createTripPaymentUsingPayPal(booking_id);
        String cancelUrl = "http://localhost:8080/payment/cancel";
        String successUrl = "http://localhost:8080/payment/trippayment/success?booking_id=" + booking_id;

        try {
            Payment payment = payPalService.createPayment(
                    tripPayment.getAmount(), "USD", "PayPal", "Sale", "TripPayment",
                    cancelUrl, successUrl);

            String approvalUrl = payment.getLinks().stream()
                    .filter(link -> "approval_url".equals(link.getRel()))
                    .findFirst()
                    .map(Links::getHref)
                    .orElseThrow(() -> new RuntimeException("Approval URL not found"));

            Map<String, String> response = new HashMap<>();
            response.put("approvalUrl", approvalUrl);
            return ResponseEntity.ok(response);
        } catch (PayPalRESTException e) {
            log.error("PayPal REST Exception occurred while creating payment for bookingId {}: {}", booking_id, e.getMessage());
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error occurred: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "An unexpected error occurred."));
        }
    }

    @GetMapping("/payment/trippayment/success")
    public RedirectView tripPaymentSuccess(@RequestParam("paymentId") String paymentId,
                                     @RequestParam("PayerID") String payerID,
                                     @RequestParam("booking_id") String booking_Id) {
        try {
            Payment payment = payPalService.executePayment(paymentId, payerID);

            TripPayment tripPayment = tripPaymentRepository.findTripPaymentByBookingId(booking_Id);

            if (tripPayment != null) {
                tripPaymentService.updateTripPaymentUsingPayPal(booking_Id);

                if ("approved".equals(payment.getState())) {
                    return new RedirectView("http://localhost:5173/payment"); // Change PORT if needed
                }
            } else {
                log.error("Trip payment not found for bookingId: {}", booking_Id);
            }
        } catch (PayPalRESTException e) {
            log.error("PayPal REST Exception occurred while executing paymentId {}: {}", paymentId, e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error occurred: {}", e.getMessage());
        }
        return new RedirectView("http://localhost:5173/payment"); // Change PORT if needed
    }

    // Fish Payment
    @PostMapping("/{order_id}/payment/api/create-fishpayment")
    public ResponseEntity<?> createAPIFishPayment(@PathVariable String order_id) {
        FishPayment fishPayment = fishPaymentService.createFishPaymentUsingPayPal(order_id);
        String cancelUrl = "http://localhost:8080/payment/cancel";
        String successUrl = "http://localhost:8080/payment/fishpayment/success?order_id=" + order_id;

        try {
            Payment payment = payPalService.createPayment(
                    fishPayment.getAmount()/2, "USD", "PayPal", "Sale", "First Fish Payment",
                    cancelUrl, successUrl);

            String approvalUrl = payment.getLinks().stream()
                    .filter(link -> "approval_url".equals(link.getRel()))
                    .findFirst()
                    .map(Links::getHref)
                    .orElseThrow(() -> new RuntimeException("Approval URL not found"));

            Map<String, String> response = new HashMap<>();
            response.put("approvalUrl", approvalUrl);
            return ResponseEntity.ok(response);
        } catch (PayPalRESTException e) {
            log.error("PayPal REST Exception occurred while creating payment for orderId {}: {}", order_id, e.getMessage());
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error occurred: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "An unexpected error occurred."));
        }
    }

    @PostMapping("/{order_id}/payment/api/update-fishpayment")
    public ResponseEntity<?> updateAPIFishPayment(@PathVariable String order_id) {
        FishPayment fishPayment = fishPaymentRepository.findFishPaymentByFishOrderId(order_id);

        String cancelUrl = "http://localhost:8080/payment/cancel";
        String successUrl = "http://localhost:8080/payment/fishpayment/success?order_id=" + order_id;

        try {
            Payment payment = payPalService.createPayment(
                    fishPayment.getAmount()/2, "USD", "PayPal", "Sale", "First Fish Payment",
                    cancelUrl, successUrl);

            String approvalUrl = payment.getLinks().stream()
                    .filter(link -> "approval_url".equals(link.getRel()))
                    .findFirst()
                    .map(Links::getHref)
                    .orElseThrow(() -> new RuntimeException("Approval URL not found"));

            Map<String, String> response = new HashMap<>();
            response.put("approvalUrl", approvalUrl);
            return ResponseEntity.ok(response);
        } catch (PayPalRESTException e) {
            log.error("PayPal REST Exception occurred while creating payment for orderId {}: {}", order_id, e.getMessage());
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error occurred: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "An unexpected error occurred."));
        }
    }

    @GetMapping("/payment/fishpayment/success")
    private RedirectView fishPaymentSuccess(@RequestParam("paymentId") String paymentId,
                                     @RequestParam("PayerID") String payerID,
                                     @RequestParam("order_id") String order_id) {
        try {
            Payment payment = payPalService.executePayment(paymentId, payerID);

            FishPayment fishPayment = fishPaymentRepository.findFishPaymentByFishOrderId(order_id);

            if (fishPayment != null) {
                fishPaymentService.updateFishPaymentUsingPayPal(order_id);
                fishPayment.setSaleId(payment.getTransactions().get(0)
                        .getRelatedResources().get(0)
                        .getSale().getId());
                fishPaymentRepository.save(fishPayment);

                if ("approved".equals(payment.getState())) {
                    return new RedirectView("http://localhost:5173/mykoi"); // Change PORT if needed
                }
            } else {
                log.error("Trip payment not found for orderId: {}", order_id);
            }
        } catch (PayPalRESTException e) {
            log.error("PayPal REST Exception occurred while executing paymentId {}: {}", paymentId, e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error occurred: {}", e.getMessage());
        }
        return new RedirectView("http://localhost:5173/mykoi"); // Change PORT if needed
    }

    @PostMapping("/{order_id}/api/refund")
    public ResponseEntity<?> refundAPIFishPayment(@PathVariable String order_id) {
        // Retrieve the trip payment details to get the sale ID
        FishPayment fishPayment = fishPaymentRepository.findFishPaymentByFishOrderId(order_id);
        if (fishPayment == null) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Fish payment not found for order ID: " + order_id));
        }

        String saleId = fishPayment.getSaleId(); // Assuming you have stored the sale ID in your TripPayment entity
        String amount = String.format(Locale.US, "%.2f", fishPayment.getAmount()/2);

        try {
            // Call the service to process the refund
            DetailedRefund detailedRefund = payPalService.refundPayment(saleId, amount);

            // Check if the refund was successful
            if ("completed".equals(detailedRefund.getState())) {
                // Update the trip payment status if needed
                fishPayment.setStatus("REFUNDED");
                fishPaymentRepository.save(fishPayment);

                return ResponseEntity.ok(Collections.singletonMap("message", "Refund successful"));
            } else {
                return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Refund not completed: " + detailedRefund.getState()));
            }
        } catch (PayPalRESTException e) {
            log.error("PayPal REST Exception occurred while refunding payment for order Id {}: {}", order_id, e.getMessage());
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error occurred: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "An unexpected error occurred."));
        }
    }

    @GetMapping("/payment/cancel")
    private String paymentCancel(){
        return "paymentCancel";
    }

    @GetMapping("/payment/error")
    private String paymentError(){
        return "paymentError";
    }
}
