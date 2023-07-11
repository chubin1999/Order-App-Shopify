import { Card, Page, Layout, SkeletonBodyText, Loading, Frame, LegacyCard, IndexTable } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useAppQuery } from "../../hooks";
import { useLocation } from 'react-router';
import { useState } from 'react';

export default function QRCodeEdit() {
  const breadcrumbs = [{ content: "Order App", url: "/" }];

  const location = useLocation();
  const match = location.pathname.match(/\/(\d+)$/);
  const id = match ? match[1] : null;  

  /*
     These are mock values.
     Set isLoading to false to preview the page without loading markup.
  */
  const [isLoading, setIsLoading] = useState(true);

  /*const {
    order
  } = useAppQuery({
    url: `/api/order/${id}`
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      }
    },
  });*/

  const {
    data,
    isLoading: isLoadingCount,
  } = useAppQuery({
    url: `/api/order/${id}`,
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });

  /* Loading action and markup that uses App Bridge and Polaris components */
  if (isLoading) {
    return (
      <div style={{height: '100px'}}>
        <Frame>
          <Loading />
        </Frame>
      </div>
    );
  }

  const rowMarkup = data.line_items.map(
    (
      {id, name, price, quantity},
      index,
    ) => (
      <LegacyCard.Subsection>
        Id: {id}
        <br />
        Name: {name}
        <br />
        Price: {price}
        <br />
        Quantity: {quantity}
      </LegacyCard.Subsection>
    ),
  );

  return (
    <Page>
      <TitleBar
        title={`${data.name}`}
        breadcrumbs={breadcrumbs}
        primaryAction={null}
      />
      
      <LegacyCard title="ID">
        <LegacyCard.Section>
          <p>{id}</p>
        </LegacyCard.Section>
        <LegacyCard.Section title="Addresses">
          {rowMarkup}
        </LegacyCard.Section>
        <LegacyCard.Section title="Total price">
          <LegacyCard.Subsection>
            {data.total_price}
          </LegacyCard.Subsection>
        </LegacyCard.Section>
      </LegacyCard>
    </Page>
  );
}
