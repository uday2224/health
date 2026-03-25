export const mockPatients = [
  { id: "p1", name: "Rajesh Kumar", phone: "+919876543210", email: "rajesh@email.com", bloodGroup: "O+", address: "MG Road, Shimoga", hasActiveBooking: true, hasSubscription: true },
  { id: "p2", name: "Priya Sharma", phone: "+919876543211", email: "priya@email.com", bloodGroup: "A+", address: "Jayanagar, Bangalore", hasActiveBooking: false, hasSubscription: false },
  { id: "p3", name: "Amit Patel", phone: "+919876543212", email: "amit@email.com", bloodGroup: "B+", address: "Vijayanagar, Mysore", hasActiveBooking: false, hasSubscription: true },
];

export const mockNurses = [
  { id: "n1", name: "Deepa R.", phone: "+919876543220", specializations: ["Wound Care", "IV Therapy", "Post-Op"], rating: 4.9, reviews: 142, experience: 8, status: "ACTIVE", verificationStatus: "active", avatar: "", pricePerVisit: 799, completionRate: 98, totalBookings: 312, bio: "8 years of experience in post-operative and wound care nursing.", licenseNumber: "KA-LIC-2018-001" },
  { id: "n2", name: "Sunitha M.", phone: "+919876543221", specializations: ["Geriatric", "Palliative Care"], rating: 4.8, reviews: 98, experience: 12, status: "ACTIVE", verificationStatus: "active", avatar: "", pricePerVisit: 899, completionRate: 97, totalBookings: 256, bio: "Specialized in elderly and palliative care with compassion.", licenseNumber: "KA-LIC-2015-002" },
  { id: "n3", name: "Kavitha S.", phone: "+919876543222", specializations: ["Pediatric", "Mother-Baby"], rating: 4.7, reviews: 67, experience: 5, status: "ACTIVE", verificationStatus: "active", avatar: "", pricePerVisit: 699, completionRate: 95, totalBookings: 145, bio: "Passionate about mother and child healthcare.", licenseNumber: "KA-LIC-2021-003" },
  { id: "n4", name: "Rekha V.", phone: "+919876543223", specializations: ["ICU Care", "Diabetic Care"], rating: 0, reviews: 0, experience: 3, status: "PENDING_VERIFICATION", verificationStatus: "pending", avatar: "", pricePerVisit: 649, completionRate: 0, totalBookings: 0, bio: "Recently certified ICU nurse seeking home care opportunities.", licenseNumber: "KA-LIC-2024-004" },
  { id: "n5", name: "Lakshmi P.", phone: "+919876543224", specializations: ["Physiotherapy", "Geriatric"], rating: 4.5, reviews: 34, experience: 6, status: "SUSPENDED", verificationStatus: "suspended", avatar: "", pricePerVisit: 749, completionRate: 88, totalBookings: 89, bio: "Physiotherapy specialist with focus on rehabilitation.", licenseNumber: "KA-LIC-2019-005" },
];

export type BookingStatus = "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "REVIEWED";

export const mockBookings = [
  { id: "BK001", patientId: "p1", patientName: "Rajesh Kumar", nurseId: "n1", nurseName: "Deepa R.", date: "2026-03-24", time: "10:00 AM", address: "MG Road, Shimoga", status: "IN_PROGRESS" as BookingStatus, type: "Scheduled", amount: 799, paymentStatus: "Paid" },
  { id: "BK002", patientId: "p1", patientName: "Rajesh Kumar", nurseId: "n2", nurseName: "Sunitha M.", date: "2026-03-25", time: "2:00 PM", address: "MG Road, Shimoga", status: "CONFIRMED" as BookingStatus, type: "Scheduled", amount: 899, paymentStatus: "Paid" },
  { id: "BK003", patientId: "p2", patientName: "Priya Sharma", nurseId: "n1", nurseName: "Deepa R.", date: "2026-03-20", time: "9:00 AM", address: "Jayanagar, Bangalore", status: "COMPLETED" as BookingStatus, type: "Scheduled", amount: 799, paymentStatus: "Paid" },
  { id: "BK004", patientId: "p2", patientName: "Priya Sharma", nurseId: "n3", nurseName: "Kavitha S.", date: "2026-03-18", time: "11:00 AM", address: "Jayanagar, Bangalore", status: "REVIEWED" as BookingStatus, type: "Acute", amount: 699, paymentStatus: "Paid" },
  { id: "BK005", patientId: "p3", patientName: "Amit Patel", nurseId: "n2", nurseName: "Sunitha M.", date: "2026-03-19", time: "3:00 PM", address: "Vijayanagar, Mysore", status: "CANCELLED" as BookingStatus, type: "Scheduled", amount: 899, paymentStatus: "Refunded" },
  { id: "BK006", patientId: "p1", patientName: "Rajesh Kumar", nurseId: "n3", nurseName: "Kavitha S.", date: "2026-03-15", time: "10:00 AM", address: "MG Road, Shimoga", status: "COMPLETED" as BookingStatus, type: "Scheduled", amount: 699, paymentStatus: "Paid" },
  { id: "BK007", patientId: "p3", patientName: "Amit Patel", nurseId: "n1", nurseName: "Deepa R.", date: "2026-03-26", time: "9:00 AM", address: "Vijayanagar, Mysore", status: "PENDING" as BookingStatus, type: "Scheduled", amount: 799, paymentStatus: "Pending" },
  { id: "BK008", patientId: "p2", patientName: "Priya Sharma", nurseId: null, nurseName: null, date: "2026-03-27", time: "4:00 PM", address: "Jayanagar, Bangalore", status: "PENDING" as BookingStatus, type: "Acute", amount: 750, paymentStatus: "Pending" },
];

export const mockPrescriptions = [
  {
    id: "RX001", patientId: "p1", date: "2026-03-22", status: "CONFIRMED", imageUrl: "/placeholder.svg", medicineCount: 4,
    medicines: [
      { name: "Amoxicillin 500mg", dosage: "500mg", frequency: "3 times/day", duration: "7 days", instructions: "After meals", confidence: 95 },
      { name: "Paracetamol 650mg", dosage: "650mg", frequency: "As needed", duration: "5 days", instructions: "For fever >100°F", confidence: 98 },
      { name: "Omeprazole 20mg", dosage: "20mg", frequency: "Once daily", duration: "14 days", instructions: "Before breakfast", confidence: 88 },
      { name: "Cetirizine 10mg", dosage: "10mg", frequency: "Once daily", duration: "7 days", instructions: "At bedtime", confidence: 72 },
    ],
  },
  {
    id: "RX002", patientId: "p1", date: "2026-03-18", status: "EXTRACTED", imageUrl: "/placeholder.svg", medicineCount: 2,
    medicines: [
      { name: "Metformin 500mg", dosage: "500mg", frequency: "Twice daily", duration: "30 days", instructions: "With meals", confidence: 92 },
      { name: "Vitamin D3", dosage: "60000 IU", frequency: "Once weekly", duration: "8 weeks", instructions: "After lunch", confidence: 85 },
    ],
  },
  {
    id: "RX003", patientId: "p2", date: "2026-03-10", status: "USED", imageUrl: "/placeholder.svg", medicineCount: 3,
    medicines: [
      { name: "Azithromycin", dosage: "500mg", frequency: "Once daily", duration: "3 days", instructions: "Empty stomach", confidence: 96 },
      { name: "Montelukast", dosage: "10mg", frequency: "Once daily", duration: "14 days", instructions: "At night", confidence: 91 },
      { name: "Salbutamol Inhaler", dosage: "2 puffs", frequency: "As needed", duration: "Ongoing", instructions: "For breathing difficulty", confidence: 78 },
    ],
  },
];

