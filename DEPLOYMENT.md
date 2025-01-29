# Little Tokyo Sushi - Deployment Guide

## Prerequisites
- Node.js 18.x or later
- PostgreSQL 14.x or later
- Supabase account
- Stripe account
- Gmail account (for notifications)
- Domain name and SSL certificate

## Environment Setup

1. **Create Environment Files**
   ```bash
   cp .env.example .env.local
   ```
   Fill in all required environment variables:
   - Supabase credentials
   - Stripe API keys
   - Gmail app password
   - Site URLs

2. **Database Setup**
   - Create a new Supabase project
   - Run migrations: `npm run migrate`
   - Seed initial data: `npm run seed`

3. **Email Configuration**
   - Enable 2FA on Gmail account
   - Generate app password
   - Update GMAIL_APP_PASSWORD in .env

4. **Stripe Setup**
   - Create Stripe account
   - Add webhook endpoints
   - Configure success/cancel URLs
   - Set up products/prices

## Production Deployment

1. **Build Application**
   ```bash
   npm run build
   ```

2. **SSL/TLS Setup**
   - Obtain SSL certificate
   - Configure in web server
   - Enable HTTPS redirects

3. **CORS Configuration**
   ```typescript
   // next.config.js
   async headers() {
     return [
       {
         source: '/api/:path*',
         headers: [
           { key: 'Access-Control-Allow-Origin', value: 'your-domain.com' },
           { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
         ],
       },
     ]
   }
   ```

4. **Database Backup Setup**
   ```bash
   # Automated daily backups
   0 0 * * * pg_dump -U postgres littletokyosushi > /backups/backup-$(date +%Y%m%d).sql
   ```

## Post-Deployment Checklist

1. **Verify Environment**
   - [ ] All env vars present
   - [ ] SSL certificate valid
   - [ ] CORS configured
   - [ ] Webhooks responding

2. **Test Critical Flows**
   - [ ] Order placement
   - [ ] Payment processing
   - [ ] Email notifications
   - [ ] Admin operations

3. **Monitoring Setup**
   - [ ] Error logging
   - [ ] Performance monitoring
   - [ ] Database monitoring

4. **Backup Verification**
   - [ ] Daily backups running
   - [ ] Backup restoration tested
   - [ ] Backup retention policy set

## Troubleshooting

### Common Issues

1. **Email Not Sending**
   - Check GMAIL_APP_PASSWORD
   - Verify Gmail 2FA settings
   - Check email service logs

2. **Payment Failures**
   - Verify Stripe webhook status
   - Check Stripe Dashboard logs
   - Confirm API key validity

3. **Database Issues**
   - Check Supabase connection
   - Verify migrations status
   - Check connection pool settings

### Emergency Contacts

- Technical Support: [Your Contact]
- Stripe Support: [Stripe Support URL]
- Supabase Support: [Supabase Support URL]

## Maintenance

### Regular Tasks
1. SSL certificate renewal
2. Database optimization
3. Backup verification
4. Security updates
5. Dependency updates

### Monitoring
1. Set up alerts for:
   - Server errors
   - Payment failures
   - High latency
   - Database issues

## Rollback Procedures

1. **Code Rollback**
   ```bash
   git checkout [previous-version]
   npm install
   npm run build
   ```

2. **Database Rollback**
   ```bash
   # Restore from backup
   psql -U postgres littletokyosushi < /backups/backup-[date].sql
   ```

3. **Environment Rollback**
   - Keep backup of .env files
   - Document all environment changes
