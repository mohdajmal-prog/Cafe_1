# QR Code & Pause/Resume System - Testing Guide

## Quick Start Testing

### Prerequisites
- App running on iOS or Android emulator
- Both admin and student tabs accessible
- MenuContext and BillingContext initialized

## Testing Scenarios

### Scenario 1: Pause Functionality

#### Setup
- Open Admin Dashboard
- Verify Quick Actions section visible with Pause button

#### Test Steps
1. **Initiate Pause**
   - Click "⏸ Pause" button in Quick Actions header
   - Modal appears: "Pause Application"
   - Input field visible for pause reason

2. **Enter Custom Reason**
   - Type: "Adding new sandwich items"
   - Click "Pause App" button
   - Modal closes

3. **Verify Pause Status**
   - Admin Dashboard: Orange pause banner appears at top
   - Banner shows: "⏸️ App is Paused"
   - Banner displays your custom reason
   - "Resume" button visible in banner

4. **Check Student Side**
   - Switch to student Orders screen
   - Pause banner visible with reason
   - Navigate to Cart screen
   - Pause banner visible in Cart
   - Pause overlay visible in items list
   - Checkout button appears disabled (50% opacity)

5. **Resume App**
   - Switch back to Admin
   - Click "Resume" button in pause banner
   - Pause banner disappears immediately
   - Check student side: All pause UI gone
   - Checkout button enabled again

#### Expected Results
- ✅ Pause button shows only when app not paused
- ✅ Modal input accepts custom reasons (max 50 chars)
- ✅ Pause banner shows on all 3 screens (Admin, Orders, Cart)
- ✅ Checkout disabled with pause overlay shown
- ✅ Resume removes all pause UI immediately

---

### Scenario 2: QR Code Generation & Display

#### Setup
- Have active orders in student account
- Open Orders screen (student side)

#### Test Steps
1. **View QR Code**
   - Look at order list
   - See "Tap to view QR code" message on active orders
   - Tap on any active order card

2. **QR Modal Opens**
   - Header: "Order QR Code"
   - QR Box displays:
     ```
     ORD-XXXXXX  (your order ID)
     HH:MM:SS    (current timestamp)
     ```
   - Close button in top right

3. **Verify Format**
   - Order number matches order ID (last 6 digits)
   - Uppercase display
   - Time format shows hours:minutes:seconds

4. **Dismiss Modal**
   - Click "Done" button or close button
   - Return to orders list
   - Can tap other orders to see their QR codes

#### Expected Results
- ✅ Active orders show tap prompt
- ✅ QR modal opens with proper styling
- ✅ Format is ORD-XXXXXX (uppercase)
- ✅ Timestamp displays correctly
- ✅ Modal dismisses properly

---

### Scenario 3: Admin QR Scanner

#### Setup
- Admin Dashboard open
- Quick Actions section visible

#### Test Steps
1. **Navigate to QR Scanner**
   - Click "📱 QR Scanner" card in Quick Actions
   - AdminQRScanner screen opens
   - See section: "Scan Order QR Code"
   - Input field visible
   - Instructions section at bottom

2. **Test a Real Order**
   - Input: A real Order ID from a newly created order (e.g., `ORD-aBcDeFg123...`)
   - Click "Process QR Code" button
   - Order details modal opens showing:
     - Order ID: The ID you entered
     - Student: The name of the logged-in user who placed the order
     - Items list (e.g., 2x Samosa, 1x Chai)
     - Total: The correct total for the order
     - Payment: Paid (green badge)

3. **Generate Bill**
   - Click "Generate Bill & Handover" button
   - Loading indicator appears briefly
   - Success modal shows: ✅ Bill generated and stock updated
   - See details: Order ID, Bill#, Date/Time
   - Items and Total shown in success modal
   - Close success modal

4. **Test Invalid Order**
   - Input: `99999` (non-existent)
   - Click "Process QR Code"
   - Error modal: "Order not found"
   - Dismiss error
   - Try again with valid order

