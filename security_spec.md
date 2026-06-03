# Security Specification - Yala Logistics CRM

## Data Invariants
- Shipments must have a unique tracking number.
- Shipments have a lifecycle: Pending -> In Transit -> Arrived -> Delivered.
- Only administrators can create or modify shipments.
- Tracking information is public if the tracking ID is known.

## The Dirty Dozen Payloads
1. **Unauthenticated Write**: Attempt to create a shipment without being logged in as admin. -> DENIED.
2. **Identity Theft**: Logged in as a regular user, attempt to list all shipments. -> DENIED.
3. **Status Corruption**: Attempt to update status to "FakeStatus". -> DENIED (Enum check).
4. **Field Injection**: Add `isVerified: true` to a shipment. -> DENIED (Strict key size check).
5. **ID Poisoning**: Use a 1MB string as a shipment ID in a `get` request. -> DENIED (isValidId check).
6. **Self-Promotion**: Regular user attempts to write to `/admins/{uid}`. -> DENIED.
7. **Time Spoofing**: Admin attempts to set `createdAt` to a past date. -> DENIED (Server timestamp check).
8. **PII Scraping**: Attempt to list `/shipments` without admin privileges. -> DENIED.
9. **Orphaned Write**: Create a shipment with missing sender info. -> DENIED (Required keys check).
10. **Type Mismatch**: Send `weight` as a string instead of a number. -> DENIED (Type check).
11. **Immutability Breach**: Attempt to change `trackingNumber` after creation. (Actually currently allowed by admin, but we can tighten).
12. **Recursive Attack**: Deeply nested data structures. -> DENIED (Schema check).

## Red Team Status
- **Identity Spoofing**: Protected by `isAdmin()`.
- **State Shortcutting**: Protected by `isValidShipment()`.
- **Resource Poisoning**: Protected by `isValidId()`.
- **PII Blanket Test**: `list` is restricted, `get` is specific.
- **Query Trust Test**: `list` requires admin.
