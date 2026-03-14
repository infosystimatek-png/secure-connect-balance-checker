# Casino Game Management System – TRON Implementation Proposal (Developer Copy)

This document describes **what will be delivered**, **how it will be implemented**, and **how payments are structured** for the full Casino Game Management System based on the TRON delegated spending demo.

It is written to avoid misunderstandings later – both sides can refer back to this document as the single source of truth.

---

## 1. Background

- A working **TRON delegated spending demo** has already been delivered and paid for (USD 200).  
- The demo shows that:
  - A user can connect a TRON wallet via QR / WalletConnect.
  - The user signs a **one‑time permission** (`AccountPermissionUpdate`) to grant a special `GAME_BACKEND` active permission.
  - After that, the backend signer can **silently move TRX/USDT** from the user’s wallet (within the granted permission) **without new wallet popups**.
  - We can deduct funds and send them to a chosen address.

The next step is to turn this into a **full multi‑agent casino game management system** that matches the functional document you provided (Admin / Agent / Player flows, board sessions, pots, winner payouts, logging, and reporting).

From a market perspective, the full system is realistically in the **USD 4,000+** range, considering architecture, frontend, backend, blockchain work, and testing.  

However, for this engagement, I am offering a **discounted fixed price of USD 1,500**, split into clear phases and milestones (details in section 4).

---

## 2. High‑Level System Description

The full system will provide:

- **Roles**
  - **Admin** – manages agents, views revenue and system‑wide logs.
  - **Agents** – operate game boards/tables, onboard players via QR, set entry fees, and initiate payouts.
  - **Players** – passengers who join by scanning a QR, connecting their wallet, and playing.

- **Core Flows**
  - Agents log in and generate **QR codes / secure links** for their boards (sessions).
  - Players scan the QR, connect their TRON wallet, and (if needed) grant **one‑time delegation** to the backend.
  - Agent sees all connected players and their wallets.
  - Agent sets **entry fee**; the backend **silently deducts** funds from all players (delegated transfers).
  - A **pot** is built: `players × fee`.
  - After the game is played offline, the agent selects a **winner** (from list or manual address).
  - Backend distributes:
    - **90% of pot → winner**.
    - **10% of pot → platform “board” wallet**.
  - All transactions are **logged** with tx hash, amounts, and status.

- **Scope for this project**
  - Implement the system **on TRON only** (TRX and USDT).
  - Provide a full web application (frontend + backend + blockchain integration) as described.

---

## 3. Responsibilities and Assumptions

### 3.1 What I will provide

- Architecture, design, and implementation of:
  - Admin UI and APIs.
  - Agent UI and APIs.
  - Player onboarding / QR flow.
  - Delegated spending engine on TRON.
  - Session, player, and transaction storage (database integration).
  - Logging, basic reporting, and revenue tracking.
- Deployment of the application to **Vercel** (or similar) using your Vercel account and environment variables you provide.
- Documentation:
  - Deployment steps (`DEPLOYMENT_VERCEL.md`).
  - This proposal (`PROJECT_PROPOSAL.md`) as a reference for scope and phases.
  - Short operations guide for Admins and Agents.

### 3.2 What you will provide

- TRON wallets and private keys for:
  - **Backend signer** (delegated spending key).  
    - This key **must not** be a player key; it should be a dedicated signer wallet.
  - **Board/platform wallet** to receive the 10% fees.
  - Any other treasury wallets as required.
- TRON node or provider details (or permission to use public `api.trongrid.io` with appropriate API key).
- WalletConnect project ID.
- Vercel (or hosting) account where the app will be deployed.
- Timely feedback and approvals at the end of each phase.

### 3.3 Assumptions

- **Network scope**: this project is for **TRON network only** (TRX and USDT).  
  - Support for **EVM chains** (Ethereum, BSC, Polygon, etc.) will be a **separate future contract** with its own pricing.
- **Single tenant**: one cruise / one platform instance per deployment.
- **Fair usage**: we will handle normal expected game volume; if extremely high throughput or special compliance needs arise, we can discuss additional work separately.

---

## 4. Phases, Deliverables, and Payment Structure

**Total discounted price for full project: USD 1,500**  
(The realistic value of the work is around **USD 4,000+**, but I am offering this as a fixed‑price project for 1,500 as long as we follow the scope defined here.)

There is also a **USD 100 upfront** payment at the very beginning, specifically dedicated to on‑chain setup and verification. That 100 is **part of** the 1,500 total, not additional.

### 4.1 Phase 0 – On‑Chain Setup & Validation (Upfront USD 100)

**Goal:** Confirm that everything works end‑to‑end on TRON in your environment before we invest into the full application structure.

**Work items:**

- Configure and test:
  - TRON node / provider (public TronGrid with API key or your node).
  - Backend signer wallet.
  - Board/platform wallet.
  - WalletConnect project ID.
