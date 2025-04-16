# Azure Infrastructure Documentation

## Overview
This document outlines the Microsoft Azure infrastructure architecture for the Florida Tax Certificate Sale platform. The infrastructure is designed to be secure, scalable, and compliant with regulatory requirements.

## Architecture

### Resource Groups
- **taxcert-prod-rg**: Production resources
- **taxcert-staging-rg**: Staging resources
- **taxcert-dev-rg**: Development resources
- **taxcert-shared-rg**: Shared resources (monitoring, networking)

### Compute Resources
- **App Service Plans**:
  - **taxcert-prod-plan**: Production applications (Premium v2 P2v2)
  - **taxcert-staging-plan**: Staging applications (Premium v2 P1v2)
  - **taxcert-dev-plan**: Development applications (Standard S1)

- **Web Apps**:
  - **taxcert-frontend-prod**: React frontend application
  - **taxcert-api-prod**: Node.js API application
  - **taxcert-admin-prod**: Admin portal application
  - Corresponding staging and dev instances

### Data Resources
- **Azure Database for PostgreSQL**:
  - **taxcert-db-prod**: Production database (General Purpose, 8 vCores)
  - **taxcert-db-staging**: Staging database (General Purpose, 4 vCores)
  - **taxcert-db-dev**: Development database (Basic, 2 vCores)

- **Azure Redis Cache**:
  - **taxcert-redis-prod**: Production cache (Standard C1)
  - **taxcert-redis-staging**: Staging cache (Basic C0)

- **Azure Storage Accounts**:
  - **taxcertproddata**: Production data storage
  - **taxcertstagedata**: Staging data storage
  - **taxcertdevdata**: Development data storage
  - **taxcertbackups**: Database backups

## Networking

### Virtual Network
- **taxcert-vnet**: Primary virtual network (10.0.0.0/16)
  - **app-subnet**: Application subnet (10.0.1.0/24)
  - **data-subnet**: Database subnet (10.0.2.0/24)
  - **mgmt-subnet**: Management subnet (10.0.3.0/24)

### Application Gateway
- **taxcert-appgw**: Application load balancer and WAF
  - SSL Termination
  - Web Application Firewall (WAF_v2)
  - Multiple listener configurations

### Front Door
- **taxcert-frontdoor**: Global load balancing and CDN
  - Web Application Firewall policies
  - Caching rules for static content
  - Health probe configuration

## Security

### Azure Key Vault
- **taxcert-keyvault**: Secure storage for secrets and certificates
  - Database credentials
  - API keys
  - SSL certificates
  - JWT signing keys

### Network Security
- **Network Security Groups**: Subnet-level access controls
- **Service Endpoints**: Secure connectivity to Azure services
- **Private Endpoints**: Private connectivity to PaaS services
- **DDoS Protection**: Standard protection plan

### Identity and Access
- **Azure AD Integration**: Authentication and directory services
- **Managed Identities**: For service-to-service authentication
- **RBAC**: Role-based access control for all resources
- **Conditional Access**: Context-based security policies

## Monitoring and Observability

### Azure Monitor
- **Metrics Collection**: Infrastructure and application metrics
- **Log Analytics**: Centralized logging solution
- **Dashboards**: Custom monitoring dashboards for operations team

### Application Insights
- **taxcert-insights-prod**: Production monitoring
- **taxcert-insights-staging**: Staging monitoring
- **Performance Monitoring**: Response times, dependency tracking
- **User Analytics**: Usage patterns and user flows
- **Exception Tracking**: Error monitoring and alerting

## Disaster Recovery

### Backup Strategy
- **Database Backups**: Daily full backups, hourly differential
- **Long-term Retention**: 7 years for financial and regulatory compliance
- **Geo-redundant Storage**: For all backup data

### Recovery Plan
- **RTO (Recovery Time Objective)**: < 4 hours for production
- **RPO (Recovery Point Objective)**: < 15 minutes
- **Failover Process**: Documented procedures for manual and automated failover
- **Regular Testing**: Quarterly DR drills

## Compliance and Governance

### Regulatory Compliance
- **PCI DSS**: For payment processing components
- **SOC 2**: Security, availability, and confidentiality
- **Florida State Regulations**: Compliance with state financial regulations

### Governance
- **Azure Policy**: Enforce organizational standards
- **Resource Tags**: Required tags for all resources
  - Environment
  - Department
  - Project
  - Cost Center
  - Owner
- **Azure Blueprints**: Standardized environment configurations
