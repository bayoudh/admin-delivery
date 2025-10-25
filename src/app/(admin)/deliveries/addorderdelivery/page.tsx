import CreateOrderDeliveryPage from "@/components/deliveries/addOrderDeliveries";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: 'Create Order Delivery',
  description: 'Create Order Delivery',
}

export default function DeliveriesPages() {

  return (
    

      <CreateOrderDeliveryPage/>
   
  );
}
