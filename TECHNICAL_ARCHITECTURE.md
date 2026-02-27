# QR Code & Pause/Resume System - Technical Architecture

## System Overview

This document describes the complete QR code and pause/resume system for the college cafe pre-ordering application.

## 1. AppPauseContext Architecture

### Purpose
Global state management for app pause functionality. Prevents race conditions between admin stock updates and student orders.

### Location
`src/store/AppPauseContext.tsx`

### State Shape
```typescript
interface AppPauseContextType {
  isAppPaused: boolean;
  pauseReason: string;
  togglePause: (reason?: string) => void;
  setPauseStatus: (paused: boolean, reason?: string) => void;
}
```

### Usage Pattern
```typescript
const { isAppPaused, pauseReason, togglePause, setPauseStatus } = useAppPause();

// Pause with custom reason
setPauseStatus(true, "Adding new items to menu");

// Resume
setPauseStatus(false);

// Toggle with auto-reason
togglePause("Quick stock check");
```

### Consumer Components
- AdminDashboard (pause control)
- Orders screen (pause display)
- Cart screen (pause enforcement)
- Home/Menu screen (optional: disable add-to-cart)

## 2. QR Code System

### QR Code Format
```
ORDER_ID|TIMESTAMP
Example: 12345|1703078400000
Display: ORD-12345
```

### QR Utility Functions

**Location**: `src/utils/qrCodeUtils.ts`

#### generateQRCode(orderId: string): string
- Input: Order ID
- Output: "ORDER_ID|TIMESTAMP" string
- Usage: Called when order is placed
- Stores in Order.qrCode field

#### parseQRCode(qrData: string): { orderId: string; timestamp: number }
- Input: QR code string or scanned data
- Output: Parsed order ID and timestamp
- Usage: When admin scans QR code
- Validates format before returning

#### formatOrderId(orderId: string): string
- Input: Raw order ID (e.g., "12345")
- Output: Formatted display (e.g., "ORD-12345")
- Usage: Display in UI
- Adds "ORD-" prefix and uppercases

### Integration Points
1. **Order Creation**: generateQRCode called in orderService.createOrder
2. **QR Display**: formatOrderId used in Orders and AdminQRScanner
3. **QR Scanning**: parseQRCode used when admin enters/scans QR

## 3. Order Type System

### Updated Order Interface
```typescript
interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  
  // New fields for pre-order support
  orderType: "pre-order" | "walk-in";      // Order classification
  qrCode?: string;                         // For pre-orders only
  studentId?: string;                      // Student identifier
  studentName?: string;                    // Student full name
  studentEmail?: string;                   // Student email
  fulfillmentTime?: string;                // Expected pickup time
  paymentMethod: "online" | "cash" | "card" | "upi";
}
```

### Business Logic
- **Pre-Order Flow**: Online payment → QR generation → Admin QR scan → Auto bill
- **Walk-In Flow**: Manual order entry → Payment collection → Manual bill generation
- **Pause State**: Prevents new pre-orders during maintenance

## 4. AdminQRScanner Screen

### Location
`src/screens/AdminQRScanner.tsx`

### Responsibilities
1. QR code input/capture
2. Order lookup from database
3. Order details presentation
4. Bill generation trigger
5. Stock deduction
6. User feedback (success/error)

### Data Flow
```
QR Input → Validation → Order Lookup → Order Details Modal
                                              ↓
                                    Generate Bill Button
                                              ↓
                                      useBilling.generateBill()
                                              ↓
                                      useMenu.updateStock()
                                              ↓
                                    Success Confirmation
```

### Mock Order Database
```typescript
const mockOrders = {
  "12345": {
    id: "12345",
    studentName: "Raj Kumar",
    studentEmail: "raj@college.edu",
    items: [...],
    total: 250,
    paymentMethod: "online"
  },
  "67890": {
    id: "67890",
    studentName: "Priya Singh",
    studentEmail: "priya@college.edu",
    items: [...],
    total: 180,
    paymentMethod: "online"
  }
}
```

### Integration with Contexts
- `useTheme()`: Styling
- `useMenu()`: Stock updates
- `useBilling()`: Bill generation
- `useNavigation()`: Screen navigation

## 5. Admin Dashboard Integration

### Location
`src/screens/AdminDashboard.tsx`

### New Components

#### Pause Status Banner
- Position: Top of content (below header)
- Visibility: Show only when `isAppPaused = true`
- Content: 
  - Pause icon (⏸️)
  - Title: "App is Paused"
  - Reason text
  - Resume button