#### Expected Results
- ✅ QR Scanner navigates from Quick Actions
- ✅ Real orders are found in the database via their ID
- ✅ Order details display student info correctly
- ✅ Bill generation succeeds with confirmation
- ✅ Stock is updated (verify in Stock Management screen)
- ✅ Invalid orders show error message
- ✅ Can process multiple orders in sequence

---

### Scenario 4: Pause + QR Scanner Interaction

#### Setup
- Admin Dashboard open
- Have Student Orders and Cart visible on another device/window

#### Test Steps
1. **Pause App**
   - Click Pause button
   - Enter reason: "Processing QR orders"
   - Confirm pause

2. **Student Side Sees Pause**
   - Orders screen: Pause banner visible
   - Cart screen: Pause banner + overlay visible
   - Checkout disabled

3. **Admin Scans QR While Paused**
   - Click QR Scanner card
   - Enter order ID (e.g., 12345)
   - Process QR Code
   - Generate Bill succeeds (NOT blocked by pause)
   - Stock updates in MenuContext

4. **Verify Stock Update**
   - Navigate to Stock Management screen
   - Check that items from order have decreased qty
   - Example: Samosa was 50, now 48 (2 sold)

5. **Resume App**
   - Go back to Dashboard
   - Click "Resume" button
   - All pause UI disappears
   - Student side: Checkout button enabled again

#### Expected Results
- ✅ Pause doesn't block bill generation
- ✅ Stock updates visible after bill generation
- ✅ Students blocked from ordering during pause
- ✅ Admin can still process orders during pause
- ✅ Resume enables student ordering again

---

### Scenario 5: Pause Enforcement - Cart Behavior

#### Setup
- Have items in student cart
- Admin dashboard ready to pause

#### Test Steps
1. **Add Items to Cart**
   - From Home screen, add 2-3 items
   - View cart
   - Checkout button enabled
   - Verify total price

2. **Admin Pauses App**
   - Switch to Admin Dashboard
   - Click Pause button
   - Enter reason: "Menu update in progress"

3. **Student Sees Pause Effects**
   - Cart screen shows pause banner
   - Pause overlay blocks items list
   - Text: "Ordering is temporarily disabled"
   - Shows custom reason
   - Checkout button disabled (50% opacity)

4. **Attempt Checkout (Should Fail)**
   - Try clicking disabled checkout button
   - No action should occur
   - Modal doesn't open

5. **Modify Cart While Paused**
   - Try quantity increase/decrease
   - Should still work (modifying existing cart, not placing order)
   - Total updates correctly

6. **Admin Resumes**
   - Resume app from Dashboard
   - Pause banner gone
   - Pause overlay gone
   - Checkout button enabled again (100% opacity)

7. **Checkout Now Works**
   - Click Checkout button
   - Payment modal opens normally
   - Can complete order

