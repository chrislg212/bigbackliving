import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2, Image, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { ObjectUploader } from "@/components/ObjectUploader";
import type { Review } from "@shared/schema";

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

type ReviewFormData = z.infer<typeof reviewFormSchema>;

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function Admin() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const { toast } = useToast();

  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground" data-testid="admin-title">
              Admin Panel
            </h1>
            <p className="font-sans text-muted-foreground mt-2">
              Manage your restaurant reviews
            </p>
          </div>

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
              <Card key={review.id} data-testid={`card-review-${review.id}`}>
                <CardContent className="flex items-center gap-4 py-4">
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
                      onClick={() => handleOpenDialog(review)}
                      data-testid={`button-edit-${review.id}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this review?")) {
                          deleteMutation.mutate(review.id);
                        }
                      }}
                      data-testid={`button-delete-${review.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