#### Pause Button
- Location: Quick Actions header
- Visibility: Show only when `isAppPaused = false`
- Action: Opens pause modal
- Style: Red background (#FF6B6B)

#### Pause Modal
- Title: "Pause Application"
- Input: TextInput for custom pause reason
- Buttons: Cancel, Pause App
- Behavior: 
  - Accepts 50 char max reason
  - Calls `setPauseStatus(true, reason)`
  - Closes modal on submit

#### QR Scanner Quick Action
- Icon: 📱
- Position: First in actions grid
- Action: Navigate to AdminQRScanner screen
- Always visible

### State Management
```typescript
const [pauseModalVisible, setPauseModalVisible] = useState(false);
const [customReason, setCustomReason] = useState("");
const { isAppPaused, pauseReason, setPauseStatus } = useAppPause();
```

## 6. Student Orders Screen Integration

### Location
`app/(tabs)/orders.tsx`

### Pause Enforcement

#### Pause Banner
- Shows when `isAppPaused = true`
- Orange background (#FFA50030)
- Content: Pause icon + reason
- Responsive to reason changes

#### QR Code Modal
- Triggers on order tap (active orders only)
- Display format:
  ```
  ORD-XXXXXX
  HH:MM:SS
  ```
- Professional styled modal
- Close button for dismissal

### QR Data Source
- Pulled from `order.qrCode` field
- Parsed with `formatOrderId()` for display
- Timestamp generated on order creation

## 7. Student Cart Screen Integration

### Location
`app/(tabs)/cart.tsx`

### Pause Enforcement

#### Pause Banner
- Shows at top when `isAppPaused = true`
- Identical to Orders screen
- Consistent messaging

#### Pause Overlay
- Shows within scroll view when paused
- Blocks visual flow of items
- Large "⏸️" icon
- Text: "Ordering is temporarily disabled"
- Subtitle: Custom pause reason

#### Disabled Checkout
- Button opacity: 50% when paused
- `disabled` prop set when `isAppPaused = true`
- Prevents accidental taps
- Maintains visual hierarchy

### User Experience
1. Student adds items to cart
2. App pauses (admin triggers)
3. Pause banner appears
4. Pause overlay appears in item list
5. Checkout button becomes disabled
6. Student waits for resume
7. App resumes (admin triggers)
8. All pause UI removed
9. Checkout enabled again

## 8. Data Flow Diagrams

### Pre-Order to Pickup Flow
```
Student                     Admin                      System
   |                          |                           |
   |--- Place Order ---------->|                           |
   |                          |                           |
   |<--- Order ID + QR --------|                           |
   |                          |                           |
   |                          |--- QR Scan ------------->|
   |                          |                           |
   |                          |<--- Order Details --------|
   |                          |                           |
   |                          |--- Generate Bill -------->|
   |                          |                           |
   |                          |<--- Bill + Stock Update -|
   |                          |                           |
   |<--- Handover Notification |                           |
   |                          |                           |
```

### Pause/Resume Flow
```
Admin                       System              Student
  |                           |                    |
  |--- Pause Request --------->|                    |
  |                           |--- Update Context  |
  |                           |                    |
  |<--- Pause Confirmed ------|<--- Pause Banner --|
  |                           |                    |
  |--- [Update Inventory] ----|<--- Disable Checkout
  |                           |                    |
  |--- Resume Request -------->|                    |
  |                           |--- Update Context  |
  |                           |                    |
  |<--- Resume Confirmed ------|<--- Remove Banner -|
  |                           |                    |
  |                           |<--- Enable Checkout
```

### Stock Update with Pause Protection
```
1. Admin initiates pause (reason: "Stock update")
2. Students see pause banner + disabled checkout
3. Admin updates MenuContext:
   - Add/remove items
   - Modify prices
   - Update stock quantities
4. Changes NOT visible to students (paused)
5. Admin initiates resume
6. Students see updated menu immediately
7. Checkout re-enabled
```

## 9. Context Relationships

```
AppPauseContext
    ├─> AdminDashboard (pause control)
    ├─> Orders Screen (pause display + QR)
    └─> Cart Screen (pause enforcement)

MenuContext
    ├─> AdminQRScanner (stock updates)
    ├─> Home Screen (display products)
    └─> Cart (item management)

BillingContext
    ├─> AdminQRScanner (bill generation)
    ├─> AdminBilling (walk-in bills)
    └─> Orders (receipt display)
```

## 10. Error Handling

### QR Scanning Errors
```typescript
try {
  const parsed = parseQRCode(qrInput);
  if (!parsed) throw new Error("Invalid QR format");
  
  const order = mockOrders[parsed.orderId];
  if (!order) throw new Error("Order not found");
  
  // Success: Display order
} catch (error) {
  // Show error modal with suggestion to re-scan
}
```

### Pause State Conflicts
- Pause prevents new orders (button disabled, modal blocked)
- Resume clears all pause UI immediately
- Reason text always shown for transparency
- No silent failures

## 11. Performance Considerations

### Context Updates
- `isAppPaused` change triggers UI update in 3 screens
- Memoization prevents unnecessary re-renders
- State changes are minimal (bool + string)

### QR Parsing
- O(1) lookup in mock database
- parseQRCode is stateless, very fast
- formatOrderId is string manipulation only

### Stock Updates
- Batch stock deductions during bill generation
- MenuContext update propagates to all consumers
- No polling or expensive queries

## 12. Testing Strategy

### Unit Tests
- `parseQRCode()` with various formats
- `formatOrderId()` edge cases
- `togglePause()` state transitions

### Integration Tests
- Pause → See banner on all screens
- Resume → Banners disappear
- QR scan → Bill generates correctly
- Stock decreases after bill

### E2E Tests
- Full pre-order flow student to pickup
- Full pause/resume cycle
- Multiple orders during pause
- QR code uniqueness

## 13. Future Enhancement Points

### Real QR Scanning
```typescript
// Replace text input with camera
import { CameraView } from 'expo-camera';

const [hasPermission, setHasPermission] = useState<boolean | null>(null);

const handleQRScanned = (data: string) => {
  handleScanQR(data); // Use existing logic
};
```

### Backend Integration
```typescript
// Replace mock database with API
const lookupOrder = async (orderId: string) => {
  const response = await fetch(
    `${API_URL}/orders/${orderId}`
  );
  return response.json();
};
```

### Push Notifications
```typescript
// Notify students when order is ready
sendNotification(order.studentEmail, "Your order is ready!");
```

### Real-time Sync
```typescript
// Use WebSocket for live pause/resume
const socket = io(WEBSOCKET_URL);
socket.on("pause", (reason) => {
  setPauseStatus(true, reason);
});
```

---

**Document Version**: 1.0
**Last Updated**: 2024
**Status**: Complete Implementation
