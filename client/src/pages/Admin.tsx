import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2, Image, Loader2, Star, Utensils, MapPin, List, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { ObjectUploader } from "@/components/ObjectUploader";
import type { Review, Cuisine, NycEatsCategory, TopTenList } from "@shared/schema";

const reviewFormSchema = z.object({
  name: z.string().min(1, "Restaurant name is required"),
  slug: z.string().min(1, "Slug is required"),
  cuisine: z.string().min(1, "Cuisine is required"),
  location: z.string().min(1, "Location is required"),
  rating: z.coerce.number().min(1).max(5),
  excerpt: z.string().min(1, "Excerpt is required"),
  priceRange: z.string().min(1, "Price range is required"),
  image: z.string().optional(),
  fullReview: z.string().optional(),
  atmosphere: z.string().optional(),
  visitDate: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  mustTry: z.array(z.string()).optional(),
});

const cuisineFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  image: z.string().optional(),
});

const nycCategoryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  image: z.string().optional(),
});

const topTenListFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  image: z.string().optional(),
});

type ReviewFormData = z.infer<typeof reviewFormSchema>;
type CuisineFormData = z.infer<typeof cuisineFormSchema>;
type NycCategoryFormData = z.infer<typeof nycCategoryFormSchema>;
type TopTenListFormData = z.infer<typeof topTenListFormSchema>;

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function ReviewsTab() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [expandedReviewId, setExpandedReviewId] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  const { data: cuisines = [] } = useQuery<Cuisine[]>({
    queryKey: ["/api/cuisines"],
  });

  const { data: nycCategories = [] } = useQuery<NycEatsCategory[]>({
    queryKey: ["/api/nyc-eats"],
  });

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      cuisine: "",
      location: "",
      rating: 4,
      excerpt: "",
      priceRange: "$$",
      image: "",
      fullReview: "",
      atmosphere: "",
      visitDate: "",
      highlights: [],
      mustTry: [],
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ReviewFormData) => {
      return apiRequest("POST", "/api/reviews", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      setIsDialogOpen(false);
      form.reset();
      setUploadedImageUrl("");
      toast({ title: "Review created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create review", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ReviewFormData }) => {
      return apiRequest("PATCH", `/api/reviews/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      setIsDialogOpen(false);
      setEditingReview(null);
      form.reset();
      setUploadedImageUrl("");
      toast({ title: "Review updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update review", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/reviews/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      toast({ title: "Review deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete review", variant: "destructive" });
    },
  });

  const updateCuisinesMutation = useMutation({
    mutationFn: async ({ id, cuisineIds }: { id: number; cuisineIds: number[] }) => {
      return apiRequest("PUT", `/api/reviews/${id}/cuisines`, { cuisineIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      toast({ title: "Cuisines updated" });
    },
  });

  const updateNycCategoriesMutation = useMutation({
    mutationFn: async ({ id, categoryIds }: { id: number; categoryIds: number[] }) => {
      return apiRequest("PUT", `/api/reviews/${id}/nyc-categories`, { categoryIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      toast({ title: "NYC categories updated" });
    },
  });

  const handleOpenDialog = (review?: Review) => {
    if (review) {
      setEditingReview(review);
      form.reset({
        name: review.name,
        slug: review.slug,
        cuisine: review.cuisine,
        location: review.location,
        rating: review.rating,
        excerpt: review.excerpt,
        priceRange: review.priceRange,
        image: review.image || "",
        fullReview: review.fullReview || "",
        atmosphere: review.atmosphere || "",
        visitDate: review.visitDate || "",
        highlights: review.highlights || [],
        mustTry: review.mustTry || [],
      });
      setUploadedImageUrl(review.image || "");
    } else {
      setEditingReview(null);
      form.reset();
      setUploadedImageUrl("");
    }
    setIsDialogOpen(true);
  };

  const handleNameChange = (name: string) => {
    form.setValue("name", name);
    if (!editingReview) {
      form.setValue("slug", generateSlug(name));
    }
  };

  const onSubmit = (data: ReviewFormData) => {
    const submitData = {
      ...data,
      image: uploadedImageUrl || data.image,
    };

    if (editingReview) {
      updateMutation.mutate({ id: editingReview.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleGetUploadParameters = async () => {
    const response = await fetch("/api/objects/upload", { method: "POST" });
    const { uploadURL } = await response.json();
    return {
      method: "PUT" as const,
      url: uploadURL,
    };
  };

  const handleUploadComplete = async (result: { successful: Array<{ uploadURL?: string }> }) => {
    if (result.successful && result.successful.length > 0) {
      const uploadedUrl = result.successful[0].uploadURL;
      if (!uploadedUrl) {
        toast({ title: "Failed to get upload URL", variant: "destructive" });
        return;
      }
      try {
        const response = await fetch("/api/review-images", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageURL: uploadedUrl }),
        });
        if (!response.ok) {
          throw new Error("Failed to set image permissions");
        }
        const { objectPath } = await response.json();
        setUploadedImageUrl(objectPath);
        form.setValue("image", objectPath);
        toast({ title: "Image uploaded successfully" });
      } catch (error) {
        console.error("Error setting image permissions:", error);
        toast({ title: "Failed to process image", variant: "destructive" });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-semibold">Reviews</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} data-testid="button-add-review">
              <Plus className="w-4 h-4 mr-2" />
              Add Review
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">
                {editingReview ? "Edit Review" : "Add New Review"}
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Restaurant Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(e) => handleNameChange(e.target.value)}
                            placeholder="La Bella Italia"
                            data-testid="input-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Slug</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="la-bella-italia" data-testid="input-slug" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cuisine"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cuisine</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Italian" data-testid="input-cuisine" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Downtown Manhattan, NY" data-testid="input-location" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rating (1-5)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min="1"
                            max="5"
                            step="0.1"
                            data-testid="input-rating"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priceRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price Range</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-price-range">
                              <SelectValue placeholder="Select price range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="$">$ - Budget</SelectItem>
                            <SelectItem value="$$">$$ - Moderate</SelectItem>
                            <SelectItem value="$$$">$$$ - Upscale</SelectItem>
                            <SelectItem value="$$$$">$$$$ - Fine Dining</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Excerpt</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="A brief description of the restaurant..."
                          rows={2}
                          data-testid="input-excerpt"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label>Photo</Label>
                  <div className="flex items-center gap-4">
                    {uploadedImageUrl && (
                      <div className="w-24 h-24 rounded-md overflow-hidden bg-muted">
                        <img
                          src={uploadedImageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          data-testid="img-preview"
                        />
                      </div>
                    )}
                    <ObjectUploader
                      maxFileSize={10485760}
                      onGetUploadParameters={handleGetUploadParameters}
                      onComplete={handleUploadComplete}
                    >
                      <Image className="w-4 h-4 mr-2" />
                      {uploadedImageUrl ? "Change Photo" : "Upload Photo"}
                    </ObjectUploader>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="fullReview"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Review (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Write your full review here..."
                          rows={6}
                          data-testid="input-full-review"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="atmosphere"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Atmosphere (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Romantic and intimate" data-testid="input-atmosphere" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="visitDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Visit Date (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="November 2024" data-testid="input-visit-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-save"
                  >
                    {(createMutation.isPending || updateMutation.isPending) && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {editingReview ? "Save Changes" : "Create Review"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : reviews.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No reviews yet. Add your first review!</p>
            <Button onClick={() => handleOpenDialog()} data-testid="button-add-first-review">
              <Plus className="w-4 h-4 mr-2" />
              Add Review
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              cuisines={cuisines}
              nycCategories={nycCategories}
              isExpanded={expandedReviewId === review.id}
              onToggleExpand={() => setExpandedReviewId(expandedReviewId === review.id ? null : review.id)}
              onEdit={() => handleOpenDialog(review)}
              onDelete={() => {
                if (confirm("Are you sure you want to delete this review?")) {
                  deleteMutation.mutate(review.id);
                }
              }}
              onUpdateCuisines={(cuisineIds) => updateCuisinesMutation.mutate({ id: review.id, cuisineIds })}
              onUpdateNycCategories={(categoryIds) => updateNycCategoriesMutation.mutate({ id: review.id, categoryIds })}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewCard({
  review,
  cuisines,
  nycCategories,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
  onUpdateCuisines,
  onUpdateNycCategories,
}: {
  review: Review;
  cuisines: Cuisine[];
  nycCategories: NycEatsCategory[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onUpdateCuisines: (ids: number[]) => void;
  onUpdateNycCategories: (ids: number[]) => void;
}) {
  const { data: reviewCuisines = [] } = useQuery<Cuisine[]>({
    queryKey: ["/api/reviews", review.id, "cuisines"],
  });

  const { data: reviewNycCategories = [] } = useQuery<NycEatsCategory[]>({
    queryKey: ["/api/reviews", review.id, "nyc-categories"],
  });

  const [selectedCuisines, setSelectedCuisines] = useState<number[]>([]);
  const [selectedNycCategories, setSelectedNycCategories] = useState<number[]>([]);

  useState(() => {
    setSelectedCuisines(reviewCuisines.map(c => c.id));
    setSelectedNycCategories(reviewNycCategories.map(c => c.id));
  });

  const toggleCuisine = (cuisineId: number) => {
    const newIds = selectedCuisines.includes(cuisineId)
      ? selectedCuisines.filter(id => id !== cuisineId)
      : [...selectedCuisines, cuisineId];
    setSelectedCuisines(newIds);
    onUpdateCuisines(newIds);
  };

  const toggleNycCategory = (categoryId: number) => {
    const newIds = selectedNycCategories.includes(categoryId)
      ? selectedNycCategories.filter(id => id !== categoryId)
      : [...selectedNycCategories, categoryId];
    setSelectedNycCategories(newIds);
    onUpdateNycCategories(newIds);
  };

  return (
    <Card data-testid={`card-review-${review.id}`}>
      <CardContent className="py-4">
        <div className="flex items-center gap-4">
          {review.image && (
            <div className="w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
              <img
                src={review.image}
                alt={review.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-lg font-semibold text-foreground truncate">
              {review.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {review.cuisine} - {review.location}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-primary fill-primary" />
                <span className="text-sm font-medium">{review.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">{review.priceRange}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={onToggleExpand}
              data-testid={`button-expand-${review.id}`}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={onEdit}
              data-testid={`button-edit-${review.id}`}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={onDelete}
              data-testid={`button-delete-${review.id}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Assign to Cuisines</Label>
              <div className="flex flex-wrap gap-2">
                {cuisines.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No cuisines created yet</p>
                ) : (
                  cuisines.map((cuisine) => (
                    <Badge
                      key={cuisine.id}
                      variant={selectedCuisines.includes(cuisine.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleCuisine(cuisine.id)}
                      data-testid={`badge-cuisine-${cuisine.id}`}
                    >
                      {cuisine.name}
                    </Badge>
                  ))
                )}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Assign to NYC Eats Categories</Label>
              <div className="flex flex-wrap gap-2">
                {nycCategories.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No NYC categories created yet</p>
                ) : (
                  nycCategories.map((category) => (
                    <Badge
                      key={category.id}
                      variant={selectedNycCategories.includes(category.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleNycCategory(category.id)}
                      data-testid={`badge-nyc-${category.id}`}
                    >
                      {category.name}
                    </Badge>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CuisinesTab() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCuisine, setEditingCuisine] = useState<Cuisine | null>(null);
  const { toast } = useToast();

  const { data: cuisines = [], isLoading } = useQuery<Cuisine[]>({
    queryKey: ["/api/cuisines"],
  });

  const form = useForm<CuisineFormData>({
    resolver: zodResolver(cuisineFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      image: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CuisineFormData) => {
      return apiRequest("POST", "/api/cuisines", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cuisines"] });
      setIsDialogOpen(false);
      form.reset();
      toast({ title: "Cuisine created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create cuisine", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: CuisineFormData }) => {
      return apiRequest("PATCH", `/api/cuisines/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cuisines"] });
      setIsDialogOpen(false);
      setEditingCuisine(null);
      form.reset();
      toast({ title: "Cuisine updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update cuisine", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/cuisines/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cuisines"] });
      toast({ title: "Cuisine deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete cuisine", variant: "destructive" });
    },
  });

  const handleOpenDialog = (cuisine?: Cuisine) => {
    if (cuisine) {
      setEditingCuisine(cuisine);
      form.reset({
        name: cuisine.name,
        slug: cuisine.slug,
        description: cuisine.description || "",
        image: cuisine.image || "",
      });
    } else {
      setEditingCuisine(null);
      form.reset();
    }
    setIsDialogOpen(true);
  };

  const handleNameChange = (name: string) => {
    form.setValue("name", name);
    if (!editingCuisine) {
      form.setValue("slug", generateSlug(name));
    }
  };

  const onSubmit = (data: CuisineFormData) => {
    if (editingCuisine) {
      updateMutation.mutate({ id: editingCuisine.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-semibold">Cuisines</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} data-testid="button-add-cuisine">
              <Plus className="w-4 h-4 mr-2" />
              Add Cuisine
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">
                {editingCuisine ? "Edit Cuisine" : "Add New Cuisine"}
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => handleNameChange(e.target.value)}
                          placeholder="Italian"
                          data-testid="input-cuisine-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Slug</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="italian" data-testid="input-cuisine-slug" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Describe this cuisine..." data-testid="input-cuisine-description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {(createMutation.isPending || updateMutation.isPending) && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {editingCuisine ? "Save Changes" : "Create Cuisine"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : cuisines.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No cuisines yet. Add your first cuisine!</p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Cuisine
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cuisines.map((cuisine) => (
            <Card key={cuisine.id} data-testid={`card-cuisine-${cuisine.id}`}>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="font-serif text-lg">{cuisine.name}</CardTitle>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="ghost" onClick={() => handleOpenDialog(cuisine)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this cuisine?")) {
                        deleteMutation.mutate(cuisine.id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {cuisine.description || "No description"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function NycEatsTab() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<NycEatsCategory | null>(null);
  const { toast } = useToast();

  const { data: categories = [], isLoading } = useQuery<NycEatsCategory[]>({
    queryKey: ["/api/nyc-eats"],
  });

  const form = useForm<NycCategoryFormData>({
    resolver: zodResolver(nycCategoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      image: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: NycCategoryFormData) => {
      return apiRequest("POST", "/api/nyc-eats", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/nyc-eats"] });
      setIsDialogOpen(false);
      form.reset();
      toast({ title: "Category created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create category", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: NycCategoryFormData }) => {
      return apiRequest("PATCH", `/api/nyc-eats/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/nyc-eats"] });
      setIsDialogOpen(false);
      setEditingCategory(null);
      form.reset();
      toast({ title: "Category updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update category", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/nyc-eats/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/nyc-eats"] });
      toast({ title: "Category deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete category", variant: "destructive" });
    },
  });

  const handleOpenDialog = (category?: NycEatsCategory) => {
    if (category) {
      setEditingCategory(category);
      form.reset({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        image: category.image || "",
      });
    } else {
      setEditingCategory(null);
      form.reset();
    }
    setIsDialogOpen(true);
  };

  const handleNameChange = (name: string) => {
    form.setValue("name", name);
    if (!editingCategory) {
      form.setValue("slug", generateSlug(name));
    }
  };

  const onSubmit = (data: NycCategoryFormData) => {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-semibold">NYC Eats Categories</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} data-testid="button-add-nyc-category">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => handleNameChange(e.target.value)}
                          placeholder="Best Pizza"
                          data-testid="input-nyc-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Slug</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="best-pizza" data-testid="input-nyc-slug" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Describe this category..." data-testid="input-nyc-description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {(createMutation.isPending || updateMutation.isPending) && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {editingCategory ? "Save Changes" : "Create Category"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : categories.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No NYC categories yet. Add your first category!</p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id} data-testid={`card-nyc-${category.id}`}>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="font-serif text-lg">{category.name}</CardTitle>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="ghost" onClick={() => handleOpenDialog(category)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this category?")) {
                        deleteMutation.mutate(category.id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {category.description || "No description"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function TopTenListsTab() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingList, setEditingList] = useState<TopTenList | null>(null);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: lists = [], isLoading } = useQuery<TopTenList[]>({
    queryKey: ["/api/top-ten-lists"],
  });

  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  const form = useForm<TopTenListFormData>({
    resolver: zodResolver(topTenListFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      image: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: TopTenListFormData) => {
      return apiRequest("POST", "/api/top-ten-lists", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/top-ten-lists"] });
      setIsDialogOpen(false);
      form.reset();
      toast({ title: "List created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create list", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: TopTenListFormData }) => {
      return apiRequest("PATCH", `/api/top-ten-lists/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/top-ten-lists"] });
      setIsDialogOpen(false);
      setEditingList(null);
      form.reset();
      toast({ title: "List updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update list", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/top-ten-lists/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/top-ten-lists"] });
      toast({ title: "List deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete list", variant: "destructive" });
    },
  });

  const handleOpenDialog = (list?: TopTenList) => {
    if (list) {
      setEditingList(list);
      form.reset({
        name: list.name,
        slug: list.slug,
        description: list.description || "",
        image: list.image || "",
      });
    } else {
      setEditingList(null);
      form.reset();
    }
    setIsDialogOpen(true);
  };

  const handleNameChange = (name: string) => {
    form.setValue("name", name);
    if (!editingList) {
      form.setValue("slug", generateSlug(name));
    }
  };

  const onSubmit = (data: TopTenListFormData) => {
    if (editingList) {
      updateMutation.mutate({ id: editingList.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-semibold">Top 10 Lists</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} data-testid="button-add-list">
              <Plus className="w-4 h-4 mr-2" />
              Add List
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">
                {editingList ? "Edit List" : "Add New List"}
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => handleNameChange(e.target.value)}
                          placeholder="Best Italian Restaurants"
                          data-testid="input-list-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Slug</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="best-italian-restaurants" data-testid="input-list-slug" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Describe this list..." data-testid="input-list-description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {(createMutation.isPending || updateMutation.isPending) && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {editingList ? "Save Changes" : "Create List"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : lists.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No lists yet. Add your first top 10 list!</p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Add List
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {lists.map((list) => (
            <TopTenListCard
              key={list.id}
              list={list}
              reviews={reviews}
              isExpanded={selectedListId === list.id}
              onToggleExpand={() => setSelectedListId(selectedListId === list.id ? null : list.id)}
              onEdit={() => handleOpenDialog(list)}
              onDelete={() => {
                if (confirm("Are you sure you want to delete this list?")) {
                  deleteMutation.mutate(list.id);
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TopTenListCard({
  list,
  reviews,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
}: {
  list: TopTenList;
  reviews: Review[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { toast } = useToast();
  const [listItems, setListItems] = useState<{ reviewId: number; rank: number }[]>([]);

  const { data: items = [] } = useQuery<{ review: Review; rank: number }[]>({
    queryKey: ["/api/top-ten-lists", list.id, "items"],
    enabled: isExpanded,
  });

  useState(() => {
    if (items.length > 0) {
      setListItems(items.map(item => ({ reviewId: item.review.id, rank: item.rank })));
    }
  });

  const updateItemsMutation = useMutation({
    mutationFn: async (items: { reviewId: number; rank: number }[]) => {
      return apiRequest("PUT", `/api/top-ten-lists/${list.id}/items`, { items });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/top-ten-lists", list.id, "items"] });
      toast({ title: "List items updated" });
    },
    onError: () => {
      toast({ title: "Failed to update list items", variant: "destructive" });
    },
  });

  const addReviewToList = (reviewId: number) => {
    const nextRank = listItems.length + 1;
    if (nextRank > 10) {
      toast({ title: "Maximum 10 items allowed", variant: "destructive" });
      return;
    }
    const newItems = [...listItems, { reviewId, rank: nextRank }];
    setListItems(newItems);
    updateItemsMutation.mutate(newItems);
  };

  const removeReviewFromList = (reviewId: number) => {
    const newItems = listItems
      .filter(item => item.reviewId !== reviewId)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));
    setListItems(newItems);
    updateItemsMutation.mutate(newItems);
  };

  const moveItem = (reviewId: number, direction: "up" | "down") => {
    const idx = listItems.findIndex(item => item.reviewId === reviewId);
    if (idx === -1) return;
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === listItems.length - 1) return;

    const newItems = [...listItems];
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    [newItems[idx], newItems[swapIdx]] = [newItems[swapIdx], newItems[idx]];
    const reranked = newItems.map((item, i) => ({ ...item, rank: i + 1 }));
    setListItems(reranked);
    updateItemsMutation.mutate(reranked);
  };

  const availableReviews = reviews.filter(r => !listItems.some(item => item.reviewId === r.id));

  return (
    <Card data-testid={`card-list-${list.id}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <div>
          <CardTitle className="font-serif text-lg">{list.name}</CardTitle>
          {list.description && (
            <p className="text-sm text-muted-foreground mt-1">{list.description}</p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost" onClick={onToggleExpand}>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          <Button size="icon" variant="ghost" onClick={onEdit}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Current Items ({listItems.length}/10)</Label>
              {listItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">No items in this list yet</p>
              ) : (
                <div className="space-y-2">
                  {listItems
                    .sort((a, b) => a.rank - b.rank)
                    .map((item) => {
                      const review = reviews.find(r => r.id === item.reviewId);
                      if (!review) return null;
                      return (
                        <div
                          key={item.reviewId}
                          className="flex items-center gap-3 p-2 rounded-md bg-muted/50"
                        >
                          <span className="font-medium text-primary w-6">{item.rank}.</span>
                          <span className="flex-1">{review.name}</span>
                          <div className="flex items-center gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => moveItem(item.reviewId, "up")}
                              disabled={item.rank === 1}
                            >
                              <ChevronUp className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => moveItem(item.reviewId, "down")}
                              disabled={item.rank === listItems.length}
                            >
                              <ChevronDown className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => removeReviewFromList(item.reviewId)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {listItems.length < 10 && availableReviews.length > 0 && (
              <div>
                <Label className="text-sm font-medium mb-2 block">Add Review</Label>
                <Select onValueChange={(value) => addReviewToList(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a review to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableReviews.map((review) => (
                      <SelectItem key={review.id} value={review.id.toString()}>
                        {review.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default function Admin() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground" data-testid="admin-title">
            Admin Panel
          </h1>
          <p className="font-sans text-muted-foreground mt-2">
            Manage your restaurant reviews and categories
          </p>
        </div>

        <Tabs defaultValue="reviews" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="reviews" data-testid="tab-reviews">
              <Star className="w-4 h-4 mr-2" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="cuisines" data-testid="tab-cuisines">
              <Utensils className="w-4 h-4 mr-2" />
              Cuisines
            </TabsTrigger>
            <TabsTrigger value="nyc-eats" data-testid="tab-nyc-eats">
              <MapPin className="w-4 h-4 mr-2" />
              NYC Eats
            </TabsTrigger>
            <TabsTrigger value="top-ten" data-testid="tab-top-ten">
              <List className="w-4 h-4 mr-2" />
              Top 10 Lists
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reviews">
            <ReviewsTab />
          </TabsContent>

          <TabsContent value="cuisines">
            <CuisinesTab />
          </TabsContent>

          <TabsContent value="nyc-eats">
            <NycEatsTab />
          </TabsContent>

          <TabsContent value="top-ten">
            <TopTenListsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