export const mockUsers = [
  { id: "p1", name: "Rajesh Kumar", email: "rajesh@email.com", phone: "+919876543210", role: "patient" as const, createdAt: "2025-01-15" },
  { id: "p2", name: "Priya Sharma", email: "priya@email.com", phone: "+919876543211", role: "patient" as const, createdAt: "2025-02-10" },
  { id: "p3", name: "Amit Patel", email: "amit@email.com", phone: "+919876543212", role: "patient" as const, createdAt: "2025-02-20" },
  { id: "n1", name: "Deepa R.", email: "deepa@email.com", phone: "+919876543220", role: "nurse" as const, createdAt: "2024-12-01" },
  { id: "n2", name: "Sunitha M.", email: "sunitha@email.com", phone: "+919876543221", role: "nurse" as const, createdAt: "2024-11-15" },
  { id: "n3", name: "Kavitha S.", email: "kavitha@email.com", phone: "+919876543222", role: "nurse" as const, createdAt: "2025-01-05" },
  { id: "admin1", name: "Admin User", email: "admin@tezhealth.com", phone: "+919999999999", role: "admin" as const, createdAt: "2024-01-01" },
];

export const mockPayments = [
  { id: "PAY001", stripeId: "pi_3abc123", patientName: "Rajesh Kumar", nurseName: "Deepa R.", amount: 799, type: "Booking", status: "Paid", date: "2026-03-24", description: "Booking - Wound Care" },
  { id: "PAY002", stripeId: "pi_3abc124", patientName: "Rajesh Kumar", nurseName: "Sunitha M.", amount: 899, type: "Booking", status: "Paid", date: "2026-03-25", description: "Booking - Geriatric Care" },
  { id: "PAY003", stripeId: "pi_3abc125", patientName: "Priya Sharma", nurseName: "Deepa R.", amount: 799, type: "Booking", status: "Paid", date: "2026-03-20", description: "Booking - Post-Op Care" },
  { id: "PAY004", stripeId: "sub_abc126", patientName: "Rajesh Kumar", nurseName: null, amount: 999, type: "Subscription", status: "Paid", date: "2026-03-01", description: "Monthly Subscription Plan" },
  { id: "PAY005", stripeId: "pi_3abc127", patientName: "Amit Patel", nurseName: "Sunitha M.", amount: 899, type: "Booking", status: "Refunded", date: "2026-03-19", description: "Booking - Geriatric Care (Refunded)" },
  { id: "PAY006", stripeId: "pi_3abc128", patientName: "Priya Sharma", nurseName: "Kavitha S.", amount: 699, type: "Booking", status: "Paid", date: "2026-03-18", description: "Booking - Pediatric Care" },
  { id: "PAY007", stripeId: "pi_3abc129", patientName: "Amit Patel", nurseName: null, amount: 2499, type: "Subscription", status: "Paid", date: "2026-03-05", description: "Quarterly Subscription Plan" },
  { id: "PAY008", stripeId: "pi_3abc130", patientName: "Priya Sharma", nurseName: null, amount: 500, type: "Consultation", status: "Failed", date: "2026-03-22", description: "Doctor Consultation (Failed)" },
];

export const mockAdminStats = {
  totalUsers: 1247,
  totalPatients: 1089,
  totalNurses: 143,
  activeNurses: 87,
  pendingVerification: 12,
  platformRevenue: 487500,
  totalBookings: 3456,
  activeToday: 23,
  completedBookings: 2891,
  cancelledBookings: 167,
};

export const mockReviews = [
  { id: "r1", nurseId: "n1", patientInitials: "RK", rating: 5, comment: "Excellent care! Very professional and punctual.", date: "2026-03-20", tags: ["Punctual", "Professional", "Caring"] },
  { id: "r2", nurseId: "n1", patientInitials: "PS", rating: 5, comment: "Deepa was amazing with my elderly mother. Highly recommend!", date: "2026-03-18", tags: ["Caring", "Skilled"] },
  { id: "r3", nurseId: "n2", patientInitials: "AP", rating: 4, comment: "Good care, very experienced with geriatric patients.", date: "2026-03-15", tags: ["Professional", "Skilled"] },
];

export const currentUser = {
  id: "p1",
  name: "Rajesh Kumar",
  role: "patient" as "patient" | "nurse" | "admin",
  phone: "+919876543210",
  avatar: "",
};
