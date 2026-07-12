export const faqData = [
  {
    category: "Buyer Registration",
    faqs: [
      {
        q: "How do I sign up as a buyer on Smart Krishi?",
        a: "Click on the Account link in the navigation sidebar, select Register, choose the Buyer role, and fill in your name, email, phone number, and password. You can also sign up immediately using the Continue with Google option."
      },
      {
        q: "Can I change my account type from Buyer to Seller later?",
        a: "Yes. If you register as a buyer and want to sell products or lease machinery, you can navigate to the Seller Center in your profile menu and complete the 4-step merchant onboarding application."
      },
      {
        q: "What information is required for buyer registration?",
        a: "We only require basic details: First Name, Last Name, Email, Phone Number, and a secure password. We verify your details to ensure transaction security."
      }
    ]
  },
  {
    category: "Seller Registration",
    faqs: [
      {
        q: "How do I register as a seller on Smart Krishi?",
        a: "Log in to your account, click on the Seller Center in the navigation sidebar, and complete the 4-step merchant registration wizard. You will need to provide business details, upload document proofs, and settlement banking information."
      },
      {
        q: "What business structures are supported for seller registration?",
        a: "We support Individual Farmers, Sole Proprietors, Partnerships, and Private Limited companies. Select the structure that matches your registration documents."
      },
      {
        q: "Can I list products immediately after completing the seller onboarding form?",
        a: "No. Your seller profile will first be in PENDING status while our verification team reviews your documents (GST, PAN, Aadhaar). This process typically takes 24 to 48 hours."
      },
      {
        q: "What happens if my seller application is rejected?",
        a: "If rejected, you will see the administrative rejection notes in the Seller Center. You can click Re-open Onboarding Wizard, correct the document details or upload clearer photos, and resubmit."
      }
    ]
  },
  {
    category: "Payments",
    faqs: [
      {
        q: "What payment methods are accepted on Smart Krishi?",
        a: "We support UPI, credit/debit cards, net banking, and secure wallet payments via our integrated payment gateway (Razorpay)."
      },
      {
        q: "How does the Smart Krishi escrow payment system protect users?",
        a: "When you make a payment, the funds are held securely in escrow by Smart Krishi. The seller is notified to dispatch the order. Funds are only released to the seller after you confirm successful delivery."
      },
      {
        q: "Can I pay for my orders cash-on-delivery (COD)?",
        a: "Cash on delivery is available for select local produce and seeds depending on the delivery region and the seller. Look for the COD Available tag on the product detail page."
      },
      {
        q: "Are my payment details secure on your platform?",
        a: "Yes. We do not store your credit card details or UPI PINs on our servers. All transactions are routed through PCI-DSS compliant secure payment gateways."
      }
    ]
  },
  {
    category: "Refunds",
    faqs: [
      {
        q: "How do I request a refund for a damaged or missing order?",
        a: "Go to Buyer Center > My Orders, click on the order details, and select Request Refund. Upload photos of the damaged items and describe the issue."
      },
      {
        q: "How long does it take for a refund to be credited to my account?",
        a: "Once approved, refunds are processed immediately. It typically takes 5 to 7 business days for the amount to reflect in your original payment source (UPI/Bank Account)."
      },
      {
        q: "Can I get a refund on fresh dairy products or crops?",
        a: "For fresh items (like milk) and harvested crops, refund requests must be raised within 12 hours of delivery due to perishability."
      },
      {
        q: "What happens if a seller cancels my order?",
        a: "If a seller cancels your order due to stock issues, a full refund is automatically initiated to your original payment method, and you will receive an instant notification."
      }
    ]
  },
  {
    category: "Orders",
    faqs: [
      {
        q: "How do I place an order on Smart Krishi?",
        a: "Browse the marketplace categories, add items to your cart, click checkout, select your delivery address, choose your payment method, and complete the transaction."
      },
      {
        q: "Can I cancel my order after placing it?",
        a: "You can cancel your order from Buyer Center > My Orders at any time before the seller changes its status to DISPATCHED. Once dispatched, cancellations are not permitted."
      },
      {
        q: "Where can I find my order receipt/invoice?",
        a: "Navigate to Buyer Center > My Orders, click on your order, and select Download Invoice at the top-right corner to save a PDF copy of your bill."
      },
      {
        q: "What do the different order statuses mean?",
        a: "PENDING: Payment is received, waiting for seller acceptance. CONFIRMED: The seller is packaging your items. DISPATCHED: The order is on route with logistics. DELIVERED: You have received the items."
      }
    ]
  },
  {
    category: "Delivery",
    faqs: [
      {
        q: "How do I track my active delivery?",
        a: "Go to Buyer Center > My Orders, click on Track Order next to your active booking. This will open the real-time tracking map showing the delivery vehicle's live coordinates."
      },
      {
        q: "Who handles the delivery of marketplace products?",
        a: "Deliveries are handled by Smart Krishi Logistics partners or the seller's own verified local transport fleet, depending on the distance and type of items."
      },
      {
        q: "What should I do if my delivery is delayed?",
        a: "You can call the delivery agent directly from the tracking page. Alternatively, raise a support ticket or call our toll-free support line at 1800-300-KRISHI."
      },
      {
        q: "Can I schedule a delivery for a specific date and time?",
        a: "Scheduled delivery slots are available for machinery rentals and bulk building materials. You can select your preferred dates during checkout."
      }
    ]
  },
  {
    category: "Reviews",
    faqs: [
      {
        q: "How do I submit a review for a product I purchased?",
        a: "Go to Buyer Center > My Orders, locate the completed order, and click Write Review. Rate the product quality, delivery, and write your feedback."
      },
      {
        q: "Are reviews on Smart Krishi verified?",
        a: "Yes. We only allow reviews from buyers who have actually purchased the item (Verified Purchase). This prevents fake ratings and ensures transparent feedback."
      },
      {
        q: "Can I edit or delete my review after posting it?",
        a: "Yes. You can manage your reviews under Account > My Reviews in the sidebar. Click the edit icon to update your review text or rating."
      },
      {
        q: "How are seller ratings calculated?",
        a: "Seller ratings are the average of all verified customer reviews on their products, calculated using weighted scores of product quality, communication, and delivery speed."
      }
    ]
  },
  {
    category: "Weather",
    faqs: [
      {
        q: "How does the Weather Intelligence feature help farmers?",
        a: "It provides real-time local weather parameters (temperature, humidity, rain probability) and tailors agricultural advisories based on specific weather thresholds (e.g., crop safety during high winds)."
      },
      {
        q: "Where does Smart Krishi obtain its weather data?",
        a: "We aggregate real-time weather information from local IoT farm weather stations and open-source weather telemetry networks."
      },
      {
        q: "How do I access 7-day weather forecasts?",
        a: "In the sidebar, expand Weather Intelligence and select Forecast. You can view daily charts showing temperature ranges and precipitation trends."
      },
      {
        q: "What are Farmer Advisories?",
        a: "These are specialized agro-meteorological recommendations updated daily. They advise on sowing, irrigation, pesticide spraying, and harvesting based on upcoming forecasts."
      }
    ]
  },
  {
    category: "Land Listings",
    faqs: [
      {
        q: "How can I buy or rent agricultural land on Smart Krishi?",
        a: "Go to Marketplace Hub > Land Marketplace. You can search plots by location (state, district), land type (agricultural, fallow), and filter by price."
      },
      {
        q: "How do I list my agricultural land for sale or lease?",
        a: "As an approved seller, navigate to the Seller Center dashboard, select the My Land Listings tab, and click Add Land Listing to enter your title, pricing, coordinates, and images."
      },
      {
        q: "How do I schedule a land site visit?",
        a: "On any land listing detail page, click Request Site Visit. Select your preferred date, enter your contact information, and a verified land surveyor will coordinate the visit."
      },
      {
        q: "What legal verification is performed on land listings?",
        a: "Our team verifies the survey numbers, title deeds, and boundaries before marking listings as VERIFIED on the platform."
      }
    ]
  },
  {
    category: "Machinery Rentals",
    faqs: [
      {
        q: "How do I rent a tractor or other farming machinery?",
        a: "Navigate to Marketplace > Machinery. Select a machine, choose your rental duration (hourly, daily, weekly), specify start and end dates, and complete the booking."
      },
      {
        q: "Is a security deposit required for machinery rentals?",
        a: "Yes. A fully refundable security deposit is held at the time of booking. It is returned within 48 hours of returning the machinery in good working condition."
      },
      {
        q: "What happens if the rented machinery breaks down during operation?",
        a: "Report the breakdown immediately via the Contact Support form or call the hotline. The seller will dispatch a mechanic or supply a replacement vehicle."
      },
      {
        q: "Can I extend my machinery rental duration mid-booking?",
        a: "Extension requests can be made via Account > Machinery Rentals if the vehicle has no conflicting bookings. Contact the seller as early as possible."
      }
    ]
  },
  {
    category: "Inventory",
    faqs: [
      {
        q: "How do I manage my product inventory as a seller?",
        a: "In the Seller Center, go to Inventory or My Listings. You can view stock levels, update available quantities, and edit reorder trigger thresholds."
      },
      {
        q: "What are low-stock alerts?",
        a: "When a product's available quantity drops below the reorder level you set, the system triggers a low-stock alert on your dashboard to remind you to replenish stock."
      },
      {
        q: "Can I temporarily mark a product as out of stock without deleting it?",
        a: "Yes. You can toggle the product status between ACTIVE and INACTIVE from your listings screen. Inactive items will not be visible to buyers."
      },
      {
        q: "What is the reorder quantity field?",
        a: "It is the default quantity suggested by the system to restock when your inventory level falls below the defined reorder threshold."
      }
    ]
  },
  {
    category: "Notifications",
    faqs: [
      {
        q: "What types of notifications will I receive?",
        a: "You will receive real-time notifications about order status updates, payment confirmations, support ticket replies, and system alerts."
      },
      {
        q: "How do I access my notification history?",
        a: "Click on Notifications (bell icon) in the sidebar or topbar to view your full history. Unread notifications will show a green dot indicator."
      },
      {
        q: "Can I customize my notification preferences?",
        a: "Yes. Go to Account > Settings, under Notification Preferences, you can toggle email, SMS, and in-app notifications on or off."
      },
      {
        q: "Why am I not receiving email notifications from Smart Krishi?",
        a: "Ensure your email is verified under Account > Profile. Also, check your spam/junk folder and add no-reply@smartkrishi.test to your safe senders list."
      }
    ]
  },
  {
    category: "Addresses",
    faqs: [
      {
        q: "How do I add or manage my delivery addresses?",
        a: "Navigate to Account > Address Book. You can add new addresses, edit existing ones, and set a primary shipping address."
      },
      {
        q: "Can I add multiple delivery addresses to my profile?",
        a: "Yes. You can store multiple addresses (e.g. Home, Farm, Warehouse) and select the appropriate one during the checkout process."
      },
      {
        q: "How do I set an address as default?",
        a: "In your Address Book, locate the address card and click the Set as Default button. This address will be auto-selected for future orders."
      }
    ]
  },
  {
    category: "Google Login",
    faqs: [
      {
        q: "How do I log in using my Google account?",
        a: "On the login page, click the Sign in with Google button. Select your Google account, and you will be securely authenticated."
      },
      {
        q: "Can I link my existing Smart Krishi email login to Google Login?",
        a: "Yes. If your Google account uses the same email address as your registered Smart Krishi account, signing in with Google will automatically link the two."
      }
    ]
  },
  {
    category: "Account Verification",
    faqs: [
      {
        q: "Why do I need to verify my phone number and email?",
        a: "Verification ensures account security, protects against fraudulent listings, and enables us to send you order updates and password reset links."
      }
    ]
  }
];