#### Expected Results
- ✅ Pause banner shows with custom reason
- ✅ Pause overlay blocks visual flow
- ✅ Checkout button disabled (can't click)
- ✅ Cart can still be modified while paused
- ✅ Resume re-enables checkout
- ✅ Can successfully order after resume

---

### Scenario 6: Pause Default Message

#### Setup
- Admin Dashboard ready

#### Test Steps
1. **Pause Without Custom Reason**
   - Click Pause button
   - Modal opens
   - Leave reason field EMPTY
   - Click "Pause App"

2. **Check Default Message**
   - Admin Banner: Shows "Updating stock items"
   - Student Orders: Shows "Updating stock items"
   - Student Cart: Shows "Updating stock items"

3. **Resume**
   - Click Resume
   - Pause UI disappears

#### Expected Results
- ✅ Default reason is "Updating stock items"
- ✅ Displays consistently across all screens
- ✅ Professional default message

---

### Scenario 7: Multiple Pause/Resume Cycles

#### Setup
- All screens initialized

#### Test Steps
1. **Cycle 1: Pause → Resume**
   - Pause with reason: "First update"
   - Verify pause state on all screens
   - Resume
   - Verify pause UI gone

2. **Cycle 2: Pause with Different Reason**
   - Pause with reason: "Second update - new items"
   - Verify new reason displays
   - Resume

3. **Cycle 3: Pause with Default**
   - Pause without custom reason
   - Verify default reason
   - Resume

4. **Rapid Pause/Resume**
   - Pause → Resume → Pause → Resume
   - Verify smooth transitions
   - No stuck states

#### Expected Results
- ✅ Each cycle works independently
- ✅ Reason changes reflected immediately
- ✅ No residual pause state
- ✅ Rapid cycles work smoothly

---

## Visual Verification Checklist

### Admin Dashboard
- [ ] Pause button appears in Quick Actions header
- [ ] Pause button disappears when paused
- [ ] Pause banner shows when paused (orange, top of scroll)
- [ ] Resume button visible in pause banner
- [ ] QR Scanner card first in actions grid
- [ ] Pause modal opens with TextInput
- [ ] Pause modal has Cancel and Pause buttons

### Student Orders Screen
- [ ] Pause banner shows when paused (orange)
- [ ] QR code displays in correct format (ORD-XXXXXX)
- [ ] Modal closes and opens smoothly
- [ ] Pause message includes custom reason

### Student Cart Screen
- [ ] Pause banner shows at top (orange)
- [ ] Pause overlay shows in items list
- [ ] Checkout button disabled visually (opacity 0.5)
- [ ] Pause reason displays in overlay

### AdminQRScanner Screen
- [ ] Input field for QR code
- [ ] Process button works
- [ ] Order details modal shows correct info
- [ ] Bill generation button works
- [ ] Success modal shows bill details
- [ ] Invalid order shows error

---

## Performance Checks

### Context Updates
- [ ] Pause state updates within 100ms on all screens
- [ ] Resume removes UI immediately (no flicker)
- [ ] Multiple screens in same action don't cause jank

### Stock Updates
- [ ] Stock Management screen updates immediately after bill
- [ ] MenuContext propagates changes to Home screen
- [ ] No lag when viewing multiple orders

### Navigation
- [ ] QR Scanner navigation smooth
- [ ] No memory leaks when opening/closing modals
- [ ] Back button works from QR Scanner

---

## Edge Cases to Test

### Empty States
- [ ] No active orders: QR prompt doesn't show on completed orders
- [ ] Empty cart: Pause overlay not needed
- [ ] No menu items: Admin still shows stats (0 items)

### Modal Interactions
- [ ] Close button (X) on QR modal works
- [ ] Tap outside modal doesn't dismiss (modal is modal)
- [ ] Multiple modals don't stack (one at a time)

### Text Input
- [ ] Pause reason max 50 chars enforced
- [ ] Special characters handled
- [ ] Emojis allowed in reason text
- [ ] Very long text wraps properly

### Network Simulation (Future)
- [ ] Slow bill generation shows loading state
- [ ] Failed bill shows error modal with retry

---

## Known Limitations

1. **Text Input QR**: Doesn't use actual camera
   - Will integrate expo-camera for real scanning

2. **No Real Payments**: Payment status mocked
   - Will connect to real payment gateway

3. **No Real Notifications**: Students must manually refresh for some updates
   - WebSocket is implemented for orders and pause state

---

## Test Execution Notes

### Recommended Order
1. Test pause functionality first (foundational)
2. Test QR display next (student-facing)
3. Test QR scanner after (admin workflow)
4. Test interactions together last

### Environment Setup
```bash
# Make sure services are initialized
- MenuContext with sample items
- BillingContext for bill generation
- AppPauseContext imported in all screens
- Navigation properly configured
```

### Success Criteria
- All scenarios pass ✅
- No console errors
- No TypeScript compile errors
- Smooth animations (no jank)
- Quick transitions between screens

---

## Bug Report Template

If issues found, document:
```
### Bug: [Title]
**Scenario**: [Which scenario]
**Steps to Reproduce**:
1. ...
2. ...
**Expected**: [What should happen]
**Actual**: [What actually happened]
**Screenshot**: [If visual]
**Device**: [iPhone/Android, version]
**Severity**: [High/Medium/Low]
```

---

**Testing Guide Version**: 1.0
**Last Updated**: 2024
**Status**: Ready for QA Testing
