export interface IndustryData {
  slug: string;
  industry: string;
  heroBadge: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  subtitle: string;
  sampleQrValue: string;
  sampleFrame: "menu" | "review" | "order" | "none";
  stats: { value: string; label: string }[];
  keyBenefits: {
    title: string;
    description: string;
    icon: "Utensils" | "Coffee" | "Hotel" | "Calendar" | "Home" | "Beer" | "Zap" | "ShieldCheck" | "TrendingUp" | "Users";
  }[];
  features: {
    title: string;
    description: string;
    tag: string;
  }[];
  stepGuide: {
    step: number;
    title: string;
    description: string;
  }[];
  faqs: { question: string; answer: string }[];
  relatedGuides: { title: string; slug: string }[];
}

export const INDUSTRIES: IndustryData[] = [
  {
    slug: "qr-code-for-restaurants",
    industry: "Restaurants",
    heroBadge: "Hospitality Technology",
    title: "QR Code Ordering & Digital Menus for Restaurants",
    metaTitle: "QR Code for Restaurants — Menus, Ordering & Google Reviews",
    metaDescription: "Boost restaurant table turnover by 42% with interactive QR code menus, contactless tabletop ordering, and automated Google 5-star review collection.",
    subtitle: "Turn tables faster, increase average ticket sizes, and eliminate menu printing costs with high-speed digital menus and live kitchen POS streams.",
    sampleQrValue: "https://www.qrvenues.com/menu/bistro-delight",
    sampleFrame: "menu",
    stats: [
      { value: "+42%", label: "Faster Table Turnover" },
      { value: "+18%", label: "Average Check Size" },
      { value: "0 min", label: "Menu Update Propagation" },
    ],
    keyBenefits: [
      {
        title: "Instant Digital Menus",
        description: "Guests scan table QR codes to view high-definition food photos, allergen filters, and real-time 86'd item availability.",
        icon: "Utensils",
      },
      {
        title: "Contactless Table Ordering",
        description: "Guests add drinks, appetizers, and entrees directly from their mobile browser without waiting for staff to bring order pads.",
        icon: "Zap",
      },
      {
        title: "Automated 5-Star Reviews",
        description: "Happy diners are routed directly to your Google Business Profile review screen; feedback on issues stays private.",
        icon: "TrendingUp",
      },
    ],
    features: [
      {
        title: "Dynamic Table QR Generation",
        description: "Generate unique, sequentially numbered vector QR codes for every dining table, patio seat, and bar stool.",
        tag: "Tabletop Management",
      },
      {
        title: "Kitchen Order Stream (KDS)",
        description: "Orders instantly stream to your kitchen displays or thermal receipt printers with table timestamps.",
        tag: "Live Operations",
      },
      {
        title: "Seasonal & Daily Specials",
        description: "Modify lunch menus, happy hour pricing, and 86 sold-out specials in seconds without reprinting paper cards.",
        tag: "Real-Time Sync",
      },
    ],
    stepGuide: [
      {
        step: 1,
        title: "Upload Food & Drink Catalog",
        description: "Add your menu categories, item photos, dietary tags (vegan, gluten-free, halal), and modifier options.",
      },
      {
        step: 2,
        title: "Customize Branded Table QR Codes",
        description: "Choose high-contrast frames, upload your restaurant logo, and generate table-assigned QR codes.",
      },
      {
        step: 3,
        title: "Print Table Tents & Launch",
        description: "Download print-ready vector SVGs, place table stands on dining tables, and start taking digital orders immediately.",
      },
    ],
    faqs: [
      {
        question: "Do restaurant guests need to download an app to view the menu?",
        answer: "No. QRVenues operates 100% in mobile web browsers (Safari, Chrome, Samsung Internet). Guests simply point their smartphone camera at the table QR code and the menu loads instantly in under 1 second.",
      },
      {
        question: "Can I update prices or 86 sold-out items without reprinting codes?",
        answer: "Yes. All QRVenues tabletop codes are dynamic. You can modify prices, add daily specials, or disable sold-out dishes from your dashboard and changes reflect instantly for dining guests.",
      },
      {
        question: "Does the QR menu support multi-language translation and allergen filters?",
        answer: "Yes. Guests can filter menu items by allergens (gluten, dairy, nuts, shellfish) and view automatic translations in English, Spanish, French, German, and Japanese.",
      },
    ],
    relatedGuides: [
      { title: "How to Build a Scannable Restaurant QR Code Menu", slug: "free-qr-code-generator" },
      { title: "Boost Restaurant Google Reviews with Table QR Codes", slug: "google-review-qr-code" },
    ],
  },
  {
    slug: "qr-code-for-cafes",
    industry: "Cafes & Coffee Shops",
    heroBadge: "Specialty Coffee Solutions",
    title: "QR Code Menus & Countertop Ordering for Cafes",
    metaTitle: "QR Code for Cafes & Coffee Shops — Menu & Review Studio",
    metaDescription: "Speed up morning coffee rush queues, display barista drink modifiers, and capture glowing Google reviews with dedicated cafe QR codes.",
    subtitle: "Enable lightning-fast pastry and espresso ordering, share guest Wi-Fi credentials effortlessly, and turn morning rush patrons into 5-star advocates.",
    sampleQrValue: "https://www.qrvenues.com/menu/artisan-roastery",
    sampleFrame: "menu",
    stats: [
      { value: "3.2 min", label: "Average Coffee Prep Time" },
      { value: "+34%", label: "Pastry & Add-on Upsells" },
      { value: "4.9 ★", label: "Average Google Rating" },
    ],
    keyBenefits: [
      {
        title: "Queue-Busting Speed",
        description: "Let waiting guests browse bean origins, milk alternatives, and pastry selections on their phones before reaching the counter.",
        icon: "Coffee",
      },
      {
        title: "Barista Customization Sliders",
        description: "Guests easily specify roast preference, oat/almond milk, extra espresso shots, and syrup pumps with zero ordering confusion.",
        icon: "Zap",
      },
      {
        title: "One-Touch Guest Wi-Fi",
        description: "Embed WPA3 guest Wi-Fi network credentials into your table QR codes so customers connect securely without asking for passwords.",
        icon: "ShieldCheck",
      },
    ],
    features: [
      {
        title: "Morning Rush Order Queue",
        description: "Visual ticket management for espresso baristas with real-time pickup alerts.",
        tag: "Barista Workflow",
      },
      {
        title: "Coffee Bean Origin Showcase",
        description: "Highlight single-origin notes, elevation, processing methods, and tasting notes directly on item detail cards.",
        tag: "Roastery Storytelling",
      },
      {
        title: "Countertop Display Stands",
        description: "Pre-sized print templates for acrylic stands, coffee cup sleeves, and outdoor sandwich boards.",
        tag: "Print Assets",
      },
    ],
    stepGuide: [
      {
        step: 1,
        title: "Input Espresso & Pastry Menu",
        description: "Configure drinks, milk choices, sweetness levels, and daily baked goods.",
      },
      {
        step: 2,
        title: "Generate Counter & Table QR Codes",
        description: "Style QR codes with coffee-themed frames and high-contrast styling for rapid camera recognition.",
      },
      {
        step: 3,
        title: "Display Near Counter & Tables",
        description: "Place acrylic QR displays near the entrance and on communal tables to eliminate ordering bottlenecks.",
      },
    ],
    faqs: [
      {
        question: "Can cafes use QR codes for pickup orders and dine-in tables simultaneously?",
        answer: "Yes. QRVenues supports dual-mode operation: countertop pickup orders for takeaway guests and numbered table orders for indoor cafe seating.",
      },
      {
        question: "How does the coffee customization interface work for complex orders?",
        answer: "Item modifiers allow guests to select dairy options (oat, almond, soy, whole), temperature preferences, espresso shot counts, and flavor syrups in a clear visual interface.",
      },
    ],
    relatedGuides: [
      { title: "Free QR Code Generator Online", slug: "free-qr-code-generator" },
      { title: "Digital Business Card QR Codes for Baristas & Roasters", slug: "qr-code-visiting-card-generator" },
    ],
  },
  {
    slug: "qr-code-for-hotels",
    industry: "Hotels & Hospitality",
    heroBadge: "Guest Experience Platform",
    title: "QR Code Concierge, Room Service & Amenity Menus for Hotels",
    metaTitle: "QR Code for Hotels — Room Service, Concierge & Amenities",
    metaDescription: "Elevate guest satisfaction with in-room QR code room service menus, digital hotel compendiums, spa bookings, and instant concierge requests.",
    subtitle: "Modernize guest rooms with elegant digital directories, reduce front desk phone congestion, and drive in-house dining and wellness revenue.",
    sampleQrValue: "https://www.qrvenues.com/hotel/the-grand-resort",
    sampleFrame: "order",
    stats: [
      { value: "100%", label: "Paperless In-Room Guides" },
      { value: "+28%", label: "In-Room Dining Revenue" },
      { value: "24/7", label: "Automated Guest Service" },
    ],
    keyBenefits: [
      {
        title: "Contactless In-Room Dining",
        description: "Guests scan bedside or desk QR codes to browse full breakfast, all-day dining, and cocktail menus with room-tagged delivery.",
        icon: "Hotel",
      },
      {
        title: "Interactive Hotel Directory",
        description: "Replace dusty paper binders with rich guides covering pool hours, fitness center access, spa treatments, and local attractions.",
        icon: "TrendingUp",
      },
      {
        title: "Instant Front Desk & Housekeeping Requests",
        description: "Guests request extra towels, late check-outs, luggage assistance, and maintenance directly from their smartphones.",
        icon: "Users",
      },
    ],
    features: [
      {
        title: "Room-Specific Dynamic Routing",
        description: "Assign dedicated QR codes per room number to route food orders and housekeeping tickets automatically to the right wing.",
        tag: "In-Room Ops",
      },
      {
        title: "Spa & Amenity Scheduling",
        description: "Show real-time massage and wellness appointment slots with instant reservation confirmations.",
        tag: "Amenity Booking",
      },
      {
        title: "Multi-Language Guest Concierge",
        description: "Automatic language localization for international business travelers and tourists.",
        tag: "Global Travelers",
      },
    ],
    stepGuide: [
      {
        step: 1,
        title: "Build Hotel Compendium & Menus",
        description: "Add in-room dining menus, housekeeping services, property maps, and checkout guidelines.",
      },
      {
        step: 2,
        title: "Generate Room-Tagged QR Suite",
        description: "Bulk export unique QR codes matched to each room number in high-resolution vector SVG.",
      },
      {
        step: 3,
        title: "Install In-Room Acrylic Displays",
        description: "Place elegant bedside stands and keycard sleeves with clear call-to-action framing.",
      },
    ],
    faqs: [
      {
        question: "Can hotel room service orders be restricted to specific operating hours?",
        answer: "Yes. You can configure scheduled availability for breakfast, lunch, dinner, and late-night menus. Menus automatically lock or switch when operating hours end.",
      },
      {
        question: "How do housekeeping and maintenance alerts work?",
        answer: "Service requests are forwarded via webhook, email, or live dashboard directly to housekeeping and engineering departments with the guest's room number attached.",
      },
    ],
    relatedGuides: [
      { title: "Google Review QR Code Strategy for Hospitality", slug: "google-review-qr-code" },
      { title: "Generate Online QR Codes with Logo & Frames", slug: "generate-qrcode-online" },
    ],
  },
  {
    slug: "qr-code-for-bars",
    industry: "Bars & Nightlife",
    heroBadge: "Bar & Pub Tech",
    title: "QR Code Drink Menus & Fast Tabs for Bars & Breweries",
    metaTitle: "QR Code for Bars & Breweries — Drink Menus & Fast Ordering",
    metaDescription: "Speed up bar service during peak hours with scannable craft beer menus, cocktail lists, and contactless tabletop drink re-orders.",
    subtitle: "Eliminate sticky cocktail menus, showcase rotating tap lists in real time, and let bartenders focus on crafting drinks rather than taking payments.",
    sampleQrValue: "https://www.qrvenues.com/bar/the-copper-taproom",
    sampleFrame: "menu",
    stats: [
      { value: "3x", label: "Faster Peak Hour Service" },
      { value: "100%", label: "Clean, Sanitized Experience" },
      { value: "+22%", label: "Draft Beer Re-orders" },
    ],
    keyBenefits: [
      {
        title: "Live Rotating Tap Lists",
        description: "Update craft beer kegs, ABV, IBU, tasting notes, and winery vintages on the fly as kegs blow during busy shifts.",
        icon: "Beer",
      },
      {
        title: "Counter & Tabletop Ordering",
        description: "Patrons scan bar coasters or table stickers to order rounds without fighting crowded counter crowds.",
        icon: "Zap",
      },
      {
        title: "Happy Hour Countdown Banners",
        description: "Automate dynamic drink specials and food pairing discounts that turn on and off based on exact schedule hours.",
        icon: "TrendingUp",
      },
    ],
    features: [
      {
        title: "Coaster & Counter QR Stickers",
        description: "Waterproof, durable vector print designs optimized for low-light bar environments.",
        tag: "Bar Environment",
      },
      {
        title: "ID & Age Verification Prompts",
        description: "Optional 21+ legal age verification check before patrons access beverage listings.",
        tag: "Compliance",
      },
      {
        title: "Batch Cocktail & Pitcher Ordering",
        description: "Streamlined modifier options for pitcher sizes, cocktail spirit upgrades, and garnish requests.",
        tag: "Upselling",
      },
    ],
    stepGuide: [
      {
        step: 1,
        title: "List Cocktails, Draft Beers & Wines",
        description: "Organize drinks by category with ABV, brewery details, and flavor profiles.",
      },
      {
        step: 2,
        title: "Print High-Contrast Coasters & Bar Placards",
        description: "Choose bold, high-contrast QR frames designed to scan reliably under ambient or dim bar lighting.",
      },
      {
        step: 3,
        title: "Monitor Live Orders on Bar Terminal",
        description: "Bartenders receive orders labeled with table/booth locations for rapid drink assembly.",
      },
    ],
    faqs: [
      {
        question: "How do QR codes scan in dim bar or lounge lighting?",
        answer: "QRVenues utilizes high-contrast matrix rendering with automatic Level H error correction, allowing modern smartphone cameras to detect codes in low-light conditions effortlessly.",
      },
      {
        question: "Can we integrate food truck menus for brewery taprooms?",
        answer: "Yes. Breweries hosting rotating food trucks can easily add and update separate food truck menus on the same taproom table QR codes.",
      },
    ],
    relatedGuides: [
      { title: "Free QR Code Generator Online", slug: "free-qr-code-generator" },
      { title: "Google Review QR Code Setup", slug: "google-review-qr-code" },
    ],
  },
  {
    slug: "qr-code-for-events",
    industry: "Events & Conferences",
    heroBadge: "Event & Conference Management",
    title: "QR Code Agendas, Lead Capture & Badges for Events",
    metaTitle: "QR Code for Events & Conferences — Agendas & Badges",
    metaDescription: "Streamline event check-ins, share live agendas, connect attendees with digital vCards, and gather real-time session feedback via QR codes.",
    subtitle: "Eliminate printed event programs, distribute real-time room schedule updates, and empower attendees and exhibitors with digital networking.",
    sampleQrValue: "https://www.qrvenues.com/events/tech-summit-2026",
    sampleFrame: "none",
    stats: [
      { value: "0 sec", label: "Check-in Scan Latency" },
      { value: "100%", label: "Paperless Conference Schedules" },
      { value: "+55%", label: "Speaker Feedback Submissions" },
    ],
    keyBenefits: [
      {
        title: "Live Interactive Conference Agendas",
        description: "Display speaker keynotes, breakout tracks, room assignments, and downloadable slide decks with instant update capabilities.",
        icon: "Calendar",
      },
      {
        title: "Badge-to-Badge Contact Exchange",
        description: "Equip attendee badges with personal vCard QR codes for contactless LinkedIn and email exchanges.",
        icon: "Users",
      },
      {
        title: "Live Session Polling & Feedback",
        description: "Place session-specific QR codes on projector screens to collect instant ratings and audience questions.",
        icon: "TrendingUp",
      },
    ],
    features: [
      {
        title: "Dynamic Speaker Bios & Slides",
        description: "Link directly to speaker presentations, social channels, and research papers.",
        tag: "Speaker Portal",
      },
      {
        title: "Exhibitor Lead Generation",
        description: "Booth banners and flyers equipped with QR codes for booth visits and raffle signups.",
        tag: "Sponsor Hub",
      },
      {
        title: "Venue Map & Wi-Fi Access",
        description: "Help attendees navigate large convention centers and connect to venue Wi-Fi networks in one scan.",
        tag: "Wayfinding",
      },
    ],
    stepGuide: [
      {
        step: 1,
        title: "Configure Event Tracks & Schedule",
        description: "Input session times, speaker names, room locations, and sponsor highlights.",
      },
      {
        step: 2,
        title: "Export Badge & Lanyard QR Codes",
        description: "Generate individualized or track-specific vector codes for lanyard badges and signage.",
      },
      {
        step: 3,
        title: "Broadcast Live on Stage & Screens",
        description: "Display slide QR codes before and after keynotes for real-time engagement.",
      },
    ],
    faqs: [
      {
        question: "Can event schedules be updated in real time if room changes occur?",
        answer: "Yes. Because QR codes are dynamic, modifying room assignments or speaker times in your dashboard updates all attendee screens immediately without reprinting signage.",
      },
      {
        question: "What formats can we export for badge and banner printing?",
        answer: "QRVenues provides lossless vector SVG and ultra-high-resolution 300 DPI PNG exports suitable for large-format convention banners and roll-up displays.",
      },
    ],
    relatedGuides: [
      { title: "QR Code Visiting Card Generator", slug: "qr-code-visiting-card-generator" },
      { title: "Generate Custom QR Code Online", slug: "generate-qrcode-online" },
    ],
  },
  {
    slug: "qr-code-for-real-estate",
    industry: "Real Estate",
    heroBadge: "PropTech Solutions",
    title: "QR Code Property Sign Riders & Virtual Tours for Real Estate",
    metaTitle: "QR Code for Real Estate — Property Sign Riders & Tours",
    metaDescription: "Capture active home buyer leads 24/7 with QR code yard sign riders linking directly to 3D virtual tours, floor plans, and agent contact vCards.",
    subtitle: "Turn drive-by traffic into qualified buyer inquiries. Give prospective buyers instant access to pricing, photo galleries, and private showing bookings.",
    sampleQrValue: "https://www.qrvenues.com/property/104-grand-view",
    sampleFrame: "none",
    stats: [
      { value: "24/7", label: "Lead Capture On Yard Signs" },
      { value: "+60%", label: "Virtual Tour Engagement" },
      { value: "1 Tap", label: "Agent vCard Phone Save" },
    ],
    keyBenefits: [
      {
        title: "Yard Sign Rider Virtual Tours",
        description: "Drive-by home seekers scan the yard sign to immediately explore 3D Matterport tours, interior photos, and neighborhood details.",
        icon: "Home",
      },
      {
        title: "Instant Digital Property Flyers",
        description: "Never run out of paper flyers in weatherproof sign boxes. Deliver crisp digital PDF spec sheets straight to buyer phones.",
        icon: "Zap",
      },
      {
        title: "One-Tap Agent Contact Save",
        description: "Encode listing agent vCards with direct phone dialing, WhatsApp chat, and calendar showing scheduler links.",
        icon: "Users",
      },
    ],
    features: [
      {
        title: "Open House Sign-in Sheets",
        description: "Place entry QR codes on foyer tables for fast, contactless guest check-ins and follow-up CRM sync.",
        tag: "Open House",
      },
      {
        title: "Neighborhood & School Info Hub",
        description: "Link buyers to local school district ratings, walk scores, and property tax records.",
        tag: "Property Intel",
      },
      {
        title: "Weatherproof Vector Print Assets",
        description: "Export scalable vector SVGs formatted specifically for aluminum sign rider fabrication.",
        tag: "Sign Rider Ready",
      },
    ],
    stepGuide: [
      {
        step: 1,
        title: "Create Property Showcase Page",
        description: "Add listing price, photo gallery, 3D tour link, floor plan, and agent contact info.",
      },
      {
        step: 2,
        title: "Generate Branded Sign Rider QR",
        description: "Choose a prominent 'Scan for Virtual Tour' frame with agent branding.",
      },
      {
        step: 3,
        title: "Attach to Yard Sign & Digital Flyers",
        description: "Mount sign riders on for-sale posts and embed in print brochures and postcard mailers.",
      },
    ],
    faqs: [
      {
        question: "Can the QR code destination be updated once a property is sold or price-reduced?",
        answer: "Yes. Dynamic QR codes allow you to change the destination URL to a 'Just Sold' showcase or new listing at any time without replacing the physical sign rider.",
      },
      {
        question: "Do buyers need a specific app to view the 3D property tour?",
        answer: "No. The QR code opens directly in the buyer's default mobile browser (Safari, Chrome) and loads Matterport, YouTube, or web tours instantly.",
      },
    ],
    relatedGuides: [
      { title: "QR Code Visiting Card & vCard Generator", slug: "qr-code-visiting-card-generator" },
      { title: "Free Custom QR Code Creator", slug: "free-qr-code-generator" },
    ],
  },
];

export function getIndustryBySlug(slug: string): IndustryData | null {
  return INDUSTRIES.find((i) => i.slug === slug) || null;
}

export function getAllIndustrySlugs(): string[] {
  return INDUSTRIES.map((i) => i.slug);
}
