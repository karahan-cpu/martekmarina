# Marina Smart Pedestal App - Design Guidelines

## Design Approach
**System-Based Approach**: Material Design principles adapted for maritime/utility contexts, optimized for mobile-first usage with clear functional hierarchy and touch-friendly controls.

**Rationale**: This is a utility-focused marina management application where efficiency, clarity, and reliability are paramount. Users need quick access to pedestal controls, real-time monitoring, and service management in outdoor/marina environments.

---

## Typography

**Primary Font**: Inter or Roboto (via Google Fonts CDN)
- Headers (H1): 28px, semibold - Main screen titles
- Headers (H2): 22px, semibold - Section headers
- Headers (H3): 18px, medium - Card titles, pedestal names
- Body Large: 16px, regular - Primary content, metrics
- Body: 14px, regular - Secondary information, descriptions
- Caption: 12px, regular - Timestamps, status labels

**Accent Font**: DM Sans (for Martek branding elements)
- Used sparingly for company name and special CTAs

---

## Layout System

**Spacing Units**: Tailwind primitives of 2, 4, 6, 8, 12, 16, 20
- Component padding: p-4, p-6
- Section spacing: space-y-6, space-y-8
- Card gaps: gap-4, gap-6
- Touch targets: minimum h-12, w-12

**Container Strategy**:
- Mobile-first: Full-width with px-4 horizontal padding
- Max-width: max-w-7xl for dashboard views
- Cards: Consistent rounded-xl corners with shadow-md elevation

---

## Core Components

### Navigation
**Bottom Tab Bar** (sticky, mobile-optimized):
- 5 primary tabs: Dashboard, Pedestals, Bookings, Services, Profile
- Active state with icon fill + label weight change
- Icon size: 24px with 8px label spacing

### Dashboard (Home Screen)
**Hero Section**:
- Martek branded header with company logo (120px width)
- "Quick Actions" card grid (2-column on mobile, 4-column on tablet+)
- Advertisement banner slot (300x100 aspect ratio)

**Status Overview Cards**:
- 2-column grid showing: Active Pedestals, Water Usage, Power Usage, Pending Requests
- Each card: Icon (32px) + Large metric + Label + Trend indicator
- Iconography from Heroicons

### Smart Pedestal Control
**Pedestal List View**:
- Vertical scrolling cards with pedestal identifier, status badge, and action buttons
- Status indicators: Available (green), Occupied (blue), Maintenance (amber), Offline (gray)
- Each card includes: Berth number (large), boat name (if occupied), service toggles

**Individual Pedestal Panel**:
- Full-screen modal with pedestal details
- Service toggles (water/electricity) with ON/OFF states - 56px height for easy tapping
- Real-time consumption meters with circular progress indicators
- Service cost calculator showing current session charges

### Berth Map
**Interactive Marina Layout**:
- SVG-based marina map with labeled berths
- Color-coded pedestal status visualization
- Pinch-to-zoom capability
- Tap pedestal to open control panel

### Booking Interface
**Calendar Picker**:
- Month view calendar with availability indicators
- Date range selection for multi-day bookings
- Time slot picker (scrollable list, 1-hour increments)
- Pedestal selection dropdown with filtered availability

**Booking Summary Card**:
- Selected dates, pedestal number, estimated cost
- Service preferences checkboxes (water/electricity)
- Confirmation CTA button (full-width, h-14)

### Advertisement Integration
**Banner Placements**:
- Dashboard top: 320x100 banner after hero
- Pedestal list: Interstitial every 5 items (300x250)
- Booking flow: Bottom sticky banner (320x50)
- Profile: Single banner before usage history

**Ad Container Styling**: Subtle gray border, labeled "Advertisement" caption, rounded-lg corners

### Service Request Form
**Form Layout**:
- Request type dropdown (Maintenance, Technical, General)
- Pedestal/berth number input with autocomplete
- Description textarea (4 rows minimum)
- Photo upload button with preview thumbnails
- Urgency selector (Normal/Urgent radio buttons)
- Submit button (full-width, primary color)

### User Profile
**Profile Header**:
- User avatar (96px circular) + Name + Membership tier
- "Edit Profile" link (top-right)

**Boat Information Card**:
- Boat name, type, length, registration
- Quick edit icon button

**Usage History**:
- Tabular list of past bookings
- Each row: Date, pedestal, duration, cost
- "View Details" expandable sections

---

## Visual Elements

**Cards**: All content in elevated cards with rounded-xl, shadow-md, bg-white
**Buttons**: 
- Primary: h-12, rounded-lg, font-medium
- Secondary: h-10, rounded-lg, border variant
- Icon buttons: h-10 w-10, rounded-full

**Status Badges**: Pill-shaped (rounded-full), 8px padding horizontal, uppercase text-xs
**Dividers**: 1px borders between major sections in lists
**Loading States**: Skeleton screens with pulse animation for data fetching

---

## Images

**Hero Image**: Optional subtle maritime background (boats/marina) with 40% opacity overlay for Martek branding section
**Profile Avatars**: User and boat placeholder images
**Advertisement Slots**: Dynamic content from ad network
**Icon Library**: Heroicons (outline for inactive, solid for active states)

---

## Accessibility

- Minimum touch targets: 44x44px
- High contrast status indicators (WCAG AA compliant)
- Clear focus states on all interactive elements (2px outline)
- Semantic HTML with proper ARIA labels for toggles and controls
- Font sizes never below 14px for body text