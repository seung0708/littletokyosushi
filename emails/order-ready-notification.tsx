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
import { Tailwind } from '@react-email/tailwind';

interface OrderReadyEmailProps {
  order: any;
  customer: any;
}

export default function OrderReadyNotificationEmail({
  order,
  customer,
}: OrderReadyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your order from Little Tokyo Sushi is ready for pickup! 🍣</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Your Order is Ready!
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello {customer.first_name},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Great news! Your order #{order.short_id} is now ready for pickup at Little Tokyo Sushi.
            </Text>
            <Section>
              <Text className="text-black text-[14px] leading-[24px] font-bold">
                Order Details:
              </Text>
              <Text className="text-black text-[14px] leading-[24px]">
                Order Number: #{order.short_id}
              </Text>
              <Text className="text-black text-[14px] leading-[24px]">
                Total Amount: ${order.total.toFixed(2)}
              </Text>
            </Section>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-black text-[14px] leading-[24px]">
              Please come to our restaurant to pick up your order. Don't forget to bring your order number.
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Thank you for choosing Little Tokyo Sushi!
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
