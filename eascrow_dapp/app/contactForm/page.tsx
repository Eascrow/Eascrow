'use client';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Card from '@/components/shared/Card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function ContactForm() {
  return (
    <div className="pt-[70px] pb-5 px-9">
      <Card>
        <div className="m-8 flex justify-center">
          <div className="flex justify-center items-center space-x-2">
            <Image
              src="/icons/arrow-swapp-green.png"
              alt="Escrow website"
              width="36"
              height="36"
              priority
            />
            <h2 className="text-2xl text-white font-bold">Contact form</h2>
          </div>
        </div>
        <div className=" flex flex-col items-center">
          <form
            action="https://public.herotofu.com/v1/b49571c0-f290-11ef-831c-f7fd4c94a18d"
            method="post"
            acceptCharset="UTF-8"
            className="w-[788px]"
          >
            <div className="mb-8">
              <div>
                <Label htmlFor="name" className="text-white text-sm">
                  Your Name
                </Label>
                <Input
                  placeholder="Name"
                  type="text"
                  id="name"
                  name="Name"
                  required
                  className="mt-2.5 py-[22px] px-[14px] border border-[#2c303d]"
                />
              </div>
            </div>
            <div className="mb-8">
              <Label htmlFor="email" className="text-white text-sm">
                Email address
              </Label>
              <Input
                placeholder="uihutofficial@gmail.com"
                type="email"
                id="email"
                name="Email"
                required
                className="mt-2.5 py-[22px] px-[14px] border border-[#2c303d]"
              />
            </div>
            <div className="mb-8">
              <Label htmlFor="message" className="text-white text-sm">
                You message
              </Label>
              <Textarea
                placeholder="Please enter you message"
                id="message"
                name="Message"
                required
                className="mt-2.5 py-[11px] px-[7px] border border-[#2c303d]"
              />
            </div>
            <div className="flex justify-center">
              <Button
                type="submit"
                className="mt-2.5 w-[182px] py-[6px] px-[12px] bg-mintGreen text-background text-sm font-bold"
              >
                Send
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
