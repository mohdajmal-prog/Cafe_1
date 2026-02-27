# QR System - Visual Implementation Guide

## Complete System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      CAFE APP (React Native)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ ROOT (_layout.tsx / App.tsx)                              │  │
│  │ ├─ AppPauseProvider (NEW)                                │  │
│  │ ├─ MenuProvider                                          │  │
│  │ ├─ CartProvider                                          │  │
│  │ ├─ BillingProvider                                       │  │
│  │ └─ Navigation Stack                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│           │                                                      │
│           ├─ ADMIN SIDE                                         │
│           │  ├─ AdminDashboard (MODIFIED)                      │
│           │  │  ├─ Pause Banner (NEW)                          │
│           │  │  ├─ Pause Button (NEW)                          │
│           │  │  ├─ Pause Modal (NEW)                           │
│           │  │  └─ QR Scanner Card (NEW)                       │
│           │  │                                                  │
│           │  ├─ AdminQRScanner (NEW)                           │
│           │  │  ├─ QR Input Field                              │
│           │  │  ├─ Order Lookup                                │
│           │  │  ├─ Bill Generation                             │
│           │  │  └─ Stock Update                                │
│           │  │                                                  │
│           │  ├─ AdminBilling                                   │
│           │  ├─ Stock Management                               │
│           │  └─ Price Management                               │
│           │                                                    │
│           └─ STUDENT SIDE                                      │
│              ├─ Home                                            │
│              │  └─ Menu Items (uses MenuContext)              │
│              │                                                  │
│              ├─ Orders (MODIFIED)                              │
│              │  ├─ Pause Banner (NEW)                          │
│              │  └─ QR Code Modal (ENHANCED)                    │
│              │                                                  │
│              ├─ Cart (MODIFIED)                                │
│              │  ├─ Pause Banner (NEW)                          │
│              │  ├─ Pause Overlay (NEW)                         │
│              │  └─ Disabled Checkout (NEW)                     │
│              │                                                  │
│              └─ Search                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram - Pre-Order Complete

```
STUDENT                          SYSTEM                           ADMIN
   │                               │                               │
   │  1. Add items to cart        │                               │
   ├──────────────────────────►   │                               │
   │                              ├─ Update CartContext           │
   │                              │                               │
   │  2. Checkout                 │                               │
   ├──────────────────────────►   │                               │
   │                              ├─ Generate Order               │
   │                              ├─ Generate QR Code (NEW)       │
   │                              │  FORMAT: "ORDER_ID|TIMESTAMP"  │
   │  3. Payment (Online)         │                               │
   ├──────────────────────────►   │                               │
   │                              ├─ Create BillingTransaction    │
   │  4. Order ID + QR Code       │                               │
   │◄──────────────────────────── ├─ Save to Order.qrCode (NEW)   │
   │                              │                               │
   │                              │         BREAK TIME (10:40 AM)  │
   │  5. View QR Code             │                               │
   ├──────────────────────────►   │                               │
   │  FORMAT: ORD-XXXXXX          │  6. Scan QR Code              │
   │  HH:MM:SS                    │    ◄────────────────────────┤
   │                              │                               │
   │  7. Go to cafe               │  8. Order Lookup              │
   │                              │     (from QR code)            │
   │                              │     ├─ Parse QR              │
   │                              │     ├─ Find Order             │
   │                              │     └─ Display Details        │
   │                              │                               │
   │  8. Show QR to admin         │  9. Confirm Handover         │
   ├──────────────────────────►   │                               │
   │                              ├─ Generate Bill (Auto)         │
   │  9. Receive items            │├─ Update Stock (NEW)          │
   │◄──────────────────────────── ├─ Show Confirmation           │
   │                              │                               │
```

---

## Pause/Resume Sequence Diagram

```
ADMIN                 SYSTEM              STUDENT
  │                     │                   │
  │  Click Pause     │                   │
  ├──────────────►   │                   │
  │                  ├─ Set isAppPaused=true
  │                  │                   │
  │  Enter Reason    │                   │
  ├──────────────►   │                   │
  │                  ├─ Set pauseReason="..."
  │                  │                   │
  │  [Success]       │   Show Banner     │
  │◄──────────────── ├──────────────────►│
  │                  │   Disable Checkout│
  │                  │                   │
  │  [Update Menu]   │                   │
  │  [Update Stock]  │                   │
  │  [Update Prices] │                   │
  │                  │   [Blocked]       │
  │                  │   [Overlay shown] │
  │                  │                   │
  │  Click Resume    │                   │
  ├──────────────►   │                   │
  │                  ├─ Set isAppPaused=false
  │                  │                   │
  │  [Success]       │   Clear Banner    │
  │◄──────────────── ├──────────────────►│
  │                  │   Enable Checkout │
  │                  │                   │
```

---

## QR Code Generation & Parsing

