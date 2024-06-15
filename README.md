# Porchplus backend assessment (Fitness+ Gym use-case)

Working out at the gym requires a lot of patience and hard work, and so does building a billing software for reminding gym members of their upcoming payments.

 Fitness+ gym billing software takes into account the various offerings the gym has for members. This implemetation makes the following assumptions and thus, their design implications:

## Assumptions and Design Implications

- **Assumption One**: A member can subscribe for a one-time annual membership (basic or premium), and add several add-ons to the membership plan.

  - **Design Implication**: In addition to a `members` table (See model [here](./src/member/member.model.ts)) that stores the basic information and main subscription plan, a `subscriptions` table (See model [here](./src/subscription/subscription.model.ts)) that stores various add-ons services rendered by Fitness+ gym.

    Each member can have many subscriptions, hence the `members` table share a **one-many** relationship with the `subscriptions` table.

- **Assumption Two**: Running daily cron jobs and scheduling email deliveries on the same server are bound to increase response latency as we can't determine when user requests are bound to spike.

  - **Design Implication**: To improve system scalability, RabbitMQ message broker was introduced. A [CronService](./src/cron/cron.service.ts) class does the heavy lifting by using dependency injection to access the methods in the [MemberService](./src/member/member.service.ts) class, then subscribes to events provided by the [EmailController](./src/email/email.controller.ts) class through the RabbitMQ message broker.

  Email templates are also provided [here](./src/email/templates/) for email dynamic email delivery. This is a I/O intensive task, thus using a message broker decouples the classes and can enable scalbality.

## Usage

This application runs on node 20.10.0 and uses docker to start the postgresql and rabbitmq.

See [docker-compose-file](compose.yaml)

- Clone the repo
- Install dependencies with `npm install`
- Start the docker process with `docker compose up -d`
- Start the application with `npm run start:dev`
