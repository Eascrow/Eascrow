# Eascrow Project - To-Do List

## Security Issues

### 1. **CRITICAL**: Secret Key Exposed on Client Side

- **Location**: `eascrow_dapp/app/openDetails/page.tsx` (lines 52-54)
- **Issue**: Using `NEXT_PUBLIC_ADMIN_SECRET_KEY` environment variable exposes the secret key to the browser
- **Code**:
  ```typescript
  const signerKeypair = Keypair.fromSecret(
    `${process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY}`
  );
  ```
- **Risk**: High - Secret keys should never be accessible on the client side
- **Solution**: Move signing operations to a secure server-side API endpoint

## Code Quality Issues

### 2. **Hardcoded Values Need to be Addressed**

- **Location**: `eascrow_dapp/app/overview/page.tsx` (lines 59-77)
- **Issue**: Hardcoded values in the UI that should be dynamic
- **Code**:
  ```typescript
  <p className="text-xs">$3,425</p>
  // ...
  <p className="text-xs text-white">38762.21</p>
  ```
- **Priority**: Medium - Should be replaced with dynamic data fetching
- **Solution**: Implement proper data fetching for real-time values

### 3. **TableComponent with Static Data**

- **Location**: `eascrow_dapp/components/shared/TableComponent.tsx` (entire component)
- **Issue**: All table rows contain hardcoded mock data instead of dynamic content
- **Code**:
  ```typescript
  <TableRow className="text-xs">
    <TableCell>Limited Hoodie</TableCell>
    <TableCell>06/04/2024</TableCell>
    <TableCell>Product</TableCell>
    <TableCell>john@gmail.com</TableCell>
    <TableCell>Pending</TableCell>
    // ... more hardcoded rows
  </TableRow>
  ```
- **Priority**: Medium - Component should accept props or fetch real escrow data
- **Solution**:
  - Add props interface for table data
  - Implement data fetching from escrow contracts
  - Add loading and empty states

### 4. **Non-Functional Form Elements**

- **Location**: `eascrow_dapp/app/overview/page.tsx` (lines 232-247)
- **Issue**: Textarea and Send button with no actual functionality
- **Code**:
  ```typescript
  <textarea
    name=""  // Empty name attribute
    id=""    // Empty id attribute
    className="w-full h-[117px] py-2 px-4 bg-[rgba(52,69,92,0.25)] text-xs border border-[#2C303D] rounded-lg"
    placeholder="message"
  ></textarea>
  <div className="flex justify-end">
    <Button
      type="submit"  // Submit button with no form or handler
      className="h-[30px] bg-mintGreen text-background text-sm font-bold"
    >
      Send
    </Button>
  </div>
  ```
- **Issues**:
  - No form wrapper (`<form>` element)
  - No onSubmit handler
  - Empty name/id attributes
  - Button appears functional but does nothing
- **Priority**: Medium - Misleading UX, users expect it to work
- **Solution**: Either implement the functionality or remove the UI elements

### 5. **Contact Form Redirects to Production Site**

- **Location**: `eascrow_dapp/app/contactForm/page.tsx` (lines 26-30)
- **Issue**: Form redirects to eascrow.com instead of staying on localhost during development
- **Code**:
  ```typescript
  <form
    action="https://public.herotofu.com/v1/b49571c0-f290-11ef-831c-f7fd4c94a18d"
    method="post"
    acceptCharset="UTF-8"
    className="w-[788px]"
  >
  ```
- **Problems**:
  - Uses HeroToFu service with hardcoded production redirect
  - No environment-based configuration
  - Poor development experience
  - Form submission takes users away from localhost
- **Priority**: Medium - Breaks development workflow
- **Solutions**:
  - Configure HeroToFu with proper redirect URLs for dev/prod
  - Implement client-side form handling with API routes
  - Add environment-specific form actions
  - Consider using Next.js API routes instead of external service

### 6. **Entire Settings Page is Non-Functional**

- **Location**: `eascrow_dapp/app/parameters/page.tsx` (entire component)
- **Issue**: Complete settings page with no actual functionality - just a UI mockup
- **Problems**:

  ```typescript
  // Navigation links go nowhere
  <Link href={'#'} className="p-2 rounded hover:bg-background">

  // Invalid form action
  <form action="htmlFor" className="space-y-8 mb-8">

  // Buttons that do nothing
  <Button className="bg-transparent text-sm shadow-none">Delete</Button>
  <Button className="text-sm text-mintGreen bg-transparent shadow-none">Update</Button>
  ```

- **Missing Functionality**:
  - No form submission handling
  - No state management for form inputs
  - Navigation tabs don't work (all link to '#')
  - Update/Delete buttons have no event handlers
  - No data persistence or API integration
  - No validation or error handling
- **Priority**: High - Entire page is misleading to users
- **Solution**:
  - Implement proper form handling with React state
  - Add navigation between settings sections
  - Connect to backend for data persistence
  - Add validation and error states
  - Or mark as "Coming Soon" if not ready

### 7. **"Buy $XLM" Button is Misleading**

- **Location**: `eascrow_dapp/app/overview/page.tsx` (lines 83-89)
- **Issue**: Button labeled "Buy $XLM" just redirects to homepage instead of providing purchase functionality
- **Code**:
  ```typescript
  <Link href="/">
    <Button className="w-full bg-transparent border border-mintGreen text-mintGreen text-sm font-bold">
      Buy $XLM
    </Button>
  </Link>
  ```
- **Problems**:
  - Misleading button text - users expect to buy XLM
  - Just redirects to homepage ("/")
  - No actual purchase or exchange functionality
  - False advertising of feature
- **Priority**: Medium - Creates false expectations
- **Solutions**:
  - Link to a real XLM exchange (Coinbase, Kraken, etc.)
  - Integrate with DEX/exchange API
  - Change button text to be accurate
  - Remove button if functionality isn't ready
  - Add "Coming Soon" state

## Next Steps

- [ ] Address critical security issue first
- [ ] Implement server-side signing mechanism
- [ ] Replace hardcoded values with dynamic data
- [ ] Continue code review for additional issues
