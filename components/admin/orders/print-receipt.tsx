'use client'
import {format} from 'date-fns';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  itemModifiers?: Array<{
    name: string;
    options: Array<{
      name: string;
    }>;
  }>;
}

interface Order {
  short_id: string;
  created_at: string;
  type: string;
  items: OrderItem[];
  subtotal: number;
  serviceFee: number;
  total: number;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string;
}

export default function PrintReceipt({ order }: { order: Order }) {
  
  return (
    <div id="print-container" style={{
      padding: '8px',
      fontFamily: 'monospace',
      fontSize: '12px',
      lineHeight: 1.3,
      background: 'white',
      color: 'black',
      width: '72mm',
      maxWidth: '72mm',
      overflow: 'hidden',
      margin: '0 auto',
      pageBreakInside: 'avoid',
      pageBreakAfter: 'always',
      boxSizing: 'border-box',
      breakBefore: 'page',
      breakAfter: 'page',
      breakInside: 'avoid'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>LITTLE TOKYO SUSHI</h1>
        <div style={{ fontSize: '16px' }}>#{order.short_id} - {order.type.toUpperCase()}</div>
        <div style={{ fontSize: '14px' }}>
        {order.type === 'pickup' && (
                  <>
                    {format(new Date(order.pickupDate), 'EEEE, MMMM d, yyyy')}{' '}
                    {order.pickupTime && (
                      <>
                        {(() => {
                          const [hours, minutes] = order.pickupTime.split(':');
                          const date = new Date();
                          date.setHours(parseInt(hours, 10));
                          date.setMinutes(parseInt(minutes, 10));
                          return format(date, 'h:mm a');
                        })()}
                      </>
                    )}
                  </>
                )}
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid black', margin: '8px 0' }} />

      {order.items.map((item, index) => (
        <div key={index} style={{ margin: '4px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px' }}>
            <span>{item.quantity}x {item.name}</span>
    
          </div>
          {item.itemModifiers?.map((mod, modIndex) => (
            mod.options.map((opt, optIndex) => (
              <div key={`${modIndex}-${optIndex}`} style={{ paddingLeft: '8px', fontSize: '14px' }}>
                - {opt.name}
              </div>
            ))
          ))}
        </div>
      ))}

      <hr style={{ border: 'none', borderTop: '1px solid black', margin: '8px 0' }} />

      <div style={{ textAlign: 'center', margin: '8px 0', fontSize: '13px' }}>
        <div>{order.customerFirstName} {order.customerLastName}</div>
        {order.customerPhone && <div>{order.customerPhone}</div>}
      </div>

      <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '13px' }}>
        <div>Thank you!</div>
      </div>
    </div>
  );
}
