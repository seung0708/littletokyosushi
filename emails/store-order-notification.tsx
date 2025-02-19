import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Row,
  Column,
} from '@react-email/components';
import { format } from 'date-fns';
import { Order, OrderItem, OrderItemModifier } from '@/types/order';
import { Customer } from '@/types/customer';

interface StoreOrderNotificationEmailProps {
  order: Order;
  customer: Customer;
}

export default function StoreOrderNotificationEmail({ order, customer }: StoreOrderNotificationEmailProps) {
  const totalAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(order.total);

  return (
    <Html>
      <Head />
      <Preview>New Order #{order?.short_id?.toUpperCase() || ''} - ${totalAmount}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Order Received!</Heading>
          
          <Section style={orderDetails}>
            <Text style={orderNumber}>Order #{order.short_id?.toUpperCase()}</Text>
            <Text style={text}>
              <strong>Pickup Time:</strong> {format(new Date(order.pickup_date.split('+')[0]), 'EEE, M/d/yy')} at {order.pickup_time}
            </Text>

            <Text style={sectionTitle}>Customer Information:</Text>
            <Text style={text}>
              Name: {customer.first_name} {customer.last_name}<br />
              Phone: {customer.phone}<br />
              Email: {customer.signinEmail || customer.guestEmail}
            </Text>
            
            <Text style={sectionTitle}>Order Items:</Text>
            {order.order_items.map((item: OrderItem, index) => (
              <div key={index}>
                <Row style={itemRow}>
                  <Column>
                    <Text style={itemText}>
                      {item.quantity} x {item.item_name}
                    </Text>
                    {item.order_item_modifiers?.map((modifier: OrderItemModifier) => (
                      <Text key={modifier.modifier_name} style={modifierText}>
                        • {modifier.modifier_name}:
                        {modifier.order_item_modifier_options.map(option => 
                          ` ${option.option_name}`
                        ).join(', ')}
                      </Text>
                    ))}
                  </Column>
                </Row>
              </div>
            ))}

            <Section style={totalsSection}>
              <Text style={text}>
                <strong>Subtotal:</strong> ${order.sub_total.toFixed(2)}<br />
                <strong>Service Fee:</strong> ${order.service_fee.toFixed(2)}<br />
                <strong>Total:</strong> ${order.total.toFixed(2)}
              </Text>
            </Section>
          </Section>
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
  maxWidth: '600px',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.25',
  marginBottom: '24px',
  textAlign: 'center' as const,
};

const text = {
  color: '#1a1a1a',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '12px 0',
};

const orderDetails = {
  padding: '24px',
  backgroundColor: '#f7f7f7',
  borderRadius: '12px',
};

const orderNumber = {
  fontSize: '18px',
  fontWeight: 'bold',
  marginBottom: '12px',
};

const sectionTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  marginTop: '24px',
  marginBottom: '8px',
};

const itemRow = {
  marginBottom: '12px',
};

const itemText = {
  ...text,
  fontWeight: '500',
};

const modifierText = {
  ...text,
  marginLeft: '20px',
  color: '#4a4a4a',
};

const totalsSection = {
  marginTop: '24px',
  paddingTop: '24px',
  borderTop: '1px solid #e6e6e6',
};
