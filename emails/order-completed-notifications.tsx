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
  
  interface OrderCompletedEmailProps {
    order: any;
    customer: any;
  }
  
  export default function OrderCompletedEmail({ order, customer }: OrderCompletedEmailProps) {
    return (
      <Html>
        <Head />
        <Preview>Your Little Tokyo Sushi order is completed!</Preview>
        <Body style={main}>
          <Container style={container}>
            <Heading style={h1}>Order Completed</Heading>
            <Text style={text}>Hi {customer.first_name},</Text>
            <Text style={text}>
              Your order #{order.short_id} is now completed. Thank you for choosing Little Tokyo Sushi!
            </Text>
            <Section style={orderSection}>
              <Text style={text}>Order Details:</Text>
              <Text style={orderNumber}>Order #{order.short_id}</Text>
            </Section>
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