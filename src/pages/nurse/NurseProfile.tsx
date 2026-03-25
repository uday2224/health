import { useState } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, FileText, Check, AlertCircle } from 'lucide-react';

interface Review {
  id: string;
  patientName: string;
  rating: number;
  comment: string;
  date: string;
}

const mockReviews: Review[] = [
  {
    id: '1',
    patientName: 'Rajesh K.',
    rating: 5,
    comment: 'Very professional and caring. Highly recommended!',
    date: '2026-03-20',
  },
  {
    id: '2',
    patientName: 'Priya M.',
    rating: 5,
    comment: 'Excellent service. She was very punctual and skilled.',
    date: '2026-03-18',
  },
  {
    id: '3',
    patientName: 'Mohan K.',
    rating: 4,
    comment: 'Good service. Very attentive to patient needs.',
    date: '2026-03-15',
  },
];

export default function NurseProfile() {
  const [isOnline] = useState(true);

  return (
    <div>
      <AppHeader title="Profile" showMenu />
      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-secondary text-secondary-foreground text-lg font-bold">
                  SK
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">Sneha Kumar</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-success text-success-foreground gap-1">
                    <Check className="w-3 h-3" />
                    Verified
                  </Badge>
                  {isOnline && (
                    <Badge className="bg-success text-success-foreground">
                      🟢 Online
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-border">
            <div>
              <p className="text-xs text-muted-foreground">Rating</p>
              <p className="text-2xl font-bold flex items-center gap-1">
                4.8
                <Star className="w-5 h-5 fill-accent text-accent" />
              </p>
              <p className="text-xs text-muted-foreground">127 reviews</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Completion Rate</p>
              <p className="text-2xl font-bold">98%</p>
              <p className="text-xs text-muted-foreground">127 bookings</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Member Since</p>
              <p className="text-2xl font-bold">2 yrs</p>
              <p className="text-xs text-muted-foreground">Jan 2024</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Bio</p>
            <p className="text-sm text-muted-foreground">
              Experienced nurse with 8 years of healthcare background. Specialized in post-operative care and wound management. Compassionate and patient-focused approach.
            </p>
          </div>
        </Card>

        {/* Specializations */}
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold">Specializations</h3>
          <div className="flex flex-wrap gap-2">
            {['Wound Care', 'IV Therapy', 'Post-Op Care', 'Geriatric Care'].map((spec) => (
              <Badge key={spec} variant="secondary">
                {spec}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Documents */}
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold">Documents</h3>
          <div className="space-y-3">
            {[
              { name: 'License', status: 'verified' },
              { name: 'ID Proof', status: 'verified' },
            ].map((doc) => (
              <div
                key={doc.name}
                className="flex items-center justify-between p-3 border border-border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">Uploaded 2 months ago</p>
                  </div>
                </div>
                <Badge className="bg-success text-success-foreground gap-1">
                  <Check className="w-3 h-3" />
                  {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Reviews */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Recent Reviews</h3>
            <Button variant="outline" size="sm" className="rounded-lg">
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {mockReviews.map((review) => (
              <div key={review.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium text-sm">{review.patientName}</p>
                  <div className="flex gap-0.5">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-accent text-accent"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                <p className="text-xs text-muted-foreground">{review.date}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Stats */}
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold">Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Total Bookings', value: 127 },
              { label: 'Completed', value: 125 },
              { label: 'Cancelled', value: 2 },
              { label: 'Avg Rating', value: '4.8★' },
            ].map((stat) => (
              <div key={stat.label} className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-lg font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
