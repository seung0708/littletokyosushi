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
import { Order, OrderItem, OrderItemModifier, OrderItemModifierOption } from '@/types/order';
import { Customer } from '@/types/customer';

interface OrderConfirmationEmailProps {
  order: Order;
  customer: Customer;
}

export default function OrderConfirmationEmail({ order, customer }: OrderConfirmationEmailProps) {

  return (
    <Html>
      <Head />
      <Preview>Your Little Tokyo Sushi order confirmation #{order?.short_id?.toUpperCase() || ''}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Thank you for your order!</Heading>
          
          <Text style={text}>Hi {customer.first_name},</Text>
          <Text style={text}>Here are your order details:</Text>

          <Section style={orderDetails}>
            <Text style={orderNumber}>Order #{order.short_id?.toUpperCase()}</Text>
            <Text style={text}>
            Pickup Time: {format(new Date(order.pickup_date.split('+')[0]), 'EEE, M/d/yy')} at {order.pickup_time}
            </Text>
            
            <Text style={sectionTitle}>Order Items:</Text>
            {order.order_items.map((item: OrderItem, index) => (
              <div key={index}>
                <Row style={itemRow}>
                  <Column>
                    <Text>
                      {item.quantity} x {item.item_name}
                    </Text>
                    {item.order_item_modifiers?.map((modifier: OrderItemModifier) => (
                      <Text key={modifier.modifier_name}>
                        {modifier.modifier_name}:
                        {modifier.order_item_modifier_options?.map((option: OrderItemModifierOption) => (
                          <Text key={option.option_name}>
                            • {option.option_name} (+${option.option_price.toFixed(2)})
                          </Text>
                        ))}
                      </Text>
                    ))}
                    {item.special_instructions && (
                      <Text>
                        Special Instructions: {item.special_instructions}
                      </Text>
                    )}
                  </Column>
                  <Column align="right">
                    <Text>${item.price.toFixed(2)}</Text>
                  </Column>
                </Row>
              </div>
            ))}

            <Section style={totalsSection}>
              <Row style={totalRow}>
                <Column><Text style={totalLabel}>Subtotal:</Text></Column>
                <Column><Text style={totalAmount}>${order.sub_total.toFixed(2)}</Text></Column>
              </Row>
              <Row style={totalRow}>
                <Column><Text style={totalLabel}>Service Fee:</Text></Column>
                <Column><Text style={totalAmount}>${order.service_fee.toFixed(2)}</Text></Column>
              </Row>
              <Row style={totalRow}>
                <Column><Text style={totalLabel}>Total:</Text></Column>
                <Column><Text style={totalAmount}>${order.total.toFixed(2)}</Text></Column>
              </Row>
            </Section>
          </Section>

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