- Run and verify:
  - One‑time delegation transaction (`AccountPermissionUpdate`) from a test wallet.
  - Silent TRX/USDT deduction using the delegated active permission, from test players to treasury/board wallet.
- Define final list of production **environment variables** and document them.

**Deliverables:**

- Working delegated‑spending demo in your own environment with your wallets and nodes.
- Updated deployment/config documentation reflecting your actual setup.

**Payment:**  
- **USD 100** at start (non‑refundable).  
  - This is included in the total 1,500 and covers on‑chain testing and configuration work.

---

### 4.2 Phase 1 – Frontend & UX (USD 500)

**Goal:** Build the full **user interface and UX flows** for Admin, Agents, and Players. After this phase, you will be able to click through the entire system (without all blockchain logic wired yet).

#### 4.2.1 Features

**1) Authentication & roles**

- Admin login page.
- Agent login page.
- Basic auth/session handling (e.g., JWT or cookie‑based), sufficient for restricted dashboards.

**2) Admin dashboard UI**

- Agent management:
  - Create Agent (name, email/username, password or invite link, assigned board/table ID).
  - Update Agent (status, name, etc.).
  - Delete / suspend Agent.
- List of all Agents with basic stats placeholders (active sessions, last activity).
- High‑level metrics area (placeholder initially):
  - Total agents.
  - Example recent sessions.
  - Placeholder board fee totals (real data wired in Phase 2).

**3) Agent dashboard UI**

- Board/session panel:
  - Show Agent’s board/table ID.
  - Button to **generate QR code / join link** for a new session.
- QR overlay or panel:
  - Displays a QR code that encodes the join URL.
  - Shows the raw link for troubleshooting.
- Connected players list:
  - Table with:
    - Player wallet address.
    - TRX balance column (placeholder or later wired to live data).
    - USDT balance column (placeholder or later wired).
    - Status (Connected / Removed).
  - Buttons to **remove/disconnect** a player from the session.
- Game configuration panel:
  - Input for **entry fee** (USDT).
  - Show:
    - Number of connected players.
    - Per‑player fee.
    - Computed pot = `players × fee`.
- Winner selection UI:
  - List of connected players with radio buttons.
  - Manual wallet input field as backup (in case of edge situations).

**4) Player onboarding UI**

- Landing page for QR link:
  - Shows which Agent/board they’re joining.
  - Button(s) to connect with **TronLink** (desktop) or **WalletConnect** (mobile).
  - Status messages: connected, waiting, permission required, etc.

**5) Delegation & status messaging UI**

- Step 3 card (Grant Delegation):
  - Explains that delegation is needed only once.
  - Shows automatic status:
    - Already delegated + registered (card hidden after success).
    - Needs delegation (wallet auto‑opens).
    - Retry button if automatic attempt fails.

#### 4.2.2 Work style & limitations in this phase

- Many API calls may be **mocked or minimally wired**. The focus here is UX and correct labeling, not full business logic yet.
- No guaranteed on‑chain correctness yet (that comes in Phase 2).

#### 4.2.3 Deliverables

- Complete clickable Frontend for:
  - Admin dashboard.
  - Agent dashboard.
  - Player onboarding.
  - Basic permission/grant flow UI.

**Payment trigger:**  
- After you review the frontend and confirm that the UX matches your functional document (with the understanding that some data is still mocked):
  - **USD 500** payment before starting Phase 2.

---

### 4.3 Phase 2 – Backend, Database & Blockchain Integration (USD 500)

**Goal:** Connect the UI to a real backend and TRON. Implement the full casino logic (entry fee deduction, pot formation, 90/10 payouts, logs).

#### 4.3.1 Database & models

I will design and implement a basic relational data model (e.g., PostgreSQL) with tables such as:

- `admins` – admin accounts.
- `agents` – agent accounts, linked to admin or system.
- `boards` – tables/boards, each associated with an agent.
- `sessions` – individual game runs (QR link + joined players + pot + status).
- `session_players` – link players to sessions (wallet address, joined at, left at).
- `transactions` – entry fee deductions and payouts (amount, token, type, tx hash, status).

APIs will be implemented for:

- Auth (login/logout).
- Agent session lifecycle:
  - Create session.
  - Close session.
  - Register player join (when QR link is visited + wallet connects).
  - Remove player.
- Game actions:
  - Set entry fee.
  - Trigger mass entry fee deduction.
  - Select winner.
  - Trigger payout (90/10).
- Admin views:
  - List agents, sessions, and board fees.

#### 4.3.2 Blockchain logic (TRON)

Using the delegated permission mechanism from the demo:

- **Delegated permission:**
  - On first connection, if the `GAME_BACKEND` permission does not exist:
    - Prompt the wallet to sign the `AccountPermissionUpdate` transaction.
  - Store `permissionId` and a flag that this wallet has delegated to the backend signer.

