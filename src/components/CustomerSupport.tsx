import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Battery, Wrench, Shield, HelpCircle, Zap, FileText } from 'lucide-react';

interface Question {
  id: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  answer: string;
}

const predefinedQuestions: Question[] = [
  {
    id: '1',
    category: 'Battery',
    icon: Battery,
    title: 'How long does the battery last?',
    description: 'Battery range and charging time',
    answer: 'Our electric scooter battery typically lasts 25-30 km on a single charge under normal conditions. Charging time is approximately 4-6 hours from empty to full.'
  },
  {
    id: '2',
    category: 'Battery',
    icon: Battery,
    title: 'How do I charge my scooter properly?',
    description: 'Charging best practices',
    answer: 'Always use the original charger. Charge in a dry, well-ventilated area. Avoid charging in direct sunlight or extreme temperatures. The LED indicator will turn green when fully charged.'
  },
  {
    id: '3',
    category: 'Performance',
    icon: Zap,
    title: 'My scooter feels slower than usual',
    description: 'Performance and speed issues',
    answer: 'Check if the battery is fully charged. Ensure tires are properly inflated. Clean the scooter regularly. If the issue persists, contact our service center for a diagnostic check.'
  },
  {
    id: '4',
    category: 'Maintenance',
    icon: Wrench,
    title: 'How often should I service my scooter?',
    description: 'Service intervals and maintenance',
    answer: 'We recommend professional servicing every 3 months or 1000 km, whichever comes first. Regular cleaning and tire pressure checks should be done weekly.'
  },
  {
    id: '5',
    category: 'Safety',
    icon: Shield,
    title: 'What safety gear do I need?',
    description: 'Safety equipment and riding tips',
    answer: 'Always wear a helmet. Use knee and elbow pads for extra protection. Ensure your scooter has working lights and reflectors. Follow local traffic rules and avoid riding in heavy rain.'
  },
  {
    id: '6',
    category: 'Warranty',
    icon: FileText,
    title: 'What does my warranty cover?',
    description: 'Warranty terms and coverage',
    answer: 'Your warranty covers manufacturing defects for 12 months. Battery is covered for 6 months. Normal wear and tear, accidental damage, and misuse are not covered.'
  },
  {
    id: '7',
    category: 'Legal',
    icon: HelpCircle,
    title: 'Do I need a license to ride?',
    description: 'Legal requirements and regulations',
    answer: 'Requirements vary by location. In most areas, no license is needed for scooters under 25 km/h. Always check your local regulations and age restrictions before riding.'
  },
  {
    id: '8',
    category: 'Performance',
    icon: Zap,
    title: 'What is the maximum weight limit?',
    description: 'Weight capacity and load limits',
    answer: 'Maximum rider weight is 100 kg. Exceeding this limit may affect performance, battery life, and safety. Additional cargo should not exceed 5 kg.'
  }
];

const categories = ['All', 'Battery', 'Performance', 'Maintenance', 'Safety', 'Warranty', 'Legal'];

const CustomerSupport = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  const filteredQuestions = selectedCategory === 'All' 
    ? predefinedQuestions 
    : predefinedQuestions.filter(q => q.category === selectedCategory);

  const handleQuestionSelect = (question: Question) => {
    setSelectedQuestion(question);
  };

  const handleBackToQuestions = () => {
    setSelectedQuestion(null);
  };

  if (selectedQuestion) {
    return (
      <Card className="electric-shadow border-border/50">
        <CardHeader>
          <Button
            variant="ghost"
            onClick={handleBackToQuestions}
            className="w-fit px-0 text-primary hover:text-primary/80"
          >
            ← Back to Questions
          </Button>
          <div className="flex items-start gap-3">
            <div className="rounded-full p-2 bg-primary/10">
              <selectedQuestion.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg text-foreground">{selectedQuestion.title}</CardTitle>
              <Badge variant="secondary" className="mt-2">
                {selectedQuestion.category}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none text-foreground">
            <p>{selectedQuestion.answer}</p>
          </div>
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Still need help? Contact our support team for personalized assistance.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="electric-shadow border-border/50">
      <CardHeader>
        <CardTitle className="text-lg text-foreground">Frequently Asked Questions</CardTitle>
        <CardDescription>Find quick answers to common questions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer transition-smooth"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Questions List */}
        <div className="space-y-3">
          {filteredQuestions.map((question) => (
            <Card
              key={question.id}
              className="cursor-pointer hover:shadow-md transition-smooth border-border/30"
              onClick={() => handleQuestionSelect(question)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full p-2 bg-primary/10 flex-shrink-0">
                    <question.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground text-sm leading-tight">
                      {question.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {question.description}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <HelpCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No questions found in this category</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerSupport;