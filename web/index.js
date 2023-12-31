// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);

app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.get("/api/orders/count", async (_req, res) => {
  const countOrder = await shopify.api.rest.Order.count({
    session: res.locals.shopify.session,
    status: "any",
  });
  res.status(200).send(countOrder);
});

// Route để lấy số lượng đơn hàng
app.get('/api/order-all', async (req, res) => {
  try {
    // Gọi API để lấy số lượng đơn hàng
    const countOrder = await shopify.api.rest.Order.all({
      session: res.locals.shopify.session,
      status: "any",
    });
    res.status(200).send(countOrder);
  } catch (count) {
    console.error('Error:', count);
    res.status(500).json({ count: 'Error! An error occurred.' });
  }
});

// Route để lấy order details
app.get("/api/order/:uid", async (_req, res) => {
  try {
    const orderInfo = await shopify.api.rest.Order.find({
      session: res.locals.shopify.session,
      id: _req.params.uid,
      fields: "id,line_items,name,total_price",
    });
    res.status(200).send(orderInfo);
  } catch (count) {
    console.error('Error:', count);
    res.status(500).json({ count: 'Error! An error occurred.' });
  }
});

// Route để lấy đơn hàng theo trạng thái đơn hàng
app.get('/api/orders/:status', async (req, res) => {
  const statusFilter = req.params.status;
  try {
    // Lấy đơn hàng từ Shopify qua API
    const filterOrder = await shopify.api.rest.Order.all({
      session: res.locals.shopify.session,
      status: statusFilter,
    });
    res.status(200).send(filterOrder);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route để lấy đơn hàng theo số thứ tự
app.get('/api/orders/:order', async (req, res) => {
  const statusFilter = req.params.status;
  try {
    // Lấy đơn hàng từ Shopify qua API
    const filterOrder = await shopify.api.rest.Order.all({
      session: res.locals.shopify.session,
      status: statusFilter,
    });
    res.status(200).send(filterOrder);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
