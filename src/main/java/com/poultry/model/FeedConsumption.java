package com.poultry.model;

import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Date;

public class FeedConsumption implements Serializable {
    private static final long serialVersionUID = 1L;
    private int feedId;
    private Date feedDate;
    private int batchId;
    private String feedType;
    private BigDecimal quantityKg;
    private BigDecimal costPerKg;
    private BigDecimal totalCost;
    private String remarks;

    // Joined fields
    private String batchName;
    private String breed;
    private int birdCount;

    public FeedConsumption() {}
    public int getFeedId() { return feedId; }
    public void setFeedId(int feedId) { this.feedId = feedId; }
    public Date getFeedDate() { return feedDate; }
    public void setFeedDate(Date feedDate) { this.feedDate = feedDate; }
    public int getBatchId() { return batchId; }
    public void setBatchId(int batchId) { this.batchId = batchId; }
    public String getFeedType() { return feedType; }
    public void setFeedType(String feedType) { this.feedType = feedType; }
    public BigDecimal getQuantityKg() { return quantityKg; }
    public void setQuantityKg(BigDecimal quantityKg) { this.quantityKg = quantityKg; }
    public BigDecimal getCostPerKg() { return costPerKg; }
    public void setCostPerKg(BigDecimal costPerKg) { this.costPerKg = costPerKg; }
    public BigDecimal getTotalCost() { return totalCost; }
    public void setTotalCost(BigDecimal totalCost) { this.totalCost = totalCost; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public String getBatchName() { return batchName; }
    public void setBatchName(String batchName) { this.batchName = batchName; }
    public int getBirdCount() { return birdCount; }
    public void setBirdCount(int birdCount) { this.birdCount = birdCount; }

    public double getGramsPerBird() {
        if (birdCount <= 0 || quantityKg == null) return 0.0;
        return (quantityKg.doubleValue() * 1000.0) / birdCount;
    }
}