```
QR GENERATION (On Order Creation):
┌─────────────────────────────────────┐
│ Order {                             │
│   id: "12345",                      │
│   items: [...],                     │
│   total: 250                        │
│ }                                   │
└────────────┬────────────────────────┘
             │
             ├─ generateQRCode("12345")
             │
             │  Format: "ORDER_ID|TIMESTAMP"
             │
             ├─ Result: "12345|1703078400000"
             │
             └─ Stored in Order.qrCode field

QR PARSING (On Admin Scan):
┌─────────────────────────────────────┐
│ QR Input: "12345|1703078400000"     │
│ OR Manual: "12345"                   │
└────────────┬────────────────────────┘
             │
             ├─ parseQRCode(qrData)
             │
             ├─ Extract: {
             │   orderId: "12345",
             │   timestamp: 1703078400000
             │ }
             │
             └─ Lookup in Database

QR DISPLAY (In Student Orders):
┌─────────────────────────────────────┐
│ Raw Data: "12345"                   │
└────────────┬────────────────────────┘
             │
             ├─ formatOrderId("12345")
             │
             └─ Display: "ORD-12345"
                         + HH:MM:SS
```

---

## Component Dependency Tree

```
App.tsx (ROOT)
│
├─ AppPauseProvider (NEW)
│  └─ Provides: useAppPause()
│
├─ MenuProvider
│  └─ Provides: useMenu()
│     ├─ menuItems[]
│     ├─ updateStock() (called by AdminQRScanner)
│     └─ updatePrice()
│
├─ CartProvider
│  └─ Provides: useCart()
│     ├─ items[]
│     ├─ addItem()
│     └─ removeItem()
│
├─ BillingProvider
│  └─ Provides: useBilling()
│     └─ generateBill() (called by AdminQRScanner)
│
└─ Navigation Stack
   │
   ├─ Admin Screens
   │  │
   │  ├─ AdminDashboard (MODIFIED)
   │  │  ├─ useTheme()
   │  │  ├─ useUser()
   │  │  ├─ useMenu()
   │  │  └─ useAppPause() (NEW)
   │  │
   │  ├─ AdminQRScanner (NEW)
   │  │  ├─ useTheme()
   │  │  ├─ useMenu()
   │  │  ├─ useBilling()
   │  │  └─ useNavigation()
   │  │
   │  └─ Other Admin Screens
   │
   └─ Student Screens
      │
      ├─ Orders (MODIFIED)
      │  ├─ useOrders()
      │  └─ useAppPause() (NEW)
      │
      ├─ Cart (MODIFIED)
      │  ├─ useCart()
      │  └─ useAppPause() (NEW)
      │
      └─ Other Student Screens
```

---

## State Management Flow

```
APP PAUSE STATE:
┌──────────────────────────────────────┐
│ AppPauseContext                      │
│ ├─ isAppPaused: boolean              │
│ ├─ pauseReason: string               │
│ ├─ togglePause(): void               │
│ └─ setPauseStatus(): void            │
└────┬─────────────────────────────────┘
     │
     ├─ AdminDashboard
     │  ├─ Shows/hides pause button
     │  ├─ Shows/hides pause banner
     │  └─ Opens pause modal
     │
     ├─ Orders Screen
     │  ├─ Shows pause banner
     │  └─ Message includes reason
     │
     └─ Cart Screen
        ├─ Shows pause banner
        ├─ Shows pause overlay
        └─ Disables checkout button

MENU STATE:
┌──────────────────────────────────────┐
│ MenuContext                          │
│ ├─ menuItems: MenuItem[]             │
│ ├─ addItem(): void                   │
│ ├─ removeItem(): void                │
│ ├─ updateStock(): void (CALLED by)   │
│ │  └─ AdminQRScanner on bill gen     │
│ └─ updatePrice(): void               │
└──────────────────────────────────────┘

BILLING STATE:
┌──────────────────────────────────────┐
│ BillingContext                       │
│ ├─ transactions: Bill[]              │
│ ├─ generateBill(): void (CALLED by)  │
│ │  └─ AdminQRScanner on handover     │
│ └─ getBillDetails(): Bill            │
└──────────────────────────────────────┘
```

---

## File Organization

```
cafe/ (root)
│
├─ app/
│  └─ (tabs)/
│     ├─ index.tsx (Home)
│     ├─ orders.tsx (MODIFIED - Added pause banner, enhanced QR)
│     ├─ cart.tsx (MODIFIED - Added pause enforcement)
│     ├─ search.tsx
│     └─ account.tsx
│
├─ src/
│  │
│  ├─ store/
│  │  ├─ MenuContext.tsx
│  │  ├─ CartContext.tsx
│  │  ├─ BillingContext.tsx
│  │  ├─ UserContext.tsx
│  │  ├─ ThemeContext.tsx
│  │  └─ AppPauseContext.tsx (NEW - Global pause state)
│  │
│  ├─ services/
│  │  ├─ types.ts (MODIFIED - Updated Order interface)
│  │  ├─ api.ts
│  │  ├─ menuService.ts
│  │  ├─ orderService.ts
│  │  └─ adminApi.ts
│  │
│  ├─ screens/
│  │  ├─ AdminDashboard.tsx (MODIFIED - Pause controls, QR card)
│  │  ├─ AdminQRScanner.tsx (NEW - Complete QR scanning)
│  │  ├─ AdminBilling.tsx
│  │  ├─ AdminOrders.tsx
│  │  └─ [other admin screens...]
│  │
│  ├─ utils/
│  │  └─ qrCodeUtils.ts (NEW - QR generation, parsing, formatting)
│  │
│  ├─ components/
│  ├─ constants/
│  ├─ hooks/
│  └─ navigation/
│     └─ AdminNavigator.tsx (MODIFIED - Added QR scanner route)
│
├─ IMPLEMENTATION_SUMMARY.md (NEW - Overview)
├─ TECHNICAL_ARCHITECTURE.md (NEW - Deep dive)
├─ TESTING_GUIDE.md (NEW - QA guide)
├─ README_QR_SYSTEM.md (NEW - User guide)
└─ FILE_MODIFICATIONS.md (NEW - Change list)
```

