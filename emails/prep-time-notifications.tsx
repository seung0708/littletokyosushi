import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Text,
  } from '@react-email/components';
  
  interface PrepTimeNotificationEmailProps {
    order: {
      short_id: string;
      prep_time: number;
    };
    customer: {
      name: string;
    };
  }
  
  export default function PrepTimeNotificationEmail({ order, customer }: PrepTimeNotificationEmailProps) {
    return (
      <Html>
        <Head />
        <Preview>Your Little Tokyo Sushi order #{order.short_id} is being prepared</Preview>
        <Body style={main}>
          <Container>
            <Heading>Order Status Update</Heading>
            <Text>Hi {customer.name},</Text>
            <Text>
              Great news! Your order #{order.short_id} is now being prepared by our kitchen.
            </Text>
            <Text>
              Estimated preparation time: {order.prep_time} minutes
            </Text>
            <Text>
              We'll notify you when your order is ready for pickup.
            </Text>
            <Text>Thank you for choosing Little Tokyo Sushi!</Text>
          </Container>
        </Body>
      </Html>
    );
  }
  
  const main = {
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  };