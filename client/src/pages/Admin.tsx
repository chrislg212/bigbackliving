import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2, Image, Loader2, Star, Utensils, MapPin, List, ChevronDown, ChevronUp, Share2, ImageIcon, Upload, Check, MessageSquare, Mail, Eye, RefreshCw } from "lucide-react";
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
import type { Review, Cuisine, TopTenList, SocialSettings, SocialEmbed, PageHeader, ContactSubmission, Region, LocationCategory } from "@shared/schema";
import { SiInstagram, SiTiktok } from "react-icons/si";

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
  address: z.string().optional(),
  website: z.string().optional(),
});

const cuisineFormSchema = z.object({
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

const socialSettingsFormSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  username: z.string().min(1, "Username is required"),
  profileUrl: z.string().url("Must be a valid URL"),
});

const socialEmbedFormSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  title: z.string().optional(),
  embedCode: z.string().min(1, "Embed code is required"),
  sortOrder: z.coerce.number().default(0),
});

type ReviewFormData = z.infer<typeof reviewFormSchema>;
type CuisineFormData = z.infer<typeof cuisineFormSchema>;
type TopTenListFormData = z.infer<typeof topTenListFormSchema>;
type SocialSettingsFormData = z.infer<typeof socialSettingsFormSchema>;
type SocialEmbedFormData = z.infer<typeof socialEmbedFormSchema>;

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
      address: "",
      website: "",
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
        address: review.address || "",
        website: review.website || "",
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
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="font-serif text-2xl font-semibold">Reviews</h2>
        <div className="flex items-center gap-2 flex-wrap">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="229 W 43rd St, New York, NY, 10036" data-testid="input-address" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://restaurant.com" data-testid="input-website" />
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
              isExpanded={expandedReviewId === review.id}
              onToggleExpand={() => setExpandedReviewId(expandedReviewId === review.id ? null : review.id)}
              onEdit={() => handleOpenDialog(review)}
              onDelete={() => {
                if (confirm("Are you sure you want to delete this review?")) {
                  deleteMutation.mutate(review.id);
                }
              }}
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
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
}: {
  review: Review;
  cuisines: Cuisine[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { toast } = useToast();
  const [galleryImages, setGalleryImages] = useState<Array<{ url: string; caption?: string }>>(
    (review.galleryImages as Array<{ url: string; caption?: string }>) || []
  );
  const [newCaption, setNewCaption] = useState("");
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const { data: reviewCuisines = [] } = useQuery<Cuisine[]>({
    queryKey: ["/api/reviews", review.id, "cuisines"],
  });

  const updateCuisinesMutation = useMutation({
    mutationFn: async (cuisineIds: number[]) => {
      return apiRequest("PUT", `/api/reviews/${review.id}/cuisines`, { cuisineIds });
    },
    onMutate: async (newCuisineIds) => {
      await queryClient.cancelQueries({ queryKey: ["/api/reviews", review.id, "cuisines"] });
      const previousCuisines = queryClient.getQueryData<Cuisine[]>(["/api/reviews", review.id, "cuisines"]);
      const newCuisines = cuisines.filter(c => newCuisineIds.includes(c.id));
      queryClient.setQueryData(["/api/reviews", review.id, "cuisines"], newCuisines);
      return { previousCuisines };
    },
    onSuccess: () => {
      toast({ title: "Cuisines updated" });
    },
    onError: (_error, _newIds, context) => {
      if (context?.previousCuisines) {
        queryClient.setQueryData(["/api/reviews", review.id, "cuisines"], context.previousCuisines);
      }
      toast({ title: "Failed to update cuisines", variant: "destructive" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews", review.id, "cuisines"] });
    },
  });

  const updateGalleryMutation = useMutation({
    mutationFn: async (images: Array<{ url: string; caption?: string }>) => {
      return apiRequest("PATCH", `/api/reviews/${review.id}`, { galleryImages: images });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      toast({ title: "Gallery updated" });
    },
    onError: () => {
      toast({ title: "Failed to update gallery", variant: "destructive" });
    },
  });

  const handleGalleryUploadParams = async () => {
    const response = await fetch("/api/objects/upload", { method: "POST" });
    const { uploadURL } = await response.json();
    return { method: "PUT" as const, url: uploadURL };
  };

  const handleGalleryUploadComplete = async (result: { successful: Array<{ uploadURL?: string }> }) => {
    if (result.successful && result.successful.length > 0) {
      const uploadedUrl = result.successful[0].uploadURL;
      if (!uploadedUrl) {
        toast({ title: "Failed to get upload URL", variant: "destructive" });
        setIsUploadingGallery(false);
        return;
      }
      try {
        const response = await fetch("/api/public-images", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: uploadedUrl }),
        });
        if (!response.ok) throw new Error("Failed to process image");
        const { normalizedPath } = await response.json();
        const newImages = [...galleryImages, { url: normalizedPath, caption: newCaption || undefined }];
        setGalleryImages(newImages);
        updateGalleryMutation.mutate(newImages);
        setNewCaption("");
        toast({ title: "Image added to gallery" });
      } catch {
        toast({ title: "Failed to process image", variant: "destructive" });
      }
      setIsUploadingGallery(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    const newImages = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(newImages);
    updateGalleryMutation.mutate(newImages);
  };

  const updateImageCaption = (index: number, caption: string) => {
    const newImages = [...galleryImages];
    newImages[index] = { ...newImages[index], caption };
    setGalleryImages(newImages);
    updateGalleryMutation.mutate(newImages);
  };

  const displayedCuisineIds = reviewCuisines.map(c => c.id);

  const toggleCuisine = (cuisineId: number) => {
    const newIds = displayedCuisineIds.includes(cuisineId)
      ? displayedCuisineIds.filter(id => id !== cuisineId)
      : [...displayedCuisineIds, cuisineId];
    updateCuisinesMutation.mutate(newIds);
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
          <div className="mt-4 pt-4 border-t space-y-6">
            <div>
              <Label className="text-sm font-medium mb-2 block">Assign to Cuisines</Label>
              <div className="flex flex-wrap gap-2">
                {cuisines.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No cuisines created yet</p>
                ) : (
                  cuisines.map((cuisine) => (
                    <Badge
                      key={cuisine.id}
                      variant={displayedCuisineIds.includes(cuisine.id) ? "default" : "outline"}
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
              <Label className="text-sm font-medium mb-3 block">Photo Gallery</Label>
              
              {galleryImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                  {galleryImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-md overflow-hidden bg-muted">
                        <img
                          src={img.url}
                          alt={img.caption || `Gallery ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        data-testid={`button-remove-gallery-${index}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <Input
                        placeholder="Caption..."
                        value={img.caption || ""}
                        onChange={(e) => updateImageCaption(index, e.target.value)}
                        className="mt-1 text-xs"
                        data-testid={`input-caption-${index}`}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground mb-1 block">Caption (optional)</Label>
                  <Input
                    placeholder="e.g., Signature Pasta, Interior..."
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    data-testid="input-new-caption"
                  />
                </div>
                <ObjectUploader
                  maxFileSize={10485760}
                  onGetUploadParameters={handleGalleryUploadParams}
                  onComplete={handleGalleryUploadComplete}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Photo
                </ObjectUploader>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Add photos of dishes, atmosphere, or memorable moments from this restaurant.
              </p>
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
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
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

  const handleGetUploadParameters = async () => {
    try {
      const response = await fetch("/api/objects/upload", { method: "POST" });
      if (!response.ok) throw new Error("Failed to get upload URL");
      const { uploadURL } = await response.json();
      return { method: "PUT" as const, url: uploadURL };
    } catch {
      toast({ title: "Failed to initialize upload", variant: "destructive" });
      throw new Error("Upload initialization failed");
    }
  };

  const handleUploadComplete = async (result: { successful: Array<{ uploadURL?: string }> }) => {
    if (result.successful && result.successful.length > 0) {
      const uploadedUrl = result.successful[0].uploadURL;
      if (!uploadedUrl) {
        toast({ title: "Failed to get upload URL", variant: "destructive" });
        return;
      }
      try {
        const response = await fetch("/api/public-images", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: uploadedUrl }),
        });
        if (!response.ok) {
          toast({ title: "Failed to process image", variant: "destructive" });
          return;
        }
        const { normalizedPath } = await response.json();
        if (!normalizedPath) {
          toast({ title: "Failed to get image path", variant: "destructive" });
          return;
        }
        setUploadedImageUrl(normalizedPath);
        form.setValue("image", normalizedPath);
        toast({ title: "Cover image uploaded successfully" });
      } catch {
        toast({ title: "Failed to process image", variant: "destructive" });
      }
    }
  };

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
      setUploadedImageUrl(cuisine.image || "");
      form.reset({
        name: cuisine.name,
        slug: cuisine.slug,
        description: cuisine.description || "",
        image: cuisine.image || "",
      });
    } else {
      setEditingCuisine(null);
      setUploadedImageUrl("");
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

                <div className="space-y-2">
                  <Label>Cover Image (Optional)</Label>
                  <div className="flex items-center gap-3">
                    {uploadedImageUrl && (
                      <div className="w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={uploadedImageUrl}
                          alt="Cover preview"
                          className="w-full h-full object-cover"
                          data-testid="cuisine-image-preview"
                        />
                      </div>
                    )}
                    <ObjectUploader
                      maxFileSize={10485760}
                      onGetUploadParameters={handleGetUploadParameters}
                      onComplete={handleUploadComplete}
                    >
                      <Image className="w-4 h-4 mr-2" />
                      {uploadedImageUrl ? "Change Cover" : "Upload Cover"}
                    </ObjectUploader>
                  </div>
                </div>

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

function TopTenListsTab() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingList, setEditingList] = useState<TopTenList | null>(null);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
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

  const handleGetUploadParameters = async () => {
    try {
      const response = await fetch("/api/objects/upload", { method: "POST" });
      if (!response.ok) throw new Error("Failed to get upload URL");
      const { uploadURL } = await response.json();
      return { method: "PUT" as const, url: uploadURL };
    } catch {
      toast({ title: "Failed to initialize upload", variant: "destructive" });
      throw new Error("Upload initialization failed");
    }
  };

  const handleUploadComplete = async (result: { successful: Array<{ uploadURL?: string }> }) => {
    if (result.successful && result.successful.length > 0) {
      const uploadedUrl = result.successful[0].uploadURL;
      if (!uploadedUrl) {
        toast({ title: "Failed to get upload URL", variant: "destructive" });
        return;
      }
      try {
        const response = await fetch("/api/public-images", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: uploadedUrl }),
        });
        if (!response.ok) {
          toast({ title: "Failed to process image", variant: "destructive" });
          return;
        }
        const { normalizedPath } = await response.json();
        if (!normalizedPath) {
          toast({ title: "Failed to get image path", variant: "destructive" });
          return;
        }
        setUploadedImageUrl(normalizedPath);
        form.setValue("image", normalizedPath);
        toast({ title: "Cover image uploaded successfully" });
      } catch {
        toast({ title: "Failed to process image", variant: "destructive" });
      }
    }
  };

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
      setUploadedImageUrl(list.image || "");
      form.reset({
        name: list.name,
        slug: list.slug,
        description: list.description || "",
        image: list.image || "",
      });
    } else {
      setEditingList(null);
      setUploadedImageUrl("");
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
        <h2 className="font-serif text-2xl font-semibold">Featured Guides</h2>
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

                <div className="space-y-2">
                  <Label>Cover Image (Optional)</Label>
                  <div className="flex items-center gap-3">
                    {uploadedImageUrl && (
                      <div className="w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={uploadedImageUrl}
                          alt="Cover preview"
                          className="w-full h-full object-cover"
                          data-testid="list-image-preview"
                        />
                      </div>
                    )}
                    <ObjectUploader
                      maxFileSize={10485760}
                      onGetUploadParameters={handleGetUploadParameters}
                      onComplete={handleUploadComplete}
                    >
                      <Image className="w-4 h-4 mr-2" />
                      {uploadedImageUrl ? "Change Cover" : "Upload Cover"}
                    </ObjectUploader>
                  </div>
                </div>

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

  const { data: items = [] } = useQuery<{ review: Review; rank: number }[]>({
    queryKey: ["/api/top-ten-lists", list.id, "items"],
    enabled: isExpanded,
  });

  const updateItemsMutation = useMutation({
    mutationFn: async (itemsData: { reviewId: number; rank: number }[]) => {
      return apiRequest("PUT", `/api/top-ten-lists/${list.id}/items`, { items: itemsData });
    },
    onMutate: async (newItems) => {
      await queryClient.cancelQueries({ queryKey: ["/api/top-ten-lists", list.id, "items"] });
      const previousItems = queryClient.getQueryData<{ review: Review; rank: number }[]>(["/api/top-ten-lists", list.id, "items"]);
      const newQueryData = newItems.map(item => {
        const review = reviews.find(r => r.id === item.reviewId);
        return { review: review!, rank: item.rank };
      }).filter(item => item.review);
      queryClient.setQueryData(["/api/top-ten-lists", list.id, "items"], newQueryData);
      return { previousItems };
    },
    onSuccess: () => {
      toast({ title: "List items updated" });
    },
    onError: (_error, _newItems, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(["/api/top-ten-lists", list.id, "items"], context.previousItems);
      }
      toast({ title: "Failed to update list items", variant: "destructive" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/top-ten-lists", list.id, "items"] });
    },
  });

  const displayedItems = items.map(item => ({ reviewId: item.review.id, rank: item.rank }));

  const addReviewToList = (reviewId: number) => {
    const nextRank = displayedItems.length + 1;
    if (nextRank > 10) {
      toast({ title: "Maximum 10 items allowed", variant: "destructive" });
      return;
    }
    const newItems = [...displayedItems, { reviewId, rank: nextRank }];
    updateItemsMutation.mutate(newItems);
  };

  const removeReviewFromList = (reviewId: number) => {
    const newItems = displayedItems
      .filter(item => item.reviewId !== reviewId)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));
    updateItemsMutation.mutate(newItems);
  };

  const moveItem = (reviewId: number, direction: "up" | "down") => {
    const idx = displayedItems.findIndex(item => item.reviewId === reviewId);
    if (idx === -1) return;
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === displayedItems.length - 1) return;

    const newItems = [...displayedItems];
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    [newItems[idx], newItems[swapIdx]] = [newItems[swapIdx], newItems[idx]];
    const reranked = newItems.map((item, i) => ({ ...item, rank: i + 1 }));
    updateItemsMutation.mutate(reranked);
  };

  const availableReviews = reviews.filter(r => !displayedItems.some(item => item.reviewId === r.id));

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
              <Label className="text-sm font-medium mb-2 block">Current Items ({displayedItems.length}/10)</Label>
              {displayedItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">No items in this list yet</p>
              ) : (
                <div className="space-y-2">
                  {displayedItems
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
                              disabled={item.rank === displayedItems.length}
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

            {displayedItems.length < 10 && availableReviews.length > 0 && (
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

function SocialMediaTab() {
  const { toast } = useToast();
  const [isEmbedDialogOpen, setIsEmbedDialogOpen] = useState(false);
  const [editingEmbed, setEditingEmbed] = useState<SocialEmbed | null>(null);

  const { data: socialSettings = [], isLoading } = useQuery<SocialSettings[]>({
    queryKey: ["/api/social-settings"],
  });

  const { data: embeds = [], isLoading: embedsLoading } = useQuery<SocialEmbed[]>({
    queryKey: ["/api/social-embeds"],
  });

  const instagramSettings = socialSettings.find(s => s.platform === "instagram");
  const tiktokSettings = socialSettings.find(s => s.platform === "tiktok");

  const instagramForm = useForm<SocialSettingsFormData>({
    resolver: zodResolver(socialSettingsFormSchema),
    defaultValues: {
      platform: "instagram",
      username: "",
      profileUrl: "",
    },
  });

  const tiktokForm = useForm<SocialSettingsFormData>({
    resolver: zodResolver(socialSettingsFormSchema),
    defaultValues: {
      platform: "tiktok",
      username: "",
      profileUrl: "",
    },
  });

  const embedForm = useForm<SocialEmbedFormData>({
    resolver: zodResolver(socialEmbedFormSchema),
    defaultValues: {
      platform: "instagram",
      title: "",
      embedCode: "",
      sortOrder: 0,
    },
  });

  useEffect(() => {
    if (instagramSettings) {
      instagramForm.reset({
        platform: "instagram",
        username: instagramSettings.username,
        profileUrl: instagramSettings.profileUrl,
      });
    }
  }, [instagramSettings]);

  useEffect(() => {
    if (tiktokSettings) {
      tiktokForm.reset({
        platform: "tiktok",
        username: tiktokSettings.username,
        profileUrl: tiktokSettings.profileUrl,
      });
    }
  }, [tiktokSettings]);

  const instagramMutation = useMutation({
    mutationFn: async (data: SocialSettingsFormData) => {
      return apiRequest("PUT", "/api/social-settings", { ...data, platform: "instagram" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-settings"] });
      toast({ title: "Instagram settings saved" });
    },
    onError: () => {
      toast({ title: "Failed to save Instagram settings", variant: "destructive" });
    },
  });

  const tiktokMutation = useMutation({
    mutationFn: async (data: SocialSettingsFormData) => {
      return apiRequest("PUT", "/api/social-settings", { ...data, platform: "tiktok" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-settings"] });
      toast({ title: "TikTok settings saved" });
    },
    onError: () => {
      toast({ title: "Failed to save TikTok settings", variant: "destructive" });
    },
  });

  const createEmbedMutation = useMutation({
    mutationFn: async (data: SocialEmbedFormData) => {
      return apiRequest("POST", "/api/social-embeds", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-embeds"] });
      toast({ title: "Embed added successfully" });
      setIsEmbedDialogOpen(false);
      embedForm.reset();
    },
    onError: () => {
      toast({ title: "Failed to add embed", variant: "destructive" });
    },
  });

  const updateEmbedMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: SocialEmbedFormData }) => {
      return apiRequest("PATCH", `/api/social-embeds/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-embeds"] });
      toast({ title: "Embed updated successfully" });
      setIsEmbedDialogOpen(false);
      setEditingEmbed(null);
      embedForm.reset();
    },
    onError: () => {
      toast({ title: "Failed to update embed", variant: "destructive" });
    },
  });

  const deleteEmbedMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/social-embeds/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-embeds"] });
      toast({ title: "Embed deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete embed", variant: "destructive" });
    },
  });

  const handleOpenEmbedDialog = (embed?: SocialEmbed) => {
    if (embed) {
      setEditingEmbed(embed);
      embedForm.reset({
        platform: embed.platform,
        title: embed.title || "",
        embedCode: embed.embedCode,
        sortOrder: embed.sortOrder || 0,
      });
    } else {
      setEditingEmbed(null);
      embedForm.reset({
        platform: "instagram",
        title: "",
        embedCode: "",
        sortOrder: 0,
      });
    }
    setIsEmbedDialogOpen(true);
  };

  const handleEmbedSubmit = (data: SocialEmbedFormData) => {
    if (editingEmbed) {
      updateEmbedMutation.mutate({ id: editingEmbed.id, data });
    } else {
      createEmbedMutation.mutate(data);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SiInstagram className="w-5 h-5" />
            Instagram
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...instagramForm}>
            <form onSubmit={instagramForm.handleSubmit((data) => instagramMutation.mutate(data))} className="space-y-4">
              <FormField
                control={instagramForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="@yourinstagram" {...field} data-testid="input-instagram-username" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={instagramForm.control}
                name="profileUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://instagram.com/yourinstagram" {...field} data-testid="input-instagram-url" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={instagramMutation.isPending} data-testid="button-save-instagram">
                {instagramMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Instagram Settings
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SiTiktok className="w-5 h-5" />
            TikTok
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...tiktokForm}>
            <form onSubmit={tiktokForm.handleSubmit((data) => tiktokMutation.mutate(data))} className="space-y-4">
              <FormField
                control={tiktokForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="@yourtiktok" {...field} data-testid="input-tiktok-username" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={tiktokForm.control}
                name="profileUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://tiktok.com/@yourtiktok" {...field} data-testid="input-tiktok-url" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={tiktokMutation.isPending} data-testid="button-save-tiktok">
                {tiktokMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save TikTok Settings
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle>Embedded Posts</CardTitle>
          <Dialog open={isEmbedDialogOpen} onOpenChange={setIsEmbedDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => handleOpenEmbedDialog()} data-testid="button-add-embed">
                <Plus className="w-4 h-4 mr-2" />
                Add Embed
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingEmbed ? "Edit Embed" : "Add New Embed"}</DialogTitle>
              </DialogHeader>
              <Form {...embedForm}>
                <form onSubmit={embedForm.handleSubmit(handleEmbedSubmit)} className="space-y-4">
                  <FormField
                    control={embedForm.control}
                    name="platform"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platform</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-embed-platform">
                              <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="tiktok">TikTok</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={embedForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="My favorite dish" {...field} data-testid="input-embed-title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={embedForm.control}
                    name="embedCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Embed Code</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Paste your Instagram or TikTok embed code here..."
                            className="min-h-[150px] font-mono text-sm"
                            {...field}
                            data-testid="input-embed-code"
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground mt-1">
                          Copy the embed code from Instagram or TikTok and paste it here
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={embedForm.control}
                    name="sortOrder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sort Order</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} data-testid="input-embed-sort" />
                        </FormControl>
                        <p className="text-xs text-muted-foreground mt-1">
                          Lower numbers appear first
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={createEmbedMutation.isPending || updateEmbedMutation.isPending}
                    data-testid="button-submit-embed"
                  >
                    {(createEmbedMutation.isPending || updateEmbedMutation.isPending) && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {editingEmbed ? "Update Embed" : "Add Embed"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {embedsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : embeds.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No embedded posts yet. Add your first embed above.
            </p>
          ) : (
            <div className="space-y-4">
              {embeds
                .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                .map((embed) => (
                  <div
                    key={embed.id}
                    className="flex items-start justify-between gap-4 p-4 border rounded-md"
                    data-testid={`embed-item-${embed.id}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {embed.platform === "instagram" ? (
                          <SiInstagram className="w-4 h-4 text-pink-500" />
                        ) : (
                          <SiTiktok className="w-4 h-4" />
                        )}
                        <Badge variant="secondary" className="text-xs">
                          {embed.platform}
                        </Badge>
                        {embed.title && (
                          <span className="font-medium text-sm">{embed.title}</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-mono truncate">
                        {embed.embedCode.substring(0, 100)}...
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEmbedDialog(embed)}
                        data-testid={`button-edit-embed-${embed.id}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteEmbedMutation.mutate(embed.id)}
                        disabled={deleteEmbedMutation.isPending}
                        data-testid={`button-delete-embed-${embed.id}`}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const PAGE_CONFIGS = [
  { slug: "home", name: "Home" },
  { slug: "about", name: "About" },
  { slug: "social", name: "Socials" },
  { slug: "reviews", name: "Reviews" },
  { slug: "cuisines", name: "Cuisines" },
  { slug: "featured-guides", name: "Featured Guides" },
  { slug: "locations", name: "Locations" },
];

function PageHeadersTab() {
  const { toast } = useToast();

  const { data: headers = [], isLoading } = useQuery<PageHeader[]>({
    queryKey: ["/api/page-headers"],
  });

  const { data: regions = [], isLoading: regionsLoading } = useQuery<Region[]>({
    queryKey: ["/api/regions"],
  });

  const { data: locationCategories = [], isLoading: categoriesLoading } = useQuery<LocationCategory[]>({
    queryKey: ["/api/location-categories"],
  });

  const getHeaderForPage = (pageSlug: string) => {
    return headers.find(h => h.pageSlug === pageSlug);
  };

  const handleGetUploadParameters = async () => {
    try {
      const response = await fetch("/api/objects/upload", { method: "POST" });
      if (!response.ok) throw new Error("Failed to get upload URL");
      const { uploadURL } = await response.json();
      return { method: "PUT" as const, url: uploadURL };
    } catch {
      toast({ title: "Failed to initialize upload", variant: "destructive" });
      throw new Error("Upload initialization failed");
    }
  };

  const upsertMutation = useMutation({
    mutationFn: async (data: { pageSlug: string; title?: string; subtitle?: string; image?: string }) => {
      return apiRequest("PUT", "/api/page-headers", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/page-headers"] });
      toast({ title: "Page header updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update page header", variant: "destructive" });
    },
  });

  const updateRegionMutation = useMutation({
    mutationFn: async ({ id, image }: { id: number; image: string | null }) => {
      return apiRequest("PATCH", `/api/regions/${id}`, { image });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/regions"] });
      toast({ title: "Region image updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update region image", variant: "destructive" });
    },
  });

  const updateLocationCategoryMutation = useMutation({
    mutationFn: async ({ id, image }: { id: number; image: string | null }) => {
      return apiRequest("PATCH", `/api/location-categories/${id}`, { image });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/location-categories"] });
      toast({ title: "Location category image updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update location category image", variant: "destructive" });
    },
  });

  const handleUploadComplete = async (pageSlug: string, result: { successful: Array<{ uploadURL?: string }> }) => {
    if (result.successful && result.successful.length > 0) {
      const uploadedUrl = result.successful[0].uploadURL;
      if (!uploadedUrl) {
        toast({ title: "Failed to get upload URL", variant: "destructive" });
        return;
      }
      try {
        const response = await fetch("/api/public-images", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: uploadedUrl }),
        });
        if (!response.ok) {
          toast({ title: "Failed to process image", variant: "destructive" });
          return;
        }
        const { normalizedPath } = await response.json();
        if (!normalizedPath) {
          toast({ title: "Failed to get image path", variant: "destructive" });
          return;
        }
        const currentHeader = getHeaderForPage(pageSlug);
        upsertMutation.mutate({
          pageSlug,
          title: currentHeader?.title || undefined,
          subtitle: currentHeader?.subtitle || undefined,
          image: normalizedPath,
        });
      } catch {
        toast({ title: "Failed to process image", variant: "destructive" });
      }
    }
  };

  const handleRegionUploadComplete = async (regionId: number, result: { successful: Array<{ uploadURL?: string }> }) => {
    if (result.successful && result.successful.length > 0) {
      const uploadedUrl = result.successful[0].uploadURL;
      if (!uploadedUrl) {
        toast({ title: "Failed to get upload URL", variant: "destructive" });
        return;
      }
      try {
        const response = await fetch("/api/public-images", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: uploadedUrl }),
        });
        if (!response.ok) {
          toast({ title: "Failed to process image", variant: "destructive" });
          return;
        }
        const { normalizedPath } = await response.json();
        if (!normalizedPath) {
          toast({ title: "Failed to get image path", variant: "destructive" });
          return;
        }
        updateRegionMutation.mutate({ id: regionId, image: normalizedPath });
      } catch {
        toast({ title: "Failed to process image", variant: "destructive" });
      }
    }
  };

  const handleLocationCategoryUploadComplete = async (categoryId: number, result: { successful: Array<{ uploadURL?: string }> }) => {
    if (result.successful && result.successful.length > 0) {
      const uploadedUrl = result.successful[0].uploadURL;
      if (!uploadedUrl) {
        toast({ title: "Failed to get upload URL", variant: "destructive" });
        return;
      }
      try {
        const response = await fetch("/api/public-images", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: uploadedUrl }),
        });
        if (!response.ok) {
          toast({ title: "Failed to process image", variant: "destructive" });
          return;
        }
        const { normalizedPath } = await response.json();
        if (!normalizedPath) {
          toast({ title: "Failed to get image path", variant: "destructive" });
          return;
        }
        updateLocationCategoryMutation.mutate({ id: categoryId, image: normalizedPath });
      } catch {
        toast({ title: "Failed to process image", variant: "destructive" });
      }
    }
  };

  const handleRemoveImage = (pageSlug: string) => {
    const currentHeader = getHeaderForPage(pageSlug);
    upsertMutation.mutate({
      pageSlug,
      title: currentHeader?.title || undefined,
      subtitle: currentHeader?.subtitle || undefined,
      image: undefined,
    });
  };

  const handleRemoveRegionImage = (regionId: number) => {
    updateRegionMutation.mutate({ id: regionId, image: null });
  };

  const handleRemoveLocationCategoryImage = (categoryId: number) => {
    updateLocationCategoryMutation.mutate({ id: categoryId, image: null });
  };

  const getRegionName = (regionId: number | null) => {
    if (!regionId) return "No Region";
    const region = regions.find(r => r.id === regionId);
    return region?.name || "Unknown Region";
  };

  if (isLoading || regionsLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl font-semibold">Page Headers</h2>
        </div>

        <div className="grid gap-4">
          {PAGE_CONFIGS.map((page) => {
            const header = getHeaderForPage(page.slug);
            return (
              <Card key={page.slug} data-testid={`card-page-header-${page.slug}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="relative w-32 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      {header?.image ? (
                        <img 
                          src={header.image} 
                          alt={`${page.name} header`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-lg" data-testid={`text-page-name-${page.slug}`}>
                        {page.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {header?.image ? "Custom header image set" : "Using default header"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {header?.image && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveImage(page.slug)}
                          disabled={upsertMutation.isPending}
                          data-testid={`button-remove-header-${page.slug}`}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                      )}
                      <ObjectUploader
                        onGetUploadParameters={handleGetUploadParameters}
                        onComplete={(result) => handleUploadComplete(page.slug, result)}
                      >
                        <Upload className="w-4 h-4 mr-1" />
                        {header?.image ? "Change" : "Upload"}
                      </ObjectUploader>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl font-semibold">Region Images</h2>
        </div>

        <div className="grid gap-4">
          {regions.map((region) => (
            <Card key={region.id} data-testid={`card-region-${region.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="relative w-32 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                    {region.image ? (
                      <img 
                        src={region.image} 
                        alt={`${region.name} image`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-lg" data-testid={`text-region-name-${region.id}`}>
                      {region.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {region.image ? "Custom image set" : "No image set"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {region.image && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveRegionImage(region.id)}
                        disabled={updateRegionMutation.isPending}
                        data-testid={`button-remove-region-image-${region.id}`}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    )}
                    <ObjectUploader
                      onGetUploadParameters={handleGetUploadParameters}
                      onComplete={(result) => handleRegionUploadComplete(region.id, result)}
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      {region.image ? "Change" : "Upload"}
                    </ObjectUploader>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {regions.length === 0 && (
            <p className="text-muted-foreground text-center py-8">No regions found</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl font-semibold">Location Category Images</h2>
        </div>

        <div className="grid gap-4">
          {locationCategories.map((category) => (
            <Card key={category.id} data-testid={`card-location-category-${category.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="relative w-32 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                    {category.image ? (
                      <img 
                        src={category.image} 
                        alt={`${category.name} image`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-lg" data-testid={`text-location-category-name-${category.id}`}>
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {getRegionName(category.regionId)} {category.image ? "• Custom image set" : "• No image set"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {category.image && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveLocationCategoryImage(category.id)}
                        disabled={updateLocationCategoryMutation.isPending}
                        data-testid={`button-remove-location-category-image-${category.id}`}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    )}
                    <ObjectUploader
                      onGetUploadParameters={handleGetUploadParameters}
                      onComplete={(result) => handleLocationCategoryUploadComplete(category.id, result)}
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      {category.image ? "Change" : "Upload"}
                    </ObjectUploader>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {locationCategories.length === 0 && (
            <p className="text-muted-foreground text-center py-8">No location categories found</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ContactSubmissionsTab() {
  const { toast } = useToast();

  const { data: submissions = [], isLoading } = useQuery<ContactSubmission[]>({
    queryKey: ["/api/contact-submissions"],
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("PATCH", `/api/contact-submissions/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact-submissions"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/contact-submissions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact-submissions"] });
      toast({ title: "Message deleted" });
    },
    onError: () => {
      toast({ title: "Failed to delete message", variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const unreadCount = submissions.filter(s => s.read === 0).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-semibold">Contact Messages</h2>
          <p className="text-sm text-muted-foreground">
            {submissions.length} total message{submissions.length !== 1 ? "s" : ""}
            {unreadCount > 0 && ` (${unreadCount} unread)`}
          </p>
        </div>
      </div>

      {submissions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Mail className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No messages yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <Card 
              key={submission.id} 
              className={submission.read === 0 ? "border-primary/30 bg-primary/5" : ""}
              data-testid={`card-message-${submission.id}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-medium" data-testid={`text-sender-${submission.id}`}>
                        {submission.name}
                      </span>
                      <a 
                        href={`mailto:${submission.email}`} 
                        className="text-sm text-primary hover:underline"
                        data-testid={`link-email-${submission.id}`}
                      >
                        {submission.email}
                      </a>
                      {submission.read === 0 && (
                        <Badge variant="default" className="text-xs">New</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground whitespace-pre-wrap" data-testid={`text-message-${submission.id}`}>
                      {submission.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(submission.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {submission.read === 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => markReadMutation.mutate(submission.id)}
                        disabled={markReadMutation.isPending}
                        data-testid={`button-mark-read-${submission.id}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMutation.mutate(submission.id)}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-message-${submission.id}`}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminLoginForm({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        toast({ title: "Logged in successfully" });
        onLogin();
      } else {
        const data = await response.json();
        setError(data.error || "Invalid password");
      }
    } catch {
      setError("Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-serif text-2xl text-center">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                data-testid="input-admin-password"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive" data-testid="text-login-error">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={isLoading} data-testid="button-admin-login">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Admin() {
  const [isRefreshingStatic, setIsRefreshingStatic] = useState(false);
  const { toast } = useToast();

  const { data: authStatus, isLoading: authLoading } = useQuery<{ isAdmin: boolean }>({
    queryKey: ["/api/admin/status"],
  });

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    queryClient.invalidateQueries({ queryKey: ["/api/admin/status"] });
  };

  const handleRefreshStaticData = async () => {
    setIsRefreshingStatic(true);
    try {
      const response = await apiRequest("POST", "/api/static/export");
      const result = await response.json();
      if (result.success) {
        toast({ title: "Static data exported successfully" });
      } else {
        toast({ title: result.error || "Export failed", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Failed to export static data", variant: "destructive" });
    } finally {
      setIsRefreshingStatic(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!authStatus?.isAdmin) {
    return (
      <AdminLoginForm
        onLogin={() => queryClient.invalidateQueries({ queryKey: ["/api/admin/status"] })}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground" data-testid="admin-title">
              Admin Panel
            </h1>
            <p className="font-sans text-muted-foreground mt-2">
              Manage your restaurant reviews and categories
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button 
              variant="outline" 
              onClick={handleRefreshStaticData}
              disabled={isRefreshingStatic}
              data-testid="button-refresh-static-data"
            >
              {isRefreshingStatic ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Refresh Static Data
            </Button>
            <Button variant="outline" onClick={handleLogout} data-testid="button-admin-logout">
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="reviews" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="reviews" data-testid="tab-reviews">
              <Star className="w-4 h-4 mr-2" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="cuisines" data-testid="tab-cuisines">
              <Utensils className="w-4 h-4 mr-2" />
              Cuisines
            </TabsTrigger>
            <TabsTrigger value="top-ten" data-testid="tab-top-ten">
              <List className="w-4 h-4 mr-2" />
              Featured Guides
            </TabsTrigger>
            <TabsTrigger value="social" data-testid="tab-social">
              <Share2 className="w-4 h-4 mr-2" />
              Socials
            </TabsTrigger>
            <TabsTrigger value="headers" data-testid="tab-headers">
              <ImageIcon className="w-4 h-4 mr-2" />
              Headers
            </TabsTrigger>
            <TabsTrigger value="messages" data-testid="tab-messages">
              <MessageSquare className="w-4 h-4 mr-2" />
              Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reviews">
            <ReviewsTab />
          </TabsContent>

          <TabsContent value="cuisines">
            <CuisinesTab />
          </TabsContent>

          <TabsContent value="top-ten">
            <TopTenListsTab />
          </TabsContent>

          <TabsContent value="social">
            <SocialMediaTab />
          </TabsContent>

          <TabsContent value="headers">
            <PageHeadersTab />
          </TabsContent>

          <TabsContent value="messages">
            <ContactSubmissionsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
