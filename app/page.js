import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FEATURES, STEPS, TESTIMONIALS } from "@/lib/landing";
import { ArrowRight, Divide } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ST } from "next/dist/shared/lib/utils";

export default function Home() {
  return (
    <div className="flex flex-col pt-16">
      <section className="mt-20 pb-12 space-y-10 md:space-y-20 px-5">
        <div className="container mx-auto px-4 md:px-6 text-center space-y-6">
          <Badge variant="outline" className="bg-gray-600 text-white py-2">
            Split smart. Live easy
          </Badge>

          <h1 className="gradient-title mx-auto max-w-4xl text-4xl font-bold md:text-7xl">
            Smart Expense Sharing with AI , Bonds Over Bills.
          </h1>

          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed">
            Smart tracking, effortless splitting, quick settlements ,
            friendships without financial confusion.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size={"lg"} className="bg-gray-600 hover:bg-black">
              <Link href="/dashboard">
                Start Splitting
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>

            <Button asChild size={"lg"} className="bg-black hover:bg-gray-600">
              <Link href="#How-it-works">How it Works?</Link>
            </Button>
          </div>
        </div>

        <div className="container mx-auto max-w-5xl overflow-hidden rounded-xl shadow-xl">
          <div className="gradient p-1 aspect-[16/9]">
            <Image
              src="/hero.jpg"
              width={1280}
              height={720}
              alt="banner"
              className="rounded-lg mx-auto"
              priority
            />
          </div>
        </div>
      </section>

      <section id="features" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <Badge variant="outline" className="bg-gray-600 text-white py-2 px-4">
            Features
          </Badge>

          <h2 className="gradient-title mt-2 text-3xl md:text-4xl">
            All you need to split expenses easily.
          </h2>

          <p className="mx-auto mt-3 max-w-[700px] text-gray-500 md:text-xl/relaxed">
            Everything you need to manage shared expenses, all in one platform.
          </p>

          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ title, Icon, bg, color, description }) => (
              <Card
                key={title}
                className="flex flex-col items-center space-y-4 p-6 text-center"
              >
                <div className={`rounded-full p-3 ${bg}`}>
                  <Icon className={`size-6 ${color}`} />
                </div>

                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-gray-500">{description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="Highlights" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <Badge variant="outline" className="bg-gray-600 text-white py-2 px-4">
            Highlights
          </Badge>

          <h2 className="gradient-title mt-2 text-3xl md:text-4xl">
            Smart ways to share, zero hassle.
          </h2>

          <p className="mx-auto mt-3 max-w-[700px] text-gray-500 md:text-xl/relaxed">
            Track & split expenses with friends in just a few taps
          </p>

          <div className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-3">
            {STEPS.map(({ label, title, description }) => (
              <div key={label} className="flex flex-col items-center space-y-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-black text-xl font-bold text-white">
                  {label}
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-gray-500 text-center">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <Badge variant="outline" className="bg-gray-600 text-white py-2 px-4">
            Loved by Friends Like You
          </Badge>

          <h2 className="gradient-title mt-2 text-3xl md:text-4xl">
            Friends who tried, friends who loved
          </h2>

          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map(({ quote, name, image, role }) => (
              <Card key={image}>
                <CardContent className="space-y-4 p-4">
                  <p className="text-gray-600">{quote}</p>
                  
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={image} alt={name} />
                      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="text-left">
                      <p className="text-sm font-medium">{name}</p>
                      <p className="text-sm text-muted-foreground">{role}</p>
                    </div>

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-20 gradient">
          <div className="container mx-auto px-4 md:px-6 text-center space-y-6">
            <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl text-white">
              Simplify the way you share costs
            </h2>

            <p className="mx-auto max-w-[600px] text-gray-200 md:text-xl/relaxed">
              Stress-free expense sharing starts with our users — and you.
            </p>

            <Button asChild size="lg" className="bg-gray-600 text-white border-1 border-white hover:bg-black rounded-sm">
              <Link href="/dashboard">
                Get Started
                <ArrowRight className="ml-2 size-4"/>
              </Link>
            </Button>
          </div>
      </section>

      <footer className="border-t bg-gray-50 py-12 text-center text-sm text-muted-foreground">
            <p className="text-xl">Every visit counts, and we’re grateful for yours,</p><br/>
            Made by 😎 @Mohit_Bisht - m2079b@gmail.com 
      </footer>
    </div>
  );
}
