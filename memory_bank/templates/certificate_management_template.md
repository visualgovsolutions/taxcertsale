# Certificate Management - Component Template

## Component Overview

The Certificate Management system is responsible for the entire lifecycle of tax certificates from creation through redemption. It manages certificate data, status transitions, document generation, and provides certificate information to other system components. This system ensures compliance with Florida regulations for tax certificates.

## Architecture

```mermaid
C4Context
    title Certificate Management Architecture

    Person(county_admin, "County Administrator", "Manages certificates for county")
    Person(investor, "Certificate Investor", "Purchases and manages certificates")
    Person(property_owner, "Property Owner", "Redeems tax certificates")
    
    System_Boundary(certificate_system, "Certificate Management System") {
        Container(certificate_service, "Certificate Service", "Node.js + Express", "Manages certificate lifecycle and operations")
        Container(document_generator, "Document Generator", "TypeScript + PDF Libraries", "Creates certificate documents")
        Container(state_machine, "Certificate State Machine", "TypeScript", "Controls certificate status transitions")
        Container(import_processor, "Import Processor", "Node.js", "Processes county data imports")
        ContainerDb(certificate_db, "Certificate Database", "PostgreSQL", "Stores certificate data and history")
    }
    
    System_Ext(auction, "Auction System", "Manages bidding on certificates")
    System_Ext(payment, "Payment Processing", "Handles certificate payments")
    System_Ext(property, "Property System", "Provides property information")
    
    Rel(county_admin, import_processor, "Imports certificate data via", "Web UI")
    Rel(county_admin, certificate_service, "Manages certificates via", "Web UI")
    Rel(investor, certificate_service, "Views certificates via", "Web UI")
    Rel(property_owner, certificate_service, "Redeems certificates via", "Web UI")
    
    Rel(certificate_service, state_machine, "Uses for status management", "Internal API")
    Rel(certificate_service, document_generator, "Requests documents from", "Internal API")
    Rel(certificate_service, certificate_db, "Stores data in", "SQL")
    
    Rel(import_processor, certificate_db, "Imports data to", "SQL")
    Rel(import_processor, property, "Validates against", "API")
    
    Rel(auction, certificate_service, "Updates certificate status via", "API")
    Rel(payment, certificate_service, "Triggers status changes via", "API")
    
    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```
