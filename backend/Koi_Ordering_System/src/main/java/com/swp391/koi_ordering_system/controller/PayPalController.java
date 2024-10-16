package com.swp391.koi_ordering_system.controller;

import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.api.payments.Transaction;
import com.paypal.base.rest.PayPalRESTException;
import com.swp391.koi_ordering_system.model.TripPayment;
import com.swp391.koi_ordering_system.service.PayPalService;
import com.swp391.koi_ordering_system.service.TripPaymentService;
import com.swp391.koi_ordering_system.service.TripService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.view.RedirectView;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class PayPalController {

    @Autowired
    private TripPaymentService tripPaymentService;

    private static final Logger log = LoggerFactory.getLogger(PayPalController.class);
    private final PayPalService payPalService;

    @GetMapping("/PayPal")
    public String index() {
        return "index";
    }

    @PostMapping("/payment/create") //Create Payment for PayPal to handle (for Trip Payment)
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

    @GetMapping("/payment/cancel")
    public String paymentCancel(){
        return "paymentCancel";
    }

    @GetMapping("/payment/error")
    public String paymentError(){
        return "paymentError";
    }

//    @GetMapping("/payment/success/{tripPayment_id}") //Execute the Payment
//    public String paymentSuccess(@RequestParam("paymentId") String paymentId,
//                                 @RequestParam("PayerID") String PayerID,
//                                 @PathVariable String tripPayment_id){
//        try {
//            Payment payment = payPalService.executePayment(paymentId, PayerID);
//
//            List<Transaction> list= payment.getTransactions();
//            String searchTripPayment = "Trip Payment";
//            Transaction tripTransaction = new Transaction();
//            for(Transaction transaction : list){
//                if (transaction.getDescription().equals(searchTripPayment)) {
//                    tripTransaction = transaction;
//                    break;
//                }
//            }
//            tripPaymentService.updateTripPaymentUsingPaypal(tripPayment_id, tripTransaction, payment);
//
//            if(payment.getState().equals("approved")){
//                return "paymentSuccess";
//            }
//        }
//        catch (PayPalRESTException e) {
//            log.error("Error Occurred: ", e);
//        }
//        return "paymentSuccess";
//    }



}
