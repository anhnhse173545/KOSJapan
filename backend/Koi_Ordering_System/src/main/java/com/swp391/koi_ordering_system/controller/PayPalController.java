package com.swp391.koi_ordering_system.controller;

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
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Optional;

@Controller
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

    @GetMapping("/PayPal")
    public String index() {
        return "index";
    }

    @GetMapping("/TripPayment")
    public String indexTripPayment() {
        return "TripIndex";
    }

    @GetMapping("/FishPayment")
    public String indexFishPayment() {
        return "FishIndex";
    }

    @GetMapping("/FishPayment/update")
    public String indexUpdateFishPayment() {
        return "FishIndex2";
    }

    @PostMapping("/payment/create")
    public RedirectView createPayment(@RequestParam("method") String method ,
                                      @RequestParam("currency") String currency,
                                      @RequestParam("amount") String amount,
                                      @RequestParam("description") String description){
        try {
            String cancelURl = "http://localhost:8080/payment/cancel";
            String successURL = "http://localhost:8080/payment/success";

            Payment payment = payPalService.createPayment(
                    Double.valueOf(amount), currency,
                    method, "Sale", description,
                    cancelURl, successURL);

            for(Links link : payment.getLinks()){
                if(link.getRel().equals("approval_url")){
                    return new RedirectView(link.getHref());
                }
            }

        }
        catch (PayPalRESTException e) {
            log.error("Error Occurred: ", e);
        }

        return new RedirectView("/payment/error");
    }

    @GetMapping("/payment/success")
    public String paymentSuccess(@RequestParam("paymentId") String paymentId,
                                 @RequestParam("PayerID") String PayerID) {
        try {
            Payment payment = payPalService.executePayment(paymentId, PayerID);
            if(payment.getState().equals("approved")){
                return "paymentSuccess";
            }
        }
        catch (PayPalRESTException e) {
            log.error("Error Occurred: ", e);
        }
        return "paymentSuccess";
    }

    // Trip Payment
    @PostMapping("/payment/create-trippayment")
    public RedirectView createTripPayment(@RequestParam("method") String method,
                                          @RequestParam("currency") String currency,
                                          @RequestParam("description") String description,
                                          @RequestParam("bookingId") String bookingId) {
        TripPayment tripPayment = tripPaymentService.createTripPaymentUsingPayPal(bookingId);
        String cancelUrl = "http://localhost:8080/payment/cancel";
        String successUrl = "http://localhost:8080/payment/trippayment/success?bookingId=" + bookingId;

        try {
            Payment payment = payPalService.createPayment(
                    tripPayment.getAmount(), currency, method, "Sale", description,
                    cancelUrl, successUrl);

            return getApprovalRedirect(payment);
        } catch (PayPalRESTException e) {
            log.error("PayPal REST Exception occurred while creating payment for bookingId {}: {}", bookingId, e.getMessage());
            return new RedirectView("/payment/error");
        } catch (Exception e) {
            log.error("Unexpected error occurred: {}", e.getMessage());
            return new RedirectView("/payment/error");
        }
    }

    private RedirectView getApprovalRedirect(Payment payment) {
        for (Links link : payment.getLinks()) {
            if ("approval_url".equals(link.getRel())) {
                return new RedirectView(link.getHref());
            }
        }
        log.error("Approval URL not found in payment links.");
        return new RedirectView("/payment/error");
    }

    @GetMapping("/payment/trippayment/success")
    public String tripPaymentSuccess(@RequestParam("paymentId") String paymentId,
                                     @RequestParam("PayerID") String payerID,
                                     @RequestParam("bookingId") String bookingId) {
        try {
            Payment payment = payPalService.executePayment(paymentId, payerID);

            TripPayment tripPayment = tripPaymentRepository.findTripPaymentByBookingId(bookingId);

            if (tripPayment != null) {
                tripPaymentService.updateTripPaymentUsingPayPal(bookingId);

                if ("approved".equals(payment.getState())) {
                    return "paymentSuccess";
                }
            } else {
                log.error("Trip payment not found for bookingId: {}", bookingId);
            }
        } catch (PayPalRESTException e) {
            log.error("PayPal REST Exception occurred while executing paymentId {}: {}", paymentId, e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error occurred: {}", e.getMessage());
        }
        return "paymentError";
    }

    // Fish Payment
    @PostMapping("/payment/create-fishpayment")
    public RedirectView createFishPayment(@RequestParam("method") String method,
                                          @RequestParam("currency") String currency,
                                          @RequestParam("description") String description,
                                          @RequestParam("orderId") String orderId) {
        FishPayment fishPayment = fishPaymentService.createFishPaymentUsingPayPal(orderId);
        String cancelUrl = "http://localhost:8080/payment/cancel";
        String successUrl = "http://localhost:8080/payment/fishpayment/success?orderId=" + orderId;

        try {
            Payment payment = payPalService.createPayment(
                    fishPayment.getAmount(), currency, method, "Sale", description,
                    cancelUrl, successUrl);

            return getApprovalRedirect(payment);
        } catch (PayPalRESTException e) {
            log.error("PayPal REST Exception occurred while creating payment for orderId {}: {}", orderId, e.getMessage());
            return new RedirectView("/payment/error");
        } catch (Exception e) {
            log.error("Unexpected error occurred: {}", e.getMessage());
            return new RedirectView("/payment/error");
        }
    }

    @PostMapping("/payment/update-fishpayment")
    public RedirectView updateFishPayment(@RequestParam("method") String method,
                                          @RequestParam("currency") String currency,
                                          @RequestParam("description") String description,
                                          @RequestParam("orderId") String orderId) {
        FishPayment fishPayment = fishPaymentRepository.findFishPaymentByFishOrderId(orderId);
        if(fishPayment == null){
            throw new RuntimeException("Fish payment not found");
        }
        String cancelUrl = "http://localhost:8080/payment/cancel";
        String successUrl = "http://localhost:8080/payment/fishpayment/success?orderId=" + orderId;

        try {
            Payment payment = payPalService.createPayment(
                    fishPayment.getAmount(), currency, method, "Sale", description,
                    cancelUrl, successUrl);

            return getApprovalRedirect(payment);
        } catch (PayPalRESTException e) {
            log.error("PayPal REST Exception occurred while creating payment for orderId {}: {}", orderId, e.getMessage());
            return new RedirectView("/payment/error");
        } catch (Exception e) {
            log.error("Unexpected error occurred: {}", e.getMessage());
            return new RedirectView("/payment/error");
        }
    }

    @GetMapping("/payment/fishpayment/success")
    public String fishPaymentSuccess(@RequestParam("paymentId") String paymentId,
                                     @RequestParam("PayerID") String payerID,
                                     @RequestParam("orderId") String orderId) {
        try {
            Payment payment = payPalService.executePayment(paymentId, payerID);

            FishPayment fishPayment = fishPaymentRepository.findFishPaymentByFishOrderId(orderId);

            if (fishPayment != null) {
                fishPaymentService.updateFishPaymentUsingPayPal(orderId);

                if ("approved".equals(payment.getState())) {
                    return "paymentSuccess";
                }
            } else {
                log.error("Trip payment not found for orderId: {}", orderId);
            }
        } catch (PayPalRESTException e) {
            log.error("PayPal REST Exception occurred while executing paymentId {}: {}", paymentId, e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error occurred: {}", e.getMessage());
        }
        return "paymentError";
    }

    @GetMapping("/payment/cancel")
    public String paymentCancel(){
        return "paymentCancel";
    }

    @GetMapping("/payment/error")
    public String paymentError(){
        return "paymentError";
    }
}
