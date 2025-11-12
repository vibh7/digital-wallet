
package com.vikas.dWallet.dto;

import java.math.BigDecimal;

public class DepositRequest {
    private BigDecimal amount;

    // getters and setters
    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}