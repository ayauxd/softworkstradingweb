import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import ArticleLayout from '../components/ArticleLayout';

export default function NotFound() {
  return (
    <ArticleLayout>
      <div className="min-h-[70vh] w-full flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 bg-white dark:bg-gray-800">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <h1 className="text-2xl font-bold text-[#0A2A43] dark:text-white">404 Page Not Found</h1>
            </div>

            <p className="mt-4 text-sm text-[#0A2A43] dark:text-gray-300">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </CardContent>
        </Card>
      </div>
    </ArticleLayout>
  );
}
