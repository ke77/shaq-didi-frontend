# ShaQ DIDI - Sign Up & Onboarding Experience

An authentic, pixel-accurate implementation of the **ShaQ DIDI** onboarding experience featuring a split-screen desktop layout, dedicated mobile view, role selection for Permanent Staff (PS) and National Service Personnel (NSP), styled with Tailwind CSS and DaisyUI.

***

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and design parameters have been confirmed based on your input:

- **Confirmed Decision 1 (Runtime Architecture)**: Built using React 19 + Tailwind CSS + DaisyUI. We will establish a modular Next-compatible directory structure (`app/` or `components/` layout with clean separation of concerns) seamlessly integrated into the container dev server running on port 3000.
- **Confirmed Decision 2 (Role Identification)**: The radio selection options represent **Permanent Staff (PS)** and **National Service Personnel (NSP)** with clean tooltips/sub-labels explaining the acronyms while preserving the exact "PS" and "NSP" visual presentation from the design mockup.
- **Confirmed Decision 3 (Navigation Scope)**: Dedicated focus on the **Sign Up** flow. The "Sign In" actions (outline button on hero and bottom link) are styled accurately as inactive/informational affordances with friendly toast guidance ("Sign In is currently inactive in this preview").
- **Visual Presentation Choice**: Provide a responsive layout that automatically adapts to the screen size, alongside an interactive **Dual View Switcher** (Split Desktop vs. Mobile Services preview) in a subtle top control bar so you can review both mockup states side by side or individually.

***

## 1. Overview & Core Concept

- **What It Does**: A food order and service coordination portal onboarding page ("Assign a Personnel, Simplify Your Order!"). It enables newly onboarding personnel (Permanent Staff or National Service Personnel) to register their account with their full name, email address, secure password, and phone number.
- **Target Audience / Persona**: Company staff, operations teams, and national service personnel registering into the ShaQ DIDI food ordering & personnel dispatch system.
- **Key Value**: Frictionless sign-up experience with instant visual credibility, clear role designation, tactile DaisyUI inputs, and flawless responsiveness across mobile and desktop devices.

***

## 2. User Experience & Visual Design

### Key User Flows
1. **Landing & View Selection**: The user arrives on the page. On desktop, they see the 50/50 split layout: dark gourmet food hero on the left, crisp white registration card on the right. On mobile or when toggling "Mobile View", they see the stacked mobile card view with the compact top hero banner and rounded bottom corners.
2. **Personnel Role Selection**: The user selects their role via radio buttons:
   - `PS`: Permanent Staff (selected by default with branded red accent indicator)
   - `NSP`: National Service Personnel
3. **Form Completion & Validation**:
   - **Full Name**: Text input with clean focus ring
   - **Email address**: Email input with format validation
   - **Password**: Password input with visibility toggle (show/hide password eye icon) and strength indicator
   - **Phone Number**: Phone input with automatic formatting
4. **Submission & Feedback**: Clicking the vibrant red **Sign Up** button initiates validation. If fields are missing or invalid, localized inline messages guide the user. On valid submission, a DaisyUI success alert/modal confirms account registration.

### Visual Identity & Theme
- **Color Palette**:
  - **Brand Accent / Primary**: `#E53935` / `#DC2626` (Vibrant Crimson Red for "ShaQ", active radio dot, and "Sign Up" button)
  - **Neutral Canvas**: `#FFFFFF` for the form container, `#0F172A` deep slate for dark hero accents
  - **Hero Overlay**: Subtle dark emerald & charcoal vignette (`bg-black/45`) over an overhead rustic food table spread (pasta, seasoned dishes, herbs, wooden table)
  - **Border & Surface**: `#E2E8F0` / `#CBD5E1` for delicate hairline borders on form inputs
  - **Typography Weights**: Bold display font for "Welcome to ShaQ DIDI" and "Let's Get Started", soft medium for "Create an Account"
- **Typography & Font Pairing**:
  - Display face: `Plus Jakarta Sans` / `Outfit` (clean geometric neo-grotesque)
  - Body & Form labels: `Plus Jakarta Sans` (14px–16px, high legibility)