---

## UI Flow Diagram

```
┌──────────────────────────────────────────────────────────┐
│                    HOME SCREEN                           │
│  Browse Menu → Add to Cart                              │
│                    │                                     │
│                    ▼                                     │
├──────────────────────────────────────────────────────────┤
│                   CART SCREEN                            │
│  ┌────────────────────────────────────┐                │
│  │ ⏸️ Cafe Paused? (NEW)              │                │
│  │ YES → Pause Overlay (NEW)          │                │
│  │ NO  → Normal Checkout              │                │
│  └────────────────────────────────────┘                │
│                    │                                     │
│                    ├─ Checkout                          │
│                    │  └─ Payment Modal                   │
│                    │     └─ Create Order                │
│                    │        └─ Order with QR (NEW)      │
│                    │           → Success (QR received)   │
│                    │                                     │
└──────────────────────────────────────────────────────────┘
                    │
         ┌──────────┴──────────┐
         ▼                     ▼
┌─────────────────┐   ┌──────────────────────┐
│   ORDERS SCREEN │   │  ADMIN DASHBOARD     │
│  ┌────────────┐ │   │  ┌────────────────┐  │
│  │ Active     │ │   │  │ [⏸ Pause]     │ (NEW)
│  │ - Order #1 │ │   │  │ [📱 QR Scanner│ (NEW)
│  │   [Tap]    │ │   │  │ [🧾 Billing]  │
│  │   ▼        │ │   │  │ ...            │
│  │ ┌────────┐ │ │   │  └────────────────┘
│  │ │QR Modal│ │ │   │         │
│  │ │ORD-###│ │ │   │         ▼
│  │ │TIME   │ │ │   │  ┌─────────────────┐
│  │ └────────┘ │ │   │  │ Pause Modal (NEW)
│  │            │ │   │  │ Enter reason:   │
│  │ - Order #2 │ │   │  │ [Input]        │
│  └────────────┘ │   │  │ [Cancel][Pause]│
│                 │   │  └─────────────────┘
│ ⏸️ Paused? (NEW) │   │         │
│ YES → Banner    │   │         ▼
│ NO  → Orders    │   │  Global Pause State
└─────────────────┘   └──────────────────────┘
                             │
                             ▼
                      ┌──────────────────┐
                      │ AdminQRScanner   │
                      │ (NEW)            │
                      │ [QR Input]       │
                      │ [Order Details]  │
                      │ [Gen Bill]       │
                      │ [Success Modal]  │
                      └──────────────────┘
```

---

## Mock Data Structure

```
Mock Order Database (AdminQRScanner):

Order 1:
{
  id: "12345",
  studentName: "Raj Kumar",
  studentEmail: "raj@college.edu",
  items: [
    { name: "Samosa", quantity: 2, price: 20 },
    { name: "Chai", quantity: 1, price: 30 }
  ],
  total: 250,
  paymentMethod: "online",
  status: "paid"
}

Order 2:
{
  id: "67890",
  studentName: "Priya Singh",
  studentEmail: "priya@college.edu",
  items: [
    { name: "Dosa", quantity: 1, price: 80 },
    { name: "Sambar", quantity: 1, price: 20 }
  ],
  total: 180,
  paymentMethod: "online",
  status: "paid"
}
```

---

## Color Scheme Reference

```
PAUSE INDICATORS:
├─ Pause Banner Background: #FFA50030 (10% orange)
├─ Pause Banner Border: #FFA500 (100% orange)
├─ Pause Banner Text: Colors.textPrimary
│
├─ Pause Button: #FF6B6B (Red)
├─ Pause Button Text: #fff (White)
│
├─ Resume Button: #4CAF50 (Green)
├─ Resume Button Text: #fff (White)
│
└─ Pause Overlay: #FFA50015 (5% orange) + 1px border

ADMIN THEME:
├─ Accent Color: #DC2626 (Red)
├─ Card Background: Colors.cardBackground
├─ Text Primary: Colors.textPrimary
│
└─ Quick Action Icons: 
   ├─ QR Scanner: accent + '20'
   ├─ Billing: accent + '20'
   ├─ Stock: #4CAF5020 (Green)
   └─ Orders: #2196F320 (Blue)
```

---

**Visual Architecture Complete** ✅
All diagrams and reference materials for implementation and understanding
