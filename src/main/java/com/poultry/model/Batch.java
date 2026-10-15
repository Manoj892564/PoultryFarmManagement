package com.poultry.model;

import java.io.Serializable;
import java.sql.Date;
import java.time.LocalDate;

public class Batch implements Serializable {
    private static final long serialVersionUID = 1L;
    private int batchId;
    private String batchName;
    private String breed;
    private int birdCount;
    private Date arrivalDate;
    private String status;

    public Batch() {}
    public int getBatchId() { return batchId; }
    public void setBatchId(int batchId) { this.batchId = batchId; }
    public String getBatchName() { return batchName; }
    public void setBatchName(String batchName) { this.batchName = batchName; }
    public String getBreed() { return breed; }
    public void setBreed(String breed) { this.breed = breed; }
    public int getBirdCount() { return birdCount; }
    public void setBirdCount(int birdCount) { this.birdCount = birdCount; }
    public Date getArrivalDate() { return arrivalDate; }
    public void setArrivalDate(Date arrivalDate) { this.arrivalDate = arrivalDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getFormattedAge() {
        if (arrivalDate == null) return "N/A";
        long totalDays = java.time.temporal.ChronoUnit.DAYS.between(arrivalDate.toLocalDate(), LocalDate.now());
        if (totalDays < 0) return "Upcoming";
        return (totalDays / 7) + " wks, " + (totalDays % 7) + " days";
    }
}