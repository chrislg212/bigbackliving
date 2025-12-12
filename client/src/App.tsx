import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Home from "@/pages/Home";
import Reviews from "@/pages/Reviews";
import About from "@/pages/About";
import Social from "@/pages/Social";
import ReviewDetail from "@/pages/ReviewDetail";
import Admin from "@/pages/Admin";
import NYCEats from "@/pages/rankings/NYCEats";
import Cuisines from "@/pages/rankings/Cuisines";
import CuisineReviews from "@/pages/rankings/CuisineReviews";
import Top10Lists from "@/pages/rankings/Top10Lists";
import Top10Detail from "@/pages/rankings/Top10Detail";
import CollegeBudget from "@/pages/rankings/CollegeBudget";
import Locations from "@/pages/rankings/Locations";
import LocationPage from "@/pages/location/LocationPage";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/reviews" component={Reviews} />
      <Route path="/rankings/nyc-eats" component={NYCEats} />
      <Route path="/rankings/locations" component={Locations} />
      <Route path="/location/nyc">{() => <LocationPage regionSlug="nyc" />}</Route>
      <Route path="/location/dmv">{() => <LocationPage regionSlug="dmv" />}</Route>
      <Route path="/location/europe">{() => <LocationPage regionSlug="europe" />}</Route>
      <Route path="/rankings/cuisines" component={Cuisines} />
      <Route path="/cuisines/:cuisine" component={CuisineReviews} />
      <Route path="/rankings/top-10" component={Top10Lists} />
      <Route path="/top-10/:slug" component={Top10Detail} />
      <Route path="/rankings/college-budget" component={CollegeBudget} />
      <Route path="/social" component={Social} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/review/:slug" component={ReviewDetail} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-background">
          <Navigation />
          <main className="flex-1">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
