import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Market = lazy(() => import("./pages/Market"));
const CoinDetails = lazy(() => import("./pages/CoinDetails"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const WalletTracker = lazy(() => import("./pages/WalletTracker"));
const TransactionExplorer = lazy(() => import("./pages/TransactionExplorer"));
const News = lazy(() => import("./pages/News"));
const NewsDetails = lazy(() => import("./pages/NewsDetails"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="flex justify-center items-center min-h-[50vh]">
    <Loader2 className="w-10 h-10 animate-spin text-primary" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/market" element={<Market />} />
                    <Route path="/coin/:coinId" element={<CoinDetails />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/wallet" element={<WalletTracker />} />
                    <Route path="/wallet/:address" element={<WalletTracker />} />
                    <Route path="/transaction" element={<TransactionExplorer />} />
                    <Route path="/transaction/:hash" element={<TransactionExplorer />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/news/:id" element={<NewsDetails />} />
                    <Route path="/about" element={<About />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;