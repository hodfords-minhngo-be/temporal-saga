# Temporal Saga Orchestration

A saga orchestration implementation using Temporal framework to manage distributed transactions across microservices.

### About

This project implements the Saga pattern for distributed transactions using Temporal as the orchestration framework. It ensures data consistency across multiple microservices through a sequence of local transactions that can be compensated if any step fails.

### Prerequisites

- Docker and Docker Compose
- Node.js
- npm

### Setup & Installation

1. **Start Temporal Server**
   ```bash
   cd docker
   docker-compose -f temporal-docker-compose.yaml up -d
   ```

2. **Start Required Services**
   ```bash
   cd docker
   docker-compose -f service-docker.yml up -d
   ```
   This will start:
   - Redis
   - PostgreSQL

3. **Start Order Service**
   ```bash
   cd order-microservice
   cp .env.example .env
   npm run start:dev
   ```

4. **Start Order Saga Orchestrator**
   ```bash
   cd order-saga-orchestrator
   cp .env.example .env
   npm run start:dev
   ```

### Testing

To test the setup, run:
```bash
curl localhost:3000/orders
```

### Key Development Principles

> **⚠️ IMPORTANT: Transaction ID Requirements**
> All workflows MUST include a transactionId which serves two critical purposes:
> - Acts as an idempotency key
> - Serves as the identifier for compensation actions in case of failures
> - Must be persisted in the database for all entities created during the saga
> 
> This is crucial for maintaining data consistency and enabling proper rollback mechanisms.

![saga-workflow](/images/workflow-sample.png)
> Pseudo code
```ts
try {
    const compensations = [];
    const transactionId = uuidv4();

    // Step 1: Create Order
    compensations.unshift({
        fn: () => orderService.cancelOrder(transactionId),
    });
    const order = await orderService.createOrder({ transactionId, ...orderData });

    // Step 2: Create Payment
    compensations.unshift({
        fn: () => paymentService.cancelPayment(transactionId),
    });
    const payment = await paymentService.createPayment({ transactionId, ...paymentData });

    // Step 3: Create Shipment
    compensations.unshift({
        fn: () => shipmentService.cancelShipment(transactionId),
    });
    await shipmentService.createShipment({ transactionId, ...shipmentData });

    return order;
} catch (error) {
    for (const compensation of compensations) {
        await compensation.fn();
    }

    throw error;
}
```

- Why we use unshift instead of push?
> Because we want to ensure that the compensations are executed in reverse order of the steps. This is important to maintain consistency and avoid data corruption.

#### Workflow Structure
- A workflow is a unit of actions containing multiple steps (activities)
- Each workflow represents a complete business transaction
- Workflows are defined declaratively and handle the orchestration logic

#### Activity Requirements
- Every activity must have a corresponding compensation activity
- Compensation activities are responsible for rolling back changes if the workflow fails
- Activities should be idempotent whenever possible

#### Sample Workflow
- Refer to `order-saga-orchestrator/src/domains/order/saga/workflows` for a sample workflow implementation
