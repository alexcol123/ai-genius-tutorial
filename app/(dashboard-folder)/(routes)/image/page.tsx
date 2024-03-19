'use client'
import Heading from "@/components/Heading"
import { Download, ImageIcon } from "lucide-react"
import axios from 'axios'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { amountOptions, formSchema, resolutionsOptions } from "./constants"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Empty } from "@/components/Empty"
import { Loader } from "@/components/Loader"


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardFooter } from "@/components/ui/card"
import Image from "next/image"
import ProModal from "@/components/ProModal"
import { userProModal } from "@/hooks/use-pro-modal"
import toast from "react-hot-toast"

const ImagePage = () => {
  const proModal = userProModal()
  const router = useRouter()

  const [images, setImages] = useState<string>('')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      amount: '1',
      resolution: '1024x1024'
    }
  })

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {



    try {
      setImages('')
      const response = await axios.post('/api/image', values)

      setImages(response.data)
      form.reset();


    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      }
      else {
        toast.error("Something went wrong.");
      }
    } finally {
      router.refresh();
    }
  }



  return (


    <div>
      <Heading
        title="Image Generation"
        description="Picture of a horse in New York."
        icon={ImageIcon}
        iconColor="text-pink-700"
        bgColor="bg-pink-700/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="
                rounded-lg 
                border 
                w-full 
                p-4 
                px-3 
                md:px-6 
                focus-within:shadow-sm
                grid
                grid-cols-12
                gap-2
              "
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-6">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="How do I calculate the radius of a circle?"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="amount"
                control={form.control}

                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger >
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>



                        {amountOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>

                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                name="resolution"
                control={form.control}

                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger >
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>



                        {resolutionsOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>

                    </Select>
                  </FormItem>
                )}
              />


              <Button className="col-span-12 lg:col-span-2 w-full" type="submit" disabled={isLoading} size="icon">
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-20">
              <Loader />
            </div>
          )}
          {images.length === 0 && !isLoading && (
            <Empty label="No Images generated yet." />
          )}
          {images !== '' && <div className="grid grid-cols-1  m-8">
            <Card

              className="rounded-lg"
            >
              <div className="relative aspect-square">
                <Image
                  alt="Image"
                  fill
                  src={images}
                />
              </div>
              <CardFooter className="p-2">
                <Button variant='secondary' className="w-full"
                  onClick={() => window.open(images)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>

              </CardFooter>
            </Card>
          </div>}
        </div>
      </div>
    </div>

  )
}

export default ImagePage
