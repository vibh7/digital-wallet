# Project Tree for dWallet

This file shows a graphical tree of the project located at `c:\Users\vikas\Downloads\dWallet`.

```
.dockerignore (if present)
.vscode/
  settings.json

dWallet/  (backend - Maven)
  mvnw
  mvnw.cmd
  pom.xml
  .gitignore
  .gitattributes
  .env
  .mvn/
    wrapper/
      maven-wrapper.properties
  src/
    main/
      resources/
        application.properties
      java/com/vikas/dWallet/
        DWalletApplication.java
        util/
          JwtUtil.java
        service/
          UserService.java
        config/
          JwtRequestFilter.java
          SecurityConfig.java
          WebConfig.java
        controller/
          AuthController.java
          WalletController.java
        dto/
          DepositRequest.java
          TransferRequest.java
          WithdrawRequest.java
          TransactionDTO.java
        model/
          User.java
          Wallet.java
          Transaction.java
        repository/
          UserRepository.java
          WalletRepository.java
          TransactionRepository.java
    test/
      java/com/vikas/dWallet/
        DWalletApplicationTests.java

dwallet-frontend/  (frontend - Vite + React)
  .gitignore
  .env
  README.md
  package.json
  package-lock.json
  index.html
  vite.config.js
  tailwind.config.js
  postcss.config.js
  eslint.config.js
  public/
    vite.svg
  src/
    main.jsx
    App.jsx
    App.css
    index.css
    assets/
      react.svg
    components/
      Dashboard.jsx
      DepositModal.jsx
      TransferModal.jsx
      WithdrawModal.jsx
      Transaction.jsx
      Register.jsx
      Login.jsx
      Home.jsx
      ProfileBlock.jsx
      ErrorBoundary.jsx
```

Generated on 2025-11-12.
