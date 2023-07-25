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
  Button,
  Popover,
  ActionList,
} from '@shopify/polaris';
import {useState, useCallback} from 'react';
import { Toast } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { useAppQuery } from "../hooks";

export function ProductsCard() {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([])
  const { t } = useTranslation();

  const {
    data,
    isLoading: isLoadingCount,
  } = useAppQuery({
    url: "/api/order-all",
    reactQueryOptions: {
      onSuccess: () => {
        setOrders(data != undefined ? data.data : []);
        setIsLoading(false);
      },
    },
  });

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

  const [active, setActive] = useState(true);

  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const activator = (
    <Button onClick={toggleActive} disclosure>
      Filter
    </Button>
  );

  const handleFulfilledAction = () => {
    setIsLoading(true);
    setOrders([])
    setTimeout(function(){
      setIsLoading(false);
      const filteredObjects = orders.filter((object) => object.fulfillment_status === 'fulfilled');
      setOrders(filteredObjects);
    }, 2000);
  };

  const handleUnfulfilledAction = () => {
    setIsLoading(true);
    setOrders([])
    setTimeout(function(){
      setIsLoading(false);
      const filteredObjects = orders.filter((object) => object.fulfillments.lenght === 0 || object.fulfillment_status === null);
      setOrders(filteredObjects);
    }, 2000);
  };

  const handlePaidAction = () => {
    setIsLoading(true);
    setOrders([])
    setTimeout(function(){
      setIsLoading(false);
      const filteredObjects = orders.filter((object) => object.financial_status === 'paid');
      setOrders(filteredObjects);
    }, 2000);
  };

  const handleUnPaidAction = () => {
    setIsLoading(true);
    setOrders([])
    setTimeout(function(){
      setIsLoading(false);
      const filteredObjects = orders.filter((object) => object.financial_status === 'unpaid' || object.financial_status === null);
      setOrders(filteredObjects);
    }, 2000);
  };

  const clearFilter = () => {
    setIsLoading(true);
    setOrders([])
    setTimeout(function(){
      setIsLoading(false);
      setOrders(data != undefined ? data.data : []);
    }, 2000);
  };

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
            onClick={() => console.log('redirect')}
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

  if (isLoading) {
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
      <div style={{height: 'auto', display: 'flex', 'align-items': 'center', gap: '20px'}}>
        <Popover
          active={active}
          activator={activator}
          autofocusTarget="first-node"
          onClose={toggleActive}
        >
          <ActionList
            actionRole="menuitem"
            items={[
              {
                content: 'Fulfilled',
                onAction: handleFulfilledAction,
              },
              {
                content: 'Unfulfilled',
                onAction: handleUnfulfilledAction,
              },
              {
                content: 'Paid',
                onAction: handlePaidAction,
              },
              {
                content: 'Unpaid',
                onAction: handleUnPaidAction,
              },
            ]}
          />
        </Popover>
        <div onClick={clearFilter}>Clear status</div>
      </div>
      {orders.length <= 0 ? (
        <LegacyCard title="Fails" sectioned>
          <p>Do not see the results</p>
        </LegacyCard>
      ) : (
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
      )}
    </LegacyCard>
  );
}