- **Entry fee deduction:**
  - For a given session and entry fee (e.g. 100 USDT):
    - For each **connected and delegated** player:
      - Build a transfer transaction:
        - From: player’s wallet (via permission).
        - To: pot address or platform treasury.
        - Amount: entry fee in USDT.
      - Use backend signer + permissionId to silently sign and broadcast.
    - Track each transaction with:
      - tx hash.
      - status (Pending / Confirmed / Failed).
  - Ensure:
    - Each player is charged **at most once per session**.
    - The session cannot be finalized until the pot is consistent (or marked as partially failed, according to rules we agree on).

- **Payout:**
  - After agent selects a winner:
    - Compute total pot for the session.
    - Compute:
      - **Winner share = 90%** of pot.
      - **Board fee = 10%** of pot.
    - Execute:
      - Transfer winner share to **winner wallet**.
      - Transfer board fee to **platform/board wallet**.
    - Store both transactions in `transactions` table with hashes and statuses.
  - Protect against:
    - Running payout more than once per session (idempotency / final state flags).

#### 4.3.3 Dashboard integration

- Agent dashboard now shows **real data**:
  - Players connected to each session.
  - Entry fee amount.
  - Pot total.
  - Deduction statuses.
  - Winner and payout status.
- Admin dashboard shows:
  - Sessions per agent.
  - Board fees per session and per agent.
  - Basic filters by date.

#### 4.3.4 Deliverables

- Working backend (API + DB models) and TRON integration that implement:
  - One‑time delegation.
  - Entry fee deduction (TRX/USDT).
  - 90/10 payout logic.
  - Logging of all on‑chain transactions.
- Frontend dashboards wired to real backend data.

**Payment trigger:**  
- After we can run a full end‑to‑end test on testnet/mainnet:
  - Players join a session, pay entry fees, pot is created, winner is selected, payouts and board fee are transferred correctly **on‑chain**, and dashboards show this.
  - **USD 500** payment before starting Phase 3.

---

### 4.4 Phase 3 – Testing, On‑Chain Verification & Production Deployment (USD 400)

Note: Together with the initial USD 100 from Phase 0, this phase effectively totals USD 500 for testing & deployment work.

**Goal:** Ensure the system is stable and correctly deployed in your production environment for real use.

#### 4.4.1 Testing & Quality Assurance

- Prepare a test checklist covering:
  - Single‑player session.
  - Multi‑player session (e.g., 10 players, 100 USDT fee, 1000 USDT pot).
  - Multiple agents operating in parallel.
  - Failure scenarios (e.g., player with insufficient funds, transaction failure).
  - Permission already granted vs. first‑time wallet.
  - Agent removing players mid‑session.
  - Admin viewing revenue and sessions.
- Run these tests on:
  - Testnet (if preferred).
  - Mainnet with small real amounts (for final verification).

#### 4.4.2 Production deployment

- Help configure the production environment:
  - Vercel project root: `frontend`.
  - Environment variables for production (as per `DEPLOYMENT_VERCEL.md`).
- Deploy the production build.
- Verify:
  - `/` – app loads.
  - `/api/health` – backend is correctly configured.
  - Key flows work for at least one small live session.

#### 4.4.3 Handover

- Final documentation delivered:
  - Updated deployment steps if anything changed.
  - Short operational guide:
    - For Admin – how to create/manage agents and see revenue.
    - For Agents – how to run boards, generate QR, run games safely.
  - Known limitations and suggestions for future improvements (e.g., EVM support).

**Payment trigger:**  
- After:
  - You confirm that tests pass to your satisfaction.
  - Production deployment is live.
  - Documentation is delivered.
  - **USD 400** final payment.

---

## 5. Change Management and Out‑of‑Scope Items

To avoid misunderstandings:

- The **USD 1,500 fixed price** covers only what is explicitly described in this document.
- If, during the project, you decide to add:
  - New blockchains (EVM networks).
  - New tokens.
  - New complex reporting modules.
  - KYC/AML flows.
  - Multi‑tenant support or large architectural changes.

  we will treat those as **separate change requests** and agree on a new scope and price before starting that work.

- Minor tweaks (text changes, small UI adjustments, small bug fixes) within the original scope are included.

---

## 6. Summary

- The full project is equivalent to a **USD 4,000+** system in terms of complexity and effort.
- I am offering it as a **discounted fixed‑price project at USD 1,500** because:
  - We already have a strong base (delegation demo, deployment pipelines).
  - We have a clear requirements document from you.
  - We are focusing initially on **TRON only**, not multiple chains.
- The work is split into clear, paid phases:
  - **Phase 0:** On‑chain setup – USD 100 upfront (part of total).
  - **Phase 1:** Frontend & UX – USD 500.
  - **Phase 2:** Backend & blockchain integration – USD 500.
  - **Phase 3:** Testing & production deployment – USD 400.

With this structure, you always know:

- What will be delivered in each step.
- When payment is expected.
- What is and is not included.

Both parties can refer to this `PROJECT_PROPOSAL.md` as the baseline agreement for the TRON Casino Game Management System implementation.

