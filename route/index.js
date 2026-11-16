const express = require("express");
const router = express.Router();
const apiRouter = require("./api/index");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger-output.json');

const api = process.env.BASE_URL || `/api/v1`;

router.use(api, apiRouter);

swaggerDocument.basePath = api;

swaggerDocument.securityDefinitions = {
  bearerAuth: {
    type: "apiKey",
    name: "Authorization",
    in: "header",
    description: "Enter your token in the format: Bearer <token>"
  }
};

Object.entries(swaggerDocument.paths).forEach(([path, operations]) => {
  const requireAuth =
    path === "/auth/login" ||
    path.startsWith("/class/") ||
    path.startsWith("/admin/") ||
    path.startsWith("/subject/");

  if (requireAuth) {
    Object.values(operations).forEach((operation) => {
      operation.security = [{ bearerAuth: [] }];
    });
  }
});

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

router.use("/api/v2", apiRouter);

module.exports = router;

