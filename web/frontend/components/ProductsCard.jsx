import { 
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
  TextField,
  IndexFilters,
  useSetIndexFiltersMode,
  ChoiceList,
  RangeSlider,
  Link,
  Loading,
  Frame,
} from '@shopify/polaris';
import {useState, useCallback} from 'react';
import { Toast } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { useAppQuery } from "../hooks";

export function ProductsCard() {
  const [isLoading, setIsLoading] = useState(true);
  const [dataOrders, setDataOrders] = useState(true);
  const { t } = useTranslation();

  const {
    data,
    isLoading: isLoadingCount,
  } = useAppQuery({
    url: "/api/order-all",
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

  const orders = data != undefined ? data.data : [];

  const resourceName = {
    singular: 'order',
    plural: 'orders',
  };

  
  const {
    dataFulFilled
  } = useAppQuery({
    url: `/api/orders/fulfilled`,
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });

  const {selectedResources, allResourcesSelected, handleSelectionChange} =
    useIndexResourceState(orders);

  const rowMarkup = orders.map(
    (
      {id, name, created_at, customer, subtotal_price, line_items, financial_status, fulfillment_status},
      index,
    ) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <Link
            dataPrimaryLink
            url={`/orders/${id}`}
            onClick={() => console.log(`Clicked ${name}`)}
          >
            <Text variant="bodyMd" fontWeight="bold" as="span">
              {name}
            </Text>
          </Link>
        </IndexTable.Cell>
        <IndexTable.Cell>{created_at}</IndexTable.Cell>
        <IndexTable.Cell>
          {Object.keys(customer).length === 0 ? 
            'No customer' 
          : 
            `${customer.first_name} ${customer.last_name}`
          }
        </IndexTable.Cell>
        <IndexTable.Cell>{subtotal_price}</IndexTable.Cell>
        <IndexTable.Cell>{line_items.length}</IndexTable.Cell>
        <IndexTable.Cell>{financial_status}</IndexTable.Cell>
        <IndexTable.Cell>
          {fulfillment_status !== null ?
            fulfillment_status 
          : 
            'Unfulfilled'}
          </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  if (isLoading || orders.length <= 0) {
    return (
      <div style={{height: '100px'}}>
        <Frame>
          <Loading />
        </Frame>
      </div>
    );
  }

  return (
    <LegacyCard>
      <div onClick={() => console.log(`Clicked`)}>
      Filter status</div>
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
          {title: 'Items'},
          {title: 'Payment status'},
          {title: 'Fulfillment status'},
        ]}
      >
        {rowMarkup}
      </IndexTable>
    </LegacyCard>
  );
}
