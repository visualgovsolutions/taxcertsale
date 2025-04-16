# CI/CD Pipeline Documentation

## Overview
This document outlines the Continuous Integration and Continuous Deployment (CI/CD) pipeline for the Florida Tax Certificate Sale platform. The pipeline is implemented using GitHub Actions and deploys to Microsoft Azure.

## Pipeline Structure

### CI Pipeline (ci.yml)
The Continuous Integration pipeline runs on pull requests and pushes to main branches to ensure code quality and test coverage.

**Steps:**
1. **Code Checkout**: Retrieve the latest code
2. **Environment Setup**: Install dependencies and prepare the build environment
3. **Linting**: Run ESLint and Prettier checks
4. **Unit Testing**: Run Jest tests with coverage report
5. **Integration Testing**: Test API and component integration
6. **Build Verification**: Ensure the application builds correctly
7. **Security Scan**: Check for security vulnerabilities in code and dependencies

### CD Pipeline (cd.yml)
The Continuous Deployment pipeline runs when changes are merged to main or when manually triggered for production deployment.

**Steps:**
1. **Code Checkout**: Retrieve the latest code
2. **Environment Setup**: Install dependencies and prepare the build environment
3. **Build**: Create production-ready build artifacts
4. **Azure Login**: Authenticate with Azure using service principal
5. **Deploy to Staging**: Deploy to staging environment for testing
6. **End-to-End Tests**: Run Cypress tests against staging environment
7. **Deploy to Production**: Upon approval, deploy to production environment
8. **Post-deployment Verification**: Verify the application is running correctly

## Environments

### Development
- **Purpose**: For development and testing of new features
- **Deployment**: Automatic on push to feature branches
- **Infrastructure**: Containerized environments in Azure Container Instances
- **Data**: Test data with no production information

### Staging
- **Purpose**: Pre-production testing and verification
- **Deployment**: Automatic on merge to main branch
- **Infrastructure**: Azure App Service with staging slots
- **Data**: Anonymized copy of production data

### Production
- **Purpose**: Live application used by counties and investors
- **Deployment**: Manual approval after staging verification
- **Infrastructure**: Azure App Service with production slots, Azure SQL Database
- **Data**: Production data with regular backups

## Deployment Strategy

### Blue-Green Deployment
The system uses blue-green deployment for zero-downtime updates:
1. New version is deployed to inactive slot (green)
2. Tests are run against the green slot
3. Traffic is switched from active slot (blue) to green slot
4. The previous blue slot becomes inactive

### Rollback Procedure
In case of deployment issues:
1. Swap back to the previous slot
2. Restore database to pre-deployment snapshot if necessary
3. Run verification tests
4. Document the issue and fix in the next release

## Security and Compliance

### Secret Management
- **Azure Key Vault**: Stores sensitive credentials and secrets
- **GitHub Secrets**: Used for CI/CD pipeline authentication
- **No hardcoded secrets**: All secrets retrieved from secure storage

### Access Control
- **RBAC**: Role-based access control for Azure resources
- **Service Principals**: Limited-permission accounts for CI/CD automation
- **Just-in-time Access**: Temporary elevated permissions when needed

## Monitoring and Alerting

### Application Insights
- Real-time performance monitoring
- Error tracking and logging
- User behavior analytics
- Custom dashboards for different stakeholders

### Azure Monitor
- Infrastructure health monitoring
- Resource utilization tracking
- Automated scaling triggers
- System health dashboards

### Alert Configuration
- Critical error notifications
- Performance degradation alerts
- Security incident notifications
- Deployment status notifications
