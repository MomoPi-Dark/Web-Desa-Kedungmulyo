"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { logStore } from "@/lib/firebase/log_activity";
import { TipsPayload, tipsStore } from "@/lib/firebase/tips";
import { zodResolver } from "@hookform/resolvers/zod";
import { Session } from "next-auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Title harus diisi").optional(),
  description: z.string().min(1, "Deskripsi harus diisi").optional(),
  image: z.any().optional(),
  location: z.string().min(1, "Lokasi harus diisi").optional(),
});

type FormData = z.infer<typeof formSchema>;

const cloudPresetName = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME;
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const cloudinaryAPISecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;

export default function GetSpotAndEdit({
  targetTips,
  imageSpot,
  session,
}: {
  targetTips: TipsPayload;
  imageSpot?: string;
  session: Session;
}) {
  const router = useRouter();

  const [imagePreview, setImagePreview] = useState<string | null>(
    targetTips.image,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: targetTips.image,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      const updatedData = { ...data };
      let shouldUpdate = false;

      if (data.image && data.image !== targetTips.image) {
        const image = await uploadImage(data.image);
        updatedData.image = image;
        shouldUpdate = true;
      }

      const isOtherFieldsChanged = Object.keys(updatedData).some(
        // @ts-expect-error
        (key) => updatedData[key] !== targetTips[key],
      );

      if (isOtherFieldsChanged || shouldUpdate) {
        await tipsStore.editTips(targetTips.id, {
          id: targetTips.id,
          ...updatedData,
        });

        toast({
          title: "Success",
          className: "bg-green-600",
          description: "Spot edited successfully",
        });
      } else {
        toast({
          title: "No changes",
          className: "bg-yellow-600",
          description: "No changes were made to the tips",
        });
      }

      await logStore.logActivity({
        activity: `Mengedit tips ${targetTips.id}`,
        status: "update",
        identity: session?.user.id,
      });

      // Redirect after submission
      router.push("/dashboard/tips");

      setLoading(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      setLoading(false);
    }
  };

  const MAX_FILE_SIZE = 10485760;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "Error",
          description: "File size too large. Maximum allowed size is 10 MB.",
          className: "bg-red-600",
        });
        return;
      }

      form.setValue("image", file as any);
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      form.setValue("image", null);
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const uploadImage = async (imageFile: File) => {
    try {
      if (targetTips.image) {
        const fileNameWithExtension = targetTips.image.split("/").pop() || "";

        const previousImagePublicId =
          "webdesa/" +
          fileNameWithExtension
            .split(".")
            .slice(0, -1)
            .join(".")
            .replaceAll("%20", " ");

        // If there is a previous image, delete it
        if (previousImagePublicId) {
          fetch(`/api/image/delete`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              publicId: previousImagePublicId,
              folder: "webdesa/tips/",
            }),
          });
        }
      }

      // Prepare FormData for the new image upload
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", cloudPresetName!);

      // Generate a unique filename
      const timestamp = Date.now();
      const filename = `${timestamp}-${imageFile.name}`;

      formData.append("public_id", filename);
      formData.append("folder", "webdesa/tips/");

      // Upload the image
      const response = await fetch("/api/image/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        return result.url;
      } else {
        console.error(result.error.message || "Failed to upload image");
        return null;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      return ""; // Return an empty string on failure
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Edit Tips</h1>
          <Separator className="my-4" />
        </div>

        <Card className="w-full shadow-md">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="px-2 py-7"
            >
              <CardContent className="space-y-4">
                <FormItem>
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <div className="relative flex flex-col items-start justify-center space-y-6">
                        {imagePreview && (
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            width={1000}
                            height={1000}
                            className="mt-2 h-50 w-65 rounded-md object-cover"
                          />
                        )}
                        <FormControl className="pb-2">
                          <Input
                            type="file"
                            accept="image/*"
                            ref={inputFileRef}
                            onChange={handleImageChange}
                          />
                        </FormControl>

                        <FormMessage />
                      </div>
                    )}
                  />
                </FormItem>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <div className="flex items-center justify-center space-x-3">
                        <AiOutlineLoading3Quarters
                          className="animate-spin"
                          size={18}
                        />
                        <span className="flex items-center text-base">
                          Loading
                          <span className="dot-anim ml-1">
                            <span>.</span>
                            <span>.</span>
                            <span>.</span>
                          </span>
                        </span>
                      </div>
                      <style jsx>{`
                        .dot-anim {
                          display: inline-flex;
                        }
                        .dot-anim span {
                          opacity: 0;
                          animation: dot-fade 1.5s infinite;
                        }
                        .dot-anim span:nth-child(1) {
                          animation-delay: 0s;
                        }
                        .dot-anim span:nth-child(2) {
                          animation-delay: 0.3s;
                        }
                        .dot-anim span:nth-child(3) {
                          animation-delay: 0.6s;
                        }

                        @keyframes dot-fade {
                          0% {
                            opacity: 0;
                          }
                          50% {
                            opacity: 1;
                          }
                          100% {
                            opacity: 0;
                          }
                        }
                      `}</style>
                    </>
                  ) : (
                    "Simpan"
                  )}
                </Button>
              </CardContent>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
