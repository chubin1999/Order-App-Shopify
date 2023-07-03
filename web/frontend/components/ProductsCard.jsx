import { useState } from "react";
import { 
  Card, 
  TextContainer, 
  Text,
  IndexTable,
  Stack,
  TextStyle,
  Thumbnail,
  UnstyledLink,
  LegacyCard,
  useIndexResourceState,
  Badge,
} from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { useAppQuery } from "../hooks";

export function ProductsCard() {
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  const {
    data,
    isLoading: isLoadingCount,
  } = useAppQuery({
    url: "/api/order-count",
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });

   /*const {
    data,
    refetch: refetchProductCount,
    isLoading: isLoadingCount,
    isRefetching: isRefetchingCount,
  } = useAppQuery({
    url: "/api/products/count",
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });*/

  const orders = data != undefined ? data.data : [
    {
      id: '1020',
      name: '#1020',
      created_at: 'Jul 20 at 4:34pm',
      customer: 'Jaydon Stanton',
      subtotal_price: '$969.44',
      financial_status: <Badge progress="complete">Paid</Badge>,
      fulfillment_status: <Badge progress="incomplete">Unfulfilled</Badge>,
    }
  ];

  const resourceName = {
    singular: 'order',
    plural: 'orders',
  };

  const {selectedResources, allResourcesSelected, handleSelectionChange} =
    useIndexResourceState(orders);

  const rowMarkup = orders.map(
    (
      {id, name, created_at, customer, subtotal_price, financial_status, fulfillment_status},
      index,
    ) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {name}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{created_at}</IndexTable.Cell>
        <IndexTable.Cell>{'No customer'}</IndexTable.Cell>
        <IndexTable.Cell>{subtotal_price}</IndexTable.Cell>
        <IndexTable.Cell>{financial_status}</IndexTable.Cell>
        <IndexTable.Cell>{fulfillment_status !== null ? fulfillment_status : 'Unfulfilled'}</IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  if (isLoading) {
    return 'null';
  }

  return (
    <LegacyCard>
      <IndexTable
        resourceName={resourceName}
        itemCount={orders.length}
        selectedItemsCount={
          allResourcesSelected ? 'All' : selectedResources.length
        }
        onSelectionChange={handleSelectionChange}
        headings={[
          {title: 'Order'},
          {title: 'Date'},
          {title: 'Customer'},
          {title: 'Total', alignment: 'start'},
          {title: 'Payment status'},
          {title: 'Fulfillment status'},
        ]}
      >
        {rowMarkup}
      </IndexTable>
    </LegacyCard>
  );
}
