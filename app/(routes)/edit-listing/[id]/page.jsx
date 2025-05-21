"use client";

import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/components/Provider/useAuth";
import FileUpload from "../_components/FileUpload";
import CurrencyInput from "react-currency-input-field";
import { formatCurrency } from "@/components/helpers/formatCurrency";
import {
  Building2,
  Home,
  Store,
  Landmark,
  BedDouble,
  Bath,
  Ruler,
  ParkingCircle,
  DollarSign,
  Phone,
  FileText,
  Images,
  Save,
  Loader,
  ArrowLeft,
} from "lucide-react";

const ListingSchema = Yup.object()
  .shape({
    action: Yup.string()
      .required("Please select either Rent or Sell")
      .oneOf(["Sell", "Rent"], "Invalid action"),
    propertyType: Yup.string().required("Please select a property type"),
    area: Yup.string().required("Please enter the area"),
    price: Yup.number()
      .typeError("Price must be a number")
      .positive("Price must be a positive number")
      .required("Please enter the price"),
    phone: Yup.string()
      .matches(/^(98|97)\d{8}$/, {
        message: "Phone number must start with 98 or 97 and be 10 digits",
        excludeEmptyString: true,
      })
      .required("Please enter your phone number"),
    description: Yup.string()
      .required("Please enter a description")
      .max(2000, "Description must be at most 800 characters"),
    post_title: Yup.string()
      .required("Please enter an attractive Post Title")
      .max(60, "Post Title must be less than 60 characters"),
    rooms: Yup.number().when("propertyType", {
      is: (propertyType) => propertyType === "House",
      then: () =>
        Yup.number()
          .typeError("Number of rooms must be a number")
          .positive("Number of rooms must be positive")
          .required("Please enter number of rooms"),
      otherwise: () => Yup.number().optional(),
    }),
    bathrooms: Yup.string().when("propertyType", {
      is: (propertyType) => propertyType === "House",
      then: () => Yup.string().required("Please enter bathroom details"),
      otherwise: () => Yup.string().optional(),
    }),
    parking: Yup.string().when("propertyType", {
      is: (propertyType) => propertyType === "House",
      then: () => Yup.string().required("Please enter parking details"),
      otherwise: () => Yup.string().optional(),
    }),
  })
  .test("at-least-one-filled", null, function (obj) {
    if (obj.propertyType === "Land" || obj.propertyType === "Shop") {
      return true;
    }
    return obj.rooms || obj.bathrooms || obj.parking;
  });