### Interactive Feedback & Motion
- Smooth radio selection transitions with custom red radio ring
- Focus rings on input fields using brand red glow (`focus:border-red-500 focus:ring-1 focus:ring-red-500`)
- Button hover micro-interaction (`hover:bg-red-700 active:scale-[0.99] transition-all`)
- Mobile view switcher with smooth cross-fade animation via Motion

***

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: DaisyUI 5 + Tailwind CSS Integration**
  - *Chosen Approach*: Install and configure `daisyui` alongside `@tailwindcss/vite` for pre-styled, accessible UI primitives (buttons, radio buttons, form controls, alerts).
  - *Why*: DaisyUI provides semantic component classes (`btn`, `radio`, `form-control`, `input`, `alert`) with zero runtime overhead, perfectly matching the required spec.
  - *Alternatives Considered*: Writing 100% custom utility classes from scratch; discarded because DaisyUI ensures consistent accessibility and keyboard navigation out of the box.

- **Decision 2: High-Quality Overhead Food Photography Hero Asset**
  - *Chosen Approach*: Generate an authentic high-resolution food spread image via `generate_image` matching the screenshot's dark wooden table with pasta, seafood, fresh greens, and warm culinary lighting.
  - *Why*: Visual fidelity to the user's design attachment is essential; using a matching generated asset ensures crisp, uncompressed visuals with no broken external URLs.

- **Decision 3: Mockup Dual-Preview Mode**
  - *Chosen Approach*: In addition to fluid responsive CSS breakpoints (`lg:grid lg:grid-cols-2`), include a subtle top preview toolbar allowing the reviewer to toggle between "Desktop (Split View)" and "Mobile Device Frame (Mobile Services)" to inspect both variants from the screenshot.
  - *Why*: Directly honors both representations in the user's uploaded image.

***

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                              App Container                             │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Preview Bar (Responsive Breakpoint Mode / Desktop / Mobile Frame)│  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                   │                                    │
│         ┌─────────────────────────┴─────────────────────────┐          │
│         ▼                                                   ▼          │
│  ┌──────────────────────────────┐       ┌───────────────────────────┐  │
│  │   Hero Section (Left/Top)    │       │ Form Container (Right)    │  │
│  │  - Photographic Background   │       │  - "Let's Get Started"    │  │
│  │  - "Welcome to ShaQ DIDI"    │       │  - "Create an Account"    │  │
│  │  - Personnel Tagline         │       │  - Role Radio (PS / NSP)  │  │
│  │  - Outline "Sign In" Button  │       │  - Form Input Controls    │  │
│  └──────────────────────────────┘       │  - Primary Sign Up Action │  │
│                                         │  - Inactive Sign In Link  │  │
│                                         └───────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Model & Form State

```typescript
type PersonnelRole = 'PS' | 'NSP'; // PS: Permanent Staff, NSP: National Service Personnel

interface SignUpFormData {
  role: PersonnelRole;
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
}
```

### Step-by-Step Implementation Steps
1. **Package Setup**: Install `daisyui` and configure with Tailwind CSS in `src/index.css`.
2. **Hero Image Generation**: Generate an authentic gourmet dining table background image matching the mockup using `generate_image`.
3. **Core Components**:
   - `HeroBanner.tsx`: Left panel with culinary backdrop, "Welcome to ShaQ DIDI" typography, tagline, and transparent outline button.
   - `SignUpForm.tsx`: Right panel with title, subtitle, PS/NSP radio group, styled inputs with floating or clean placeholder text, visibility toggles, and red "Sign Up" button.
   - `SuccessModal.tsx`: DaisyUI modal confirmation displaying registered personnel details.
   - `PreviewToolbar.tsx`: Optional top switcher to preview both Desktop Split and Mobile Frame modes.
4. **Verification & Testing**: Run `lint_applet` and `compile_applet` to verify compilation, test form validation, and ensure pixel-perfect fidelity.
