import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
  } from '@react-email/components';
  
  interface PrepTimeNotificationEmailProps {
    order: {
      short_id: string;
      prep_time_minutes: number;
    };
    customer: {
      first_name: string;
    };
  }
  
  export default function PrepTimeNotificationEmail({ order, customer }: PrepTimeNotificationEmailProps) {
    
    return (
      <Html>
        <Head />
        <Preview>Your Little Tokyo Sushi order #{order.short_id.toUpperCase()} is being prepared</Preview>
        <Body style={main}>
          <Container>
            <Heading>Order Status Update</Heading>
            <Text>Hi {customer.first_name},</Text>
            <Text>
              Great news! Your order #{order.short_id.toUpperCase()} is now being prepared by our kitchen.
            </Text>
            <Text>
              Estimated preparation time: {order.prep_time_minutes} minutes
            </Text>
            <Text>
              We'll notify you when your order is ready for pickup.
            </Text>
            <Text>Thank you for choosing Little Tokyo Sushi!</Text>

            <Section style={pickupInfo}>
              <Text style={sectionTitle}>Pickup Information:</Text>
              <Text style={text}>
                Address: 333 S Alameda St, Los Angeles, CA 90013 Ste 100-I
              </Text>
              <Text style={text}>
                Location: Inside Little Tokyo Marketplace, next to the bakery and poki place
              </Text>
            </Section>
          
            <Text style={footer}>
              If you have any questions about your order, please contact us at littletokyosushiinc@gmail.com
            </Text>

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
    maxWidth: '580px',
  };
  
  const h1 = {
    color: '#333',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '30px 0',
    padding: '0',
    textAlign: 'center' as const,
  };
  
  const text = {
    color: '#333',
    fontSize: '16px',
    lineHeight: '24px',
    margin: '16px 0',
  };
  
  const orderDetails = {
    margin: '30px 0',
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '5px',
  };
  
  const orderNumber = {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0 0 16px',
  };
  
  const sectionTitle = {
    fontSize: '16px',
    fontWeight: 'bold',
    margin: '24px 0 16px',
  };
  
  const itemRow = {
    margin: '8px 0',
  };
  
  const itemText = {
    margin: '0',
    color: '#333',
  };
  
  const itemPrice = {
    margin: '0',
    color: '#333',
    textAlign: 'right' as const,
  };
  
  const modifierContainer = {
    marginLeft: '20px',
    marginTop: '4px',
  };
  
  const modifierText = {
    margin: '0',
    color: '#666',
    fontSize: '14px',
  };
  
  const totalsSection = {
    marginTop: '24px',
    borderTop: '1px solid #eee',
    paddingTop: '16px',
  };
  
  const totalRow = {
    margin: '8px 0',
  };
  
  const totalLabel = {
    margin: '0',
    color: '#666',
  };
  
  const totalAmount = {
    margin: '0',
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'right' as const,
  };
  
  const pickupInfo = {
    margin: '30px 0',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '5px',
  };
  
  const footer = {
    color: '#666',
    fontSize: '14px',
    margin: '32px 0 0',
  };
  
