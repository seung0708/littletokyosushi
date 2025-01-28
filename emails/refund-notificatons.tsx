import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Text,
  } from '@react-email/components';
  
  interface RefundNotificationEmailProps {
    order: any;
    customer: any;
    refundAmount: number;
  }
  
  export default function RefundNotificationEmail({ order, customer, refundAmount }: RefundNotificationEmailProps) {
    return (
      <Html>
        <Head />
        <Preview>Refund Processed for Your Little Tokyo Sushi Order</Preview>
        <Body style={main}>
          <Container style={container}>
            <Heading style={h1}>Refund Processed</Heading>
            <Text style={text}>Hi {customer.first_name},</Text>
            <Text style={text}>
              We've processed a refund of ${refundAmount.toFixed(2)} for your order #{order.short_id}.
            </Text>
            <Section style={orderSection}>
              <Text style={text}>Refund Details:</Text>
              <Text style={orderNumber}>Order #{order.short_id}</Text>
              <Text style={text}>Refund Amount: ${refundAmount.toFixed(2)}</Text>
            </Section>
            <Text style={text}>
              The refund should appear in your account within 5-10 business days, depending on your bank's processing time.
            </Text>
            <Hr style={hr} />
            <Text style={footer}>© 2024 Little Tokyo Sushi. All rights reserved.</Text>
          </Container>
        </Body>
      </Html>
    );
  }
  
  const main = {
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  };
  
  const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    maxWidth: '560px',
  };
  
  const h1 = {
    color: '#1a1a1a',
    fontSize: '24px',
    fontWeight: '600',
    lineHeight: '32px',
    margin: '16px 0',
    textAlign: 'center' as const,
  };
  
  const text = {
    color: '#4a4a4a',
    fontSize: '16px',
    lineHeight: '24px',
    margin: '16px 0',
  };
  
  const orderSection = {
    margin: '24px 0',
  };
  
  const orderNumber = {
    color: '#1a1a1a',
    fontSize: '14px',
    lineHeight: '24px',
    margin: '8px 0',
    fontFamily: 'monospace',
  };
  
  const hr = {
    borderColor: '#cccccc',
    margin: '20px 0',
  };
  
  const footer = {
    color: '#898989',
    fontSize: '12px',
    lineHeight: '16px',
    margin: '48px 0 8px',
    textAlign: 'center' as const,
  };