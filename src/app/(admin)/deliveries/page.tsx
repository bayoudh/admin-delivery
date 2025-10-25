import DeliveryOrdersManagement from "@/components/deliveries/cmsDeliveries";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: 'Deliver Orders',
  description: 'Manager Deliver Orders',
}

export default function DeliveriesPages() {

  return (
    

      <DeliveryOrdersManagement/>
   
  );
}
