package com.event.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Table(name = "bookings")
public class BookingEntity {

    @Id
    @Column(name = "id", length = 100, nullable = false)
    private String id = UUID.randomUUID().toString();  // Generate unique ID

    @Column(name = "userId", length = 100)
    private String userId;

    @Column(name = "eventId", length = 100)
    private String eventId;

    @Column(name = "paymentId", length = 100)
    private String paymentId;

    @Column(name = "seatsBooked", nullable = false)
    private int seatsBooked;

    @Column(name = "totalAmount", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "bookingDate", nullable = false, updatable = false)
    private Timestamp bookingDate = new Timestamp(System.currentTimeMillis());

    @Column(name = "status", length = 20)
    private String status = "BOOKED"; // default value

    public BookingEntity() {
        super();
    }

    public BookingEntity(String userId, String eventId, String paymentId, int seatsBooked, BigDecimal totalAmount, String status) {
        this.id = UUID.randomUUID().toString();
        this.userId = userId;
        this.eventId = eventId;
        this.paymentId = paymentId;
        this.seatsBooked = seatsBooked;
        this.totalAmount = totalAmount;
        this.status = (status != null) ? status : "BOOKED";
    }

    // Getters & Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public int getSeatsBooked() {
        return seatsBooked;
    }

    public void setSeatsBooked(int seatsBooked) {
        this.seatsBooked = seatsBooked;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

//    public Timestamp getBookingDate() {
//        return bookingDate;
//    }
//
//    public void setBookingDate(Timestamp bookingDate) {
//        this.bookingDate = bookingDate;
//    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