function EditListing({ params: paramsPromise }) {
  const params = React.use(paramsPromise);
  const id = params.id;
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [listing, setListing] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [returnToAdmin, setReturnToAdmin] = useState(false);

  // Check if user is admin
  const isAdmin = user?.email === "ashokabrother@gmail.com" || "neupanenischal2@gmail.com";

  useEffect(() => {
    // Check if we should return to admin page
    const queryParams = new URLSearchParams(window.location.search);
    const adminReturn = queryParams.get('returnToAdmin');
    if (adminReturn === 'true') {
      setReturnToAdmin(true);
    }

    if (user) {
      verifyUserPermissions();
    }
  }, [user]);

  const verifyUserPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from("listing")
        .select("*,listingImages(listing_id,url)")
        .eq("id", id)
        .single();

      if (error) {
        toast.error("Error: " + error.message);
        throw error;
      }

      if (!data) {
        toast.error("No listing found");
        handleReturnNavigation();
        return;
      }

      // Check if user is admin or the listing creator
      const canEdit = isAdmin || data.createdBy === user?.email;

      if (!canEdit) {
        toast.error("You do not have permission to edit this listing");
        router.push("/");
        return;
      }

      setHasPermission(true);
      setListing(data);
    } catch (error) {
      console.error("Error fetching listing:", error);
      toast.error("Failed to load listing: " + error.message);
      handleReturnNavigation();
    } finally {
      setLoading(false);
    }
  };

  const uploadImages = async (listingId) => {
    try {
      for (const image of images) {
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}.${image.name.split(".").pop()}`;

        const { error: uploadError } = await supabase.storage
          .from("listingImages")
          .upload(fileName, image);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          toast.error("Image upload failed");
          return false;
        }

        const { data: publicUrlData } = await supabase.storage
          .from("listingImages")
          .getPublicUrl(fileName);

        const imageUrl = publicUrlData.publicUrl;

        const { error: insertError } = await supabase
          .from("listingImages")
          .insert({
            url: imageUrl,
            listing_id: listingId,
          });

        if (insertError) {
          console.error("DB insert error:", insertError);
          toast.error("Failed to save image reference");
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error("Upload process error:", error);
      toast.error("Image upload process failed");
      return false;
    }
  };

  const handleReturnNavigation = () => {
    if (returnToAdmin) {
      router.push('/admin/listings');
    } else {
      // Get the appropriate redirect path based on listing type
      const getRedirectPath = (action, propertyType) => {
        if (!action || !propertyType) return "/";
        
        const type = propertyType.toLowerCase();
        const act = action.toLowerCase();
        
        // Map specific routes
        if (type === "house") {
          return act === "rent" ? "/rent/house" : "/buy/house";
        } else if (type === "land") {
          return act === "rent" ? "/rent/land" : "/buy/land";
        } else if (type === "shop") {
          return act === "rent" ? "/rent/shop" : "/buy/shop";
        }
        
        return "/";
      };
      
      if (listing) {
        router.push(getRedirectPath(listing.action, listing.propertyType));
      } else {
        router.push('/');
      }
    }
  };

  const onSubmitHandler = async (values, { setFieldError }) => {
    if (!hasPermission) {
      toast.error("You do not have permission to update this listing");
      return;
    }
  
    setSaving(true);
    try {
      // First validate if we have images
      if (images.length === 0 && (!listing?.listingImages || listing.listingImages.length === 0)) {
        toast.error("Please add at least 1 image");
        setSaving(false);
        return;
      }
  
      // Clean up the values before sending to Supabase
      const updateValues = {
        ...values,
        active: true,
        rooms: values.propertyType === "Land" ? null : values.rooms,
        bathrooms: values.propertyType === "Land" ? null : values.bathrooms,
        parking: values.propertyType === "Land" ? null : values.parking,
        price: Number(values.price),
        rooms: values.rooms ? Number(values.rooms) : null,
        createdBy: listing.createdBy,
        profileImage: user?.image,
        fullName: user?.name,
      };
  
      const { error } = await supabase
        .from("listing")
        .update(updateValues)
        .eq("id", id);
  
      if (error) {
        console.error("Update error:", error);
        toast.error("Update failed: " + error.message);
        setSaving(false);
        return;
      }
  
      if (images.length > 0) {
        const imagesUploaded = await uploadImages(id);
        if (!imagesUploaded) {
          toast.error("Failed to upload images");
          setSaving(false);
          return;
        }
      }
  
      toast.success("Listing updated successfully!");
      
      // Redirect with a small delay to ensure the toast message is visible
      setTimeout(() => {
        handleReturnNavigation();
      }, 1500);
  
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to update listing");
      if (error.details) {
        Object.entries(error.details).forEach(([key, value]) => {
          setFieldError(key, value);
        });
      }
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    router.push('/login');
    return null;
  }

  if (!hasPermission || !listing) return null;

  return (
    <div className="px-2 md:px-36 my-14">
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={handleReturnNavigation} 
          className="flex items-center text-gray-600 hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          {returnToAdmin ? 'Back to Admin Dashboard' : 'Back to Listings'}
        </button>
      </div>
      
      <div className="flex items-center gap-3 mb-6">
        <FileText className="h-8 w-8 text-primary" />
        <h2 className="font-bold text-2xl text-gray-800">
          Update Listing Details
        </h2>
      </div>

      <Formik
        initialValues={{
          action: listing?.action || "Rent",
          propertyType: listing?.propertyType || "House",
          rooms: listing?.rooms || "",
          bathrooms: listing?.bathrooms || "",
          area: listing?.area || "",
          parking: listing?.parking || "",
          price: listing?.price || "",
          profileImage: user?.image || "",
          phone: listing?.phone || "",
          description: listing?.description || "",
          post_title: listing?.post_title || "",
          fullName: user?.name || "",
        }}
        validationSchema={ListingSchema}
        onSubmit={onSubmitHandler}
        enableReinitialize={true}
      >
        {({ errors, touched, setFieldValue, values }) => {
          useEffect(() => {
            if (Object.keys(touched).length > 0) {
              Object.entries(errors).forEach(([key, value]) => {
                if (touched[key]) {
                  toast.error(value);
                }
              });
            }
          }, [errors, touched]);

          return (
            <Form className="space-y-8">
              <div className="p-8 px-1 md:px-8 border rounded-xl shadow-lg bg-white space-y-8">
                {/* Action and Property Type Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <label className="text-gray-600 font-bold flex items-center text-lg gap-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      Select Action
                    </label>
                    <RadioGroup
                      defaultValue={listing?.action || "Rent"}
                      value={values.action}
                      onValueChange={(v) => setFieldValue("action", v)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Sell" id="Sell" />
                        <Label htmlFor="Sell" className="text-lg">
                          Sell
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Rent" id="Rent" />
                        <Label htmlFor="Rent" className="text-lg">
                          Rent
                        </Label>
                      </div>
                    </RadioGroup>
                    {errors.action && touched.action && (
                      <p className="text-red-500 text-sm">{errors.action}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="text-gray-600 font-bold flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      Select Property Type-House or Land?
                    </label>
                    <Select
                      value={values.propertyType}
                      onValueChange={(v) => setFieldValue("propertyType", v)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Property Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="House">
                          <div className="flex items-center gap-2">
                            <Home className="h-5 w-5" />
                            <span>House</span>
                          </div>
                        </SelectItem>

                        <SelectItem value="Land">
                          <div className="flex items-center gap-2">
                            <Landmark className="h-5 w-5" />
                            <span>Land</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Shop">
                          <div className="flex items-center gap-2">
                            <Store className="h-5 w-5" />
                            <span>Shop</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.propertyType && touched.propertyType && (
                      <p className="text-red-500 text-sm">
                        {errors.propertyType}
                      </p>
                    )}
                  </div>
                </div>

                {/* Conditional Fields for non-Land properties */}
                {values.propertyType !== "Land" &&
                  values.propertyType !== "Shop" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      <div className="space-y-3">
                        <label className="text-gray-600 font-bold flex items-center gap-2">
                          <BedDouble className="h-5 w-5 text-primary" />
                          Total Rooms
                        </label>
                        <Input
                          type="number"
                          placeholder="Ex. 2"
                          value={values.rooms}
                          onChange={(e) =>
                            setFieldValue("rooms", e.target.value)
                          }
                          className={`focus:ring-primary ${
                            errors.rooms && touched.rooms
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        {errors.rooms && touched.rooms && (
                          <p className="text-red-500 text-sm">{errors.rooms}</p>
                        )}
                      </div>
                      <div className="space-y-3">
                        <label className="text-gray-600 font-bold flex items-center gap-2">
                          <Bath className="h-5 w-5 text-primary" />
                          Total Bathrooms
                        </label>
                        <Input
                          type="text"
                          placeholder="Enter bathroom number and type"
                          value={values.bathrooms}
                          onChange={(e) =>
                            setFieldValue("bathrooms", e.target.value)
                          }
                          className={
                            errors.bathrooms && touched.bathrooms
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {errors.bathrooms && touched.bathrooms && (
                          <p className="text-red-500 text-sm">
                            {errors.bathrooms}
                          </p>
                        )}
                      </div>
                      <div className="space-y-3">
                        <label className="text-gray-600 font-bold flex items-center gap-2">
                          <ParkingCircle className="h-5 w-5 text-primary" />
                          Parking
                        </label>
                        <Input
                          type="text"
                          placeholder="Number of Car or Bike Specify"
                          value={values.parking}
                          onChange={(e) =>
                            setFieldValue("parking", e.target.value)
                          }
                          className={
                            errors.parking && touched.parking
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {errors.parking && touched.parking && (
                          <p className="text-red-500 text-sm">
                            {errors.parking}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                {/* Common Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <label className="text-gray-600 font-bold flex items-center gap-2">
                      <Ruler className="h-5 w-5 text-primary" />
                      Total Area
                    </label>
                    <Input
                      type="text"
                      placeholder="Aana or Bigha For Rooms-write sq Feet"
                      value={values.area}
                      onChange={(e) => setFieldValue("area", e.target.value)}
                      className={
                        errors.area && touched.area ? "border-red-500" : ""
                      }
                    />
                    {errors.area && touched.area && (
                      <p className="text-red-500 text-sm">{errors.area}</p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <label className="text-gray-600 font-bold flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      Total Price (Rs)
                    </label>
                    <CurrencyInput
                      className={`text-lg p-2 w-full focus:outline-blue-600 rounded-lg ${
                        errors.price && touched.price ? "border-red-500" : ""
                      }`}
                      placeholder="Enter your price..."
                      value={values.price}
                      intlConfig={{ locale: "en-In", currency: "NPR" }}
                      prefix="Rs "
                      onValueChange={(value) => setFieldValue("price", value)}
                      required
                    />
                    <p className="pl-2 font-bold mt-6">
                      {formatCurrency(values?.price)}
                    </p>
                    {errors.price && touched.price && (
                      <p className="text-red-500 text-sm">{errors.price}</p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <label className="text-gray-600 font-bold flex items-center gap-2">
                      <Phone className="h-5 w-5 text-primary" />
                      Mobile Number
                    </label>
                    <Input
                      type="text"
                      placeholder="97 or 98XXXXXXXX"
                      value={values.phone}
                      onChange={(e) => setFieldValue("phone", e.target.value)}
                      className={
                        errors.phone && touched.phone ? "border-red-500" : ""
                      }
                    />
                    {errors.phone && touched.phone && (
                      <p className="text-red-500 text-sm">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Post Title */}
                <div className="space-y-3">
                  <label className="text-gray-600 font-bold flex items-center gap-2">
                    <Save className="h-5 w-5 text-primary" />
                    Post Title - Short & Sweet with address
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter a short and sweet title with address"
                    value={values.post_title}
                    onChange={(e) =>
                      setFieldValue("post_title", e.target.value)
                    }
                    className={
                      errors.post_title && touched.post_title
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {errors.post_title && touched.post_title && (
                    <p className="text-red-500 text-sm">{errors.post_title}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <label className="text-gray-600 font-bold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Description
                  </label>
                  <Textarea
                    placeholder="Enter detailed description of your property..."
                    value={values.description}
                    onChange={(e) =>
                      setFieldValue("description", e.target.value)
                    }
                    maxLength={2000}
                    className={`min-h-[100px] ${
                      errors.description && touched.description
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {errors.description && touched.description && (
                    <p className="text-red-500 text-sm">{errors.description}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    {values.description?.length || 0}/1000 characters
                  </p>
                </div>

                {/* Image Upload */}
                <div className="space-y-3">
                  <label className="text-gray-600 font-bold flex items-center gap-2">
                    <Images className="h-5 w-5 text-primary" />
                    Upload Upto 6 High Quality Images
                  </label>
                  <FileUpload
                    setImages={setImages}
                    imageList={listing?.listingImages}
                    listingId={id}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                  >
                    {saving ? (
                      <Loader className="h-5 w-5 animate-spin" />
                    ) : (
                      <Save className="h-5 w-5" />
                    )}
                    Save and Publish
                  </Button>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

export default EditListing;