import { Page, LegacyCard } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import React from 'react';
export default function ManageCode() {
  const breadcrumbs = [{ content: "Order details", url: "/" }];

  return (
    <Page
      fullWidth
      pagination={{
        hasNext: true,
      }}
    >
      <TitleBar
        title="Orders"
        breadcrumbs={breadcrumbs}
        primaryAction={null}
      />
      <LegacyCard title="Order title" sectioned>
        <p>Order information</p>
      </LegacyCard>
    </Page>
  );
}
