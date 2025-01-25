import { printer as ThermalPrinter, types as PrinterTypes } from "node-thermal-printer";

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
  id: string;
  short_id: string;
  type: string;
  status: string;
  created_at: string;
  customerFirstName: string;
  customerLastName: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: number;
  serviceFee: number;
  total: number;
}

export async function printOrder(order: Order) {
  const printer = new ThermalPrinter({
    type: PrinterTypes.STAR,  // TSP100III uses Star commands
    interface: 'tcp://192.168.1.151',  // Replace with your printer's IP address
    options: {
      timeout: 3000,

    },
  });

  try {
    let isConnected = await printer.isPrinterConnected();
    if (!isConnected) {
      throw new Error('Printer not connected');
    }

    // Header
    printer.alignCenter();
    printer.bold(true);
    printer.setTextSize(1, 1);
    printer.println("LITTLE TOKYO SUSHI");
    printer.setTextSize(0, 0);
    printer.println("Order Receipt");
    printer.bold(false);
    printer.newLine();

    // Order Info
    printer.alignLeft();
    printer.println(`Order #: ${order.short_id}`);
    printer.println(`Date: ${new Date(order.created_at).toLocaleString()}`);
    printer.println(`Type: ${order.type.toUpperCase()}`);
    printer.println(`Customer: ${order.customerFirstName} ${order.customerLastName}`);
    if (order.customerPhone) {
      printer.println(`Phone: ${order.customerPhone}`);
    }
    printer.drawLine();

    // Items
    printer.bold(true);
    printer.println("ITEMS:");
    printer.bold(false);

    order.items.forEach((item) => {
      // Item name and quantity
      printer.leftRight(
        `${item.quantity}x ${item.name}`,
        `$${(item.price * item.quantity).toFixed(2)}`
      );
      
      // Print modifiers if any
      if (item.itemModifiers && item.itemModifiers.length > 0) {
        item.itemModifiers.forEach(mod => {
          printer.println(`  ${mod.name}:`);
          mod.options.forEach(opt => {
            printer.println(`    - ${opt.name}`);
          });
        });
      }
      printer.newLine();
    });

    printer.drawLine();

    // Totals
    printer.leftRight("Subtotal:", `$${order.subtotal.toFixed(2)}`);
    printer.leftRight("Service Fee:", `$${order.serviceFee.toFixed(2)}`);
    printer.bold(true);
    printer.leftRight("Total:", `$${order.total.toFixed(2)}`);
    printer.bold(false);

    // Footer
    printer.alignCenter();
    printer.newLine();
    printer.println("Thank you for choosing");
    printer.println("Little Tokyo Sushi!");
    printer.newLine();
    printer.println(new Date().toLocaleString());
    
    // Add some space before cutting
    printer.newLine();
    printer.newLine();
    
    // Cut paper
    printer.cut();

    // Execute print job
    await printer.execute();
    
    return { success: true };
  } catch (error) {
    console.error('Printer error:', error);
    return { success: false, error };
  }
}
