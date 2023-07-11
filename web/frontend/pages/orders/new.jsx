import { Page, LegacyCard } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import React from 'react';
export default function ManageCode() {
  const breadcrumbs = [{ content: "Order App", url: "/" }];

  return (
    <Page
      fullWidth
      pagination={{
        hasNext: true,
      }}
    >
      <TitleBar
        title="Order"
        breadcrumbs={breadcrumbs}
        primaryAction={null}
      />
      <LegacyCard title="Order title" sectioned>
        <p>Order information</p>
      </LegacyCard>
    </Page>
  );
}
