import React from "react";
import { PartyPopper, Printer } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useRouter } from "nextjs-toploader/app";

export const OrderConfirmation = ({ order }) => {
  const { id, user_id, order_status, total_amount, orderLines, shipping_address } = order;
  const router = useRouter();

  // Function to generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    // Set document title
    doc.setFontSize(20);
    doc.text("Order Confirmation", 14, 20);

    // Company Information
    doc.setFontSize(12);
    doc.text("SnapCart", 14, 30);
    // doc.text("Address Line 1", 14, 35);
    // doc.text("Address Line 2", 14, 40);
    // doc.text("Phone Number | Email Address", 14, 45);
    // doc.text("Website URL", 14, 50);

    // Line separator
    doc.line(10, 55, 200, 55);

    // Order Information
    doc.text(`Order Number: ${id}`, 14, 65);
    doc.text(`Order Date: ${new Date().toLocaleDateString()}`, 14, 70);
    doc.text(`Customer: ${user_id}`, 14, 75); // You can replace with actual customer name
    doc.text(`Shipping Address: ${shipping_address?.street}, ${shipping_address?.city}, ${shipping_address?.province} ${shipping_address?.postalCode}, ${shipping_address?.country}`, 14, 80); 
    doc.text(`Payment Method: Credit Card`, 14, 85); // Replace with actual payment method
    doc.text(`Order Status: ${order_status}`, 14, 90);

    // Line separator
    doc.line(10, 95, 200, 95);

    // Product Table
    const columns = ["Product Name", "Quantity", "Price"];
    const rows = orderLines.map((line) => [
      line.product_name, // Assuming `product_name` is part of the order line
      line.quantity,
      `$${line.price}`,
    ]);

    doc.autoTable(columns, rows, { startY: 100 });

    // Total Amount
    doc.text(`Total Amount: $${total_amount}`, 14, doc.lastAutoTable.finalY + 10);

    // Footer (Thank you message)
    doc.setFontSize(12);
    doc.text("Thank you for your order!", 14, doc.lastAutoTable.finalY + 20);

    // Contact Information
    doc.text("For assistance, contact us:", 14, doc.lastAutoTable.finalY + 30);
    doc.text("Phone: [Company Phone Number]", 14, doc.lastAutoTable.finalY + 35);
    doc.text("Email: [Company Email]", 14, doc.lastAutoTable.finalY + 40);

    // Save the PDF
    doc.save("order_confirmation.pdf");
  };

  console.log("Order Confirmation:", order);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <PartyPopper className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Order confirmed</h1>
        </div>
        <p className="text-gray-600">Thank you for your order!</p>
        <p className="text-gray-600">
          Your order <span className="text-gray-900 font-medium">{id}</span> has been placed.
        </p>
        <p className="text-gray-600">
          Order Status: <span className="text-gray-900 font-medium">{order_status}</span>
        </p>
        <p className="text-gray-600">
          Total Amount: <span className="text-gray-900 font-medium">${total_amount}</span>
        </p>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={generatePDF}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 hover:bg-gray-50"
        >
          <Printer className="w-5 h-5" />
          <span>Print confirmation</span>
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        onClick={() => router.push("/user/shop")}>
          Continue shopping
        </button>
      </div>

      <div className="pt-12">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Need assistance?</h2>
        <p className="text-gray-600 mb-2">Ask our customer service</p>
        <p className="text-gray-600 mb-4">Mon to Sun, 5 am to 8 pm PT</p>
        <button className="text-blue-600 hover:text-blue-700">Contact us</button>
      </div>
    </div>
  );
};
