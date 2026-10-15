package com.poultry.model;

import java.io.Serializable;
import java.sql.Date;

public class EggCollection implements Serializable {
    private static final long serialVersionUID = 1L;
    private int collectionId;
    private Date collectionDate;
    private int batchId;
    private int eggQuantity;
    private int brokenEggs;
    private int goodEggs;
    private String remarks;

    // Joined fields
    private String batchName;
    private String breed;
    private int birdCount;

    public EggCollection() {}
    public int getCollectionId() { return collectionId; }
    public void setCollectionId(int collectionId) { this.collectionId = collectionId; }
    public Date getCollectionDate() { return collectionDate; }
    public void setCollectionDate(Date collectionDate) { this.collectionDate = collectionDate; }
    public int getBatchId() { return batchId; }
    public void setBatchId(int batchId) { this.batchId = batchId; }
    public int getEggQuantity() { return eggQuantity; }
    public void setEggQuantity(int eggQuantity) { this.eggQuantity = eggQuantity; }
    public int getBrokenEggs() { return brokenEggs; }
    public void setBrokenEggs(int brokenEggs) { this.brokenEggs = brokenEggs; }
    public int getGoodEggs() { return goodEggs; }
    public void setGoodEggs(int goodEggs) { this.goodEggs = goodEggs; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public String getBatchName() { return batchName; }
    public void setBatchName(String batchName) { this.batchName = batchName; }
    public String getBreed() { return breed; }
    public void setBreed(String breed) { this.breed = breed; }
    public int getBirdCount() { return birdCount; }
    public void setBirdCount(int birdCount) { this.birdCount = birdCount; }

    public double getLayingPercentage() {
        if (birdCount <= 0) return 0.0;
        return ((double) eggQuantity / birdCount) * 100.0;
    }
}